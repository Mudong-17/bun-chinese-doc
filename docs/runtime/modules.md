JavaScript 中的模块解析是一个复杂的主题。

当前，生态系统正处于从 CommonJS 模块向本机 ES 模块的多年过渡期中。TypeScript 强制执行其自己的关于导入扩展的规则，这些规则与 ESM 不兼容。不同的构建工具通过不兼容的不同机制支持路径重映射。

Bun 旨在提供一个一致且可预测的模块解析系统，只需正常工作。不幸的是，它仍然相当复杂。

## 语法

考虑以下文件。

```ts#index.ts
import { hello } from "./hello";

hello();
```

```ts#hello.ts
export function hello() {
  console.log("Hello world!");
}
```

当我们运行`index.ts`时，它会打印"Hello world"。

```bash
$ bun index.ts
Hello world!
```

在这种情况下，我们从`./hello`导入，这是一个没有扩展名的相对路径。**扩展名导入是可选的但受支持的。**为了解决这个导入，Bun 将按照以下顺序检查以下文件：

- `./hello.ts`
- `./hello.tsx`
- `./hello.js`
- `./hello.mjs`
- `./hello.cjs`
- `./hello/index.ts`
- `./hello/index.js`
- `./hello/index.json`
- `./hello/index.mjs`

导入路径不区分大小写，这意味着这些都是有效的导入：

```ts#index.ts
import { hello } from "./hello"; // 这些都是有效的
import { hello } from "./HELLO";
import { hello } from "./hElLo";
```

导入路径还可以选择包含扩展名。如果指定了扩展名，Bun 将仅查找具有该确切扩展名的文件。

```ts#index.ts
import { hello } from "./hello";
import { hello } from "./hello.ts"; // 这个也有效
```

