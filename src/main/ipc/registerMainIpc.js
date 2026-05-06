// eslint-disable-next-line @typescript-eslint/no-var-requires
const { registerPetIpc } = require('./pet.ipc');
const { registerLarkIpc } = require('./lark.ipc');
const { registerFileSearchIpc } = require('./file-search.ipc');
const { registerKnowledgeIpc } = require('./knowledge.ipc');

/**
 * 注册主进程 IPC 总入口
 * 输入: deps(object) 依赖注入对象
 * 输出: 无，统一注册各业务 IPC
 */
function registerMainIpc(deps) {
  registerPetIpc(deps);
  registerLarkIpc(deps);
  registerFileSearchIpc(deps);
  registerKnowledgeIpc(deps);
}

module.exports = { registerMainIpc };
