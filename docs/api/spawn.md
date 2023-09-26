---
outline: "deep"
---

# Child processes

使用`Bun.spawn`或`Bun.spawnSync`生成子进程。

## 生成进程 (`Bun.spawn()`)

提供一个命令数组。`Bun.spawn()`的结果是一个`Bun.Subprocess`对象。

```ts
Bun.spawn(["echo", "hello"]);
```

`Bun.spawn`的第二个参数是一个参数对象，可用于配置子进程。

```ts
const proc = Bun.spawn(["echo", "hello"], {
  cwd: "./path/to/subdir", // 指定工作目录
  env: { ...process.env, FOO: "bar" }, // 指定环境变量
  onExit(proc, exitCode, signalCode, error) {
    // 退出处理程序
  },
});

proc.pid; // 子进程的进程ID
```

## 输入流

默认情况下，子进程的输入流未定义；可以使用`stdin`参数进行配置。

```ts
const proc = Bun.spawn(["cat"], {
  stdin: await fetch(
    "https://raw.githubusercontent.com/oven-sh/bun/main/examples/hashing.js"
  ),
});

const text = await new Response(proc.stdout).text();
console.log(text); // "const input = "hello world".repeat(400); ..."
```

| 值                    | 描述                                 |
| --------------------- | ------------------------------------ |
| `null`                | **默认值。** 不向子进程提供输入。    |
| `"pipe"`              | 返回 `FileSink` 以进行快速增量写入。 |
| `"inherit"`           | 继承父进程的 `stdin`。               |
| `Bun.file()`          | 从指定文件读取。                     |
| `TypedArray/DataView` | 使用二进制缓冲区作为输入。           |
| `Response`            | 使用响应的 `body` 作为输入。         |
| `Request`             | 使用请求的 `body` 作为输入。         |
| `number`              | 从具有给定文件描述符的文件中读取。   |

`"pipe"`选项允许从父进程逐步写入子进程的输入流。

```ts
const proc = Bun.spawn(["cat"], {
  stdin: "pipe", // 返回用于写入的FileSink
});

// 排队字符串数据
proc.stdin.write("hello");

// 排队二进制数据
const enc = new TextEncoder();
proc.stdin.write(enc.encode(" world!"));

// 发送缓冲数据
proc.stdin.flush();

// 关闭输入流
proc.stdin.end();
```

## 输出流

您可以通过`stdout`和`stderr`属性读取子进程的结果。默认情况下，这些属性是`ReadableStream`的实例。

```ts
const proc = Bun.spawn(["echo", "hello"]);
const text = await new Response(proc.stdout).text();
console.log(text); // => "hello"
```

通过将以下值之一传递给`stdout/stderr`来配置输出流：

| 值           | 描述                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------- |
| `"pipe"`     | **对于 `stdout` 的默认值。** 将输出传输到返回的 `Subprocess` 对象上的 `ReadableStream`。 |
| `"inherit"`  | **对于 `stderr` 的默认值。** 从父进程继承。                                              |
| `Bun.file()` | 写入指定的文件。                                                                         |
| `null`       | 写入 `/dev/null`。                                                                       |
| `number`     | 写入具有给定文件描述符的文件。                                                           |

## 退出处理

使用`onExit`回调来监听进程是否退出或被杀死。

```ts
const proc = Bun.spawn(["echo", "hello"], {
  onExit(proc, exitCode, signalCode, error) {
    // 退出处理程序
  },
});
```

为了方便起见，`exited`属性是一个`Promise`，在进程退出时解析。

```ts
const proc = Bun.spawn(["echo", "hello"]);

await proc.exited; // 当进程退出时解析
proc.killed; // 布尔值 — 进程是否被杀死？
proc.exitCode; // null | 数字
proc.signalCode; // null | "SIGABRT" | "SIGALRM" | ...
```

要终止进程：

```ts
const proc = Bun.spawn(["echo", "hello"]);
proc.kill();
proc.killed; // true

proc.kill(); // 指定退出代码
```

只要有子进程存在，父`bun`进程将不会终止。使用`proc.unref()`将子进程与父进程分离。

```
const proc = Bun.spawn(["echo", "hello"]);
proc.unref();
```

## 阻塞式 API (`Bun.spawnSync()`)

Bun 提供了`Bun.spawn`的同步等效版本，称为`Bun.spawnSync`。这是一个阻塞式 API，支持与`Bun.spawn`相同的输入和参数。它返回一个`SyncSubprocess`对象，与`Subprocess`有一些不同之处。

1. 它包含一个`success`属性，指示进程是否以零退出代码退出。
2. `stdout`和`stderr`属性是`Buffer`的实例，而不是`ReadableStream`。
3. 没有`stdin`属性。使用`Bun.spawn`逐步写入子进程的输入流。

```ts
const proc = Bun.spawnSync(["echo", "hello"]);

console.log(proc.stdout.toString());
// => "hello\n"
```

作为经验法则，异步的`Bun.spawn` API 更适用于 HTTP 服务器和应用程序，而`Bun.spawnSync`更适用于构建命令行工具。

## 基准测试

