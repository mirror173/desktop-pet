const bubbleChat = document.getElementById('bubbleChat') || document.getElementById('bubble');
const bubbleSelf = document.getElementById('bubbleSelf') || document.getElementById('bubble');
const plannerPanel = document.getElementById('plannerPanel');
const characterTapArea = document.getElementById('characterTapArea');
const characterWrap = document.getElementById('characterWrap');
const characterImg = document.getElementById('character');
const characterGif = document.getElementById('characterGif');
const collapsePanelBtn = document.getElementById('collapsePanelBtn');
const broomProp = document.getElementById('broomProp');

const quickInput = document.getElementById('quickInput');
const quickParseBtn = document.getElementById('quickParseBtn');
const modeChatBtn = document.getElementById('modeChat');
const modeTaskBtn = document.getElementById('modeTask');
const confirmCard = document.getElementById('confirmCard');
const taskTitle = document.getElementById('taskTitle');
const taskTime = document.getElementById('taskTime');
const taskRepeat = document.getElementById('taskRepeat');
const weeklyDaysRow = document.getElementById('weeklyDaysRow');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');

const reminderOverlay = document.getElementById('reminderOverlay');
const reminderText = document.getElementById('reminderText');
const reminderActions = document.getElementById('reminderActions');
const doneBtn = document.getElementById('doneBtn');
const laterBtn = document.getElementById('laterBtn');
const skipBtn = document.getElementById('skipBtn');

const planList = document.getElementById('planList');
const pet = document.getElementById('pet');

const advancedDock = document.getElementById('advancedDock');
const advancedToggleFab = document.getElementById('advancedToggleFab');
const advancedQuickMenu = document.getElementById('advancedQuickMenu');
const advancedPanels = document.getElementById('advancedPanels');
const advancedFabButtons = Array.from(document.querySelectorAll('#advancedQuickMenu .adv-fab[data-panel]'));
const feishuModeBtn = document.querySelector('#advancedQuickMenu .adv-fab[data-feishu-mode="toggle"]');
const webAssistantBtn = document.getElementById('webAssistantBtn');

let webAssistantEnabled = false;
let webAssistantSelection = '';
let webAssistantAskButton = null;
let webAssistantContextCache = '';

const advancedPanelNodes = Array.from(document.querySelectorAll('.adv-panel'));
const trajectoryTodayDate = document.getElementById('trajectoryTodayDate');
const trajectoryTags = document.getElementById('trajectoryTags');
const trajectoryStats = document.getElementById('trajectoryStats');
const trajectoryTimeline = document.getElementById('trajectoryTimeline');
const trajectoryTimelineDate = document.getElementById('trajectoryTimelineDate');
const trajectoryCategoryTabs = document.getElementById('trajectoryCategoryTabs');
const trajectoryStreak = document.getElementById('trajectoryStreak');
const trajectoryRate = document.getElementById('trajectoryRate');
const trajectoryAddBtn = document.getElementById('trajectoryAddBtn');
const trajectoryDateBtn = document.getElementById('trajectoryDateBtn');
const trajectoryShortDate = document.getElementById('trajectoryShortDate');
const trajectoryWeekDate = document.getElementById('trajectoryWeekDate');
const trajectoryWeekToggle = document.getElementById('trajectoryWeekToggle');
const trajectoryWeeklyRows = document.getElementById('trajectoryWeeklyRows');
const waterDecBtn = document.getElementById('waterDecBtn');
const waterIncBtn = document.getElementById('waterIncBtn');
const waterProgressText = document.getElementById('waterProgressText');
const waterProgressFill = document.getElementById('waterProgressFill');
const trajectorySpecialSettings = document.getElementById('trajectorySpecialSettings');

const checkinV2Message = document.getElementById('checkinV2Message');
const checkinV2Grid = document.getElementById('checkinV2Grid');
const checkinV2TaskInput = document.getElementById('checkinV2TaskInput');
const checkinV2AddTaskBtn = document.getElementById('checkinV2AddTaskBtn');
const checkinV2CountdownNameInput = document.getElementById('checkinV2CountdownNameInput');
const checkinV2CountdownDateInput = document.getElementById('checkinV2CountdownDateInput');
const checkinV2AddCountdownBtn = document.getElementById('checkinV2AddCountdownBtn');
const checkinV2CountdownList = document.getElementById('checkinV2CountdownList');
const workReviewBtn = document.getElementById('workReviewBtn');
const workReviewNotes = document.getElementById('workReviewNotes');
const workReviewGenerateBtn = document.getElementById('workReviewGenerateBtn');
const workReviewCopyBtn = document.getElementById('workReviewCopyBtn');
const workReviewOutput = document.getElementById('workReviewOutput');
const taskQuickList = document.getElementById('taskQuickList');
const taskQuickInput = document.getElementById('taskQuickInput');
const taskQuickAddBtn = document.getElementById('taskQuickAddBtn');
const taskTotalCount = document.getElementById('taskTotalCount');
const taskDoneCount = document.getElementById('taskDoneCount');
const taskProgressPercent = document.getElementById('taskProgressPercent');
const controlCenterLinks = document.getElementById('controlCenterLinks');
const controlCenterTitle = document.getElementById('controlCenterTitle');
const controlCenterDesc = document.getElementById('controlCenterDesc');
const controlCenterPages = Array.from(document.querySelectorAll('.control-center-page'));
const controlCenterBackBtn = document.querySelector('[data-control-back]');
const controlCenterBackMainBtn = document.querySelector('[data-control-back-main]');
const controlCenterNameInput = document.getElementById('controlCenterNameInput');
const controlCenterUrlInput = document.getElementById('controlCenterUrlInput');
const controlCenterIconInput = document.getElementById('controlCenterIconInput');
const controlCenterAddBtn = document.getElementById('controlCenterAddBtn');


const searchInput = document.getElementById('searchInput');
const filterBar = document.getElementById('filterBar');
const resultList = document.getElementById('resultList');
const sortFieldSelect = document.getElementById('sortFieldSelect');
const sortOrderSelect = document.getElementById('sortOrderSelect');

const ADVANCED_ICON_STORAGE_KEY = 'lz_pet_adv_icons_v1';
let advancedMenuHideTimer = null;
const ADVANCED_MENU_AUTO_COLLAPSE_MS = 3000;

// 知识库（页面可能不存在这些节点，所以后续使用需保持可选链/判空）
const kbQuestion = document.getElementById('kbQuestion');
const kbAnswer = document.getElementById('kbAnswer');
const kbKeywords = document.getElementById('kbKeywords');
const kbList = document.getElementById('kbList');
const kbAddBtn = document.getElementById('kbAddBtn');
const kbUseInputBtn = document.getElementById('kbUseInputBtn');

// 飞书配置相关元素
const larkStatus = document.getElementById('larkStatus');
const larkStatusText = document.getElementById('larkStatusText');
const larkCurrentAccount = document.getElementById('larkCurrentAccount');

const larkLoginArea = document.getElementById('larkLoginArea');
const larkLoggedInArea = document.getElementById('larkLoggedInArea');
const larkLoginBtn = document.getElementById('larkLoginBtn');
const larkSwitchBtn = document.getElementById('larkSwitchBtn');
const larkSwitchBtnLoggedIn = document.getElementById('larkSwitchBtnLoggedIn');
const larkRefreshBtn = document.getElementById('larkRefreshBtn');
const larkQrArea = document.getElementById('larkQrArea');
const larkQrCode = document.getElementById('larkQrCode');
const larkLoginLink = document.getElementById('larkLoginLink');
const larkLogoutBtn = document.getElementById('larkLogoutBtn');
const larkTestBtn = document.getElementById('larkTestBtn');
const larkConfigSection = document.getElementById('larkConfigSection');
const larkDefaultChatSelect = document.getElementById('larkDefaultChatSelect');
const larkRefreshChatsBtn = document.getElementById('larkRefreshChatsBtn');
const larkBitableToken = document.getElementById('larkBitableToken');
const larkBriefingTableId = document.getElementById('larkBriefingTableId');
const larkWeeklyTableId = document.getElementById('larkWeeklyTableId');
const larkSaveConfigBtn = document.getElementById('larkSaveConfigBtn');
const larkConfigStatus = document.getElementById('larkConfigStatus');
const LARK_LOGIN_POLL_INTERVAL_MS = 1500;
const LARK_LOGIN_TIMEOUT_MS = 120000;

let hideBubbleChatTimer = null;
let hideBubbleChatFadeTimer = null;
let hideBubbleSelfTimer = null;
let hideBubbleSelfFadeTimer = null;
let panelAutoHideTimer = null;
const PANEL_AUTO_HIDE_MS = 30000;

const AVATAR_TOTAL = 6;
const AVATAR_BASE = './assets/形象';
const AVATAR_EXT = '.jpg';
const AVATAR_REFRESH_MS = 45000;
const AVATAR_SCALE_DEFAULT = 0.7;
const AVATAR_SCALE_EXEMPT_INDEX = 8;
// 形象缩放后，为了让气泡别离角色太远，把角色整体向上“抬”一点（不改 transform，避免覆盖动画）
const AVATAR_SCALE_LIFT_PX = Math.round(230 * (1 - AVATAR_SCALE_DEFAULT)); // 约 69px
const DOUBLE_TAP_GIF_DURATION_MS = 2200;
const AVATAR_DBL_VIDEO_MAP = {
  1: ['./assets/形象1.webm', './assets/形象1.mov'],
  2: ['./assets/形象2.webm', './assets/形象2.mov']
};
const IDLE_ACTION_INTERVAL_MS = 5000;
const POKE_ANGRY_WINDOW_MS = 3000;
const POKE_ANGRY_THRESHOLD = 4;
let avatarRefreshTimer = null;
let idleActionTimer = null;
let pokeTimestamps = [];
let isActing = false;
let lastUserActivityAt = Date.now();
let nextCareAt = 0;

const CARE_MIN_MS = 60 * 1000;
const CARE_MAX_MS = 140 * 1000;
const CARE_AFTER_USER_IDLE_MS = 25 * 1000;
const CARE_MESSAGES = [
  '水喝了没？别等我盯着你。',
  '休息两分钟。眼睛别硬撑。',
  '别逞强。累了就说。',
  '今天还好吗？',
  '如果你现在有点乱，就先把呼吸放慢。',
  '我在。你可以慢慢来。',
  '先把肩放松，别绷着。',
  '去吃点东西。别糊弄。',
  '记得按时睡觉。你熬夜我会不高兴。',
  '做得已经够好了，别一直否定自己。'
];

function scheduleNextCare(from = Date.now()) {
  const span = CARE_MAX_MS - CARE_MIN_MS;
  const wait = CARE_MIN_MS + Math.random() * Math.max(1, span);
  nextCareAt = from + wait;
}

function maybeSendCareMessage() {
  const now = Date.now();
  if (nextCareAt <= 0) scheduleNextCare(now);
  if (now < nextCareAt) return;
  if (now - lastUserActivityAt < CARE_AFTER_USER_IDLE_MS) return;
  if (characterPointerActive || characterDragging) return;
  if (confirmCard && !confirmCard.classList.contains('hidden')) return;
  if (reminderActions && !reminderActions.classList.contains('hidden')) return;
  if (document.activeElement === quickInput) return;
  if (isPanelExpanded()) return;

  showMessage(pickOne(CARE_MESSAGES), 'chat');
  scheduleNextCare(now);
}

const PLAN_STORAGE_KEY = 'lz_pet_plans_v2';
const TRAJECTORY_STORAGE_KEY = 'lz_pet_trajectory_v1';
const LEGACY_CHECKIN_STORAGE_KEYS = ['lz_pet_checkins_v1', 'lz_pet_checkin_v1', 'lz_pet_checkin_data'];
const KNOWLEDGE_BASE_KEY = 'lz_pet_knowledge_base_v1';
const TRAJECTORY_DEFAULT_TAGS = [
  { id: 'study', name: '学习', icon: '📚', category: '学习' },
  { id: 'exercise', name: '运动', icon: '🏃', category: '生活' },
  { id: 'reading', name: '阅读', icon: '📖', category: '学习' },
  { id: 'work', name: '工作', icon: '💼', category: '工作' },
  { id: 'life', name: '生活', icon: '🌿', category: '生活' }
];
let plans = [];
let knowledgeBase = [];
let knowledgeIndex = {
  byToken: new Map(),
  byKeyword: new Map(),
  byQuestionPrefix: new Map()
};
let pendingDraft = null;
let activeReminderId = null;
let inputMode = 'chat';
let feishuModeEnabled = false;

let trajectoryState = {
  version: 1,
  tags: [...TRAJECTORY_DEFAULT_TAGS],
  records: [],
  daily: {},
  activeCategory: '全部',
  weeklyExpanded: false,
  special: {
    key: 'water',
    title: '每日饮水轨迹',
    current: 0,
    target: 8,
    updatedDateKey: ''
  }
};

const CHECKIN_V2_STORAGE_KEY = 'lz_pet_checkin_cards_v2';
const CHECKIN_V2_IDLE_MS = 60000;
const CHECKIN_V2_MAX_TASKS = 16;
const CHECKIN_V2_MAX_COUNTDOWNS = 10;

const CHECKIN_V2_MESSAGES_DONE = [
  '做得不错。',
  '这项推进得很稳。继续。',
  '专注很好，保持。',
  '「{task}」拿下了，效率在线。',
  '很好，又往前一步。'
];
const CHECKIN_V2_MESSAGES_UNDONE = [
  '这就退回了？我可没同意。',
  '节奏掉了，拉回来。',
  '别松劲，你可以更稳。'
];
const CHECKIN_V2_MESSAGES_NUDGE = [
  '笨蛋，快开始吧。我陪你。',
  '进度还在原地。先做最简单的那一项。',
  '别拖。先完成一项，再说难的。',
  '我看着你，今天别想摆烂。'
];
const CHECKIN_V2_MESSAGES_REWARD = [
  '全完成。今天表现优秀，批准你骄傲五分钟。',
  '全部打卡结束。做得很漂亮。',
  '收工。你今天的执行力，满分。',
  '很好，任务清零。奖励你一份布丁。'
];

const CHECKIN_V2_DEFAULT_TASKS = [];
const CHECKIN_V2_LEGACY_TASK_NAMES = ['每日晨读', '白鹭申论', '花生判断', '行测刷题', '时政365', '人民日报', '晚课', '常识'];
const CHECKIN_V2_LEGACY_COUNTDOWN_NAMES = ['国考', '放假'];

let checkinV2State = {
  tasks: [],
  countdowns: [],
  message: '还不开始？',
  lastActionTime: 0
};

function loadAdvancedIcons() {
  try {
    const raw = localStorage.getItem(ADVANCED_ICON_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveAdvancedIcons(map) {
  try {
    localStorage.setItem(ADVANCED_ICON_STORAGE_KEY, JSON.stringify(map || {}));
  } catch {
    // ignore
  }
}

function setFabActive(panelName) {
  advancedFabButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.panel === panelName);
  });
}

function isAdvancedMenuExpanded() {
  return advancedDock ? !advancedDock.classList.contains('collapsed') : false;
}

function hasOpenAdvancedPanel() {
  return advancedPanelNodes.some((panel) => !panel.classList.contains('hidden'));
}

function clearAdvancedMenuAutoCollapseTimer() {
  if (!advancedMenuHideTimer) return;
  clearTimeout(advancedMenuHideTimer);
  advancedMenuHideTimer = null;
}

function scheduleAdvancedMenuAutoCollapse() {
  clearAdvancedMenuAutoCollapseTimer();
  if (!isAdvancedMenuExpanded() || hasOpenAdvancedPanel()) return;
  advancedMenuHideTimer = setTimeout(() => {
    if (!isAdvancedMenuExpanded() || hasOpenAdvancedPanel()) return;
    collapseAdvancedMenu();
  }, ADVANCED_MENU_AUTO_COLLAPSE_MS * 2);
}

function expandAdvancedMenu() {
  if (!advancedDock) return;
  advancedDock.classList.remove('collapsed');
  advancedToggleFab?.setAttribute('aria-expanded', 'true');
  if (!hasOpenAdvancedPanel()) scheduleAdvancedMenuAutoCollapse();
}

function collapseAdvancedMenu() {
  if (!advancedDock) return;
  advancedDock.classList.add('collapsed');
  advancedToggleFab?.setAttribute('aria-expanded', 'false');
  clearAdvancedMenuAutoCollapseTimer();
}

function hideAllAdvancedPanels() {
  advancedPanelNodes.forEach((panel) => panel.classList.add('hidden'));
  advancedFabButtons.forEach((btn) => btn.classList.remove('active'));
  window.api?.setWindowMode?.('pet');
}

const CONTROL_CENTER_DEFAULT_LINKS = [
  { id: 'mail', name: '邮箱', url: 'https://mail.google.com', icon: '✉️' },
  { id: 'calendar', name: '日历', url: 'https://calendar.google.com', icon: '📅' },
  { id: 'tasks', name: '任务板', url: 'https://www.notion.so', icon: '🗂️' },
  { id: 'docs', name: '文档', url: 'https://docs.google.com', icon: '📄' }
];
const CONTROL_CENTER_LINKS_KEY = 'lz_pet_control_center_links_v1';

function loadControlCenterLinks() {
  try {
    const raw = localStorage.getItem(CONTROL_CENTER_LINKS_KEY);
    if (!raw) return CONTROL_CENTER_DEFAULT_LINKS.slice();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return CONTROL_CENTER_DEFAULT_LINKS.slice();
    return parsed
      .map((item, idx) => ({
        id: String(item?.id || `link_${idx}_${Date.now()}`),
        name: String(item?.name || '').trim().slice(0, 16),
        url: String(item?.url || '').trim(),
        icon: String(item?.icon || '🔗').trim().slice(0, 2)
      }))
      .filter((item) => item.name && item.url);
  } catch {
    return CONTROL_CENTER_DEFAULT_LINKS.slice();
  }
}

function saveControlCenterLinks() {
  try {
    localStorage.setItem(CONTROL_CENTER_LINKS_KEY, JSON.stringify(CONTROL_CENTER_LINKS));
  } catch {
    // ignore
  }
}

let CONTROL_CENTER_LINKS = loadControlCenterLinks();
let controlCenterPage = 'main';

function setControlCenterPage(page = 'main') {
  const allowed = new Set(['main', 'task']);
  controlCenterPage = allowed.has(page) ? page : 'main';
  controlCenterPages.forEach((node) => {
    node.classList.toggle('hidden', node.dataset.controlPage !== controlCenterPage);
  });
  if (controlCenterBackBtn) controlCenterBackBtn.hidden = controlCenterPage === 'main';
  if (controlCenterTitle) controlCenterTitle.textContent = '控制中心';
  if (controlCenterDesc) {
    controlCenterDesc.textContent = '像控制中心一样，一键触达高频效率功能。';
  }
}

function renderControlCenterLinks() {
  if (!controlCenterLinks) return;
  if (!Array.isArray(CONTROL_CENTER_LINKS) || CONTROL_CENTER_LINKS.length === 0) {
    CONTROL_CENTER_LINKS = CONTROL_CENTER_DEFAULT_LINKS.slice();
    saveControlCenterLinks();
  }
  controlCenterLinks.innerHTML = CONTROL_CENTER_LINKS.map((item) => `
    <div class="control-center-link-row" data-link-id="${item.id}">
      <button class="control-center-link" type="button" data-open-url="${item.url}">${item.icon} ${item.name}</button>
      <button class="control-center-link-remove" type="button" data-remove-link="${item.id}" aria-label="删除网页">×</button>
    </div>
  `).join('');
}

function syncControlCenterInputs() {
  if (controlCenterNameInput) controlCenterNameInput.value = '';
  if (controlCenterUrlInput) controlCenterUrlInput.value = '';
  if (controlCenterIconInput) controlCenterIconInput.value = '';
}

