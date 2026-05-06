const { ipcMain } = require('electron');

function registerLarkWorkIpc({ fetchJson, getLarkApiUrl, larkBackendInstanceRef }) {
  ipcMain.handle('lark:work:get-high-priority-messages', async () => {
    try {
      return await fetchJson(getLarkApiUrl('/api/lark/work/arrival/high-priority-messages'));
    } catch (err) {
      return { ok: false, error: err.message || '获取高优消息失败' };
    }
  });

  ipcMain.handle('lark:work:generate-meeting-speech', async () => {
    try {
      return await fetchJson(getLarkApiUrl('/api/lark/work/arrival/generate-meeting-speech'), { method: 'POST' });
    } catch (err) {
      return { ok: false, error: err.message || '生成晨会发言稿失败' };
    }
  });

  ipcMain.handle('lark:work:get-daily-schedule', async () => {
    try {
      return await fetchJson(getLarkApiUrl('/api/lark/work/arrival/daily-schedule'));
    } catch (err) {
      return { ok: false, error: err.message || '获取当日日程失败' };
    }
  });

  ipcMain.handle('lark:work:fetch-briefing', async () => {
    try {
      const larkBackendInstance = larkBackendInstanceRef();
      if (!larkBackendInstance) return { ok: false, error: '后端服务未启动' };
      const briefingText = await larkBackendInstance.runBriefingSync();
      if (!briefingText) return { ok: false, error: '今日暂无到岗梳理消息（请确认已选择默认群聊）' };
      return { ok: true, data: { content: briefingText } };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });
}

module.exports = { registerLarkWorkIpc };
