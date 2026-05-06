const { startLarkWsClient } = require('./ws-client');

/**
 * 启动飞书实时连接入口
 * 输入: options(object) 配置项，包含 win、ws、logger、url、reconnectDelayMs
 * 输出: object，连接控制器
 */
function startLarkRealtimeConnection({ ws, win, logger = console, url, reconnectDelayMs }) {
  return startLarkWsClient({ ws, win, logger, url, reconnectDelayMs });
}

module.exports = {
  startLarkRealtimeConnection
};
