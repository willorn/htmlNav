# Navigation Hub

一个简洁的导航页面应用，使用本地 JSON 数据驱动，可在纯静态环境中浏览。

## 功能特点

- 🎨 现代化深色主题界面
- 📝 本地 JSON 文件驱动，易于手工维护
- 🔍 响应式设计，适配移动端
- 🛡️ 内置 XSS 防护和数据验证
- ⚡ 快速加载和流畅交互

## 快速开始

```bash
# 启动一个本地静态服务器（任选其一）
python3 -m http.server 4173
# 或者使用任意喜欢的静态托管工具
```

然后在浏览器访问 `http://localhost:4173/mainPage.html` 即可自动读取 `data/navigation-data.json` 并展示导航。

> 如果只是临时查看，也可以直接双击 `mainPage.html`（file:// 模式）。此时需要在页面提示处手动选择 `data/navigation-data.json`，或使用“上次加载的数据”按钮。

## 数据管理

所有导航内容都集中在 `data/navigation-data.json` 中。更新该文件后刷新页面即可，HTTP 模式会自动加载，离线模式可手动选择文件。

### 离线 / 静态模式

直接通过 `file://` 打开 `mainPage.html` 时，浏览器不会允许读取相邻的 JSON 文件。页面会提示你：

1. 点击“选择 JSON 文件”并选中本地的 `data/navigation-data.json`；
2. 或者在已经加载过一次后使用“上次加载的数据”（来自 `localStorage` 缓存）。

该模式仅用于查看，不支持在线编辑。

## 安全特性

- SVG 图标内容清理，防止 XSS 攻击
- URL 格式验证，确保链接安全
- 数据长度限制，防止资源滥用
- 严格的输入验证和错误处理

## 文件说明

- **mainPage.html** - 主应用页面，支持 HTTP 自动加载和本地文件手动加载
- **mainPage-static.html** - 静态版本，内置导航数据，支持搜索筛选，可离线使用
- **data/navigation-data.json** - 导航数据存储文件

## 使用场景

1. **静态托管**: 通过任意 HTTP 静态服务器访问 `mainPage.html`，自动读取 JSON
2. **纯离线查看**: 双击 `mainPage.html`，按照提示手动加载 JSON 文件
3. **完全脱网**: 打开 `mainPage-static.html`（内置数据，可搜索）

## 项目结构

```
├── mainPage.html          # 主应用页面（在线版）
├── mainPage-static.html   # 静态页面（离线版）
├── data/
│   └── navigation-data.json  # 导航数据
└── .gitignore            # Git 忽略规则
```

## 开发说明

本项目为个人兴趣开发，代码简洁优先，避免过度设计。

## 最近更新

- ✅ 添加 .gitignore 文件
- 🔒 增强安全防护（XSS、URL验证、数据验证）
- 🗑️ 清理冗余文件，优化项目结构
