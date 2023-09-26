---
outline: "deep"
---

# File types

## TypeScript

Bun 原生支持 TypeScript，无需任何额外设置。所有文件在执行之前都会被 Bun 的本地快速转译器即时转译。与其他构建工具类似，Bun 不执行类型检查，仅从文件中删除类型注释。

```bash
$ bun index.js
$ bun index.jsx
$ bun index.ts
$ bun index.tsx
```

Bun 的运行时行为的某些方面受到您的 `tsconfig.json` 文件的内容影响。有关详细信息，请参阅[运行时 > TypeScript](/runtime/typescript.md)页面。

## JSX

Bun 原生支持 `.jsx` 和 `.tsx` 文件，Bun 的内部转译器会在执行之前将 JSX 语法转换为普通的 JavaScript。

```tsx
#react.tsx
function Component(props: {message: string}) {
  return (
    <body>
      <h1 style={{color: 'red'}}>{props.message}</h1>
    </body>
  );
}

console.log(<Component message="Hello world!" />);
```

Bun 对 JSX 实现了特殊的日志记录，以便更容易进行调试。

```bash
$ bun run react.tsx
<Component message="Hello world!" />
```

## 文本文件

文本文件可以作为字符串导入。

<codetabs>

```ts
#index.ts
import text from "./text.txt";
console.log(text);
// => "Hello world!"
```

```txt
#text.txt
Hello world!
```

</codetabs>

## JSON 和 TOML

JSON 和 TOML 文件可以直接从源文件导入。文件内容将加载并返回为 JavaScript 对象。

```ts
import pkg from "./package.json";
import data from "./data.toml";
```

## WASM

> 🚧 **实验性功能**

Bun 对 WASI（WebAssembly System Interface）有实验性支持。要使用 Bun 运行 `.wasm` 二进制文件，请执行以下操作：

```bash
$ bun ./my-wasm-app.wasm
# 如果文件名不以 ".wasm" 结尾
$ bun run ./my-wasm-app.whatever
```

> **注意** — WASI 支持基于 [wasi-js](https://github.com/sagemathinc/cowasm/tree/main/core/wasi-js)。目前，它仅支持使用 `wasi_snapshot_preview1` 或 `wasi_unstable` API 的 WASI 二进制文件。Bun 的实现尚未完全针对性能进行优化；随着 WASM 的普及，这将成为更重要的优化目标。

## 自定义加载器

可以使用插件实现对附加文件类型的支持。有关完整文档，请参阅[运行时 > 插件](/bundler/plugins.md)。
