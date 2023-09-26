---
outline: "deep"
---

# vs esbuild

Bun 的捆绑器 API 受[esbuild](https://esbuild.github.io/)的强烈启发。从 esbuild 迁移到 Bun 的捆绑器应该相对无痛。本指南将简要解释为什么您可能考虑迁移到 Bun 的捆绑器，并为那些已经熟悉 esbuild 的 API 的人提供了一个并列的 API 比较参考。

有一些需要注意的行为差异。

- **默认捆绑**。与 esbuild 不同，Bun _始终默认捆绑_。这就是为什么在 Bun 示例中不需要`--bundle`标志的原因。要单独转译每个文件，请使用[`Bun.Transpiler`](/api/transpiler.md)。
- **只是一个捆绑器**。与 esbuild 不同，Bun 的捆绑器不包括内置的开发服务器或文件监视器。它只是一个捆绑器。捆绑器旨在与`Bun.serve`和其他运行时 API 一起使用，以实现相同的效果。因此，与 HTTP/文件监视相关的所有选项都不适用。

## 性能

具有面向性能的 API，与经过广泛优化的基于 Zig 的 JS/TS 解析器相结合，Bun 的捆绑器比 esbuild 在 esbuild 的[three.js 基准](https://github.com/oven-sh/bun/tree/main/bench/bundle)上快 1.75 倍。

![从头开始捆绑10份three.js副本，带有sourcemaps和缩小](/bundler-speed.png)

## CLI API

Bun 和 esbuild 都提供了命令行界面。

```bash
$ esbuild <入口点> --outdir=out --bundle
$ bun build <入口点> --outdir=out
```

在 Bun 的 CLI 中，像`--minify`这样的简单布尔标志不接受参数。其他标志，如`--outdir <路径>`接受参数；这些标志可以写成`--outdir out`或`--outdir=out`。某些标志，如`--define`可以多次指定：`--define foo=bar --define bar=baz`。


| esbuild              | bun build               |                                                                                                                                                                                                                                |
| -------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| --bundle             | n/a                     | Bun 始终捆绑，使用--no-bundle 来禁用此行为。                                                                                                                                                                                   |
| --define:K=V         | --define K=V            | 语法差异小，没有冒号。                                                                                                                                                                                                         |
|                      |                         | `bash $ esbuild --define:foo=bar $ bun build --define foo=bar`                                                                                                                                                                 |
| `--external:<pkg> `    | `--external <pkg>`        | 语法差异小，没有冒号。                                                                                                                                                                                                         |
|                      |                         | `bash $ esbuild --external:react $ bun build --external react `                                                                                                                                                                |
| --format             | --format                | Bun 目前仅支持"esm"，但计划支持其他模块格式。esbuild 默认为"iife"。                                                                                                                                                            |
| --loader:.ext=loader | --loader .ext:loader    | Bun 支持一组不同的内置加载器，与 esbuild 不同；有关完整参考，请参阅 Bundler > Loaders。尚未实现 esbuild 加载器 dataurl、binary、base64、copy 和 empty。 --loader 的语法略有不同。                                              |
|                      |                         | `bash $ esbuild app.ts --bundle --loader:.svg=text $ bun build app.ts --loader .svg:text `                                                                                                                                     |
| --minify             | --minify                | 没有差异                                                                                                                                                                                                                       |
| --outdir             | --outdir                | 没有差异                                                                                                                                                                                                                       |
| --outfile            | --outfile               | 没有差异                                                                                                                                                                                                                       |
| --packages           | n/a                     | 不支持                                                                                                                                                                                                                         |
| --platform           | --target                | 为了与 tsconfig 一致，更名为--target。不支持 neutral。                                                                                                                                                                         |
| --serve              | n/a                     | 不适用                                                                                                                                                                                                                         |
| --sourcemap          | --sourcemap             | 没有差异                                                                                                                                                                                                                       |
| --splitting          | --splitting             | 没有差异                                                                                                                                                                                                                       |
| --target             | n/a                     | 不支持。Bun 的捆绑器目前不执行语法下级处理。                                                                                                                                                                                   |
| --watch              | --watch                 | 没有差异                                                                                                                                                                                                                       |
| --allow-overwrite    | n/a                     | 从不允许覆盖                                                                                                                                                                                                                   |
| --analyze            | n/a                     | 不支持                                                                                                                                                                                                                         |
| --asset-names        | --asset-naming          | 为了与 JS API 中的 naming 一致，改名                                                                                                                                                                                           |
| --banner             | n/a                     | 不支持                                                                                                                                                                                                                         |
| --certfile           | n/a                     | 不适用                                                                                                                                                                                                                         |
| --charset=utf8       | n/a                     | 不支持                                                                                                                                                                                                                         |
| --chunk-names        | --chunk-naming          | 为了与 JS API 中的 naming 一致，改名                                                                                                                                                                                           |
| --color              | n/a                     | 始终启用                                                                                                                                                                                                                       |
| --drop               | n/a                     | 不支持                                                                                                                                                                                                                         |
| --entry-names        | --entry-naming          | 为了与 JS API 中的 naming 一致，改名                                                                                                                                                                                           |
| --footer             | n/a                     | 不支持                                                                                                                                                                                                                         |
| --global-name        | n/a                     | 不适用，Bun 目前不支持 iife 输出                                                                                                                                                                                               |
| --ignore-annotations | n/a                     | 不支持                                                                                                                                                                                                                         |
| --inject             | n/a                     | 不支持                                                                                                                                                                                                                         |
| --jsx                | `--jsx-runtime <runtime>` | 支持"automatic"（使用 jsx 变换）和"classic"（使用 React.createElement）                                                                                                                                                        |
| --jsx-dev            | n/a                     | Bun 从 tsconfig.json 中读取 compilerOptions.jsx，以确定默认值。如果 compilerOptions.jsx 为"react-jsx"，或者 NODE_ENV=production，Bun 将使用 jsx 变换。否则，它使用 jsxDEV。对于任何到 Bun 使用 jsxDEV。捆绑器不支持 preserve。 |
| --jsx-factory        | --jsx-factory           |                                                                                                                                                                                                                                |
| --jsx-fragment       | --jsx-fragment          |                                                                                                                                                                                                                                |
| --jsx-import-source  | --jsx-import-source     |                                                                                                                                                                                                                                |
| --jsx-side-effects   | n/a                     | 假定 JSX 始终是无副作用的                                                                                                                                                                                                      |
| --keep-names         | n/a                     | 不支持                                                                                                                                                                                                                         |
| --keyfile            | n/a                     | 不适用                                                                                                                                                                                                                         |
| --legal-comments     | n/a                     | 不支持                                                                                                                                                                                                                         |
| --log-level          | n/a                     | 不支持。可以在 bunfig.toml 中设置为 logLevel。                                                                                                                                                                                 |
| --log-limit          | n/a                     | 不支持                                                                                                                                                                                                                         |
| --log-override:X=Y   | n/a                     | 不支持                                                                                                                                                                                                                         |
| --main-fields        | n/a                     | 不支持                                                                                                                                                                                                                         |
| --mangle-cache       | n/a                     | 不支持                                                                                                                                                                                                                         |
| --mangle-props       | n/a                     | 不支持                                                                                                                                                                                                                         |
| --mangle-quoted      | n/a                     | 不支持                                                                                                                                                                                                                         |
| --metafile           | n/a                     | 不支持                                                                                                                                                                                                                         |
| --minify-whitespace  | --minify-whitespace     |                                                                                                                                                                                                                                |
| --minify-identifiers | --minify-identifiers    |                                                                                                                                                                                                                                |
| --minify-syntax      | --minify-syntax         |                                                                                                                                                                                                                                |
| --out-extension      | n/a                     | 不支持                                                                                                                                                                                                                         |
| --outbase            | --root                  |                                                                                                                                                                                                                                |
| --preserve-symlinks  | n/a                     | 不支持                                                                                                                                                                                                                         |
| --public-path        | --public-path           |                                                                                                                                                                                                                                |
| --pure               | n/a                     | 不支持                                                                                                                                                                                                                         |
| --reserve-props      | n/a                     | 不支持                                                                                                                                                                                                                         |
| --resolve-extensions | n/a                     | 不支持                                                                                                                                                                                                                         |
| --servedir           | n/a                     | 不适用                                                                                                                                                                                                                         |
| --source-root        | n/a                     | 不支持                                                                                                                                                                                                                         |
| --sourcefile         | n/a                     | 不支持。Bun 目前不支持 stdin 输入。                                                                                                                                                                                            |
| --sourcemap          | --sourcemap             | 没有差异                                                                                                                                                                                                                       |
| --sources-content    | n/a                     | 不支持                                                                                                                                                                                                                         |
| --supported          | n/a                     | 不支持                                                                                                                                                                                                                         |
| --tree-shaking       | n/a                     | 始终为 true                                                                                                                                                                                                                    |
| --tsconfig           | --tsconfig-override     |                                                                                                                                                                                                                                |
| --version            | n/a                     | 运行 bun --version 以查看 Bun 的版本。           |

## JavaScript API

| esbuild.build()   | Bun.build()            |                                                                                                                                                   |
| ----------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| absWorkingDir     | n/a                    | 始终设置为 process.cwd()                                                                                                                          |
| alias             | n/a                    | 不支持                                                                                                                                            |
| allowOverwrite    | n/a                    | 始终为 false                                                                                                                                      |
| assetNames        | naming.asset           | 使用与 esbuild 相同的模板语法，但必须显式包含[ext]。                                                                                              |
| banner            | n/a                    | 不支持                                                                                                                                            |
| bundle            | n/a                    | 始终为 true。要进行捆绑之外的转译，请使用 Bun.Transpiler。                                                                                        |
| charset           | n/a                    | 不支持                                                                                                                                            |
| chunkNames        | naming.chunk           | 使用与 esbuild 相同的模板语法，但必须显式包含[ext]。                                                                                              |
| color             | n/a                    | Bun 将日志返回到构建结果的 logs 属性中。                                                                                                          |
| conditions        | n/a                    | 不支持。导出条件优先级由 target 确定。                                                                                                            |
| define            | define                 |                                                                                                                                                   |
| drop              | n/a                    | 不支持                                                                                                                                            |
| entryNames        | naming 或 naming.entry | Bun 支持一个 naming 键，可以是字符串或对象。使用与 esbuild 相同的模板语法，但必须显式包含[ext]。                                                  |
| entryPoints       | entrypoints            | 大写差异                                                                                                                                          |
| external          | external               | 没有差异                                                                                                                                          |
| footer            | n/a                    | 不支持                                                                                                                                            |
| format            | format                 | 目前仅支持"esm"。计划支持"cjs"和"iife"。                                                                                                          |
| globalName        | n/a                    | 不支持                                                                                                                                            |
| ignoreAnnotations | n/a                    | 不支持                                                                                                                                            |
| inject            | n/a                    | 不支持                                                                                                                                            |
| jsx               | jsx                    | 在 JS API 中不支持，在 tsconfig.json 中配置                                                                                                       |
| jsxDev            | jsxDev                 | 在 JS API 中不支持，在 tsconfig.json 中配置                                                                                                       |
| jsxFactory        | jsxFactory             | 在 JS API 中不支持，在 tsconfig.json 中配置                                                                                                       |
| jsxFragment       | jsxFragment            | 在 JS API 中不支持，在 tsconfig.json 中配置                                                                                                       |
| jsxImportSource   | jsxImportSource        | 在 JS API 中不支持，在 tsconfig.json 中配置                                                                                                       |
| jsxSideEffects    | jsxSideEffects         | 在 JS API 中不支持，在 tsconfig.json 中配置                                                                                                       |
| keepNames         | n/a                    | 不支持                                                                                                                                            |
| legalComments     | n/a                    | 不支持                                                                                                                                            |
| loader            | loader                 | Bun 支持一组不同于 esbuild 的内置加载器；有关完整参考，请参阅 Bundler > Loaders。尚未实现 esbuild 加载器 dataurl、binary、base64、copy 和 empty。 |
| logLevel          | n/a                    | 不支持                                                                                                                                            |
| logLimit          | n/a                    | 不支持                                                                                                                                            |
| logOverride       | n/a                    | 不支持                                                                                                                                            |
| mainFields        | n/a                    | 不支持                                                                                                                                            |
| mangleCache       | n/a                    | 不支持                                                                                                                                            |
| mangleProps       | n/a                    | 不支持                                                                                                                                            |
| mangleQuoted      | n/a                    | 不支持                                                                                                                                            |
| metafile          | n/a                    | 不支持                                                                                                                                            |
| minify            | minify                 | 在 Bun 中，minify 可以是布尔值或对象。                                                                                                            |
| minifyIdentifiers | minify.identifiers     | 请参见 minify                                                                                                                                     |
| minifySyntax      | minify.syntax          | 请参见 minify                                                                                                                                     |
| minifyWhitespace  | minify.whitespace      | 请参见 minify                                                                                                                                     |
| nodePaths         | n/a                    | 不支持                                                                                                                                            |
| outExtension      | n/a                    | 不支持                                                                                                                                            |
| outbase           | root                   | 不同的名称                                                                                                                                        |
| outdir            | outdir                 | 没有差异                                                                                                                                          |
| outfile           | outfile                | 没有差异                                                                                                                                          |
| packages          | n/a                    | 不支持，使用 external                                                                                                                             |
| platform          | target                 | 支持"bun"、"node"和"browser"（默认）。不支持"neutral"。                                                                                           |
| plugins           | plugins                | Bun 的插件 API 是 esbuild 的子集。一些 esbuild 插件可以与 Bun 直接使用。                                                                          |
| preserveSymlinks  | n/a                    | 不支持                                                                                                                                            |
| publicPath        | publicPath             | 没有差异                                                                                                                                          |
| pure              | n/a                    | 不支持                                                                                                                                            |
| reserveProps      | n/a                    | 不支持                                                                                                                                            |
| resolveExtensions | n/a                    | 不支持                                                                                                                                            |
| sourceRoot        | n/a                    | 不支持                                                                                                                                            |
| sourcemap         | sourcemap              | 支持"inline"、"external"和"none"                                                                                                                  |
| sourcesContent    | n/a                    | 不支持                                                                                                                                            |
| splitting         | splitting              | 没有差异                                                                                                                                          |
| stdin             | n/a                    | 不支持                                                                                                                                            |
| supported         | n/a                    | 不支持                                                                                                                                            |
| target            | n/a                    | 不支持语法降级                                                                                                                                    |
| treeShaking       | n/a                    | 始终为 true                                                                                                                                       |
| tsconfig          | n/a                    | 不支持                                                                                                                                            |
| write             | n/a                    | 如果设置了 outdir/outfile，则为 true，否则为 false                                                                                                |

## 插件 API

Bun 的插件 API 旨在与 esbuild 兼容。Bun 不支持 esbuild 的完整插件 API 表面，但已实现核心功能。许多第三方`esbuild`插件将与 Bun 一起即插即用。

> 从长远来看，我们的目标是实现与 esbuild 的 API 功能相等，因此如果某些功能无法正常工作，请提交问题以帮助我们设置优先级。

在 Bun 和 esbuild 中，插件是使用`builder`对象定义的。

```ts
import type { BunPlugin } from "bun";

const myPlugin: BunPlugin = {
  name: "my-plugin",
  setup(builder) {
    // 定义插件
  },
};
```

`builder`对象提供了一些方法，用于钩入捆绑过程的各个部分。Bun 实现了`onResolve`和`onLoad`；它尚未实现 esbuild 的`onStart`、`onEnd`、`onDispose`和`resolve`钩子，以及`initialOptions`部分实现，只读并且只有 esbuild 选项的子集；请改用[`config`](/bundler/plugins)（与 Bun 的`BuildConfig`格式相同）。

```ts
import type { BunPlugin } from "bun";
const myPlugin: BunPlugin = {
  name: "my-plugin",
  setup(builder) {
    builder.onResolve(
      {
        /* onResolve.options */
      },
      (args) => {
        return {
          /* onResolve.results */
        };
      }
    );
    builder.onLoad(
      {
        /* onLoad.options */
      },
      (args) => {
        return {
          /* onLoad.results */
        };
      }
    );
  },
};
```

### `onResolve`

#### `options`

|     |           |
| --- | --------- |
| 🟢  | filter    |
| 🟢  | namespace |

#### `arguments`

|     |            |
| --- | ---------- |
| 🟢  | path       |
| 🟢  | importer   |
| 🔴  | namespace  |
| 🔴  | resolveDir |
| 🔴  | kind       |
| 🔴  | pluginData |

#### `results`

|     |             |
| --- | ----------- |
| 🟢  | namespace   |
| 🟢  | path        |
| 🔴  | errors      |
| 🔴  | external    |
| 🔴  | pluginData  |
| 🔴  | pluginName  |
| 🔴  | sideEffects |
| 🔴  | suffix      |
| 🔴  | warnings    |
| 🔴  | watchDirs   |
| 🔴  | watchFiles  |

### `onLoad`

#### `options`

|     |             |
| --- | ----------- |
| 🟢  | `filter`    |
| 🟢  | `namespace` |

#### `arguments`

|     |              |
| --- | ------------ |
| 🟢  | `path`       |
| 🔴  | `namespace`  |
| 🔴  | `suffix`     |
| 🔴  | `pluginData` |

#### `results`

|     |              |
| --- | ------------ |
| 🟢  | `contents`   |
| 🟢  | `loader`     |
| 🔴  | `errors`     |
| 🔴  | `pluginData` |
| 🔴  | `pluginName` |
| 🔴  | `resolveDir` |
| 🔴  | `warnings`   |
| 🔴  | `watchDirs`  |
| 🔴  | `watchFiles` |
