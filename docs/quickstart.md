---
outline: "deep"
---

# 快速开始

让我们使用内置的 `Bun.serve` API 编写一个简单的 HTTP 服务器。首先，创建一个新的目录。

```bash
$ mkdir quickstart
$ cd quickstart
```

运行 `bun init` 以创建一个新的项目。这是一个交互式工具；在本教程中，只需按 `enter` 键接受每个提示的默认答案。

```bash
$ bun init
bun init helps you get started with a minimal project and tries to
guess sensible defaults. Press ^C anytime to quit.

package name (quickstart):
entry point (index.ts):

Done! A package.json file was saved in the current directory.
 + index.ts
 + .gitignore
 + tsconfig.json (for editor auto-complete)
 + README.md

To get started, run:
  bun run index.ts
```

由于我们的入口点是一个 `*.ts` 文件，Bun 会为您生成一个 `tsconfig.json`。如果您使用纯 JavaScript，它将生成一个 [`jsconfig.json`](https://code.visualstudio.com/docs/languages/jsconfig)。

## 运行文件

打开 `index.ts` 并粘贴以下代码片段，它使用 [`Bun.serve`](/api/http.md) 实现了一个简单的 HTTP 服务器。

```ts
const server = Bun.serve({
  port: 3000,
  fetch(req) {
    return new Response("Bun!");
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);
```

从您的 Shell 中运行文件。

```bash
$ bun index.ts
Listening on http://localhost:3000 ...
```

访问 `http://localhost:3000`来测试服务器。您应该会看到一个简单的页面，上面写着 "Bun!"。

## 运行脚本

Bun 还可以执行您的 `package.json` 中的 `"scripts"`。添加以下脚本：

```json-diff
  {
    "name": "quickstart",
    "module": "index.ts",
    "type": "module",
+   "scripts": {
+     "start": "bun run index.ts"
+   },
    "devDependencies": {
      "bun-types": "^0.7.0"
    }
  }
```

然后使用 `bun run start` 运行它。

```bash
$ bun run start
  $ bun run index.ts
  Listening on http://localhost:4000...
```

⚡️ **性能** — `bun run` 大约比 `npm run` 快 28 倍（6 毫秒与 170 毫秒的开销）。

## 安装一个包

让我们通过安装一个包使我们的服务器变得更加有趣。首先安装 `figlet` 包及其类型声明。Figlet 是一个将字符串转换为 ASCII 艺术的实用工具。

```bash
$ bun add figlet
$ bun add -d @types/figlet # 仅适用于TypeScript用户
```

更新 `index.ts` 以在 `fetch` 处理程序中使用 `figlet`。

```ts-diff
+ import figlet from "figlet";

  const server = Bun.serve({
    fetch() {
+     const body = figlet.textSync("Bun!");
+     return new Response(body);
-     return new Response("Bun!");
    },
    port: 3000,
  });
```

重新启动服务器并刷新页面。您应该会看到一个新的 ASCII 艺术横幅。

```txt
  ____              _
 | __ ) _   _ _ __ | |
 |  _ \| | | | '_ \| |
 | |_) | |_| | | | |_|
 |____/ \__,_|_| |_(_)
```