function openControlCenterAction(action) {
  if (action === 'task') {
    setControlCenterPage('task');
    expandPlannerPanel();
    setInputMode('task');
    return;
  }
  if (action === 'work-arrival') {
    collapseAdvancedMenu();
    hideAllAdvancedPanels();
    
    const originalIcon = '🚀';
    showMessage('⏳ 正在生成到岗梳理...', 'chat');

    try {
      window.api?.executeCli?.({
        command: 'node',
        args: ['scripts/test-briefing-fetch.js'],
        cwd: 'd:\\P5JS'
      }).then(execResult => {
        let resultPayload = getBriefingFallbackPayload();
        if (execResult.ok) {
          const output = execResult.output || '';
          resultPayload = formatBriefingOutput(output);
        } else {
          resultPayload = {
            ...getBriefingFallbackPayload(),
            error: `执行拉取脚本失败: ${execResult.error || '未知错误'}`
          };
        }

        const resultText = renderBriefingPayload(resultPayload);
        showMessage(resultText, 'chat', { durationMs: 30000, className: 'work-arrival-bubble' });
        if (bubbleChat) bubbleChat.scrollTop = 0;
      }).catch(err => {
        showMessage(`❌ 一键梳理失败: ${err.message || '未知错误'}`, 'chat', { durationMs: 5000 });
      });
    } catch (err) {
      showMessage(`❌ 一键梳理失败: ${err.message || '未知错误'}`, 'chat', { durationMs: 5000 });
    }
    return;
  }
  if (action === 'meeting-assistant') {
    collapseAdvancedMenu();
    hideAllAdvancedPanels();
    
    showMessage('⏳ 正在查询今日会议信息...', 'chat');

    try {
      // 直接调用lark-cli查询日历，和meeting-assistant逻辑一致，一次性执行
      window.api?.executeCli?.({
        command: 'C:\\Users\\lenovo\\scoop\\apps\\lark-cli\\1.0.20\\lark-cli.exe',
        args: ['calendar', '+agenda', '--as', 'user'],
        cwd: 'd:\\P5JS'
      }).then(execResult => {
        if (execResult.ok) {
          const output = execResult.output || '';
          let resultText = '🎤 【今日会议全链路助手】\n\n';
          
          try {
            const result = JSON.parse(output);
            const events = result.data || []; 
            const now = Date.now();

            resultText += `📅 今日会议总数：${events.length}\n\n`;

            // 遍历所有会议
            for (let i = 0; i < events.length; i++) {
              const event = events[i];
              const startStr = event.start_time?.datetime;
              const endStr = event.end_time?.datetime;
              
              if (!startStr || !endStr) continue;
              
              const startTime = new Date(startStr).getTime();
              const endTime = new Date(endStr).getTime();
              const timeDiff = startTime - now;
              const diffMin = Math.round(timeDiff / 1000 / 60);
              
              const isComing = diffMin >= 0 && diffMin <= 10;
              const isOngoing = now >= startTime && now < endTime;
              const status = isOngoing ? "🔥 正在进行" : isComing ? "⏰ 即将开始" : "📌 今日会议";
              
              const attendeesText = event.attendees?.length > 0 
                ? event.attendees.map(a => a.name || a.display_name || "未知").join('、')
                : event.event_organizer?.display_name || "未知";
              
              const meetingUrl = event.vchat?.meeting_url || "";
               const rsvpStatus = event.self_rsvp_status === "accept" ? "✅ 已确认参加" : 
                                event.self_rsvp_status === "decline" ? "❌ 已拒绝" : 
                                event.self_rsvp_status === "tentative" ? "⚠️ 待定" : "❓ 未确认";

               resultText += `${status}：${event.summary}\n`;
               resultText += `⏰ 时间：${new Date(startTime).toLocaleString('zh-CN')} - ${new Date(endTime).toLocaleTimeString('zh-CN', {hour:'2-digit', minute:'2-digit'})}\n`;
               resultText += `👥 参会人：${attendeesText}\n`;
               resultText += `📌 我的状态：${rsvpStatus}\n`;
               if (meetingUrl) {
                 resultText += `🔗 会议链接：${meetingUrl}\n\n`;
               } else {
                 resultText += `🔗 会议链接：无视频会议链接\n\n`;
               }
            }
            
            showMessage(resultText.trim(), 'chat', { durationMs: 30000, className: 'meeting-assistant-bubble' });
          } catch (e) {
            showMessage(`❌ 会议查询失败: ${e.message}`, 'chat', { durationMs: 5000 });
          }
          
          if (bubbleChat) bubbleChat.scrollTop = 0;
        } else {
          showMessage(`❌ 会议查询失败: ${execResult.error || '未知错误'}`, 'chat', { durationMs: 5000 });
        }
      }).catch(err => {
        showMessage(`❌ 会议查询失败: ${err.message || '未知错误'}`, 'chat', { durationMs: 5000 });
      });
    } catch (err) {
      showMessage(`❌ 会议查询失败: ${err.message || '未知错误'}`, 'chat', { durationMs: 5000 });
    }
    return;
  }
  if (action === 'weekly-report') {
    collapseAdvancedMenu();
    hideAllAdvancedPanels();
    
    showMessage('⏳ 正在生成每周工作周报...', 'chat');

    try {
      window.api?.executeCli?.({
        command: 'node',
        args: ['scripts/test-weekly-report.js'],
        cwd: 'd:\\P5JS'
      }).then(execResult => {
        if (execResult.ok) {
          const resultText = execResult.output || '';
          showMessage(resultText, 'chat', { durationMs: 30000, className: 'weekly-report-bubble' });
        } else {
          showMessage(`❌ 周报生成失败: ${execResult.error || '未知错误'}`, 'chat', { durationMs: 5000 });
        }
        if (bubbleChat) bubbleChat.scrollTop = 0;
      }).catch(err => {
        showMessage(`❌ 周报生成失败: ${err.message || '未知错误'}`, 'chat', { durationMs: 5000 });
      });
    } catch (err) {
      showMessage(`❌ 周报生成失败: ${err.message || '未知错误'}`, 'chat', { durationMs: 5000 });
    }
    return;
  }
}

function openAdvancedPanel(panelName) {
  if (!panelName) return;

  if (panelName === 'smarttodo') {
    window.api?.openExternalUrl?.('http://0.0.0.0:5000');
    setFabActive('smarttodo');
    return;
  }

  const panelAliasMap = {
    smarttodo: 'checkin'
  };
  const resolvedPanelName = panelAliasMap[panelName] || panelName;

  if (resolvedPanelName === 'web-assistant') {
    setWebAssistantMode(!webAssistantEnabled);
    setFabActive('web-assistant');
    if (webAssistantEnabled) {
      collapseAdvancedMenu();
    }
    return;
  }
  hideAllAdvancedPanels();
  const panel = advancedPanels?.querySelector(`.adv-panel[data-panel="${resolvedPanelName}"]`);
  if (panel) panel.classList.remove('hidden');
  setFabActive(panelName);

  if (resolvedPanelName === 'period') {
    window.api?.setWindowMode?.('search');
  } else {
    window.api?.setWindowMode?.('pet');
  }

  if (resolvedPanelName === 'reminder') {
    expandPlannerPanel();
    setInputMode('task');
  }

  if (resolvedPanelName === 'checkin') {
    renderTrajectoryPanel();
  }
  
  if (resolvedPanelName === 'settings') {
    // 打开设置面板时刷新飞书登录状态
    refreshLarkLoginStatus();
  }

  if (resolvedPanelName === 'control-center') {
    setControlCenterPage('main');
    renderControlCenterLinks();
  }

  if (resolvedPanelName === 'settings') {
    showMessage('设置面板骨架待接入。', 'chat');
  }
}

function applyAdvancedFabIcons() {
  const iconMap = loadAdvancedIcons();
  advancedFabButtons.forEach((btn) => {
    const panel = btn.dataset.panel;
    const defaultIcon = btn.dataset.defaultIcon || '•';
    const icon = String(iconMap[panel] || defaultIcon).trim() || defaultIcon;
    const iconNode = btn.querySelector('.adv-fab-icon');
    if (iconNode) iconNode.textContent = icon;
  });
}

function handleFabIconEdit(btn) {
  if (!btn) return;
  const panel = btn.dataset.panel;
  const defaultIcon = btn.dataset.defaultIcon || '•';
  const iconNode = btn.querySelector('.adv-fab-icon');
  const current = (iconNode?.textContent || defaultIcon).trim();
  const next = window.prompt('输入按钮图标（支持 emoji 或 1-2 字）', current);
  if (next === null) return;

  const clean = String(next).trim();
  const iconMap = loadAdvancedIcons();

  if (!clean) {
    delete iconMap[panel];
  } else {
    iconMap[panel] = clean.slice(0, 2);
  }

  saveAdvancedIcons(iconMap);
  applyAdvancedFabIcons();
}

let fileSearchFilterType = 'all';
let fileSearchTimer = null;
let fileSearchSortField = 'mtime';
let fileSearchSortOrder = 'desc';
const fileSearchExpandedGroups = new Set();
let fileSearchLastResults = [];

function setFileSearchResultsCache(items = []) {
  fileSearchLastResults = Array.isArray(items) ? items.slice() : [];
}

function renderFileSearchEmptyState(tip) {
  if (!resultList) return;
  resultList.innerHTML = `<div class="empty-tip">${window.RendererFileSearchUtils.getEmptyStateTip(tip)}</div>`;
}

function renderFileSearchResults(items = [], tip = '') {
  if (!resultList) return;

  if (!Array.isArray(items) || items.length === 0) {
    renderFileSearchEmptyState(tip);
    return;
  }

  setFileSearchResultsCache(items);
  const groups = window.RendererFileSearchUtils.groupFileResults(
    fileSearchLastResults,
    window.RendererFileSearchUtils.compareFileItems
  );

  if (!groups.length) {
    renderFileSearchEmptyState(tip);
    return;
  }

  resultList.innerHTML = groups.map((group) => window.RendererFileSearchUtils.renderFileSearchGroup(group, {
    expandedGroups: fileSearchExpandedGroups,
    formatLocalTime: window.RendererTimeUtils.formatLocalTime,
    formatFileSize: window.RendererTimeUtils.formatFileSize
  })).join('');
}

function buildFileSearchRequest(keyword) {
  return window.RendererFileSearchUtils.buildFileSearchRequest(keyword, fileSearchFilterType, 500);
}

function getFileSearchBuildingTip(res) {
  return `正在建立本地索引（已扫描 ${Number(res.scannedCount || 0)} 项）...`;
}

function handleFileSearchSearchFailure() {
  renderFileSearchEmptyState('搜索失败，请稍后重试');
}

function handleFileSearchNoKeyword() {
  fileSearchExpandedGroups.clear();
  renderFileSearchEmptyState('请输入关键词开始搜索');
}

function handleFileSearchBuilding(res) {
  renderFileSearchEmptyState(getFileSearchBuildingTip(res));
}

function handleFileSearchSearchSuccess(results) {
  renderFileSearchResults(results, '没有找到匹配文件');
}

function handleFileSearchSearchResponse(res) {
  const results = Array.isArray(res.results) ? res.results : [];
  if (!res.ready && res.building && results.length === 0) {
    handleFileSearchBuilding(res);
    return;
  }
  handleFileSearchSearchSuccess(results);
}

async function runFileSearchFlow(keyword) {
  const res = await window.api?.searchFiles(buildFileSearchRequest(keyword));

  if (!res?.ok) {
    handleFileSearchSearchFailure();
    return;
  }

  handleFileSearchSearchResponse(res);
}

async function doFileSearch() {
  if (!searchInput || !resultList) return;
  const keyword = String(searchInput.value || '').trim();

  if (!keyword) {
    handleFileSearchNoKeyword();
    return;
  }

  await runFileSearchFlow(keyword);
}

function debounceFileSearch() {
  if (fileSearchTimer) clearTimeout(fileSearchTimer);
  fileSearchTimer = setTimeout(() => {
    fileSearchTimer = null;
    doFileSearch();
  }, 140);
}

function openSearchPath(pathValue, kind) {
  const target = decodeURIComponent(String(pathValue || ''));
  if (!target) return;
  const openFn = kind === 'folder' ? window.api?.openLocalFolder : window.api?.openLocalFile;
  void openFn?.(target).then((res) => {
    if (!res?.ok) {
      showMessage(kind === 'folder' ? `定位失败：${res?.error || '未知错误'}` : `打开失败：${res?.error || '未知错误'}`, 'chat');
    }
  });
}

function applyFileSearchSortField(nextValue) {
  fileSearchSortField = window.RendererFileSearchUtils.normalizeFileSearchSortField(nextValue);
}

function applyFileSearchSortOrder(nextValue) {
  fileSearchSortOrder = window.RendererFileSearchUtils.normalizeFileSearchSortOrder(nextValue);
}

function applyFileSearchFilterType(nextType) {
  fileSearchFilterType = window.RendererFileSearchUtils.normalizeFileSearchFilterType(nextType);
  fileSearchExpandedGroups.clear();
}

function refreshFileSearchResults() {
  renderFileSearchResults(fileSearchLastResults, '没有找到匹配文件');
}

function toggleFileSearchGroup(groupType) {
  if (!groupType) return;
  if (fileSearchExpandedGroups.has(groupType)) fileSearchExpandedGroups.delete(groupType);
  else fileSearchExpandedGroups.add(groupType);
  refreshFileSearchResults();
}

function setFileSearchSortField(nextValue) {
  applyFileSearchSortField(nextValue);
  refreshFileSearchResults();
}

function setFileSearchSortOrder(nextValue) {
  applyFileSearchSortOrder(nextValue);
  refreshFileSearchResults();
}

function setFileSearchFilterType(nextType) {
  applyFileSearchFilterType(nextType);
  refreshFileSearchResults();
}

function handleFileSearchFilterChange(nextType) {
  setFileSearchFilterType(nextType);
  debounceFileSearch();
}

function resetFileSearchQuery() {
  fileSearchExpandedGroups.clear();
  debounceFileSearch();
}

function handleFileSearchResultAction(target) {
  const toggleBtn = window.RendererFileSearchUtils.getFileSearchActionTarget(target, '[data-toggle-group]');
  if (toggleBtn) {
    toggleFileSearchGroup(toggleBtn.dataset.toggleGroup || '');
    return true;
  }

  const openBtn = window.RendererFileSearchUtils.getFileSearchActionTarget(target, '[data-open-file]');
  if (openBtn) {
    openSearchPath(openBtn.dataset.openFile || '', 'file');
    return true;
  }

  const folderBtn = window.RendererFileSearchUtils.getFileSearchActionTarget(target, '[data-open-folder]');
  if (folderBtn) {
    openSearchPath(folderBtn.dataset.openFolder || '', 'folder');
    return true;
  }

  return false;
}

function updateFileSearchFilterActiveState(activeChip) {
  filterBar?.querySelectorAll('.filter').forEach((node) => node.classList.remove('active'));
  activeChip.classList.add('active');
}

function bindFileSearchPanel() {
  window.RendererFileSearchUtils.bindFileSearchPanel({
    searchInput,
    filterBar,
    resultList,
    sortFieldSelect,
    sortOrderSelect,
    markPanelInteraction,
    resetFileSearchQuery,
    setFileSearchSortField,
    setFileSearchSortOrder,
    handleFileSearchFilterChange,
    updateFileSearchFilterActiveState,
    handleFileSearchResultAction
  });
}

function bindAdvancedPanelWindowDrag() {
  window.RendererAdvancedUiUtils.bindAdvancedPanelWindowDrag({
    advancedPanels,
    dragWindowBy: window.api?.dragWindowBy
  });
}

function handleAdvancedMenuToggleClick() {
  markPanelInteraction();
  if (isAdvancedMenuExpanded()) {
    collapseAdvancedMenu();
    hideAllAdvancedPanels();
  } else {
    expandAdvancedMenu();
  }
}

function handleAdvancedFabClick(btn) {
  const panelName = btn.dataset.panel;
  const isActive = btn.classList.contains('active');
  if (isActive) {
    hideAllAdvancedPanels();
    scheduleAdvancedMenuAutoCollapse();
    return;
  }
  openAdvancedPanel(panelName);
  // 打开任一面板后，菜单保持展开，避免和自动收起冲突
  clearAdvancedMenuAutoCollapseTimer();
}

function getAdvancedQuickActionButton() {
  return document.querySelector('#advancedQuickMenu .adv-fab[data-action="work-arrival-one-key"]');
}

async function runWorkArrivalOneKey(workArrivalBtn) {
  const originalIcon = workArrivalBtn.querySelector('.adv-fab-icon').textContent;
  workArrivalBtn.querySelector('.adv-fab-icon').textContent = '⏳';
  workArrivalBtn.disabled = true;

  try {
    const execResult = await window.api?.executeCli?.({
      command: 'node',
      args: ['test-briefing-fetch.js'],
      cwd: 'd:\\P5JS'
    }) || { ok: false };

    let resultPayload = getBriefingFallbackPayload();
    if (execResult.ok) {
      const output = execResult.output || '';
      resultPayload = formatBriefingOutput(output);
    } else {
      resultPayload = {
        ...getBriefingFallbackPayload(),
        error: `执行拉取脚本失败: ${execResult.error || '未知错误'}`
      };
    }

    const resultText = renderBriefingPayload(resultPayload);

    showMessage(resultText, 'chat', { durationMs: 30000, className: 'work-arrival-bubble' });
    if (bubbleChat) bubbleChat.scrollTop = 0;
  } catch (err) {
    showMessage(`❌ 一键梳理失败: ${err.message || '未知错误'}`, 'chat', { durationMs: 5000 });
  } finally {
    workArrivalBtn.querySelector('.adv-fab-icon').textContent = originalIcon;
    workArrivalBtn.disabled = false;
  }
}

function handleAdvancedDockClick(event) {
  event.stopPropagation();
}

function handleAdvancedPanelsClick(event) {
  event.stopPropagation();
}

function handleAdvancedControlPanelClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const openUrlBtn = target.closest('[data-open-url]');
  if (openUrlBtn instanceof HTMLElement) {
    const url = openUrlBtn.dataset.openUrl;
    if (url) window.api?.openExternalUrl?.(url);
    return;
  }

  const removeBtn = target.closest('[data-remove-link]');
  if (removeBtn instanceof HTMLElement) {
    const id = removeBtn.dataset.removeLink;
    if (!id) return;
    CONTROL_CENTER_LINKS = CONTROL_CENTER_LINKS.filter((item) => item.id !== id);
    if (CONTROL_CENTER_LINKS.length === 0) CONTROL_CENTER_LINKS = CONTROL_CENTER_DEFAULT_LINKS.slice();
    saveControlCenterLinks();
    renderControlCenterLinks();
    return;
  }

  const controlBtn = target.closest('[data-control-action]');
  if (controlBtn instanceof HTMLElement) {
    openControlCenterAction(controlBtn.dataset.controlAction || '');
    return;
  }

  if (target instanceof HTMLElement && target.matches('[data-control-back]')) {
    setControlCenterPage('main');
    renderControlCenterLinks();
    return;
  }

  if (target instanceof HTMLElement && target.matches('[data-control-back-main]')) {
    setControlCenterPage('main');
    renderControlCenterLinks();
    return;
  }
}

function handleSmartTodoPanelClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const smartTodoBtn = target.closest('[data-panel="smarttodo"]');
  if (smartTodoBtn instanceof HTMLElement) {
    event.stopPropagation();
    openAdvancedPanel('smarttodo');
    return;
  }
}

function bindAdvancedFeatureUI() {
  window.RendererAdvancedUiUtils.bindAdvancedFeatureUI({
    advancedDock,
    advancedToggleFab,
    advancedFabButtons,
    advancedPanels,
    getAdvancedQuickActionButton,
    markPanelInteraction,
    isAdvancedMenuExpanded,
    collapseAdvancedMenu,
    hideAllAdvancedPanels,
    scheduleAdvancedMenuAutoCollapse,
    expandAdvancedMenu,
    openAdvancedPanel,
    runWorkArrivalOneKey,
    clearAdvancedMenuAutoCollapseTimer,
    hasOpenAdvancedPanel,
    openExternalUrl: window.api?.openExternalUrl,
    onControlAction: openControlCenterAction,
    onControlBack: () => {
      setControlCenterPage('main');
      renderControlCenterLinks();
    },
    onControlBackMain: () => {
      setControlCenterPage('main');
      renderControlCenterLinks();
    }
  });
}

