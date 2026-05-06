const { Tray, Menu, nativeImage } = require('electron');

/**
 * 创建托盘控制器
 * 输入: options(object)
 * - getTrayTooltip(function) 返回托盘提示文案
 * - getAssetPath(function) 返回资源文件路径
 * - showPetWindow(function) 显示桌宠窗口
 * - hidePetWindow(function) 隐藏桌宠窗口
 * - centerPetWindow(function) 居中显示桌宠窗口
 * - togglePetWindow(function) 切换桌宠窗口显示状态
 * - quitApp(function) 退出应用
 * - setTrayRef(function) 设置托盘引用
 * 输出: object，返回托盘创建与释放方法集合
 */
function createTrayController({
  getTrayTooltip,
  getAssetPath,
  showPetWindow,
  hidePetWindow,
  centerPetWindow,
  togglePetWindow,
  quitApp,
  setTrayRef
}) {
  /**
   * 构建托盘图标
   * 输入: 无
   * 输出: nativeImage，返回可用托盘图标
   */
  function buildTrayIcon() {
    const icoPath = getAssetPath('app.ico');
    const jpgPath = getAssetPath('形象1.jpg');

    let trayIcon = icoPath ? nativeImage.createFromPath(icoPath) : nativeImage.createEmpty();
    if (trayIcon.isEmpty() && jpgPath) {
      trayIcon = nativeImage.createFromPath(jpgPath).resize({ width: 16, height: 16 });
    }

    return trayIcon.isEmpty() ? nativeImage.createEmpty() : trayIcon;
  }

  /**
   * 创建托盘并绑定菜单
   * 输入: 无
   * 输出: Tray，返回托盘实例
   */
  function createTray() {
    const tray = new Tray(buildTrayIcon());
    setTrayRef?.(tray);
    tray.setToolTip(getTrayTooltip());

    const contextMenu = Menu.buildFromTemplate([
      { label: '显示桌宠', click: () => showPetWindow() },
      { label: '隐藏桌宠', click: () => hidePetWindow() },
      { label: '居中显示', click: () => centerPetWindow() },
      { type: 'separator' },
      { label: '退出', click: () => quitApp() }
    ]);

    tray.setContextMenu(contextMenu);
    tray.on('double-click', () => togglePetWindow());
    return tray;
  }

  /**
   * 销毁托盘引用
   * 输入: 无
   * 输出: void
   */
  function destroyTray() {
    const tray = setTrayRef?.(null);
    if (tray && !tray.isDestroyed()) tray.destroy();
  }

  return {
    createTray,
    destroyTray,
    buildTrayIcon
  };
}

module.exports = { createTrayController };
