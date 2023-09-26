---
outline: "deep"
---

# Workers

> **🚧** — `Worker` API 仍处于实验阶段，不应视为生产就绪。

[`Worker`](https://developer.mozilla.org/en-US/docs/Web/API/Worker) 允许您在单独的线程上启动并与新的 JavaScript 实例进行通信，同时与主线程共享 I/O 资源。

Bun 实现了[Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)的最小版本，并具有使其在服务器端用例中更好地工作的扩展功能。与 Bun 的其他部分一样，Bun 中的`Worker`支持 CommonJS、ES 模块、TypeScript、JSX、TSX 等，无需额外的构建步骤。

## 创建一个`Worker`

与浏览器中一样，[`Worker`](https://developer.mozilla.org/en-US/docs/Web/API/Worker) 是全局的。可以使用它创建一个新的工作线程。

### 从主线程

```js#Main_thread
const workerURL = new URL("worker.ts", import.meta.url).href;
const worker = new Worker(workerURL);

worker.postMessage("hello");
worker.onmessage = event => {
  console.log(event.data);
};
```

### 工作线程

```ts
// 防止TS错误
declare var self: Worker;

self.onmessage = (event: MessageEvent) => {
  console.log(event.data);
  postMessage("world");
};
```

为了在使用`self`时防止 TypeScript 错误，请在工作文件的顶部添加这一行。

```ts
declare var self: Worker;
```

您可以在工作代码中使用`import`和`export`语法。与浏览器不同，无需指定`{type: "module"}`以使用 ES 模块。

为了简化错误处理，在调用`new Worker(url)`时，初始脚本将在解析时加载。

```js
const worker = new Worker("/not-found.js");
// 立即引发错误
```

传递给`Worker`的 specifier 是相对于项目根目录解析的（就像输入`bun ./path/to/file.js`一样）。

### `"open"`

在创建工作线程并准备接收消息时，会触发`"open"`事件。可以在工作线程准备就绪后发送初始消息。 （在浏览器中不存在此事件。）

```ts
const worker = new Worker(new URL("worker.ts", import.meta.url).href);

worker.addEventListener("open", () => {
  console.log("worker is ready");
});
```

消息会自动排队，直到工作线程准备就绪，因此无需等待`"open"`事件来发送消息。

## 使用`postMessage`发送消息

要发送消息，使用[`worker.postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage) 和 [`self.postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)。这利用了[HTML 结构化克隆算法](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)。

```js
// 在工作线程上，`postMessage`会自动“路由”到父线程。
postMessage({ hello: "world" });

// 在主线程上
worker.postMessage({ hello: "world" });
```

要接收消息，使用工作线程和主线程上的[`message`事件处理程序](https://developer.mozilla.org/en-US/docs/Web/API/Worker/message_event)。

```js
// 工作线程：
self.addEventListener("message", (event) => {
  console.log(event.data);
});
// 或使用setter：
// self.onmessage = fn

// 如果在主线程上
worker.addEventListener("message", (event) => {
  console.log(event.data);
});
// 或使用setter：
// worker.onmessage = fn
```

## 终止工作线程

`Worker`实例在其事件循环没有剩余工作时会自动终止。将全局或任何`MessagePort`上附加`"message"`监听器将使事件循环保持活动状态。要强制终止`Worker`，请调用`worker.terminate()`。

```ts
const worker = new Worker(new URL("worker.ts", import.meta.url).href);

// ...稍后
worker.terminate();
```

这将导致工作线程尽快退出。

### `process.exit()`

工作线程可以使用`process.exit()`自行终止。这不会终止主进程。与 Node.js 一样，在工作线程上发出`process.on('beforeExit', callback)`和`process.on('exit', callback)`事件（而不是在主线程上），并将退出代码传递给`"close"`事件。

### `"close"`

在工作线程已被终止时，会触发`"close"`事件。工作线程实际终止可能需要一些时间，因此当工作线程被标记为已终止时会触发此事件。`CloseEvent`将包含传递给`process.exit()`的退出代码，或者如果由于其他原因而关闭，则为 0。

```ts
const worker = new Worker(new URL("worker.ts", import.meta.url).href);

worker.addEventListener("close", (event) => {
  console.log("worker is being closed");
});
```

在浏览器中不存在此事件。

## 生命周期管理

默认情况下，活动的`Worker`会使主（生成）进程保持活动状态，因此异步任务（如`setTimeout`和 promises）将使进程保持活动状态。附加`message`监听器也会使`Worker`保持活动状态。

### `worker.unref()`

要阻止运行中的工作线程使进程保持活动状态，请调用`worker.unref()`。这会将工作线程的生命周期与主进程的生命周期分离，并与 Node.js 的`worker_threads`所做的相同。

```ts
const worker = new Worker(new URL("worker.ts", import.meta.url).href);
worker.unref();
```

注意：`worker.unref()`在浏览器中不可用。

### `worker.ref()`

要使进程保持活动状态，直到`Worker`终止，请调用`worker.ref()`。引用的工作线程是默认行为，仍然需要事件

循环中发生的某些事情（例如`"message"`监听器）以使工作线程继续运行。

```ts
const worker = new Worker(new URL("worker.ts", import.meta.url).href);
worker.unref();
// 稍后...
worker.ref();
```

或者，您还可以向`Worker`传递一个`options`对象：

```ts
const worker = new Worker(new URL("worker.ts", import.meta.url).href, {
  ref: false,
});
```

注意：`worker.ref()`在浏览器中不可用。

## 使用`smol`节省内存

JavaScript 实例可能会占用大量内存。Bun 的`Worker`支持`smol`模式，可以减少内存使用，但会降低性能。要启用`smol`模式，请在`Worker`构造函数的`options`对象中传递`smol: true`。

```js
const worker = new Worker("./i-am-smol.ts", {
  smol: true,
});
```

<details>
<summary>`smol`模式实际上是什么？?</summary>
设置`smol: true`会将`JSC::HeapSize`设置为`Small`，而不是默认的`Large`。
</details>
