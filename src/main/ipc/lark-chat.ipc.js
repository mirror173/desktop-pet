const { ipcMain } = require('electron');
const { fetchJson, getLarkApiUrl } = require('../services/lark/api');

/**
 * 注册飞书聊天相关 IPC
 * 输入: 无
 * 输出: 无，直接注册 IPC 处理器
 */
function registerLarkChatIpc() {
  ipcMain.handle('lark:execute-command', async (_event, payload = {}) => {
    try {
      const text = String(payload.text || '').trim();
      const chatId = String(payload.chatId || payload.chat_id || '').trim();
      if (!text) return { ok: false, error: '消息内容不能为空' };
      return await fetchJson(getLarkApiUrl('/api/lark/chat/send'), {
        method: 'POST',
        body: JSON.stringify({ text, chatId })
      });
    } catch (err) {
      return { ok: false, error: err.message || '发送消息失败' };
    }
  });

  ipcMain.handle('lark:chat-send', async (_event, payload = {}) => {
    try {
      return await fetchJson(getLarkApiUrl('/api/lark/chat/send'), { method: 'POST', body: JSON.stringify({ text: payload.text, chatId: payload.chatId }) });
    } catch (err) {
      return { ok: false, error: err.message || '发送飞书消息失败' };
    }
  });

  ipcMain.handle('lark:chat:list-messages', async (_event, payload = {}) => {
    try {
      const { chatId, limit = 10, startTime } = payload;
      const qs = new URLSearchParams();
      qs.set('container_id_type', 'chat');
      qs.set('container_id', chatId);
      qs.set('limit', limit);
      if (startTime) qs.set('start_time', startTime);
      const result = await fetchJson(getLarkApiUrl(`/api/lark/im/v1/messages?${qs.toString()}`));
      console.log('[飞书调试] lark:chat:list-messages 请求参数:', JSON.stringify({ chatId, limit, startTime }, null, 2));
      console.log('[飞书调试] lark:chat:list-messages 返回结果:', JSON.stringify(result, null, 2));
      return result;
    } catch (err) {
      console.error('[飞书调试] lark:chat:list-messages 失败:', err?.message || err);
      return { ok: false, error: err.message || '获取消息列表失败' };
    }
  });

  ipcMain.handle('lark:chat-latest', async (_event, payload = {}) => {
    try {
      const chatId = String(payload.chatId || '');
      const pageSize = Number(payload.pageSize || 20) || 20;
      const result = await fetchJson(getLarkApiUrl(`/api/lark/chat/latest?chatId=${encodeURIComponent(chatId)}&pageSize=${pageSize}`));
      console.log('[飞书调试] lark:chat-latest 请求参数:', JSON.stringify({ chatId, pageSize }, null, 2));
      console.log('[飞书调试] lark:chat-latest 返回结果:', JSON.stringify(result, null, 2));
      return result;
    } catch (err) {
      console.error('[飞书调试] lark:chat-latest 失败:', err?.message || err);
      return { ok: false, error: err.message || '获取最新飞书消息失败' };
    }
  });
}

module.exports = { registerLarkChatIpc };
