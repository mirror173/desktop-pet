const { registerLarkAuthIpc } = require('./lark-auth.ipc');
const { registerLarkChatIpc } = require('./lark-chat.ipc');
const { registerLarkWorkIpc } = require('./lark-work.ipc');
const { registerLarkTodoIpc } = require('./lark-todo.ipc');

/**
 * 注册飞书业务 IPC 总入口
 * 输入: deps(object) 依赖注入对象
 * 输出: 无，统一注册飞书子模块
 */
function registerLarkIpc(deps) {
  registerLarkAuthIpc(deps);
  registerLarkChatIpc(deps);
  registerLarkWorkIpc(deps);
  registerLarkTodoIpc(deps);
}

module.exports = { registerLarkIpc };
