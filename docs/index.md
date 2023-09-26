# What is Bun?

"Bun" 是用于 JavaScript 和 TypeScript 应用程序的一站式工具包。它以一个名为 `bun` 的单一可执行文件的形式发布。

在其核心是 Bun 运行时，它是一个快速的 JavaScript 运行时，设计成可替代 Node.js。它是用 Zig 编写的，并在底层由 JavaScriptCore 驱动，大大减少了启动时间和内存使用。

```bash
bun run index.tsx # 支持 TypeScript (TS) 和 JSX 开箱即用。
```

`bun` 命令行工具还实现了一个测试运行器、脚本运行器和与 Node.js 兼容的包管理器，所有这些功能都比现有的工具快得多，并且可以在现有的 Node.js 项目中使用，几乎不需要进行任何或很少的更改。

```bash
bun run start                # 运行 `start` 脚本
bun install <pkg>​            # 安装一个包
bun build ./index.tsx        # 为浏览器打包一个项目
bun test                     # 运行测试
bunx cowsay "Hello, world!"  # 执行一个包
```

> Bun 仍在开发中。可以使用它来加速开发工作流程，或在资源受限的环境中运行更简单的生产代码，比如无服务器函数。我们正在努力实现更完整的 Node.js 兼容性，并与现有框架进行集成。加入 Discord 并关注 GitHub 仓库，以跟踪未来的发布。

可以通过以下快速链接之一开始使用，或继续阅读了解有关 Bun 的更多信息。

[安装 Bun](./installation.md)

[快速入门](./quickstart.md)

[安装包](./cli/install.md)

[使用项目模板](./templates.md)

[将代码打包用于生产环境](./bundler/index.md)

[构建一个 HTTP 服务器](./api/http.md)

[构建一个 WebSocket 服务器](./api/websockets.md)

[读取和写入文件](./api/file-io.md)

[运行 SQLite 查询](./api/sqlite.md)

[编写并运行测试](./cli/test.md)

## 什么是运行时

JavaScript（或更正式地说，ECMAScript）只是一种编程语言的规范。任何人都可以编写一个 JavaScript 引擎，它可以接受有效的 JavaScript 程序并执行它。当今使用最广泛的两个引擎分别是由 Google 开发的 V8 和由 Apple 开发的 JavaScriptCore。它们都是开源的。

### 浏览器

但大多数 JavaScript 程序不是独立运行的。它们需要一种方式来访问外部世界以执行有用的任务。这就是运行时发挥作用的地方。它们实现了额外的 API，然后将这些 API 提供给它们执行的 JavaScript 程序。值得注意的是，浏览器内置了 JavaScript 运行时，这些运行时实现了一组特定于 Web 的 API，可以通过全局的 window 对象来访问。浏览器执行的任何 JavaScript 代码都可以使用这些 API，在当前网页的上下文中实现交互或动态行为。

### Node.js

同样地，Node.js 是一个 JavaScript 运行时，可在非浏览器环境（如服务器）中使用。由 Node.js 执行的 JavaScript 程序除了可以访问用于执行操作系统级任务的内置模块（例如读写文件的 node:fs 和网络通信的 node:net、node:http）之外，还可以访问一组 Node.js 特定的全局对象，如 Buffer、process 和\_\_dirname。Node.js 还实现了一个基于 CommonJS 的模块系统和解析算法，早于 JavaScript 的本机模块系统。

Bun 被设计成 Node.js 的更快、更精简、更现代的替代品。

### 设计目标

Bun 的设计从头开始考虑了今天的 JavaScript 生态系统。

1. **速度**：Bun 的启动速度比当前的 Node.js 快 4 倍（可以自己尝试！）

2. **TypeScript 和 JSX 支持**：你可以直接执行 .jsx、.ts 和 .tsx 文件；Bun 的转译器会在执行之前将它们转换为纯 JavaScript。

3. **ESM 和 CommonJS 兼容性**：世界正在转向 ES 模块（ESM），但 npm 上仍有数百万的包需要 CommonJS。Bun 推荐 ES 模块，但也支持 CommonJS。

4. **Web 标准 API**：Bun 实现了标准的 Web API，如 fetch、WebSocket 和 ReadableStream。Bun 由由苹果为 Safari 开发的 JavaScriptCore 引擎驱动，因此一些 API，如 Headers 和 URL，直接使用 Safari 的实现。

5. **Node.js 兼容性**：除了支持 Node 式模块解析，Bun 还致力于与内置的 Node.js 全局对象（process、Buffer）和模块（path、fs、http 等）完全兼容。这是一个尚未完成的持续努力。请参考兼容性页面以查看当前状态。

Bun 不仅仅是一个运行时。长期目标是成为一个有机的、基础性的工具包，用于构建 JavaScript/TypeScript 的应用程序，包括包管理器、转译器、打包工具、脚本运行器、测试运行器等等。
