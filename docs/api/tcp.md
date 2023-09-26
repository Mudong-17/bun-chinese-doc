Bun 提供了一种用于实现性能敏感系统的本机 TCP API，例如数据库客户端、游戏服务器或任何需要通过 TCP 进行通信而不是 HTTP 的应用。这是一个面向库作者和高级用例的低级 API。

## 启动服务器 (`Bun.listen()`)

要使用`Bun.listen`启动 TCP 服务器：

```ts
Bun.listen({
  hostname: "localhost",
  port: 8080,
  socket: {
    data(socket, data) {}, // 从客户端接收的消息
    open(socket) {}, // 打开的套接字
    close(socket) {}, // 关闭的套接字
    drain(socket) {}, // 套接字已准备好接收更多数据
    error(socket, error) {}, // 错误处理程序
  },
});
```

<details>
<summary>为速度而设计的API</summary>

在 Bun 中，一组处理程序只需在每个服务器上声明一次，而不是像 Node.js 的`EventEmitters`或 Web 标准的`WebSocket` API 那样为每个套接字分配回调函数。

```ts
Bun.listen({
  hostname: "localhost",
  port: 8080,
  socket: {
    open(socket) {},
    data(socket, data) {},
    drain(socket) {},
    close(socket) {},
    error(socket, error) {},
  },
});
```

对于性能敏感的服务器，为每个套接字分配监听器可能会导致显着的垃圾回收压力并增加内存使用量。相比之下，Bun 仅为每个事件分配一个处理函数，并在所有套接字之间共享它。这是一个小优化，但它会累积起来。

</details>

可以在`open`处理程序中附加套接字的上下文数据。

```ts
type SocketData = { sessionId: string };

Bun.listen<SocketData>({
  hostname: "localhost",
  port: 8080,
  socket: {
    data(socket, data) {
      socket.write(`${socket.data.sessionId}: ack`);
    },
    open(socket) {
      socket.data = { sessionId: "abcd" };
    },
  },
});
```

要启用 TLS，请传递包含`key`和`cert`字段的`tls`对象。

```ts
Bun.listen({
  hostname: "localhost",
  port: 8080,
  socket: {
    data(socket, data) {},
  },
  tls: {
    // 可以是字符串、BunFile、TypedArray、Buffer或其数组
    key: Bun.file("./key.pem"),
    cert: Bun.file("./cert.pem"),
  },
});
```

`key`和`cert`字段期望是您 TLS 密钥和证书的内容。这可以是字符串、`BunFile`、`TypedArray`或`Buffer`。

```ts
Bun.listen({
  // ...
  tls: {
    // BunFile
    key: Bun.file("./key.pem"),
    // Buffer
    key: fs.readFileSync("./key.pem"),
    // 字符串
    key: fs.readFileSync("./key.pem", "utf8"),
    // 上述的数组
    key: [Bun.file("./key1.pem"), Bun.file("./key2.pem")],
  },
});
```

`Bun.listen`的结果是符合`TCPSocket`接口的服务器。

```ts
const server = Bun.listen({
  /* 配置 */
});

// 停止监听
// 参数确定是否关闭活动连接
server.stop(true);

// 即使服务器仍在监听，也要允许Bun进程退出
server.unref();
```

## 创建连接 (`Bun.connect()`)

使用`Bun.connect`连接到 TCP 服务器。使用`hostname`和`port`指定要连接的服务器。TCP 客户端可以定义与`Bun.listen`相同的一组处理程序，以及一些特定于客户端的处理程序。

```ts
// 客户端
const socket = Bun.connect({
  hostname: "localhost",
  port: 8080,

  socket: {
    data(socket, data) {},
    open(socket) {},
    close(socket) {},
    drain(socket) {},
    error(socket, error) {},

    // 特定于客户端的处理程序
    connectError(socket, error) {}, // 连接失败
    end(socket) {}, // 由服务器关闭的连接
    timeout(socket) {}, // 连接超时
  },
});
```

要求 TLS，请指定`tls: true`。

```ts
// 客户端
const socket = Bun.connect({
  // ... 配置
  tls: true,
});
```

## 热重载

TCP 服务器和套接字都可以使用新处理程序进行热重载。

<codetabs>

```ts#服务器
const server = Bun.listen({ /* 配置 */ })

// 重新加载所有活动服务器端套接字的处理程序
server.reload({
  socket: {
    data(){
      // 新的'data'处理程序
    }
  }
})
```

```ts#客户端
const socket = Bun.connect({ /* 配置 */ })
socket.reload({
  data(){
    // 新的'data'处理程序
  }
})
```

</codetabs>

## 缓冲

目前，Bun 中的 TCP 套接字不会缓冲数据。对于性能敏感的代码，需要仔细考虑缓冲。例如，这个：

```ts
socket.write("h");
socket.write("e");
socket.write("l");
socket.write("l");
socket.write("o");
```

...性能明显不如这个：

```ts
socket.write("hello");
```

为了简化这个问题，暂时考虑使用 Bun 的`ArrayBufferSink`，并使用`{stream: true}`选项：

```ts
const sink = new ArrayBufferSink({ stream: true, highWaterMark: 1024 });

sink.write("h");
sink.write("e");
sink.write("l");
sink.write("l");
sink.write("o");

queueMicrotask(() => {
  var data = sink.flush();
  if (!socket.write(data)) {
    // 如果套接字已满，请将数据放回到sink中
    sink.write(data);
  }
});
```

> **Corking** — 支持塞子（corking）是计划中的，但在此期间，必须使用`drain`处理程序手动管理背压。
