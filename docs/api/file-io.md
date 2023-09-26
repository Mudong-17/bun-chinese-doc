---
outline: "deep"
---

# File I/O

> **注意** — 此页面记录的`Bun.file`和`Bun.write` API 经过了大量优化，代表了使用 Bun 执行文件系统任务的推荐方式。对于尚不可用于`Bun.file`的操作，例如`mkdir`或`readdir`，您可以使用 Bun 的[几乎完整的](/runtime/nodejs-api.md#node:fs) [`node:fs`](https://nodejs.org/api/fs.html) 模块实现。

Bun 提供了一组优化的 API，用于读取和写入文件。

## 读取文件（`Bun.file()`）

`Bun.file(path): BunFile`

使用`Bun.file(path)`函数创建一个`BunFile`实例。`BunFile`表示一种懒加载的文件；初始化它实际上不会从磁盘读取文件。

```ts
const foo = Bun.file("foo.txt"); // 相对于cwd
foo.size; // 字节数
foo.type; // MIME类型
```

该引用符合[`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)接口，因此可以以不同的格式读取内容。

```ts
const foo = Bun.file("foo.txt");

await foo.text(); // 作为字符串的内容
await foo.stream(); // 作为ReadableStream的内容
await foo.arrayBuffer(); // 作为ArrayBuffer的内容
```

文件引用还可以使用数字[file descriptors](https://en.wikipedia.org/wiki/File_descriptor)或`file://` URL 创建。

```ts
Bun.file(1234);
Bun.file(new URL(import.meta.url)); // 对当前文件的引用
```

`BunFile`可以指向磁盘上不存在文件的位置。

```ts
const notreal = Bun.file("notreal.txt");
notreal.size; // 0
notreal.type; // "text/plain;charset=utf-8"
```

默认的 MIME 类型是`text/plain;charset=utf-8`，但可以通过向`Bun.file`传递第二个参数来覆盖它。

```ts
const notreal = Bun.file("notreal.json", { type: "application/json" });
notreal.type; // => "application/json;charset=utf-8"
```

为方便起见，Bun 将`stdin`、`stdout`和`stderr`公开为`BunFile`的实例。

```ts
Bun.stdin; // 只读
Bun.stdout;
Bun.stderr;
```

## 写入文件（`Bun.write()`）

`Bun.write(destination, data): Promise<number>`

`Bun.write`函数是一个多用途工具，用于将各种类型的数据写入磁盘。

第一个参数是`destination`，可以是以下任何类型：

- `string`：文件系统上的位置路径。使用`"path"`模块来操作路径。
- `URL`：一个`file://`描述符。
- `BunFile`：文件引用。

第二个参数是要写入的数据，可以是以下任何类型：

- `string`
- `Blob`（包括`BunFile`）
- `ArrayBuffer`或`SharedArrayBuffer`
- `TypedArray`（例如`Uint8Array`等）
- `Response`

所有可能的排列组合都使用当前平台上最快速的可用系统调用来处理。

<details>
<summary>查看系统调用</summary>

| 输出           | 输入          | 系统调用                             | 平台  |
| -------------- | ------------- | ------------------------------------ | ----- |
| 文件           | 文件          | copy_file_range                      | Linux |
| 文件           | 管道          | sendfile                             | Linux |
| 管道           | 管道          | splice                               | Linux |
| 终端           | 文件          | sendfile                             | Linux |
| 终端           | 终端          | sendfile                             | Linux |
| 套接字         | 文件或管道    | sendfile（如果是 http 而不是 https） | Linux |
| 文件（不存在） | 文件（路径）  | clonefile                            | macOS |
| 文件（存在）   | 文件          | fcopyfile                            | macOS |
| 文件           | Blob 或字符串 | write                                | macOS |
| 文件           | Blob 或字符串 | write                                | Linux |

</details>

要将字符串写入磁盘：

```ts
const data = `这是最好的时光，也是最坏的时光。`;
await Bun.write("output.txt", data);
```

要将文件复制到磁盘上的另一个位置：

```js
const input = Bun.file("input.txt");
const output = Bun.file("output.txt"); // 尚不存在！
await Bun.write(output, input);
```

要将字节数组写入磁盘：

```ts
const encoder = new TextEncoder();
const data = encoder.encode("datadatadata"); // Uint8Array
await Bun.write("output.txt", data);
```

要将文件写入`stdout`：

```ts
const input = Bun.file("input.txt");
await Bun.write(Bun.stdout, input);
```

要将 HTTP 响应的主体写入磁盘：

```ts
const response = await fetch("https://bun.sh");
await Bun.write("index.html", response);
```

## 使用`FileSink`进行增量写入

Bun 提供了一个本地的增量文件写入 API，称为`FileSink`。要从`BunFile`检索`FileSink`实例：

```ts
const file = Bun.file("output.txt");
const writer = file.writer();
```

要逐步写入文件，请调用`.write()`。

```ts
const file = Bun.file("output.txt");
const writer = file.writer();

writer.write("这是最好的时光\n");
writer.write("这是最坏的时光\n");
```

这些块将在内部进行缓冲。要将缓冲区刷新到磁盘上，请使用`.flush()`。这将返回已刷新的字节数。

```ts
writer.flush(); // 将缓冲区写入磁盘
```

当`FileSink`的*高水位标记*达到时，即其内部缓冲区已满时，缓冲区也会自动刷新。这个值可以配置。

```ts
const file = Bun.file("output.txt");
const writer = file.writer({ highWaterMark: 1024 * 1024 }); // 1MB
```

要刷新缓冲区并关闭文件：

```ts
writer.end();
```

请注意，默认情况下，`bun`进程将保持活动状态，直到使用`.end()`显式关闭此`FileSink`。要退出此行为，您可以对实例进行"unref"操作。

```ts
writer.unref();

// 以后要重新引用它
writer.ref();
```

## 基准测试

以下是 Linux `cat`命令的 3 行实现。

```ts
// 用法
// $ bun ./cat.ts ./path-to-file

import { resolve } from "path";

const path = resolve(process.argv.at(-1));
await Bun.write(Bun.stdout, Bun.file(path));
```

要运行文件：

```bash
$ bun ./cat.ts ./path-to-file
```

对于 Linux 上的大文件，它比 GNU `cat`运行快 2 倍。

![image](/cat.jpg)

## 参考

```ts
interface Bun {
  stdin: BunFile;
  stdout: BunFile;
  stderr: BunFile;

  file(path: string | number | URL, options?: { type?: string }): BunFile;

  write(
    destination: string | number | BunFile | URL,
    input:
      | string
      | Blob
      | ArrayBuffer
      | SharedArrayBuffer
      | TypedArray
      | Response
  ): Promise<number>;
}

interface BunFile {
  readonly size: number;
  readonly type: string;

  text(): Promise<string>;
  stream(): Promise<ReadableStream>;
  arrayBuffer(): Promise<ArrayBuffer>;
  json(): Promise<any>;
  writer(params: { highWaterMark?: number }): FileSink;
}

export interface FileSink {
  write(
    chunk: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer
  ): number;
  flush(): number | Promise<number>;
  end(error?: Error): number | Promise<number>;
  start(options?: { highWaterMark?: number }): void;
  ref(): void;
  unref(): void;
}
```
