const { ipcMain } = require('electron');

function registerKnowledgeIpc({ getKnowledgeFilePath, loadKnowledgeFromFile, saveKnowledgeToFile }) {
  ipcMain.handle('pet:kb-load-file', async () => ({ ok: true, path: getKnowledgeFilePath(), records: loadKnowledgeFromFile() }));
  ipcMain.handle('pet:kb-save-file', async (_event, payload = {}) => {
    const saved = saveKnowledgeToFile(Array.isArray(payload.records) ? payload.records : []);
    return saved.ok ? { ok: true, path: saved.path } : { ok: false, error: saved.error || '保存失败' };
  });
}

module.exports = { registerKnowledgeIpc };
