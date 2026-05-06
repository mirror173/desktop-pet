const { ipcMain, shell } = require('electron');

function registerFileSearchIpc({ fileSearch }) {
  ipcMain.handle('file-search:query', async (_event, payload = {}) => fileSearch.query(payload));
  ipcMain.handle('file-search:status', async () => fileSearch.status());

  ipcMain.handle('file-search:open-file', async (_event, payload = {}) => {
    const targetPath = String(payload.path || '').trim();
    if (!targetPath) return { ok: false, error: '路径为空' };

    try {
      const result = await shell.openPath(targetPath);
      if (result) return { ok: false, error: result };
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err?.message || '打开失败' };
    }
  });

  ipcMain.handle('file-search:open-folder', async (_event, payload = {}) => {
    const targetPath = String(payload.path || '').trim();
    if (!targetPath) return { ok: false, error: '路径为空' };

    try {
      shell.showItemInFolder(targetPath);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err?.message || '定位失败' };
    }
  });
}

module.exports = { registerFileSearchIpc };
