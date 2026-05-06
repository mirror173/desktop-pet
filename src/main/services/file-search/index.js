const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const SKIP_DIR_NAMES = new Set([
  '$recycle.bin',
  'system volume information',
  'windows',
  'program files',
  'program files (x86)',
  'programdata',
  'msocache',
  'recovery',
  '.git',
  'node_modules'
]);

const DOC_EXTS = new Set(['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt', '.md', '.csv', '.rtf']);
const IMG_EXTS = new Set(['.jpg', '.jpeg', '.png', '.bmp', '.gif', '.webp', '.svg', '.ico']);
const AUDIO_EXTS = new Set(['.mp3', '.wav', '.flac', '.aac', '.m4a', '.ogg', '.wma']);
const VIDEO_EXTS = new Set(['.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv', '.webm']);
const APP_EXTS = new Set(['.exe', '.lnk', '.bat', '.cmd', '.msi', '.com']);
const ARCHIVE_EXTS = new Set(['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz', '.iso']);

function fileExists(targetPath) {
  try {
    return fs.existsSync(targetPath);
  } catch {
    return false;
  }
}

function classifyEntry(isDirectory, extName = '') {
  if (isDirectory) return 'folder';
  const ext = String(extName || '').toLowerCase();
  if (DOC_EXTS.has(ext)) return 'doc';
  if (IMG_EXTS.has(ext)) return 'img';
  if (AUDIO_EXTS.has(ext)) return 'audio';
  if (VIDEO_EXTS.has(ext)) return 'video';
  if (APP_EXTS.has(ext)) return 'app';
  if (ARCHIVE_EXTS.has(ext)) return 'archive';
  return 'other';
}

