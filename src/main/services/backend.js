const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

require('dotenv').config();
const { loadLarkConfig } = require('../../shared/config/runtime.config');

function safeReadJson(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, 'utf8');
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeWriteJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf8');
}

function collectRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 2 * 1024 * 1024) {
        reject(new Error('请求体过大'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function createLarkBackendServer({ app, port = 3000, shell, onAuthChanged } = {}) {
  const statePath = path.join(app.getPath('userData'), 'lark-auth-state.json');
  const larkConfig = loadLarkConfig();
  const backendBaseUrl = larkConfig.backendBaseUrl || `http://127.0.0.1:${port}`;
  const oauthCallbackUrl = larkConfig.redirectUri || `${backendBaseUrl}/api/lark/oauth/callback`;
  const authorizeUrl = larkConfig.authorizeUrl || 'https://open.feishu.cn/open-apis/authen/v1/authorize';
  const feishuConfig = {
    appId: larkConfig.appId || '',
    appSecret: larkConfig.appSecret || '',
    clientId: larkConfig.clientId || '',
    clientSecret: larkConfig.clientSecret || '',
    chatId: larkConfig.chatId || ''
  };
  const state = safeReadJson(statePath, {
    loggedIn: false,
    user: null,
    accessToken: '',
    refreshToken: '',
    pendingState: '',
    pendingAuthUrl: '',
    updatedAt: '',
    codeVerifier: '',
    codeChallenge: '',
    todoItems: [],
    briefingSnapshot: null,
    lastPageContent: null,
    lastSelection: null,
    userConfig: {
      defaultChatId: '',
      bitableToken: '',
      briefingTableId: '',
      weeklyTableId: ''
    }
  });
  if (!state.userConfig) state.userConfig = { defaultChatId: '', bitableToken: '', briefingTableId: '', weeklyTableId: '' };

  // 消息中转WebSocket服务
  let wss = null;
  const clients = new Set();
  const messageHistory = [];
  const MAX_HISTORY_SIZE = 100;
  
  // 飞书SDK事件监听
  function registerLarkEventListeners() {
    // 监听飞书消息接收事件
    process.on('lark:event:im.message.receive_v1', (event) => {
      try {
        console.log('[飞书事件] SDK推送消息事件:', JSON.stringify(event, null, 2));
        
        const message = event?.message;
        const sender = event?.sender;
        
        // 过滤自己发送的消息
        if (sender?.sender_id?.open_id === state.user?.accountId) {
          return;
        }
        
        // 只处理指定群聊的消息
        const chatId = state.userConfig?.defaultChatId || feishuConfig.chatId;
        if (message?.chat_id !== chatId) {
          return;
        }
        
        let replyContent = '';
        if (message?.msg_type === 'text' && message?.content) {
          try {
            const content = JSON.parse(message.content);
            replyContent = content.text || '';
          } catch (e) {
            replyContent = message.content;
          }
        } else {
          replyContent = '[收到非文本类型消息]';
        }
        
        if (replyContent) {
          console.log('[飞书事件] 收到新回复:', replyContent);
          // 广播消息给前端
          broadcastMessage({
            type: 'lark_reply',
            data: {
              content: replyContent,
              timestamp: message.create_time,
              sender: sender?.sender_id?.open_id
            }
          });
        }
      } catch (err) {
        console.error('[飞书事件] 处理SDK推送事件失败:', err);
      }
    });
  }

  function broadcastMessage(message) {
    const messageStr = JSON.stringify(message);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }

  function normalizeText(value) {
    return String(value || '')
      .replace(/\u00a0/g, ' ')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  function createPageSummaryMessage(page) {
    const title = normalizeText(page?.title || '网页内容');
    const siteName = normalizeText(page?.siteName || '网页');
    const siteType = normalizeText(page?.siteType || 'generic');
    const url = normalizeText(page?.url || '');
    const preview = normalizeText(page?.preview || page?.textContent || '').slice(0, 320);
    const content = normalizeText(page?.textContent || page?.content || '');
    const selection = normalizeText(page?.selection || '');
    const selectionContext = normalizeText(page?.selectionContext || '');

    const lines = [
      `我已读取网页《${title}》`,
      `站点：${siteName} · 类型：${siteType}`
    ];

    if (url) lines.push(`链接：${url}`);
    if (selection) lines.push(`选中文本：${selection}`);
    if (selectionContext) lines.push(`选区上下文：${selectionContext.slice(0, 200)}`);
    if (content) lines.push(`正文预览：${content.slice(0, 400)}`);
    else if (preview) lines.push(`正文预览：${preview}`);

    return {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      from: 'web',
      role: 'assistant',
      content: lines.join('\n\n'),
      meta: {
        type: 'page-summary',
        page
      }
    };
  }

  function startWebSocketServer(server) {
    // 服务启动时注册事件监听器
    registerLarkEventListeners();
    wss = new WebSocket.Server({ server });
    wss.on('connection', (ws) => {
      clients.add(ws);

      // 发送历史消息给新连接
      ws.send(JSON.stringify({
        type: 'history',
        data: messageHistory
      }));

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          if (message.type === 'chat' && message.content) {
            const fullMessage = {
              id: crypto.randomUUID(),
              timestamp: Date.now(),
              from: message.from, // 'pet' 或 'web'
              content: message.content,
              role: message.role || 'user' // 'user' 或 'assistant'
            };
            
            // 保存历史
            messageHistory.push(fullMessage);
            if (messageHistory.length > MAX_HISTORY_SIZE) {
              messageHistory.shift();
            }

            // 广播给所有客户端
            broadcastMessage({
              type: 'message',
              data: fullMessage
            });
          }
        } catch (err) {
          console.error('WebSocket message parse error:', err);
        }
      });

      ws.on('close', () => {
        clients.delete(ws);
      });

      ws.on('error', (err) => {
        console.error('WebSocket error:', err);
        clients.delete(ws);
      });
    });
  }

  function persist() {
    state.updatedAt = new Date().toISOString();
    safeWriteJson(statePath, state);
    if (typeof onAuthChanged === 'function') onAuthChanged({ ...state });
  }

  function json(res, code, payload) {
    const body = JSON.stringify(payload);
    res.writeHead(code, {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(body)
    });
    res.end(body);
  }

  function text(res, code, body, contentType = 'text/html; charset=utf-8') {
    res.writeHead(code, { 'Content-Type': contentType });
    res.end(body);
  }

  function createMockLoginUrl() {
    const token = crypto.randomUUID();
    state.pendingState = token;
    state.pendingAuthUrl = `${backendBaseUrl}/api/lark/auth/mock?state=${encodeURIComponent(token)}`;
    persist();
    return state.pendingAuthUrl;
  }

  async function getTenantAccessToken() {
    if (!feishuConfig.appId || !feishuConfig.appSecret) {
      throw new Error('缺少 LARK_APP_ID 或 LARK_APP_SECRET');
    }

    const res = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_id: feishuConfig.appId,
        app_secret: feishuConfig.appSecret
      })
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || json?.code !== 0) {
      throw new Error(json?.msg || json?.message || `获取 tenant_access_token 失败(${res.status})`);
    }

    return json?.tenant_access_token || json?.data?.tenant_access_token || '';
  }

  async function sendFeishuChatMessage(text, targetChatId) {
    const chatId = targetChatId || state.userConfig?.defaultChatId || feishuConfig.chatId;
    if (!chatId) throw new Error('请先在设置中选择默认群聊');
    if (state.accessToken) {
      return sendUserChatMessage(chatId, text);
    }
    // 未登录时回退到 bot token（仅当 bot 在群内时有效）
    const token = await getTenantAccessToken();
    const res = await fetch('https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=chat_id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ receive_id: chatId, msg_type: 'text', content: JSON.stringify({ text }) })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data?.code !== 0) throw new Error(data?.msg || `发送消息失败(${res.status})`);
    return data?.data || {};
  }

  function createPkcePair() {
    const verifier = crypto.randomBytes(32).toString('base64url');
    const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
    state.codeVerifier = verifier;
    state.codeChallenge = challenge;
    return { verifier, challenge };
  }

  function createRealAuthUrl() {
    const clientId = feishuConfig.clientId || feishuConfig.appId || '';
    const redirectUri = oauthCallbackUrl;
    if (!clientId || !redirectUri) return '';

    const token = crypto.randomUUID();
    const { challenge } = createPkcePair();
    state.pendingState = token;
    const authorizeEndpoint = authorizeUrl;
    const url = new URL(authorizeEndpoint);
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('state', token);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', [
      'contact:user.base:readonly',
      'im:message',
      'im:chat:readonly',
      'calendar:calendar:readonly',
      'bitable:app:readonly'
    ].join(' '));
    url.searchParams.set('code_challenge', challenge);
    url.searchParams.set('code_challenge_method', 'S256');
    state.pendingAuthUrl = url.toString();
    persist();
    return state.pendingAuthUrl;
  }

  function getAuthUrl() {
    return createRealAuthUrl() || createMockLoginUrl();
  }

  async function exchangeCodeForToken(code) {
    const clientId = feishuConfig.clientId || feishuConfig.appId || '';
    const clientSecret = feishuConfig.clientSecret || feishuConfig.appSecret || '';
    const redirectUri = oauthCallbackUrl;
    if (!clientId || !clientSecret || !redirectUri) throw new Error('缺少飞书 OAuth 配置');

    const res = await fetch('https://open.feishu.cn/open-apis/authen/v1/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        app_id: clientId,
        app_secret: clientSecret,
        redirect_uri: redirectUri,
        code_verifier: state.codeVerifier || ''
      })
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || json?.code !== 0) {
      throw new Error(json?.msg || json?.message || `换取 token 失败(${res.status})`);
    }
    return json?.data || {};
  }

  async function fetchFeishuUserInfo(accessToken) {
    const res = await fetch('https://open.feishu.cn/open-apis/authen/v1/user_info', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json?.code !== 0) throw new Error(json?.msg || json?.message || `获取用户信息失败(${res.status})`);
    return json?.data || {};
  }

  // ---- 用户 token REST API 调用 ----
  async function callLarkUserApi(endpoint, options = {}) {
    if (!state.accessToken) throw new Error('未登录飞书，请先完成 OAuth 授权');
    const res = await fetch(`https://open.feishu.cn/open-apis${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.accessToken}`,
        ...(options.headers || {})
      }
    });
    const data = await res.json().catch(() => ({}));
    if (data.code !== undefined && data.code !== 0) {
      throw new Error(data.msg || data.message || `飞书 API 错误(code=${data.code})`);
    }
    return data;
  }

  async function listUserChats(pageSize = 50) {
    const data = await callLarkUserApi(`/im/v1/chats?page_size=${pageSize}`);
    return data.data?.items || [];
  }

  async function fetchChatMessages(chatId, pageSize = 20) {
    const data = await callLarkUserApi(
      `/im/v1/messages?container_id_type=chat&container_id=${encodeURIComponent(chatId)}&page_size=${pageSize}&sort_type=ByCreateTimeDesc`
    );
    return data.data?.items || [];
  }

  function parseMessageContent(message = {}) {
    let contentText = '';
    try {
      const bodyContent = message?.body?.content || message?.content || '{}';
      const parsed = typeof bodyContent === 'string' ? JSON.parse(bodyContent) : bodyContent;
      contentText = String(parsed?.text || parsed?.content || '').trim();
    } catch {
      contentText = String(message?.body?.content || message?.content || '').trim();
    }
    return contentText;
  }

  function normalizeChatMessage(message = {}) {
    return {
      message_id: message?.message_id || '',
      chat_id: message?.chat_id || '',
      create_time: message?.create_time || '',
      update_time: message?.update_time || '',
      msg_type: message?.msg_type || '',
      sender: message?.sender || {},
      body: message?.body || {},
      text: parseMessageContent(message),
      raw: message
    };
  }

  function isBotMessage(message = {}) {
    const senderType = String(message?.sender?.sender_type || '').toLowerCase();
    const msgType = String(message?.msg_type || '').toLowerCase();
    const text = parseMessageContent(message);
    return senderType === 'bot' || msgType === 'post' || /机器人|bot|reply/i.test(text);
  }

  async function sendUserChatMessage(chatId, text) {
    const data = await callLarkUserApi('/im/v1/messages?receive_id_type=chat_id', {
      method: 'POST',
      body: JSON.stringify({ receive_id: chatId, msg_type: 'text', content: JSON.stringify({ text }) })
    });
    return data.data || {};
  }

  async function getTodayCalendarEvents() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
    const calData = await callLarkUserApi('/calendar/v4/calendars?page_size=50');
    const calendars = calData.data?.calendar_list || [];
    const primary = calendars.find(c => c.role === 'owner') || calendars[0];
    if (!primary) return [];
    const eventsData = await callLarkUserApi(
      `/calendar/v4/calendars/${primary.calendar_id}/events?start_time=${Math.floor(startOfDay.getTime() / 1000)}&end_time=${Math.floor(endOfDay.getTime() / 1000)}&page_size=50`
    );
    return eventsData.data?.items || [];
  }

  async function getUserTasks() {
    throw new Error('当前版本已移除飞书任务列表接口；如需使用请在飞书开放平台重新配置任务相关权限。');
  }

  async function readBitableRecords(appToken, tableId) {
    const data = await callLarkUserApi(`/bitable/v1/apps/${appToken}/tables/${tableId}/records?page_size=20`);
    return data.data?.items || [];
  }
  // ---- REST API 辅助结束 ----

  async function finalizeLoginFromCode(code) {
    const tokenData = await exchangeCodeForToken(code);
    const accessToken = tokenData.access_token || tokenData.accessToken || '';
    if (!accessToken) throw new Error('未获取到 access_token');
    const userInfo = await fetchFeishuUserInfo(accessToken).catch(() => ({}));
    state.loggedIn = true;
    state.user = {
      userName: userInfo?.name || userInfo?.nickname || userInfo?.email || '飞书用户',
      accountId: userInfo?.open_id || userInfo?.union_id || userInfo?.user_id || 'unknown',
      source: 'oauth'
    };
    state.accessToken = accessToken;
    state.refreshToken = tokenData.refresh_token || '';
    state.pendingState = '';
    state.pendingAuthUrl = '';
    state.codeVerifier = '';
    state.codeChallenge = '';
    persist();
    // 登录成功后注册事件监听器
    registerLarkEventListeners();
  }

  function finalizeMockLogin({ userName, accountId, source = 'mock' }) {
    state.loggedIn = true;
    state.user = { userName, accountId, source };
    state.accessToken = crypto.randomUUID();
    state.refreshToken = crypto.randomUUID();
    state.pendingState = '';
    state.pendingAuthUrl = '';
    persist();
    // 登录成功后注册事件监听器
    registerLarkEventListeners();
  }

  function normalizeTodoItem(item = {}) {
    return {
      id: String(item.id || crypto.randomUUID()),
      title: String(item.title || item.name || '').trim(),
      content: String(item.content || '').trim(),
      status: String(item.status || 'todo'),
      created_at: item.created_at || new Date().toISOString(),
      due_time: item.due_time || '',
      source: item.source || 'manual'
    };
  }

  function getTodoItems() {
    if (!Array.isArray(state.todoItems)) state.todoItems = [];
    return state.todoItems;
  }

  function saveTodoItems(items) {
    state.todoItems = Array.isArray(items) ? items.map(normalizeTodoItem) : [];
    persist();
  }

  function normalizeBriefingCard(raw = '') {
    let text = String(raw || '');

    text = text.replace(/<\/?(card|div|p|section|article|header|footer|main|aside|ul|ol|li|br)[^>]*>/gi, '\n');
    text = text.replace(/<[^>]+>/g, '');
    text = text
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"');

    text = text.replace(/🦞/g, '');
    text = text.replace(/([1-9])️⃣/g, '$1.');
    text = text.replace(/^[-_=*\s]{3,}$/gm, '');
    text = text.replace(/\*{3,}/g, '**');
    text = text.replace(/】\s*(?=[一二三四五六七八九十]+、)/g, '】\n\n');
    text = text.replace(/\n?([一二三四五六七八九十]+、)\s*([^\n]+)?/g, (_, chapter, title = '') => {
      const body = title.trim();
      return body ? `\n\n${chapter}${body}` : `\n\n${chapter}`;
    });
    text = text.replace(/(?<!\n)(\d+\.)/g, '\n$1');
    text = text.replace(/(?<!\n)([-·] )/g, '\n$1');
    text = text.replace(/(?<!\n)(> )/g, '\n$1');
    text = text.replace(/(\n\d+\.)(?=\S)/g, '$1\n');
    text = text
      .split('\n')
      .map((line) => line.replace(/[ \t\f\v]+/g, ' ').trim())
      .filter((line, idx, arr) => line !== '' || (arr[idx - 1] !== '' && arr[idx + 1] !== ''))
      .join('\n');
    text = text.replace(/\n{3,}/g, '\n\n');
    text = text.replace(/[ \t]+$/gm, '');
    return text.trim();
  }

  async function fetchLatestBriefingFromLark() {
    const chatId = state.userConfig?.defaultChatId || '';
    if (!chatId || !state.accessToken) return null;
    const messages = await fetchChatMessages(chatId, 20);
    const today = new Date().toDateString();
    const latestBriefing = messages.find(item => {
      let text = '';
      try { const b = JSON.parse(item.body?.content || '{}'); text = b.text || b.content || ''; }
      catch { text = item.body?.content || ''; }
      const createDate = new Date(Number(item.create_time)).toDateString();
      return createDate === today && (
        text.includes('到岗梳理') || text.includes('晨会发言稿') || text.includes('今日日程')
      );
    });
    if (!latestBriefing) return null;
    let rawText = '';
    try { const b = JSON.parse(latestBriefing.body?.content || '{}'); rawText = b.text || b.content || ''; }
    catch { rawText = latestBriefing.body?.content || ''; }
    return {
      raw: rawText,
      cleanText: normalizeBriefingCard(rawText),
      createTime: latestBriefing.create_time
    };
  }

  async function runBriefingSync() {
    const briefing = await fetchLatestBriefingFromLark();
    if (!briefing?.cleanText) return null;
    state.briefingSnapshot = {
      content: briefing.cleanText,
      createTime: briefing.createTime,
      updatedAt: new Date().toISOString()
    };
    persist();
    broadcastMessage({
      type: 'briefing-update',
      data: briefing.cleanText
    });
    return briefing.cleanText;
  }

  function getNextNineAM() {
    const now = new Date();
    const next = new Date(now);
    next.setHours(9, 0, 0, 0);
    if (now >= next) next.setDate(next.getDate() + 1);
    return next;
  }

  function startBriefingScheduler() {
    const scheduleNext = () => {
      const delay = getNextNineAM().getTime() - Date.now();
      setTimeout(async () => {
        try {
          await runBriefingSync();
        } catch (err) {
          console.error('[briefing] 定时同步失败:', err?.message || err);
        } finally {
          scheduleNext();
        }
      }, Math.max(1000, delay));
    };

    void runBriefingSync().catch((err) => {
      console.error('[briefing] 启动同步失败:', err?.message || err);
    });
    scheduleNext();
  }

  async function readJsonBody(req) {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString('utf8');
    try {
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  const server = http.createServer(async (req, res) => {
    if (req.url === '/web') {
      const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>桌宠聊天界面</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .chat-container {
      width: 100%;
      max-width: 800px;
      height: 80vh;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .chat-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      text-align: center;
      font-size: 20px;
      font-weight: 600;
    }
    .chat-messages {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      background: #f8f9fa;
    }
    .message {
      margin-bottom: 16px;
      max-width: 75%;
      display: flex;
      flex-direction: column;
    }
    .message.user {
      margin-left: auto;
      align-items: flex-end;
    }
    .message.assistant {
      margin-right: auto;
      align-items: flex-start;
    }
    .message-bubble {
      padding: 12px 16px;
      border-radius: 18px;
      line-height: 1.5;
      word-wrap: break-word;
    }
    .message.user .message-bubble {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-bottom-right-radius: 4px;
    }
    .message.assistant .message-bubble {
      background: white;
      color: #333;
      border-bottom-left-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .message-time {
      font-size: 12px;
      color: #999;
      margin-top: 4px;
      padding: 0 8px;
    }
    .chat-input-area {
      padding: 20px;
      background: white;
      border-top: 1px solid #eee;
      display: flex;
      gap: 12px;
    }
    #message-input {
      flex: 1;
      padding: 12px 16px;
      border: 2px solid #e9ecef;
      border-radius: 24px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.3s;
    }
    #message-input:focus {
      border-color: #667eea;
    }
    #send-btn {
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 24px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: transform 0.2s;
    }
    #send-btn:hover {
      transform: translateY(-2px);
    }
    #send-btn:active {
      transform: translateY(0);
    }
    .status {
      padding: 8px 20px;
      background: #e3f2fd;
      color: #1976d2;
      font-size: 12px;
      text-align: center;
    }
    .status.connected {
      background: #e8f5e9;
      color: #388e3c;
    }
    .status.disconnected {
      background: #ffebee;
      color: #d32f2f;
    }
  </style>
</head>
<body>
  <div class="chat-container">
    <div class="chat-header">李泽言桌宠聊天界面</div>
    <div id="status" class="status disconnected">正在连接到桌宠...</div>
    <div class="chat-messages" id="chat-messages"></div>
    <div class="chat-input-area">
      <input type="text" id="message-input" placeholder="输入消息发送给桌宠..." autocomplete="off">
      <button id="send-btn">发送</button>
    </div>
  </div>

  <script>
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(wsProtocol + '//' + window.location.host);
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const statusEl = document.getElementById('status');

    function formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }

    function addMessage(message) {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message ' + message.role;
      
      const bubble = document.createElement('div');
      bubble.className = 'message-bubble';
      bubble.textContent = message.content;
      
      const time = document.createElement('div');
      time.className = 'message-time';
      time.textContent = formatTimestamp(message.timestamp);
      
      messageDiv.appendChild(bubble);
      messageDiv.appendChild(time);
      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    ws.onopen = () => {
      statusEl.textContent = '已连接到桌宠';
      statusEl.className = 'status connected';
    };

    ws.onclose = () => {
      statusEl.textContent = '与桌宠断开连接，正在重连...';
      statusEl.className = 'status disconnected';
      setTimeout(() => window.location.reload(), 3000);
    };

    ws.onerror = () => {
      statusEl.textContent = '连接错误';
      statusEl.className = 'status disconnected';
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'history') {
        chatMessages.innerHTML = '';
        data.data.forEach(msg => addMessage(msg));
      } else if (data.type === 'message') {
        addMessage(data.data);
      }
    };

    function sendMessage() {
      const content = messageInput.value.trim();
      if (!content) return;
      
      ws.send(JSON.stringify({
        type: 'chat',
        from: 'web',
        content: content,
        role: 'user'
      }));
      
      messageInput.value = '';
    }

    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  </script>
