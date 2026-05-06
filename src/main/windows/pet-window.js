const path = require('path');
const { BrowserWindow } = require('electron');
const { getCursorCenteredPosition } = require('./window-utils');

/**
 * 创建桌宠窗口控制器
 * 输入: options(object)
 * - app(object) Electron app 实例
 * - getWindowRef(function) 返回当前窗口引用
 * - setWindowRef(function) 设置当前窗口引用
 * - getIsQuitting(function) 返回是否正在退出
 * - getPetWindowSize(function) 返回桌宠窗口尺寸
 * - getPreloadPath(function) 返回 preload.js 路径
 * 输出: object，返回窗口创建与控制方法集合
 */
function createPetWindowController({
  app,
  getWindowRef,
  setWindowRef,
  getIsQuitting,
  getPetWindowSize,
  getPreloadPath
}) {
  /**
   * 创建桌宠浏览器窗口
   * 输入: 无
   * 输出: BrowserWindow，返回新创建的窗口实例
   */
  function createPetBrowserWindow() {
    const PET_WINDOW_SIZE = getPetWindowSize();

    return new BrowserWindow({
      width: PET_WINDOW_SIZE.width,
      height: PET_WINDOW_SIZE.height,
      minWidth: PET_WINDOW_SIZE.width,
      minHeight: PET_WINDOW_SIZE.height,
      maxWidth: PET_WINDOW_SIZE.width,
      maxHeight: PET_WINDOW_SIZE.height,
      transparent: true,
      frame: false,
      alwaysOnTop: true,
      resizable: false,
      hasShadow: false,
      skipTaskbar: false,
      show: false,
      webPreferences: {
        preload: getPreloadPath(),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true
      }
    });
  }

  /**
   * 应用窗口尺寸
   * 输入: targetSize(object), options(object)
   * 输出: void
   */
  function applyWindowSize(targetSize, { resizable = false, minWidth, minHeight } = {}) {
    const win = getWindowRef();
    if (!win || win.isDestroyed()) return;

    const PET_WINDOW_SIZE = getPetWindowSize();
    const width = Number(targetSize?.width) || PET_WINDOW_SIZE.width;
    const height = Number(targetSize?.height) || PET_WINDOW_SIZE.height;
    const safeMinWidth = Number(minWidth) || PET_WINDOW_SIZE.width;
    const safeMinHeight = Number(minHeight) || (resizable ? 420 : PET_WINDOW_SIZE.height);

    win.setResizable(Boolean(resizable));
    win.setMinimumSize(safeMinWidth, safeMinHeight);
    if (!resizable) {
      win.setMaximumSize(width, height);
    } else {
      win.setMaximumSize(0, 0);
    }
    win.setSize(width, height, true);
  }

  /**
   * 将当前窗口移动到鼠标所在屏幕中心
   * 输入: 无
   * 输出: void
   */
  function moveWindowToCenter() {
    const win = getWindowRef();
    if (!win || win.isDestroyed()) return;
    const [winWidth, winHeight] = win.getSize();
    const { x, y } = getCursorCenteredPosition(winWidth, winHeight);
    win.setPosition(x, y);
  }

  /**
   * 创建并初始化桌宠窗口
   * 输入: 无
   * 输出: BrowserWindow，返回创建完成的窗口实例
   */
  function createWindow() {
    const win = createPetBrowserWindow();
    setWindowRef(win);
    win.loadFile('index.html');

    win.once('ready-to-show', () => {
      const currentWin = getWindowRef();
      if (!currentWin || currentWin.isDestroyed()) return;
      moveWindowToCenter();
      currentWin.show();
      currentWin.focus();
    });

    win.on('close', (event) => {
      if (getIsQuitting()) return;
      event.preventDefault();
      win.hide();
    });

    return win;
  }

  /**
   * 将桌宠窗口居中并显示
   * 输入: 无
   * 输出: void
   */
  function centerPetWindow() {
    const win = getWindowRef();
    if (!win || win.isDestroyed()) return;
    moveWindowToCenter();
    win.show();
    win.focus();
  }

  /**
   * 调整窗口尺寸并显示
   * 输入: targetSize(object), options(object)
   * 输出: void
   */
  function resizeWindowTo(targetSize, options = {}) {
    const win = getWindowRef();
    if (!win || win.isDestroyed()) return;

    applyWindowSize(targetSize, options);
    if (options.center !== false) {
      moveWindowToCenter();
    }

    win.show();
    win.focus();
  }

  /**
   * 将提醒窗口置于前台
   * 输入: 无
   * 输出: void
   */
  function showReminderWindowInFront() {
    const win = getWindowRef();
    if (!win || win.isDestroyed()) return;

    moveWindowToCenter();
    win.setAlwaysOnTop(true, 'screen-saver');
    win.show();
    win.focus();
    win.moveTop();
  }

  /**
   * 显示桌宠窗口
   * 输入: 无
   * 输出: void
   */
  function showPetWindow() {
    const win = getWindowRef();
    if (!win || win.isDestroyed()) return;
    if (!win.isVisible()) win.show();
    win.focus();
  }

  /**
   * 隐藏桌宠窗口
   * 输入: 无
   * 输出: void
   */
  function hidePetWindow() {
    const win = getWindowRef();
    if (!win || win.isDestroyed()) return;
    win.hide();
  }

  /**
   * 切换桌宠窗口显示状态
   * 输入: 无
   * 输出: void
   */
  function togglePetWindow() {
    const win = getWindowRef();
    if (!win || win.isDestroyed()) return;
    if (win.isVisible()) hidePetWindow();
    else showPetWindow();
  }

  return {
    createWindow,
    centerPetWindow,
    resizeWindowTo,
    showReminderWindowInFront,
    showPetWindow,
    hidePetWindow,
    togglePetWindow,
    applyWindowSize,
    createPetBrowserWindow,
    moveWindowToCenter
  };
}

module.exports = { createPetWindowController };
