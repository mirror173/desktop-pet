const { ipcMain } = require('electron');
const {
  fetchJson,
  getLarkLoginStatusFromBackend,
  startLarkLoginFromBackend,
  logoutLarkFromBackend,
  switchLarkAccountFromBackend,
  testLarkAccessFromBackend,
  getLarkConfigFromBackend,
  saveLarkConfigToBackend,
  listUserChatsFromBackend
} = require('../services/lark/api');

/**
 * 注册飞书认证相关 IPC
 * 输入: 无
 * 输出: 无，直接向 Electron ipcMain 注册处理器
 */
function registerLarkAuthIpc() {
  ipcMain.handle('lark:status', async () => {
    try {
      return await getLarkLoginStatusFromBackend();
    } catch (err) {
      return { ok: false, logged_in: false, error: err.message || '获取登录状态失败' };
    }
  });

  ipcMain.handle('lark:start-login', async () => {
    try {
      return await startLarkLoginFromBackend();
    } catch (err) {
      return { ok: false, error: err.message || '启动登录失败' };
    }
  });

  ipcMain.handle('lark:logout', async () => {
    try {
      return await logoutLarkFromBackend();
    } catch (err) {
      return { ok: false, error: err.message || '退出登录失败' };
    }
  });

  ipcMain.handle('lark:switch-account', async () => {
    try {
      return await switchLarkAccountFromBackend();
    } catch (err) {
      return { ok: false, error: err.message || '切换账号失败' };
    }
  });

  ipcMain.handle('lark:test-access', async () => {
    try {
      return await testLarkAccessFromBackend();
    } catch (err) {
      return { ok: false, error: err.message || '测试访问失败' };
    }
  });

  ipcMain.handle('lark:config:get', async () => {
    try {
      return await getLarkConfigFromBackend();
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('lark:config:save', async (_event, config = {}) => {
    try {
      return await saveLarkConfigToBackend(config);
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('lark:user:chats', async () => {
    try {
      return await listUserChatsFromBackend();
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });
}

module.exports = { registerLarkAuthIpc };
