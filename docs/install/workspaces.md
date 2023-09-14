Bun 支持`package.json`中的[`workspaces`](https://docs.npmjs.com/cli/v9/using-npm/workspaces?v=true#description)。工作区使得开发复杂软件变得容易，这些软件作为一个由多个独立包组成的*monorepo*。

要尝试它，请在`package.json`的`workspaces`字段中指定子包的列表；通常将这些子包放在名为`packages`的目录中。

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "workspaces": ["packages/*"]
}
```

{% callout %}
**Glob 支持** — Bun 支持`"workspaces"`中的简单`<directory>/*`通配符。完整的通配符语法（例如`**`和`?`）尚未受支持。
{% /callout %}

这有一些主要优点。

- **代码可以分成逻辑部分。** 如果一个包依赖于另一个包，您可以简单地将其添加为`bun add`的依赖项。如果包`b`依赖于`a`，`bun install`会将您的本地`packages/a`目录符号链接到`b`的`node_modules`文件夹中，而不是尝试从 npm 注册表中下载它。
- **依赖项可以被去重。** 如果`a`和`b`共享一个公共依赖项，它将被*提升*到根`node_modules`目录。这减少了冗余的磁盘使用量，并减少了同时安装多个版本的包时出现的与"依赖地狱"相关的问题。

{% callout %}
⚡️ **速度** — 安装速度快，即使是对于大型 monorepo 也是如此。Bun 在 Linux 上约在`500ms`内安装[Remix](https://github.com/remix-run/remix) monorepo。

- 比`npm install`快 28 倍
- 比`yarn install`（v1）快 12 倍
- 比`pnpm install`快 8 倍

{% image src="https://user-images.githubusercontent.com/709451/212829600-77df9544-7c9f-4d8d-a984-b2cd0fd2aa52.png" /%}
{% /callout %}