如果你从`"*.js{x}"`导入，Bun 还会额外检查是否存在匹配的`*.ts{x}`文件，以与 TypeScript 的[ES 模块支持](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#new-file-extensions)兼容。

```ts#index.ts
import { hello } from "./hello";
import { hello } from "./hello.ts"; // 这个也有效
import { hello } from "./hello.js"; // 这也有效
```

Bun 支持 ES 模块（`import`/`export`语法）和 CommonJS 模块（`require()`/`module.exports`）两种模块系统。下面的 CommonJS 版本在 Bun 中也可以工作。

```ts#index.js
const { hello } = require("./hello");

hello();
```

```ts#hello.js
function hello() {
  console.log("Hello world!");
}

exports.hello = hello;
```

不过，对于新项目，不建议使用 CommonJS。

## 模块系统

Bun 原生支持 CommonJS 和 ES 模块。ES 模块是新项目的推荐模块格式，但 Node.js 生态系统中仍广泛使用 CommonJS 模块。

在 Bun 的 JavaScript 运行时中，`require`可以被 ES 模块和 CommonJS 模块同时使用。如果目标模块是 ES 模块，`require`会返回模块命名空间对象（相当于`import * as`）。如果目标模块是 CommonJS 模块，`require`会返回`module.exports`对象（与 Node.js 中的用法相同）。

| 模块类型 | `require()`    | `import * as`                                               |
| -------- | -------------- | ----------------------------------------------------------- |
| ES 模块  | 模块命名空间   | 模块命名空间                                                |
| CommonJS | module.exports | `default`是`module.exports`，`module.exports`的键是具名导出 |

### 使用`require()`

你可以`require()`任何文件或包，甚至是`.ts`或`.mjs`文件。

```ts
const { foo } = require("./foo"); // 扩展名是可选的
const { bar } = require("./bar.mjs");
const { baz } = require("./baz.tsx");
```

<details>
<summary>什么是CommonJS模块?</summary>
在 2016 年，ECMAScript 添加了对[ES 模块](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)的支持。ES 模块是 JavaScript 模块的标准。然而，数百万的 npm 包仍然使用 CommonJS 模块。

CommonJS 模块是使用`module.exports`导出值的模块。通常，使用`require`来导入 CommonJS 模块。

```ts
// my-commonjs.cjs
const stuff = require("./stuff");
module.exports = { stuff };
```

CommonJS 模块与 ES 模块的最大区别在于，CommonJS 模块是同步的，而 ES 模块是异步的。还有其他的区别。

- ES 模块支持顶级的`await`，而 CommonJS 模块不支持。
- ES 模块始终处于[严格模式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)，而 CommonJS 模块不是。
- 浏览器不原生支持 CommonJS 模块，但通过`<script type="module">`可以原生支持 ES 模块。
- CommonJS 模块不是静态可分析的，而 ES 模块只允许静态导入和导出。

</details>

### 使用`import`

你可以`import`任何文件或包，甚至是`.cjs`文件。

```ts
const { foo } = require("./foo"); // 扩展名是可选的
const { bar } = require("./bar.mjs");
const { baz } = require("./my-typescript.tsx");
```

### 同时使用`import`和`require()`

在 Bun 中，你可以在同一文件中同时使用`import`或`require`，它们都可以正常工作。

```ts
import { stuff } from "./

my-commonjs.cjs";
import Stuff from "./my-commonjs.cjs";
const myStuff = require("./my-commonjs.cjs");
```

### 顶级`await`

唯一的例外是顶级`await`。你不能`require()`一个使用顶级`await`的文件，因为`require()`函数是同步的。

幸运的是，很少有库使用顶级`await`，所以这很少是一个问题。但如果你的应用代码中使用了顶级`await`，请确保该文件不会从应用程序的其他地方`require()`。相反，你应该使用`import`或[dynamic `import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)。

## 导入包

Bun 实现了 Node.js 模块解析算法，因此你可以使用裸标识符从`node_modules`导入包。

```ts
import { stuff } from "foo";
```

完整的算法规范在[Node.js 文档](https://nodejs.org/api/modules.html)中有官方文档；我们不会在这里重复。简单来说：如果你从`"foo"`导入，Bun 会扫描文件系统以查找包含包`foo`的`node_modules`目录。

一旦找到`foo`包，Bun 会读取`package.json`以确定应该如何导入包。为了确定包的入口点，Bun 首先读取`exports`字段，并检查以下条件：

```jsonc#package.json
{
  "name": "foo",
  "exports": {
    "bun": "./index.js",
    "worker": "./index.js",
    "node": "./index.js",
    "require": "./index.js", // 如果导入者是CommonJS
    "import": "./index.mjs", // 如果导入者是ES模块
    "default": "./index.js",
  }
}
```

在`package.json`中首先出现的这些条件中的任何一个都将用于确定包的入口点。

Bun 支持子路径[`"exports"`](https://nodejs.org/api/packages.html#subpath-exports)和[`"imports"`](https://nodejs.org/api/packages.html#imports)。在`"exports"`映射中指定任何子路径将阻止其他子路径被导入。

```jsonc#package.json
{
  "name": "foo",
  "exports": {
    ".": "./index.js",
    "./package.json": "./package.json" // 子路径
  }
}
```

> **发布 TypeScript** — 请注意，Bun 支持特殊的`"bun"`导出条件。如果你的库是用 TypeScript 编写的，你可以直接将（未经转译的）TypeScript 文件发布到 npm。如果在`"bun"`条件中指定了你的包的`*.ts`入口点，Bun 将直接导入和执行你的 TypeScript 源文件。

如果未定义`exports`，Bun 会回退到`"module"`（仅适用于 ESM 导入）然后是[`"main"`](https://nodejs.org/api/packages.html#main)。

```json#package.json
{
  "name": "foo",
  "module": "./index.js",
  "main": "./index.js"
}
```

## 路径重映射

为了将 TypeScript 视为一流公民，Bun 运行时会根据`tsconfig.json`中的[`compilerOptions.paths`](https://www.typescriptlang.org/tsconfig#paths)字段重新映射导入路径。这与 Node.js 不支持任何形式的导入路径重映射存在重大分歧。

```jsonc#tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "config": ["./config.ts"],         // 将标识符映射到文件
      "components/*": ["components/*"],  // 通配符匹配
    }
  }
}
```

如果你不是 TypeScript 用户，可以在项目根目录创建一个[`jsconfig.json`](https://code.visualstudio.com/docs/languages/jsconfig)以实现相同的行为。

Bun 的 JavaScript 运行时原生支持 CommonJS。当 Bun 的 JavaScript 编译器检测到`module.exports`的使用时，它会将文件视为 CommonJS。然后，模块加载器会将已编译的模块包装在以下形式的函数中：

```js
(function (module, exports, require) {
  // 已编译的模块
})(module, exports, require);
```

`module`、`exports`和`require`与 Node.js 中的`module`、`exports`和`require`非常相似。它们是通过 C++中的[`with scope`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/with)赋值的。内部的`Map`存储了`exports`对象，以处理模块在完全加载之前的循环`require`调用。

一旦成功评估了 CommonJS 模块，就会创建一个合成模块记录，其`default` ES 模块[导出集设置为`module.exports`](https://github.com/oven-sh/bun/blob/9b6913e1a674ceb7f670f917fc355bb8758c6c72/src/bun.js/bindings/CommonJSModuleRecord.cpp#L212-L213)，`module.exports`对象的键会重新导出为具名导出（如果`module.exports`对象是对象）。

在使用 Bun 的捆绑器时，情况会有所不同。捆绑器将 CommonJS 模块包装在一个`require_${moduleName}`函数中，该函数返回`module.exports`对象。
