const { execFile } = require('child_process');

const cliPath = "C:\\Users\\lenovo\\scoop\\apps\\lark-cli\\1.0.20\\lark-cli.exe";
const args = [
  "--config", "C:\\Users\\lenovo\\.lark-cli\\config.json",
  "im", "+messages-send",
  "--as", "user",
  "--chat-id", "oc_2aa3ce3029c8eb04268f6127983baef4",
  "--text", "Node.js测试消息"
];

console.log("正在调用命令:", cliPath, args);

execFile(cliPath, args, (error, stdout, stderr) => {
  if (error) {
    console.error("❌ 执行失败:");
    console.error("Error:", error.message);
    console.error("Stderr:", stderr);
    return;
  }
  console.log("✅ 执行成功:");
  console.log("Stdout:", stdout);
});