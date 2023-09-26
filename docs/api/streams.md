---
outline: "deep"
---

# Streams


流（Streams）是处理二进制数据的重要抽象，它们允许在不一次性加载所有数据到内存中的情况下进行操作。它们通常用于读写文件、发送和接收网络请求以及处理大量数据。

Bun 实现了 Web API 中的 [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) 和 [`WritableStream`](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream)。

> Bun 还实现了`node:stream`模块，包括 [`Readable`](https://nodejs.org/api/stream.html#stream_readable_streams)、[`Writable`](https://nodejs.org/api/stream.html#stream_writable_streams) 和 [`Duplex`](https://nodejs.org/api/stream.html#stream_duplex_and_transform_streams)。有关完整的文档，请参阅[Node.js 文档](https://nodejs.org/api/stream.html)。

要创建一个简单的`ReadableStream`：

```ts
const stream = new ReadableStream({
  start(controller) {
    controller.enqueue("hello");
    controller.enqueue("world");
    controller.close();
  },
});
```

可以使用`for await`语法逐个读取`ReadableStream`的内容。

```ts
for await (const chunk of stream) {
  console.log(chunk);
  // => "hello"
  // => "world"
}
```

## 直接的`ReadableStream`

Bun 实现了一个优化版本的`ReadableStream`，避免了不必要的数据复制和队列管理逻辑。在传统的`ReadableStream`中，数据块被*入队*。每个块都被复制到队列中，然后在流准备发送更多数据时保留在队列中。

```ts
const stream = new ReadableStream({
  start(controller) {
    controller.enqueue("hello");
    controller.enqueue("world");
    controller.close();
  },
});
```

使用直接的`ReadableStream`，数据块直接写入流中。不会发生排队，也不需要将块数据克隆到内存中。`controller` API 已更新以反映这一点；不再使用`.enqueue()`，而是调用`.write`。

```ts
const stream = new ReadableStream({
  type: "direct",
  pull(controller) {
    controller.write("hello");
    controller.write("world");
  },
});
```

在使用直接的`ReadableStream`时，所有块排队都由目标处理。流的消费者接收到与`controller.write()`传递的内容完全相同的内容，没有任何编码或修改。

## `Bun.ArrayBufferSink`

`Bun.ArrayBufferSink`类是用于构建未知大小的`ArrayBuffer`的快速增量写入器。

```ts
const sink = new Bun.ArrayBufferSink();

sink.write("h");
sink.write("e");
sink.write("l");
sink.write("l");
sink.write("o");

sink.end();
// ArrayBuffer(5) [ 104, 101, 108, 108, 111 ]
```

如果要将数据作为`Uint8Array`检索，可以将`asUint8Array`选项传递给构造函数。

```ts-diff
const sink = new Bun.ArrayBufferSink({
+ asUint8Array: true
});

sink.write("h");
sink.write("e");
sink.write("l");
sink.write("l");
sink.write("o");

sink.end();
// Uint8Array(5) [ 104, 101, 108, 108, 111 ]
```

`.write()`方法支持字符串、类型化数组、`ArrayBuffer`和`SharedArrayBuffer`。

```ts
sink.write("h");
sink.write(new Uint8Array([101, 108]));
sink.write(Buffer.from("lo").buffer);

sink.end();
```

一旦调用`.end()`，就不能再向`ArrayBufferSink`写入更多数据。但是，在缓冲流的上下文中，持续写入数据并定期将内容（例如，到`WriteableStream`）`.flush()`非常有用。要支持此操作，将`stream: true`传递给构造函数。

```ts
const sink = new Bun.ArrayBufferSink({
  stream: true,
});

sink.write("h");
sink.write("e");
sink.write("l");
sink.flush();
// ArrayBuffer(5) [ 104, 101, 108 ]

sink.write("l");
sink.write("o");
sink.flush();
// ArrayBuffer(5) [ 108, 111 ]
```

`.flush()`方法将缓冲的数据作为`ArrayBuffer`（如果`asUint8Array: true`，则为`Uint8Array`）返回，并清除内部缓冲区。

要手动设置内部缓冲区的大小（以字节为单位），请传递`highWaterMark`的值：

```ts
const sink = new Bun.ArrayBufferSink({
  highWaterMark: 1024 * 1024, // 1 MB
});
```

<details>
<summary>参考</summary>

```ts
/**
 * 快速的增量写入器，在结束时变成`ArrayBuffer`。
 */
export class ArrayBufferSink {
  constructor();

  start(options?: {
    asUint8Array?: boolean;
    /**
     * 预先分配指定大小的内部缓冲区
     * 当块大小较小时，这可以显著提高性能
     */
    highWaterMark?: number;
    /**
     * 在{@link ArrayBufferSink.flush}时，以`Uint8Array`返回写入的数据。
     * 写入将从缓冲区的开头重新开始。
     */
    stream?: boolean;
  }): void;

  write(
    chunk: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer
  ): number;
  /**
   * 刷新内部缓冲区
   *
   * 如果{@link ArrayBufferSink.start}传递了`stream`选项，这将返回一个`ArrayBuffer`
   * 如果{@link ArrayBufferSink.start}传递了`stream`选项和`asUint8Array`，这将返回一个`Uint8Array`
   * 否则，这将返回自上次刷新以来写入的字节数
   *
   * 此API可能会稍后更改以分离Uint8ArraySink和ArrayBufferSink
   */
  flush(): number | Uint8Array | ArrayBuffer;
  end(): ArrayBuffer | Uint8Array;
}
```

</details>
