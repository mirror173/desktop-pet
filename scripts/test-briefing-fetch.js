const { execFile } = require('child_process');

const cliPath = 'C:\\Users\\lenovo\\scoop\\apps\\lark-cli\\1.0.20\\lark-cli.exe';
const APP_TOKEN = 'EEHNbkyiMajDMos5qimcGbkMnCh';
const TABLE_ID = 'tblqrjBB68Ayr9TV';

// 核心读取+格式化函数
async function getFormattedBriefing() {
  return new Promise((resolve) => {
    execFile(cliPath, [
      "base", "+record-list",
      "--base-token", APP_TOKEN,
      "--table-id", TABLE_ID
    ], (error, stdout) => {
      if (error) return resolve("❌ 读取表格失败，请检查权限");

      try {
        const result = JSON.parse(stdout);
        const rawRows = result.data?.data || [];
        const fieldNames = result.data?.fields || [];

        if (rawRows.length === 0) return resolve("ℹ️  表格中暂无到岗梳理数据");

        // 取最新的一条记录（表格最后一行）
        const latestRow = rawRows[rawRows.length - 1];
        const dataMap = {};
        fieldNames.forEach((name, index) => {
          dataMap[name] = latestRow[index] || "暂无";
        });

        // 按你要的顺序整理，每个字段单独一行
        const formattedContent = `
📅 每日到岗梳理
------------------------
日期：${dataMap['日期']}
今日重点工作：${dataMap['今日重点工作']}
昨日遗留待闭环事项：${dataMap['昨日遗留待闭环事项']}
需协调资源：${dataMap['需协调资源']}
当日日程：${dataMap['当日日程']}
高优消息：${dataMap['高优消息']}
晨会发言稿：${dataMap['晨会发言稿']}
        `.trim();

        resolve(formattedContent);
      } catch (e) {
        resolve(`❌ 解析数据失败：${e.message}`);
      }
    });
  });
}

// 直接运行时输出整理好的内容
if (require.main === module) {
  (async () => {
    const content = await getFormattedBriefing();
    console.log(content);
  })();
}

// 导出给桌宠调用
module.exports = { getFormattedBriefing };