</body>
</html>
      `;
      return text(res, 200, html, 'text/html; charset=utf-8');
    }
    try {
      const url = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);

      if (req.method === 'GET' && url.pathname === '/api/lark/auth/status') {
        json(res, 200, {
          ok: true,
          logged_in: Boolean(state.loggedIn),
          user_name: state.user?.userName || '',
          account_id: state.user?.accountId || '',
          source: state.user?.source || '',
          updated_at: state.updatedAt || '',
          auth_url: state.pendingAuthUrl || ''
        });
        return;
      }

      if (req.method === 'POST' && url.pathname === '/api/lark/auth/start') {
        const authUrl = getAuthUrl();
        json(res, 200, {
          ok: true,
          auth_url: authUrl,
          mode: authUrl.includes('open.feishu.cn') ? 'oauth' : 'mock'
        });
        return;
      }

      if (req.method === 'POST' && url.pathname === '/api/lark/auth/logout') {
        state.loggedIn = false;
        state.user = null;
        state.accessToken = '';
        state.refreshToken = '';
        state.pendingState = '';
        state.pendingAuthUrl = '';
        state.codeVerifier = '';
        state.codeChallenge = '';
        persist();
        json(res, 200, { ok: true });
        return;
      }

      if (req.method === 'POST' && url.pathname === '/api/lark/auth/switch') {
        state.loggedIn = false;
        state.user = null;
        state.accessToken = '';
        state.refreshToken = '';
        state.pendingState = '';
        state.pendingAuthUrl = '';
        state.codeVerifier = '';
        state.codeChallenge = '';
        persist();
        json(res, 200, { ok: true, auth_url: getAuthUrl() });
        return;
      }

      if (req.method === 'GET' && url.pathname === '/api/lark/test/me') {
        json(res, 200, {
          ok: true,
          logged_in: Boolean(state.loggedIn),
          message: state.loggedIn ? `当前账号：${state.user?.userName || '已认证用户'}` : '当前未登录'
        });
        return;
      }

      // 获取用户群聊列表
      if (req.method === 'GET' && url.pathname === '/api/lark/user/chats') {
        try {
          const chats = await listUserChats();
          json(res, 200, { ok: true, data: { items: chats } });
        } catch (err) {
          json(res, 500, { ok: false, error: err?.message || '获取群聊列表失败' });
        }
        return;
      }

      // 页面内容接收（来自浏览器扩展）
      if (req.method === 'POST' && url.pathname === '/api/page-content') {
        const body = await readJsonBody(req);
        const normalized = {
          url: String(body.url || '').trim(),
          origin: String(body.origin || '').trim(),
          title: String(body.title || '').trim(),
          siteName: String(body.siteName || '').trim(),
          siteType: String(body.siteType || '').trim(),
          content: String(body.content || '').trim(),
          textContent: String(body.textContent || '').trim(),
          preview: String(body.preview || '').trim(),
          selection: String(body.selection || '').trim(),
          selectionContext: String(body.selectionContext || '').trim(),
          source: String(body.source || 'unknown').trim(),
          length: Number(body.length || 0),
          timestamp: Number(body.timestamp || Date.now())
        };

        state.lastPageContent = normalized;
        const summaryMessage = createPageSummaryMessage(normalized);
        messageHistory.push(summaryMessage);
        if (messageHistory.length > MAX_HISTORY_SIZE) messageHistory.shift();
        broadcastMessage({ type: 'message', data: summaryMessage });
        persist();
        json(res, 200, { ok: true, data: normalized, message: summaryMessage });
        return;
      }

      if (req.method === 'POST' && url.pathname === '/api/selection') {
        const body = await readJsonBody(req);
        const normalized = {
          url: String(body.url || '').trim(),
          text: String(body.text || '').trim(),
          context: String(body.context || '').trim(),
          preview: String(body.preview || '').trim(),
          timestamp: Number(body.timestamp || Date.now())
        };
        state.lastSelection = normalized;
        persist();
        json(res, 200, { ok: true, data: normalized });
        return;
      }

      // 读取/保存用户配置
      if (req.method === 'GET' && url.pathname === '/api/lark/config') {
        json(res, 200, { ok: true, data: state.userConfig });
        return;
      }

      if (req.method === 'POST' && url.pathname === '/api/lark/config') {
        const body = await readJsonBody(req);
        state.userConfig = {
          defaultChatId: String(body.defaultChatId || '').trim(),
          bitableToken: String(body.bitableToken || '').trim(),
          briefingTableId: String(body.briefingTableId || '').trim(),
          weeklyTableId: String(body.weeklyTableId || '').trim()
        };
        persist();
        json(res, 200, { ok: true, data: state.userConfig });
        return;
      }

      // 今日日历（真实数据）
      if (req.method === 'GET' && url.pathname === '/api/lark/calendar/today') {
        try {
          const events = await getTodayCalendarEvents();
          json(res, 200, { ok: true, data: { items: events } });
        } catch (err) {
          json(res, 500, { ok: false, error: err?.message || '获取日程失败' });
        }
        return;
      }

      // 用户待办（真实数据）
      if (req.method === 'GET' && url.pathname === '/api/lark/tasks') {
        try {
          const tasks = await getUserTasks();
          json(res, 200, { ok: true, data: { items: tasks } });
        } catch (err) {
          json(res, 500, { ok: false, error: err?.message || '获取待办失败' });
        }
        return;
      }

      // 多维表格 - 到岗梳理
      if (req.method === 'GET' && url.pathname === '/api/lark/briefing/table') {
        const appToken = url.searchParams.get('appToken') || state.userConfig?.bitableToken || '';
        const tableId = url.searchParams.get('tableId') || state.userConfig?.briefingTableId || '';
        if (!appToken || !tableId) {
          json(res, 400, { ok: false, error: '请先在设置中配置多维表格 App Token 和到岗梳理表格 ID' });
          return;
        }
        try {
          const records = await readBitableRecords(appToken, tableId);
          json(res, 200, { ok: true, data: { items: records } });
        } catch (err) {
          json(res, 500, { ok: false, error: err?.message || '读取到岗梳理表格失败' });
        }
        return;
      }

      // 多维表格 - 周报
      if (req.method === 'GET' && url.pathname === '/api/lark/weekly/table') {
        const appToken = url.searchParams.get('appToken') || state.userConfig?.bitableToken || '';
        const tableId = url.searchParams.get('tableId') || state.userConfig?.weeklyTableId || '';
        if (!appToken || !tableId) {
          json(res, 400, { ok: false, error: '请先在设置中配置多维表格 App Token 和周报表格 ID' });
          return;
        }
        try {
          const records = await readBitableRecords(appToken, tableId);
          json(res, 200, { ok: true, data: { items: records } });
        } catch (err) {
          json(res, 500, { ok: false, error: err?.message || '读取周报表格失败' });
        }
        return;
      }

      if (req.method === 'POST' && url.pathname === '/api/lark/chat/send') {
        const body = await readJsonBody(req);
        const text = String(body.text || '').trim();
        const chatId = String(body.chatId || feishuConfig.chatId || '').trim();
        if (!text) {
          json(res, 400, { ok: false, error: 'text 不能为空' });
          return;
        }
        if (!chatId) {
          json(res, 400, { ok: false, error: 'chatId 不能为空' });
          return;
        }
        try {
          const data = await sendFeishuChatMessage(text, chatId);
          json(res, 200, { ok: true, data, chat_id: chatId });
        } catch (err) {
          json(res, 500, { ok: false, error: err?.message || '发送消息失败' });
        }
        return;
      }

      if (req.method === 'GET' && url.pathname === '/api/lark/im/v1/messages') {
        const chatId = String(url.searchParams.get('container_id') || url.searchParams.get('chatId') || feishuConfig.chatId || '').trim();
        const pageSize = Math.max(1, Number(url.searchParams.get('page_size') || url.searchParams.get('limit') || 20) || 20);
        try {
          const items = chatId ? await fetchChatMessages(chatId, pageSize) : [];
          const normalizedItems = items.map(normalizeChatMessage);
          console.log('[飞书调试] /api/lark/im/v1/messages 请求参数:', JSON.stringify({ chatId, pageSize }, null, 2));
          console.log('[飞书调试] /api/lark/im/v1/messages 返回条数:', normalizedItems.length);
          console.log('[飞书调试] /api/lark/im/v1/messages 返回内容:', JSON.stringify(normalizedItems.slice(0, 3), null, 2));
          json(res, 200, { ok: true, data: { items: normalizedItems }, chat_id: chatId });
        } catch (err) {
          console.error('[飞书调试] /api/lark/im/v1/messages 失败:', err?.message || err);
          json(res, 500, { ok: false, error: err?.message || '获取消息列表失败' });
        }
        return;
      }

      if (req.method === 'GET' && url.pathname === '/api/lark/chat/latest') {
        const chatId = String(url.searchParams.get('chatId') || feishuConfig.chatId || '').trim();
        const pageSize = Math.max(1, Number(url.searchParams.get('pageSize') || 20) || 20);
        try {
          const items = chatId ? await fetchChatMessages(chatId, pageSize) : [];
          const normalizedItems = items.map(normalizeChatMessage);
          const latest = normalizedItems[0] || null;
          const botLatest = normalizedItems.find(isBotMessage) || latest;
          console.log('[飞书调试] /api/lark/chat/latest 请求参数:', JSON.stringify({ chatId, pageSize }, null, 2));
          console.log('[飞书调试] /api/lark/chat/latest 返回总数:', normalizedItems.length);
          console.log('[飞书调试] /api/lark/chat/latest 最新消息:', JSON.stringify(latest, null, 2));
          console.log('[飞书调试] /api/lark/chat/latest 机器人候选:', JSON.stringify(botLatest, null, 2));
          json(res, 200, {
            ok: true,
            data: {
              items: normalizedItems,
              latest,
              bot_latest: botLatest
            },
            chat_id: chatId
          });
        } catch (err) {
          console.error('[飞书调试] /api/lark/chat/latest 失败:', err?.message || err);
          json(res, 500, { ok: false, error: err?.message || '获取最新飞书消息失败' });
        }
        return;
      }

      if (req.method === 'GET' && url.pathname === '/api/lark/todo/list') {
        const status = String(url.searchParams.get('status') || 'all');
        const keyword = String(url.searchParams.get('keyword') || '').trim().toLowerCase();
        const items = getTodoItems().filter((item) => {
          if (status !== 'all' && item.status !== status) return false;
          if (keyword && !`${item.title} ${item.content}`.toLowerCase().includes(keyword)) return false;
          return true;
        });
        json(res, 200, { ok: true, data: { items } });
        return;
      }

      if (req.method === 'POST' && url.pathname === '/api/lark/todo/create') {
        const body = await readJsonBody(req);
        const title = String(body.title || body.content || '').trim();
        if (!title) {
          json(res, 400, { ok: false, error: 'title 不能为空' });
          return;
        }
        const item = normalizeTodoItem({
          title,
          content: String(body.content || '').trim(),
          due_time: String(body.due_time || '').trim(),
          status: 'todo',
          source: 'manual'
        });
        const items = getTodoItems();
        items.unshift(item);
        saveTodoItems(items);
        json(res, 200, { ok: true, data: { item } });
        return;
      }

      // ====================== 到岗一键梳理 相关接口 ======================
      // 1. 高优消息（真实数据：读取默认群聊最近消息，过滤含@、待办、P0等关键词）
      if (req.method === 'GET' && url.pathname === '/api/lark/work/arrival/high-priority-messages') {
        const chatId = state.userConfig?.defaultChatId || '';
        if (!chatId || !state.accessToken) {
          json(res, 200, { ok: true, data: { high_priority: [], other_count: 0, total_count: 0, hint: '请先登录飞书并在设置中选择默认群聊' } });
          return;
        }
        try {
          const messages = await fetchChatMessages(chatId, 50);
          const today = new Date().toDateString();
          const todayMsgs = messages.filter(m => new Date(Number(m.create_time)).toDateString() === today);
          const highKeywords = ['@', '待办', 'P0', 'P1', '紧急', '故障', '请确认', '需要你'];
          const highPriority = todayMsgs
            .filter(m => {
              let t = '';
              try { t = JSON.parse(m.body?.content || '{}').text || ''; } catch { t = m.body?.content || ''; }
              return highKeywords.some(k => t.includes(k));
            })
            .slice(0, 10)
            .map(m => {
              let t = '';
              try { t = JSON.parse(m.body?.content || '{}').text || ''; } catch { t = m.body?.content || ''; }
              return {
                id: m.message_id,
                type: t.includes('@') ? 'mention' : 'todo',
                title: t.slice(0, 40),
                content: t,
                sender: m.sender?.id || '',
                time: new Date(Number(m.create_time)).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
                priority: t.includes('P0') || t.includes('故障') ? 'P0' : 'P1'
              };
            });
          json(res, 200, { ok: true, data: { high_priority: highPriority, other_count: todayMsgs.length - highPriority.length, total_count: todayMsgs.length } });
        } catch (err) {
          json(res, 500, { ok: false, error: err?.message || '获取消息失败' });
        }
        return;
      }

      // 2. 生成晨会发言稿（基于真实日历+待办）
      if (req.method === 'POST' && url.pathname === '/api/lark/work/arrival/generate-meeting-speech') {
        let calendarText = '暂无日程';
        let tasksText = '暂无待办';
        try {
          const events = await getTodayCalendarEvents();
          if (events.length > 0) {
            calendarText = events.map(e => {
              const start = e.start_time?.timestamp ? new Date(Number(e.start_time.timestamp) * 1000).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) : '';
              return `${start} ${e.summary || ''}`;
            }).join('、');
          }
        } catch {}
        try {
          const tasks = await getUserTasks();
          if (tasks.length > 0) {
            tasksText = tasks.slice(0, 5).map((t, i) => `${i + 1}. ${t.summary || t.title || ''}`).join('\n');
          }
        } catch {}
        const speech = `各位早上好！今日汇报：\n\n【今日日程】\n${calendarText}\n\n【当前待办】\n${tasksText}\n\n以上是我的汇报，谢谢大家！`;
        json(res, 200, { ok: true, data: { speech } });
        return;
      }

      // 3. 当日日程及冲突检测（真实日历数据）
      if (req.method === 'GET' && url.pathname === '/api/lark/work/arrival/daily-schedule') {
        if (!state.accessToken) {
          json(res, 200, { ok: true, data: { schedules: [], conflicts: [], total_meetings: 0, hint: '请先登录飞书' } });
          return;
        }
        try {
          const events = await getTodayCalendarEvents();
          const schedules = events.map(e => ({
            id: e.event_id,
            title: e.summary || '未命名会议',
            start_time: e.start_time?.timestamp ? new Date(Number(e.start_time.timestamp) * 1000).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) : '',
            end_time: e.end_time?.timestamp ? new Date(Number(e.end_time.timestamp) * 1000).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) : '',
            location: e.location?.name || '',
            organizer: e.organizer?.display_name || '',
            attendees: (e.attendees || []).map(a => a.display_name || a.email || '').filter(Boolean)
          }));
          // 简单冲突检测
          const conflicts = [];
          for (let i = 0; i < schedules.length; i++) {
            for (let j = i + 1; j < schedules.length; j++) {
              if (schedules[i].end_time > schedules[j].start_time && schedules[i].start_time < schedules[j].end_time) {
                conflicts.push({ type: 'time_conflict', events: [schedules[i].id, schedules[j].id], description: `${schedules[i].title} 和 ${schedules[j].title} 时间重叠` });
              }
            }
          }
          json(res, 200, { ok: true, data: { schedules, conflicts, total_meetings: schedules.length } });
        } catch (err) {
          json(res, 500, { ok: false, error: err?.message || '获取日程失败' });
        }
        return;
      }
      // ====================== 到岗一键梳理 相关接口结束 ======================

      if (req.method === 'GET' && url.pathname === '/api/lark/oauth/callback') {
        const code = url.searchParams.get('code') || '';
        const incomingState = url.searchParams.get('state') || '';
        if (!code) {
          text(res, 400, '<h1>登录失败</h1><p>缺少 code。</p>');
          return;
        }
        if (state.pendingState && incomingState && incomingState !== state.pendingState) {
          text(res, 400, '<h1>登录失败</h1><p>state 校验失败。</p>');
          return;
        }
        try {
          await finalizeLoginFromCode(code);
          text(res, 200, '<h1>登录成功</h1><p>你可以返回桌宠继续使用。</p>');
        } catch (err) {
          text(res, 500, `<h1>登录失败</h1><p>${String(err?.message || 'OAuth 换取失败')}</p>`);
        }
        return;
      }

      if (req.method === 'GET' && url.pathname === '/api/lark/auth/mock') {
        const incomingState = url.searchParams.get('state') || '';
        if (state.pendingState && incomingState && incomingState !== state.pendingState) {
          text(res, 400, '<h1>登录失败</h1><p>state 校验失败。</p>');
          return;
        }

        finalizeMockLogin({
          userName: '示例飞书账号',
          accountId: 'mock_account',
          source: 'mock'
        });
        text(res, 200, '<h1>模拟登录成功</h1><p>返回桌宠即可看到登录状态。</p>');
        return;
      }

      text(res, 404, '<h1>Not Found</h1>', 'text/html; charset=utf-8');
    } catch (err) {
      json(res, 500, { ok: false, error: err?.message || 'server error' });
    }
  });

  return {
    port,
    start() {
      return new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(port, '127.0.0.1', () => {
          // 启动WebSocket服务
          startWebSocketServer(server);
          resolve({ port });
        });
      });
    },
    stop() {
      return new Promise((resolve) => {
        if (wss) {
          wss.close();
        }
        server.close(() => resolve());
      });
    },
    // 暴露广播消息方法给主进程
    broadcastMessage,
    runBriefingSync,
    startBriefingScheduler
  };
}

module.exports = { createLarkBackendServer };
