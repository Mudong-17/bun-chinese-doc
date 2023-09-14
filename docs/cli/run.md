`bun` CLI 可用于执行 JavaScript/TypeScript 文件、`package.json`脚本和[可执行包](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#bin)。

## 运行文件

与 `node <file>` 进行比较

使用 `bun run` 来执行一个源文件。

```bash
$ bun run index.js
```

Bun 支持 TypeScript 和 JSX，所有文件都会在执行之前由 Bun 的快速本地转译器即时转译。

```bash
$ bun run index.js
$ bun run index.jsx
$ bun run index.ts
$ bun run index.tsx
```

裸的 `bun` 命令等同于 `bun run`。

```bash
$ bun index.tsx
```

### `--watch`

要在监视模式下运行文件，使用 `--watch` 标志。

```bash
$ bun --watch run index.tsx
```

### `--smol`

在内存受限的环境中，使用 `--smol` 标志以降低内存使用，但会降低性能。

```bash
$ bun --smol run index.tsx
```

## 运行 `package.json` 脚本

{% note %}
与 `npm run <script>` 或 `yarn <script>` 进行比较
{% /note %}

您的 `package.json` 可以定义一些命名的 `"scripts"`，对应于 shell 命令。

```jsonc
{
  // ... 其他字段
  "scripts": {
    "clean": "rm -rf dist && echo 'Done.'",
    "dev": "bun server.ts"
  }
}
```

使用 `bun <script>` 来执行这些脚本。

```bash
$ bun clean
 $ rm -rf dist && echo 'Done.'
 Cleaning...
 Done.
```

Bun 在子 shell 中执行脚本命令。它按以下顺序检查以下 shell，使用找到的第一个 shell：`bash`、`sh`、`zsh`。

⚡️ Linux 上的 `npm run` 的启动时间约为 170ms；而使用 Bun 则只需 `6ms`。

如果 `package.json` 脚本与内置的 `bun` 命令（`install`、`dev`、`upgrade`等）之间存在名称冲突，Bun 的内置命令将优先。在这种情况下，使用更明确的 `bun run` 命令来执行您的包脚本。

```bash
$ bun run dev
```

要查看可用脚本的列表，运行不带任何参数的 `bun run`。

```bash
$ bun run
quickstart scripts:

 bun run clean
   rm -rf dist && echo 'Done.'

 bun run dev
   bun server.ts

2 scripts
```

Bun 遵守生命周期挂钩。例如，如果定义了 `pre<script>`，则 `bun run clean` 将执行 `preclean` 和 `postclean`。如果 `pre<script>` 失败，Bun 将不执行脚本本身。

## 环境变量

在运行文件、脚本或可执行文件之前，Bun 会自动从 `.env` 文件加载环境变量。按照以下顺序检查以下文件：

1. `.env.local`（第一个）
2. `NODE_ENV` === `"production"` ？ `.env.production` ： `.env.development`
3. `.env`

要调试环境变量，运行 `bun run env` 以查看已解析环境变量的列表。

## 性能

Bun 的设计目标是快速启动和高性能运行。

在 Bun 的内部，使用的是[JavaScriptCore 引擎](https://developer.apple.com/documentation/javascriptcore)，它是由 Apple 为 Safari 开发的。在大多数情况下，启动和运行性能比 Node.js 和基于 Chromium 的浏览器使用的 V8 引擎更快。它的转译器和运行时是用 Zig 编写的，这是一种现代

的、高性能的语言。在 Linux 上，这意味着启动时间比 Node.js 快[4 倍](https://twitter.com/jarredsumner/status/1499225725492076544)。

![Bun vs Node.js vs Deno运行Hello World](/static/image/bun-run-speed.jpeg)
