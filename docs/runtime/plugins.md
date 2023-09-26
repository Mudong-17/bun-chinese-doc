Bun 提供了一个通用的插件 API，可以用于扩展运行时和打包器（bundler）。

插件会拦截导入并执行自定义加载逻辑：读取文件、转译代码等。它们可以用于添加对其他文件类型的支持，比如`.scss`或`.yaml`。在 Bun 的打包器上下文中，插件可以用于实现框架级别的功能，比如 CSS 提取、宏以及客户端-服务器代码共存。

## 用法

插件被定义为一个简单的 JavaScript 对象，包含一个`name`属性和一个`setup`函数。使用`plugin`函数将插件注册到 Bun 中。

```tsx#myPlugin.ts
import { plugin, type BunPlugin } from "bun";

const myPlugin: BunPlugin = {
  name: "Custom loader",
  setup(build) {
    // implementation
  },
};
```

插件必须在任何其他代码运行之前注册！为了实现这一点，在您的[`bunfig.toml`](/docs/runtime/configuration.md)中使用`preload`选项。Bun 会在运行文件之前自动加载`preload`中指定的文件/模块。

```toml
preload = ["./myPlugin.ts"]
```

要在`bun test`之前预加载文件：

```toml
[test]
preload = ["./myPlugin.ts"]
```

## 第三方插件

按照约定，供外部使用的第三方插件应导出一个工厂函数，该函数接受一些配置并返回一个插件对象。

```ts
import { plugin } from "bun";
import fooPlugin from "bun-plugin-foo";

plugin(
  fooPlugin({
    // 配置
  })
);
```

