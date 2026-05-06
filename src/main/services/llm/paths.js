const path = require('path');
const {
  loadLlmConfig,
  loadPathsConfig,
  resolveResourcePath,
  getProjectRoot,
  getResourcePath
} = require('../../../shared/config/runtime.config');

const llmConfig = loadLlmConfig();
const pathsConfig = loadPathsConfig();

/**
 * 解析大模型资源候选路径。
 * 输入: relativePath(string) 相对资源路径
 * 输出: string[]，候选绝对路径列表
 */
function getLlmResourceCandidates(relativePath = '') {
  const modelsDir = pathsConfig.modelsDir || 'resources/models';
  const normalizedPath = String(relativePath || '').replace(/^[\\/]+/, '');
  const root = getProjectRoot();
  return [
    path.join(root, modelsDir, normalizedPath),
    getResourcePath(modelsDir, normalizedPath),
    path.join(root, 'resources', 'models', normalizedPath),
    path.join(root, 'assets', normalizedPath)
  ];
}

/**
 * 解析大模型资源绝对路径。
 * 输入: relativePath(string) 相对资源路径
 * 输出: string，存在的绝对路径，找不到时返回空字符串
 */
function resolveLlmResourcePath(relativePath = '') {
  return resolveResourcePath(getLlmResourceCandidates(relativePath), { packaged: Boolean(process.env.APP_PACKAGED) });
}

/**
 * 获取默认模型文件名。
 * 输入: 无
 * 输出: string，默认模型文件名
 */
function getDefaultModelName() {
  return llmConfig.modelName || 'Qwen2.5-0.5B-Instruct-mate-q4_k_m.gguf';
}

module.exports = {
  getLlmResourceCandidates,
  resolveLlmResourcePath,
  getDefaultModelName
};
