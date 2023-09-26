# Bun 中文文档

<p align="center">
  <a href="https://bun.sh"><img src="https://user-images.githubusercontent.com/709451/182802334-d9c42afe-f35d-4a7b-86ea-9985f73f20c3.png" alt="Logo" height=170></a>
</p>
<h1 align="center">Bun</h1>

<p align="center">
<a href="https://bun.sh/discord" target="_blank"><img height=20 src="https://img.shields.io/discord/876711213126520882" /></a>
<img src="https://img.shields.io/github/stars/oven-sh/bun" alt="stars">
<a href="https://twitter.com/jarredsumner/status/1542824445810642946"><img src="https://img.shields.io/static/v1?label=speed&message=fast&color=success" alt="Bun speed" /></a>
</p>

<div align="center">
  <a href="https://bun.sh/docs">Documentation</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://discord.com/invite/CXdq2DP29u">Discord</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://github.com/oven-sh/bun/issues/new">Issues</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://github.com/oven-sh/bun/issues/159">Roadmap</a>
  <br />
</div>

### [Read the docs →](https://bun.sh/docs)

## 什么是 Bun？

> **Bun 正在积极开发中。** 使用它可以加速您的开发工作流程，或在资源受限的环境（如无服务器函数）中运行更简单的生产代码。我们正在努力实现更完整的 Node.js 兼容性，并与现有框架集成。加入[Discord](https://bun.sh/discord)并关注[GitHub 存储库](https://github.com/oven-sh/bun)以跟踪未来的发布。

Bun 是 JavaScript 和 TypeScript 应用程序的一站式工具包。它作为一个名为`bun`的单个可执行文件提供。

其核心是*Bun 运行时*，这是一个快速的 JavaScript 运行时，设计为 Node.js 的即插即用替代品。它是用 Zig 编写的，在底层由 JavaScriptCore 驱动，大大减少了启动时间和内存使用。

```bash
bun run index.tsx             # 默认支持TS和JSX
```

`bun`命令行工具还实现了测试运行器、脚本运行器和与 Node.js 兼容的包管理器。与开发需要 1,000 个 node_modules 不同，您只需要`bun`。Bun 的内置工具明显比现有选项快，并且在现有 Node.js 项目中几乎不需要进行任何更改。

```bash
bun test                      # 运行测试
bun run start                 # 运行`package.json`中的`start`脚本
bun install <pkg>             # 安装包
bunx cowsay 'Hello, world!'   # 执行包
```

## 安装

Bun 支持 Linux（x64 和 arm64）和 macOS（x64 和 Apple Silicon）。

> **Linux 用户** —— 强烈建议使用 5.6 或更高版本的内核，但最低版本为 5.1。
>
> **Windows 用户** —— Bun 目前不提供本机 Windows 版本。我们正在努力解决这个问题；进展可以在[此问题](https://github.com/oven-sh/bun/issues/43)上跟踪。在此期间，对于 Windows Subsystem for Linux，可以使用以下安装方法之一。

```sh
# 使用安装脚本（推荐）
curl -fsSL https://bun.sh/install | bash

# 使用npm
npm install -g bun

# 使用Homebrew
brew tap oven-sh/bun
brew install bun

# 使用Docker
docker pull oven/bun
docker run --rm --init --ulimit memlock=-1:-1 oven/bun
```

### 升级

要升级到 Bun 的最新版本，请运行：

```sh
bun upgrade
```

Bun 会在每次提交到`main`分支时自动发布一个 canary 版本。要升级到最新的 canary 版本，请运行：

```sh
bun upgrade --canary
```

[查看 canary 版本](https://github.com/oven-sh/bun/releases/tag/canary)

## 快速链接

- Intro

  - [What is Bun](./docs/index.md)

  - [Installation](./docs/installation.md)

  - [Quickstart](./docs/quickstart.md)

  - [Typescript](./docs/typescript.md)

  - [Templates](./docs/templates.md)

- Runtime

  - [`bun run`](./docs/cli/run.md)

  - [File types](./docs/runtime/loaders.md)

  - [TypeScript](./docs/runtime/typescript.md)

  - [JSX](./docs/runtime/jsx.md)

  - [Environment variables](./docs/runtime/env.md)

  - [Bun APIs](./docs/runtime/bun-apis.md)

  - [Web APIs](./docs/runtime/web-api.md)

  - [Node.js compatibility](./docs/runtime/nodejs-api.md)

  - [Plugins](./docs/runtime/plugins.md)

  - [Watch mode](./docs/runtime/hot.md)

  - [Module resolution](./docs/runtime/modules.md)

  - [Auto-install](./docs/runtime/autoimport.md)

  - [bunfig.toml](./docs/runtime/bunfig.md)

  - [Debugger](./docs/runtime/debugger.md)

- Package manager

  - [bun install](./docs/cli/install.md)

  - [Global cache](./docs/install/cache.md)

  - [Workspaces](./docs/install/workspaces.md)

  - [Lockfile](./docs/install/lockfile.md)

  - [Scopes and registries](./docs/install/registries.md)

  - [Utilities](./docs/install/utilities.md)

- Bundler

  - [Bun.build](./docs/bundler/index.md)

  - [Loaders](./docs/bundler/loaders.md)

  - [Plugins](./docs/bundler/plugins.md)

  - [Executables](./docs/bundler/executables.md)

  - [Macros](./docs/bundler/macros.md)

  - [vs esbuild](./docs/bundler/vs-esbuild.md)

- Test runner

  - [bun test](./docs/cli/test.md)

  - [Writing tests](./docs/test/writing.md)

  - [Watch mode](./docs/test/hot.md)

  - [Lifecycle hooks](./docs/test/lifecycle.md)

  - [Mocks](./docs/test/mocks.md)

  - [Snapshots](./docs/test/snapshots.md)

  - [Dates and times](./docs/test/time.md)

  - [DOM testing](./docs/test/dom.md)

  - [Code coverage](./docs/test/coverage.md)

- Package runner

  - [bunx](./docs/cli/bunx.md)

- API

  - [HTTP server](./docs/api/http.md)

  - [WebSockets](./docs/api/websockets.md)

  - [Workers](./docs/api/workers.md)

  - [Binary data](./docs/api/binary-data.md)

  - [Streams](./docs/api/streams.md)

  - [File I/O](./docs/api/file-io.md)

  - [import.meta](./docs/api/import-meta.md)

  - [SQLite](./docs/api/sqlite.md)

  - [FileSystemRouter](./docs/api/file-system-router.md)

  - [TCP sockets](./docs/api/tcp.md)

  - [Globals](./docs/api/globals.md)

  - [Child processes](./docs/api/spawn.md)

  - [Transpiler](./docs/api/transpiler.md)

  - [Hashing](./docs/api/hashing.md)

  - [Console](./docs/api/console.md)

  - [FFI](./docs/api/ffi.md)

  - [HTMLRewriter](./docs/api/html-rewriter.md)

  - [Testing](./docs/api/test.md)

  - [Utils](./docs/api/utils.md)

  - [Node-API](./docs/api/node-api.md)

- Project
  - [Roadmap](./docs/project/roadmap.md)
  - [Benchmarking](./docs/project/benchmarking.md)
  - [Development](./docs/project/development.md)
  - [License](./docs/project/licensing.md)
