Bun 通过`Bun.Transpiler`类公开其内部的转译器。要创建 Bun 的转译器实例：

```ts
const transpiler = new Bun.Transpiler({
  loader: "tsx", // "js | "jsx" | "ts" | "tsx"
});
```

## `.transformSync()`

使用`.transformSync()`方法同步转译代码。模块不会被解析，代码不会被执行。结果是一串普通的 JavaScript 代码字符串。

<!--它是同步的，运行在与其他JavaScript代码相同的线程中。-->

<codetabs>

```js#示例
const transpiler = new Bun.Transpiler({
  loader: 'tsx',
});

const code = `
import * as whatever from "./whatever.ts"
export function Home(props: {title: string}){
  return <p>{props.title}</p>;
}`;

const result = transpiler.transformSync(code);
```

```js#结果
import { __require as require } from "bun:wrap";
import * as JSX from "react/jsx-dev-runtime";
var jsx = require(JSX).jsxDEV;

export default jsx(
  "div",
  {
    children: "hi!",
  },
  undefined,
  false,
  undefined,
  this,
);
```

</codetabs>

要覆盖`new Bun.Transpiler()`构造函数中指定的默认加载程序，请将第二个参数传递给`.transformSync()`。

```ts
await transpiler.transform("<div>hi!</div>", "tsx");
```

<details>
<summary>详细信息</summary>
当调用`.transformSync`时，转译器在与当前执行的代码相同的线程中运行。

如果使用了宏（macro），它将在与转译器相同的线程中运行，但在应用程序的其余部分的事件循环中运行在一个单独的事件循环中。目前，宏和常规代码之间共享全局变量，这意味着可以（但不建议）在宏和常规代码之间共享状态。在宏之外尝试使用 AST 节点是未定义的行为。

</details>

## `.transform()`

`transform()`方法是`.transformSync()`的异步版本，返回一个`Promise<string>`。

```js
const transpiler = new Bun.Transpiler({ loader: "jsx" });
const result = await transpiler.transform("<div>hi!</div>");
console.log(result);
```

除非您要转译*许多*大文件，否则应该使用`Bun.Transpiler.transformSync`。线程池的成本通常会比实际转译代码花费的时间更长。

```ts
await transpiler.transform("<div>hi!</div>", "tsx");
```

<details>
<summary>详细信息</summary>
`.transform()`方法在Bun的工作线程池中运行转译器，因此如果运行100次，它将在`Math.floor($cpu_count * 0.8)`个线程上运行，而不会阻塞主JavaScript线程。

如果您的代码使用了宏，它将在新线程中潜在地生成 Bun 的 JavaScript 运行时环境的新副本。

</details>

## `.scan()`

`Transpiler`实例还可以扫描一些源代码并返回其导入和导出的列表，以及有关每个导入的其他元数据。它会忽略类型仅导入（[Type-only](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export)）。

<codetabs>

```ts#示例
const transpiler = new Bun.Transpiler({
  loader: 'tsx',
});

const code = `
import React from 'react';
import type {ReactNode} from 'react';
const val = require('./cjs.js')
import('./loader');

export const name = "hello";
`;

const result = transpiler.scan(code);
```

```json#输出
{
  "exports": [
    "name"
  ],
  "imports": [
    {
      "kind": "import-statement",
      "path": "react"
    },
    {
      "kind": "import-statement",
      "path": "remix"
    },
    {
      "kind": "dynamic-import",
      "path": "./loader"
    }
  ]
}
```

</codetabs>

`imports`数组中的每个导入都有一个`path`和`kind`。Bun 将导入分类为以下种类：

- `import-statement`：JavaScript 中的`import foo from 'bar'`
- `require-call`：JavaScript 中的`const val = require('./cjs.js')`
- `require-resolve`：JavaScript 中的`require.resolve('./cjs.js')`
- `dynamic-import`：JavaScript 中的动态`import()`
- `import-rule`：CSS 中的`@import()`
- `url-token`：CSS 中的`url()`
<!-- - `internal`：Bun注入的导入 `import {foo} from 'bun:internal'`
- `entry-point`：入口点（不常见） `import {foo} from 'bun:entry'` -->

## `.scanImports()`

对于性能敏感的代码，可以使用`.scanImports()`方法获取导入列表。它比`.scan()`更快（尤其是对于大文件），但由于一些性能优化，精度稍微降低。

<codetabs>

```ts#示例
const transpiler = new Bun.Transpiler({
  loader: 'tsx',
});

const code = `
import React from 'react';
import type {ReactNode} from 'react';
const val = require('./cjs.js')
import('./loader');

export const name = "hello";
`;



const result = transpiler.scanImports(code);
```

```json#结果
[
  {
    kind: "import-statement",
    path: "react"
  }, {
    kind: "require-call",
    path: "./cjs.js"
  }, {
    kind: "dynamic-import",
    path: "./loader"
  }
]
```

</codetabs>

## 参考

```ts
type Loader = "jsx" | "js" | "ts" | "tsx";

interface TranspilerOptions {
  // 用值替换键。值必须是JSON字符串。
  // { "process.env.NODE_ENV": "\"production\"" }
  define?: Record<string, string>,

  // 此转译器的默认加载程序
  loader?: Loader,

  // 默认的目标平台
  // 这会影响导入和/或require的使用方式
  target?: "browser" | "bun" | "node",

  // 指定一个tsconfig.json文件，作为字符串化的JSON或对象
  // 使用它来设置自定义的JSX工厂、片段或导入源
  // 例如，如果您想使用Preact而不是React。或者如果您想使用Emotion。
  tsconfig?: string | TSConfig,

  // 将导入替换为宏
  macro?: MacroMap,

  // 指定要消除的一组导出
  // 或重命名某些导出
  exports?: {
      eliminate?: string[];
      replace?: Record<string, string>;
  },

  // 是否从转译后的文件中删除未使用的导入
  // 默认：false
  trimUnusedImports?: boolean,

  // 是否启用一组JSX优化
  // jsxOptimizationInline ...,

  // 实验性的空格最小化
  minifyWhitespace?: boolean,

  // 是否内联常量值
  // 通常可以提高性能并减小包大小
  // 默认：true
  inline?: boolean,
}

// 将导入路径映射到宏
interface MacroMap {
  // {
  //   "react-relay": {
  //     "graphql": "bun-macro-relay/bun-macro-relay.tsx"
  //   }
  // }
  [packagePath: string]: {
    [importItemName: string]: string,
  },
}

class Bun.Transpiler {
  constructor(options: TranspilerOptions)

  transform(code: string, loader?: Loader): Promise<string>
  transformSync(code: string, loader?: Loader): string

  scan(code: string): {exports: string[], imports: Import}
  scanImports(code: string): Import[]
}

type Import = {
  path: string,
  kind:
  // JavaScript中的import foo from 'bar';
  | "import-statement"
  // JavaScript中的require("foo")
  | "require-call"
  // JavaScript中的require.resolve("foo")
  | "require-resolve"
  // JavaScript中的动态import()
  | "dynamic-import"
  // CSS中的@import()
  | "import-rule"
  // CSS中的url()
  | "url-token"
  // Bun注入的导入
  | "internal" 
  // 入口点（不常见）
  | "entry-point"
}

const transpiler = new Bun.Transpiler({ loader: "jsx" });
```
