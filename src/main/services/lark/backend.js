const { loadAppConfig, loadLarkConfig } = require('../../../shared/config/runtime.config');
const { createLarkBackendServer } = require('../backend');

const appConfig = loadAppConfig();
const larkConfig = loadLarkConfig();

const LARK_BACKEND_BASE_URL = larkConfig.backendBaseUrl
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

module.exports = {
  LARK_BACKEND_BASE_URL,
  getLarkBackendBaseUrl,
  getLarkApiUrl,
  createLarkBackendServer
};
