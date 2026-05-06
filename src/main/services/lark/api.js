const { loadAppConfig, loadLarkConfig } = require('../../../shared/config/runtime.config');

const appConfig = loadAppConfig();
const larkConfig = loadLarkConfig();

const LARK_BACKEND_BASE_URL = process.env.LARK_BACKEND_BASE_URL
  || larkConfig.backendBaseUrl
  || appConfig.runtime?.larkBackendBaseUrl
  || 'http://127.0.0.1:3000';

/**
 * 获取飞书后端基础地址
 * 输入: 无
 * 输出: string，后端基础地址
 */
function getLarkBackendBaseUrl() {
  return LARK_BACKEND_BASE_URL;
}

/**
 * 拼接飞书后端 API 地址
 * 输入: pathname(string) 接口路径
 * 输出: string，完整请求地址
 */
function getLarkApiUrl(pathname) {
  return new URL(pathname, getLarkBackendBaseUrl()).toString();
}

/**
 * 发送 JSON 请求并解析响应
 * 输入: url(string) 请求地址, options(object) 请求选项
 * 输出: Promise<any>，解析后的响应数据
 */
async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    throw new Error(data?.message || data?.error || text || `HTTP ${res.status}`);
  }

  return data;
}

/**
 * 获取飞书登录状态
 * 输入: 无
 * 输出: Promise<object>，后端返回的登录状态数据
 */
async function getLarkLoginStatusFromBackend() {
  return fetchJson(getLarkApiUrl('/api/lark/auth/status'));
}

/**
 * 读取飞书配置
 * 输入: 无
 * 输出: Promise<object>，飞书配置对象
 */
async function getLarkConfigFromBackend() {
  return fetchJson(getLarkApiUrl('/api/lark/config'));
}

/**
 * 保存飞书配置
 * 输入: config(object) 飞书配置对象
 * 输出: Promise<object>，保存结果
 */
async function saveLarkConfigToBackend(config = {}) {
  return fetchJson(getLarkApiUrl('/api/lark/config'), { method: 'POST', body: JSON.stringify(config) });
}

/**
 * 获取用户会话列表
 * 输入: 无
 * 输出: Promise<object>，会话列表响应
 */
async function listUserChatsFromBackend() {
  return fetchJson(getLarkApiUrl('/api/lark/user/chats'));
}

/**
 * 启动飞书登录流程
 * 输入: 无
 * 输出: Promise<object>，后端返回的授权地址与模式
 */
async function startLarkLoginFromBackend() {
  return fetchJson(getLarkApiUrl('/api/lark/auth/start'), { method: 'POST' });
}

/**
 * 退出飞书登录
 * 输入: 无
 * 输出: Promise<object>，后端返回的退出结果
 */
async function logoutLarkFromBackend() {
  return fetchJson(getLarkApiUrl('/api/lark/auth/logout'), { method: 'POST' });
}

/**
 * 切换飞书账号
 * 输入: 无
 * 输出: Promise<object>，后端返回的新授权地址
 */
async function switchLarkAccountFromBackend() {
  return fetchJson(getLarkApiUrl('/api/lark/auth/switch'), { method: 'POST' });
}

/**
 * 测试飞书访问能力
 * 输入: 无
 * 输出: Promise<object>，后端返回的可访问性结果
 */
async function testLarkAccessFromBackend() {
  return fetchJson(getLarkApiUrl('/api/lark/test/me'));
}

/**
 * 获取飞书待办列表
 * 输入: params(object) 查询条件
 * 输出: Promise<object>，待办列表响应
 */
async function listLarkTodosFromBackend(params = {}) {
  const qs = new URLSearchParams();
  if (params.status) qs.set('status', params.status);
  if (params.keyword) qs.set('keyword', params.keyword);
  return fetchJson(getLarkApiUrl(`/api/lark/todo/list?${qs.toString()}`));
}

/**
 * 创建飞书待办
 * 输入: payload(object) 待办内容
 * 输出: Promise<object>，创建结果
 */
async function createLarkTodoFromBackend(payload = {}) {
  return fetchJson(getLarkApiUrl('/api/lark/todo/create'), { method: 'POST', body: JSON.stringify(payload) });
}

module.exports = {
  LARK_BACKEND_BASE_URL,
  getLarkBackendBaseUrl,
  getLarkApiUrl,
  fetchJson,
  getLarkLoginStatusFromBackend,
  startLarkLoginFromBackend,
  logoutLarkFromBackend,
  switchLarkAccountFromBackend,
  testLarkAccessFromBackend,
  listLarkTodosFromBackend,
  createLarkTodoFromBackend
};
