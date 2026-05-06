/* eslint-disable import/no-commonjs */
const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  fileExists,
  buildCandidatePaths,
  resolveExistingPath,
  normalizeRelativePath,
  joinPath
} = require('../utils/path');

const DEFAULT_ENV = {
  LARK_BACKEND_BASE_URL: 'http://127.0.0.1:3000',
  LARK_BACKEND_PORT: '3000',
  LARK_LLM_PORT: '18080',
  LARK_AUTO_START_LLM_DELAY_MS: '1500',
  LARK_AUTO_FETCH_BRIEFING_DELAY_MS: '5000',
  LARK_AUTO_FETCH_BRIEFING_INTERVAL_MS: '3600000',
  LARK_APP_ID: '',
  LARK_APP_SECRET: '',
  LARK_CLIENT_ID: '',
  LARK_CLIENT_SECRET: '',
  LARK_CHAT_ID: 'oc_2aa3ce3029c8eb04268f6127983baef4',
  LARK_REDIRECT_URI: 'http://127.0.0.1:3000/api/lark/oauth/callback',
  LARK_AUTHORIZE_URL: 'https://open.feishu.cn/open-apis/authen/v1/authorize',
  LARK_REALTIME_WS_URL: '',
  LARK_REALTIME_RECONNECT_DELAY_MS: '3000'
};

/**
 * 获取项目根目录。
 * 输入: 无
 * 输出: string，项目根目录绝对路径
 */
function getProjectRoot() {
  return path.resolve(__dirname, '../../../');
}

/**
 * 生成配置候选路径列表。
 * 输入: fileName(string) 配置文件名
 * 输出: string[]，候选路径列表
 */
function getConfigCandidates(fileName) {
  const root = getProjectRoot();
  return [
    ...buildCandidatePaths([joinPath(root, 'config'), root], fileName),
    ...buildCandidatePaths([path.dirname(process.execPath), process.resourcesPath || ''], fileName)
  ];
}

/**
 * 解析可用配置文件。
 * 输入: fileName(string) 配置文件名
 * 输出: string，已存在的配置文件路径，找不到时返回空字符串
 */
function resolveConfigFile(fileName) {
  return resolveExistingPath(getConfigCandidates(fileName));
}

/**
 * 深度合并对象。
 * 输入: defaults(object|array) 默认值，overrides(object) 覆盖值
 * 输出: object|array，合并后的结果
 */
function mergeDeep(defaults, overrides) {
  const base = Array.isArray(defaults) ? [...defaults] : { ...(defaults || {}) };
  if (!overrides || typeof overrides !== 'object') return base;

  for (const [key, value] of Object.entries(overrides)) {
    if (value && typeof value === 'object' && !Array.isArray(value) && base[key] && typeof base[key] === 'object' && !Array.isArray(base[key])) {
      base[key] = mergeDeep(base[key], value);
    } else {
      base[key] = value;
    }
  }

  return base;
}

/**
 * 加载应用配置。
 * 输入: 无
 * 输出: object，应用配置对象
 */
function loadAppConfig() {
  const defaults = {
    appId: 'com.lizeyan.pet',
    productName: '李泽言QQ人桌宠',
    window: {
      pet: { width: 450, height: 680 },
      search: { width: 1000, height: 520 }
    },
    keyboard: { showPetShortcut: 'CommandOrControl+Alt+L' },
    runtime: {
      larkBackendBaseUrl: process.env.LARK_BACKEND_BASE_URL || DEFAULT_ENV.LARK_BACKEND_BASE_URL,
      larkBackendPort: Number(process.env.LARK_BACKEND_PORT || DEFAULT_ENV.LARK_BACKEND_PORT),
      llmPort: Number(process.env.LARK_LLM_PORT || DEFAULT_ENV.LARK_LLM_PORT),
      autoStartLlmDelayMs: Number(process.env.LARK_AUTO_START_LLM_DELAY_MS || DEFAULT_ENV.LARK_AUTO_START_LLM_DELAY_MS),
      autoFetchBriefingDelayMs: Number(process.env.LARK_AUTO_FETCH_BRIEFING_DELAY_MS || DEFAULT_ENV.LARK_AUTO_FETCH_BRIEFING_DELAY_MS),
      autoFetchBriefingIntervalMs: Number(process.env.LARK_AUTO_FETCH_BRIEFING_INTERVAL_MS || DEFAULT_ENV.LARK_AUTO_FETCH_BRIEFING_INTERVAL_MS)
    },
    paths: {
      assetsDir: 'assets',
      modelsDir: 'resources/models',
      binDir: 'resources/bin',
      knowledgeDir: 'knowledge',
      llmConfigFileName: 'llm.config.json',
      larkConfigFileName: 'lark.config.json',
      appConfigFileName: 'app.config.json'
    },
    ui: {
      trayTooltip: '李泽言桌宠'
    },
    scanner: {
      preferredRoots: ['Desktop', 'Downloads', 'Documents'],
      maxDepth: 7,
      skipDirs: ['$recycle.bin', 'system volume information', 'windows', 'program files', 'program files (x86)', 'programdata', 'msocache', 'recovery', '.git', 'node_modules']
    }
  };

  const cfg = safeReadJson(resolveConfigFile('app.config.json'), {});
  return mergeDeep(defaults, cfg);
}

/**
 * 加载飞书配置。
 * 输入: 无
 * 输出: object，飞书配置对象
 */