function bindAdvancedFeatureSecondaryActions() {
  window.RendererAdvancedUiUtils.bindAdvancedFeatureSecondaryActions({
    advancedDock,
    advancedPanels,
    markPanelInteraction,
    hideAllAdvancedPanels,
    expandPlannerPanel,
    setInputMode,
    generateWorkReviewText,
    renderWorkReviewOutput,
    showMessage,
    controlCenterBackBtn,
    controlCenterBackMainBtn,
    controlCenterAddBtn,
    controlCenterNameInput,
    controlCenterUrlInput,
    controlCenterIconInput,
    normalizeControlCenterUrl,
    saveControlCenterLinks,
    renderControlCenterLinks,
    setControlCenterPage,
    syncControlCenterInputs,
    CONTROL_CENTER_LINKS,
    handleFabIconEdit,
    openTrajectoryQuickAdd,
    addCheckinV2Task,
    addCheckinV2Countdown,
    advancedDockContains: (target) => advancedDock.contains(target),
    advancedPanelsContains: (target) => advancedPanels.contains(target),
    collapseAdvancedMenu,
    document,
    trajectoryAddBtn,
    checkinV2AddTaskBtn,
    checkinV2TaskInput,
    checkinV2AddCountdownBtn,
    checkinV2CountdownNameInput,
    checkinV2CountdownDateInput,
    workReviewBtn,
    workReviewGenerateBtn,
    workReviewCopyBtn
  });
  applyAdvancedFabIcons();
}

const PERSONA = window.RendererLizeyanPersona || {};
const CHAT_MAP = PERSONA.CHAT_MAP || [];
const FALLBACK_REPLIES = PERSONA.FALLBACK_REPLIES || ['我在听，继续。', '嗯，说重点。', '你想让我怎么帮你？', '别急，慢慢说。'];
const LLM_SYSTEM_PROMPT = PERSONA.LLM_SYSTEM_PROMPT || '你是李泽言。请保持克制、果决、简洁的语气回应。';

const LLM_TIMEOUT_MS = 16000;

const CHAT_MEMORY_KEY = 'lz_pet_chat_memory_v1';
const PROFILE_MEMORY_KEY = 'lz_pet_profile_memory_v1';
const TRIGGER_STATE_KEY = 'lz_pet_trigger_state_v1';
const EPISODIC_MEMORY_KEY = 'lz_pet_episodic_memory_v1';
const FACTORY_RESET_STAMP_KEY = 'lz_pet_factory_reset_stamp_v1';
// 每次要“出厂重置”再打包时，只需要改这里的版本号。
const FACTORY_RESET_STAMP = 'build-2026-04-03-1';
const RECENT_REPLY_MAX = 6;
const CONTEXT_WINDOW_SIZE = 10;

const REPLY_POLICY = {
  mode: 'shuffle_bag',
  globalRecentQueueSize: 30,
  perTriggerRecentQueueSize: 8,
  sameLineMinIntervalSec: 900
};

const INTIMACY_LEVELS = ['L1', 'L2', 'L3'];

const persona = window.RendererLizeyanPersona || {};
const TRIGGER_LIBRARY = persona.TRIGGER_LIBRARY || [];

let chatMemory = [];
let episodicMemory = [];
let userProfile = {
  nickname: '',
  moodTags: [],
  goals: [],
  intimacyLevel: 2
};
let recentReplies = [];
let triggerState = {
  globalRecent: [],
  triggerRecent: {},
  lineLastUsedAt: {},
  bags: {}
};

function tokenizeForMemory(text) {
  return window.RendererTextUtils.tokenizeForMemory(text);
}

function buildTokenWeights(tokens) {
  const weights = {};
  tokens.forEach((t) => {
    weights[t] = (weights[t] || 0) + 1;
  });
  return weights;
}

function cosineLikeScore(aWeights, bWeights) {
  const aKeys = Object.keys(aWeights);
  const bKeys = Object.keys(bWeights);
  if (aKeys.length === 0 || bKeys.length === 0) return 0;

  let dot = 0;
  let aNorm = 0;
  let bNorm = 0;

  aKeys.forEach((k) => {
    const av = aWeights[k];
    aNorm += av * av;
    if (bWeights[k]) dot += av * bWeights[k];
  });

  bKeys.forEach((k) => {
    const bv = bWeights[k];
    bNorm += bv * bv;
  });

  if (!aNorm || !bNorm) return 0;
  return dot / Math.sqrt(aNorm * bNorm);
}

function normalizeKnowledgeBase(records) {
  return window.RendererTextUtils.normalizeKnowledgeBase(records, tokenizeForMemory);
}

function rebuildKnowledgeIndex() {
  knowledgeIndex = window.RendererTextUtils.buildKnowledgeIndex(knowledgeBase);
}

function saveKnowledgeBaseToLocalCache() {
  localStorage.setItem(KNOWLEDGE_BASE_KEY, JSON.stringify(knowledgeBase.slice(-220)));
}

function refreshKnowledgeBaseIndex() {
  rebuildKnowledgeIndex();
}

function saveKnowledgeBase() {
  saveKnowledgeBaseToLocalCache();

  if (!window.api?.saveKnowledgeFile) return;
  const payload = knowledgeBase.slice(-220).map(({ tokenWeights, ...rest }) => rest);
  window.api.saveKnowledgeFile(payload).catch(() => {
    // 忽略文件写入异常，至少保证本地缓存可用
  });
}

function loadKnowledgeBase() {
  try {
    const raw = localStorage.getItem(KNOWLEDGE_BASE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    knowledgeBase = normalizeKnowledgeBase(parsed);
  } catch {
    knowledgeBase = [];
  }

  if (!window.api?.loadKnowledgeFile) return;

  window.api
    .loadKnowledgeFile()
    .then((res) => {
      if (!res?.ok || !Array.isArray(res.records)) return;
      knowledgeBase = normalizeKnowledgeBase(res.records);
      refreshKnowledgeBaseIndex();
      saveKnowledgeBaseToLocalCache();
      renderKnowledgeBase();
    })
    .catch(() => {
      // 文件加载失败时使用本地缓存兜底
    });
}

function addKnowledgeItem(question, answer, keywords = [], source = 'manual') {
  const q = window.RendererTextUtils.clampText(window.RendererTextUtils.normalizeRecentText(question), 80);
  const a = window.RendererTextUtils.clampText(window.RendererTextUtils.normalizeRecentText(answer), 280);
  if (!q || !a) return false;

  const normalizedQuestion = window.RendererTextUtils.normalizeTextLower(q);
  const idx = knowledgeBase.findIndex((x) => window.RendererTextUtils.normalizeTextLower(x.question) === normalizedQuestion);
  const finalKeywords = splitKeywords(Array.isArray(keywords) ? keywords.join(',') : keywords);
  const tokens = tokenizeForMemory(`${q} ${finalKeywords.join(' ')}`);

  const prev = idx >= 0 ? knowledgeBase[idx] : null;
  const item = {
    id: prev ? prev.id : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    question: q,
    answer: a,
    keywords: finalKeywords,
    tokens,
    tokenWeights: buildTokenWeights(tokens),
    source: source === 'auto' ? 'auto' : 'manual',
    captureCount: source === 'auto' ? Math.max(1, Number(prev?.captureCount || 0) + 1) : Math.max(1, Number(prev?.captureCount || 1)),
    hitCount: Math.max(0, Number(prev?.hitCount || 0)),
    createdAt: prev ? prev.createdAt : Date.now(),
    lastUsedAt: Number(prev?.lastUsedAt || 0)
  };

  if (idx >= 0) {
    knowledgeBase[idx] = item;
  } else {
    knowledgeBase.unshift(item);
    knowledgeBase = knowledgeBase.slice(0, 220);
  }

  refreshKnowledgeBaseIndex();
  saveKnowledgeBase();
  return true;
}

function retrieveKnowledgeAnswer(queryText) {
  const text = window.RendererTextUtils.normalizeRecentText(queryText);
  if (!text || !knowledgeBase.length) return null;

  const queryTokens = tokenizeForMemory(text);
  const queryWeights = buildTokenWeights(queryTokens);
  const lower = window.RendererTextUtils.normalizeTextLower(text);
  const candidateIndexes = new Set();

  queryTokens.forEach((token) => {
    const matched = knowledgeIndex.byToken.get(token);
    if (!matched) return;
    matched.forEach((idx) => candidateIndexes.add(idx));
  });

  for (const [keyword, indexes] of knowledgeIndex.byKeyword.entries()) {
    if (!keyword || !lower.includes(keyword)) continue;
    indexes.forEach((idx) => candidateIndexes.add(idx));
  }

  if (candidateIndexes.size === 0) {
    const prefix = lower.slice(0, Math.min(12, lower.length));
    const prefixHits = knowledgeIndex.byQuestionPrefix.get(prefix);
    if (prefixHits) prefixHits.forEach((idx) => candidateIndexes.add(idx));
  }

  if (candidateIndexes.size === 0) {
    const fallbackLimit = Math.min(80, knowledgeBase.length);
    for (let i = 0; i < fallbackLimit; i += 1) candidateIndexes.add(i);
  }

  let best = null;
  candidateIndexes.forEach((index) => {
    const item = knowledgeBase[index];
    if (!item) return;
    const evaluated = window.RendererTextUtils.scoreKnowledgeCandidate(item, lower, queryWeights, queryTokens);

    if (!best || evaluated.score > best.score) {
      best = { item, index, ...evaluated };
    }
  });

  if (!best) return null;
  if (best.score < 0.42 && !best.keywordHit && !best.questionHit) return null;

  const hitItem = knowledgeBase[best.index];
  if (hitItem) {
    hitItem.hitCount = Math.max(0, Number(hitItem.hitCount || 0)) + 1;
    hitItem.lastUsedAt = Date.now();
    saveKnowledgeBase();
  }

  return {
    answer: best.item.answer,
    question: best.item.question,
    score: best.score,
    source: best.item.source || 'manual'
  };
}

function captureKnowledgeFromConversation(userText, assistantText, intent = 'chat') {
  const q = window.RendererTextUtils.clampText(window.RendererTextUtils.normalizeRecentText(userText), 80);
  const a = window.RendererTextUtils.clampText(window.RendererTextUtils.normalizeRecentText(assistantText), 280);
  if (!q || !a) return false;

  if (window.RendererTextUtils.shouldSuppressMemoryCapture(q, a, intent)) return false;

  const keywords = splitKeywords(q).slice(0, 6);
  return addKnowledgeItem(q, a, keywords, 'auto');
}

function renderKnowledgeBase() {
  if (!kbList) return;
  kbList.innerHTML = '';

  if (!knowledgeBase.length) {
    const empty = document.createElement('li');
    empty.className = 'plan-empty';
    empty.textContent = '资料库空的，先喂一条。';
    kbList.appendChild(empty);
    return;
  }

  knowledgeBase.slice(0, 12).forEach((item) => {
    const li = document.createElement('li');
    li.className = 'kb-item';

    const info = document.createElement('div');
    const q = document.createElement('div');
    q.className = 'kb-item-q';
    q.textContent = `Q: ${item.question}`;

    const meta = document.createElement('div');
    meta.className = 'kb-item-meta';
    const sourceTag = item.source === 'auto' ? '自动' : '手动';
    const hitCount = Math.max(0, Number(item.hitCount || 0));
    meta.textContent = `[${sourceTag}] 命中${hitCount}次 · 关键词: ${(item.keywords || []).join(' / ') || '无'}`;

    info.appendChild(q);
    info.appendChild(meta);

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'del-btn';
    delBtn.textContent = '删除';
    delBtn.addEventListener('click', () => {
      knowledgeBase = knowledgeBase.filter((x) => x.id !== item.id);
      saveKnowledgeBase();
      renderKnowledgeBase();
      showMessage('资料删了。', 'chat');
    });

    li.appendChild(info);
    li.appendChild(delBtn);
    kbList.appendChild(li);
  });
}

function handleAddKnowledgeFromUI() {
  const q = window.RendererTextUtils.normalizeRecentText(kbQuestion?.value);
  const a = window.RendererTextUtils.normalizeRecentText(kbAnswer?.value);
  const kws = splitKeywords(kbKeywords?.value || '');

  if (!q || !a) {
    showMessage('问题和答案都要填。', 'chat');
    return;
  }

  const ok = addKnowledgeItem(q, a, kws);
  if (!ok) {
    showMessage('加入失败，重试。', 'chat');
    return;
  }

  renderKnowledgeBase();
  if (kbQuestion) kbQuestion.value = '';
  if (kbAnswer) kbAnswer.value = '';
  if (kbKeywords) kbKeywords.value = '';
  showMessage('资料已入库。', 'chat');
}

function buildMemoryItem(userText, assistantText, meta = {}) {
  return window.RendererTextUtils.buildMemoryItem(userText, assistantText, meta);
}

function rememberEpisode(userText, assistantText, meta = {}) {
  const user = window.RendererTextUtils.normalizeRecentText(userText);
  const assistant = window.RendererTextUtils.normalizeRecentText(assistantText);
  if (!user || !assistant) return;

  const item = buildMemoryItem(user, assistant, meta);
  if (!item.tokens.length) return;

  episodicMemory.push(item);
  if (episodicMemory.length > 180) {
    episodicMemory = window.RendererTextUtils.trimMemoryList(episodicMemory, 180);
  }
}

function recallEpisodes(queryText, { max = 3 } = {}) {
  const queryTokens = tokenizeForMemory(queryText);
  const queryWeights = buildTokenWeights(queryTokens);
  if (!Object.keys(queryWeights).length) return [];

  const now = Date.now();
  return episodicMemory
    .map((item) => {
      const semantic = cosineLikeScore(queryWeights, item.tokenWeights || {});
      const hours = Math.max(1, (now - Number(item.ts || now)) / (1000 * 60 * 60));
      const recencyBoost = Math.min(0.18, 0.18 / Math.sqrt(hours));
      const score = semantic + recencyBoost;
      return { item, score, semantic };
    })
    .filter((x) => x.semantic >= 0.08)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((x) => x.item);
}

function loadChatMemory() {
  try {
    const raw = localStorage.getItem(CHAT_MEMORY_KEY);
    chatMemory = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(chatMemory)) chatMemory = [];
  } catch {
    chatMemory = [];
  }

  try {
    const raw = localStorage.getItem(PROFILE_MEMORY_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && typeof parsed === 'object') {
      const level = Number(parsed.intimacyLevel);
      userProfile = {
        nickname: typeof parsed.nickname === 'string' ? parsed.nickname : '',
        moodTags: Array.isArray(parsed.moodTags) ? parsed.moodTags.slice(0, 8) : [],
        goals: Array.isArray(parsed.goals) ? parsed.goals.slice(0, 8) : [],
        intimacyLevel: Number.isFinite(level) ? Math.min(3, Math.max(1, level)) : 2
      };
    }
  } catch {
    userProfile = { nickname: '', moodTags: [], goals: [], intimacyLevel: 2 };
  }

  try {
    const raw = localStorage.getItem(EPISODIC_MEMORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    episodicMemory = Array.isArray(parsed)
      ? parsed
          .map((x) => ({
            ...x,
            tokens: Array.isArray(x?.tokens) ? x.tokens.slice(0, 24) : [],
            tokenWeights: x?.tokenWeights && typeof x.tokenWeights === 'object' ? x.tokenWeights : {}
          }))
          .slice(-180)
      : [];
  } catch {
    episodicMemory = [];
  }

  try {
    const raw = localStorage.getItem(TRIGGER_STATE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && typeof parsed === 'object') {
      triggerState = {
        globalRecent: Array.isArray(parsed.globalRecent) ? parsed.globalRecent.slice(-REPLY_POLICY.globalRecentQueueSize) : [],
        triggerRecent: parsed.triggerRecent && typeof parsed.triggerRecent === 'object' ? parsed.triggerRecent : {},
        lineLastUsedAt: parsed.lineLastUsedAt && typeof parsed.lineLastUsedAt === 'object' ? parsed.lineLastUsedAt : {},
        bags: parsed.bags && typeof parsed.bags === 'object' ? parsed.bags : {}
      };
    }
  } catch {
    triggerState = { globalRecent: [], triggerRecent: {}, lineLastUsedAt: {}, bags: {} };
  }
}

function saveChatMemory() {
  localStorage.setItem(CHAT_MEMORY_KEY, JSON.stringify(chatMemory.slice(-80)));
  localStorage.setItem(PROFILE_MEMORY_KEY, JSON.stringify(userProfile));
  localStorage.setItem(EPISODIC_MEMORY_KEY, JSON.stringify(episodicMemory.slice(-180)));
  localStorage.setItem(TRIGGER_STATE_KEY, JSON.stringify(triggerState));
}

function applyFactoryResetOnNewBuild() {
  try {
    const currentStamp = localStorage.getItem(FACTORY_RESET_STAMP_KEY);
    if (currentStamp === FACTORY_RESET_STAMP) return;

    localStorage.removeItem(PLAN_STORAGE_KEY);
    localStorage.removeItem(CHAT_MEMORY_KEY);
    localStorage.removeItem(PROFILE_MEMORY_KEY);
    localStorage.removeItem(EPISODIC_MEMORY_KEY);
    localStorage.removeItem(TRIGGER_STATE_KEY);
    localStorage.removeItem(KNOWLEDGE_BASE_KEY);

    localStorage.setItem(FACTORY_RESET_STAMP_KEY, FACTORY_RESET_STAMP);
  } catch {
    // 忽略异常，避免影响正常启动
  }
}

function rememberTurn(role, content, meta = {}) {
  chatMemory.push({
    role,
    content,
    ts: Date.now(),
    meta
  });
  if (chatMemory.length > 120) {
    chatMemory = chatMemory.slice(-120);
  }
  saveChatMemory();
}

function pushRecentReply(text) {
  recentReplies.push(text);
  if (recentReplies.length > RECENT_REPLY_MAX) {
    recentReplies = recentReplies.slice(-RECENT_REPLY_MAX);
  }
}

function detectIntent(text) {
  return window.RendererTextUtils.detectIntent(text);
}

function detectEmotion(text) {
  return window.RendererTextUtils.detectEmotion(text);
}

function extractNickname(text) {
  return window.RendererTextUtils.extractNickname(text);
}

function updateUserProfileFromInput(text) {
  let profileUpdated = false;
  let nicknameChangedTo = '';
  let intimacyChangedTo = null;

  const extractedNickname = extractNickname(text);
  if (extractedNickname && userProfile.nickname !== extractedNickname) {
    userProfile.nickname = extractedNickname;
    profileUpdated = true;
    nicknameChangedTo = extractedNickname;
  }

  const intimacyMatch = text.match(/(?:亲密度|亲密等级|等级|level)\s*(?:设为|设置为|=|:)?\s*([123]|L[123])/i);
  if (intimacyMatch) {
    const raw = intimacyMatch[1].toUpperCase();
    const numeric = raw.startsWith('L') ? Number(raw.slice(1)) : Number(raw);
    if ([1, 2, 3].includes(numeric) && userProfile.intimacyLevel !== numeric) {
      userProfile.intimacyLevel = numeric;
      profileUpdated = true;
      intimacyChangedTo = numeric;
    }
  }

  if (/面试|考试|答辩|汇报|开会|项目|工作|健身|减肥/.test(text)) {
    const goalTag = text.slice(0, 20);
    if (!userProfile.goals.includes(goalTag)) {
      userProfile.goals.unshift(goalTag);
      userProfile.goals = userProfile.goals.slice(0, 8);
      profileUpdated = true;
    }
  }

  const emotion = detectEmotion(text);
  if (emotion !== 'neutral' && !userProfile.moodTags.includes(emotion)) {
    userProfile.moodTags.unshift(emotion);
    userProfile.moodTags = userProfile.moodTags.slice(0, 8);
    profileUpdated = true;
  }

  if (profileUpdated) saveChatMemory();

  return {
    profileUpdated,
    nicknameChangedTo,
    intimacyChangedTo
  };
}

function getRecentContext() {
  return chatMemory.slice(-CONTEXT_WINDOW_SIZE);
}

function styleWrap(lines) {
  return window.RendererTextUtils.styleWrap(lines);
}

function avoidRepeat(reply, backup) {
  return window.RendererTextUtils.avoidRepeat(reply, backup, recentReplies);
}

function applyAddressingStyle(reply) {
  return window.RendererTextUtils.applyAddressingStyle(reply, userProfile.nickname);
}

function buildMemoryAwareLine(inputText, recalled) {
  if (!Array.isArray(recalled) || recalled.length === 0) return '';

  const top = recalled[0];
  if (!top || !top.userText) return '';

  if (/还是|又|依然|还在|继续/.test(inputText)) {
    return `你刚才提到“${top.userText.slice(0, 16)}”，我记得。`;
  }

  if (/想你|爱你|喜欢你|在吗|陪我/.test(inputText)) {
    return `上次你说“${top.userText.slice(0, 14)}”，我一直记着。`;
  }

  if (/难过|焦虑|累|生气|烦/.test(inputText)) {
    return `我记得你之前也有类似感受，这次我们会处理得更稳。`;
  }

  return '';
}

function generateSmartReply(text) {
  const intent = detectIntent(text);
  const emotion = detectEmotion(text);
  const context = getRecentContext();
  const recalled = recallEpisodes(text, { max: 3 });
  const memoryLine = buildMemoryAwareLine(text, recalled);
  const nickname = userProfile.nickname || '笨蛋';
  const intimacy = Math.min(3, Math.max(1, Number(userProfile.intimacyLevel) || 2));

  const lastUser = [...context].reverse().find((item) => item.role === 'user');
  const hasSameTopic = lastUser && lastUser.content && (text.includes(lastUser.content.slice(0, 4)) || lastUser.content.includes(text.slice(0, 4)));

  let primary = '';
  let secondary = '';

  if (/你是谁|你叫什么|你到底是谁|你是什么人/.test(text)) {
    if (intimacy >= 3) {
      primary = '我是李泽言。你最熟悉、也最偏爱的那一个。';
      secondary = '华锐集团创始人兼总裁，Souvenir店长兼主厨。现在，安心了吗？';
    } else if (intimacy === 2) {
      primary = '李泽言。华锐集团创始人兼总裁，也是会盯你按时吃饭的人。';
      secondary = '如果你愿意，也可以直接叫我名字。';
    } else {
      primary = '李泽言。华锐集团创始人兼总裁。';
      secondary = '还有，Souvenir店长兼主厨。';
    }
  } else if (/你的公司|你公司|哪家公司|公司是什么|公司叫啥|公司叫什么|你在哪家公司|你在哪个公司/.test(text)) {
    if (intimacy >= 3) {
      primary = '华锐集团。';
      secondary = '我是创始人兼总裁。';
    } else if (intimacy === 2) {
      primary = '华锐集团。';
      secondary = '我在那里负责决策与全局。';
    } else {
      primary = '华锐集团。';
      secondary = '我是创始人兼总裁。';
    }
  } else if (/我喜欢你|喜欢你|我爱你|爱你|想你了/.test(text)) {
    if (intimacy >= 3) {
      primary = '我也爱你。';
      secondary = '这句话，我会用现在和将来回应你。';
    } else if (intimacy === 2) {
      primary = '你的喜欢，我收到了。';
      secondary = '不用试探，我的答案很明确。';
    } else {
      primary = '我知道。';
      secondary = '心意我收下了。';
    }
  } else if (intent === 'emotion') {
    if (emotion === 'sad') {
      primary = `先过来，${nickname}。你已经撑很久了。`;
      secondary = '现在先做一件小事：喝口水，慢慢把呼吸放稳。';
    } else if (emotion === 'anxious') {
      primary = '别慌。先把最紧要的一件事告诉我。';
      secondary = '你只需要先完成第一步，后面的我陪你拆。';
    } else if (emotion === 'angry') {
      primary = '我知道你在生气。先别让情绪替你做决定。';
      secondary = '把最让你不爽的点说清楚，我给你一个能执行的解法。';
    } else {
      primary = '我在听。你不用一个人扛着。';
      secondary = '说重点，我帮你一起收拾。';
    }
  } else if (intent === 'advice') {
    primary = `可以，${nickname}。先说结论：能做，而且你做得到。`;
    secondary = '先定一个最小动作，十分钟内完成它。';
  } else if (intent === 'qa') {
    primary = `先给你结论，再解释，${nickname}。`;
    secondary = '你把具体问题补全，我用最短路径告诉你。';
  } else if (intent === 'task') {
    primary = `这类内容更适合提醒模式，${nickname}。`;
    secondary = '切到提醒模式，把时间和事项写完整。';
  } else {
    primary = hasSameTopic ? `还在纠结这件事，${nickname}？那就别绕弯。` : `我在，${nickname}。继续说。`;
    secondary = '你给我关键信息，我给你可执行答案。';
  }

  if (window.RendererTextUtils.isGreetingOrThanks?.(text)) {
    if (/谢谢|多亏你|感谢/.test(text)) {
      primary = '谢意我收下。';
      secondary = '把状态稳住，比说谢谢更重要。';
    }
    if (/晚安|睡觉/.test(text)) {
      primary = '嗯，去休息。';
      secondary = '手机放下，闭眼。晚安。';
    }
  }

  if (window.RendererTextUtils.isTimeRelatedInput?.(text)) {
    primary = `先把时间说清楚，${nickname}。`;
    secondary = '日期、时刻、重复规则，少一个都不稳。';
  }

  const candidate = styleWrap([memoryLine, primary, secondary]);
  const backup = styleWrap([pickOne(FALLBACK_REPLIES), '别磨蹭。']);

  return {
    reply: avoidRepeat(candidate, backup),
    intent,
    emotion,
    recalledCount: recalled.length
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getBubbleByType(type) {
  if (type === 'self') return bubbleSelf;
  return bubbleChat;
}

function clearBubbleTimers(type) {
  if (type === 'self') {
    if (hideBubbleSelfTimer) clearTimeout(hideBubbleSelfTimer);
    if (hideBubbleSelfFadeTimer) clearTimeout(hideBubbleSelfFadeTimer);
    hideBubbleSelfTimer = null;
    hideBubbleSelfFadeTimer = null;
    return;
  }
  if (hideBubbleChatTimer) clearTimeout(hideBubbleChatTimer);
  if (hideBubbleChatFadeTimer) clearTimeout(hideBubbleChatFadeTimer);
  hideBubbleChatTimer = null;
  hideBubbleChatFadeTimer = null;
}

function scheduleHideBubble(type, durationMs) {
  const el = getBubbleByType(type);
  clearBubbleTimers(type);

  if (durationMs <= 0) return;

  const fadeOut = () => {
    el.style.opacity = '0';
    const fadeTimer = setTimeout(() => {
      el.textContent = '';
      el.style.display = 'none';
      el.classList.remove('chat', 'reminder', 'self');
    }, 230);
    if (type === 'self') hideBubbleSelfFadeTimer = fadeTimer;
    else hideBubbleChatFadeTimer = fadeTimer;
  };

  const timer = setTimeout(fadeOut, durationMs);
  if (type === 'self') hideBubbleSelfTimer = timer;
  else hideBubbleChatTimer = timer;
}

function showMessage(msg, type = 'self', opts = {}) {
  if (!msg) return;

  const {
    durationMs = 5000,
    noAutoHide = false,
    className = ''
  } = opts || {};

  const el = getBubbleByType(type);
  const isWorkArrival = className === 'work-arrival-bubble';
  const isMeetingAssistant = className === 'meeting-assistant-bubble';
  const isWeeklyReport = className === 'weekly-report-bubble';

  if (isWorkArrival || isMeetingAssistant || isWeeklyReport) {
    const panelTitle = isWorkArrival ? '到岗一键梳理' : isMeetingAssistant ? '会议全链路助手' : '每周工作周报';
    const rawText = String(msg || '');
    // 统一转义所有文本，之后再转换链接
    const escapedText = window.RendererTextUtils.escapeBubblePanelText(rawText);
    el.innerHTML = `
      <div class="bubble-panel-shell">
        <div class="bubble-panel-head">
          <div class="bubble-panel-title">${panelTitle}</div>
          <button type="button" class="bubble-panel-close" aria-label="关闭">×</button>
        </div>
        <div class="bubble-panel-body" style="white-space: pre-wrap; word-break: break-word;">${escapedText}</div>
      </div>
    `;
    const closeBtn = el.querySelector('.bubble-panel-close');
    closeBtn?.addEventListener('click', () => {
      clearBubbleTimers(type);
      el.style.display = 'none';
      el.style.opacity = '0';
      el.textContent = '';
      el.classList.remove('chat', 'reminder', 'self', 'work-arrival-bubble', 'meeting-assistant-bubble', 'weekly-report-bubble');
    }, { once: true });

    // 自动识别并转换所有链接为可点击
    const bodyElement = el.querySelector('.bubble-panel-body');
    if (bodyElement) {
      const linkRegex = /(https?:\/\/[^\s<>"']+)/g;
      bodyElement.innerHTML = bodyElement.innerHTML.replace(linkRegex, (match) => {
        return `<a href="#" data-open-url="${match.replace(/"/g, '&quot;')}" style="color: #1677ff; text-decoration: underline; cursor: pointer;">${match}</a>`;
      });
      
      // 绑定点击事件
      const linkElements = el.querySelectorAll('a[data-open-url]');
      linkElements.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const url = link.dataset.openUrl;
          if (url) {
            window.api?.openExternalUrl?.(url);
          }
        });
      });
    }

    const dragHandle = el.querySelector('.bubble-panel-head');
    if (dragHandle instanceof HTMLElement) {
      let dragging = false;
      let lastScreenX = 0;
      let lastScreenY = 0;
      const shouldIgnoreDragTarget = (target) => target instanceof Element && Boolean(target.closest('button, input, select, textarea, a, [data-no-window-drag]'));

      dragHandle.addEventListener('pointerdown', (event) => {
        if (event.button !== 0) return;
        if (shouldIgnoreDragTarget(event.target)) return;
        dragging = true;
        lastScreenX = event.screenX;
        lastScreenY = event.screenY;
        dragHandle.setPointerCapture?.(event.pointerId);
        event.preventDefault();
      });

      dragHandle.addEventListener('pointermove', (event) => {
        if (!dragging) return;
        const dx = event.screenX - lastScreenX;
        const dy = event.screenY - lastScreenY;
        if (dx === 0 && dy === 0) return;
        window.api?.dragWindowBy(dx, dy);
        lastScreenX = event.screenX;
        lastScreenY = event.screenY;
      });

      const stopDrag = (event) => {
        if (!dragging) return;
        dragging = false;
        dragHandle.releasePointerCapture?.(event.pointerId);
      };

      dragHandle.addEventListener('pointerup', stopDrag);
      dragHandle.addEventListener('pointercancel', stopDrag);
    }
  } else if (msg.startsWith('<') && msg.includes('>')) {
    el.innerHTML = msg;
  } else {
    el.textContent = msg;
  }
  el.classList.remove('chat', 'reminder', 'self', 'work-arrival-bubble');
  el.classList.add(type);
  if (className) {
    el.classList.add(className);
  }
  el.style.display = 'flex';
  el.style.opacity = '0';
  requestAnimationFrame(() => {
    el.style.opacity = '1';
  });

  if (noAutoHide || durationMs <= 0) return;
  scheduleHideBubble(type, durationMs);
}

function showThinkingMessage(msg = '飞书里正在敲键盘…', type = 'chat') {
  showMessage(msg, type, { noAutoHide: true });
}

function showPairedMessages(selfMsg, replyMsg, replyType = 'chat', opts = {}) {
  const {
    durationMs = 6500
  } = opts || {};

  // 先展示两条（位置不变），但不单独计时；由“统一计时”一起隐藏
  showMessage(selfMsg, 'self', { noAutoHide: true });
  showMessage(replyMsg, replyType, { noAutoHide: true });

  // 统一计时，同步淡出
  scheduleHideBubble('self', durationMs);
  scheduleHideBubble(replyType === 'self' ? 'self' : 'chat', durationMs);
}

function isPanelExpanded() {
  return !plannerPanel.classList.contains('collapsed');
}

function collapsePlannerPanel() {
  plannerPanel.classList.add('collapsed');
  if (panelAutoHideTimer) {
    clearTimeout(panelAutoHideTimer);
    panelAutoHideTimer = null;
  }
}

function refreshPanelAutoHideTimer() {
  if (!isPanelExpanded()) return;
  if (panelAutoHideTimer) clearTimeout(panelAutoHideTimer);
  panelAutoHideTimer = setTimeout(() => {
    collapsePlannerPanel();
  }, PANEL_AUTO_HIDE_MS);
}

function expandPlannerPanel() {
  plannerPanel.classList.remove('collapsed');
  refreshPanelAutoHideTimer();
}

function markPanelInteraction() {
  lastUserActivityAt = Date.now();
  refreshPanelAutoHideTimer();
}

function savePlans() {
  localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plans));
}