Bun 的插件 API 基于[esbuild](https://esbuild.github.io/plugins)构建。虽然只实现了[esbuild API](/docs/bundler/vs-esbuild#plugin-api)的一部分，但某些 esbuild 插件在 Bun 中可以直接使用，比如官方的[MDX loader](https://mdxjs.com/packages/esbuild/)：

```jsx
import { plugin } from "bun";
import mdx from "@mdx-js/esbuild";

plugin(mdx());
```

## 加载器

插件主要用于通过扩展 Bun 添加对其他文件类型的加载器。让我们看一个实现`.yaml`文件加载器的简单插件示例。

```ts#yamlPlugin.ts
import { plugin } from "bun";

plugin({
  name: "YAML",
  async setup(build) {
    const { load } = await import("js-yaml");
    const { readFileSync } = await import("fs");

    // 当导入一个 .yaml 文件时...
    build.onLoad({ filter: /\.(yaml|yml)$/ }, (args) => {

      // 读取并解析文件
      const text = readFileSync(args.path, "utf8");
      const exports = load(text) as Record<string, any>;

      // 并将其作为模块返回
      return {
        exports,
        loader: "object", // 用于 JS 对象的特殊加载器
      };
    });
  },
});
```

使用这个插件，可以直接从`.yaml`文件中导入数据。

<codetabs>

```ts#index.ts
import "./yamlPlugin.ts"
import {name, releaseYear} from "./data.yml"

console.log(name, releaseYear);
```

```yaml#data.yml
name: Fast X
releaseYear: 2023
```

</codetabs>

请注意，返回的对象具有一个`loader`属性。这告诉 Bun 应使用其内部加载器之一来处理结果。即使我们正在实现一个`.yaml`的加载器，结果仍然必须能够被 Bun 内置加载器之一理解。在这个案例中，我们使用了`"object"`，这是一个内置加载器（供插件使用），它将普通的 JavaScript 对象转换为等效的 ES 模块。Bun 支持所有内置加载器；这些相同的加载器由 Bun 在内部用于处理各种文件。下面的表格是一个快速参考；完整文档请参阅 [Bundler > Loaders](/docs/bundler/loaders.md)。

| 加载器   | 扩展名              | 输出                                                                                                       |
| -------- | ------------------- | ---------------------------------------------------------------------------------------------------------- |
| `js`     | `.mjs` `.cjs`       | 转译为 JavaScript 文件                                                                                     |
| `jsx`    | `.js` `.jsx`        | 转换 JSX 然后转译                                                                                          |
| `ts`     | `.ts` `.mts` `.cts` | 转换 TypeScript 然后转译                                                                                   |
| `tsx`    | `.tsx`              | 转换 TypeScript、JSX，然后转译                                                                             |
| `toml`   | `.toml`             | 使用 Bun 内置的 TOML 解析器解析                                                                            |
| `json`   | `.json`             | 使用 Bun 内置的 JSON 解析器解析                                                                            |
| `napi`   | `.node`             | 导入本机 Node.js 插件                                                                                      |
| `wasm`   | `.wasm`             | 导入本机 Node.js 插件                                                                                      |
| `object` | _无_                | 一个专用于插件的特殊加载器，将普通的 JavaScript 对象转换为等效的 ES 模块。对象中的每个键对应一个命名导出。 |

加载一个 YAML 文件是有用的，但插件支持的不仅仅是数据加载。让我们看一个允许 Bun 导入`*.svelte`文件的插件示例。

```ts#sveltePlugin.ts
import { plugin } from "bun";

plugin({
  name: "svelte loader",
  async setup(build) {
    const { compile } = await import("svelte/compiler");
    const { readFileSync } = await import("fs");

    // 当导入一个 .svelte 文件时...
    build.onLoad({ filter: /\.svelte$/ }, ({ path }) => {

      // 读取并使用Svelte编译器编译它
      const file = readFileSync(path, "utf8");
      const contents = compile(file, {
        filename: path,
        generate: "ssr",
      }).js.code;

      // 并将编译后的源代码作

为 "js" 返回
      return {
        contents,
        loader: "js",
      };
    });
  },
});
```

> 注意：在实际实现中，您需要缓存编译的输出并包含额外的错误处理。

从`build.onLoad`返回的对象包含了`contents`中的编译后源代码，并指定了`"js"`作为其加载器。这告诉 Bun 要考虑返回的`contents`作为 JavaScript 模块，并使用 Bun 内置的`js`加载器进行转译。

使用这个插件，现在可以直接导入和使用 Svelte 组件。

```js
import "./sveltePlugin.ts";
import MySvelteComponent from "./component.svelte";

console.log(mySvelteComponent.render());
```

## 读取配置

插件可以通过`build.config`读取和写入[构建配置](/docs/bundler/index.md#api)。

```ts
Bun.build({
  entrypoints: ["./app.ts"],
  outdir: "./dist",
  sourcemap: "external",
  plugins: [
    {
      name: "demo",
      setup(build) {
        console.log(build.config.sourcemap); // "external"

        build.config.minify = true; // 启用压缩

        // `plugins` 是只读的
        console.log(`Number of plugins: ${build.config.plugins.length}`);
      },
    },
  ],
});
```

## 参考

```ts
namespace Bun {
  function plugin(plugin: {
    name: string;
    setup: (build: PluginBuilder) => void;
  }): void;
}

type PluginBuilder = {
  onResolve: (
    args: { filter: RegExp; namespace?: string },
    callback: (args: { path: string; importer: string }) => {
      path: string;
      namespace?: string;
    } | void
  ) => void;
  onLoad: (
    args: { filter: RegExp; namespace?: string },
    callback: (args: { path: string }) => {
      loader?: Loader;
      contents?: string;
      exports?: Record<string, any>;
    }
  ) => void;
  config: BuildConfig;
};

type Loader = "js" | "jsx" | "ts" | "tsx" | "json" | "toml" | "object";
```

`onLoad`方法还可以接受一个`namespace`，除了`filter`正则表达式。这个命名空间将被用于在转译代码中添加前缀以表示导入；例如，具有`filter: /\.yaml$/`和`namespace: "yaml:"`的加载器将把来自`./myfile.yaml`的导入转换为`yaml:./myfile.yaml`。
