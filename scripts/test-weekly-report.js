const { execFile } = require('child_process');

// -------------------------- 配置项（替换成你的周报表格信息） --------------------------
const cliPath = 'C:\\Users\\lenovo\\scoop\\apps\\lark-cli\\1.0.20\\lark-cli.exe';
const APP_TOKEN = 'EEHNbkyiMajDMos5qimcGbkMnCh';
const TABLE_ID = 'tblhiFLMRGqL7vTO';
// -----------------------------------------------------------------------------------

// 核心读取+格式化函数
async function getFormattedWeeklyReport() {
  return new Promise((resolve) => {
    execFile(cliPath, [
      "base", "+record-list",
      "--base-token", APP_TOKEN,
      "--table-id", TABLE_ID
    ], (error, stdout, stderr) => {
      if (error) {
        console.error('❌ CLI调用失败:', stderr);
        return resolve("❌ 读取周报表格失败，请检查table_id、权限配置");
      }

      try {
        const result = JSON.parse(stdout);
        const rawRows = result.data?.data || [];
        const fieldNames = result.data?.fields || [];

        if (rawRows.length === 0) {
          return resolve("ℹ️  周报表格中暂无数据，请先在多维表格中填写内容");
        }

        const latestRow = rawRows[rawRows.length - 1];
        const dataMap = {};
        fieldNames.forEach((fieldName, index) => {
          dataMap[fieldName] = latestRow[index] || "暂无";
        });

        // 格式化函数：自动处理换行，让列表更美观
        const formatField = (content) => {
          if (!content || content === "暂无") return "暂无";
          // 如果内容里有换行符，自动缩进
          return content.split('\n').map((line, idx) => {
            if (idx === 0) return line;
            // 列表项自动缩进
            return line.trim() ? `  ${line.trim()}` : '';
          }).filter(Boolean).join('\n');
        };

        const formattedContent = `
📊 每周工作周报
------------------------
周数：${dataMap['周数']}
核心摘要：${formatField(dataMap['核心摘要'])}
重点成果：
${formatField(dataMap['重点成果'])}
下周规划：
${formatField(dataMap['下周规划'])}
        `.trim();

        resolve(formattedContent);
      } catch (e) {
        resolve(`❌ 解析周报数据失败：${e.message}`);
      }
    });
  });
}

if (require.main === module) {
  (async () => {
    const weeklyContent = await getFormattedWeeklyReport();
    console.log(weeklyContent);
  })();
}

module.exports = { getFormattedWeeklyReport };