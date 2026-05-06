const path = require('path');
const { spawn } = require('child_process');

function createLlmService({ app, appConfig, llmConfig, pathsConfig, getResourcePath, resolveResourcePath }) {
  let llmProcess = null;
  let llmReady = false;
  let llmPort = Number(appConfig.runtime?.llmPort || llmConfig.port) || 18080;
  let llmStartupError = '';
  let llmStartupPromise = null;

  function fileExists(targetPath) {
    try {
      const fs = require('fs');
      return fs.existsSync(targetPath);
    } catch {
      return false;
    }
  }

  function resolveLlamaServerPath() {
    const candidates = app.isPackaged
      ? [
          path.join(process.resourcesPath, 'bin', 'llama-server.exe'),
          path.join(process.resourcesPath, 'llama-server.exe')
        ]
      : [
          path.join(__dirname, '../..', 'bin', 'llama-server.exe'),
          path.join(__dirname, '../..', 'tools', 'llama', 'llama-server.exe'),
          path.join(__dirname, '../..', 'llama-server.exe')
        ];

    return candidates.find((p) => fileExists(p)) || '';
  }

  function getLlmConfigPathCandidates() {
    const exeDir = path.dirname(process.execPath);
    const fileName = pathsConfig.llmConfigFileName || appConfig.paths?.llmConfigFileName || 'llm.config.json';
    const modelsDir = pathsConfig.modelsDir || appConfig.paths?.modelsDir || 'models';
    const binDir = pathsConfig.binDir || appConfig.paths?.binDir || 'bin';
    return app.isPackaged
      ? [
          path.join(exeDir, fileName),
          path.join(process.resourcesPath, modelsDir, fileName),
          path.join(process.resourcesPath, binDir, fileName)
        ]
      : [
          path.join(__dirname, '../..', modelsDir, fileName),
          path.join(__dirname, '../..', binDir, fileName),
          path.join(__dirname, '../..', fileName)
        ];
  }

  function resolveModelPath() {
    const cfg = llmConfig;
    const modelName = cfg.modelName;
    const exeDir = path.dirname(process.execPath);

    const candidates = app.isPackaged
      ? [
          path.join(exeDir, modelName),
          path.join(process.resourcesPath, 'models', modelName),
          path.join(process.resourcesPath, modelName)
        ]
      : [
          path.join(__dirname, '../..', 'models', modelName),
          path.join(__dirname, '../..', modelName)
        ];

    return candidates.find((p) => fileExists(p)) || '';
  }

  async function pingLlmServer(timeoutMs = 1200) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(`http://127.0.0.1:${llmPort}/health`, {
        method: 'GET',
        signal: controller.signal
      });
      return res.ok;
    } catch {
      return false;
    } finally {
      clearTimeout(timer);
    }
  }

  async function waitLlmReady(maxWaitMs = 25000) {
    const start = Date.now();
    while (Date.now() - start < maxWaitMs) {
      if (!llmProcess || llmProcess.killed) return false;
      const ok = await pingLlmServer(1000);
      if (ok) return true;
      await new Promise((r) => setTimeout(r, 400));
    }
    return false;
  }

  async function ensureLlmServerStarted() {
    if (llmReady && llmProcess && !llmProcess.killed) return true;
    if (llmStartupPromise) return llmStartupPromise;

    llmStartupPromise = (async () => {
      const serverPath = resolveLlamaServerPath();
      if (!serverPath) {
        llmStartupError = '未找到 llama-server.exe';
        llmStartupPromise = null;
        return false;
      }

      const modelPath = resolveModelPath();
      if (!modelPath) {
        llmStartupError = '未找到模型文件 Qwen2.5-0.5B-Instruct-mate-q4_k_m.gguf';
        llmStartupPromise = null;
        return false;
      }

      const cfg = llmConfig;
      const args = [
        '-m',
        modelPath,
        '-c',
        String(cfg.contextSize),
        '-t',
        String(cfg.threads),
        '--host',
        '127.0.0.1',
        '--port',
        String(llmPort),
        '--no-webui'
      ];

      llmProcess = spawn(serverPath, args, {
        windowsHide: true,
        stdio: 'ignore',
        detached: false
      });

      llmProcess.on('exit', () => {
        llmReady = false;
        llmProcess = null;
      });

      llmProcess.on('error', (err) => {
        llmStartupError = `模型服务启动失败: ${err?.message || 'unknown error'}`;
        llmReady = false;
        llmProcess = null;
      });

      const ready = await waitLlmReady();
      llmReady = ready;
      llmStartupError = ready ? '' : (llmStartupError || '模型服务启动超时');
      llmStartupPromise = null;
      return ready;
    })();

    return llmStartupPromise;
  }

  async function callLocalLlmChat(payload = {}) {
    const messages = Array.isArray(payload.messages) ? [...payload.messages] : [];
    const cfg = llmConfig;

    if (cfg.provider === 'doubao') {
      const body = {
        model: cfg.modelId,
        messages,
        temperature: Number.isFinite(payload.temperature) ? payload.temperature : cfg.temperature,
        top_p: Number.isFinite(payload.top_p) ? payload.top_p : cfg.top_p,
        max_tokens: Number.isFinite(payload.max_tokens) ? payload.max_tokens : cfg.max_tokens,
        stream: false
      };

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 25000);

      try {
        const res = await fetch(`${cfg.endpoint}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cfg.apiKey}`
          },
          body: JSON.stringify(body),
          signal: controller.signal
        });

        if (!res.ok) {
          const text = await res.text().catch(() => '');
          return {
            ok: false,
            error: `豆包接口错误(${res.status}) ${text.slice(0, 120)}`
          };
        }

        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content?.trim();

        if (!content) return { ok: false, error: '模型返回为空' };
        return { ok: true, reply: content };
      } catch (err) {
        return { ok: false, error: `豆包调用失败: ${err?.message || 'unknown error'}` };
      } finally {
        clearTimeout(timer);
      }
    }

    const ready = await ensureLlmServerStarted();
    if (!ready) return { ok: false, error: llmStartupError || '模型服务不可用' };

    const body = {
      messages,
      temperature: Number.isFinite(payload.temperature) ? payload.temperature : cfg.temperature,
      top_p: Number.isFinite(payload.top_p) ? payload.top_p : cfg.top_p,
      max_tokens: Number.isFinite(payload.max_tokens) ? payload.max_tokens : cfg.max_tokens,
      stream: false
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);

    try {
      const res = await fetch(`http://127.0.0.1:${llmPort}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        return {
          ok: false,
          error: `模型接口错误(${res.status}) ${text.slice(0, 120)}`
        };
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content?.trim();
      if (!content) return { ok: false, error: '模型返回为空' };
      return { ok: true, reply: content };
    } catch (err) {
      return { ok: false, error: `模型调用失败: ${err?.message || 'unknown error'}` };
    } finally {
      clearTimeout(timer);
    }
  }

  function getStatus() {
    return { llmProcess, llmReady, llmPort, llmStartupError };
  }

  function shutdown() {
    if (llmProcess && !llmProcess.killed) llmProcess.kill();
  }

  return {
    resolveLlamaServerPath,
    getLlmConfigPathCandidates,
    resolveModelPath,
    ensureLlmServerStarted,
    callLocalLlmChat,
    getStatus,
    shutdown
  };
}

module.exports = { createLlmService };