function loadLarkConfig() {
  const defaults = {
    appId: process.env.LARK_APP_ID || DEFAULT_ENV.LARK_APP_ID,
    appSecret: process.env.LARK_APP_SECRET || DEFAULT_ENV.LARK_APP_SECRET,
    clientId: process.env.LARK_CLIENT_ID || DEFAULT_ENV.LARK_CLIENT_ID,
    clientSecret: process.env.LARK_CLIENT_SECRET || DEFAULT_ENV.LARK_CLIENT_SECRET,
    chatId: process.env.LARK_CHAT_ID || DEFAULT_ENV.LARK_CHAT_ID,
    appType: 'SelfBuilt',
    domain: 'Lark',
    loggerLevel: 'info',
    backendBaseUrl: process.env.LARK_BACKEND_BASE_URL || DEFAULT_ENV.LARK_BACKEND_BASE_URL,
    realtimeMode: 'sdk',
    realtimeWsUrl: process.env.LARK_REALTIME_WS_URL || DEFAULT_ENV.LARK_REALTIME_WS_URL,
    realtimeReconnectDelayMs: Number(process.env.LARK_REALTIME_RECONNECT_DELAY_MS || DEFAULT_ENV.LARK_REALTIME_RECONNECT_DELAY_MS),
    redirectUri: process.env.LARK_REDIRECT_URI || DEFAULT_ENV.LARK_REDIRECT_URI,
    authorizeUrl: process.env.LARK_AUTHORIZE_URL || DEFAULT_ENV.LARK_AUTHORIZE_URL
  };
  const cfg = safeReadJson(resolveConfigFile('lark.config.json'), {});
  return mergeDeep(defaults, cfg);
}

/**
 * 加载大模型配置。
 * 输入: 无
 * 输出: object，大模型配置对象
 */
function loadLlmConfig() {
  const defaults = {
    provider: 'local',
    modelName: 'Qwen2.5-0.5B-Instruct-mate-q4_k_m.gguf',
    modelPath: '',
    serverPath: '',
    endpoint: '',
    apiKey: '',
    modelId: '',
    contextSize: 4096,
    threads: Math.max(2, Math.min(8, os.cpus()?.length || 4)),
    temperature: 0.65,
    top_p: 0.9,
    max_tokens: 220,
    port: Number(process.env.LARK_LLM_PORT || DEFAULT_ENV.LARK_LLM_PORT)
  };
  const cfg = safeReadJson(resolveConfigFile('llm.config.json'), {});
  return mergeDeep(defaults, cfg);
}

/**
 * 加载路径配置。
 * 输入: 无
 * 输出: object，路径配置对象
 */
function loadPathsConfig() {
  const defaults = {
    assetsDir: 'assets',
    modelsDir: 'resources/models',
    binDir: 'resources/bin',
    knowledgeDir: 'knowledge',
    llmConfigFileName: 'llm.config.json',
    larkConfigFileName: 'lark.config.json',
    appConfigFileName: 'app.config.json'
  };
  const cfg = safeReadJson(resolveConfigFile('paths.config.json'), {});
  return mergeDeep(defaults, cfg);
}

/**
 * 加载界面配置。
 * 输入: 无
 * 输出: object，界面配置对象
 */
function loadUiConfig() {
  const defaults = {
    petWindow: { width: 450, height: 680 },
    searchWindow: { width: 1000, height: 520 },
    shortcut: 'CommandOrControl+Alt+L',
    tray: { tooltip: '李泽言桌宠' }
  };
  const cfg = safeReadJson(resolveConfigFile('ui.config.json'), {});
  return mergeDeep(defaults, cfg);
}

/**
 * 加载扫描配置。
 * 输入: 无
 * 输出: object，扫描配置对象
 */
function loadScannerConfig() {
  const defaults = {
    preferredRoots: ['Desktop', 'Downloads', 'Documents'],
    maxDepth: 7,
    skipDirs: ['$recycle.bin', 'system volume information', 'windows', 'program files', 'program files (x86)', 'programdata', 'msocache', 'recovery', '.git', 'node_modules']
  };
  const cfg = safeReadJson(resolveConfigFile('scanner.config.json'), {});
  return mergeDeep(defaults, cfg);
}

/**
 * 安全读取 JSON 文件。
 * 输入: filePath(string) 文件路径, fallback(any) 兜底值
 * 输出: any，解析结果或兜底值
 */
function safeReadJson(filePath, fallback = {}) {
  if (!filePath || !fileExists(filePath)) return fallback;
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * 获取资源候选路径。
 * 输入: relativePath(string) 相对资源路径, options(object) 解析选项
 * 输出: string[]，候选绝对路径列表
 */
function getResourceCandidates(relativePath = '', options = {}) {
  const root = getProjectRoot();
  const normalized = normalizeRelativePath(relativePath);
  const exeDir = path.dirname(process.execPath);
  const packaged = Boolean(options.packaged);

  if (packaged) {
    return buildCandidatePaths([process.resourcesPath || '', exeDir, root], normalized);
  }

  return buildCandidatePaths([root, joinPath(root, 'resources'), joinPath(root, 'assets')], normalized);
}

/**
 * 解析资源绝对路径。
 * 输入: relativePath(string) 相对资源路径, options(object) 解析选项
 * 输出: string，存在的资源绝对路径，找不到时返回空字符串
 */
function resolveResourcePath(relativePath = '', options = {}) {
  return resolveExistingPath(getResourceCandidates(relativePath, options));
}

/**
 * 拼接项目根目录下的资源路径。
 * 输入: segments(...string) 路径片段
 * 输出: string，拼接后的绝对路径
 */
function getResourcePath(...segments) {
  return joinPath(getProjectRoot(), ...segments);
}

module.exports = {
  getProjectRoot,
  getConfigCandidates,
  resolveConfigFile,
  mergeDeep,
  loadAppConfig,
  loadLarkConfig,
  loadLlmConfig,
  loadPathsConfig,
  loadUiConfig,
  loadScannerConfig,
  getResourcePath,
  getResourceCandidates,
  resolveResourcePath
};
