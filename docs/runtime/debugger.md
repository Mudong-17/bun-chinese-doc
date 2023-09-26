---
outline: "deep"
---

# Debugger

Bun 支持[WebKit Inspector Protocol](https://github.com/oven-sh/bun/blob/main/packages/bun-vscode/types/jsc.d.ts)，因此您可以使用交互式调试器来调试您的代码。为了演示，考虑以下简单的 Web 服务器示例。

```ts
#server.ts
Bun.serve({
  fetch(req){
    console.log(req.url);
    return new Response("Hello, world!");
  }
})
```

### `--inspect`

要在使用 Bun 运行代码时启用调试，请使用`--inspect`标志。这会自动在可用端口上启动 WebSocket 服务器，用于检查运行中的 Bun 进程。

```sh
$ bun --inspect server.ts
------------------ Bun Inspector ------------------
Listening at:
  ws://localhost:6499/0tqxs9exrgrm

Inspect in browser:
  https://debug.bun.sh/#localhost:6499/0tqxs9exrgrm
------------------ Bun Inspector ------------------
```

### `--inspect-brk`

`--inspect-brk`标志的行为与`--inspect`相同，但它会在执行的脚本的第一行自动注入断点。这对于快速运行并立即退出的脚本进行调试非常有用。

### `--inspect-wait`

`--inspect-wait`标志的行为与`--inspect`相同，但在附加调试器到运行中的进程之前，代码不会执行。

### 设置调试器的端口或 URL

无论使用哪个标志，您都可以选择指定端口号、URL 前缀或两者。

```sh
$ bun --inspect=4000 server.ts
$ bun --inspect=localhost:4000 server.ts
$ bun --inspect=localhost:4000/prefix server.ts
```

## 调试器

各种调试工具可以连接到此服务器，以提供交互式调试体验。

### `debug.bun.sh`

Bun 在[debug.bun.sh](https://debug.bun.sh)上托管了一个基于 Web 的调试器。这是对 Safari 用户熟悉的 WebKit 的[Web Inspector Interface](https://webkit.org/web-inspector/web-inspector-interface/)的修改版本。

在浏览器中打开提供的`debug.bun.sh` URL 以开始调试会话。从这个界面，您可以查看正在运行的文件的源代码，查看和设置断点，并使用内置控制台执行代码。

![Bun调试器的截图，控制台选项卡](/261513160-e6a976a8-80cc-4394-8925-539025cc025d.png)

让我们设置一个断点。转到"Sources"选项卡；您应该看到之前的代码。单击行号`3`，以在我们的`console.log(req.url)`语句上设置断点。

![Bun调试器的截图](/261513717-3b69c7e9-25ff-4f9d-acc4-caa736862935.png)

然后在您的 Web 浏览器中访问`http://localhost:3000`。这将发送一个 HTTP 请求到我们的`localhost` Web 服务器。似乎页面不加载。为什么？因为程序已经在我们之前设置的断点处暂停执行。

请注意界面如何改变。

![Bun调试器的截图](/261513463-8b565e58-5445-4061-9bc4-f41090dfe769.png)

在这一点上，我们可以执行许多操作来检查当前的执行环境。我们可以在底部的控制台中运行任意代码，具有对我们断点处的作用域中的变量的完全访问权限。

<image src="https://github.com/oven-sh/bun/assets/3084745/f4312b76-48ba-4a7d-b3b6-6205968ac681" />

在"Sources"窗格的右侧，我们可以看到当前作用域中的所有本地变量，并深入查看它们的属性和方法。在这里，我们正在检查`req`变量。

<image src="https://github.com/oven-sh/bun/assets/3084745/63d7f843-5180-489c-aa94-87c486e68646" />

在"Sources"窗格的左上角，我们可以控制程序的执行。

<image src="https://github.com/oven-sh/bun/assets/3084745/41b76deb-7371-4461-9d5d-81b5a6d2f7a4" />

这是一个速查表，解释了控制流按钮的功能。

- _继续脚本执行_ — 继续运行程序，直到下一个断点或异常。
- _跳过_ — 程序将继续到下一行。
- _跳入_ — 如果当前语句包含函数调用，调试器将"跳入"所调用的函数。
- _跳出_ — 如果当前语句是函数调用，调试器将完成执行调用，然后"跳出"函数，返回到调用它的位置。

<image src="https://github-production-user-asset-6210df.s3.amazonaws.com/3084745/261510346-6a94441c-75d3-413a-99a7-efa62365f83d.png" />
