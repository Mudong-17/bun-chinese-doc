---
outline: "deep"
---

# Utils

## `Bun.version`

一个包含当前运行的 `bun` CLI 版本的字符串。

```ts
Bun.version;
// => "0.6.4"
```

## `Bun.revision`

[Bun](https://github.com/oven-sh/bun) 的 git 提交版本，用于创建当前的 `bun` CLI。

```ts
Bun.revision;
// => "f02561530fda1ee9396f51c8bc99b38716e38296"
```

## `Bun.env`

`process.env` 的别名。

## `Bun.main`

当前程序入口的绝对路径（使用 `bun run` 执行的文件）。

```ts
Bun.main;
// /path/to/script.ts
```

这对于确定脚本是直接执行还是被另一个脚本导入很有用。

```ts
if (import.meta.path === Bun.main) {
  // 这个脚本是直接执行的
} else {
  // 这个文件被另一个脚本导入
}
```

这类似于 Node.js 中的 [`require.main = module` 技巧](https://stackoverflow.com/questions/6398196/detect-if-called-through-require-or-directly-by-command-line)。

## `Bun.sleep()`

`Bun.sleep(ms: number)`

返回一个在指定毫秒数后解析的 `Promise`。

```ts
console.log("你好");
await Bun.sleep(1000);
console.log("一秒后你好！");
```

或者，传递一个 `Date` 对象以接收在那个时间点解析的 `Promise`。

```ts
const 未来的一秒 = new Date(Date.now() + 1000);

console.log("你好");
await Bun.sleep(未来的一秒);
console.log("一秒后你好！");
```

## `Bun.sleepSync()`

`Bun.sleepSync(ms: number)`

`Bun.sleep` 的阻塞同步版本。

```ts
console.log("你好");
Bun.sleepSync(1000); // 阻塞线程一秒钟
console.log("一秒后你好！");
```

## `Bun.which()`

`Bun.which(bin: string)`

返回可执行文件的路径，类似于在终端中输入 `which`。

```ts
const ls = Bun.which("ls");
console.log(ls); // "/usr/bin/ls"
```

默认情况下，Bun 查看当前的 `PATH` 环境变量来确定路径。要配置 `PATH`：

```ts
const ls = Bun.which("ls", {
  PATH: "/usr/local/bin:/usr/bin:/bin",
});
console.log(ls); // "/usr/bin/ls"
```

通过传递一个 `cwd` 选项来从特定目录解析可执行文件。

```ts
const ls = Bun.which("ls", {
  cwd: "/tmp",
  PATH: "",
});

console.log(ls); // null
```

## `Bun.peek()`

`Bun.peek(prom: Promise)`

在 `await` 或 `.then` 之前读取 Promise 的结果，但仅当 Promise 已经完成或拒绝时。

```ts
import { peek } from "bun";

const promise = Promise.resolve("你好");

// 无需 await！
const result = peek(promise);
console.log(result); // "你好"
```

这在尝试减少性能敏感代码中不必要的微任务数时很重要。这是一个高级 API，除非你知道自己在做什么，否则最好不要使用它。

```ts
import { peek } from "bun";
import { expect, test } from "bun:test";

test("peek", () => {
  const promise = Promise.resolve(true);

  // 不需要 await！
  expect(peek(promise)).toBe(true);

  // 如果我们再次 peek，它将返回相同的值
  const again = peek(promise);
  expect(again).toBe(true);

  // 如果我们 peek 一个非 Promise，它将返回该值
  const value = peek(42);
  expect(value).toBe(42);

  // 如果我们 peek 一个挂起的 Promise，它将再次返回 Promise
  const pending = new Promise(() => {});
  expect(peek(pending)).toBe(pending);

  // 如果我们 peek 一个拒绝的 Promise，它将：
  // - 返回错误
  // - 不标记 Promise 为已处理
  const rejected = Promise.reject(new Error("成功测试 Promise 拒绝"));
  expect(peek(rejected).message).toBe("成功测试 Promise 拒绝");
});
```

`peek.status` 函数允许你读取 Promise 的状态而不解析它。

```ts
import { peek } from "bun";
import { expect, test } from "bun:test";

test("peek.status", () => {
  const promise = Promise.resolve(true);
  expect(peek.status(promise)).toBe("fulfilled");

  const pending = new Promise(() => {});
  expect(peek.status(pending)).toBe("pending");

  const rejected = Promise.reject(new Error("哦不"));
  expect(peek.status(rejected)).toBe("rejected");
});
```

## `Bun.openInEditor()`

在默认编辑器中打开文件。Bun 通过 `$VISUAL` 或 `$EDITOR` 环境变量自动检测你的编辑器。

```ts
const 当前文件 = import.meta.url;
Bun.openInEditor(当前文件);
```

你可以通过 `bunfig.toml` 中的 `debug.editor` 设置来覆盖这一点。

```toml-diff#bunfig.toml
+ [debug]
+ editor = "code"
```

或者使用 `editor` 参数指定一个编辑器。你还可以指定行号和列号。

```ts
Bun.openInEditor(import.meta.url, {
  editor: "vscode", // 或 "subl"
  line: 10,
  column: 5,
});
```

## `Bun.ArrayBufferSink`

## `Bun.deepEquals()`

递归检查两个对象是否等价。这在 `bun:test` 中的 `expect().toEqual()` 内部使用。

```ts
const foo = { a: 1, b: 2, c: { d: 3 } };

// true
Bun.deepEquals(foo, { a: 1, b: 2, c: { d: 3 } });

// false
Bun.deepEquals(foo, { a: 1, b: 2, c: { d: 4 } });
```

可以使用第三个布尔参数启用 "strict" 模式。这由测试运行器中的 `expect().toStrictEqual()` 使用。

```ts
const a = { entries: [1, 2] };
const b = { entries: [1, 2], extra: undefined };

Bun.deepEquals(a, b); // => true
Bun.deepEquals(a, b, true); // => false
```

在严格模式下，以下内容被视为不等：

```ts
// 未定义的值
Bun.deepEquals({}, { a: undefined }, true); // false

// 数组中的 undefined
Bun.deepEquals(["asdf"], ["asdf", undefined], true); // false

// 稀疏数组
Bun.deepEquals([, 1], [undefined, 1], true); // false

// 对象字面量与具有相同属性的实例
class Foo {
  a = 1;
}
Bun.deepEquals(new Foo(), { a: 1 }, true); // false
```

## `Bun.escapeHTML()`

`Bun.escapeHTML(value: string | object | number | boolean): string`

从输入字符串中转义以下字符：

- `"` 变成 `"&quot;"`
- `&` 变成 `"&amp;"`
- `'` 变成 `"&#x27;"`
- `<` 变成 `"&lt;"`
- `>` 变成 `"&gt;"`

这个函数针对大量输入进行了优化。在 M1X 上，它的处理速度为每秒 480 MB 到 20 GB，取决于正在转义多少数据以及是否有非 ASCII 文本。非字符串类型将在转义之前转换为字符串。

## `Bun.fileURLToPath()`

将 `file://` URL 转换为绝对路径。

```ts
const path = Bun.fileURLToPath(new URL("file:///foo/bar.txt"));
console.log(path); // "/foo/bar.txt"
```

## `Bun.pathToFileURL()`

将绝对路径转换为 `file://` URL。

```ts
const url = Bun.pathToFileURL("/foo/bar.txt");
console.log(url); // "file:///foo/bar.txt"
```

## `Bun.gzipSync()`

使用 zlib 的 GZIP 算法压缩 `Uint8Array`。

```ts
const buf = Buffer.from("hello".repeat(100)); // Buffer 扩展 Uint8Array
const compressed = Bun.gzipSync(buf);

buf; // => Uint8Array(500)
compressed; // => Uint8Array(30)
```

可选地，作为第二个参数传递一个参数对象：

<details>
<summary>zlib 压缩选项</summary>
```ts
export type ZlibCompressionOptions = {
  /**
   * 要使用的压缩级别。必须在 `-1` 和 `9` 之间。
   * - `-1` 使用默认压缩级别（当前为 `6`）
   * - `0` 不压缩
   * - `1` 最低压缩，速度最快
   * - `9` 最佳压缩，速度最慢
   */
  level?: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  /**
   * 为内部压缩状态分配的内存量。
   *
   * `1` 使用最少内存，但速度慢且降低了压缩比。
   *
   * `9` 使用最大内存以获得最佳速度。默认值为 `8`。
   */
  memLevel?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  /**
   * 窗口大小的以 2 为底的对数（历史缓冲区的大小）。
   *
   * 较大的值会增加内存使用量，但会提高压缩比。
   *
   * 支持以下值范围：
   * - `9..15`：输出将具有 zlib 标头和尾部（Deflate）
   * - `-9..-15`：输出将**不会**具有 zlib 标头或尾部（原始 Deflate）
   * - `25..31`（16+`9..15`）：输出将具有 gzip 标头和尾部（gzip）
   *
   * gzip 标头将不包含文件名、额外数据、注释、修改时间（设置为零）和头部 CRC。
   */
  windowBits?:
    | -9
    | -10
    | -11
    | -12
    | -13
    | -14
    | -15
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 25
    | 26
    | 27
    | 28
    | 29
    | 30
    | 31;
  /**
   * 调整压缩算法。
   *
   * - `Z_DEFAULT_STRATEGY`：用于正常数据 **（默认）**
   * - `Z_FILTERED`：用于由过滤器或预测器生成的数据
   * - `Z_HUFFMAN_ONLY`：强制仅使用 Huffman 编码（没有字符串匹配）
   * - `Z_RLE`：限制匹配距离为一（游程编码）
   * - `Z_FIXED` 阻止使用动态 Huffman 编码
   *
   * `Z_RLE` 设计得几乎与 `Z_HUFFMAN_ONLY` 一样快，但对于 PNG 图像数据提供更好的压缩。
   *
   * `Z_FILTERED` 强制更多的哈夫曼编码和更少的字符串匹配，它在 `Z_DEFAULT_STRATEGY` 和 `Z_HUFFMAN_ONLY` 之间是中间的。
   * 过滤数据主要由小值组成，具有稍微随机的分布。
   */
  strategy?: number;
};
```

</details>

## `Bun.gunzipSync()`

使用 zlib 的 GUNZIP 算法解压缩 `Uint8Array`。

```ts
const buf = Buffer.from("hello".repeat(100)); // Buffer 扩展 Uint8

Array;
const compressed = Bun.gunzipSync(buf);

const dec = new TextDecoder();
const uncompressed = Bun.inflateSync(compressed);
dec.decode(uncompressed);
// => "hellohellohello..."
```

## `Bun.deflateSync()`

使用 zlib 的 DEFLATE 算法压缩 `Uint8Array`。

```ts
const buf = Buffer.from("hello".repeat(100));
const compressed = Bun.deflateSync(buf);

buf; // => Uint8Array(25)
compressed; // => Uint8Array(10)
```

第二个参数支持与 [`Bun.gzipSync`](#bun.gzipSync) 相同的一组配置选项。

## `Bun.inflateSync()`

使用 zlib 的 INFLATE 算法解压缩 `Uint8Array`。

```ts
const buf = Buffer.from("hello".repeat(100));
const compressed = Bun.deflateSync(buf);

const dec = new TextDecoder();
const decompressed = Bun.inflateSync(compressed);
dec.decode(decompressed);
// => "hellohellohello..."
```

## `Bun.inspect()`

将对象序列化为与 `console.log` 打印的字符串完全相同的 `string`。

```ts
const obj = { foo: "bar" };
const str = Bun.inspect(obj);
// => '{\nfoo: "bar" \n}'

const arr = new Uint8Array([1, 2, 3]);
const str = Bun.inspect(arr);
// => "Uint8Array(3) [ 1, 2, 3 ]"
```

## `Bun.inspect.custom`

这是 Bun 用于实现 `Bun.inspect` 的符号。你可以重写它以自定义如何打印你的对象。它与 Node.js 中的 `util.inspect.custom` 完全相同。

```ts
class Foo {
  [Bun.inspect.custom]() {
    return "foo";
  }
}

const foo = new Foo();
console.log(foo); // => "foo"
```

## `Bun.nanoseconds()`

以 `number` 形式返回自当前 `bun` 进程启动以来的纳秒数。对于高精度计时和基准测试非常有用。

```ts
Bun.nanoseconds();
// => 7288958
```

## `Bun.readableStreamTo*()`

Bun 实现了一组用于异步消耗 `ReadableStream` 主体并将其转换为各种二进制格式的便捷函数。

```ts
const stream = (await fetch("https://bun.sh")).body;
stream; // => ReadableStream

await Bun.readableStreamToArrayBuffer(stream);
// => ArrayBuffer

await Bun.readableStreamToBlob(stream);
// => Blob

await Bun.readableStreamToJSON(stream);
// => object

await Bun.readableStreamToText(stream);
// => string

// 作为数组返回所有块
await Bun.readableStreamToArray(stream);
// => unknown[]

// 作为 FormData 对象返回所有块（编码为 x-www-form-urlencoded）
await Bun.readableStreamToFormData(stream);

// 作为 FormData 对象返回所有块（编码为 multipart/form-data）
await Bun.readableStreamToFormData(stream, multipartFormBoundary);
```

## `Bun.resolveSync()`

使用 Bun 的内部模块解析算法解析文件路径或模块规范符号。第一个参数是要解析的路径，第二个参数是 "root"。如果找不到匹配项，将抛出一个 `Error`。

```ts
Bun.resolveSync("./foo.ts", "/path/to/project");
// => "/path/to/project/foo.ts"

Bun.resolveSync("zod", "/path/to/project");
// => "/path/to/project/node_modules/zod/index.ts"
```

要相对于当前工作目录解析，将 `process.cwd` 或 `"."` 作为根传递。

```ts
Bun.resolveSync("./foo.ts", process.cwd());
Bun.resolveSync("./foo.ts", "/path/to/project");
```

要相对于包含当前文件的目录解析，传递 `import.meta.dir`。

```ts
Bun.resolveSync("./foo.ts", import.meta.dir);
```

## `bun:jsc` 中的 `serialize` 和 `deserialize`

要将 JavaScript 值保存到 ArrayBuffer 中并恢复，可以使用 `"bun:jsc"` 模块中的 `serialize` 和 `deserialize`。

```js
import { serialize, deserialize } from "bun:jsc";

const buf = serialize({ foo: "bar" });
const obj = deserialize(buf);
console.log(obj); // => { foo: "bar" }
```

在内部，[`structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone) 和 [`postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) 以相同的方式序列化和反序列化。这将 HTML 结构化克隆算法作为 ArrayBuffer 暴露给 JavaScript。
