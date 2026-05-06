const fs = require('fs');
const path = require('path');

function createKnowledgeService({ getResourcePath, pathsConfig = {}, appConfig = {} }) {
  function getKnowledgeDirPath() {
    return getResourcePath(pathsConfig.knowledgeDir || appConfig.paths?.knowledgeDir || 'knowledge');
  }

  function getKnowledgeFilePath() {
    return path.join(getKnowledgeDirPath(), 'kb.json');
  }

  function fileExists(targetPath) {
    try {
      return fs.existsSync(targetPath);
    } catch {
      return false;
    }
  }

  function ensureKnowledgeFile() {
    const dirPath = getKnowledgeDirPath();
    const filePath = getKnowledgeFilePath();

    if (!fileExists(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    if (!fileExists(filePath)) {
      fs.writeFileSync(filePath, '[]', 'utf8');
    }

    return filePath;
  }

  function loadKnowledgeFromFile() {
    try {
      const filePath = ensureKnowledgeFile();
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveKnowledgeToFile(records = []) {
    try {
      const filePath = ensureKnowledgeFile();
      const data = Array.isArray(records) ? records : [];
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      return { ok: true, path: filePath };
    } catch (err) {
      return { ok: false, error: err?.message || 'save failed' };
    }
  }

  return {
    getKnowledgeDirPath,
    getKnowledgeFilePath,
    ensureKnowledgeFile,
    loadKnowledgeFromFile,
    saveKnowledgeToFile
  };
}

module.exports = { createKnowledgeService };
