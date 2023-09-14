Bun 在服务器优先的运行时环境中不支持一些 Web API，例如[DOM API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API#html_dom_api_interfaces)或[History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)等，因为它们通常与浏览器环境相关。然而，许多其他 Web API 在浏览器之外的上下文中仍然广泛有用。因此，Bun 在可能的情况下实现这些 Web 标准 API，而不是引入新的 API。

以下是部分或完全受支持的 Web API。

{% table %}

---

- HTTP
- [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch) [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) [`Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers) [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)

---

- URLs
- [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL) [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

---

- Web Workers
- [`Worker`](https://developer.mozilla.org/en-US/docs/Web/API/Worker) [`self.postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/DedicatedWorkerGlobalScope/postMessage) [`structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone) [`MessagePort`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort) [`MessageChannel`](https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel) [`BroadcastChannel`](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)

---

- Streams
- [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) [`WritableStream`](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream) [`TransformStream`](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream) [`ByteLengthQueuingStrategy`](https://developer.mozilla.org/en-US/docs/Web/API/ByteLengthQueuingStrategy) [`CountQueuingStrategy`](https://developer.mozilla.org/en-US/docs/Web/API/CountQueuingStrategy)及其相关类

---

- Blob
- [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)

---

- WebSockets
- [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)（_尚不完全生产就绪_）

---

- 编码和解码
- [`atob`](https://developer.mozilla.org/en-US/docs/Web/API/atob) [`btoa`](https://developer.mozilla.org/en-US/docs/Web/API/btoa) [`TextEncoder`](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder) [`TextDecoder`](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder)

---

- JSON
- [`JSON`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)

---

- 超时
- [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout) [`clearTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout)

---

- 间隔
- [`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)

---

- 加密
- [`crypto`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto) [`SubtleCrypto`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto) [`CryptoKey`](https://developer.mozilla.org/en-US/docs/Web/API/CryptoKey)

---

- 调试
- [`console`](https://developer.mozilla.org/en-US/docs/Web/API/console) [`performance`](https://developer.mozilla.org/en-US/docs/Web/API/Performance)

---

- 微任务
- [`queueMicrotask`](https://developer.mozilla.org/en-US/docs/Web/API/queueMicrotask)

---

- 错误
- [`reportError`](https://developer.mozilla.org/en-US/docs/Web/API/reportError)

---

- 用户交互
- [`alert`](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert) [`confirm`](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm) [`prompt`](https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt)（用于交互式 CLI）

<!-- - 阻塞。将警告消息打印到终端并等待按下 `[ENTER]` 键后继续。
- 阻塞。打印确认消息并等待用户输入 `[y/N]`。如果用户输入 `y` 或 `Y`，则返回 `true`，否则返回 `false`。
- 阻塞。打印提示消息并等待用户输入。返回用户输入的字符串。 -->

---

- 领域
- [`ShadowRealm`](https://github.com/tc39/proposal-shadowrealm)

---

- 事件
- [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) [`ErrorEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ErrorEvent) [`CloseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent) [`MessageEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent)

---

{% /table %}
