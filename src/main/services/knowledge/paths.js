const path = require('path');
const {
  loadPathsConfig,
  resolveResourcePath,
  getProjectRoot,
  getResourcePath
} = require('../../../shared/config/runtime.config');

const pathsConfig = loadPathsConfig();

/**
 * 解析知识库目录候选路径。
 * 输入: 无
 * 输出: string[]，候选绝对路径列表
 */
function getKnowledgeDirCandidates() {
  const knowledgeDir = pathsConfig.knowledgeDir || 'knowledge';
  const root = getProjectRoot();
  return [
    path.join(root, knowledgeDir),
    getResourcePath(knowledgeDir),
    path.join(root, 'resources', knowledgeDir),
    path.join(root, 'assets', knowledgeDir)
  ];
}

/**
 * 解析知识库目录绝对路径。
 * 输入: 无
 * 输出: string，存在的知识库目录路径，找不到时返回空字符串
 */
function resolveKnowledgeDirPath() {
  return resolveResourcePath(getKnowledgeDirCandidates(), { packaged: Boolean(process.env.APP_PACKAGED) });
}

/**
 * 获取知识库文件路径。
 * 输入: fileName(string) 文件名，默认 kb.json
 * 输出: string，知识库文件绝对路径
 */
function getKnowledgeFilePath(fileName = 'kb.json') {
  const dirPath = resolveKnowledgeDirPath();
  return dirPath ? path.join(dirPath, fileName) : '';
}

module.exports = {
  getKnowledgeDirCandidates,
  resolveKnowledgeDirPath,
  getKnowledgeFilePath
};
