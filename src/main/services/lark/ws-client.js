const DEFAULT_WS_URL = '';

/**
 * 归一化飞书 WebSocket 消息
 * 输入: payload(object) 原始消息对象
 * 输出: object，统一后的消息对象
 */
function normalizeLarkWsPayload(payload) {
  const type = String(payload?.type || payload?.eventType || 'message');
  const data = payload?.data && typeof payload.data === 'object' ? payload.data : payload;
  return {
    type,
    data,
    raw: payload
  };
}

/**
 * 启动飞书实时 WebSocket 客户端
 * 输入: options(object) 配置项，包含 ws 构造器、渲染进程窗口、logger、url、reconnectDelayMs
 * 输出: object，包含 close() 的连接控制器
 */
function startLarkWsClient({
  ws,
  win,
  logger = console,
  url = DEFAULT_WS_URL,
  reconnectDelayMs = 3000
}) {
  let socket = null;
  let shouldReconnect = true;
  let reconnectTimer = null;

  /**
   * 将消息转发到渲染进程
   * 输入: payload(object) WebSocket 消息内容
   * 输出: 无
   */
  function forwardMessage(payload) {
    if (!payload) return;
    const normalized = normalizeLarkWsPayload(payload);
    win?.webContents?.send?.('chat:message-received', normalized);
    win?.webContents?.send?.('ws:message', normalized);
  }

  /**
   * 关闭当前连接并停止重连
   * 输入: 无
   * 输出: 无
   */
  function close() {
    shouldReconnect = false;
    if (reconnectTimer) clearTimeout(reconnectTimer);
    reconnectTimer = null;
    try { socket?.close?.(); } catch {}
  }

  /**
   * 创建并绑定 WebSocket 连接
   * 输入: 无
   * 输出: 无
   */
  function connect() {
    if (!url) {
      logger?.warn?.('[ws] realtime url is empty, skip connect');
      return;
    }
    socket = new ws(url);

    socket.on('message', (raw) => {
      try {
        const payload = JSON.parse(String(raw));
        forwardMessage(payload);
      } catch (err) {
        logger?.warn?.('[ws] message parse failed:', err?.message || err);
      }
    });

    socket.on('close', () => {
      if (!shouldReconnect) return;
      reconnectTimer = setTimeout(connect, reconnectDelayMs);
    });

    socket.on('error', (err) => {
      logger?.warn?.('[ws] error:', err?.message || err);
    });
  }

  connect();
  return { close };
}

module.exports = { DEFAULT_WS_URL, normalizeLarkWsPayload, startLarkWsClient };
