Bun 支持 `.jsx` 和 `.tsx` 文件。Bun 的内部转译器会在执行之前将 JSX 语法转换为普通的 JavaScript。

```tsx#react.tsx
function Component(props: {message: string}) {
  return (
    <body>
      <h1 style={{color: 'red'}}>{props.message}</h1>
    </body>
  );
}

console.log(<Component message="Hello world!" />);
```

## 配置

Bun 会读取您的 `tsconfig.json` 或 `jsconfig.json` 配置文件，以确定如何在内部执行 JSX 转换。为了避免使用这两者之一，以下选项也可以在 [`bunfig.toml`](/docs/runtime/configuration.md) 中定义。

以下编译器选项受到尊重。

### [`jsx`](https://www.typescriptlang.org/tsconfig#jsx)

JSX 构造如何在内部转换为普通 JavaScript。下表列出了 `jsx` 的可能值，以及以下简单 JSX 组件的转译：

```tsx
<Box width={5}>Hello</Box>
```

| 编译器选项                        | 转译输出                                                                                                                                                                                                                                                                                         |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `json { "jsx": "react" } `        | `tsx import { createElement } from "react"; createElement("Box", { width: 5 }, "Hello"); `                                                                                                                                                                                                       |
| `json { "jsx": "react-jsx" } `    | `tsx import { jsx } from "react/jsx-runtime"; jsx("Box", { width: 5 }, "Hello"); `                                                                                                                                                                                                               |
| `json { "jsx": "react-jsxdev" } ` | `tsx import { jsxDEV } from "react/jsx-dev-runtime"; jsxDEV("Box", { width: 5, children: "Hello" }, undefined, false, undefined, this); ` `jsxDEV` 变量名是 React 使用的约定。 `DEV` 后缀是一种可见的方式，表示该代码用于开发中使用。开发版本的 React 速度较慢，包括额外的有效性检查和调试工具。 |
| `json { "jsx": "preserve" } `     | `tsx // JSX不会转译 // Bun当前不支持 "preserve" <Box width={5}>Hello</Box> `                                                                                                                                                                                                                     |

### [`jsxFactory`](https://www.typescriptlang.org/tsconfig#jsxFactory)

> **注意** — 仅当 `jsx` 为 `react` 时适用。

用于表示 JSX 构造的函数名称。默认值为 `"createElement"`。对于使用不同函数名称（如 `"h"`）的库（例如 [Preact](https://preactjs.com/)）很有用。

| 编译器选项                                    | 转译输出                                                           |
| --------------------------------------------- | ------------------------------------------------------------------ |
| `json { "jsx": "react", "jsxFactory": "h" } ` | `tsx import { h } from "react"; h("Box", { width: 5 }, "Hello"); ` |

### [`jsxFragmentFactory`](https://www.typescriptlang.org/tsconfig#jsxFragmentFactory)

> **注意** — 仅当 `jsx` 为 `react` 时适用。

用于表示 [JSX fragments](https://react.dev/reference/react/Fragment)（例如 `<>Hello</>`）的函数名称；仅当 `jsx` 为 `react` 时适用。默认值为 `"Fragment"`。

| 编译器选项                                                                            | 转译输出                                                                                                        |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `json { "jsx": "react", "jsxFactory": "myjsx", "jsxFragmentFactory": "MyFragment" } ` | `tsx // 输入 <>Hello</>; // 输出 import { myjsx, MyFragment } from "react"; myjsx(MyFragment, null, "Hello"); ` |

### [`jsxImportSource`](https://www.typescriptlang.org/tsconfig#jsxImportSource)

> **注意** — 仅当 `jsx` 为 `react-jsx` 或 `react-jsxdev` 时适用。

用于导入组件工厂函数（`createElement`、`jsx`、`jsxDEV` 等）的模块。默认值为 `"react"`。通常在使用类似 Preact 的组件库时需要指定此值。

| 编译器选项                                                               | 转译输出                                                                                                                                                              |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `jsonc { "jsx": "react" /* jsxImportSource 未定义，默认为 "react" */ } ` | `tsx import { jsx } from "react/jsx-runtime"; jsx("Box", { width: 5, children: "Hello" }); `                                                                          |
| `jsonc { "jsx": "react-jsx", "jsxImportSource": "preact" } `             | `tsx import { jsx } from "preact/jsx-runtime"; jsx("Box", { width: 5, children: "Hello" }); `                                                                         |
| `jsonc { "jsx": "react-jsxdev", "jsxImportSource": "preact" } `          | `tsx // /jsx-runtime 自动附加 import { jsxDEV } from "preact/jsx-dev-runtime"; jsxDEV( "Box", { width: 5, children: "Hello" }, undefined, false, undefined, this ); ` |

### JSX pragma

所有这些值都可以在每个文件的基础上使用 _pragmas_ 设置。Pragma 是一个特殊的注释，用于在特定文件中设置编译器选项。

| Pragma                           | 等效配置                                        |
| -------------------------------- | ----------------------------------------------- |
| `ts // @jsx h `                  | `jsonc { "jsxFactory": "h" } `                  |
| `ts // @jsxFrag MyFragment `     | `jsonc { "jsxFragmentFactory": "MyFragment" } ` |
| `ts // @jsxImportSource preact ` | `jsonc { "jsxImportSource": "preact" } `        |

## 日志

Bun 为 JSX 实现了特殊的日志记录，以便更容易进行调试。给定以下文件：

```tsx#index.tsx
import { Stack, UserCard } from "./components";

console.log(
  <Stack>
    <UserCard name="Dom" bio="Street racer and Corona lover" />
    <UserCard name="Jakob" bio="Super spy and Dom's secret brother" />
  </Stack>
);
```

当日志记录时，Bun 会美化打印组件树：

<image src="https://github.com/oven-sh/bun/assets/3084745/d29db51d-6837-44e2-b8be-84fc1b9e9d97" />

## Prop punning

Bun 运行时还支持 JSX 的 "prop punning"。这是一种为具有相同名称的属性分配变量的简写语法。

```tsx
function Div(props: {className: string;}) {
  const {className} = props;

  // without punning
  return <div className={className} />;
  // with punning
  return <div {className} />;
}
```
