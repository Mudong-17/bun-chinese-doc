Bun 打包工具实现了一组默认的加载器，可以直接使用。通常情况下，Bun 打包工具和运行时都默认支持相同的文件类型。

以下是 Bun 打包工具支持的默认文件类型列表：

- `.js`
- `.cjs`
- `.mjs`
- `.mts`
- `.cts`
- `.ts`
- `.tsx`
- `.jsx`
- `.toml`
- `.json`
- `.txt`
- `.wasm`
- `.node`

Bun 使用文件扩展名来确定应使用哪个内置加载器（loader）来解析文件。每个加载器都有一个名称，例如`js`、`tsx`或`json`。这些名称在构建[插件](/docs/bundler/plugins.md)时用于扩展 Bun 并添加自定义加载器。

以下是内置加载器的详细信息：

### `js`

**JavaScript 加载器**。默认用于`.cjs`和`.mjs`文件。

解析代码并应用一组默认的转换，例如死代码消除、树抖动和内联环境变量。请注意，目前 Bun 不会尝试降级转换的语法。

### `jsx`

**JavaScript + JSX 加载器**。默认用于`.js`和`.jsx`文件。

与`js`加载器相同，但支持 JSX 语法。默认情况下，JSX 将被降级为纯 JavaScript；具体的降级方式取决于您的`tsconfig.json`中的`jsx*`编译器选项。有关更多信息，请参阅 TypeScript 文档中的[JSX 部分](https://www.typescriptlang.org/docs/handbook/jsx.html)。

### `ts`

**TypeScript 加载器**。默认用于`.ts`、`.mts`和`.cts`文件。

删除所有 TypeScript 语法，然后与`js`加载器表现相同。Bun 不执行类型检查。

### `tsx`

**TypeScript + JSX 加载器**。默认用于`.tsx`文件。将 TypeScript 和 JSX 都转译为纯粹的 JavaScript。

### `json`

**JSON 加载器**。默认用于`.json`文件。

可以直接导入 JSON 文件。

```ts
import pkg from "./package.json";
pkg.name; // => "my-package"
```

在打包过程中，解析的 JSON 将作为 JavaScript 对象内联到捆绑包中。

```ts
var pkg = {
  name: "my-package",
  // ... 其他字段
};
pkg.name;
```

如果将`.json`文件作为入口点传递给打包工具，它将被转换为一个`.js`模块，该模块将解析的对象导出为默认值。

### `toml`

**TOML 加载器**。默认用于`.toml`文件。

可以直接导入 TOML 文件。Bun 将使用其快速的本机 TOML 解析器解析它们。

```ts
import config from "./bunfig.toml";
config.logLevel; // => "debug"
```

在打包过程中，解析的 TOML 将作为 JavaScript 对象内联到捆绑包中。

```ts
var config = {
  logLevel: "debug",
  // ... 其他字段
};
config.logLevel;
```

如果将`.toml`文件作为入口点传递，它将被转换为一个`.js`模块，该模块将解析的对象导出为默认值。

### `text`

**文本加载器**。默认用于`.txt`文件。

文本文件的内容将被读取并内联到捆绑包中作为字符串。
文本文件可以直接导入。文件将被读取并作为字符串返回。

```ts
import contents from "./file.txt";
console.log(contents); // => "Hello, world!"
```

在构建过程中，文件的内容将内联到捆绑包中作为字符串。

```ts
var contents = `Hello, world!`;
console.log(contents);
```

如果将`.txt`文件作为入口点传递，它将被转换为一个`.js`模块，该模块将文件内容导出为默认值。

### `wasm`

**WebAssembly 加载器**。默认用于`.wasm`文件。

在运行时，可以直接导入 WebAssembly 文件。该文件将被读取并返回为`WebAssembly.Module`。

```ts
import wasm from "./module.wasm";
console.log(wasm); // => WebAssembly.Module
```

在打包工具中，`.wasm`文件将使用[`file`](#file)加载器处理。

### `napi`

**本机插件加载器**。默认用于`.node`文件。

在运行时，可以直接导入本机插件。

```ts
import addon from "./addon.node";
console.log(addon);
```

在打包工具中，`.node`文件将使用[`file`](#file)加载器处理。

### `file`

**文件加载器**。默认用于所有未识别的文件类型。

文件加载器将导入解析为到导入的文件的*路径/URL*。通常用于引用媒体或字体资源。

```ts#logo.ts
import logo from "./logo.svg";
console.log(logo);
```

_在运行时_，Bun 检查`logo.svg`文件是否存在，并将其转换为`logo.svg`在磁盘上的位置的绝对路径。

```bash
$ bun run logo.ts
/path/to/project/logo.svg
```

_在打包工具中_，情况稍有不同。文件将按原样复制到`outdir`，并且导入将解析为指向复制文件的相对路径。

```ts#Output
var logo = "./logo.svg";
console.log(logo);
```

如果为`publicPath`指定了值，导入将使用该值作为前缀来构建绝对路径/URL。

| 公共路径（public path）      | 已解析的导入                       |
| ---------------------------- | ---------------------------------- |
| `""`（默认值）               | `/logo.svg`                        |
| `"/assets"`                  | `/assets/logo.svg`                 |
| `"https://cdn.example.com/"` | `https://cdn.example.com/logo.svg` |

> 复制文件的位置和文件名由[`naming.asset`](/docs/bundler/index.md#naming)的值确定。

此加载器将按原样复制到`outdir`。复制文件的名称由`naming.asset`的值确定。

如果使用 TypeScript，可能会出现以下错误：

```ts
// TypeScript错误
// 找不到模块“./logo.svg”或其对应的类型声明。
```

可以通过在项目中的任何位置创建`*.d.ts`文件（任何名称都可以）并使用以下内容来修复此错误：

```ts
declare module "*.svg" {
  const content: string;
  export default content;
}
```

这告诉 TypeScript，从`.svg`导入的任何默认导入应该被视为字符串。
