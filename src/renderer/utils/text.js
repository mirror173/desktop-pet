(function () {
  function escapeHtml(raw = '') {
    return String(raw)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function sanitizeForKey(text) {
    return String(text || '').replace(/\s+/g, ' ').trim();
  }

  function splitKeywords(raw) {
    return String(raw || '')
      .split(/[，,、\s]+/)
      .map((x) => x.trim())
      .filter(Boolean)
      .slice(0, 12);
  }

  function tokenizeForMemory(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/[，。！？、,.!?\-_/\\()（）【】\[\]"'“”‘’:：;]/g, ' ')
      .split(/\s+/)
      .map((t) => t.trim())
      .filter((t) => t.length >= 2)
      .slice(0, 24);
  }

  function detectIntent(text) {
    const input = String(text || '');
    if (/提醒|闹钟|待办|几点|明天|后天|每天|下午|晚上|早上|上午|\d{1,2}[:：点]/.test(input)) return 'task';
    if (/怎么|如何|办法|建议|可以吗|要不要|该不该|怎么办/.test(input)) return 'advice';
    if (/难过|焦虑|害怕|委屈|烦|崩溃|压力|累|不开心|失眠/.test(input)) return 'emotion';
    if (/是什么|为什么|原理|区别|解释|科普/.test(input)) return 'qa';
    return 'chat';
  }

  function detectEmotion(text) {
    const input = String(text || '');
    if (/开心|高兴|幸福|激动|满足|顺利|太好了/.test(input)) return 'positive';
    if (/生气|愤怒|烦死|讨厌|气死/.test(input)) return 'angry';
    if (/难过|伤心|想哭|委屈|失落|低落/.test(input)) return 'sad';
    if (/焦虑|紧张|害怕|慌|压力|担心/.test(input)) return 'anxious';
    return 'neutral';
  }

  function extractNickname(text) {
    const input = String(text || '');
    const patterns = [
      /(?:以后)?叫我\s*([\u4e00-\u9fa5A-Za-z0-9]{1,8})/,
      /你可以叫我\s*([\u4e00-\u9fa5A-Za-z0-9]{1,8})/,
      /称呼我\s*([\u4e00-\u9fa5A-Za-z0-9]{1,8})/
    ];

    for (const p of patterns) {
      const m = input.match(p);
      if (m && m[1]) return m[1].trim();
    }
    return '';
  }

  function escapeBubblePanelText(raw = '') {
    return escapeHtml(raw).replace(/\n/g, '<br>');
  }

  function normalizePageText(raw = '') {
    return String(raw || '').replace(/\n{3,}/g, '\n\n').trim();
  }

  function normalizeTextLower(raw = '') {
    return String(raw || '').toLowerCase();
  }

  function clampText(raw = '', maxLength = 0) {
    const text = String(raw || '');
    if (!Number.isFinite(maxLength) || maxLength <= 0) return text;
    return text.slice(0, maxLength);
  }

  function buildTokenWeights(tokens) {
    const weights = {};
    (Array.isArray(tokens) ? tokens : []).forEach((t) => {
      weights[t] = (weights[t] || 0) + 1;
    });
    return weights;
  }

  function normalizeKnowledgeBase(records, tokenizeForMemoryInput) {
    if (!Array.isArray(records)) return [];

    return records
      .map((item) => {
        if (!item || typeof item !== 'object') return null;
        const question = clampText(sanitizeForKey(item.question), 80);
        const answer = clampText(sanitizeForKey(item.answer), 280);
        const keywords = Array.isArray(item.keywords)
          ? item.keywords.map((k) => sanitizeForKey(k)).filter(Boolean).slice(0, 12)
          : [];
        if (!question || !answer) return null;

        const combined = `${question} ${keywords.join(' ')}`.trim();
        const tokens = typeof tokenizeForMemoryInput === 'function' ? tokenizeForMemoryInput(combined) : [];
        return {
          id: String(item.id || `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`),
          question,
          answer,
          keywords,
          tokens,
          tokenWeights: buildTokenWeights(tokens),
          source: item.source === 'auto' ? 'auto' : 'manual',
          captureCount: Math.max(1, Number(item.captureCount) || 1),
          hitCount: Math.max(0, Number(item.hitCount) || 0),
          createdAt: Number(item.createdAt) || Date.now(),
          lastUsedAt: Number(item.lastUsedAt) || 0
        };
      })
      .filter(Boolean)
      .slice(-220);
  }

  function buildKnowledgeIndex(records) {
    const byToken = new Map();
    const byKeyword = new Map();
    const byQuestionPrefix = new Map();

    (Array.isArray(records) ? records : []).forEach((item, index) => {
      const tokens = Array.isArray(item.tokens) ? item.tokens : [];
      tokens.forEach((token) => {
        if (!token) return;
        if (!byToken.has(token)) byToken.set(token, new Set());
        byToken.get(token).add(index);
      });

      (item.keywords || []).forEach((keyword) => {
        const key = normalizeTextLower(keyword);
        if (!key) return;
        if (!byKeyword.has(key)) byKeyword.set(key, new Set());
        byKeyword.get(key).add(index);
      });

      const q = normalizeTextLower(item.question);
      for (let len = 1; len <= Math.min(12, q.length); len += 1) {
        const prefix = q.slice(0, len);
        if (!prefix) continue;
        if (!byQuestionPrefix.has(prefix)) byQuestionPrefix.set(prefix, new Set());
        byQuestionPrefix.get(prefix).add(index);
      }
    });

    return { byToken, byKeyword, byQuestionPrefix };
  }

  function scoreKnowledgeCandidate(item, lower, queryWeights, queryTokens) {
    const keywordHit = (item.keywords || []).some((k) => lower.includes(String(k).toLowerCase()));
    const questionHit = lower.includes(item.question.toLowerCase()) || item.question.toLowerCase().includes(lower);
    const querySet = new Set(queryTokens);
    const exactTokenHit = (item.tokens || []).filter((token) => querySet.has(token)).length;
    const tokenScore = exactTokenHit * 0.05;
    const semantic = 0;
    const score = semantic + tokenScore + (keywordHit ? 0.45 : 0) + (questionHit ? 0.35 : 0);
    return { keywordHit, questionHit, semantic, score };
  }

  function buildMemoryItem(userText, assistantText, meta = {}) {
    const combined = `${userText || ''} ${assistantText || ''}`.trim();
    const tokens = tokenizeForMemory(combined);
    return {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      userText: clampText(userText, 120),
      assistantText: clampText(assistantText, 140),
      tokens,
      tokenWeights: buildTokenWeights(tokens),
      emotion: meta.emotion || 'neutral',
      intent: meta.intent || 'chat',
      ts: Date.now()
    };
  }

  function trimMemoryList(items, max = 180) {
    return Array.isArray(items) ? items.slice(-max) : [];
  }

  function parseNaturalInput(text, parseTimeFromText) {
    const raw = String(text || '').trim();
    if (!raw) return null;

    const draft = {
      title: raw,
      repeat: 'none',
      time: null,
      weekDays: []
    };

    if (raw.includes('每天')) draft.repeat = 'daily';

    const weekMap = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 日: 0, 天: 0 };
    const weekHits = [...raw.matchAll(/周([一二三四五六日天])/g)]
      .map((m) => weekMap[m[1]])
      .filter((x) => Number.isInteger(x));
    if (raw.includes('每周') || weekHits.length > 0) {
      draft.repeat = 'weekly';
      draft.weekDays = [...new Set(weekHits)];
    }

    const parsed = typeof parseTimeFromText === 'function' ? parseTimeFromText(raw) : null;
    if (parsed) {
      const { hour, minute } = parsed;
      const now = new Date();
      const t = new Date();
      t.setSeconds(0, 0);
      t.setHours(hour, minute, 0, 0);
      if (draft.repeat === 'none' && t.getTime() <= now.getTime()) t.setDate(t.getDate() + 1);
      draft.time = t.getTime();
      draft.title = raw
        .replace(/每天|每周|周[一二三四五六日天]/g, '')
        .replace(/(上午|早上|下午|晚上|中午)?\s*([0-9一二两三四五六七八九十零〇]{1,3})\s*(?:(?:[:：]\s*([0-9一二两三四五六七八九十零〇]{1,3})\s*分?)|(?:[点时]\s*([0-9一二两三四五六七八九十零〇]{1,3})?\s*分?))?\s*(半|一刻|三刻)?/g, '')
        .trim();
    }

    if (!draft.title) draft.title = '未命名事项';
    if (!draft.time) {
      const fallback = new Date();
      fallback.setMinutes(fallback.getMinutes() + 10, 0, 0);
      draft.time = fallback.getTime();
    }

    return draft;
  }

  function normalizeRecentText(text) {
    return String(text || '').trim();
  }

  function matchTextAny(text, patterns) {
    const input = String(text || '');
    return (Array.isArray(patterns) ? patterns : []).some((pattern) => input.includes(pattern));
  }

  function hasTaskLikeText(text) {
    return /每天|明天|后天|早上|上午|中午|下午|晚上|\d{1,2}[:：点]/.test(String(text || '').trim());
  }

  function pickMatchingReply(text, matchers, replies) {
    const input = normalizeRecentText(text);
    if (!input) return null;
    const hit = (Array.isArray(matchers) ? matchers : []).find((item) => item.keys.some((k) => input.includes(k)));
    return hit ? replies(hit) : null;
  }

  function styleWrap(lines) {
    const clean = (Array.isArray(lines) ? lines : []).filter(Boolean).slice(0, 3);
    return clean.join(' ');
  }

  function avoidRepeat(reply, backup, recentReplies) {
    const recent = Array.isArray(recentReplies) ? recentReplies : [];
    if (!recent.includes(reply)) return reply;
    if (backup && !recent.includes(backup)) return backup;
    return `${String(reply || '').replace(/。$/, '')}，先按这个做。`;
  }

  function applyAddressingStyle(reply, nickname, randomValue) {
    const text = String(reply || '').trim();
    if (!text) return text;
    const cleanNickname = String(nickname || '').trim();
    if (cleanNickname && text.includes(cleanNickname)) return text;
    if (text.includes('笨蛋')) return text;
    const rand = Number.isFinite(randomValue) ? randomValue : Math.random();
    if (!cleanNickname) return rand < 0.5 ? `笨蛋，${text}` : text;
    if (rand < 0.6) return `${cleanNickname}，${text}`;
    if (rand < 0.8) return text;
    return `笨蛋，${text}`;
  }

  function shouldSuppressMemoryCapture(userText, assistantText, intent = 'chat') {
    const q = normalizeRecentText(userText);
    const a = normalizeRecentText(assistantText);
    if (intent === 'task' || /提醒模式|切到提醒模式/.test(a)) return true;
    if (/你是谁|在吗|晚安|早安|谢谢|爱你|喜欢你|想你/.test(q)) return true;
    if (/^笨蛋[，,]/.test(a)) return true;
    return false;
  }

  function isTimeRelatedInput(text) {
    return /时间|几点|明天|后天|上午|下午|晚上|早上|中午|周[一二三四五六日天]|每天|每周|倒计时|提醒/.test(String(text || ''));
  }

  function isGreetingOrThanks(text) {
    return /谢谢|多亏你|感谢|晚安|睡觉/.test(String(text || ''));
  }

  const api = {
    escapeHtml,
    sanitizeForKey,
    splitKeywords,
    tokenizeForMemory,
    detectIntent,
    detectEmotion,
    extractNickname,
    escapeBubblePanelText,
    normalizePageText,
    normalizeTextLower,
    clampText,
    buildTokenWeights,
    normalizeKnowledgeBase,
    buildKnowledgeIndex,
    scoreKnowledgeCandidate,
    buildMemoryItem,
    trimMemoryList,
    parseNaturalInput,
    normalizeRecentText,
    matchTextAny,
    hasTaskLikeText,
    pickMatchingReply,
    styleWrap,
    avoidRepeat,
    applyAddressingStyle,
    shouldSuppressMemoryCapture,
    isTimeRelatedInput,
    isGreetingOrThanks
  };

  window.RendererTextUtils = api;
  Object.assign(window, api);
})();