function normalizeSearchText(value = '') {
  return String(value || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function tokenizeSearchText(value = '') {
  const normalized = normalizeSearchText(value);
  if (!normalized) return [];
  return normalized.split(/\s+/).filter(Boolean);
}

function createFileSearchService({ app, scannerConfig = {} }) {
  const fileIndex = [];
  const fileIndexByPath = new Map();
  const fileTokenIndex = new Map();
  const fileQueryCache = new Map();
  let fileIndexReady = false;
  let fileIndexBuilding = false;
  let fileIndexScannedCount = 0;
  let desktopRoots = [];

  function clearFileSearchIndexes() {
    fileIndex.length = 0;
    fileIndexByPath.clear();
    fileTokenIndex.clear();
    fileQueryCache.clear();
  }

  function getWindowsFixedDrives() {
    if (process.platform !== 'win32') return [];

    try {
      const out = execSync('wmic logicaldisk where "drivetype=3" get deviceid', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
      const lines = String(out || '')
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean);

      const drives = [];
      for (const line of lines) {
        if (/deviceid/i.test(line)) continue;
        const normalized = line.endsWith('\\') ? line : `${line}\\`;
        if (/^[A-Z]:\\$/i.test(normalized) && fileExists(normalized)) drives.push(normalized);
      }
      if (drives.length) return drives;
    } catch {
    }

    const fallback = [];
    for (let i = 67; i <= 90; i += 1) {
      const drive = `${String.fromCharCode(i)}:\\`;
      if (fileExists(drive)) fallback.push(drive);
    }
    return fallback;
  }

  function getScanRoots() {
    const userHome = app.getPath('home');
    const preferred = (scannerConfig.preferredRoots || ['Desktop', 'Downloads', 'Documents'])
      .map((dirName) => path.join(userHome, dirName))
      .filter((p) => fileExists(p));

    desktopRoots = preferred
      .filter((p) => String(p || '').toLowerCase().endsWith('\\desktop'))
      .map((p) => String(p).toLowerCase());

    const disks = getWindowsFixedDrives();
    const all = [...preferred, ...disks];
    const dedup = [];
    const seen = new Set();
    for (const p of all) {
      const k = String(p).toLowerCase();
      if (!seen.has(k)) {
        seen.add(k);
        dedup.push(p);
      }
    }
    return dedup;
  }

  function getIndexedTokens(item) {
    const tokens = new Set();
    for (const token of tokenizeSearchText(item?.name || '')) tokens.add(token);
    for (const token of tokenizeSearchText(item?.path || '')) tokens.add(token);
    for (const token of tokenizeSearchText(path.basename(String(item?.parentPath || '')))) tokens.add(token);
    if (item?.isDesktopFile) tokens.add('desktop');
    if (item?.type) tokens.add(String(item.type).toLowerCase());
    return [...tokens].filter(Boolean);
  }

  function addToTokenIndex(item) {
    const tokens = getIndexedTokens(item);
    for (const token of tokens) {
      if (!fileTokenIndex.has(token)) fileTokenIndex.set(token, new Set());
      fileTokenIndex.get(token).add(item.path);
    }
  }

  async function scanDirRecursive(rootPath, depth = 0, maxDepth = Number(scannerConfig.maxDepth) || 8) {
    if (depth > maxDepth) return;

    let dirents;
    try {
      dirents = await fs.promises.readdir(rootPath, { withFileTypes: true });
    } catch {
      return;
    }

    for (const dirent of dirents) {
      const fullPath = path.join(rootPath, dirent.name);
      const baseName = String(dirent.name || '').toLowerCase();

      if (dirent.isDirectory() && (scannerConfig.skipDirs || SKIP_DIR_NAMES).includes(baseName)) continue;

      let stats;
      try {
        stats = await fs.promises.stat(fullPath);
      } catch {
        continue;
      }

      const ext = dirent.isDirectory() ? '' : path.extname(dirent.name || '');
      const parentPath = path.dirname(fullPath);
      const fullLower = String(fullPath || '').toLowerCase();
      const isDesktopFile = desktopRoots.some((desktopRoot) => fullLower === desktopRoot || fullLower.startsWith(`${desktopRoot}\\`));

      const item = {
        name: dirent.name || '',
        path: fullPath,
        parentPath,
        ext,
        type: classifyEntry(dirent.isDirectory(), ext),
        isDirectory: dirent.isDirectory(),
        mtimeMs: Number(stats.mtimeMs || 0),
        size: dirent.isDirectory() ? 0 : Number(stats.size || 0),
        isDesktopFile
      };

      fileIndex.push(item);
      fileIndexByPath.set(item.path, item);
      addToTokenIndex(item);
      fileIndexScannedCount += 1;

      if (dirent.isDirectory()) {
        await scanDirRecursive(fullPath, depth + 1, maxDepth);
      }
    }
  }

  function scoreEntry(item, keywordLower) {
    const nameLower = String(item.name || '').toLowerCase();
    const pathLower = String(item.path || '').toLowerCase();

    let score = 0;
    const idxName = nameLower.indexOf(keywordLower);
    const idxPath = pathLower.indexOf(keywordLower);

    if (idxName === 0) score += 300;
    else if (idxName > 0) score += 220;

    if (idxPath >= 0) score += 80;

    if (nameLower === keywordLower) score += 260;
    if (nameLower.startsWith(keywordLower)) score += 120;

    const preferred = ['desktop', 'downloads', 'documents'];
    for (let i = 0; i < preferred.length; i += 1) {
      if (pathLower.includes(`\\${preferred[i]}\\`) || pathLower.endsWith(`\\${preferred[i]}`)) {
        score += 45 - i * 10;
        break;
      }
    }

    const recency = Math.max(0, Math.min(40, Math.floor((item.mtimeMs || 0) / 1e11)));
    score += recency;

    return score;
  }

  function getSearchCacheKey(keyword = '', filterType = 'all', limit = 120) {
    return `${String(filterType || 'all').toLowerCase()}|${Math.max(1, Number(limit) || 120)}|${normalizeSearchText(keyword)}`;
  }

  async function buildFileIndex() {
    if (fileIndexBuilding || fileIndexReady) return;
    fileIndexBuilding = true;
    fileIndexReady = false;
    fileIndexScannedCount = 0;
    clearFileSearchIndexes();

    const roots = getScanRoots();
    for (const root of roots) {
      await scanDirRecursive(root, 0, 7);
    }

    fileIndexReady = true;
    fileIndexBuilding = false;
  }

  function searchFileIndex(keyword = '', filterType = 'all', limit = 120) {
    const q = normalizeSearchText(keyword);
    if (!q) return [];

    const safeLimit = Math.max(1, Number(limit) || 120);
    const cacheKey = getSearchCacheKey(keyword, filterType, safeLimit);
    const cached = fileQueryCache.get(cacheKey);
    if (cached && cached.version === fileIndexScannedCount) {
      return cached.results;
    }

    const queryTokens = tokenizeSearchText(q);
    const candidatePaths = new Set();

    if (queryTokens.length === 1) {
      const token = queryTokens[0];
      for (const [indexToken, paths] of fileTokenIndex.entries()) {
        if (indexToken.includes(token) || token.includes(indexToken)) {
          for (const filePath of paths) candidatePaths.add(filePath);
        }
      }
    } else {
      for (const token of queryTokens) {
        for (const [indexToken, paths] of fileTokenIndex.entries()) {
          if (indexToken.includes(token) || token.includes(indexToken)) {
            for (const filePath of paths) candidatePaths.add(filePath);
          }
        }
      }
    }

    if (!candidatePaths.size) {
      for (const item of fileIndex) candidatePaths.add(item.path);
    }

    const filtered = [];
    for (const filePath of candidatePaths) {
      const item = fileIndexByPath.get(filePath);
      if (!item) continue;
      if (filterType && filterType !== 'all') {
        if (filterType === 'desktop' && !item.isDesktopFile) continue;
        if (filterType !== 'desktop' && item.type !== filterType) continue;
      }

      const nameLower = normalizeSearchText(item.name || '');
      const pathLower = normalizeSearchText(item.path || '');
      if (!nameLower.includes(q) && !pathLower.includes(q)) continue;
      filtered.push({ item, score: scoreEntry(item, q) });
    }

    filtered.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (b.item.mtimeMs || 0) - (a.item.mtimeMs || 0);
    });

    const results = filtered.slice(0, safeLimit).map(({ item }) => ({
      name: item.name,
      path: item.path,
      parentPath: item.parentPath,
      type: item.type,
      ext: item.ext,
      mtimeMs: item.mtimeMs,
      size: item.size,
      isDirectory: item.isDirectory,
      isDesktopFile: item.isDesktopFile
    }));

    fileQueryCache.set(cacheKey, { version: fileIndexScannedCount, results });
    return results;
  }

  function getStatus() {
    return {
      ok: true,
      ready: fileIndexReady,
      building: fileIndexBuilding,
      scannedCount: fileIndexScannedCount,
      indexSize: fileIndex.length
    };
  }

  function createQueryResult(payload = {}) {
    const keyword = String(payload.keyword || '');
    const filterType = String(payload.filterType || 'all');
    const limit = Number(payload.limit) || 120;
    const results = searchFileIndex(keyword, filterType, limit);
    return { ok: true, ready: fileIndexReady, building: fileIndexBuilding, scannedCount: fileIndexScannedCount, total: results.length, results };
  }

  function getState() {
    return { fileIndexReady, fileIndexBuilding, fileIndexScannedCount, fileIndex, fileIndexByPath, fileTokenIndex, fileQueryCache };
  }

  return {
    buildFileIndex,
    searchFileIndex,
    getStatus,
    createQueryResult,
    getState,
    clearFileSearchIndexes,
    classifyEntry,
    normalizeSearchText,
    tokenizeSearchText
  };
}

module.exports = { createFileSearchService };
