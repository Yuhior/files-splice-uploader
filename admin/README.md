
# 🚀 Yasu-Vue3-Lightning - 极速开发模板

**开箱即用的现代 Vue3 开发解决方案**
Node.js 版本要求：`^20.0.0`

![Static Badge](https://img.shields.io/badge/Vue-3.4.29-brightgreen?style=flat&label=vue)
![Static Badge](https://img.shields.io/badge/vite-5.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4.0-3178c6)

## ✨ 核心特性

- ⚡ **极速启动**：基于 Vite 5 的闪电构建
- 🧩 **状态管理**：集成 Pinia 2 的模块化 Store
- 🗺 **智能路由**：Vue Router 4 的自动化路由配置
- 📐 **代码规范**：预置 ESLint + Prettier + Airbnb 规范
- 🛡 **工程优化**：内置生产环境压缩/分包/CDN 配置
- 🚨 **提交验证**：Git Hook 集成（Husky + Commitlint）

## 📦 技术全景

| 技术栈          | 版本     | 官方文档                     |
|----------------|---------|----------------------------|
| Vue 3          | 3.4.29 | https://vuejs.org/          |
| Vite           | 5.3.1 | https://vitejs.dev/         |
| Pinia          | 2.1.7   | https://pinia.vuejs.org/    |
| Vue Router     | 4.3.3 | https://router.vuejs.org/   |
| TypeScript     | 5.4.0 | https://www.typescriptlang.org/ |
| ESLint         | 8.57.0 | https://eslint.org/         |

## 🛠 快速上手

### 环境准备
```bash
# 确认 Node 版本
node -v # 要求 v20.x

# 推荐包管理器
corepack enable
corepack prepare pnpm@latest --activate

```

### 初始化项目

```shell
pnpm install    # 安装依赖
```

```shell
pnpm run dev    # 启动开发服务器
```

### 常用命令

| 指令              | 功能描述                   |
| ----------------- | -------------------------- |
| `pnpm dev`        | 启动开发服务器 (端口:5173) |
| `pnpm build`      | 生产环境构建 (输出至 dist) |
| `pnpm preview`    | 本地预览生产包             |
| `pnpm lint`       | 代码规范检查 + 自动修复    |
| `pnpm type-check` | TypeScript 类型检查        |

### 项目结构

```
├── src/
│   ├── api/       	  # 接口定义
│   ├── assets/       # 静态资源
│   ├── components/   # 公共组件
│   ├── directives/   # 指令
│   ├── hooks/        # 自定义 Hooks
│   ├── layouts/      # 布局组件
│   ├── plugins/      # 插件引用
│   ├── router/       # 路由配置
│   ├── stores/       # Pinia 状态管理
│   ├── styles/       # 全局样式
│   ├── utils/        # 工具类函数
│   ├── views/        # 页面组件
│   ├── App.vue       # 根组件
│   └── main.ts       # 入口文件
├── .env              # 环境变量配置
├── tsconfig.json    # TypeScript 配置
└── vite.config.ts   # Vite 高级配置
```

## 浏览器支持

本地开发推荐使用`Chrome 80+` 浏览器

支持现代浏览器, 不支持 IE

| [![ Edge](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png)](http://godban.github.io/browsers-support-badges/) IE | [![ Edge](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png)](http://godban.github.io/browsers-support-badges/) Edge | [![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png)](http://godban.github.io/browsers-support-badges/) Firefox | [![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png)](http://godban.github.io/browsers-support-badges/) Chrome | [![Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png)](http://godban.github.io/browsers-support-badges/) Safari |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| not support                                                                                                                                           | last 2 versions                                                                                                                                         | last 2 versions                                                                                                                                                    | last 2 versions                                                                                                                                                | last 2 versions                                                                                                                                                |

## 🤝 参与贡献

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/xxx`)
3. 提交代码 (`git commit -am 'feat: 新增xxx功能'`)
4. 推送分支 (`git push origin feature/xxx`)
5. 提交 Pull Request

## 📄 许可协议

```
MIT License

Copyright (c) 2025 Yuhior

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
