# Navigation Hub

一个简洁的导航页面应用，支持本地 JSON 数据管理和实时编辑。

## 功能特点

- 🎨 现代化深色主题界面
- 📝 支持本地 JSON 文件编辑和保存
- 🔍 响应式设计，适配移动端
- 🛡️ 内置 XSS 防护和数据验证
- ⚡ 快速加载和流畅交互

## 快速开始

```bash
# 安装依赖
npm install

# 启动服务
npm start
```

访问 http://localhost:3000 查看应用

## 数据管理

导航数据存储在 `data/navigation-data.json` 文件中，可通过页面编辑器进行维护。

## 安全特性

- SVG 图标内容清理，防止 XSS 攻击
- URL 格式验证，确保链接安全
- 数据长度限制，防止资源滥用
- 严格的输入验证和错误处理

## 项目结构

```
├── server.js              # Express 服务器
├── mainPage.html          # 主页面
├── data/
│   └── navigation-data.json  # 导航数据
├── package.json           # 项目配置
└── .gitignore            # Git 忽略规则
```

## 开发说明

本项目为个人兴趣开发，代码简洁优先，避免过度设计。

## 最近更新

- ✅ 添加 .gitignore 文件
- 🔒 增强安全防护（XSS、URL验证、数据验证）