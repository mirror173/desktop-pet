(function () {
  const FILE_TYPE_ICON_MAP = {
    desktop: '🖥️',
    folder: '📁',
    doc: '📄',
    img: '🖼️',
    audio: '🎵',
    video: '🎬',
    archive: '🗜️',
    app: '🧩',
    other: '📦'
  };

  function escapeHtml(raw = '') {
    return String(raw)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
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

  function groupFileResults(items = [], compareFn = compareFileItems) {
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
        list.sort(compareFn);
        return { type, title: getGroupTitle(type), items: list };
      });
  }

  function getEmptyStateTip(tip = '') {
    return escapeHtml(tip || '没有找到匹配文件');
  }

  function getItemIcon(item = {}) {
    const displayType = getDisplayType(item);
    return FILE_TYPE_ICON_MAP[displayType] || FILE_TYPE_ICON_MAP.other;
  }

  function getItemName(item = {}) {
    return escapeHtml(item.name || '(未知名称)');
  }

  function getItemParentPath(item = {}) {
    return escapeHtml(item.parentPath || '');
  }

  function getItemTime(item = {}, formatTimeFn) {
    return typeof formatTimeFn === 'function' ? formatTimeFn(item.mtimeMs) : '';
  }

  function getItemSize(item = {}, formatSizeFn) {
    return item.isDirectory ? '--' : (typeof formatSizeFn === 'function' ? formatSizeFn(item.size) : '');
  }

  function getItemPathToken(item = {}) {
    return encodeURIComponent(item.path || '');
  }

  function renderFileSearchItem(item = {}, deps = {}) {
    const icon = getItemIcon(item);
    const name = getItemName(item);
    const parentPath = getItemParentPath(item);
    const time = getItemTime(item, deps.formatLocalTime);
    const size = getItemSize(item, deps.formatFileSize);
    const encodedPath = getItemPathToken(item);

    return `
      <div class="file-item">
        <div class="icon">${icon}</div>
        <div class="name" title="${name}">${name}</div>
        <div class="path" title="${parentPath}">${parentPath}</div>
        <div class="time">${time}</div>
        <div class="size">${size}</div>
        <div class="actions">
          <button type="button" data-open-file="${encodedPath}">打开</button>
          <button type="button" data-open-folder="${encodedPath}">打开文件夹</button>
        </div>
      </div>
    `;
  }

  function renderFileSearchRows(items = [], deps = {}) {
    return items.map((item) => renderFileSearchItem(item, deps)).join('');
  }

  function getFileSearchGroupItems(group = {}, expandedGroups = new Set()) {
    const isExpanded = expandedGroups.has(group.type);
    return isExpanded ? (group.items || []) : (group.items || []).slice(0, 3);
  }

  function getFileSearchGroupToggleText(group = {}, expandedGroups = new Set()) {
    return expandedGroups.has(group.type) ? '收起' : '显示全部';
  }

  function buildFileSearchRequest(keyword, filterType = 'all', limit = 500) {
    return {
      keyword,
      filterType: filterType || 'all',
      limit: Number(limit) || 500
    };
  }

  function normalizeFileSearchSortField(nextValue) {
    return nextValue || 'mtime';
  }

  function normalizeFileSearchSortOrder(nextValue) {
    return nextValue === 'asc' ? 'asc' : 'desc';
  }

  function normalizeFileSearchFilterType(nextType) {
    return nextType || 'all';
  }

  function getFileSearchFilterChip(target) {
    if (!(target instanceof HTMLElement)) return null;
    const chip = target.closest('.filter');
    return chip instanceof HTMLElement ? chip : null;
  }

  function getFileSearchActionTarget(target, selector) {
    if (!(target instanceof HTMLElement)) return null;
    const matched = target.closest(selector);
    return matched instanceof HTMLElement ? matched : null;
  }

  function renderFileSearchGroupHeader(group = {}, expandedGroups = new Set()) {
    return `
      <header class="file-group-head">
        <div class="group-title">${group.title} (${(group.items || []).length})</div>
        ${(group.items || []).length > 3 ? `<button type="button" class="group-toggle" data-toggle-group="${group.type}">${getFileSearchGroupToggleText(group, expandedGroups)}</button>` : ''}
      </header>
    `;
  }

  function renderFileSearchGroup(group = {}, deps = {}) {
    const visibleItems = getFileSearchGroupItems(group, deps.expandedGroups);
    const rowsHtml = renderFileSearchRows(visibleItems, deps);

    return `
      <section class="file-group" data-group="${group.type}">
        ${renderFileSearchGroupHeader(group, deps.expandedGroups)}
        <div class="file-group-body">${rowsHtml}</div>
      </section>
    `;
  }

  function bindFileSearchPanel(deps = {}) {
    const {
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
      handleFileSearchResultAction,
      getFileSearchFilterChip: getFileSearchFilterChipOverride
    } = deps;

    const getFilterChip = getFileSearchFilterChipOverride || getFileSearchFilterChip;

    if (!searchInput || !filterBar || !resultList) return;

    const onSearchInput = () => {
      markPanelInteraction?.();
      resetFileSearchQuery?.();
    };

    const onSortFieldChange = () => {
      markPanelInteraction?.();
      setFileSearchSortField?.(sortFieldSelect?.value || 'mtime');
    };

    const onSortOrderChange = () => {
      markPanelInteraction?.();
      setFileSearchSortOrder?.(sortOrderSelect?.value === 'asc' ? 'asc' : 'desc');
    };

    const onFilterBarClick = (event) => {
      const chip = getFilterChip(event.target);
      if (!chip) return;
      markPanelInteraction?.();
      handleFileSearchFilterChange?.(chip.dataset.type || 'all');
      updateFileSearchFilterActiveState?.(chip);
    };

    const onResultListClick = (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      markPanelInteraction?.();
      handleFileSearchResultAction?.(target);
    };

    searchInput.addEventListener('input', onSearchInput);
    sortFieldSelect?.addEventListener('change', onSortFieldChange);
    sortOrderSelect?.addEventListener('change', onSortOrderChange);
    filterBar.addEventListener('click', onFilterBarClick);
    resultList.addEventListener('click', onResultListClick);
  }

  const api = {
    FILE_TYPE_ICON_MAP,
    escapeHtml,
    getDisplayType,
    getGroupTitle,
    compareFileItems,
    groupFileResults,
    getEmptyStateTip,
    getItemIcon,
    getItemName,
    getItemParentPath,
    getItemTime,
    getItemSize,
    getItemPathToken,
    renderFileSearchItem,
    renderFileSearchRows,
    getFileSearchGroupItems,
    getFileSearchGroupToggleText,
    buildFileSearchRequest,
    normalizeFileSearchSortField,
    normalizeFileSearchSortOrder,
    normalizeFileSearchFilterType,
    getFileSearchFilterChip,
    getFileSearchActionTarget,
    renderFileSearchGroupHeader,
    renderFileSearchGroup,
    bindFileSearchPanel
  };

  /** @type {any} */ (window).RendererFileSearchUtils = api;
  Object.assign(window, api);
})();