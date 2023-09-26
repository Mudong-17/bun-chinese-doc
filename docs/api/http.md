---
outline: "deep"
---

# HTTP server

这个页面主要记录了 Bun 的本地`Bun.serve` API。Bun 还实现了[`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)和 Node.js 的[`http`](https://nodejs.org/api/http.html)和[`https`](https://nodejs.org/api/https.html)模块。

> 这些模块已经重新实现以使用 Bun 的快速内部 HTTP 基础设施。您可以直接使用这些模块；依赖这些模块的框架（如[Express](https://expressjs.com/)）应该可以直接使用。有关详细的兼容性信息，请参阅[运行时 > Node.js API](/runtime/nodejs-api.md)。

要启动一个高性能的 HTTP 服务器并拥有一个干净的 API，推荐使用[`Bun.serve`](#Bun.serve)。

## `Bun.serve()`

使用`Bun.serve`在 Bun 中启动 HTTP 服务器。

```ts
Bun.serve({
  fetch(req) {
    return new Response("Bun!");
  },
});
```

`fetch`处理程序处理传入的请求。它接收一个[`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request)对象并返回一个[`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)或`Promise<Response>`。

```ts
Bun.serve({
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/") return new Response("Home page!");
    if (url.pathname === "/blog") return new Response("Blog!");
    return new Response("404!");
  },
});
```

要配置服务器将监听的端口和主机名：

```ts
Bun.serve({
  port: 8080, // 默认为$BUN_PORT、$PORT、$NODE_PORT，否则为3000
  hostname: "mydomain.com", // 默认为"0.0.0.0"
  fetch(req) {
    return new Response("404!");
  },
});
```

要在[Unix 域套接字](https://en.wikipedia.org/wiki/Unix_domain_socket)上侦听：

```ts
Bun.serve({
  unix: "/tmp/my-socket.sock", // 套接字路径
  fetch(req) {
    return new Response(`404!`);
  },
});
```

## 错误处理

要激活开发模式，请设置`development: true`。默认情况下，除非`NODE_ENV`为`production`，否则开发模式是 _启用的_。

```ts
Bun.serve({
  development: true,
  fetch(req) {
    throw new Error("woops!");
  },
});
```

在开发模式下，Bun 将在浏览器中显示内置的错误页面。

![Bun的内置500页](/exception_page.png)

要处理服务器端错误，请实现一个`error`处理程序。此函数应返回在发生错误时提供给客户端的`Response`。在`development`模式下，此响应将覆盖 Bun 的默认错误页面。

```ts
Bun.serve({
  fetch(req) {
    throw new Error("woops!");
  },
  error(error) {
    return new Response(`<pre>${error}\n${error.stack}</pre>`, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  },
});
```

> [了解有关 Bun 调试的更多信息](https://bun.sh/docs/runtime/debugger)

调用`Bun.serve`返回一个`Server`对象。要停止服务器，请调用`.stop()`方法。

```ts
const server = Bun.serve({
  fetch() {
    return new Response("Bun!");
  },
});

server.stop();
```

## TLS

Bun 默认支持 TLS（HTTPS），由[BoringSSL](https://boringssl.googlesource.com/boringssl)提供支持。要启用 TLS，请在服务器配置中提供`key`和`cert`值。这两者都是启用 TLS 所必需的。

```ts-diff
  Bun.serve({
    fetch(req) {
      return new Response("Hello!!!");
    },

+   tls: {
+     key: Bun.file("./key.pem"),
+     cert: Bun.file("./cert.pem"),
+   }
  });
```

`key`和`cert`字段期望您的 TLS 密钥和证书的 _内容_，而不是路径。这可以是字符串、`BunFile`、`TypedArray`或`Buffer`。

```ts
Bun.serve({
  fetch() {},

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

如果您的私钥使用密码短语加密，请提供`passphrase`值以解密它。

```ts-diff
  Bun.serve({
    fetch(req) {
      return new Response("Hello!!!");
    },

    tls: {
      key: Bun.file("./key.pem"),
      cert: Bun.file("./cert.pem"),
+     passphrase: "my-secret-passphrase",
    }
  });
```

另外，您可以通过为`ca`指定值来覆盖可信 CA 证书。默认情况下，服务器将信任 Mozilla 策划的知名 CA 列表。当指定`ca`时，Mozilla 列表将被覆盖。

```ts-diff
  Bun.serve({
    fetch(req) {
      return new Response("Hello!!!");
    },
    tls: {
      key: Bun.file("./key.pem"), // TLS密钥的路径
      cert: Bun.file("./cert.pem"), // TLS证书的路径
+     ca: Bun.file("./ca.pem"), // 根CA证书的路径
    }
  });
```

要覆盖 Diffie-Hellman 参数：

```ts
Bun.serve({
  // ...
  tls: {
    // 其他配置
    dhParamsFile: "/path/to/dhparams.pem", // Diffie-Hellman参数的路径
  },
});
```

## 对象语法

到目前为止，本页的示例已经使用了明确的`Bun.serve` API。Bun 还支持一种备用语法。

```ts


import {type Serve} from "bun";

export default {
  fetch(req) {
    return new Response("Bun!");
  },
} satisfies Serve;
```

不要将服务器选项传递给`Bun.serve`，而是将其`export default`。此文件可以直接执行；当 Bun 看到一个包含`fetch`处理程序的`default`导出的文件时，它会在底层将其传递给`Bun.serve`。

<!-- 此语法有一个主要优势：它可以立即启用热重载。当任何源文件发生更改时，Bun将使用更新的代码重新加载服务器，而不会重新启动进程。这使热重载几乎是瞬时的。在启动服务器时，可以使用`--hot`标志启用热重载。 -->

<!-- ```bash
$ bun --hot server.ts
``` -->

<!-- 在明确使用`Bun.serve` API时，也可以配置热重载；有关详细信息，请参阅[运行时 > 热重载](/runtime/hot)。 -->

## 流式文件

要流式传输文件，请返回一个带有`BunFile`对象作为主体的`Response`对象。

```ts
Bun.serve({
  fetch(req) {
    return new Response(Bun.file("./hello.txt"));
  },
});
```

> ⚡️ **速度** — Bun 在可能的情况下自动使用[`sendfile(2)`](https://man7.org/linux/man-pages/man2/sendfile.2.html)系统调用，启用内核中的零拷贝文件传输，这是发送文件的最快方式。

您可以使用`Bun.file`对象上的[`slice(start, end)`](https://developer.mozilla.org/en-US/docs/Web/API/Blob/slice)方法发送文件的一部分。这会自动在`Response`对象上设置`Content-Range`和`Content-Length`头。

```ts
Bun.serve({
  fetch(req) {
    // 解析`Range`头
    const [start = 0, end = Infinity] = req.headers
      .get("Range") // Range: bytes=0-100
      .split("=") // ["Range: bytes", "0-100"]
      .at(-1) // "0-100"
      .split("-") // ["0", "100"]
      .map(Number); // [0, 100]

    // 返回文件的一部分
    const bigFile = Bun.file("./big-video.mp4");
    return new Response(bigFile.slice(start, end));
  },
});
```

## 基准测试

以下是 Bun 和 Node.js 的简单 HTTP 服务器的实现，它们对每个传入的`Request`都会响应`Bun!`。

```ts
Bun.serve({
  fetch(req: Request) {
    return new Response("Bun!");
  },
  port: 3000,
});
```

```ts
require("http")
  .createServer((req, res) => res.end("Bun!"))
  .listen(8080);
```

在 Linux 上，`Bun.serve`服务器可以处理大约 2.5 倍于 Node.js 的请求每秒。

| 运行时  | 每秒请求数 |
| ------- | ---------- |
| Node 16 | ~64,000    |
| Bun     | ~160,000   |

![image](https://user-images.githubusercontent.com/709451/162389032-fc302444-9d03-46be-ba87-c12bd8ce89a0.png)

## 参考

> 查看 TypeScript 定义

```ts
interface Bun {
  serve(options: {
    fetch: (req: Request, server: Server) => Response | Promise<Response>;
    hostname?: string;
    port?: number;
    development?: boolean;
    error?: (error: Error) => Response | Promise<Response>;
    tls?: {
      key?:
        | string
        | TypedArray
        | BunFile
        | Array<string | TypedArray | BunFile>;
      cert?:
        | string
        | TypedArray
        | BunFile
        | Array<string | TypedArray | BunFile>;
      ca?: string | TypedArray | BunFile | Array<string | TypedArray | BunFile>;
      passphrase?: string;
      dhParamsFile?: string;
    };
    maxRequestBodySize?: number;
    lowMemoryMode?: boolean;
  }): Server;
}

interface Server {
  development: boolean;
  hostname: string;
  port: number;
  pendingRequests: number;
  stop(): void;
}
```
