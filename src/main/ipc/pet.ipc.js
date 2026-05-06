// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ipcMain, shell, dialog } = require('electron');
const { spawn } = require('child_process');
const crypto = require('crypto');

function registerPetIpc({
  centerPetWindow,
  showReminderWindowInFront,
  resolveModelPath,
  resolveLlamaServerPath,
  callLocalLlmChat,
  resizeWindowTo,
  PET_WINDOW_SIZE,
  SEARCH_WINDOW_SIZE,
  hidePetWindow,
  togglePetWindow,
  quitApp,
  getWindowRef
}) {
  ipcMain.handle('pet:center-window', () => centerPetWindow());
  ipcMain.handle('pet:show-reminder-front', () => showReminderWindowInFront());
  ipcMain.handle('pet:llm-status', async () => {
    const modelPath = resolveModelPath();
    const serverPath = resolveLlamaServerPath();
    const running = false;

    return {
      ok: running,
      running,
      modelFound: Boolean(modelPath),
      serverFound: Boolean(serverPath),
      modelPath: modelPath || '',
      serverPath: serverPath || '',
      error: ''
    };
  });
  ipcMain.handle('pet:llm-chat', async (_event, payload = {}) => callLocalLlmChat(payload));

  ipcMain.handle('chat:send-message', async (_event, message) => {
    try {
      const win = getWindowRef();
      if (win) {
        const fullMessage = {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          from: 'pet',
          content: message.content,
          role: message.role || 'user'
        };
        win.webContents.send('chat:message-received', fullMessage);
        return { ok: true };
      }
      return { ok: false, error: 'Backend not running' };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('pet:execute-cli', async (_event, payload = {}) => {
    const command = String(payload.command || '').trim();
    const args = Array.isArray(payload.args) ? payload.args.map((item) => String(item)) : [];
    const cwd = typeof payload.cwd === 'string' && payload.cwd.trim() ? payload.cwd.trim() : undefined;

    if (!command) return { ok: false, error: '命令不能为空' };

    return new Promise((resolve) => {
      const child = spawn(command, args, {
        cwd,
        windowsHide: true,
        shell: false,
        stdio: ['ignore', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';
      child.stdout.on('data', (chunk) => { stdout += chunk.toString('utf8'); });
      child.stderr.on('data', (chunk) => { stderr += chunk.toString('utf8'); });
      child.on('error', (err) => resolve({ ok: false, error: err?.message || 'CLI 启动失败' }));
      child.on('close', (code) => {
        const output = String(stdout || stderr || '').trim();
        const result = code === 0 ? { ok: true, output } : { ok: false, error: output || `CLI 退出码 ${code}` };
        return resolve(result);
      });
    });
  });

  ipcMain.handle('pet:open-external-url', async (_event, payload = {}) => {
    const url = String(payload.url || '').trim();
    if (!url) return { ok: false, error: 'URL 为空' };
    try {
      await shell.openExternal(url);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err?.message || '打开失败' };
    }
  });

  ipcMain.handle('pet:open-workflow-config', async () => {
    const result = await dialog.showMessageBox({
      type: 'info',
      buttons: ['确定'],
      title: '控制中心',
      message: '后续可以在这里增加快捷键和常用网页配置。'
    });
    return { ok: result.response === 0 };
  });

  ipcMain.handle('pet:set-window-mode', async (_event, payload = {}) => {
    const mode = String(payload.mode || 'pet');
    if (mode === 'search') {
      resizeWindowTo(SEARCH_WINDOW_SIZE, { center: false, resizable: true, minWidth: SEARCH_WINDOW_SIZE.width, minHeight: 600 });
      return { ok: true, mode: 'search' };
    }

    resizeWindowTo(PET_WINDOW_SIZE, { center: false, resizable: false, minWidth: PET_WINDOW_SIZE.width, minHeight: PET_WINDOW_SIZE.height });
    return { ok: true, mode: 'pet' };
  });

  ipcMain.on('pet:drag-window-by', (_event, payload = {}) => {
    const win = getWindowRef();
    if (!win || win.isDestroyed()) return;

    const dx = Number(payload.dx) || 0;
    const dy = Number(payload.dy) || 0;
    if (dx === 0 && dy === 0) return;

    const [x, y] = win.getPosition();
    const [currentWidth, currentHeight] = win.getSize();
    win.setBounds({ x: Math.round(x + dx), y: Math.round(y + dy), width: currentWidth, height: currentHeight }, false);
  });

  ipcMain.on('pet:window-hide', () => hidePetWindow());
  ipcMain.on('pet:window-toggle', () => togglePetWindow());
  ipcMain.on('pet:app-quit', () => quitApp());
}

module.exports = { registerPetIpc };
