(function () {
  function formatLocalTime(timeMs) {
    if (!Number.isFinite(timeMs) || timeMs <= 0) return '--';
    const d = new Date(timeMs);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function formatFileSize(size) {
    const n = Number(size || 0);
    if (!Number.isFinite(n) || n <= 0) return '--';
    if (n < 1024) return `${n} B`;
    if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
    if (n < 1024 ** 3) return `${(n / 1024 ** 2).toFixed(1)} MB`;
    return `${(n / 1024 ** 3).toFixed(2)} GB`;
  }

  function getDisplayType(item = {}) {
    if (item.isDesktopFile) return 'desktop';
    return item.type || 'other';
  }

  function getGroupTitle(type = '') {
    const map = {
      desktop: '桌面文件',
      doc: '文档',
      app: '应用程序',
      img: '图片',
      audio: '音频',
      video: '视频',
      archive: '压缩文件',
      folder: '文件夹',
      other: '其他'
    };
    return map[type] || '其他';
  }

  function compareFileItems(a = {}, b = {}, sortField = 'mtime', sortOrder = 'desc') {
    const dirBoostA = a.isDirectory ? 1 : 0;
    const dirBoostB = b.isDirectory ? 1 : 0;
    if (dirBoostA !== dirBoostB) return dirBoostB - dirBoostA;

    let result = 0;
    if (sortField === 'name') {
      result = String(a.name || '').localeCompare(String(b.name || ''), 'zh-CN');
    } else if (sortField === 'size') {
      result = Number(a.size || 0) - Number(b.size || 0);
    } else if (sortField === 'type') {
      result = String(getDisplayType(a)).localeCompare(String(getDisplayType(b)), 'zh-CN');
    } else {
      result = Number(a.mtimeMs || 0) - Number(b.mtimeMs || 0);
    }

    if (sortOrder === 'desc') result *= -1;
    if (result !== 0) return result;
    return String(a.name || '').localeCompare(String(b.name || ''), 'zh-CN');
  }

  function groupFileResults(items = []) {
    const groups = new Map();

    for (const item of items) {
      const type = getDisplayType(item);
      if (!groups.has(type)) groups.set(type, []);
      groups.get(type).push(item);
    }

    const order = ['desktop', 'doc', 'app', 'img', 'audio', 'video', 'archive', 'folder', 'other'];

    return order
      .filter((type) => groups.has(type) && groups.get(type).length)
      .map((type) => {
        const list = groups.get(type);
        list.sort((a, b) => compareFileItems(a, b));
        return { type, title: getGroupTitle(type), items: list };
      });
  }

  function splitKeywords(raw) {
    return String(raw || '')
      .split(/[，,、\s]+/)
      .map((x) => x.trim())
      .filter(Boolean)
      .slice(0, 12);
  }

  function formatTime(timestamp, withDate = true) {
    const d = new Date(timestamp);
    const yyyy = d.getFullYear();
    const mm = `${d.getMonth() + 1}`.padStart(2, '0');
    const dd = `${d.getDate()}`.padStart(2, '0');
    const hh = `${d.getHours()}`.padStart(2, '0');
    const min = `${d.getMinutes()}`.padStart(2, '0');
    return withDate ? `${yyyy}-${mm}-${dd} ${hh}:${min}` : `${hh}:${min}`;
  }

  function getDateKey(timestamp = Date.now()) {
    const d = new Date(timestamp);
    const yyyy = d.getFullYear();
    const mm = `${d.getMonth() + 1}`.padStart(2, '0');
    const dd = `${d.getDate()}`.padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function getWeekdayNameEn(timestamp = Date.now()) {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(timestamp).getDay()];
  }

  function formatTrajectoryDisplayDate(timestamp = Date.now()) {
    const d = new Date(timestamp);
    const yyyy = d.getFullYear();
    const mm = `${d.getMonth() + 1}`.padStart(2, '0');
    const dd = `${d.getDate()}`.padStart(2, '0');
    return `${yyyy}/${mm}/${dd} ${getWeekdayNameEn(timestamp)}`;
  }

  function toLocalDatetimeValue(timestamp) {
    const d = new Date(timestamp);
    const yyyy = d.getFullYear();
    const mm = `${d.getMonth() + 1}`.padStart(2, '0');
    const dd = `${d.getDate()}`.padStart(2, '0');
    const hh = `${d.getHours()}`.padStart(2, '0');
    const min = `${d.getMinutes()}`.padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }

  function weekdayShortLabel(d) {
    const map = ['日', '一', '二', '三', '四', '五', '六'];
    return map[Number(d)] ?? '';
  }

  function getRepeatLabel(repeat) {
    if (repeat === 'daily') return '每天';
    if (repeat === 'weekly') return '按星期';
    return '不重复';
  }

  function normalizeHour(hour, period) {
    let h = Number(hour);
    if (!Number.isFinite(h)) return NaN;
    if (period === 'afternoon' || period === 'evening') {
      if (h < 12) h += 12;
    }
    if (period === 'morning' && h === 12) h = 0;
    return h;
  }

  function formatWeeklyDays(days) {
    const arr = Array.isArray(days) ? [...new Set(days.map((x) => Number(x)).filter((x) => Number.isInteger(x) && x >= 0 && x <= 6))] : [];
    arr.sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7));
    if (arr.length === 0) return '未选';
    return arr.map((d) => weekdayShortLabel(d)).join('/');
  }

  function nextDailyTime(fromTime) {
    return fromTime + 24 * 60 * 60 * 1000;
  }

  function nextWeeklyTime(fromTimestamp, weekDays) {
    const days = Array.isArray(weekDays) ? [...new Set(weekDays.map((d) => Number(d)).filter((d) => Number.isInteger(d) && d >= 0 && d <= 6))] : [];
    if (days.length === 0) return null;

    const base = new Date(fromTimestamp);
    const hour = base.getHours();
    const minute = base.getMinutes();

    const now = new Date();
    const start = new Date(now);
    start.setSeconds(0, 0);
    start.setHours(hour, minute, 0, 0);

    for (let i = 0; i < 14; i += 1) {
      const cand = new Date(start);
      cand.setDate(start.getDate() + i);
      const dow = cand.getDay();
      if (!days.includes(dow)) continue;
      if (cand.getTime() <= now.getTime()) continue;
      return cand.getTime();
    }

    const fallback = new Date(start);
    fallback.setDate(start.getDate() + 7);
    return fallback.getTime();
  }

  function nextScheduledTime(fromTimestamp, repeat, weekDays) {
    if (repeat === 'daily') return nextDailyTime(fromTimestamp);
    if (repeat === 'weekly') return nextWeeklyTime(fromTimestamp, weekDays);
    return null;
  }

  function parseChineseNumberToken(token) {
    const raw = String(token || '').trim();
    if (!raw) return null;
    if (/^\d+$/.test(raw)) return Number(raw);

    const map = {
      零: 0,
      〇: 0,
      一: 1,
      二: 2,
      两: 2,
      三: 3,
      四: 4,
      五: 5,
      六: 6,
      七: 7,
      八: 8,
      九: 9
    };

    if (raw === '十') return 10;
    if (raw.includes('十')) {
      const parts = raw.split('十');
      const tensPart = parts[0];
      const onesPart = parts[1];
      const tens = tensPart ? map[tensPart] : 1;
      const ones = onesPart ? map[onesPart] : 0;
      if (!Number.isFinite(tens) || !Number.isFinite(ones)) return null;
      return tens * 10 + ones;
    }

    if (raw.length === 1 && Object.prototype.hasOwnProperty.call(map, raw)) return map[raw];
    return null;
  }

  function parseTimeFromText(rawText) {
    const raw = String(rawText || '').trim();
    if (!raw) return null;

    let period = null;
    if (raw.includes('下午')) period = 'afternoon';
    if (raw.includes('晚上')) period = 'evening';
    if (raw.includes('早上') || raw.includes('上午')) period = 'morning';
    if (raw.includes('中午')) period = 'afternoon';

    const match = raw.match(/(上午|早上|下午|晚上|中午)?\s*([0-9一二两三四五六七八九十零〇]{1,3})\s*(?:(?:[:：]\s*([0-9一二两三四五六七八九十零〇]{1,3})\s*分?)|(?:[点时]\s*([0-9一二两三四五六七八九十零〇]{1,3})?\s*分?))?\s*(半|一刻|三刻)?/);
    if (!match) return null;

    const hourToken = match[2];
    const minuteToken = match[3] || match[4];
    const special = match[5];

    let hour = parseChineseNumberToken(hourToken);
    if (!Number.isFinite(hour)) return null;

    let minute = 0;
    if (special === '半') minute = 30;
    else if (special === '一刻') minute = 15;
    else if (special === '三刻') minute = 45;
    else if (minuteToken) minute = parseChineseNumberToken(minuteToken);

    if (!Number.isFinite(minute)) minute = 0;
    if (hour > 23 || minute > 59) return null;
    hour = normalizeHour(hour, period);
    return { hour, minute };
  }

  function parseNaturalInput(text) {
    const raw = String(text || '').trim();
    if (!raw) return null;

    const draft = { title: raw, repeat: 'none', time: null, weekDays: [] };
    if (raw.includes('每天')) draft.repeat = 'daily';

    const weekMap = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 日: 0, 天: 0 };
    const weekHits = [...raw.matchAll(/周([一二三四五六日天])/g)]
      .map((m) => weekMap[m[1]])
      .filter((x) => Number.isInteger(x));
    if (raw.includes('每周') || weekHits.length > 0) {
      draft.repeat = 'weekly';
      draft.weekDays = [...new Set(weekHits)];
    }

    const parsed = parseTimeFromText(raw);
    if (parsed) {
      const { hour, minute } = parsed;
      const now = new Date();
      const t = new Date();
      t.setSeconds(0, 0);
      t.setHours(hour, minute, 0, 0);
      if (draft.repeat === 'none' && t.getTime() <= now.getTime()) t.setDate(t.getDate() + 1);
      draft.time = t.getTime();
      draft.title = raw
        .replace(/每天|每周|周[一二三四五六日天]/g, '')
        .replace(/(上午|早上|下午|晚上|中午)?\s*([0-9一二两三四五六七八九十零〇]{1,3})\s*(?:(?:[:：]\s*([0-9一二两三四五六七八九十零〇]{1,3})\s*分?)|(?:[点时]\s*([0-9一二两三四五六七八九十零〇]{1,3})?\s*分?))?\s*(半|一刻|三刻)?/g, '')
        .trim();
    }

    if (!draft.title) draft.title = '未命名事项';
    if (!draft.time) {
      const fallback = new Date();
      fallback.setMinutes(fallback.getMinutes() + 10, 0, 0);
      draft.time = fallback.getTime();
    }

    return draft;
  }

  function looksLikeTaskInput(text) {
    return /每天|明天|后天|早上|上午|中午|下午|晚上|\d{1,2}[:：点]/.test(String(text || '').trim());
  }

  function formatFileSize(size) {
    const n = Number(size || 0);
    if (!Number.isFinite(n) || n <= 0) return '--';
    if (n < 1024) return `${n} B`;
    if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
    if (n < 1024 ** 3) return `${(n / 1024 ** 2).toFixed(1)} MB`;
    return `${(n / 1024 ** 3).toFixed(2)} GB`;
  }

  function normalizeControlCenterUrl(url) {
    const raw = String(url || '').trim();
    if (!raw) return '';
    if (/^https?:\/\//i.test(raw)) return raw;
    return `https://${raw}`;
  }

  function formatCountdownLabel(targetDateStr) {
    const timestamp = parseCountdownDateTime(targetDateStr);
    if (!timestamp) return '--';

    const now = Date.now();
    const diffMs = timestamp - now;
    const diffMinutes = Math.ceil(diffMs / (60 * 1000));
    const absMinutes = Math.abs(diffMinutes);

    if (diffMinutes > 0) {
      if (absMinutes < 60) return `${absMinutes} 分钟`;
      const hours = Math.floor(absMinutes / 60);
      const minutes = absMinutes % 60;
      return minutes ? `${hours} 小时 ${minutes} 分钟` : `${hours} 小时`;
    }

    if (diffMinutes === 0) return '现在';

    if (absMinutes < 60) return `已过 ${absMinutes} 分钟`;
    const hours = Math.floor(absMinutes / 60);
    const minutes = absMinutes % 60;
    return minutes ? `已过 ${hours} 小时 ${minutes} 分钟` : `已过 ${hours} 小时`;
  }

  function formatPlanTimeLabel(timestamp, repeat, weekDays) {
    const base = formatTime(timestamp, !(repeat === 'daily' || repeat === 'weekly'));
    if (repeat === 'weekly') return `${base} · 每周${formatWeeklyDays(weekDays)}`;
    if (repeat === 'daily') return `${base} · 每天`;
    return base;
  }

  function parseCountdownDateTime(targetDateStr) {
    const text = String(targetDateStr || '').trim();
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(text)) return null;
    const timestamp = new Date(text).getTime();
    return Number.isNaN(timestamp) ? null : timestamp;
  }

  const api = {
    formatLocalTime,
    formatFileSize,
    getDisplayType,
    getGroupTitle,
    compareFileItems,
    groupFileResults,
    splitKeywords,
    formatTime,
    getDateKey,
    getWeekdayNameEn,
    formatTrajectoryDisplayDate,
    toLocalDatetimeValue,
    weekdayShortLabel,
    formatWeeklyDays,
    nextDailyTime,
    nextWeeklyTime,
    nextScheduledTime,
    parseChineseNumberToken,
    parseTimeFromText,
    parseNaturalInput,
    looksLikeTaskInput,
    getRepeatLabel,
    normalizeHour,
    normalizeControlCenterUrl,
    parseCountdownDateTime,
    formatCountdownLabel,
    formatPlanTimeLabel
  };

  window.RendererTimeUtils = api;
  Object.assign(window, api);
})();