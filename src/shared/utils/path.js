const fs = require('fs');
const path = require('path');

/**
 * 判断目标路径是否存在。
 * 输入: targetPath(string) 待检查路径
 * 输出: boolean，是否存在
 */
function fileExists(targetPath) {
  try {
    return fs.existsSync(targetPath);
  } catch {
    return false;
  }
}

/**
 * 规范化相对资源路径，去掉开头分隔符。
 * 输入: relativePath(string) 相对路径
 * 输出: string，规范化后的相对路径
 */
function normalizeRelativePath(relativePath = '') {
  return String(relativePath || '').replace(/^[\\/]+/, '');
}

/**
 * 安全合并路径片段。
 * 输入: parts(...string) 路径片段
 * 输出: string，拼接后的路径
 */
function joinPath(...parts) {
  return path.join(...parts.filter(Boolean));
}

/**
 * 将相对路径规范化为候选绝对路径列表。
 * 输入: bases(string[]) 基础目录列表, relativePath(string) 相对路径
 * 输出: string[]，候选绝对路径列表
 */
function buildCandidatePaths(bases = [], relativePath = '') {
  const normalized = normalizeRelativePath(relativePath);
  return bases
    .filter(Boolean)
    .map((base) => joinPath(base, normalized))
    .filter(Boolean);
}

/**
 * 从候选路径中解析第一个存在的路径。
 * 输入: candidates(string[]) 候选路径列表
 * 输出: string，存在的路径，找不到时返回空字符串
 */
function resolveExistingPath(candidates = []) {
  return candidates.find((candidate) => fileExists(candidate)) || '';
}

module.exports = {
  fileExists,
  normalizeRelativePath,
  joinPath,
  buildCandidatePaths,
  resolveExistingPath
};