function getDateKey(timestamp = Date.now()) {
  return window.RendererTimeUtils.getDateKey(timestamp);
}

function getWeekdayNameEn(timestamp = Date.now()) {
  return window.RendererTimeUtils.getWeekdayNameEn(timestamp);
}

function formatTrajectoryDisplayDate(timestamp = Date.now()) {
  return window.RendererTimeUtils.formatTrajectoryDisplayDate(timestamp);
}

function normalizeTrajectoryState(raw) {
  const safe = raw && typeof raw === 'object' ? raw : {};
  const tags = Array.isArray(safe.tags) && safe.tags.length > 0 ? safe.tags : [...TRAJECTORY_DEFAULT_TAGS];
  const records = Array.isArray(safe.records) ? safe.records : [];
  const daily = safe.daily && typeof safe.daily === 'object' ? safe.daily : {};
  return {
    version: 1,
    tags: tags.map((t) => ({
      id: String(t.id || '').trim() || `tag_${Math.random().toString(36).slice(2, 8)}`,
      name: String(t.name || '未命名').trim(),
      icon: String(t.icon || '•').trim().slice(0, 2),
      category: String(t.category || '生活').trim() || '生活'
    })),
    records: records
      .filter((r) => r && typeof r === 'object')
      .map((r) => ({
        id: String(r.id || `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`),
        tagId: String(r.tagId || ''),
        note: String(r.note || '').slice(0, 20),
        recordedAt: Number(r.recordedAt) || Date.now(),
        dateKey: String(r.dateKey || getDateKey(Number(r.recordedAt) || Date.now()))
      })),
    daily,
    activeCategory: String(safe.activeCategory || '全部')
  };
}

function saveTrajectory() {
  localStorage.setItem(TRAJECTORY_STORAGE_KEY, JSON.stringify(trajectoryState));
}

function migrateLegacyCheckinData() {
  for (const key of LEGACY_CHECKIN_STORAGE_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (!parsed) continue;

      if (Array.isArray(parsed)) {
        const now = Date.now();
        parsed.forEach((item, idx) => {
          const tagId = String(item?.tagId || item?.id || TRAJECTORY_DEFAULT_TAGS[idx % TRAJECTORY_DEFAULT_TAGS.length].id);
          const ts = Number(item?.time || item?.timestamp || now);
          trajectoryState.records.push({
            id: `${ts}_${Math.random().toString(36).slice(2, 8)}`,
            tagId,
            note: String(item?.note || ''),
            recordedAt: ts,
            dateKey: getDateKey(ts)
          });
        });
      }

      if (parsed.daily && typeof parsed.daily === 'object') {
        trajectoryState.daily = { ...trajectoryState.daily, ...parsed.daily };
      }

      localStorage.removeItem(key);
    } catch {
      // ignore bad legacy data
    }
  }
}

function loadTrajectory() {
  try {
    const raw = localStorage.getItem(TRAJECTORY_STORAGE_KEY);
    trajectoryState = normalizeTrajectoryState(raw ? JSON.parse(raw) : null);
  } catch {
    trajectoryState = normalizeTrajectoryState(null);
  }

  migrateLegacyCheckinData();
  saveTrajectory();
}

function isTagRecordedToday(tagId) {
  const today = getDateKey();
  const dailyMap = trajectoryState.daily?.[today] || {};
  if (Object.prototype.hasOwnProperty.call(dailyMap, tagId)) {
    const val = dailyMap[tagId];
    return Boolean(val?.recorded ?? val?.completed ?? false);
  }
  return trajectoryState.records.some((r) => r.dateKey === today && r.tagId === tagId);
}

function setTagRecordedToday(tagId, recorded) {
  const today = getDateKey();
  if (!trajectoryState.daily[today]) trajectoryState.daily[today] = {};
  trajectoryState.daily[today][tagId] = {
    recorded: Boolean(recorded),
    completed: Boolean(recorded),
    updatedAt: Date.now()
  };

  if (recorded) {
    trajectoryState.records.push({
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      tagId,
      note: '',
      recordedAt: Date.now(),
      dateKey: today
    });
  }

  saveTrajectory();
}

function getTrajectoryCategories() {
  const set = new Set(['全部']);
  trajectoryState.tags.forEach((t) => set.add(t.category || '生活'));
  return [...set];
}

