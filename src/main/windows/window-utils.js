const { screen } = require('electron');

/**
 * 计算当前鼠标所在屏幕的居中位置
 * 输入: windowWidth(number), windowHeight(number)
 * 输出: object，返回 { x, y }
 */
function getCursorCenteredPosition(windowWidth, windowHeight) {
  const point = screen.getCursorScreenPoint();
  const display = screen.getDisplayNearestPoint(point);
  const { x, y, width, height } = display.workArea;

  return {
    x: Math.round(x + (width - windowWidth) / 2),
    y: Math.round(y + (height - windowHeight) / 2)
  };
}

module.exports = { getCursorCenteredPosition };
