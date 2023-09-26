要安装 Bun 内置 API 的 TypeScript 定义，请安装`bun-types`。

```sh
$ bun add -d bun-types # 开发依赖
```

然后在您的`tsconfig.json`中的`compilerOptions.types`中包括`"bun-types"`：

```json-diff
  {
    "compilerOptions": {
+     "types": ["bun-types"]
    }
  }
```

此时，您应该能够在 TypeScript 文件中引用`Bun`全局对象，而不会在编辑器中看到错误。

```ts
console.log(Bun.version);
```

## 建议的`compilerOptions`

Bun 支持顶层等待（top-level await）、JSX 和扩展的`.ts`导入，这些是 TypeScript 默认不允许的。下面是 Bun 项目的一组建议`compilerOptions`，这样您就可以在不受 TypeScript 编译器警告的情况下使用这些功能。

```jsonc
{
  "compilerOptions": {
    // 添加Bun类型定义
    "types": ["bun-types"],

    // 启用最新特性
    "lib": ["esnext"],
    "module": "esnext",
    "target": "esnext",

    // 如果使用TS 5.x+
    "moduleResolution": "bundler",
    "noEmit": true,
    "allowImportingTsExtensions": true,
    "moduleDetection": "force",
    // 如果使用TS 4.x或更早版本
    // "moduleResolution": "nodenext",

    "jsx": "react-jsx", // 支持JSX
    "allowJs": true, // 允许从.ts中导入.js
    "esModuleInterop": true, // 允许为CommonJS模块进行默认导入

    // 最佳实践
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "composite": true,
    "downlevelIteration": true,
    "allowSyntheticDefaultImports": true
  }
}
```

如果您在新目录中运行`bun init`，则会为您生成此`tsconfig.json`。

```sh
$ bun init
```

## DOM 类型

不幸的是，设置`"types"`的值意味着 TypeScript 将忽略其他全局类型定义，包括`lib: ["dom"]`。如果您需要将 DOM 类型添加到项目中，请在项目中的任何 TypeScript 文件顶部添加以下[三斜杠指令](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html)。

```ts
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
```