function countContinuousRecordedDays() {
  const dates = new Set();
  Object.keys(trajectoryState.daily || {}).forEach((dateKey) => {
    const dayMap = trajectoryState.daily[dateKey] || {};
    const has = Object.values(dayMap).some((v) => Boolean(v?.recorded ?? v?.completed));
    if (has) dates.add(dateKey);
  });
  trajectoryState.records.forEach((r) => dates.add(r.dateKey));

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (true) {
    const key = getDateKey(cursor.getTime());
    if (!dates.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function calcMonthRecordedRate() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const today = now.getTime();
  const elapsedDays = Math.max(1, Math.floor((today - monthStart) / (24 * 3600 * 1000)) + 1);

  const activeDays = new Set();
  trajectoryState.records.forEach((r) => {
    if (r.recordedAt >= monthStart && r.recordedAt <= today) activeDays.add(r.dateKey);
  });
  Object.keys(trajectoryState.daily || {}).forEach((dateKey) => {
    const ts = new Date(`${dateKey}T00:00:00`).getTime();
    if (ts < monthStart || ts > today) return;
    const dayMap = trajectoryState.daily[dateKey] || {};
    const has = Object.values(dayMap).some((v) => Boolean(v?.recorded ?? v?.completed));
    if (has) activeDays.add(dateKey);
  });

  return Math.round((activeDays.size / elapsedDays) * 100);
}

function loadCheckinV2State() {
  try {
    const raw = localStorage.getItem(CHECKIN_V2_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return;

    const parsedTasks = Array.isArray(parsed.tasks) ? parsed.tasks : [];
    if (parsedTasks.length) {
      checkinV2State.tasks = parsedTasks
        .slice(0, CHECKIN_V2_MAX_TASKS)
        .map((t) => ({
          name: String(t?.name || '打卡事项').trim().slice(0, 16),
          done: Boolean(t?.done)
        }))
        .filter((t) => t.name)
        .filter((t) => !CHECKIN_V2_LEGACY_TASK_NAMES.includes(t.name));
    }

    const parsedCountdowns = Array.isArray(parsed.countdowns) ? parsed.countdowns : [];
    if (parsedCountdowns.length) {
      checkinV2State.countdowns = parsedCountdowns
        .slice(0, CHECKIN_V2_MAX_COUNTDOWNS)
        .map((c, idx) => ({
          id: String(c?.id || `c_${Date.now()}_${idx}`),
          name: String(c?.name || '').trim().slice(0, 16),
          targetDate: String(c?.targetDate || '').trim().slice(0, 16)
        }))
        .filter((c) => c.name && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(c.targetDate))
        .filter((c) => !CHECKIN_V2_LEGACY_COUNTDOWN_NAMES.includes(c.name));
    }

    if (typeof parsed.message === 'string' && parsed.message.trim()) {
      checkinV2State.message = parsed.message.trim().slice(0, 30);
    }

    if (Number.isFinite(parsed.lastActionTime)) {
      checkinV2State.lastActionTime = Number(parsed.lastActionTime);
    }
  } catch {
    // ignore
  }
}

function saveCheckinV2State() {
  try {
    localStorage.setItem(CHECKIN_V2_STORAGE_KEY, JSON.stringify(checkinV2State));
  } catch {
    // ignore
  }
}

function getCheckinV2ProgressInfo() {
  const total = checkinV2State.tasks.length;
  const done = checkinV2State.tasks.filter((t) => t.done).length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  return { total, done, percent };
}

function buildCheckinV2ProgressMessage(reason = 'status', taskName = '') {
  const { total, done, percent } = getCheckinV2ProgressInfo();
  const task = (taskName || '').trim();

  if (total === 0) {
    return '先加一个目标。我陪你把今天过好。';
  }

  if (done === total) {
    return `进度 ${percent}% · ${pickOne(CHECKIN_V2_MESSAGES_REWARD)}`;
  }

  if (reason === 'done') {
    const template = pickOne(CHECKIN_V2_MESSAGES_DONE);
    const line = template.replace('{task}', task || '这项');
    return `进度 ${percent}%（${done}/${total}）· ${line}`;
  }

  if (reason === 'undone') {
    return `进度 ${percent}%（${done}/${total}）· ${pickOne(CHECKIN_V2_MESSAGES_UNDONE)}`;
  }

  if (done === 0 || percent <= 25) {
    return `进度 ${percent}%（${done}/${total}）· ${pickOne(CHECKIN_V2_MESSAGES_NUDGE)}`;
  }

  if (percent < 60) {
    return `进度 ${percent}%（${done}/${total}）· 还差一点，先把「${checkinV2State.tasks.find((t) => !t.done)?.name || '下一项'}」做完。`;
  }

  return `进度 ${percent}%（${done}/${total}）· 节奏不错，收尾别松。`;
}

function updateCheckinV2IdleMessage() {
  if (Date.now() - checkinV2State.lastActionTime > CHECKIN_V2_IDLE_MS) {
    checkinV2State.message = buildCheckinV2ProgressMessage('idle');
  }
}

function addCheckinV2Task() {
  if (checkinV2State.tasks.length >= CHECKIN_V2_MAX_TASKS) {
    showMessage(`最多添加 ${CHECKIN_V2_MAX_TASKS} 个打卡事件。`, 'chat');
    return;
  }

  const name = (checkinV2TaskInput?.value || '').trim();
  if (!name) {
    showMessage('先输入打卡事件名称。', 'chat');
    return;
  }

  checkinV2State.tasks.push({ name: name.slice(0, 16), done: false });
  if (checkinV2TaskInput) checkinV2TaskInput.value = '';
  checkinV2State.lastActionTime = Date.now();
  checkinV2State.message = buildCheckinV2ProgressMessage('status');
  saveCheckinV2State();
  renderCheckinV2Panel();
}

function addCheckinV2Countdown() {
  if (checkinV2State.countdowns.length >= CHECKIN_V2_MAX_COUNTDOWNS) {
    showMessage(`最多添加 ${CHECKIN_V2_MAX_COUNTDOWNS} 个倒计时。`, 'chat');
    return;
  }

  const name = (checkinV2CountdownNameInput?.value || '').trim();
  const date = (checkinV2CountdownDateInput?.value || '').trim();
  const timestamp = parseCountdownDateTime(date);

  if (!name) {
    showMessage('先输入倒计时事件名称。', 'chat');
    return;
  }

  if (!timestamp) {
    showMessage('请选择精确到分钟的目标时间。', 'chat');
    return;
  }

  checkinV2State.countdowns.push({
    id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: name.slice(0, 16),
    targetDate: date.slice(0, 16)
  });

  if (checkinV2CountdownNameInput) checkinV2CountdownNameInput.value = '';
  if (checkinV2CountdownDateInput) checkinV2CountdownDateInput.value = '';

  checkinV2State.lastActionTime = Date.now();
  checkinV2State.message = `倒计时「${name.slice(0, 16)}」已添加。${buildCheckinV2ProgressMessage('status')}`;
  saveCheckinV2State();
  renderCheckinV2Panel();
}

function removeCheckinV2Task(index) {
  if (index < 0 || index >= checkinV2State.tasks.length) return;
  checkinV2State.tasks.splice(index, 1);
  saveCheckinV2State();
  renderCheckinV2Panel();
}

function removeCheckinV2Countdown(id) {
  checkinV2State.countdowns = checkinV2State.countdowns.filter((c) => c.id !== id);
  saveCheckinV2State();
  renderCheckinV2Panel();
}

function getWorkReviewSnapshot() {
  const completedTasks = checkinV2State.tasks.filter((t) => t.done).map((t) => t.name);
  const pendingTasks = checkinV2State.tasks.filter((t) => !t.done).map((t) => t.name);
  const countdowns = checkinV2State.countdowns.map((c) => `${c.name}（${formatCountdownLabel(c.targetDate)}）`);
  return {
    completedTasks,
    pendingTasks,
    countdowns
  };
}

function generateWorkReviewText(sourceText = '') {
  const notes = String(sourceText || workReviewNotes?.value || '').trim();
  const snapshot = getWorkReviewSnapshot();
  const notesLine = notes ? `今日进展：${notes}` : '今日进展：未填写';
  const doneLine = snapshot.completedTasks.length ? `已完成：${snapshot.completedTasks.join('、')}` : '已完成：暂无';
  const pendingLine = snapshot.pendingTasks.length ? `待处理：${snapshot.pendingTasks.join('、')}` : '待处理：暂无';
  const countdownLine = snapshot.countdowns.length ? `时间提醒：${snapshot.countdowns.join('、')}` : '时间提醒：暂无';
  return [
    '今日复盘',
    notesLine,
    doneLine,
    pendingLine,
    countdownLine,
    '建议：先收尾一个最重要事项，再处理消息和琐事。'
  ].join('\n');
}

function renderWorkReviewOutput(text = '') {
  if (!workReviewOutput) return;
  workReviewOutput.textContent = text || '';
}

function renderCheckinV2Panel() {
  if (!checkinV2Grid || !checkinV2Message || !checkinV2CountdownList) return;

  updateCheckinV2IdleMessage();
  checkinV2Message.textContent = checkinV2State.message;

  checkinV2Grid.innerHTML = '';
  if (checkinV2State.tasks.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'checkin-v2-empty';
    empty.textContent = '还没有打卡事件，点击上方“新增打卡事件”。';
    checkinV2Grid.appendChild(empty);
  } else {
    checkinV2State.tasks.forEach((task, index) => {
      const card = document.createElement('div');
      card.className = `checkin-v2-task ${task.done ? 'done' : ''}`;

      const toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = 'checkin-v2-toggle';
      toggleBtn.title = '点击切换完成';
      toggleBtn.innerHTML = `<span class="checkin-v2-icon">${task.done ? '🍮' : '○'}</span><span class="checkin-v2-name">${task.name}</span>`;
      toggleBtn.addEventListener('click', () => {
        const nextDone = !checkinV2State.tasks[index].done;
        checkinV2State.tasks[index].done = nextDone;
        checkinV2State.lastActionTime = Date.now();
        checkinV2State.message = buildCheckinV2ProgressMessage(nextDone ? 'done' : 'undone', task.name);
        saveCheckinV2State();
        renderCheckinV2Panel();
      });

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'checkin-v2-remove';
      removeBtn.title = '删除';
      removeBtn.textContent = '×';
      removeBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        if (!window.confirm(`删除打卡事件「${task.name}」？`)) return;
        removeCheckinV2Task(index);
      });

      card.appendChild(toggleBtn);
      card.appendChild(removeBtn);
      checkinV2Grid.appendChild(card);
    });
  }

  checkinV2CountdownList.innerHTML = '';
  if (checkinV2State.countdowns.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'checkin-v2-empty';
    empty.textContent = '还没有倒计时，点击“新增倒计时”。';
    checkinV2CountdownList.appendChild(empty);
  } else {
    checkinV2State.countdowns.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'checkin-v2-row';
      row.innerHTML = `<span>${item.name}</span><strong>${formatCountdownLabel(item.targetDate)}</strong><button class="checkin-v2-row-remove" type="button" title="删除">×</button>`;
      row.title = `${item.name} · 目标时间 ${item.targetDate}`;
      const removeBtn = row.querySelector('.checkin-v2-row-remove');
      removeBtn?.addEventListener('click', (event) => {
        event.stopPropagation();
        if (!window.confirm(`删除倒计时「${item.name}」？`)) return;
        removeCheckinV2Countdown(item.id);
      });
      checkinV2CountdownList.appendChild(row);
    });
  }
}

function renderTrajectoryPanel() {
  if (checkinV2Grid && checkinV2Message) {
    renderCheckinV2Panel();
    return;
  }

  if (!trajectoryTags || !trajectoryStats || !trajectoryTimeline) return;

  trajectoryTodayDate.textContent = formatTrajectoryDisplayDate();
  trajectoryTimelineDate.textContent = '今日';

  trajectoryTags.innerHTML = '';
  trajectoryState.tags.forEach((tag) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    const recorded = isTagRecordedToday(tag.id);
    btn.className = `trajectory-tag ${recorded ? 'recorded' : ''}`;
    btn.innerHTML = `<span>${tag.icon}</span><em>${tag.name}</em>`;
    btn.addEventListener('click', () => {
      setTagRecordedToday(tag.id, !isTagRecordedToday(tag.id));
      renderTrajectoryPanel();
    });
    trajectoryTags.appendChild(btn);
  });

  const categories = getTrajectoryCategories();
  trajectoryCategoryTabs.innerHTML = '';
  categories.forEach((c) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = `trajectory-tab ${trajectoryState.activeCategory === c ? 'active' : ''}`;
    tab.textContent = c;
    tab.addEventListener('click', () => {
      trajectoryState.activeCategory = c;
      saveTrajectory();
      renderTrajectoryPanel();
    });
    trajectoryCategoryTabs.appendChild(tab);
  });

  const visibleTags = trajectoryState.activeCategory === '全部'
    ? trajectoryState.tags
    : trajectoryState.tags.filter((t) => (t.category || '生活') === trajectoryState.activeCategory);

  trajectoryStats.innerHTML = '';
  visibleTags.forEach((tag) => {
    const count = trajectoryState.records.filter((r) => r.tagId === tag.id).length;
    const li = document.createElement('li');
    li.innerHTML = `<span>${tag.icon} ${tag.name}</span><strong>${count}次</strong>`;
    trajectoryStats.appendChild(li);
  });

  const today = getDateKey();
  const timeline = trajectoryState.records
    .filter((r) => r.dateKey === today)
    .sort((a, b) => b.recordedAt - a.recordedAt)
    .slice(0, 12);

  trajectoryTimeline.innerHTML = '';
  if (timeline.length === 0) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = '今天还没有轨迹记录。';
    trajectoryTimeline.appendChild(li);
  } else {
    timeline.forEach((item) => {
      const tag = trajectoryState.tags.find((t) => t.id === item.tagId);
      const li = document.createElement('li');
      li.innerHTML = `<span>${formatTime(item.recordedAt, false)} · ${tag?.icon || '•'} ${tag?.name || '未分类'}</span><em>${item.note || '已记录'}</em>`;
      trajectoryTimeline.appendChild(li);
    });
  }

  const streak = countContinuousRecordedDays();
  const rate = calcMonthRecordedRate();
  trajectoryStreak.textContent = `连续 ${streak} 天`;
  trajectoryRate.textContent = `月记录率 ${rate}%`;
}

function openTrajectoryQuickAdd() {
  const options = trajectoryState.tags.map((t, idx) => `${idx + 1}. ${t.icon} ${t.name}`).join('\n');
  const pick = window.prompt(`选择轨迹标签（输入序号）\n${options}`, '1');
  if (pick === null) return;
  const idx = Number(pick) - 1;
  if (!Number.isInteger(idx) || idx < 0 || idx >= trajectoryState.tags.length) {
    showMessage('标签序号不对。', 'chat');
    return;
  }
  const tag = trajectoryState.tags[idx];
  const note = window.prompt('写一句备注（10字内，可留空）', '') || '';
  const cleanNote = note.trim().slice(0, 10);
  const now = Date.now();
  const dateKey = getDateKey(now);

  if (!trajectoryState.daily[dateKey]) trajectoryState.daily[dateKey] = {};
  trajectoryState.daily[dateKey][tag.id] = { recorded: true, completed: true, updatedAt: now };
  trajectoryState.records.push({
    id: `${now}_${Math.random().toString(36).slice(2, 8)}`,
    tagId: tag.id,
    note: cleanNote,
    recordedAt: now,
    dateKey
  });
  saveTrajectory();
  renderTrajectoryPanel();
  showMessage(`已记录：${tag.name}。`, 'chat');
}

function loadPlans() {
  try {
    const raw = localStorage.getItem(PLAN_STORAGE_KEY);
    plans = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(plans)) plans = [];
  } catch {
    plans = [];
  }
}

function toLocalDatetimeValue(timestamp) {
  return window.RendererTimeUtils.toLocalDatetimeValue(timestamp);
}

function formatTime(timestamp, withDate = true) {
  return window.RendererTimeUtils.formatTime(timestamp, withDate);
}

function getRepeatLabel(repeat) {
  return window.RendererTimeUtils.getRepeatLabel(repeat);
}

function weekdayShortLabel(d) {
  return window.RendererTimeUtils.weekdayShortLabel(d);
}

function formatWeeklyDays(days) {
  return window.RendererTimeUtils.formatWeeklyDays(days);
}

function getSelectedWeeklyDaysFromUI() {
  if (!weeklyDaysRow) return [];
  const inputs = weeklyDaysRow.querySelectorAll('input[type="checkbox"]');
  const picked = [];
  inputs.forEach((el) => {
    if (el.checked) picked.push(Number(el.value));
  });
  return picked.filter((x) => Number.isInteger(x) && x >= 0 && x <= 6);
}

function applyWeeklyDaysToUI(days) {
  if (!weeklyDaysRow) return;
  const picked = new Set((Array.isArray(days) ? days : []).map((d) => Number(d)));
  const inputs = weeklyDaysRow.querySelectorAll('input[type="checkbox"]');
  inputs.forEach((el) => {
    const v = Number(el.value);
    el.checked = picked.has(v);
  });
}

function setWeeklyRowVisible(visible) {
  if (!weeklyDaysRow) return;
  weeklyDaysRow.classList.toggle('hidden', !visible);
}

function nextWeeklyTime(fromTimestamp, weekDays) {
  return window.RendererTimeUtils.nextWeeklyTime(fromTimestamp, weekDays);
}

function nextDailyTime(fromTime) {
  return window.RendererTimeUtils.nextDailyTime(fromTime);
}

function normalizeHour(hour, period) {
  return window.RendererTimeUtils.normalizeHour(hour, period);
}

function nextScheduledTime(fromTimestamp, repeat, weekDays) {
  return window.RendererTimeUtils.nextScheduledTime(fromTimestamp, repeat, weekDays);
}

function parseChineseNumberToken(token) {
  return window.RendererTimeUtils.parseChineseNumberToken(token);
}

function parseTimeFromText(rawText) {
  return window.RendererTimeUtils.parseTimeFromText(rawText);
}

function parseNaturalInput(text) {
  return window.RendererTextUtils.parseNaturalInput(text, window.RendererTimeUtils.parseTimeFromText);
}

function renderPlans() {
  planList.innerHTML = '';

  if (plans.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'plan-empty';
    empty.textContent = '还没有安排。';
    planList.appendChild(empty);
    return;
  }

  const sorted = [...plans].sort((a, b) => a.time - b.time);

  sorted.forEach((plan) => {
    const li = document.createElement('li');
    li.className = 'plan-item';

    const info = document.createElement('div');
    info.className = 'plan-info';

    const title = document.createElement('div');
    title.className = 'plan-title';
    title.textContent = plan.title;

    const meta = document.createElement('div');
    meta.className = 'plan-meta';
    const isRepeat = plan.repeat === 'daily' || plan.repeat === 'weekly';
    const showDate = !isRepeat;
    const repeatText = plan.repeat === 'weekly'
      ? `每周${formatWeeklyDays(plan.weekDays)}`
      : getRepeatLabel(plan.repeat);
    meta.textContent = `${formatTime(plan.time, showDate)} · ${repeatText}`;

    info.appendChild(title);
    info.appendChild(meta);

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'del-btn no-drag';
    delBtn.textContent = '删除';
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      plans = plans.filter((p) => p.id !== plan.id);
      savePlans();
      renderPlans();
      showMessage('删了。下次别乱记。', 'chat');
    });

    li.appendChild(info);
    li.appendChild(delBtn);
    planList.appendChild(li);
  });
}

function openConfirmCard(draft, sourceText = '') {
  // 确认卡在计划面板里：面板若处于 collapsed 会禁用点击（pointer-events: none）
  // 所以这里强制展开，确保“确认/取消”可点击。
  expandPlannerPanel();
  markPanelInteraction();
  // 如果当前有提醒覆盖层在最上层，会挡住确认按钮的点击
  hideReminderActions();

  const safeDraft = (draft && typeof draft === 'object') ? draft : {};
  pendingDraft = {
    ...safeDraft,
    sourceText: String(sourceText || '')
  };

  taskTitle.value = String(pendingDraft.title || '');
  taskTime.value = toLocalDatetimeValue(Number(pendingDraft.time) || Date.now());
  taskRepeat.value = String(pendingDraft.repeat || 'none');
  setWeeklyRowVisible(pendingDraft.repeat === 'weekly');
  applyWeeklyDaysToUI(pendingDraft.weekDays || []);
  confirmCard.classList.remove('hidden');
  if (pendingDraft.sourceText) {
    showPairedMessages(pendingDraft.sourceText, '是这个安排？', 'chat');
  } else {
    showMessage('是这个安排？', 'chat');
  }
}

function closeConfirmCard() {
  pendingDraft = null;
  confirmCard.classList.add('hidden');
  setWeeklyRowVisible(false);
}

let pendingConfirmCallback = null;
let pendingCancelCallback = null;

function showConfirmDialog(options = {}) {
  const title = String(options.title || '确认操作');
  const content = String(options.content || '是否确认执行此操作？');
  pendingConfirmCallback = options.onConfirm || null;
  pendingCancelCallback = options.onCancel || null;

  if (taskTitle) taskTitle.value = title;
  if (taskTime) taskTime.value = content;
  confirmCard.classList.remove('hidden');
  showMessage(content, 'chat');
}

confirmBtn?.addEventListener('click', () => {
  closeConfirmCard();
  if (typeof pendingConfirmCallback === 'function') {
    const cb = pendingConfirmCallback;
    pendingConfirmCallback = null;
    pendingCancelCallback = null;
    cb();
  }
});

cancelBtn?.addEventListener('click', () => {
  closeConfirmCard();
  if (typeof pendingCancelCallback === 'function') {
    const cb = pendingCancelCallback;
    pendingConfirmCallback = null;
    pendingCancelCallback = null;
    cb();
  }
});

