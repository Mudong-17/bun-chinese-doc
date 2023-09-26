---
outline: "deep"
---

# Node-API

Node-API 是用于构建 Node.js 本地附加组件的接口。Bun 从头开始实现了 Node-API 接口的 95%，因此大多数现有的 Node-API 扩展都可以在 Bun 中直接使用。您可以在 [此问题](https://github.com/oven-sh/bun/issues/158) 中跟踪其完成状态。

与 Node.js 类似，`.node` 文件（Node-API 模块）可以直接在 Bun 中被 `require`。

```js
const napi = require("./my-node-module.node");
```

或者，您可以使用 `process.dlopen`：

```js
let mod = { exports: {} };
process.dlopen(mod, "./my-node-module.node");
```

Bun 还提供了对 [`detect-libc`](https://npmjs.com/package/detect-libc) 包的支持，该包被许多 Node-API 模块用于检测应该 `require` 哪个 `.node` 绑定。
