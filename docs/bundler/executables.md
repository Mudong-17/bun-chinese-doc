Bun 的打包工具实现了`--compile`标志，用于从 TypeScript 或 JavaScript 文件生成独立的二进制文件。

```bash
$ bun build ./cli.ts --compile --outfile mycli
```

这将把`cli.ts`打包成一个可直接执行的可执行文件：

```
$ ./mycli
Hello world!
```

所有导入的文件和包都被打包到可执行文件中，同时还包括 Bun 运行时的副本。支持所有内置的 Bun 和 Node.js API。

**注意** — 目前，`--compile`标志一次只能接受一个入口点，并且不支持以下标志：

- `--outdir` — 请改用`outfile`。
- `--external`
- `--splitting`
- `--public-path`

## 嵌入文件

独立可执行文件支持嵌入文件。

要使用`bun build --compile`将文件嵌入到可执行文件中，请在代码中导入该文件

```js
// 这将成为一个内部文件路径
import icon from "./icon.png";

import { file } from "bun";

export default {
  fetch(req) {
    return new Response(file(icon));
  },
};
```

您可能需要为其指定一个`--loader`，以使其被视为“file”加载程序（以便您获取一个文件路径）。

可以使用`Bun.file`的函数或 Node.js 的`fs.readFile`函数（在“node:fs”中）读取嵌入的文件。

## 最小化

要稍微减小可执行文件的大小，请将`--minify`传递给`bun build --compile`。这将使用 Bun 的缩小工具来减小代码大小。总的来说，Bun 的二进制文件仍然太大，我们需要使它更小。
