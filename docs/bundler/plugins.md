---
outline: "deep"
---

# Plugins

Bun 提供了通用的插件 API，可用于扩展运行时和打包工具。

插件可以拦截导入并执行自定义加载逻辑，例如读取文件、转译代码等。它们可以用于添加对其他文件类型的支持，比如`.scss`或`.yaml`。在 Bun 打包工具的上下文中，插件可用于实现框架级功能，如 CSS 提取、宏和客户端-服务器代码共存。

有关 Plugin API 的更完整文档，请参阅[运行时 > 插件](/runtime/plugins.md)。

## 用法

一个插件被定义为一个简单的 JavaScript 对象，包含一个`name`属性和一个`setup`函数。使用`plugin`函数将插件注册到 Bun 中。

```tsx
#myPlugin.ts
import type { BunPlugin } from "bun";

const myPlugin: BunPlugin = {
  name: "Custom loader",
  setup(build) {
    // 实现
  },
};
```

可以在调用`Bun.build`时将此插件传递到`plugins`数组中。

```ts
Bun.build({
  entrypoints: ["./app.ts"],
  outdir: "./out",
  plugins: [myPlugin],
});
```
