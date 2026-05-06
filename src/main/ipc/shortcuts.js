const { globalShortcut } = require('electron');

/**
 * 创建快捷键控制器
 * 输入: options(object)
 * - getShortcutKey(function) 返回快捷键配置
 * - showPetWindow(function) 显示桌宠窗口
 * 输出: object，返回快捷键注册与注销方法集合
 */
function createShortcutsController({ getShortcutKey, showPetWindow }) {
  /**
   * 注册桌宠快捷键
   * 输入: 无
   * 输出: boolean，注册成功返回 true，否则返回 false
   */
  function registerShortcuts() {
    const shortcut = getShortcutKey();
    const ok = globalShortcut.register(shortcut, () => {
      showPetWindow();
    });

    if (!ok) {
      console.warn(`[shortcut] 注册失败: ${shortcut} 可能被其他程序占用`);
    }

    return ok;
  }

  /**
   * 注销所有快捷键
   * 输入: 无
   * 输出: void
   */
  function unregisterShortcuts() {
    globalShortcut.unregisterAll();
  }

  return {
    registerShortcuts,
    unregisterShortcuts
  };
}

module.exports = { createShortcutsController };
