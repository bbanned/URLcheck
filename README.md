# Web Security Check

一个用于检测网页安全性的在线工具，支持 RCS 和 iMessage 检测。

## 功能特点

- RCS 安全检测
- iMessage 安全检测
- 批量 URL 检测支持
- 实时检测结果展示

## 界面展示

[![沙漠中的岩石图片](https://github.com/bbanned/URLcheck/blob/main/UI.png?raw=true "URLcheck")]()

## 安装部署

1. 克隆仓库：
```bash
git clone https://github.com/bbanned/URLcheck.git
```

2. 配置 Web 服务器（Apache/Nginx）指向项目根目录

3. 确保 PHP 环境已安装并启用

## 使用说明

1. 在文本框中输入需要检测的 URL（每行一个）
2. 选择检测类型（RCS/iMessage）
3. 点击对应按钮开始检测
4. 查看检测结果

## 技术栈

- 前端：HTML5, CSS3, JavaScript
- 后端：PHP
- Web 服务器：Apache/Nginx

## 注意事项

- 请确保输入的 URL 格式正确
- 建议单次检测 URL 数量不超过 50 个
- API 调用可能受到速率限制

## License

MIT License 