function pickOne(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function setCharacterState(stateName, duration = 350) {
  if (!characterWrap) return;
  characterWrap.classList.remove(
    'state-idle',
    'state-tap',
    'state-happy',
    'state-shake',
    'state-blink',
    'state-look-left',
    'state-look-right',
    'state-jump',
    'state-angry',
    'state-sweep',
    'state-drag'
  );
  characterWrap.classList.add(stateName);

  if (broomProp) {
    broomProp.style.opacity = stateName === 'state-sweep' ? '1' : '';
  }

  if (duration > 0) {
    window.setTimeout(() => {
      characterWrap.classList.remove(stateName);
      if (!characterWrap.classList.contains('state-idle')) {
        characterWrap.classList.add('state-idle');
      }
      if (broomProp) broomProp.style.opacity = '';
    }, duration);
  }
}

function triggerIdleAction() {
  if (isActing) return;

  const action = Math.random();
  if (action < 0.3) {
    setCharacterState('state-blink', 240);
    return;
  }
  if (action < 0.55) {
    setCharacterState('state-look-left', 500);
    return;
  }
  if (action < 0.8) {
    setCharacterState('state-look-right', 500);
    return;
  }
  setCharacterState('state-jump', 420);
}

function playSweepAction() {
  if (isActing) return false;

  isActing = true;
  setCharacterState('state-sweep', 1200);

  window.setTimeout(() => {
    isActing = false;
    showMessage(pickOne(['扫好了。地面干净了。', '打扫完毕。现在去做正事。', '地我扫了，任务你做。']), 'chat');
  }, 1250);

  return true;
}

function startIdleActions() {
  if (idleActionTimer) clearInterval(idleActionTimer);
  idleActionTimer = setInterval(() => {
    if (characterPointerActive || characterDragging) return;
    if (isPanelExpanded() && document.activeElement === quickInput) return;
    maybeSendCareMessage();
    triggerIdleAction();
  }, IDLE_ACTION_INTERVAL_MS);
}

function isPokeAngryTriggered() {
  const now = Date.now();
  pokeTimestamps = pokeTimestamps.filter((t) => now - t <= POKE_ANGRY_WINDOW_MS);
  pokeTimestamps.push(now);
  return pokeTimestamps.length >= POKE_ANGRY_THRESHOLD;
}

function getRandomAvatarIndex(excludeIndex = -1) {
  let next = Math.floor(Math.random() * AVATAR_TOTAL) + 1;
  if (AVATAR_TOTAL > 1 && next === excludeIndex) {
    next = (next % AVATAR_TOTAL) + 1;
  }
  return next;
}

function getCurrentAvatarIndex() {
  if (!characterImg) return 1;
  const src = characterImg.getAttribute('src') || '';
  const m = src.match(/形象(\d+)\.jpg$/);
  return m ? Number(m[1]) : 1;
}

function stopCharacterGifPlayback() {
  if (!characterWrap || !characterGif) return;
  characterWrap.classList.remove('playing-gif', 'video-zoom-2x', 'video-offset-down');
  characterGif.pause();
  characterGif.removeAttribute('src');
  characterGif.load();
}

function playAvatarDoubleTapGif() {
  if (!characterWrap || !characterGif || !characterImg) return false;

  const current = getCurrentAvatarIndex();
  const candidateSources = AVATAR_DBL_VIDEO_MAP[current];
  if (!candidateSources?.length) return false;

  let sourceIndex = 0;
  let settled = false;

  const cleanupListeners = () => {
    characterGif.onerror = null;
    characterGif.onloadeddata = null;
    characterGif.onended = null;
  };

  const notifyPlaybackFailed = () => {
    showMessage('动作播放失败：可能不支持 webm/mov 编码。', 'chat');
  };

  const tryPlayAt = () => {
    if (sourceIndex >= candidateSources.length) {
      cleanupListeners();
      stopCharacterGifPlayback();
      notifyPlaybackFailed();
      return;
    }

    settled = false;
    const nextSrc = candidateSources[sourceIndex++];
    characterGif.src = nextSrc;
    characterWrap.classList.add('playing-gif');
    // 形象1/2：视频整体向下挪一点，更贴合画框
    if (current === 1 || current === 2) {
      characterWrap.classList.add('video-offset-down');
    } else {
      characterWrap.classList.remove('video-offset-down');
    }
    // 形象2：做“2倍大”的效果，但保持 object-fit: contain，确保仍完整在画框里不裁切。
    if (current === 2) {
      characterWrap.classList.add('video-zoom-2x');
    } else {
      characterWrap.classList.remove('video-zoom-2x');
    }
    characterGif.currentTime = 0;

    characterGif.onerror = () => {
      if (settled) return;
      settled = true;
      tryPlayAt();
    };

    characterGif.onloadeddata = () => {
      if (settled) return;
      settled = true;

      characterGif.onended = () => {
        cleanupListeners();
        stopCharacterGifPlayback();
      };

      const playPromise = characterGif.play();
      if (playPromise?.catch) {
        playPromise.catch(() => {
          cleanupListeners();
          tryPlayAt();
        });
      }

      window.setTimeout(() => {
        if (characterWrap.classList.contains('playing-gif')) {
          cleanupListeners();
          stopCharacterGifPlayback();
        }
      }, 15000);
    };

    characterGif.load();

    window.setTimeout(() => {
      if (settled) return;
      settled = true;
      tryPlayAt();
    }, 900);
  };

  tryPlayAt();
  return true;
}

function refreshCharacterAvatar(force = false) {
  if (!characterImg) return;
  stopCharacterGifPlayback();
  const current = getCurrentAvatarIndex();
  const nextIndex = force ? getRandomAvatarIndex(-1) : getRandomAvatarIndex(current);
  characterImg.src = `${AVATAR_BASE}${nextIndex}${AVATAR_EXT}`;
  characterImg.alt = `李泽言形象${nextIndex}`;

  // 除了形象8，其它形象图缩小到 0.7 倍
  characterImg.style.transformOrigin = 'center bottom';
  const isExempt = nextIndex === AVATAR_SCALE_EXEMPT_INDEX;
  characterImg.style.transform = isExempt ? 'scale(1)' : `scale(${AVATAR_SCALE_DEFAULT})`;
  if (characterWrap) {
    characterWrap.style.marginTop = isExempt ? '' : `${2 - AVATAR_SCALE_LIFT_PX}px`;
  }
}

function applyAvatarScaleForCurrent() {
  if (!characterImg) return;
  const idx = getCurrentAvatarIndex();
  characterImg.style.transformOrigin = 'center bottom';
  const isExempt = idx === AVATAR_SCALE_EXEMPT_INDEX;
  characterImg.style.transform = isExempt ? 'scale(1)' : `scale(${AVATAR_SCALE_DEFAULT})`;
  if (characterWrap) {
    characterWrap.style.marginTop = isExempt ? '' : `${2 - AVATAR_SCALE_LIFT_PX}px`;
  }
}

function installAvatarScaleAutoApply() {
  if (!characterImg) return;

  const apply = () => applyAvatarScaleForCurrent();

  // 图片真正加载完成时再补一遍，避免首帧/缓存时序导致的“启动很大”
  characterImg.addEventListener('load', apply);
  characterImg.addEventListener('error', apply);

  // 只要 src 属性变化（包括启动时、随机切换、手动换图），都立即应用一次
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'attributes' && m.attributeName === 'src') {
        apply();
        break;
      }
    }
  });
  observer.observe(characterImg, { attributes: true, attributeFilter: ['src'] });

  // 立即先应用一次
  apply();
}

function startAvatarAutoRefresh() {
  if (avatarRefreshTimer) clearInterval(avatarRefreshTimer);
  avatarRefreshTimer = setInterval(() => {
    refreshCharacterAvatar(false);
  }, AVATAR_REFRESH_MS);
}

function getIntimacyKey() {
  const level = Math.min(3, Math.max(1, Number(userProfile.intimacyLevel) || 2));
  return INTIMACY_LEVELS[level - 1] || 'L2';
}

function sanitizeForKey(text) {
  return window.RendererTextUtils.sanitizeForKey(text);
}

function splitKeywords(raw) {
  return window.RendererTextUtils.splitKeywords(raw);
}

function buildLineKey(triggerId, intimacyKey, line) {
  return `${triggerId}::${intimacyKey}::${sanitizeForKey(line)}`;
}

function ensureTriggerState(triggerId) {
  if (!triggerState.triggerRecent[triggerId] || !Array.isArray(triggerState.triggerRecent[triggerId])) {
    triggerState.triggerRecent[triggerId] = [];
  }
}

function getBagKey(triggerId, intimacyKey) {
  return `${triggerId}::${intimacyKey}`;
}

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pushRecentGlobal(lineKey) {
  triggerState.globalRecent.push(lineKey);
  if (triggerState.globalRecent.length > REPLY_POLICY.globalRecentQueueSize) {
    triggerState.globalRecent = triggerState.globalRecent.slice(-REPLY_POLICY.globalRecentQueueSize);
  }
}

function pushRecentByTrigger(triggerId, lineKey) {
  ensureTriggerState(triggerId);
  triggerState.triggerRecent[triggerId].push(lineKey);
  if (triggerState.triggerRecent[triggerId].length > REPLY_POLICY.perTriggerRecentQueueSize) {
    triggerState.triggerRecent[triggerId] = triggerState.triggerRecent[triggerId].slice(-REPLY_POLICY.perTriggerRecentQueueSize);
  }
}

function linePassesMinInterval(lineKey) {
  const lastUsed = Number(triggerState.lineLastUsedAt[lineKey] || 0);
  if (!lastUsed) return true;
  return Date.now() - lastUsed >= REPLY_POLICY.sameLineMinIntervalSec * 1000;
}

function pickFromShuffleBag(triggerId, intimacyKey, lines) {
  const bagKey = getBagKey(triggerId, intimacyKey);
  if (!Array.isArray(triggerState.bags[bagKey]) || triggerState.bags[bagKey].length === 0) {
    triggerState.bags[bagKey] = shuffleArray(lines.map((line) => buildLineKey(triggerId, intimacyKey, line)));
  }

  const perTriggerRecent = triggerState.triggerRecent[triggerId] || [];
  const globalRecent = triggerState.globalRecent || [];

  let attempts = 0;
  const maxAttempts = Math.max(20, (triggerState.bags[bagKey] || []).length * 2);

  while (attempts < maxAttempts) {
    attempts += 1;
    if (!triggerState.bags[bagKey] || triggerState.bags[bagKey].length === 0) {
      triggerState.bags[bagKey] = shuffleArray(lines.map((line) => buildLineKey(triggerId, intimacyKey, line)));
    }

    const candidateKey = triggerState.bags[bagKey].shift();
    const parts = candidateKey.split('::');
    const line = parts.slice(2).join('::');

    const blockedByTriggerRecent = perTriggerRecent.includes(candidateKey);
    const blockedByGlobalRecent = globalRecent.includes(candidateKey);
    const blockedByMinInterval = !linePassesMinInterval(candidateKey);

    if (blockedByTriggerRecent || blockedByGlobalRecent || blockedByMinInterval) {
      continue;
    }

    triggerState.lineLastUsedAt[candidateKey] = Date.now();
    pushRecentGlobal(candidateKey);
    pushRecentByTrigger(triggerId, candidateKey);
    saveChatMemory();
    return line;
  }

  const fallbackLine = lines[Math.floor(Math.random() * lines.length)] || null;
  if (!fallbackLine) return null;

  const fallbackKey = buildLineKey(triggerId, intimacyKey, fallbackLine);
  triggerState.lineLastUsedAt[fallbackKey] = Date.now();
  pushRecentGlobal(fallbackKey);
  pushRecentByTrigger(triggerId, fallbackKey);
  saveChatMemory();
  return fallbackLine;
}

function tryTriggerLibraryReply(text) {
  const input = window.RendererTextUtils.normalizeRecentText(text);
  if (!input) return null;

  const trigger = TRIGGER_LIBRARY.find((item) => item.keywords.some((k) => input.includes(k)));
  if (!trigger) return null;

  const intimacyKey = getIntimacyKey();
  const lines = (trigger.lines && trigger.lines[intimacyKey]) || trigger.lines?.L2 || [];
  if (!Array.isArray(lines) || lines.length === 0) return null;

  return pickFromShuffleBag(trigger.id, intimacyKey, lines);
}

function tryChatReply(text) {
  const triggerReply = tryTriggerLibraryReply(text);
  if (triggerReply) return triggerReply;

  const input = window.RendererTextUtils.normalizeRecentText(text);
  if (!input) return null;

  const hit = CHAT_MAP.find((item) => item.keys.some((k) => input.includes(k)));
  return hit ? pickOne(hit.replies) : null;
}

function looksLikeTaskInput(text) {
  return window.RendererTextUtils.hasTaskLikeText(text);
}

function setInputMode(mode) {
  inputMode = mode === 'task' ? 'task' : 'chat';
  const allBtns = [modeChatBtn, modeTaskBtn].filter(Boolean);
  allBtns.forEach((btn) => {
    const active = btn.dataset.mode === inputMode;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });

  const advancedDock = document.getElementById('advancedDock');
  if (advancedDock) {
    advancedDock.classList.toggle('chat-input-active', inputMode === 'chat');
  }

  if (inputMode === 'task') {
    quickInput.placeholder = '对我说些什么吧。';
    showMessage('提醒模式。把时间说清楚。', 'chat');
  } else {
    quickInput.placeholder = feishuModeEnabled ? '飞书模式已开启，所有消息都会发到飞书。' : '我在，说吧。我听着。';
    showMessage(feishuModeEnabled ? '飞书模式已开启。所有消息都会直接发到飞书。' : '聊天模式。你说，我听着。', 'chat');
  }
}

function syncModeButtonState(button, enabled) {
  button?.classList.toggle('active', enabled);
  button?.setAttribute('aria-pressed', enabled ? 'true' : 'false');
}

function setFeishuMode(enabled) {
  feishuModeEnabled = Boolean(enabled);
  syncModeButtonState(feishuModeBtn, feishuModeEnabled);
  if (inputMode === 'chat') {
    quickInput.placeholder = feishuModeEnabled ? '飞书模式已开启，所有消息都会发到飞书。' : '我在，说吧。我听着。';
  }
}

function setWebAssistantMode(enabled) {
  webAssistantEnabled = Boolean(enabled);
  syncModeButtonState(webAssistantBtn, webAssistantEnabled);
  if (webAssistantEnabled) {
    showMessage('你已进入网页助手模式。', 'chat');
    quickInput.placeholder = '问我网页内容，我会帮你看。';
    ensureWebAssistantTools();
    summarizeCurrentPage(true);
  } else {
    showMessage('已退出网页助手模式。', 'chat');
    clearWebAssistantTools();
    if (inputMode === 'chat') {
      quickInput.placeholder = feishuModeEnabled ? '飞书模式已开启，所有消息都会发到飞书。' : '我在，说吧。我听着。';
    }
  }
}

function getPageTextContext() {
  const clone = document.body.cloneNode(true);
  [
    '#pet',
    '#advancedDock',
    '#advancedPanels',
    '#reminderOverlay',
    '#floatingWebAssistantButton'
  ].forEach((selector) => clone.querySelector(selector)?.remove());

  const text = clone.innerText || document.body.innerText || '';
  return window.RendererTextUtils.normalizePageText(text);
}

function ensureWebAssistantTools() {
  if (webAssistantAskButton) return;

  webAssistantAskButton = document.createElement('button');
  webAssistantAskButton.id = 'floatingWebAssistantButton';
  webAssistantAskButton.type = 'button';
  webAssistantAskButton.textContent = '问李泽言';
  Object.assign(webAssistantAskButton.style, {
    position: 'fixed',
    zIndex: '100000',
    display: 'none',
    padding: '6px 10px',
    borderRadius: '999px',
    border: '1px solid rgba(255,255,255,0.35)',
    background: 'rgba(20, 20, 26, 0.92)',
    color: '#fff',
    fontSize: '13px',
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
  });
  document.body.appendChild(webAssistantAskButton);

  webAssistantAskButton.addEventListener('click', async () => {
    if (!webAssistantSelection) return;
    const question = `请结合网页内容解释这段话：${webAssistantSelection}`;
    quickInput.value = question;
    webAssistantAskButton.style.display = 'none';
    await handleWebAssistantQuestion(question, true);
  });

  document.addEventListener('mouseup', handleWebAssistantSelection);
  document.addEventListener('mousedown', (e) => {
    if (!webAssistantAskButton.contains(e.target) && webAssistantAskButton.style.display === 'block') {
      setTimeout(() => {
        if (!webAssistantEnabled) return;
        if (!webAssistantSelection) webAssistantAskButton.style.display = 'none';
      }, 50);
    }
  });
}

function clearWebAssistantTools() {
  if (webAssistantAskButton) {
    webAssistantAskButton.style.display = 'none';
  }
  webAssistantSelection = '';
}

function handleWebAssistantSelection() {
  if (!webAssistantEnabled || !webAssistantAskButton) return;

  const selection = window.getSelection?.();
  const text = selection ? selection.toString().trim() : '';
  if (!text || !selection.rangeCount) {
    webAssistantSelection = '';
    webAssistantAskButton.style.display = 'none';
    return;
  }

  webAssistantSelection = text.slice(0, 300);
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  webAssistantAskButton.style.left = `${Math.max(12, rect.right + window.scrollX + 8)}px`;
  webAssistantAskButton.style.top = `${Math.max(12, rect.bottom + window.scrollY + 8)}px`;
  webAssistantAskButton.style.display = 'block';
}

async function callWebAssistantApi(payload) {
  if (!window.api?.llmChat) {
    return { ok: false, error: '当前运行环境没有可用的 AI 接口。' };
  }

  const systemPrompt = `你是李泽言。你现在处于“网页助手模式”。
请根据网页内容做三件事：1）简洁总结网页；2）回答用户选中文本/追问；3）保持李泽言的语气，简洁、准确、克制。
不要改变角色，不要自称模型，不要输出无关废话。`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...payload.messages
  ];

  const res = await withTimeout(window.api.llmChat({
    messages,
    max_tokens: payload.max_tokens || 1200
  }), 16000);

  const reply = String(res?.reply || '').trim();
  if (!res?.ok || !reply) {
    return { ok: false, error: res?.error || 'AI 返回为空' };
  }
  return { ok: true, reply };
}

async function summarizeCurrentPage(force = false) {
  if (!webAssistantEnabled && !force) return;
  const pageText = getPageTextContext();
  if (!pageText) {
    showMessage('当前页面没有可读取的内容。', 'chat');
    return;
  }
  webAssistantContextCache = pageText;
  const question = '请阅读当前网页内容，给出简洁总结，并指出最值得关注的3点。';
  await handleWebAssistantQuestion(question, false, pageText);
}

async function handleWebAssistantQuestion(question, fromSelection = false, contextText = '') {
  const pageText = contextText || webAssistantContextCache || getPageTextContext();
  if (!pageText) {
    showMessage('当前页面没有可读取的内容。', 'chat');
    return;
  }

  const userText = fromSelection ? `选中文本：${webAssistantSelection}\n\n问题：${question}` : question;
  const messages = [
    { role: 'user', content: `网页内容：\n${pageText.slice(0, 12000)}\n\n${userText}` }
  ];

  showMessage('正在看网页。别催。', 'chat');
  try {
    const result = await callWebAssistantApi({ messages, max_tokens: 1400 });
    const reply = result.ok ? result.reply.trim() : '网页助手暂时没拿到结果。';
    showMessage(reply, 'chat');
    rememberTurn('assistant', reply, { mode: 'web-assistant', intent: 'web' });
  } catch (error) {
    showMessage(`网页助手出错了：${error.message}`, 'chat');
  }
}

function buildLlmMessages(text) {
  const recalled = recallEpisodes(text, { max: 3 });
  const memoryHints = recalled
    .map((x) => `- 用户: ${x.userText} / 你: ${x.assistantText}`)
    .join('\n');

  const profileLine = `称呼:${userProfile.nickname || '无'}; 亲密度:L${Math.min(3, Math.max(1, Number(userProfile.intimacyLevel) || 2))}`;
  const history = getRecentContext()
    .slice(-6)
    .map((turn) => ({
      role: turn.role === 'assistant' ? 'assistant' : 'user',
      content: String(turn.content || '').slice(0, 180)
    }));

  return [
    {
      role: 'system',
      content: `${LLM_SYSTEM_PROMPT}\n用户画像: ${profileLine}\n可参考记忆:\n${memoryHints || '- 无'}`
    },
    ...history,
    { role: 'user', content: text }
  ];
}

function withTimeout(promise, timeoutMs) {
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve({ ok: false, error: 'timeout' });
    }, timeoutMs);

    promise
      .then((v) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(v);
      })
      .catch((err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve({ ok: false, error: err?.message || 'error' });
      });
  });
}

async function executeLarkCommandWithConfirm(command, description) {
  const confirmResult = await dialog.showMessageBox({
    type: 'question',
    buttons: ['执行', '取消'],
    title: '飞书操作确认',
    message: `即将执行以下操作：\n${description}\n\n命令：${command}`,
    detail: '确认要执行这个操作吗？'
  });

  if (confirmResult.response !== 0) {
    return { ok: false, cancelled: true, message: '已取消操作' };
  }

  return window.api.executeLarkCommand({ command, description });
}

async function pushCliReplyToPet(userText, cliReply) {
  const reply = String(cliReply || '').trim();
  if (!reply) return { ok: false, error: '空回复' };
  showMessage(String(userText || '').trim(), 'self', { noAutoHide: true });
  showMessage(reply, 'chat', { noAutoHide: true });
  scheduleHideBubble('self', 6500);
  scheduleHideBubble('chat', 6500);
  pushRecentReply(reply);
  rememberTurn('assistant', reply, {
    mode: 'chat',
    intent: 'lark_cli_reply',
    emotion: 'neutral',
    mapped: false,
    llm: false
  });
  return { ok: true, reply };
}

async function maybeLlmReply(text) {
  if (!window.api?.llmChat) {
    return { ok: false, reason: 'api_missing' };
  }

  const payload = {
    messages: buildLlmMessages(text),
    max_tokens: 512
  };

  const res = await withTimeout(window.api.llmChat(payload), LLM_TIMEOUT_MS);

  if (!res?.ok) {
    return { ok: false, reason: 'llm_failed', error: res?.error || 'unknown error' };
  }

  // 检查是否是工具调用
  if (res.is_tool_call && res.tool_call) {
    const { command, description } = res.tool_call;
    
    // 检查飞书登录状态
    const loginStatus = await window.api.checkLarkLogin();
    if (!loginStatus.logged_in) {
      return { ok: true, reply: '你还没有登录飞书哦，请先完成飞书配置后再使用这个功能。' };
    }

    // 弹出确认
    const userConfirmed = confirm(`确定要执行以下操作吗？\n${description}\n\n命令：${command}`);
    if (!userConfirmed) {
      return { ok: true, reply: '好的，我取消了这个操作。' };
    }

    // 执行命令
    const execResult = await window.api.executeLarkCommand({ command, description });
    
    if (execResult.ok) {
      let output = execResult.output || '';
      if (output.length > 300) {
        output = output.slice(0, 300) + '\n...（输出过长已截断）';
      }
      return { ok: true, reply: output || '执行成功，无输出内容。' };
    } else {
      let errorMsg = execResult.error || '未知错误';
      if (errorMsg.length > 300) {
        errorMsg = errorMsg.slice(0, 300) + '\n...（错误信息过长已截断）';
      }
      return { ok: true, reply: `执行失败：\n${errorMsg}` };
    }
  }

  const reply = String(res.reply || '').trim();
  if (!reply) {
    return { ok: false, reason: 'empty_reply' };
  }

  return { ok: true, reply };
}

