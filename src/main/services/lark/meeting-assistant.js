const { execFile, execSync } = require('child_process');
const cliPath = 'C:\\Users\\lenovo\\scoop\\apps\\lark-cli\\1.0.20\\lark-cli.exe';
const win = { webContents: { send: () => {} } };

let globalConfig = {};

async function getMeetingConfig() {
  return new Promise(resolve => {
    resolve({
      remindAdvanceTime: 10 * 60 * 1000,
      todoKeywords: ["待办","负责","截止","要做","跟进","需要"],
      summaryCompressRate: 0.7,
      autoSyncTodo: true,
      autoTranscribe: true,
      userId: ""
    });
  });
}

async function checkUpcomingMeeting() {
  console.log("\n" + "=".repeat(80));
  console.log("🔍 检查会议...", new Date().toLocaleString('zh-CN'));
  console.log("🕐 当前系统时间戳:", Date.now());
  console.log("🕐 当前系统时间:", new Date().toLocaleString('zh-CN'));

  const args = [
    "calendar", "+agenda",
    "--as", "user"
  ];

  execFile(cliPath, args, async (error, stdout, stderr) => {
    if (error) {
      console.error("❌ CLI 错误:", stderr);
      return;
    }

    try {
      const result = JSON.parse(stdout);
      const events = result.data || []; 
      const now = Date.now();

      console.log(`\n📅 今日会议总数：${events.length}`);

      // 遍历所有会议，强制打印每一条的详细信息
      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        console.log(`\n${'-'.repeat(80)}`);
        console.log(`📋 会议 #${i+1}`);
        console.log(`  标题: ${event.summary}`);
        
        // 【关键调试】打印原始时间字段
        console.log(`  原始 start_time:`, JSON.stringify(event.start_time));
        console.log(`  原始 end_time:`, JSON.stringify(event.end_time));

        // 解析时间
        const startStr = event.start_time?.datetime;
        const endStr = event.end_time?.datetime;
        console.log(`  解析 startStr: ${startStr}`);
        console.log(`  解析 endStr: ${endStr}`);

        if (!startStr || !endStr) {
          console.log(`  ⚠️  缺少时间字段，跳过`);
          continue;
        }

        const startTime = new Date(startStr).getTime();
        const endTime = new Date(endStr).getTime();
        console.log(`  转换 startTime (ms): ${startTime}`);
        console.log(`  转换 endTime (ms): ${endTime}`);
        console.log(`  转换后开始时间: ${new Date(startTime).toLocaleString('zh-CN')}`);
        console.log(`  转换后结束时间: ${new Date(endTime).toLocaleString('zh-CN')}`);

        const timeDiff = startTime - now;
        const diffMin = Math.round(timeDiff / 1000 / 60);
        console.log(`  距离现在: ${diffMin} 分钟 (${timeDiff} ms)`);

        // 【关键调试】打印判断条件
        const isComing = diffMin >= 0 && diffMin <= 10;
        const isOngoing = now >= startTime && now < endTime;
        console.log(`  isComing (10分钟内): ${isComing}`);
        console.log(`  isOngoing (正在进行): ${isOngoing}`);

        if (isComing || isOngoing) {
          const status = isOngoing ? "🔥 正在进行" : "⏰ 即将开始";
          console.log(`\n✅ ${status}：${event.summary}`);
          
          const remindContent = await generateMeetingRemind(event);
          console.log("📢 提醒内容:", remindContent);
          
          win.webContents.send('meeting-remind', {
            title: event.summary,
            status: status,
            time: new Date(startTime).toLocaleString(),
            content: remindContent,
            meetingUrl: event.vchat?.meeting_url
          });

          await saveFullMeetingInfo(event, remindContent);
          startMeetingTranscriptPolling(event);
        } else {
          console.log(`  ❌ 不满足提醒条件，跳过`);
        }
      }

    } catch (e) {
      console.error("\n❌ 解析失败:", e.message);
      console.error("❌ 错误堆栈:", e.stack);
    }
  });
}

async function generateMeetingRemind(meeting) {
  const title = meeting.summary;
  const startTime = new Date(meeting.start_time.datetime).toLocaleString('zh-CN');
  const endTime = new Date(meeting.end_time.datetime).toLocaleTimeString('zh-CN', {hour:'2-digit', minute:'2-digit'});
  
  let attendeesText = "无";
  if (meeting.attendees && meeting.attendees.length > 0) {
    attendeesText = meeting.attendees.map(a => a.name || a.display_name || "未知").join('、');
  } else if (meeting.event_organizer) {
    attendeesText = meeting.event_organizer.display_name || "未知";
  }

  const meetingUrl = meeting.vchat?.meeting_url || "无视频会议链接";
  const rsvpStatus = meeting.self_rsvp_status === "accept" ? "✅ 已确认参加" : 
                     meeting.self_rsvp_status === "decline" ? "❌ 已拒绝" : 
                     meeting.self_rsvp_status === "tentative" ? "⚠️ 待定" : "❓ 未确认";

  return `📢 【${title}】
⏰ 时间：${startTime} - ${endTime}
👥 参会人：${attendeesText}
📌 我的状态：${rsvpStatus}
🔗 会议链接：${meetingUrl}
💡 智能助手已就位`;
}

async function saveFullMeetingInfo(meeting, remindContent) {
  console.log("💾 (演示模式) 保存会议信息到多维表格...");
}

let transcriptPollingTimer = null;

async function startMeetingTranscriptPolling(meeting) {
  stopMeetingTranscriptPolling();
  console.log(`🎤 (演示模式) 启动会议妙记监听：${meeting.summary}`);
}

function stopMeetingTranscriptPolling() {
  if (transcriptPollingTimer) {
    clearInterval(transcriptPollingTimer);
    transcriptPollingTimer = null;
  }
}

(async () => {
  console.log("✅ 会议助手启动成功（每分钟自动检查）");
  console.log("🕐 系统启动时间:", new Date().toLocaleString('zh-CN'));
  globalConfig = await getMeetingConfig();
  setInterval(checkUpcomingMeeting, 60 * 1000);
  checkUpcomingMeeting();
})();