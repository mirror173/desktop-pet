const WebSocket = require('ws');

const briefingContent = process.env.BRIEFING_CONTENT;

if (!briefingContent) {
  console.error('❌ 未提供真实到岗内容，请先通过环境变量 BRIEFING_CONTENT 传入。');
  process.exit(1);
}

console.log('🔄 正在同步真实到岗梳理到桌宠...');

const ws = new WebSocket('ws://127.0.0.1:3000');

ws.onopen = () => {
  try {
    ws.send(JSON.stringify({
      type: 'message',
      data: {
        id: require('crypto').randomUUID(),
        timestamp: Date.now(),
        from: 'openclaw',
        content: briefingContent,
        role: 'assistant',
        type: 'work-briefing'
      }
    }));

    console.log('✅ 已推送真实到岗梳理到桌宠，请到专属模块查看！');
    setTimeout(() => {
      ws.close();
      process.exit(0);
    }, 1000);
  } catch (err) {
    console.error('❌ 同步失败:', err.message);
    ws.close();
    process.exit(1);
  }
};

ws.onerror = () => {
  console.error('❌ 连接桌宠失败，请先启动桌宠应用');
  process.exit(1);
};
