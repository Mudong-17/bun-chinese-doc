## TypeScript

Bun 将 TypeScript 视为一等公民。

## 运行 `.ts` 文件

Bun 可以直接执行 `.ts` 和 `.tsx` 文件，就像执行普通 JavaScript 一样，无需额外配置。如果您导入 `.ts` 或 `.tsx` 文件（或导出这些文件的 `npm` 模块），Bun 会在内部将其转译为 JavaScript 然后执行文件。

**注意** — 与其他构建工具类似，Bun 不会对文件进行类型检查。如果要捕获静态类型错误，可以使用[`tsc`](https://www.typescriptlang.org/docs/handbook/compiler-options.html)（官方 TypeScript CLI）。

{% callout %}

**是否仍然需要转译？** — 由于 Bun 可以直接执行 TypeScript，您可能不需要将 TypeScript 转译以在生产环境中运行。Bun 会在执行的每个文件（包括 `.js` 和 `.ts`）时进行内部转译，因此直接执行 `.ts/.tsx` 源文件的额外开销可以忽略不计。

但是，如果您将 Bun 用作开发工具，但在生产环境中仍以 Node.js 或浏览器为目标，那么您仍然需要进行转译。

{% /callout %}

## 配置 `tsconfig.json`

Bun 支持一些 TypeScript 默认不支持的功能，例如扩展导入、顶级等待和 `exports` 条件。它还实现了全局 API，如 `Bun`。要启用这些功能，必须正确配置您的 `tsconfig.json`。

{% callout %}
如果您使用 `bun init` 初始化项目，则一切都已正确配置。
{% /callout %}

要开始，请安装 `bun-types` 包。

```sh
$ bun add -d bun-types # dev 依赖
```

如果您使用的是 Bun 的 canary 版本，请使用 `canary` 标签。canary 包会在 `main` 分支的每次提交时更新。

```sh
$ bun add -d bun-types@canary
```

<!-- ### 快速设置

{% callout %}

**注意** — 这种方法需要TypeScript 5.0或更高版本！

{% /callout %}

将以下内容添加到您的 `tsconfig.json`。

```json-diff
  {
+   "extends": ["bun-types"]
    // 其他选项...
  }
```

{% callout %}
**注意** — `tsconfig.json` 中的 `"extends"` 字段可以接受一个值数组。如果已经使用了 `"extends"`，只需将 `"bun-types"` 添加到数组中即可。
{% /callout %}

就是这样！您应该能够使用Bun的全部功能集，而不会看到任何TypeScript编译器错误。

### 手动设置 -->

### 推荐的 `compilerOptions`

以下是 Bun 项目的推荐 `compilerOptions`。

```jsonc
{
  "compilerOptions": {
    // 添加Bun类型定义
    "types": ["bun-types"],

    // 启用最新功能
    "lib": ["esnext"],
    "module": "esnext",
    "target": "esnext",

    // 如果使用TS 5.x+
    "moduleResolution": "bundler",
    "noEmit": true,
    "allowImportingTsExtensions": true,
    "moduleDetection": "force",
    // 如果使用TS 4.x或更早版本
    "moduleResolution": "nodenext",

    "jsx": "react-jsx", // 支持JSX
    "allowJs": true, // 允许从 `.ts` 导入 `.js`
    "esModuleInterop": true, // 允许CommonJS模块的默认导入

    // 最佳实践
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  }
}
```

### 添加 DOM 类型

设置 `"types": ["bun-types"]` 意味着 TypeScript 将忽略其他全局类型定义，包括 `lib: ["dom"]`。要将 DOM 类型添加到您的项目中，请在项目中的任何 TypeScript 文件的顶部添加以下[三斜杠指令](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html)。

```ts
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
```

对于其他全局类型定义，如 `webworker`，也适用相同的规则。

## 路径映射

在解析模块时

，Bun 的运行时会尊重 `tsconfig.json` 中定义的 [`compilerOptions.paths`](https://www.typescriptlang.org/tsconfig#paths)。没有其他运行时会这样做。

假设以下 `tsconfig.json`...

```json
{
  "compilerOptions": {
    "paths": {
      "data": ["./data.ts"]
    }
  }
}
```

...从 `"data"` 导入将按预期工作。

{% codetabs %}

```ts#index.ts
import { foo } from "data";
console.log(foo); // => "Hello world!"
```

```ts#data.ts
export const foo = "Hello world!"
```

{% /codetabs %}
