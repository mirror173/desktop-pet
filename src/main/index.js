const { app, BrowserWindow } = require('electron');
const path = require('path');
const WebSocket = require('ws');
const {
  loadAppConfig,
  loadLarkConfig,
  loadLlmConfig: loadRuntimeLlmConfig,
  loadPathsConfig,
  loadUiConfig,
  loadScannerConfig,
  getResourcePath,
  resolveResourcePath
} = require('../shared/config/runtime.config');
const { createLarkBackendServer } = require('./services/lark/backend');
const { startLarkRealtimeConnection: startLarkRealtimeConnectionImpl } = require('./services/lark/auth');
const { createPetWindowController } = require('./windows/pet-window');
const { createTrayController } = require('./tray');
const { createShortcutsController } = require('./ipc/shortcuts');
const { registerMainIpc } = require('./ipc/registerMainIpc');
const { createAppLifecycleController } = require('./app-lifecycle');
const { createFileSearchService } = require('./services/file-search');
const { createKnowledgeService } = require('./services/knowledge');
const { createLlmService } = require('./services/llm');

let win;
let tray = null;
let isQuitting = false;
let larkBackendInstance = null;

const appConfig = loadAppConfig();
const larkConfig = loadLarkConfig();
const llmConfig = loadRuntimeLlmConfig();
const pathsConfig = loadPathsConfig();
const uiConfig = loadUiConfig();
const scannerConfig = loadScannerConfig();

const PET_WINDOW_SIZE = uiConfig.petWindow || appConfig.window?.pet || { width: 450, height: 680 };
const SEARCH_WINDOW_SIZE = uiConfig.searchWindow || appConfig.window?.search || { width: 1000, height: 520 };

function getAssetPath(fileName) {
  const assetsDir = pathsConfig.assetsDir || appConfig.paths?.assetsDir || 'assets';
  const relativePath = path.join(assetsDir, fileName);
  return resolveResourcePath(relativePath, { packaged: app.isPackaged });
}

function getTrayTooltip() {
  return uiConfig.tray?.tooltip || appConfig.ui?.trayTooltip || '李泽言桌宠';
}

app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-logging');
app.commandLine.appendSwitch('log-level', '3');
app.setAppUserModelId(appConfig.appId || 'com.lizeyan.pet');

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) app.quit();

const fileSearchService = createFileSearchService({ app, scannerConfig });
const knowledgeService = createKnowledgeService({ getResourcePath, pathsConfig, appConfig });
const llmService = createLlmService({ app, appConfig, llmConfig, pathsConfig, getResourcePath, resolveResourcePath });

const petWindowController = createPetWindowController({
  app,
  getWindowRef: () => win,
  setWindowRef: (nextWin) => {
    win = nextWin;
  },
  getIsQuitting: () => isQuitting,
  getPetWindowSize: () => PET_WINDOW_SIZE,
  getPreloadPath: () => path.join(__dirname, '../../preload.js')
});

const { createWindow, centerPetWindow, resizeWindowTo, showReminderWindowInFront, showPetWindow, hidePetWindow, togglePetWindow } = petWindowController;

function quitApp() {
  isQuitting = true;
  app.quit();
}

const trayController = createTrayController({
  getTrayTooltip,
  getAssetPath,
  showPetWindow,
  hidePetWindow,
  centerPetWindow,
  togglePetWindow,
  quitApp,
  setTrayRef: (nextTray) => {
    const prevTray = tray;
    tray = nextTray;
    return prevTray;
  }
});

const { createTray } = trayController;

const shortcutsController = createShortcutsController({
  getShortcutKey: () => uiConfig.shortcut || appConfig.keyboard?.showPetShortcut || 'CommandOrControl+Alt+L',
  showPetWindow
});

const { registerShortcuts, unregisterShortcuts } = shortcutsController;

function startLarkRealtimeConnection() {
  const realtimeUrl = String(larkConfig.realtimeWsUrl || '').trim();
  const reconnectDelayMs = Number(larkConfig.realtimeReconnectDelayMs) || 3000;
  return startLarkRealtimeConnectionImpl({
    ws: WebSocket,
    win,
    logger: console,
    url: realtimeUrl,
    reconnectDelayMs
  });
}

function startAutoLaunchTasks() {
  void fileSearchService.buildFileIndex();
  setTimeout(() => { void llmService.ensureLlmServerStarted(); }, Number(appConfig.runtime?.autoStartLlmDelayMs) || 1500);
}

function startAppBootstrap() {
  knowledgeService.ensureKnowledgeFile();
  larkBackendInstance = createLarkBackendServer({ app, port: Number(appConfig.runtime?.larkBackendPort) || 3000, onAuthChanged: () => {} });
  return larkBackendInstance.start().then(() => {
    larkBackendInstance.startBriefingScheduler?.();
    createWindow();
    createTray();
    registerShortcuts();
    startAutoLaunchTasks();
    startLarkRealtimeConnection();
  });
}

function onBeforeQuit() {
  llmService.shutdown();
}

const appLifecycleController = createAppLifecycleController({
  app,
  BrowserWindow,
  createWindow,
  showPetWindow,
  unregisterShortcuts,
  setIsQuitting: (nextValue) => {
    isQuitting = nextValue;
  },
  onBeforeQuit
});

if (gotTheLock) {
  app.whenReady().then(() => {
    appLifecycleController.registerLifecycleEvents();
    startAppBootstrap();
  });
}

registerMainIpc({
  centerPetWindow,
  showReminderWindowInFront,
  resolveModelPath: () => llmService.resolveModelPath(),
  resolveLlamaServerPath: () => llmService.resolveLlamaServerPath(),
  callLocalLlmChat: (payload) => llmService.callLocalLlmChat(payload),
  larkBackendInstanceRef: () => larkBackendInstance,
  fileSearch: {
    query: (payload) => fileSearchService.createQueryResult(payload),
    status: () => fileSearchService.getStatus(),
    llmReady: () => llmService.getStatus().llmReady,
    llmProcess: () => llmService.getStatus().llmProcess,
    llmStartupError: () => llmService.getStatus().llmStartupError
  },
  resizeWindowTo,
  PET_WINDOW_SIZE,
  SEARCH_WINDOW_SIZE,
  hidePetWindow,
  togglePetWindow,
  quitApp,
  getKnowledgeFilePath: () => knowledgeService.getKnowledgeFilePath(),
  loadKnowledgeFromFile: () => knowledgeService.loadKnowledgeFromFile(),
  saveKnowledgeToFile: (records) => knowledgeService.saveKnowledgeToFile(records),
  getWindowRef: () => win,
  getLlmConfigPathCandidates: () => llmService.getLlmConfigPathCandidates(),
  parseToolCall: () => null
});

module.exports = { startAppBootstrap };
