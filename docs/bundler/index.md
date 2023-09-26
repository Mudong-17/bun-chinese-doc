Bun 的快速本地打包器现在处于测试阶段。可以通过`bun build`命令行命令或`Bun.build()`JavaScript API 来使用它。

```ts#JavaScript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './build',
});
```

```sh#CLI
$ bun build ./index.tsx --outdir ./build
```

它很快。下面的数字代表在 esbuild 的[three.js 基准](https://github.com/oven-sh/bun/tree/main/bench/bundle)上的性能：

![Bundling 10 copies of three.js from scratch, with sourcemaps and minification](/static/images/bundler-speed.png)

## 为什么需要打包？

打包器是 JavaScript 生态系统中的一个关键基础设施部分。以下是为什么打包如此重要的简要概述：

- **减少 HTTP 请求。** `node_modules`中的单个包可能包含数百个文件，大型应用程序可能有数十个这样的依赖关系。使用单独的 HTTP 请求加载每个文件变得不可行，因此使用打包器将我们的应用源代码转换为更少数量的自包含“包”，可以使用单个请求加载。
- **代码转换。** 现代应用程序通常使用 TypeScript、JSX 和 CSS 模块等语言或工具构建，所有这些都必须在可以由浏览器消耗之前转换为普通 JavaScript 和 CSS。打包器是配置这些转换的自然场所。
- **框架特性。** 框架依赖于打包器插件和代码转换来实现常见模式，如文件系统路由、客户端-服务器代码共存（例如`getServerSideProps`或 Remix 加载程序）和服务器组件。

让我们深入了解打包器 API。

## 基本示例

让我们构建我们的第一个包。你有以下两个文件，它们实现了一个简单的客户端渲染的 React 应用程序。

```tsx#./index.tsx
import * as ReactDOM from 'react-dom/client';
import {Component} from "./Component"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Component message="Sup!" />)
```

```tsx#./Component.tsx
export function Component(props: {message: string}) {
  return <p>{props.message}</p>
}
```

在这里，`index.tsx`是我们应用程序的“入口点”。通常情况下，这将是执行某些“副作用”的脚本，比如启动服务器或者在这种情况下初始化一个 React 根。因为我们使用了 TypeScript 和 JSX，所以我们需要在将代码发送到浏览器之前对它进行打包。

要创建我们的包：

```ts#JavaScript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
})
```

```bash#CLI
$ bun build ./index.tsx --outdir ./out
```

对于`entrypoints`中指定的每个文件，Bun 将生成一个新的包。此包将写入磁盘中的`./out`目录（根据当前工作目录解析而来）。运行构建后，文件系统看起来像这样：

```
.
├── index.tsx
├── Component.tsx
└── out
    └── index.js
```

`out/index.js`的内容将类似于以下内容：

```js#out/index.js
// ...
// ~20k行代码
// 包括`react-dom/client`及其所有依赖项的内容
// 这是$jsxDEV和$createRoot函数的定义位置


// Component.tsx
function Component(props) {
  return $jsxDEV("p", {
    children: props.message
  }, undefined, false, undefined, this);
}

// index.tsx
var rootNode = document.getElementById("root");
var root = $createRoot(rootNode);
root.render($jsxDEV(Component, {
  message: "Sup!"
}, undefined, false, undefined, this));
```

**教程：在浏览器中运行此文件**
我们可以在浏览器中加载此文件，以查看我们的应用程序的运行情况。在`out`目录中创建一个`index.html`文件：

```bash
$ touch out/index.html
```

然后将以下内容粘贴到其中：

```html
<html>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.js"></script>
  </body>
</html>
```

然后启动一个静态文件服务器，以提供`out`目录：

```bash
$ bunx serve out
```

访问`http://localhost:5000`以查看您的打包应用

程序。

## 监视模式

与运行时和测试运行程序一样，打包器本地支持监视模式。

```sh
$ bun build ./index.tsx --outdir ./out --watch
```

## 内容类型

与 Bun 运行时一样，打包器本地支持一系列的文件类型。以下表格详细介绍了打包器的标准“加载器”集合。有关完整文档，请参阅[Bundler > 文件类型](/docs/runtime/loaders)。

下面是您提供的内容转换为 Markdown 表格的结果：

| 扩展名                                         | 详情                                                                                                                                                                                                                               |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.js` `.cjs` `.mjs` `.mts` `.cts` `.ts` `.tsx` | 使用 Bun 内置的转换器解析文件，并将 TypeScript/JSX 语法转译为普通的 JavaScript。打包器执行一组默认转换，包括死代码消除、树摇和环境变量内联。目前，Bun 不会尝试降级语法；如果您使用最近的 ECMAScript 语法，它将反映在打包的代码中。 |
| `.json`                                        | JSON 文件被解析并内联到包中作为 JavaScript 对象。                                                                                                                                                                                  |
| `.toml`                                        | TOML 文件被解析并内联到包中作为 JavaScript 对象。                                                                                                                                                                                  |
| `.txt`                                         | 文本文件的内容被读取并内联到包中作为字符串。                                                                                                                                                                                       |
| `.node` `.wasm`                                | 这些文件在 Bun 运行时中受支持，但在打包时被视为[资源](#资源)。                                                                                                                                                                     |

请注意，Markdown 表格中的标题行是由第一个列表项定义的，而列表项之间的分割线是由`---`行定义的。

### 资源

如果打包器遇到一个带有未识别扩展名的导入，它会将被导入的文件视为*外部文件*。引用的文件会原样复制到`outdir`中，导入将被解析为文件的路径。

```ts#Input
// bundle入口点
import logo from "./logo.svg";
console.log(logo);
```

```ts#Output
// 打包输出
var logo = "./logo-ab237dfe.svg";
console.log(logo);
```

> 文件加载器的确切行为也受到[`命名`](#naming)和[`publicPath`](#publicpath)的影响。

有关文件加载器的更完整文档，请参阅[Bundler > 加载器](/docs/bundler/loaders.md#file)页面。

### 插件

此表中描述的行为可以使用[插件](/docs/bundler/plugins.md)覆盖或扩展。请参阅[打包程序 > 加载器](/docs/bundler/plugins.md)页面以获得完整的文档。

## API

### `entrypoints`

**必需项。**一个数组，其中包含我们应用程序的入口点的路径。将为每个入口点生成一个包。

```ts#JavaScript
const result = await Bun.build({
  entrypoints: ["./index.ts"],
});
// => { success: boolean, outputs: BuildArtifact[], logs: BuildMessage[] }
```

```bash#CLI
$ bun build --entrypoints ./index.ts
# 包将打印到stdout
# <打包的代码>
```

### `outdir`

将输出文件写入的目录。

```ts#JavaScript
const result = await Bun.build({
  entrypoints: ['./index.ts'],
  outdir: './out'
});
// => { success: boolean, outputs: BuildArtifact[], logs: BuildMessage[] }
```

```bash#CLI
$ bun build --entrypoints ./index.ts --outdir ./out
# 将打印捆绑文件的摘要到stdout
```

如果未将`outdir`传递给 JavaScript API，则捆绑的代码将不会写入磁盘。捆绑文件以`BuildArtifact`对象数组的形式返回。这些对象是带有额外属性的 Blob；请参阅[输出](#输出)以获取完整的文档。

```ts
const result = await Bun.build({
  entrypoints: ["./index.ts"],
});

for (const result of result.outputs) {
  // 可以作为blob消耗
  await result.text();

  // Bun将设置Content-Type和Etag头
  new Response(result);

  // 也可以手动写入，但在这种情况下应该使用`outdir`。
  Bun.write(path.join("out", result.path), result);
}
```

当设置了`outdir`时，`BuildArtifact`上的`path`属性将是写入时的绝对路径。

### `target`

捆绑包的预期执行环境。

```ts#JavaScript
await Bun.build({
  entrypoints: ['./index.ts'],
  outdir: './out',
  target: 'browser', // 默认值
})
```

```bash#CLI
$ bun build --entrypoints ./index.ts --outdir ./out --target browser
```

根据目标，Bun 将应用不同的模块解析规则和优化。

<!-- - 模块解析

。例如，在为浏览器打包时，Bun将在解析导入时优先考虑`"browser"`导出条件。如果导入或使用了任何Node.js或Bun内置模块，例如`node:fs`或`Bun.serve`，将会抛出错误。 -->

|           | 描述                                                                                                                                                                                                                                                                                                                                                                                     |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `browser` | _默认值。_ 用于生成打算在浏览器中执行的包。在解析导入时，优先考虑`"browser"`导出条件。导入任何内置模块，如`node:events`或`node:path`都可以工作，但调用某些函数，如`fs.readFile`将无法工作。                                                                                                                                                                                              |
| `bun`     | 用于生成打算在 Bun 运行时中运行的包。在许多情况下，不需要打包服务器端代码；可以直接执行源代码而无需修改。然而，打包服务器代码可以减少启动时间并提高运行性能。使用`target: "bun"`生成的所有包都带有特殊的`// @bun`预处理指令，该指令告诉 Bun 运行时无需在执行之前重新转译文件。如果任何入口点包含 Bun shebang（`#!/usr/bin/env bun`），打包器将默认为`target: "bun"`，而不是`"browser"`。 |
| `node`    | 用于生成打算在 Node.js 中运行的包。在解析导入时，优先考虑`"node"`导出条件，并输出`.mjs`。未来，这将自动填充`Bun`全局对象和其他内置的`bun:*`模块，尽管目前尚未实现。                                                                                                                                                                                                                      |

### `format`

指定生成包中使用的模块格式。

目前，打包器仅支持一种模块格式：`"esm"`。计划支持`"cjs"`和`"iife"`。

```ts#JavaScript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
  format: "esm",
})
```

```bash#CLI
$ bun build ./index.tsx --outdir ./out --format esm
```

### `splitting`

是否启用代码分割。

```ts#JavaScript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
  splitting: false, // 默认值
})
```

```bash#CLI
$ bun build ./index.tsx --outdir ./out --splitting
```

当设置为`true`时，打包器将启用 _代码分割_。当多个入口点都导入相同的文件、模块或一组文件/模块时，将这些共享代码拆分到一个单独的包中通常很有用。这个共享的包被称为 _chunk_。考虑以下文件：

```ts#entry-a.ts
import { shared } from './shared.ts';
```

```ts#entry-b.ts
import { shared } from './shared.ts';
```

```ts#shared.ts
export const shared = 'shared';
```

启用代码拆分的情况下，要捆绑`entry-a.ts`和`entry-b.ts`：

```ts#JavaScript
await Bun.build({
  entrypoints: ['./entry-a.ts', './entry-b.ts'],
  outdir: './out',
  splitting: true,
})
```

```bash#CLI
$ bun build ./entry-a.ts ./entry-b.ts --outdir ./out --splitting
```

运行此构建将生成以下文件：

```txt
.
├── entry-a.tsx
├── entry-b.tsx
├── shared.tsx
└── out
    ├── entry-a.js
    ├── entry-b.js
    └── chunk-2fce6291bf86559d.js

```

生成的`chunk-2fce6291bf86559d.js`文件包含了共享的代码。为避免冲突，默认情况下文件名会自动包含内容哈希。这可以通过[`naming`](#naming)进行自定义。

### `plugins`

要在捆绑过程中使用的插件列表。

```ts#JavaScript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
  plugins: [/* ... */],
})
```

```bash#CLI
n/a
```

Bun 实现了一个通用的插件系统，可用于 Bun 的运行时和打包器。有关完整文档，请参阅[插件文档](/docs/bundler/plugins.md)。

### `sourcemap`

指定要生成的源映射的类型。

```ts#JavaScript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
  sourcemap: "external", // 默认值是 "none"
})
```

```bash#CLI
$ bun build ./index.tsx --outdir ./out --sourcemap=external
```

|              | 描述                                                         |
| ------------ | ------------------------------------------------------------ |
| `"none"`     | _默认值。_ 不生成源映射。                                    |
| `"inline"`   | 生成源映射，并将其作为 base64 数据附加到生成的捆绑包的末尾。 |
| `"external"` | 为每个 `*.js` 捆绑包旁边创建一个单独的 `*.js.map` 文件。     |

> 生成的捆绑包包含一个[调试 ID](https://sentry.engineering/blog/the-case-for-debug-ids)，可用于将捆绑包与其相应的源映射关联起来。此`debugId`作为注释添加到文件底部。
>
> ```ts
> // <生成的捆绑包代码>
>
> //# debugId=<DEBUG ID>
> ```
>
> 关联的`*.js.map`源映射文件将是一个包含等效`debugId`属性的 JSON 文件。

### `minify`

是否启用缩小。默认`false`。

> 当目标是`bun`时，默认情况下会缩小标识符。

要启用所有缩小选项：

```ts#JavaScript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
  minify: true, // 默认值是 false
})
```

```bash#CLI
$ bun build ./index.tsx --outdir ./out --minify
```

要逐个启用某些缩小选项：

```ts#JavaScript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
  minify: {
    whitespace: true,
    identifiers: true,
    syntax: true,
  },
})
```

```bash#CLI
$ bun build ./index.tsx --outdir ./out --minify-whitespace --minify-identifiers --minify-syntax
```

### `external`

要考虑为“外部”的导入路径列表。默认值为`[]`。

```ts#JavaScript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
  external: ["lodash", "react"], // 默认值: []
})
```

```bash#CLI
$ bun build ./index.tsx --outdir ./out --external lodash --external react
```

### `naming`

自定义生成的文件名。默认为`./[dir]/[name].[ext]`。

```ts#JavaScript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
  naming: "[dir]/[name].[ext]", // 默认值
})
```

```bash#CLI
$ bun build ./index.tsx --outdir ./out --entry-naming [dir]/[name].[ext]
```

默认情况下，生成的捆绑包的名称基于与入口点相关联的名称。

```txt
.
├── index.tsx
└── out
    └── index.js
```

对于具有多个入口点的情况，生成的文件层次结构将反映入口点的目录结构。

```txt
.
├── index.tsx
└── nested
    └── index.tsx
└── out
    ├── index.js
    └── nested
        └── index.js
```

生成的文件的名称和位置可以使用`naming`字段进行自定义。此字段接受一个模板字符串，用于生成与入口点对应的所有捆绑包的文件名，其中以下标记将替换为其对应的值：

- `[name]` - 入口点文件的名称，不包括扩展名。
- `[ext]` - 生成的捆绑包的扩展名。
- `[hash]` - 捆绑包内容的哈希。
- `[dir]` - 从构建根目录到文件的父目录的相对路径。

例如：

| 标记                | [name]  | [ext] | [hash]     | [dir]            |
| ------------------- | ------- | ----- | ---------- | ---------------- |
| `./index.tsx`       | `index` | `js`  | `a1b2c3d4` | `""`（空字符串） |
| `./nested/entry.ts` | `entry` | `js`  | `c3d4e5f6` | `"nested"`       |

我们可以组合这些标记以创建一个模板字符串。例如，要在生成的捆绑包名称中包含哈希：

```ts#JavaScript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
  naming: 'files/[dir]/[name]-[hash].[ext]',
})
```

```bash#CLI
$ bun build ./index.tsx --outdir ./out --entry-naming [name]-[hash].[ext]
```

这个构建将导致以下文件结构：

```txt
.
├── index.tsx
└── out
    └── files
        └── index-a1b2c3d4.js
```

当为`naming`字段提供一个字符串时，它仅用于与入口点对应的捆绑包。分块和复制的资产的名称不受影响。使用 JavaScript API，可以为每种生成的文件类型指定单独的模板字符串。

```ts#JavaScript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
  naming: {
    // 默认值
    entry: '[dir]/[name].[ext]',
    chunk: '[name]-[hash].[ext]',
    asset: '[name]-[hash].[ext]',
  },
})
```

```bash#CLI
$ bun build ./index.tsx --outdir ./out --entry-naming "[dir]/[name].[ext]" --chunk-naming "[name]-[hash].[ext]" --asset-naming "[name]-[hash].[ext]"
```

以下是文档中除代码部分的内容的翻译：

### `root`

项目的根目录。

如果未指定根目录，它将被计算为所有入口文件的第一个共同祖先。考虑以下文件结构：

```
.
└── pages
  └── index.tsx
  └── settings.tsx
```

我们可以构建`pages`目录中的两个入口点：

```ts#JavaScript
await Bun.build({
  entrypoints: ['./pages/index.tsx', './pages/settings.tsx'],
  outdir: './out',
})
```

```bash#CLI
$ bun build ./pages/index.tsx ./pages/settings.tsx --outdir ./out
```

这将导致以下文件结构：

```
.
└── pages
  └── index.tsx
  └── settings.tsx
└── out
  └── index.js
  └── settings.js
```

由于`pages`目录是入口点文件的第一个共同祖先，因此它被视为项目的根目录。这意味着生成的捆绑包位于`out`目录的顶层；没有`out/pages`目录。

可以通过指定`root`选项来覆盖此行为：

```ts#JavaScript
await Bun.build({
  entrypoints: ['./pages/index.tsx', './pages/settings.tsx'],
  outdir: './out',
  root: '.',
})
```

```bash#CLI
$ bun build ./pages/index.tsx ./pages/settings.tsx --outdir ./out --root .
```

通过将`root`设置为`.`，生成的文件结构将如下所示：

```
.
└── pages
  └── index.tsx
  └── settings.tsx
└── out
  └── pages
    └── index.js
    └── settings.js
```

### `publicPath`

要附加到捆绑代码中的任何导入路径的前缀。

在许多情况下，生成的捆绑包将不包含任何`import`语句。毕竟，捆绑的目标是将所有代码合并到单个文件中。但是，生成的捆绑包可能会包含`import`语句的情况。

- **资源导入** - 当导入未识别的文件类型，例如`*.svg`时，捆绑器将使用[`file`加载器](/docs/bundler/loaders.md#file)来复制文件到`outdir`中。导入将转换为变量。
- **外部模块** - 文件和模块可以标记为[`external`](#external)，在这种情况下，它们不会包含在捆绑包中。相反，`import`语句将保留在最终捆绑包中。
- **分块**。当启用[`splitting`](#splitting)时，捆绑器可能会生成单独的“块”文件，表示在多个入口点之间共享的代码。

在这些情况下，最终捆绑包可能会包含指向其他文件的路径。默认情况下，这些导入是相对的。以下是一个简单资源导入的示例：

```ts#Input
import logo from './logo.svg';
console.log(logo);
```

```ts#Output
// 将logo.svg复制到<outdir>
// 并添加哈希以防止冲突
var logo = './logo-a7305bdef.svg';
console.log(logo);
```

通过设置`publicPath`，将在所有文件路径前添加指定的值。

```ts#JavaScript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
  publicPath: 'https://cdn.example.com/', // 默认为未定义
})
```

输出文件现在将类似于以下内容：

```ts-diff#Output
- var logo = './logo-a7305bdef.svg';
+ var logo = 'https://cdn.example.com/logo-a7305bdef.svg';
```

### `define`

全局标识符的映射，用于在构建时替换。此对象的键是标识符名称，值是将内联的 JSON 字符串。

```ts#JavaScript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
  define: {
    STRING: JSON.stringify("value"),
    "nested.boolean": "true",
  },
})
```

### `loader`

文件扩展名到[内置加载器名称](https://bun.sh/docs/bundler/loaders#built-in-loaders)的映射。这可用于快速自定义某些文件的加载方式。

```ts#JavaScript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
  loader: {
    ".png": "dataurl",
    ".txt": "file",
  },
})
```

## 输出

`Bun.build`函数返回一个`Promise<BuildOutput>`，定义如下：

```ts
interface BuildOutput {
  outputs: BuildArtifact[];
  success: boolean;
  logs: Array<object>; // 详细信息请参阅文档
}

interface BuildArtifact extends Blob {
  kind: "entry-point" | "chunk" | "asset" | "sourcemap";
  path: string;
  loader: Loader;
  hash: string | null;
  sourcemap: BuildArtifact | null;
}
```

`outputs`数组包含构建生成的所有文件。每个构件都实现了`Blob`接口。

这些构件还包含以下属性：

- `kind`: 文件的构建输出类型，包括入口点、代码拆分的“块”、sourcemap 和复制的资源（如图像）。
- `path`: 文件在磁盘上的绝对路径。
- `loader`: 用于解释文件的加载器。
- `hash`: 文件内容的哈希值，对于资源始终定义。
- `sourcemap`: 与此文件对应的 sourcemap 文件，如果生成的话。仅对入口点和代码拆分块定义。

与`BunFile`类似，`BuildArtifact`对象可以直接传递给`new Response()`。

```ts
const build = Bun.build({
  /* */
});

const artifact = build.outputs[0];

// Content-Type 标头会自动设置
return new Response(artifact);
```

Bun 运行时实现了`BuildArtifact`对象的特殊漂亮打印，以便更轻松地进行调试。

### 可执行文件

Bun 支持将 JavaScript/TypeScript 入口点“编译”为独立的可执行文件。这个可执行文件包含 Bun 二进制文件的副本。

```sh
$ bun build ./cli.tsx --outfile mycli --compile
$ ./mycli
```

有关完整文档，请参阅[Bundler > Executables](/docs/bundler/executables.md)。

## 日志和错误

`Bun.build`仅在提供了无效选项时抛出错误。使用`success`属性来确定构建是否成功；`logs`属性将包含其他详细信息。

```ts
const result = await Bun.build({
  entrypoints: ["./index.tsx"],
  outdir: "./out",
});

if (!result.success) {
  console.error("构建失败");
  for (const message of result.logs) {
    // Bun将漂亮地打印消息对象
    console.error(message);
  }
}
```

每个消息都是`BuildMessage`或`ResolveMessage`对象，可用于跟踪构建中发生的问题。

如果要从失败的构建中抛出错误，请考虑将日志传递给`AggregateError`。如果未捕获，Bun 将漂亮地打印包含的消息。

```ts
if (!result.success) {
  throw new AggregateError(result.logs, "构建失败");
}
```

## 参考

以下是 Bun 的主要参考接口：

```ts
interface Bun {
  build(options: BuildOptions): Promise<BuildOutput>;
}

interface BuildOptions {
  entrypoints: string[]; // 必需
  outdir?: string; // 默认: 无写入（仅内存中）
  format?: "esm"; // 以后: "cjs" | "iife"
  target?: "browser" | "bun" | "node"; // "browser"
  splitting?: boolean; // true
  plugins?: BunPlugin[]; // [] // 请参阅https://bun.sh/docs/bundler/plugins
  loader?: { [k in string]: Loader }; // 请参阅https://bun.sh/docs/bundler/loaders
  manifest?: boolean; // false
  external?: string[]; // []
  sourcemap?: "none" | "inline" | "external"; // "none"
  root?: string; // 从入口点计算
  naming?:
    | string
    | {
        entry?: string; // '[dir]/[name].[ext]'
        chunk?: string; // '[name]-[hash].[ext]'
        asset?: string; // '[name]-[hash].[ext]'
      };
  publicPath?: string; // 例如http://mydomain.com/
  minify?:
    | boolean // false
    | {
        identifiers?: boolean;
        whitespace?: boolean;
        syntax?: boolean;
      };
}

interface BuildOutput {
  outputs: BuildArtifact[];
  success: boolean;
  logs: Array<BuildMessage | ResolveMessage>;
}

interface BuildArtifact extends Blob {
  path: string;
  loader: Loader;
  hash?: string;
  kind: "entry-point" | "chunk" | "asset" | "sourcemap";
  sourcemap?: BuildArtifact;
}

type Loader =
  | "js"
  | "jsx"
  | "ts"
  | "tsx"
  | "json"
  | "toml"
  | "file"
  | "napi"
  | "wasm

"
  | "text";

interface BuildOutput {
  outputs: BuildArtifact[];
  success: boolean;
  logs: Array<BuildMessage | ResolveMessage>;
}

declare class ResolveMessage {
  readonly name: "ResolveMessage";
  readonly position: Position | null;
  readonly code: string;
  readonly message: string;
  readonly referrer: string;
  readonly specifier: string;
  readonly importKind:
    | "entry_point"
    | "stmt"
    | "require"
    | "import"
    | "dynamic"
    | "require_resolve"
    | "at"
    | "at_conditional"
    | "url"
    | "internal";
  readonly level: "error" | "warning" | "info" | "debug" | "verbose";

  toString(): string;
}
```