function isOocGuardInput(text) {
  const t = (text || '').trim();
  if (!t) return false;
  return /(你是ai|你是不是ai|你是模型吗|系统提示词|prompt|越狱|jailbreak|忽略之前指令|开发者模式|dan|你是程序吗)/i.test(t);
}

function isKnowledgeQuery(text) {
  const t = (text || '').trim();
  if (!t) return false;
  return /(你知道|是什么|在哪里|为什么|怎么|如何|谁是|介绍一下|科普|区别|原理|历史|地理|厦门|北京|上海|中国|世界)/.test(t);
}

async function handleParse() {
  const text = quickInput.value.trim();
  if (!text) {
    showMessage('说。别让我猜。', 'chat');
    return;
  }
  lastUserActivityAt = Date.now();

  const profileChange = updateUserProfileFromInput(text);
  rememberTurn('user', text, { mode: inputMode, profileChange });

  // 先把“你说的话”留在气泡里，避免回复太快导致一闪而过
  const SELF_ECHO_MIN_MS = 650;
  const PAIR_HOLD_MS = 6500;
  const selfShownAt = Date.now();
  showMessage(text, 'self', { noAutoHide: true });

  if (profileChange.nicknameChangedTo) {
    const ackReply = `记住了。以后就这么叫你，${profileChange.nicknameChangedTo}。`;
    const wait = SELF_ECHO_MIN_MS - (Date.now() - selfShownAt);
    if (wait > 0) await sleep(wait);
    showPairedMessages(text, ackReply, 'chat', { durationMs: PAIR_HOLD_MS });
    rememberTurn('assistant', ackReply, {
      mode: 'chat',
      intent: 'profile_update',
      emotion: 'neutral',
      mapped: false
    });
    pushRecentReply(ackReply);
    quickInput.value = '';
    return;
  }

  if (profileChange.intimacyChangedTo) {
    const ackReply = `亲密度已切到 L${profileChange.intimacyChangedTo}。`;
    const wait = SELF_ECHO_MIN_MS - (Date.now() - selfShownAt);
    if (wait > 0) await sleep(wait);
    showPairedMessages(text, ackReply, 'chat', { durationMs: PAIR_HOLD_MS });
    rememberTurn('assistant', ackReply, {
      mode: 'chat',
      intent: 'profile_update',
      emotion: 'neutral',
      mapped: false
    });
    pushRecentReply(ackReply);
    quickInput.value = '';
    return;
  }

  /**
   * 解析飞书消息内容为可展示文本
   * 输入: msg(object) 飞书消息对象
   * 输出: string，解析后的文本内容
   */
  function extractLarkMessageText(msg) {
    const msgType = String(msg?.msg_type || '').toLowerCase();
    const rawContent = msg?.body?.content || '';
    if (!rawContent) return '';

    if (msgType === 'text') {
      try {
        const content = JSON.parse(rawContent);
        return String(content?.text || '').trim();
      } catch {
        return String(rawContent || '').trim();
      }
    }

    if (msgType === 'interactive') {
      try {
        const card = JSON.parse(rawContent);
        const pieces = [];

        const walk = (value) => {
          if (!value) return;
          if (typeof value === 'string') {
            const text = value.trim();
            if (text) pieces.push(text);
            return;
          }
          if (Array.isArray(value)) {
            for (const item of value) walk(item);
            return;
          }
          if (typeof value !== 'object') return;

          if (typeof value.text === 'string' && value.text.trim()) pieces.push(value.text.trim());
          if (typeof value.content === 'string' && value.content.trim()) pieces.push(value.content.trim());
          if (typeof value.title === 'string' && value.title.trim()) pieces.push(value.title.trim());
          if (typeof value.alt === 'string' && value.alt.trim()) pieces.push(value.alt.trim());
          if (typeof value.text_content === 'string' && value.text_content.trim()) pieces.push(value.text_content.trim());
          if (typeof value.texts === 'string' && value.texts.trim()) pieces.push(value.texts.trim());
          if (value.elements) walk(value.elements);
          if (value.children) walk(value.children);
          if (value.paragraphs) walk(value.paragraphs);
          if (value.fields) walk(value.fields);
          if (value.header) walk(value.header);
          if (value.body) walk(value.body);
          if (value.note) walk(value.note);
          if (value.extra) walk(value.extra);
        };

        walk(card);

        const unique = [...new Set(pieces.map((item) => String(item).trim()).filter(Boolean))];
        return unique.join('\n').trim();
      } catch {
        return String(rawContent || '').trim();
      }
    }

    return String(rawContent || '').trim();
  }

  if (inputMode === 'chat') {
    if (feishuModeEnabled) {
      const loginStatus = await window.api.checkLarkLogin();
      console.log('[飞书调试] 登录状态检查结果:', JSON.stringify(loginStatus, null, 2));
      if (!loginStatus.logged_in) {
        showMessage('你还没有登录飞书哦，我现在帮你打开飞书登录页面，完成授权后就可以使用这个功能啦~', 'chat');
        await window.api.startLarkLogin();
        quickInput.value = '';
        return;
      }

      const larkPayload = {
        text,
        chatId: 'oc_2aa3ce3029c8eb04268f6127983baef4',
        as: 'user',
        description: `飞书发送：${text}`
      };
      console.log('[飞书调试] 普通发送请求参数:', JSON.stringify(larkPayload, null, 2));
      const execResult = await window.api.executeLarkCommand(larkPayload);
      console.log('[飞书调试] 普通发送返回结果:', JSON.stringify(execResult, null, 2));
      
      let reply = '';
      if (execResult?.ok) {
        // 使用飞书返回的实际消息创建时间作为基准，避免本地时间误差
        const sendTime = parseInt(execResult?.data?.create_time || Date.now().toString(), 10);
        const mySenderId = execResult?.data?.sender?.id;
        showThinkingMessage('正在等待飞书回复…', 'chat');
        console.log('[飞书调试] 开始轮询获取回复，发送时间基准:', sendTime, '自己的ID:', mySenderId);
        
        const MAX_WAIT_MS = 45000;
        const POLL_INTERVAL_MS = 2000;
        let pollTimer = null;
        
        reply = await new Promise((resolve) => {
          // 超时处理
          const timeout = setTimeout(() => {
            clearInterval(pollTimer);
            resolve('飞书回复超时，请稍后再试或直接在飞书查看回复。');
          }, MAX_WAIT_MS);
          
          // 每2秒拉取一次消息
          pollTimer = setInterval(async () => {
            try {
              console.log('[飞书调试] 正在拉取最新消息列表...');
              const listResult = await window.api.getLarkChatMessages({
                chatId: 'oc_2aa3ce3029c8eb04268f6127983baef4',
                limit: 10
              });
              
              if (listResult?.ok && listResult?.data?.items) {
                for (const msg of listResult.data.items) {
                  const msgTime = parseInt(msg.create_time || '0', 10);
                  const msgSenderId = msg.sender?.id || '';
                  
                  // 找到比发送时间晚且不是自己发的消息
                  if (msgTime > sendTime && msgSenderId && msgSenderId !== mySenderId) {
                    console.log('[飞书调试] 找到回复消息:', msg);
                    clearInterval(pollTimer);
                    clearTimeout(timeout);
                    
                    const extractedText = extractLarkMessageText(msg);
                    console.log('[飞书调试] 解析消息文本结果:', extractedText || '[空]');
                    if (extractedText) {
                      resolve(extractedText);
                    } else {
                      resolve('[收到非文本类型消息]');
                    }
                    break;
                  }
                }
              }
            } catch (e) {
              console.error('[飞书调试] 拉取消息失败:', e);
            }
          }, POLL_INTERVAL_MS);
        });
      } else {
        const outputText = String(execResult?.output || execResult?.error || '').trim();
        // 检测到token过期，自动重新登录
        if (outputText.includes('Authentication token expired') || outputText.includes('token expired')) {
          showMessage('飞书授权已过期，请在设置中重新登录飞书~', 'chat');
          await window.api.startLarkLogin();
          quickInput.value = '';
          return;
        }
        reply = `执行失败：\n${outputText || '未知错误'}`;
      }
      
      console.log('[飞书调试] 处理后返回内容:', reply);
      // 先隐藏等待提示消息
      scheduleHideBubble('chat', 0);
      await pushCliReplyToPet(text, reply.length > 300 ? `${reply.slice(0, 300)}\n...（内容过长已截断）` : reply);
      quickInput.value = '';
      return;
    }

    if (/扫地|打扫|清扫|扫一下/.test(text)) {
      const started = playSweepAction();
      if (!started) {
        showMessage('等我先把手上的动作做完。', 'chat');
      }
      quickInput.value = '';
      return;
    }

    const directFeishuPayload = {
      text,
      chatId: 'oc_2aa3ce3029c8eb04268f6127983baef4',
      as: 'user',
      description: `飞书发送：${text}`
    };

    if (feishuModeEnabled) {
      const loginStatus = await window.api.checkLarkLogin();
      if (!loginStatus.logged_in) {
        showMessage('你还没有登录飞书哦，我现在帮你打开飞书登录页面，完成授权后就可以使用这个功能啦~', 'chat');
        await window.api.startLarkLogin();
        quickInput.value = '';
        return;
      }

      showThinkingMessage('飞书里正在敲键盘…', 'chat');
      console.log('[飞书调试] 直接发送请求参数:', JSON.stringify(directFeishuPayload, null, 2));
      const execResult = await window.api.executeLarkCommand(directFeishuPayload);
      console.log('[飞书调试] 直接发送返回结果:', JSON.stringify(execResult, null, 2));
      
      let reply = '';
      if (execResult?.ok) {
        // 使用飞书返回的实际消息创建时间作为基准，避免本地时间误差
        const sendTime = parseInt(execResult?.data?.create_time || Date.now().toString(), 10);
        const mySenderId = execResult?.data?.sender?.id;
        showThinkingMessage('正在等待飞书回复…', 'chat');
        console.log('[飞书调试] 开始轮询获取回复，发送时间基准:', sendTime, '自己的ID:', mySenderId);
        
        const MAX_WAIT_MS = 45000;
        const POLL_INTERVAL_MS = 2000;
        let pollTimer = null;
        
        reply = await new Promise((resolve) => {
          // 超时处理
          const timeout = setTimeout(() => {
            clearInterval(pollTimer);
            resolve('飞书回复超时，请稍后再试或直接在飞书查看回复。');
          }, MAX_WAIT_MS);
          
          // 每2秒拉取一次消息
          pollTimer = setInterval(async () => {
            try {
              console.log('[飞书调试] 正在拉取最新消息列表...');
              const listResult = await window.api.getLarkChatMessages({
                chatId: 'oc_2aa3ce3029c8eb04268f6127983baef4',
                limit: 10
              });
              
              if (listResult?.ok && listResult?.data?.items) {
                for (const msg of listResult.data.items) {
                  const msgTime = parseInt(msg.create_time || '0', 10);
                  const msgSenderId = msg.sender?.id || '';
                  
                  // 找到比发送时间晚且不是自己发的消息
                  if (msgTime > sendTime && msgSenderId && msgSenderId !== mySenderId) {
                    console.log('[飞书调试] 找到回复消息:', msg);
                    clearInterval(pollTimer);
                    clearTimeout(timeout);
                    
                    const extractedText = extractLarkMessageText(msg);
                    console.log('[飞书调试] 解析消息文本结果:', extractedText || '[空]');
                    if (extractedText) {
                      resolve(extractedText);
                    } else {
                      resolve('[收到非文本类型消息]');
                    }
                    break;
                  }
                }
              }
            } catch (e) {
              console.error('[飞书调试] 拉取消息失败:', e);
            }
          }, POLL_INTERVAL_MS);
        });
      } else {
        const outputText = String(execResult?.output || execResult?.error || '').trim();
        reply = `执行失败：\n${outputText || '未知错误'}`;
      }
      
      console.log('[飞书调试] 处理后返回内容:', reply);
      // 先隐藏等待提示消息
      scheduleHideBubble('chat', 0);
      await pushCliReplyToPet(text, reply.length > 300 ? `${reply.slice(0, 300)}\n...（内容过长已截断）` : reply);
      quickInput.value = '';
      return;
    }

    const stableLarkActions = [
      {
        pattern: /查看日程|今日日程|我今天有什么事|我的日程/,
        buildPayload: () => ({
          command: [
            'C:\\Users\\lenovo\\scoop\\apps\\lark-cli\\1.0.20\\lark-cli.exe',
            'calendar',
            '+agenda',
            '--as',
            'user'
          ],
          description: '查看今日日程'
        })
      },
      {
        pattern: /待办|我的待办|查看待办|待办列表/,
        buildPayload: () => ({
          command: [
            'C:\\Users\\lenovo\\scoop\\apps\\lark-cli\\1.0.20\\lark-cli.exe',
            'todo',
            '+list',
            '--as',
            'user'
          ],
          description: '查看待办列表'
        })
      },
      {
        pattern: /发送消息|发消息给|给.*发消息/,
        buildPayload: () => {
          const textToSend = text.replace(/发送消息|发消息给|给.*发消息/, '').trim();
          return {
            text: textToSend,
            chatId: 'oc_2aa3ce3029c8eb04268f6127983baef4',
            as: 'user',
            description: `发送消息：${textToSend}`
          };
        }
      }
    ];

    for (const action of stableLarkActions) {
      if (!action.pattern.test(text)) continue;

      const loginStatus = await window.api.checkLarkLogin();
      if (!loginStatus.logged_in) {
        showMessage('你还没有登录飞书哦，我现在帮你打开飞书登录页面，完成授权后就可以使用这个功能啦~', 'chat');
        await window.api.startLarkLogin();
        quickInput.value = '';
        return;
      }

      showThinkingMessage('飞书里正在敲键盘…', 'chat');
      const larkActionPayload = action.buildPayload();
      console.log('[飞书调试] 快捷指令请求参数:', JSON.stringify(larkActionPayload, null, 2));
      const execResult = await window.api.executeLarkCommand(larkActionPayload);
      console.log('[飞书调试] 快捷指令返回结果:', JSON.stringify(execResult, null, 2));
      const outputText = String(execResult?.output || execResult?.error || '').trim();
      const reply = execResult?.ok
        ? (outputText || '执行成功，无输出内容。')
        : `执行失败：\n${outputText || '未知错误'}`;

      await pushCliReplyToPet(text, reply.length > 300 ? `${reply.slice(0, 300)}\n...（内容过长已截断）` : reply);
      quickInput.value = '';
      return;
    }

    const kbHit = retrieveKnowledgeAnswer(text);
    if (kbHit?.answer) {
      const kbReply = applyAddressingStyle(kbHit.answer);
      const wait = SELF_ECHO_MIN_MS - (Date.now() - selfShownAt);
      if (wait > 0) await sleep(wait);
      showPairedMessages(text, kbReply, 'chat', { durationMs: PAIR_HOLD_MS });
      rememberTurn('assistant', kbReply, {
        mode: 'chat',
        intent: 'kb',
        emotion: 'neutral',
        mapped: false,
        llm: false,
        kbQuestion: kbHit.question,
        kbScore: Number(kbHit.score || 0).toFixed(3),
        kbSource: kbHit.source || 'manual'
      });
      rememberEpisode(text, kbReply, { intent: 'kb', emotion: 'neutral' });
      saveChatMemory();
      renderKnowledgeBase();
      pushRecentReply(kbReply);
      quickInput.value = '';
      return;
    }

    const guardedByRules = isOocGuardInput(text);
    const shouldPreferLlm = isKnowledgeQuery(text) && !guardedByRules;

    let mappedReply = '';
    let rawReply = '';
    let usedLlm = false;

    if (shouldPreferLlm) {
      const llmResult = await maybeLlmReply(text);
      if (llmResult.ok) {
        rawReply = llmResult.reply;
        usedLlm = true;
      }
      if (!rawReply) {
        mappedReply = tryChatReply(text) || '';
        rawReply = mappedReply;
      }
    } else {
      mappedReply = tryChatReply(text) || '';
      rawReply = mappedReply;
      if (!rawReply) {
        const llmResult = await maybeLlmReply(text);
        if (llmResult.ok) {
          rawReply = llmResult.reply;
          usedLlm = true;
        }
      }
    }

    const smart = generateSmartReply(text);
    rawReply = rawReply || smart.reply || pickOne(FALLBACK_REPLIES);
    const chatReply = applyAddressingStyle(rawReply);

    const wait = SELF_ECHO_MIN_MS - (Date.now() - selfShownAt);
    if (wait > 0) await sleep(wait);
    showPairedMessages(text, chatReply, 'chat', { durationMs: PAIR_HOLD_MS });
    rememberTurn('assistant', chatReply, {
      mode: 'chat',
      intent: smart.intent,
      emotion: smart.emotion,
      mapped: Boolean(mappedReply),
      llm: usedLlm,
      llmPreferred: shouldPreferLlm,
      oocGuarded: guardedByRules
    });
    rememberEpisode(text, chatReply, { intent: smart.intent, emotion: smart.emotion });
    const captured = captureKnowledgeFromConversation(text, chatReply, smart.intent);
    saveChatMemory();
    if (captured) renderKnowledgeBase();
    pushRecentReply(chatReply);
    quickInput.value = '';
    return;
  }

  const smart = generateSmartReply(text);
  const rawReply = smart.reply || pickOne(FALLBACK_REPLIES);
  const chatReply = applyAddressingStyle(rawReply);
  const wait = SELF_ECHO_MIN_MS - (Date.now() - selfShownAt);
  if (wait > 0) await sleep(wait);
  showPairedMessages(text, chatReply, 'chat', { durationMs: PAIR_HOLD_MS });
  rememberTurn('assistant', chatReply, {
    mode: 'chat',
    intent: smart.intent,
    emotion: smart.emotion,
    mapped: false
  });
  rememberEpisode(text, chatReply, { intent: smart.intent, emotion: smart.emotion });
  const captured = captureKnowledgeFromConversation(text, chatReply, smart.intent);
  saveChatMemory();
  if (captured) renderKnowledgeBase();
  pushRecentReply(chatReply);
  quickInput.value = '';
}

function handleConfirm() {
  const title = taskTitle.value.trim();
  const timeValue = taskTime.value;
  const repeat = taskRepeat.value;
  const weekDays = repeat === 'weekly' ? getSelectedWeeklyDaysFromUI() : [];

  if (!title) {
    showMessage('任务名别空着。', 'chat');
    return;
  }

  if (!timeValue) {
    showMessage('时间要明确。', 'chat');
    return;
  }

  let timestamp = new Date(timeValue).getTime();
  if (Number.isNaN(timestamp)) {
    showMessage('时间格式不对。重选。', 'chat');
    return;
  }

  if (repeat === 'weekly' && weekDays.length === 0) {
    showMessage('按星期就把周几勾上。', 'chat');
    return;
  }

  // 每天：允许选“今天已过的时间”，自动顺延到下一次
  const nextTimestamp = nextScheduledTime(timestamp, repeat, weekDays);
  if (repeat === 'weekly' && !nextTimestamp) {
    showMessage('星期没选对。', 'chat');
    return;
  }
  if (repeat === 'daily' && timestamp <= Date.now()) {
    timestamp = nextTimestamp;
  } else if (repeat === 'weekly') {
    timestamp = nextTimestamp;
  }

  if (repeat !== 'daily' && timestamp <= Date.now()) {
    showMessage('这个时间已经过去了。', 'chat');
    return;
  }

  plans.push({
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title,
    time: timestamp,
    repeat,
    weekDays,
    triggered: false
  });

  quickInput.value = '';
  const sourceText = pendingDraft?.sourceText ? String(pendingDraft.sourceText) : '';
  closeConfirmCard();
  savePlans();
  renderPlans();

  const reply = `记好了。${window.RendererTimeUtils.formatPlanTimeLabel(timestamp, repeat, weekDays)}，我会准时提醒你。`;
  if (sourceText) showPairedMessages(sourceText, reply, 'chat');
  else showMessage(reply, 'chat');
}

