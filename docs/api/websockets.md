---
outline: "deep"
---

# WebSockets

`Bun.serve()`支持服务器端 WebSockets，具有即时压缩、TLS 支持和 Bun 本地发布-订阅 API。

> **⚡️ 7 倍更高的吞吐量** — Bun 的 WebSockets 非常快速。对于 Linux x64 上的[简单聊天室](https://github.com/oven-sh/bun/tree/main/bench/websocket-server/README.md)，Bun 每秒可以处理比 Node.js + ["ws"](https://github.com/websockets/ws)多 7 倍的请求。
>
> | 每秒发送的消息数 | 运行时                         | 客户端数 |
> | ---------------- | ------------------------------ | -------- |
> | ~700,000         | (`Bun.serve`) Bun v0.2.1 (x64) | 16       |
> | ~100,000         | (`ws`) Node v18.10.0 (x64)     | 16       |

Bun 内部的 WebSocket 实现是构建在[uWebSockets](https://github.com/uNetworking/uWebSockets)之上。

## 启动 WebSocket 服务器

以下是一个使用`Bun.serve`构建的简单 WebSocket 服务器示例，其中所有传入的请求都会在`fetch`处理程序中升级为 WebSocket 连接。WebSocket 处理程序在`websocket`参数中声明。

```ts
Bun.serve({
  fetch(req, server) {
    // 升级请求为WebSocket
    if (server.upgrade(req)) {
      return; // 不返回响应
    }
    return new Response("升级失败 :(", { status: 500 });
  },
  websocket: {}, // 处理程序
});
```

支持以下 WebSocket 事件处理程序：

```ts
Bun.serve({
  fetch(req, server) {}, // 升级逻辑
  websocket: {
    message(ws, message) {}, // 收到消息
    open(ws) {}, // 打开连接
    close(ws, code, message) {}, // 关闭连接
    drain(ws) {}, // 连接准备接收更多数据
  },
});
```

<details>
<summary>为速度而设计的API?</summary>

在 Bun 中，处理程序只在每个服务器上声明一次，而不是每个套接字。

`ServerWebSocket`期望您将`WebSocketHandler`对象传递给`Bun.serve()`方法，该对象具有`open`、`message`、`close`、`drain`和`error`方法。这与客户端端的`WebSocket`类不同，后者扩展了`EventTarget`（onmessage、onopen、onclose）。

客户端通常不会打开很多套接字连接，因此基于事件的 API 是有意义的。

但是，服务器通常会打开**许多**套接字连接，这意味着：

- 为每个连接添加/删除事件侦听器所花费的时间会累加
- 额外的内存用于存储每个连接的回调函数的引用
- 通常，人们为每个连接创建新函数，这也意味着更多的内存

因此，与使用基于事件的 API 不同，`ServerWebSocket`期望您将一个包含`Bun.serve()`中每个事件的方法的单个对象传递，并且它会在每个连接中重复使用。

这导致内存使用较少，花费较少的时间添加/删除事件侦听器。

</details>

每个处理程序的第一个参数是处理事件的`ServerWebSocket`实例。`ServerWebSocket`类是一个快速的、Bun 本地的实现[`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)附加了一些额外的功能。

```ts
Bun.serve({
  fetch(req, server) {}, // 升级逻辑
  websocket: {
    message(ws, message) {
      ws.send(message); // 回传消息
    },
  },
});
```

### 发送消息

每个`ServerWebSocket`实例都有一个`.send()`方法，用于向客户端发送消息。它支持一系列输入类型。

```ts
ws.send("Hello world"); // 字符串
ws.send(response.arrayBuffer()); // ArrayBuffer
ws.send(new Uint8Array([1, 2, 3])); // TypedArray | DataView
```

### 头部

一旦升级成功，Bun 将按照[规范](https://developer.mozilla.org/en-US/docs/Web/HTTP/Protocol_upgrade_mechanism)发送`101 Switching Protocols`响应。可以在`server.upgrade()`调用中附加其他`headers`到此`Response`中。

```ts
Bun.serve({
  fetch(req, server) {
    const sessionId = await generateSessionId();
    server.upgrade(req, {
      headers: {
        "Set-Cookie": `SessionId=${sessionId}`,
      },
    });
  },
  websocket: {}, // 处理程序
});
```

### 上下文数据

可以在`.upgrade()`调用中附加上下文`data`到新的 WebSocket 中。此数据在 WebSocket 处理程序内的`ws.data`属性中可用。

```ts
type WebSocketData = {
  createdAt: number;
  channelId: string;
  authToken: string;
};

// TypeScript: 指定`data`的类型
Bun.serve<WebSocketData>({
  fetch(req, server) {
    // 使用库来解析cookies
    const cookies = parseCookies(req.headers.get("Cookie"));
    server.upgrade(req, {
      // 此对象必须符合WebSocketData的定义
      data: {
        createdAt: Date.now(),
        channelId: new URL(req.url).searchParams.get("channelId"),
        authToken: cookies["X-Token"],
      },
    });

    return undefined;
  },
  websocket: {
    // 当收到消息时调用的处理程序
    async message(ws, message) {
      const user = getUserFromToken(ws.data.authToken);

      await saveMessageToDatabase({
        channel: ws.data.channelId,
        message: String(message),
        userId: user.id,
      });
    },
  },
});
```

要从浏览器连接到此服务器，请创建一个新的`WebSocket`。

```ts
const socket = new WebSocket("ws://localhost:3000/chat");

socket.addEventListener("message", event => {
  console.log(event.data);
})
```

> **识别用户** — 当前在页面上设置的 cookies 将与 WebSocket 升级请求一起
>
> 发送，并在`fetch`处理程序的`req.headers`中可用。解析这些 cookies 以确定连接用户的身份，并相应地设置`data`的值。

### 发布/订阅

Bun 的`ServerWebSocket`实现实现了基于主题的广播的本地发布-订阅 API。个体套接字可以`.subscribe()`到主题（使用字符串标识符指定），并且可以`.publish()`消息到该主题的所有其他订户（不包括自身）。这个基于主题的广播 API 类似于[MQTT](https://en.wikipedia.org/wiki/MQTT)和[Redis Pub/Sub](https://redis.io/topics/pubsub)。

```ts
const server = Bun.serve<{ username: string }>({
  fetch(req, server) {
    const url = new URL(req.url);
    if (url.pathname === "/chat") {
      console.log(`升级！`);
      const username = getUsernameFromReq(req);
      const success = server.upgrade(req, { data: { username } });
      return success
        ? undefined
        : new Response("WebSocket升级错误", { status: 400 });
    }

    return new Response("Hello world");
  },
  websocket: {
    open(ws) {
      const msg = `${ws.data.username}已加入聊天`;
      ws.subscribe("the-group-chat");
      ws.publish("the-group-chat", msg);
    },
    message(ws, message) {
      // 这是一个群聊
      // 因此服务器会将收到的消息重新广播给所有人
      ws.publish("the-group-chat", `${ws.data.username}: ${message}`);
    },
    close(ws) {
      const msg = `${ws.data.username}已离开聊天`;
      ws.unsubscribe("the-group-chat");
      ws.publish("the-group-chat", msg);
    },
  },
});

console.log(`监听${server.hostname}:${server.port}`);
```

调用`.publish(data)`将消息发送给主题的所有订户，**除了**调用`.publish()`的套接字。要将消息发送给主题的所有订户，请在`Server`实例上使用`.publish()`方法。

```ts
const server = Bun.serve({
  websocket: {
    // ...
  },
});

// 监听某个外部事件
server.publish("the-group-chat", "Hello world");
```

### 压缩

可以使用`perMessageDeflate`参数启用每条消息的[压缩](https://websockets.readthedocs.io/en/stable/topics/compression.html)。

```ts
Bun.serve({
  fetch(req, server) {}, // 升级逻辑
  websocket: {
    // 启用压缩和解压缩
    perMessageDeflate: true,
  },
});
```

可以通过将布尔值作为`.send()`的第二个参数启用单个消息的压缩。

```ts
ws.send("Hello world", true);
```

要对压缩特性进行更细粒度的控制，请参阅[参考](#reference)。

### 反压

`ServerWebSocket`的`.send(message)`方法返回一个表示操作结果的`number`。

- `-1` — 消息已排队，但存在反压
- `0` — 由于连接问题，消息被丢弃
- `1+` — 已发送的字节数

这可以让您更好地控制服务器上的反压。

## 连接到 WebSocket 服务器

> **🚧** — WebSocket 客户端仍然无法通过完整的[Autobahn 测试套件](https://github.com/crossbario/autobahn-testsuite)并且不应被视为生产就绪。

Bun 实现了`WebSocket`类。要创建一个连接到`ws://`或`wss://`服务器的 WebSocket 客户端，请创建`WebSocket`的实例，就像在浏览器中一样。

```ts
const socket = new WebSocket("ws://localhost:3000");
```

在浏览器中，当前在页面上设置的 cookies 将与 WebSocket 升级请求一起发送。这是`WebSocket` API 的标准功能。

为方便起见，Bun 允许您直接在构造函数中设置自定义标头。这是`WebSocket`标准的 Bun 特定扩展。_这在浏览器中不起作用。_

```ts
const socket = new WebSocket("ws://localhost:3000", {
  headers: {
    // 自定义标头
  },
});
```

要将事件侦听器添加到套接字：

```ts
// 接收到消息
socket.addEventListener("message", (event) => {});

// 套接字打开
socket.addEventListener("open", (event) => {});

// 套接字关闭
socket.addEventListener("close", (event) => {});

// 错误处理程序
socket.addEventListener("error", (event) => {});
```

## 参考

```ts
namespace Bun {
  export function serve(params: {
    fetch: (req: Request, server: Server) => Response | Promise<Response>;
    websocket?: {
      message: (
        ws: ServerWebSocket,
        message: string | ArrayBuffer | Uint8Array
      ) => void;
      open?: (ws: ServerWebSocket) => void;
      close?: (ws: ServerWebSocket) => void;
      error?: (ws: ServerWebSocket, error: Error) => void;
      drain?: (ws: ServerWebSocket) => void;
      perMessageDeflate?:
        | boolean
        | {
            compress?: boolean | Compressor;
            decompress?: boolean | Compressor;
          };
    };
  }): Server;
}

type Compressor =
  | `"disable"`
  | `"shared"`
  | `"dedicated"`
  | `"3KB"`
  | `"4KB"`
  | `"8KB"`
  | `"16KB"`
  | `"32KB"`
  | `"64KB"`
  | `"128KB"`
  | `"256KB"`;

interface Server {
  pendingWebsockets: number;
  publish(
    topic: string,
    data: string | ArrayBufferView | ArrayBuffer,
    compress?: boolean
  ): number;
  upgrade(
    req: Request,
    options?: {
      headers?: HeadersInit;
      data?: any;
    }
  ): boolean;
}

interface ServerWebSocket {
  readonly data: any;
  readonly readyState: number;
  readonly remoteAddress: string;
  send(message: string | ArrayBuffer | Uint8Array, compress?: boolean): number;
  close(code?: number, reason?: string): void;
  subscribe(topic: string): void;
  unsubscribe(topic: string): void;
  publish(topic: string, message: string | ArrayBuffer | Uint8Array): void;
  isSubscribed(topic: string): boolean;
  cork(cb: (ws: ServerWebSocket) => void): void;
}
```
