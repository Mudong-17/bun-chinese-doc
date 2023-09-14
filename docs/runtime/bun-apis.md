Bun 实现了一组本地 API，这些 API 可以通过`Bun`全局对象和一些内置模块来访问。这些 API 经过了大量优化，代表了实现一些常见功能的规范的“Bun-native”方式。

Bun 在尽可能的情况下努力实现标准 Web API。Bun 主要引入新的 API，主要用于服务器端任务，这些任务在标准中不存在，例如文件 I/O 和启动 HTTP 服务器。在这些情况下，Bun 的方法仍然建立在标准 API（如`Blob`、`URL`和`Request`）之上。

```ts
Bun.serve({
  fetch(req: Request) {
    return new Response("Success!");
  },
});
```

点击右列中的链接跳转到相关文档。

{% table %}

- 主题
- API

---

- HTTP 服务器
- [`Bun.serve`](/docs/api/http#bun-serve)

---

- 打包工具
- [`Bun.build`](/docs/bundler)

---

- 文件 I/O
- [`Bun.file`](/docs/api/file-io#reading-files-bun-file) [`Bun.write`](/docs/api/file-io#writing-files-bun-write)

---

- 子进程
- [`Bun.spawn`](/docs/api/spawn#spawn-a-process-bun-spawn) [`Bun.spawnSync`](/docs/api/spawn#blocking-api-bun-spawnsync)

---

- TCP
- [`Bun.listen`](/docs/api/tcp#start-a-server-bun-listen) [`Bun.connect`](/docs/api/tcp#start-a-server-bun-listen)

---

- 转译器
- [`Bun.Transpiler`](/docs/api/transpiler)

---

- 路由
- [`Bun.FileSystemRouter`](/docs/api/file-system-router)

---

- HTML 重写
- [`HTMLRewriter`](/docs/api/html-rewriter)

---

- 哈希
- [`Bun.hash`](/docs/api/hashing#bun-hash) [`Bun.CryptoHasher`](/docs/api/hashing#bun-cryptohasher)

---

- `import.meta`
- [`import.meta`](/docs/api/import-meta)

---

<!-- - [DNS](/docs/api/dns)
- `Bun.dns`

--- -->

- SQLite
- [`bun:sqlite`](/docs/api/sqlite)

---

- FFI（外部函数接口）
- [`bun:ffi`](/docs/api/ffi)

---

- 测试
- [`bun:test`](/docs/cli/test)

---

- Node-API
- [`Node-API`](/docs/api/node-api)

---

- 实用工具
- [`Bun.version`](/docs/api/utils#bun-version) [`Bun.revision`](/docs/api/utils#bun-revision) [`Bun.env`](/docs/api/utils#bun-env) [`Bun.main`](/docs/api/utils#bun-main) [`Bun.sleep()`](/docs/api/utils#bun-sleep) [`Bun.sleepSync()`](/docs/api/utils#bun-sleepsync) [`Bun.which()`](/docs/api/utils#bun-which) [`Bun.peek()`](/docs/api/utils#bun-peek) [`Bun.openInEditor()`](/docs/api/utils#bun-openineditor) [`Bun.deepEquals()`](/docs/api/utils#bun-deepequals) [`Bun.escapeHTML()`](/docs/api/utils#bun-escapehtml) [`Bun.fileURLToPath()`](/docs/api/utils#bun-fileurltopath) [`Bun.pathToFileURL()`](/docs/api/utils#bun-pathtofileurl) [`Bun.gzipSync()`](/docs/api/utils#bun-gzipsync) [`Bun.gunzipSync()`](/docs/api/utils#bun-gunzipsync) [`Bun.deflateSync()`](/docs/api/utils#bun-deflatesync) [`Bun.inflateSync()`](/docs/api/utils#bun-inflatesync) [`Bun.inspect()`](/docs/api/utils#bun-inspect) [`Bun.nanoseconds()`](/docs/api/utils#bun-nanoseconds) [`Bun.readableStreamTo*()`](/docs/api/utils#bun-readablestreamto) [`Bun.resolveSync()`](/docs/api/utils#bun-resolvesync)

{% /table %}
