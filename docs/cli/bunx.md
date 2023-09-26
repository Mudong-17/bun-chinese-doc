`bunx`是`bun`的别名。当您安装`bun`时，`bunx` CLI 将自动安装。

使用`bunx`来自`npm`自动安装和运行包。它相当于`npx`或`yarn dlx`。

```bash
$ bunx cowsay "Hello world!"
```

> ⚡️ **速度** — 由于 Bun 启动速度很快，对于本地安装的包，`bunx`比`npx`快[大约 100 倍](https://twitter.com/jarredsumner/status/1606163655527059458)。

包可以在其`package.json`的`"bin"`字段中声明可执行文件。这些通常被称为*包可执行文件*或*包二进制文件*。

```jsonc#package.json
{
  // ... 其他字段
  "name": "my-cli",
  "bin": {
    "my-cli": "dist/index.js"
  }
}
```

这些可执行文件通常是带有[shebang 行](<https://en.wikipedia.org/wiki/Shebang_(Unix)>)的普通 JavaScript 文件，以指示应使用哪个程序来执行它们。以下文件指示应使用`node`执行它。

```js#dist/index.js
#!/usr/bin/env node

console.log("Hello world!");
```

这些可执行文件可以使用`bunx`运行，

```bash
$ bunx my-cli
```

与`npx`一样，`bunx`将首先检查本地安装的包，然后退回到从`npm`自动安装包。已安装的包将存储在 Bun 的全局缓存中供将来使用。

## 参数和标志

要将其他命令行标志和参数传递给可执行文件，请在可执行文件名称之后放置它们。

```bash
$ bunx my-cli --foo bar
```

## Shebangs

默认情况下，Bun 会尊重 shebangs。如果一个可执行文件标记有`#!/usr/bin/env node`，Bun 将启动一个`node`进程来执行该文件。然而，在某些情况下，可能希望使用 Bun 的运行时来运行可执行文件，即使可执行文件指示使用其他方式执行。要执行此操作，请包含`--bun`标志。

```bash
$ bunx --bun my-cli
```

`--bun`标志必须出现在可执行文件名称之前。出现在名称之后的标志将传递给可执行文件。
