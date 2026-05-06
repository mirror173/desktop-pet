const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  centerWindow: () => ipcRenderer.invoke('pet:center-window'),
  showReminderFront: () => ipcRenderer.invoke('pet:show-reminder-front'),
  dragWindowBy: (dx, dy) => ipcRenderer.send('pet:drag-window-by', { dx, dy }),
  hideWindow: () => ipcRenderer.send('pet:window-hide'),
  toggleWindow: () => ipcRenderer.send('pet:window-toggle'),
  quitApp: () => ipcRenderer.send('pet:app-quit'),
  llmChat: (payload) => ipcRenderer.invoke('pet:llm-chat', payload),
  llmStatus: () => ipcRenderer.invoke('pet:llm-status'),
  loadKnowledgeFile: () => ipcRenderer.invoke('pet:kb-load-file'),
  saveKnowledgeFile: (records) => ipcRenderer.invoke('pet:kb-save-file', { records }),
  searchFiles: (payload) => ipcRenderer.invoke('file-search:query', payload),
  fileSearchStatus: () => ipcRenderer.invoke('file-search:status'),
  openLocalFile: (filePath) => ipcRenderer.invoke('file-search:open-file', { path: filePath }),
  openLocalFolder: (filePath) => ipcRenderer.invoke('file-search:open-folder', { path: filePath }),
  openExternalUrl: (url) => ipcRenderer.invoke('pet:open-external-url', { url }),
  setWindowMode: (mode) => ipcRenderer.invoke('pet:set-window-mode', { mode }),
  checkLarkLogin: () => ipcRenderer.invoke('lark:status'),
  startLarkLogin: () => ipcRenderer.invoke('lark:start-login'),
  logoutLark: () => ipcRenderer.invoke('lark:logout'),
  switchLarkAccount: () => ipcRenderer.invoke('lark:switch-account'),
  testLarkAccess: () => ipcRenderer.invoke('lark:test-access'),
  executeLarkCommand: (payload) => ipcRenderer.invoke('lark:execute-command', payload),
  sendFeishuChat: (payload) => ipcRenderer.invoke('lark:chat-send', payload),
  getFeishuLatestChat: (payload) => ipcRenderer.invoke('lark:chat-latest', payload),
  listLarkTodos: (payload) => ipcRenderer.invoke('lark:todo-list', payload),
  createLarkTodo: (payload) => ipcRenderer.invoke('lark:todo-create', payload),
  // 飞书用户配置
  getLarkConfig: () => ipcRenderer.invoke('lark:config:get'),
  saveLarkConfig: (config) => ipcRenderer.invoke('lark:config:save', config),
  listUserChats: () => ipcRenderer.invoke('lark:user:chats'),
  getLarkChatMessages: (payload) => ipcRenderer.invoke('lark:chat:list-messages', payload),
  // 到岗一键梳理相关API
  getHighPriorityMessages: () => ipcRenderer.invoke('lark:work:get-high-priority-messages'),
  generateMeetingSpeech: () => ipcRenderer.invoke('lark:work:generate-meeting-speech'),
  getDailySchedule: () => ipcRenderer.invoke('lark:work:get-daily-schedule'),
  fetchWorkBriefing: () => ipcRenderer.invoke('lark:work:fetch-briefing'),
  executeCli: (payload) => ipcRenderer.invoke('pet:execute-cli', payload),
  onBriefingUpdated: (callback) => {
    if (typeof callback !== 'function') return () => {};
    const listener = (_event, content) => callback(content);
    ipcRenderer.on('update-briefing', listener);
    return () => ipcRenderer.removeListener('update-briefing', listener);
  },
  sendOpenClawMessage: (payload) => ipcRenderer.invoke('openclaw:send-message', payload),
  executeOpenClawToolCall: (payload) => ipcRenderer.invoke('openclaw:execute-toolcall', payload),
  getOpenClawStatus: () => ipcRenderer.invoke('openclaw:status'),
  onChatMessageReceived: (callback) => {
    if (typeof callback !== 'function') return () => {};
    const listener = (_event, data) => callback(data);
    ipcRenderer.on('chat:message-received', listener);
    return () => ipcRenderer.removeListener('chat:message-received', listener);
  }
});