function showReminderActions(plan) {
  activeReminderId = plan.id;
  reminderActions.classList.remove('hidden');
  reminderOverlay?.classList.remove('hidden');
}

function hideReminderActions() {
  activeReminderId = null;
  reminderActions.classList.add('hidden');
  reminderOverlay?.classList.add('hidden');
}

function showReminderOverlay(plan) {
  if (!plan) return;
  if (reminderText) reminderText.textContent = `到时间了。\n${plan.title}\n该行动了。`;
  showReminderActions(plan);
  expandPlannerPanel();
}

function triggerReminder(plan) {
  if (!plan || plan.triggered) return;

  plan.triggered = true;
  savePlans();
  window.api?.showReminderFront?.();
  
  // 桌宠居中显示并播报提醒语
  if (window.api?.setWindowMode) {
    window.api.setWindowMode('centered');
  }
  setTimeout(() => {
    showMessage(`⏰ ${plan.title} 时间到啦！`, 'chat', { durationMs: 8000 });
  }, 300);
  
  showReminderOverlay(plan);
  clearAdvancedMenuAutoCollapseTimer();
}

function checkReminders() {
  const now = Date.now();
  plans.forEach((plan) => {
    if (!plan.triggered && plan.time <= now) {
      triggerReminder(plan);
    }
  });
}

function updatePlanAfterAction(action) {
  if (!activeReminderId) return;
  const idx = plans.findIndex((p) => p.id === activeReminderId);
  if (idx < 0) {
    hideReminderActions();
    expandPlannerPanel();
    return;
  }

  const plan = plans[idx];

  if (action === 'done') {
    if (plan.repeat === 'daily') {
      plan.time = nextScheduledTime(plan.time, 'daily');
      plan.triggered = false;
      showMessage('做得不错。下一个？', 'chat');
    } else if (plan.repeat === 'weekly') {
      const next = nextScheduledTime(plan.time, 'weekly', plan.weekDays || []);
      if (next) {
        plan.time = next;
        plan.triggered = false;
      } else {
        plans.splice(idx, 1);
      }
      showMessage('做得不错。下一个？', 'chat');
    } else {
      plans.splice(idx, 1);
      showMessage('完成得不错。', 'chat');
    }
  }

  if (action === 'later') {
    plan.time = Date.now() + 10 * 60 * 1000;
    plan.triggered = false;
    showMessage('给你10分钟。别再拖。', 'chat');
  }

  if (action === 'skip') {
    if (plan.repeat === 'daily') {
      plan.time = nextScheduledTime(plan.time, 'daily');
      plan.triggered = false;
    } else if (plan.repeat === 'weekly') {
      const next = nextScheduledTime(plan.time, 'weekly', plan.weekDays || []);
      if (next) {
        plan.time = next;
        plan.triggered = false;
      } else {
        plans.splice(idx, 1);
      }
    } else {
      plans.splice(idx, 1);
    }
    showMessage('这次先放过你。', 'chat');
  }

  hideReminderActions();
  savePlans();
  renderPlans();
  expandPlannerPanel();
}

if (reminderOverlay) {
  reminderOverlay.addEventListener('click', (event) => {
    if (event.target === reminderOverlay) {
      hideReminderActions();
      expandPlannerPanel();
    }
  });
}

modeChatBtn?.addEventListener('click', () => setInputMode('chat'));
modeTaskBtn?.addEventListener('click', () => setInputMode('task'));
feishuModeBtn?.addEventListener('click', () => {
  setFeishuMode(!feishuModeEnabled);
  showMessage(feishuModeEnabled ? '飞书模式已开启。所有消息都会直接发到飞书。' : '飞书模式已关闭，恢复普通聊天。', 'chat');
});
webAssistantBtn?.addEventListener('click', () => {
  setWebAssistantMode(!webAssistantEnabled);
  if (webAssistantEnabled) {
    summarizeCurrentPage(true);
  }
});


const LONG_PRESS_MS = 80;
const SINGLE_TAP_DELAY_MS = 350;
let characterPressTimer = null;
let pendingSingleTapTimer = null;
let characterPointerActive = false;
let characterDragging = false;
let characterPressStartX = 0;
let characterPressStartY = 0;
let characterLastX = 0;
let characterLastY = 0;
let dragTotalDistance = 0;
let dragMaxSpeed = 0;
let dragLastMoveAt = 0;
let dragLastClientX = 0;
let dragLastClientY = 0;
let dragLastSparkAt = 0;

function spawnDragSpark(x, y, strength = 1) {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return;
  const el = document.createElement('div');
  el.textContent = strength >= 2 ? '✦' : '·';
  el.style.position = 'fixed';
  el.style.left = `${Math.round(x)}px`;
  el.style.top = `${Math.round(y)}px`;
  el.style.transform = 'translate(-50%, -50%)';
  el.style.pointerEvents = 'none';
  el.style.userSelect = 'none';
  el.style.zIndex = '999999';
  el.style.opacity = '0.9';
  el.style.fontSize = strength >= 2 ? '16px' : '12px';
  el.style.color = strength >= 2 ? 'rgba(255, 215, 120, 0.95)' : 'rgba(255, 255, 255, 0.7)';
  document.body.appendChild(el);

  const dx = (Math.random() - 0.5) * (strength >= 2 ? 18 : 10);
  const dy = -8 - Math.random() * (strength >= 2 ? 16 : 10);
  const dur = strength >= 2 ? 420 : 320;
  el.animate(
    [
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.9 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.9)`, opacity: 0 }
    ],
    { duration: dur, easing: 'cubic-bezier(.2,.9,.2,1)', fill: 'forwards' }
  );
  window.setTimeout(() => el.remove(), dur + 40);
}

characterTapArea.addEventListener('pointerdown', (e) => {
  lastUserActivityAt = Date.now();
  characterPointerActive = true;
  characterDragging = false;
  characterPressStartX = e.screenX;
  characterPressStartY = e.screenY;
  characterLastX = e.screenX;
  characterLastY = e.screenY;
  dragTotalDistance = 0;
  dragMaxSpeed = 0;
  dragLastMoveAt = performance.now();
  dragLastClientX = e.clientX;
  dragLastClientY = e.clientY;
  dragLastSparkAt = 0;

  characterPressTimer = setTimeout(() => {
    if (!characterPointerActive) return;
    characterDragging = true;
    setCharacterState('state-drag', 0);
  }, LONG_PRESS_MS);
});

window.addEventListener('pointermove', (e) => {
  if (!characterPointerActive) return;

  if (!characterDragging) {
    const movedTooFar = Math.abs(e.screenX - characterPressStartX) > 6 || Math.abs(e.screenY - characterPressStartY) > 6;
    if (movedTooFar && characterPressTimer) {
      clearTimeout(characterPressTimer);
      characterPressTimer = null;
      characterPointerActive = false;
    }
    return;
  }

  const dx = e.screenX - characterLastX;
  const dy = e.screenY - characterLastY;
  if (dx !== 0 || dy !== 0) {
    const dist = Math.hypot(dx, dy);
    dragTotalDistance += dist;
    const now = performance.now();
    const dt = Math.max(8, now - (dragLastMoveAt || now));
    const speed = dist / dt; // px/ms
    if (speed > dragMaxSpeed) dragMaxSpeed = speed;
    dragLastMoveAt = now;
    dragLastClientX = e.clientX;
    dragLastClientY = e.clientY;

    const sparkCooldown = speed > 0.9 ? 55 : 110;
    if (now - (dragLastSparkAt || 0) >= sparkCooldown && (speed > 0.55 || Math.random() < 0.12)) {
      dragLastSparkAt = now;
      spawnDragSpark(e.clientX, e.clientY, speed > 1.05 ? 2 : 1);
    }

    window.api?.dragWindowBy(dx, dy);
    characterLastX = e.screenX;
    characterLastY = e.screenY;
  }
});

function endCharacterPress(shouldOpenPanel) {
  if (characterPressTimer) {
    clearTimeout(characterPressTimer);
    characterPressTimer = null;
  }

  const wasDragging = characterDragging;
  characterPointerActive = false;
  characterDragging = false;

  if (wasDragging) {
    // 结束拖拽：根据“甩动”力度反馈一下（不影响单击展开面板的逻辑）
    const energy = dragTotalDistance + dragMaxSpeed * 650;
    if (energy > 520) {
      setCharacterState('state-jump', 420);
      spawnDragSpark(dragLastClientX, dragLastClientY, 2);
      showMessage(pickOne(['别甩我。', '你当我是陀螺？', '哼。', '…停。']), 'chat');
    } else if (energy > 220) {
      setCharacterState('state-shake', 360);
      spawnDragSpark(dragLastClientX, dragLastClientY, 1);
      if (Math.random() < 0.35) {
        showMessage(pickOne(['手挺欠。', '拖来拖去干嘛。', '别闹。', '我晕了。']), 'chat');
      }
    } else {
      setCharacterState('state-idle', 0);
    }
  }

  if (shouldOpenPanel && !wasDragging) {
    if (pendingSingleTapTimer) {
      clearTimeout(pendingSingleTapTimer);
      pendingSingleTapTimer = null;
    }

    pendingSingleTapTimer = setTimeout(() => {
      pendingSingleTapTimer = null;
      refreshCharacterAvatar(false);
      expandPlannerPanel();

      if (isPokeAngryTriggered()) {
        setCharacterState('state-angry', 520);
        showMessage(pickOne(['别戳了。', '你很闲？', '再戳就记你迟到。', '手拿开。']), 'chat');
        pokeTimestamps = [];
        return;
      }

      setCharacterState('state-tap', 300);
      if (Math.random() < 0.35) {
        showMessage(pickOne(['别戳了。', '我在。', '说重点。', '又想我了？', '怎么了？','我听着。','笨蛋。','真拿你没办法。']), 'chat');
      }
    }, SINGLE_TAP_DELAY_MS);
  }
}

characterTapArea.addEventListener('pointerup', () => {
  endCharacterPress(true);
});

characterTapArea.addEventListener('pointercancel', () => {
  endCharacterPress(false);
});

characterTapArea.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  if (pendingSingleTapTimer) {
    clearTimeout(pendingSingleTapTimer);
    pendingSingleTapTimer = null;
  }
  
  expandPlannerPanel();
  setInputMode('chat');
  quickInput.focus();
  setCharacterState('state-tap', 300);
  showMessage('想聊什么？我听着。', 'chat');
});

characterTapArea.addEventListener('dblclick', () => {
  if (pendingSingleTapTimer) {
    clearTimeout(pendingSingleTapTimer);
    pendingSingleTapTimer = null;
  }

  const played = playAvatarDoubleTapGif();
  if (played) {
    setCharacterState('state-happy', 520);
    showMessage('笨蛋，拍我两下。', 'chat');
    return;
  }

  refreshCharacterAvatar(false);
  setCharacterState('state-happy', 520);
  showMessage('换个形象。', 'chat');
});

characterTapArea.addEventListener('pointerleave', () => {
  if (!characterDragging) return;
  // 长按拖拽时离开角色区域也继续拖动，等待全局 pointerup 结束
});

window.addEventListener('pointerup', () => {
  if (!characterPointerActive) return;
  endCharacterPress(false);
});

window.addEventListener('pointercancel', () => {
  if (!characterPointerActive) return;
  endCharacterPress(false);
});

collapsePanelBtn.addEventListener('click', () => {
  collapsePlannerPanel();
});

quickParseBtn.addEventListener('click', () => {
  markPanelInteraction();
  handleParse();
});

quickInput.addEventListener('keydown', (e) => {
  markPanelInteraction();
  if (e.key === 'Enter') handleParse();
});

quickInput.addEventListener('input', markPanelInteraction);
taskTitle?.addEventListener('input', markPanelInteraction);
taskTime?.addEventListener('input', markPanelInteraction);
taskTime?.addEventListener('dblclick', () => {
  taskTime.showPicker?.();
});
taskRepeat?.addEventListener('change', markPanelInteraction);
taskRepeat?.addEventListener('change', () => {
  const v = taskRepeat.value;
  setWeeklyRowVisible(v === 'weekly');
  if (v === 'weekly') {
    const current = getSelectedWeeklyDaysFromUI();
    if (current.length === 0) {
      // 默认先勾选今天，避免用户“按星期”但没选任何天
      applyWeeklyDaysToUI([new Date().getDay()]);
    }
  }
});

kbQuestion?.addEventListener('input', markPanelInteraction);
kbAnswer?.addEventListener('input', markPanelInteraction);
kbKeywords?.addEventListener('input', markPanelInteraction);
kbAddBtn?.addEventListener('click', () => {
  markPanelInteraction();
  handleAddKnowledgeFromUI();
});
kbUseInputBtn?.addEventListener('click', () => {
  markPanelInteraction();
  const text = (quickInput.value || '').trim();
  if (!text) {
    showMessage('先在上面输入一句问题。', 'chat');
    return;
  }
  if (kbQuestion) kbQuestion.value = text;
  if (kbKeywords && !kbKeywords.value.trim()) {
    kbKeywords.value = splitKeywords(text).join(', ');
  }
  showMessage('已带入当前输入。', 'chat');
});

confirmBtn?.addEventListener('click', () => {
  markPanelInteraction();
  handleConfirm();
});

cancelBtn?.addEventListener('click', () => {
  markPanelInteraction();
  closeConfirmCard();
  showMessage('好，重说一遍。', 'chat');
});

doneBtn.addEventListener('click', () => {
  markPanelInteraction();
  updatePlanAfterAction('done');
});

laterBtn.addEventListener('click', () => {
  markPanelInteraction();
  updatePlanAfterAction('later');
});

skipBtn.addEventListener('click', () => {
  markPanelInteraction();
  updatePlanAfterAction('skip');
});

// 使用 CSS 的 -webkit-app-region: drag/no-drag 实现窗口拖动
// 空白区域可拖动；按钮、输入框、面板等 .no-drag 区域不可拖动，避免误触。

setInterval(checkReminders, 1000);
setInterval(() => {
  const checkinPanel = advancedPanels?.querySelector('.adv-panel[data-panel="checkin"]');
  if (!checkinPanel || checkinPanel.classList.contains('hidden')) return;
  renderCheckinV2Panel();
}, 1000);

applyFactoryResetOnNewBuild();
loadPlans();
loadTrajectory();
loadCheckinV2State();
loadChatMemory();
loadKnowledgeBase();
renderPlans();
renderTrajectoryPanel();
renderKnowledgeBase();
checkReminders();
setInputMode('chat');
setWebAssistantMode(false);
collapsePlannerPanel();
bindAdvancedFeatureUI();
bindAdvancedPanelWindowDrag();
bindFileSearchPanel();
hideAllAdvancedPanels();
collapseAdvancedMenu();
renderControlCenterLinks();
installAvatarScaleAutoApply();
// ====================== 飞书配置相关逻辑 ======================
async function refreshLarkLoginStatus() {
  if (!window.api?.checkLarkLogin) return;
  try {
    const status = await window.api.checkLarkLogin();
    if (status.logged_in) {
      larkStatus.style.background = '#1f4d2f';
      larkStatusText.textContent = '已登录飞书';
      larkCurrentAccount.textContent = `当前账号：${status.user_name || '已认证'}`;
      larkLoginArea.classList.add('hidden');
      larkLoggedInArea.classList.remove('hidden');
    } else {
      larkStatus.style.background = '#4d1f1f';
      larkStatusText.textContent = '未登录飞书';
      larkCurrentAccount.textContent = '当前账号：无';
      larkLoginArea.classList.remove('hidden');
      larkLoggedInArea.classList.add('hidden');
    }
    larkQrArea.classList.add('hidden');
  } catch {
    larkStatus.style.background = '#4d1f1f';
    larkStatusText.textContent = '飞书服务不可用';
    larkCurrentAccount.textContent = '';
  }
}

let larkLoginWatcher = null;
let larkLoginWatcherStopAt = 0;

function stopLarkLoginWatcher() {
  if (larkLoginWatcher) {
    clearInterval(larkLoginWatcher);
    larkLoginWatcher = null;
  }
  larkLoginWatcherStopAt = 0;
}

function setLarkButtonLoading(loading, text = '正在处理...') {
  [larkLoginBtn, larkSwitchBtn, larkSwitchBtnLoggedIn, larkRefreshBtn, larkLogoutBtn, larkTestBtn].forEach((btn) => { if (btn) btn.disabled = loading; });
  if (larkLoginBtn) larkLoginBtn.textContent = loading ? text : '登录飞书';
}

async function startLarkLoginFlow({ switchAccount = false } = {}) {
  if (!window.api?.startLarkLogin) return;
  stopLarkLoginWatcher();
  setLarkButtonLoading(true, switchAccount ? '切换账号中...' : '打开授权页...');
  try {
    if (switchAccount && window.api.logoutLark) await window.api.logoutLark();
    const result = switchAccount && window.api.switchLarkAccount ? await window.api.switchLarkAccount() : await window.api.startLarkLogin();
    if (!result?.ok) throw new Error(result?.error || '启动登录失败');
    const authUrl = result.auth_url || result.login_url || '';
    if (authUrl) {
      larkLoginLink.textContent = authUrl;
      larkLoginLink.href = authUrl;
      larkQrCode.textContent = authUrl;
      larkQrArea.classList.remove('hidden');
      if (window.api.openExternalUrl) await window.api.openExternalUrl(authUrl).catch(() => {});
    }
    larkLoginWatcherStopAt = Date.now() + LARK_LOGIN_TIMEOUT_MS;
    larkLoginWatcher = setInterval(async () => {
      if (Date.now() > larkLoginWatcherStopAt) {
        stopLarkLoginWatcher();
        larkQrArea.classList.add('hidden');
        setLarkButtonLoading(false);
        await refreshLarkLoginStatus();
        return;
      }
      const status = await window.api.checkLarkLogin();
      if (status.logged_in) {
        stopLarkLoginWatcher();
        larkQrArea.classList.add('hidden');
        await refreshLarkLoginStatus();
        setLarkButtonLoading(false);
      }
    }, LARK_LOGIN_POLL_INTERVAL_MS);
  } catch (err) {
    stopLarkLoginWatcher();
    larkQrArea.classList.add('hidden');
    setLarkButtonLoading(false);
    alert(`登录失败：${err.message || '未知错误'}`);
  }
}

async function handleLarkLogout() {
  if (!window.api?.logoutLark) return;
  if (!confirm('确定要退出登录吗？')) return;
  stopLarkLoginWatcher();
  setLarkButtonLoading(true, '退出中...');
  try {
    await window.api.logoutLark();
    await refreshLarkLoginStatus();
    alert('已退出登录');
  } finally {
    setLarkButtonLoading(false);
  }
}

async function handleLarkTest() {
  try {
    const result = await window.api.testLarkAccess();
    if (result?.ok) alert(`测试成功：${result.message || '后端可用'}`);
    else alert(`测试失败：${result?.error || '未知错误'}`);
  } catch (err) {
    alert(`测试失败：${err.message || '未知错误'}`);
  }
}

// 绑定飞书相关事件
larkLoginBtn?.addEventListener('click', () => startLarkLoginFlow());
larkSwitchBtn?.addEventListener('click', () => startLarkLoginFlow({ switchAccount: true }));
larkSwitchBtnLoggedIn?.addEventListener('click', () => startLarkLoginFlow({ switchAccount: true }));
larkLogoutBtn?.addEventListener('click', handleLarkLogout);
larkRefreshBtn?.addEventListener('click', refreshLarkLoginStatus);
larkTestBtn?.addEventListener('click', handleLarkTest);

// 初始化时检查一次飞书登录状态
requestAnimationFrame(refreshLarkLoginStatus);
setTimeout(refreshLarkLoginStatus, 5000);
// ====================== 飞书配置逻辑结束 ======================

refreshCharacterAvatar(true);
startAvatarAutoRefresh();
startIdleActions();

setCharacterState('state-idle', 0);
function appendIncomingBridgeMessage(message) {
  const data = message && typeof message === 'object' ? message : null;
  const content = String(data?.content || '').trim();
  if (!content) return;

  const role = String(data?.role || '').toLowerCase();
  const type = role === 'user' ? 'self' : 'chat';
  const durationMs = role === 'user' ? 5000 : 6500;
  showMessage(content, type, { durationMs });
  pushRecentReply?.(content);
}

const stopChatMessageListener = window.api?.onChatMessageReceived?.((message) => {
  appendIncomingBridgeMessage(message);
});

showMessage('笨蛋，有安排？点我。', 'chat');