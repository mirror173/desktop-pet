const { ipcMain } = require('electron');

function registerLarkTodoIpc({ listLarkTodosFromBackend, createLarkTodoFromBackend }) {
  ipcMain.handle('lark:todo-list', async (_event, payload = {}) => {
    try {
      return await listLarkTodosFromBackend(payload);
    } catch (err) {
      return { ok: false, error: err.message || '查询待办失败' };
    }
  });

  ipcMain.handle('lark:todo-create', async (_event, payload = {}) => {
    try {
      return await createLarkTodoFromBackend(payload);
    } catch (err) {
      return { ok: false, error: err.message || '创建待办失败' };
    }
  });
}

module.exports = { registerLarkTodoIpc };