> ⚡️ 在底层，`Bun.spawn`和`Bun.spawnSync`使用[`posix_spawn(3)`](https://man7.org/linux/man-pages/man3/posix_spawn.3.html)。

Bun 的`spawnSync`比 Node.js 的`child_process`模块快 60％。

```bash
$ bun spawn.mjs
cpu: Apple M1 Max
runtime: bun 1.x (arm64-darwin)

benchmark              time (avg)             (min … max)       p75       p99      p995
--------------------------------------------------------- -----------------------------
spawnSync echo hi  888.14 µs/iter    (821.83 µs … 1.2 ms) 905.92 µs      1 ms   1.03 ms
$ node spawn.node.mjs
cpu: Apple M1 Max
runtime: node v18.9.1 (arm64-darwin)

benchmark              time (avg)             (min … max)       p75       p99      p995
--------------------------------------------------------- -----------------------------
spawnSync echo hi    1.47 ms/iter     (1.14 ms … 2.64 ms)   1.57 ms   2.37 ms   2.52 ms
```

## 参考

下面是 Spawn API 和类型的简单参考。实际类型具有复杂的泛型，以强类型化传递给`Bun.spawn`和`Bun.spawnSync`的选项与`Subprocess`流相匹配。有关完整详细信息，请查找[bun.d.ts](https://github.com/oven-sh/bun/blob/main/packages/bun-types/bun.d.ts)中定义的这些类型。

```ts
interface Bun {
  spawn(command: string[], options?: SpawnOptions.OptionsObject): Subprocess;
  spawnSync(
    command: string[],
    options?: SpawnOptions.OptionsObject
  ): SyncSubprocess;

  spawn(options: { cmd: string[] } & SpawnOptions.OptionsObject): Subprocess;
  spawnSync(
    options: { cmd: string[] } & SpawnOptions.OptionsObject
  ): SyncSubprocess;
}

namespace SpawnOptions {
  interface OptionsObject {
    cwd?: string;
    env?: Record<string, string>;
    stdin?: SpawnOptions.Readable;
    stdout?: SpawnOptions.Writable;
    stderr?: SpawnOptions.Writable;
    onExit?: (
      proc: Subprocess,
      exitCode: number | null,
      signalCode: string | null,
      error: Error | null
    ) => void;
  }

  type Readable =
    | "pipe"
    | "inherit"
    | "ignore"
    | null // 等同于 "ignore"
    | undefined // 使用默认值
    | BunFile
    | ArrayBufferView
    | number;

  type Writable =
    | "pipe"
    | "inherit"
    | "ignore"
    | null // 等同于 "ignore"
    | undefined // 使用默认值
    | BunFile
    | ArrayBufferView
    | number
    | ReadableStream
    | Blob
    | Response
    | Request;
}

interface Subprocess<Stdin, Stdout, Stderr> {
  readonly pid: number;
  // 这里的确切流类型是从泛型参数中派生的
  readonly stdin: number | ReadableStream | FileSink | undefined;
  readonly stdout: number | ReadableStream | undefined;
  readonly stderr: number | ReadableStream | undefined;

  readonly exited: Promise<number>;

  readonly exitCode: number | undefined;
  readonly signalCode: Signal | null;
  readonly killed: boolean;

  ref(): void;
  unref(): void;
  kill(code?: number): void;
}

interface SyncSubprocess<Stdout, Stderr> {
  readonly pid: number;
  readonly success: boolean;
  // 这里的确切缓冲区类型是从泛型参数中派生的
  readonly stdout: Buffer | undefined;
  readonly stderr: Buffer | undefined;
}

type ReadableSubprocess = Subprocess<any, "pipe", "pipe">;
type WritableSubprocess = Subprocess<"pipe", any, any>;
type PipedSubprocess = Subprocess<"pipe", "pipe", "pipe">;
type NullSubprocess = Subprocess<null, null, null>;

type ReadableSyncSubprocess = SyncSubprocess<"pipe", "pipe">;
type NullSyncSubprocess = SyncSubprocess<null, null>;

type Signal =
  | "SIGABRT"
  | "SIGALRM"
  | "SIGBUS"
  | "SIGCHLD"
  | "SIGCONT"
  | "SIGFPE"
  | "SIGHUP"
  | "SIGILL"
  | "SIGINT"
  | "SIGIO"
  | "SIGIOT"
  | "SIGKILL"
  | "SIGPIPE"
  | "SIGPOLL"
  | "SIGPROF"
  | "SIGPWR"
  | "SIGQUIT"
  | "SIGSEGV"
  | "SIGSTKFLT"
  | "SIGSTOP"
  | "SIGSYS"
  | "SIGTERM"
  | "SIGTRAP"
  | "SIGTSTP"
  | "SIGTTIN"
  | "SIGTTOU"
  | "SIGUNUSED"
  | "SIGURG"
  | "SIGUSR1"
  | "SIGUSR2"
  | "SIGVTALRM"
  | "SIGWINCH"
  | "SIGXCPU"
  | "SIGXFSZ"
  | "SIGBREAK"
  | "SIGLOST"
  | "SIGINFO";
```
