---
outline: "deep"
---

# Node.js compatibility

Bun 致力于实现完整的 Node.js API 兼容性。大多数针对`Node.js`环境的`npm`包都可以直接在 Bun 中使用；确保兼容性的最佳方法是尝试使用它。

此页面定期更新以反映最新版本的 Bun 的兼容性状态。如果您在使用特定包时遇到任何问题，请[提交问题](https://bun.sh/issues)。为兼容性问题提交问题有助于我们确定下一步的工作重点。

## 内置模块

### [`node:assert`](https://nodejs.org/api/assert.html)

🟢 完全实现。

### [`node:async_hooks`](https://nodejs.org/api/async_hooks.html)

🟡 仅实现了`AsyncLocalStorage`和`AsyncResource`。

### [`node:buffer`](https://nodejs.org/api/buffer.html)

🟢 完全实现。

### [`node:child_process`](https://nodejs.org/api/child_process.html)

🟡 缺少`Stream` stdio，`proc.gid`，`proc.uid`。IPC 部分支持，仅与其他`bun`进程一起使用时有效。

### [`node:cluster`](https://nodejs.org/api/cluster.html)

🔴 未实现。

### [`node:console`](https://nodejs.org/api/console.html)

🟡 缺少`Console`构造函数。

### [`node:crypto`](https://nodejs.org/api/crypto.html)

🟡 缺少`crypto.Certificate` `crypto.ECDH` `crypto.KeyObject` `crypto.X509Certificate` `crypto.checkPrime{Sync}` `crypto.createPrivateKey` `crypto.createPublicKey` `crypto.createSecretKey` `crypto.diffieHellman` `crypto.generateKey{Sync}` `crypto.generateKeyPair{Sync}` `crypto.generatePrime{Sync}` `crypto.getCipherInfo` `crypto.{get|set}Fips` `crypto.hkdf` `crypto.hkdfSync` `crypto.secureHeapUsed` `crypto.setEngine` `crypto.sign` `crypto.verify`。某些方法尚未优化。

### [`node:dgram`](https://nodejs.org/api/dgram.html)

🔴 未实现。

### [`node:diagnostics_channel`](https://nodejs.org/api/diagnostics_channel.html)

🟢 完全实现。

### [`node:dns`](https://nodejs.org/api/dns.html)

🟢 完全实现。

### [`node:domain`](https://nodejs.org/api/domain.html)

🟢 完全实现。

### [`node:events`](https://nodejs.org/api/events.html)

🟡 缺少`on`。

### [`node:fs`](https://nodejs.org/api/fs.html)

🟡 缺少`fs.fdatasync{Sync}` `fs.opendir{Sync}`。`fs.promises.open`错误地返回文件描述符，而不是`FileHandle`。

### [`node:http`](https://nodejs.org/api/http.html)

🟢 完全实现。

### [`node:http2`](https://nodejs.org/api/http2.html)

🔴 未实现。

### [`node:https`](https://nodejs.org/api/https.html)

🟢 完全实现。

### [`node:inspector`](https://nodejs.org/api/inspector.html)

🔴 未实现。

### [`node:module`](https://nodejs.org/api/module.html)

🟢 完全实现。

### [`node:net`](https://nodejs.org/api/net.html)

🟡 缺少`net.{get|set}DefaultAutoSelectFamily` `net.SocketAddress` `net.BlockList`。

### [`node:os`](https://nodejs.org/api/os.html)

🟢 完全实现。

### [`node:path`](https://nodejs.org/api/path.html)

🟢 完全实现。

### [`node:perf_hooks`](https://nodejs.org/api/perf_hooks.html)

🟡 仅实现了`perf_hooks.performance.now()`和`perf_hooks.performance.timeOrigin`。建议使用全局的`performance`而不是`perf_hooks.performance`。

### [`node:process`](https://nodejs.org/api/process.html)

🟡 请参阅[process](#process)全局对象。

### [`node:punycode`](https://nodejs.org/api/punycode.html)

🟢 完全实现。_已被 Node.js 弃用_。

### [`node:querystring`](https://nodejs.org/api/querystring.html)

🟢 完全实现。

### [`node:readline`](https://nodejs.org/api/readline.html)

🟢 完全实现。

### [`node:repl`](https://nodejs.org/api/repl.html)

🔴 未实现。

### [`node:stream`](https://nodejs.org/api/stream.html)

🟢 完全实现。

### [`node:string_decoder`](https://nodejs.org/api/string_decoder.html)

🟢 完全实现。

### [`node:sys`](https://nodejs.org/api/util.html)

🟡 请参阅[`node:util`](#node-util)。

### [`node:timers`](https://nodejs.org/api/timers.html)

🟢 建议使用全局的`setTimeout`等，而不是`timers`模块。

### [`node:tls`](https://nodejs.org/api/tls.html)

🟡 缺少`tls.createSecurePair`。

### [`node:trace_events`](https://nodejs.org/api/tracing.html)

🔴 未实现。

### [`node:tty`](https://nodejs.org/api/tty.html)

🟢 完全实现。

### [`node:url`](https://nodejs.org/api/url.html)

🟡 缺少`url.domainTo{ASCII|Unicode}`。建议使用全局的`URL`和`URLSearchParams`而不是`url`模块。

### [`node:util`](https://nodejs.org/api/util.html)

🟡 缺少`util.MIMEParams` `util.MIMEType` `util.getSystemErrorMap()` `util.getSystemErrorName()` `util.parseArgs()` `util.stripVTControlCharacters()` `util.transferableAbortController()` `util.transferableAbortSignal()`。

### [`node:v8`](https://nodejs.org/api/v8.html)

🔴 `serialize`和`deserialize`使用 JavaScriptCore 的 Wire 格式，而不是 V8 的。否则，未实现。对于性能分析，请使用[`bun:jsc`](/project/benchmarking#bunjsc)。

### [`node:vm`](https://nodejs.org/api/vm.html)

🟡 核心功能

可用，但未实现 VM 模块。可以使用`ShadowRealm`。

### [`node:wasi`](https://nodejs.org/api/wasi.html)

🟡 部分实现。

### [`node:worker_threads`](https://nodejs.org/api/worker_threads.html)

🟡 `Worker`不支持以下选项：`eval`，`argv`，`execArgv`，`stdin`，`stdout`，`stderr`，`trackedUnmanagedFds`，`resourceLimits`。缺少`markAsUntransferable`，`moveMessagePortToContext`，`getHeapSnapshot`。

### [`node:zlib`](https://nodejs.org/api/zlib.html)

🟡 缺少`zlib.brotli*`。尚未进行优化。

以下是 Node.js 和 Bun 当前兼容性状态的全局对象列表：

### [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)

🟢 完全实现。

### [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)

🟢 完全实现。

### [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)

🟢 完全实现。

### [`Buffer`](https://nodejs.org/api/buffer.html#class-buffer)

🟡 `base64` 和 `base64url` 编码的实现不完整。

### [`ByteLengthQueuingStrategy`](https://developer.mozilla.org/en-US/docs/Web/API/ByteLengthQueuingStrategy)

🟢 完全实现。

### [`__dirname`](https://nodejs.org/api/globals.html#__dirname)

🟢 完全实现。

### [`__filename`](https://nodejs.org/api/globals.html#__filename)

🟢 完全实现。

### [`atob()`](https://developer.mozilla.org/en-US/docs/Web/API/atob)

🟢 完全实现。

### [`BroadcastChannel`](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)

🟢 完全实现。

### [`btoa()`](https://developer.mozilla.org/en-US/docs/Web/API/btoa)

🟢 完全实现。

### [`clearImmediate()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/clearImmediate)

🟢 完全实现。

### [`clearInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/clearInterval)

🟢 完全实现。

### [`clearTimeout()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/clearTimeout)

🟢 完全实现。

### [`CompressionStream`](https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream)

🔴 未实现。

### [`console`](https://developer.mozilla.org/en-US/docs/Web/API/console)

🟡 缺少`Console`构造函数。

### [`CountQueuingStrategy`](https://developer.mozilla.org/en-US/docs/Web/API/CountQueuingStrategy)

🟢 完全实现。

### [`Crypto`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto)

🟢 完全实现。

### [`SubtleCrypto (crypto)`](https://developer.mozilla.org/en-US/docs/Web/API/crypto)

🟢 完全实现。

### [`CryptoKey`](https://developer.mozilla.org/en-US/docs/Web/API/CryptoKey)

🟢 完全实现。

### [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)

🟢 完全实现。

### [`DecompressionStream`](https://developer.mozilla.org/en-US/docs/Web/API/DecompressionStream)

🔴 未实现。

### [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event)

🟢 完全实现。

### [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)

🟢 完全实现。

### [`exports`](https://nodejs.org/api/globals.html#exports)

🟢 完全实现。

### [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch)

🟢 完全实现。

### [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData)

🟢 完全实现。

### [`global`](https://nodejs.org/api/globals.html#global)

🟢 已实现。这是一个包含全局命名空间中所有对象的对象。它很少直接引用，因为它的内容可以在不添加额外前缀的情况下使用，例如使用`__dirname`而不是`global.__dirname`。

### [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis)

🟢 别名为`global`。

### [`Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers)

🟢 完全实现。

### [`MessageChannel`](https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel)

🟢 完全实现。

### [`MessageEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent)

🟢 完全实现。

### [`MessagePort`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort)

🟢 完全实现。

### [`module`](https://nodejs.org/api/globals.html#module)

🟢 完全实现。

### [`PerformanceEntry`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry)

🔴 未实现。

### [`PerformanceMark`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceMark)

🔴 未实现。

### [`PerformanceMeasure`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceMeasure)

🔴 未实现。

### [`PerformanceObserver`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)

🔴 未实现。

### [`PerformanceObserverEntryList`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserverEntryList)

🔴 未实现。

### [`PerformanceResourceTiming`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming)

🔴 未实现。

### [`performance`](https://developer.mozilla.org/en-US/docs/Web/API/performance)

🟢 完全实现。

### [`process`](https://nodejs.org/api/process.html)

🟡 缺少`process.allowedNodeEnvironmentFlags` `process.channel` `process.constrainedMemory()` `process.getActiveResourcesInfo/setActiveResourcesInfo()` `process.setuid/setgid/setegid/seteuid/setgroups()` `process.hasUncaughtExceptionCaptureCallback` `process.initGroups()` `process.report` `process.resourceUsage()`。

### [`queueMicrotask()`](https://developer.mozilla.org/en-US/docs/Web/API/queueMicrotask)

🟢 完全实现。

### [`ReadableByteStreamController`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableByteStreamController)

🟢 完全实现。

### [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

🟢 完全实现。

### [`ReadableStreamBYOBReader`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamBYOBReader)

🔴 未实现。

### [`ReadableStreamBYOBRequest`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamBYOBRequest)

🔴 未实现。

### [`ReadableStreamDefaultController`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamDefaultController)

🟢 完全实现。

### [`ReadableStreamDefaultReader`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamDefaultReader)

🟢 完全实现。

### [`require()`](https://nodejs.org/api

/globals.html#require)

🟢 完全实现，以及 [`require.main`](https://nodejs.org/api/modules.html#requiremain), [`require.cache`](https://nodejs.org/api/modules.html#requirecache), 和 [`require.resolve`](https://nodejs.org/api/modules.html#requireresolverequest-options)。

### [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)

🟢 完全实现。

### [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request)

🟢 完全实现。

### [`setImmediate()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/setImmediate)

🟢 完全实现。

### [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval)

🟢 完全实现。

### [`setTimeout()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout)

🟢 完全实现。

### [`structuredClone()`](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)

🟢 完全实现。

### [`SubtleCrypto`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto)

🟢 完全实现。

### [`DOMException`](https://developer.mozilla.org/en-US/docs/Web/API/DOMException)

🟢 完全实现。

### [`TextDecoder`](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder)

🟢 完全实现。

### [`TextDecoderStream`](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoderStream)

🔴 未实现。

### [`TextEncoder`](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder)

🟢 完全实现。

### [`TextEncoderStream`](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoderStream)

🔴 未实现。

### [`TransformStream`](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream)

🟢 完全实现。

### [`TransformStreamDefaultController`](https://developer.mozilla.org/en-US/docs/Web/API/TransformStreamDefaultController)

🟢 完全实现。

### [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL)

🟢 完全实现。

### [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

🟢 完全实现。

### [`WebAssembly`](https://nodejs.org/api/globals.html#webassembly)

🟢 完全实现。

### [`WritableStream`](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream)

🟢 完全实现。

### [`WritableStreamDefaultController`](https://developer.mozilla.org/en-US/docs/Web/API/WritableStreamDefaultController)

🟢 完全实现。

### [`WritableStreamDefaultWriter`](https://developer.mozilla.org/en-US/docs/Web/API/WritableStreamDefaultWriter)

🟢 完全实现。
