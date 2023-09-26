使用内置的`bun:ffi`模块以高效地从 JavaScript 调用本地库。它与支持 C ABI 的语言一起工作（如 Zig、Rust、C/C++、C#、Nim、Kotlin 等）。

## 使用（`bun:ffi`）

要打印`sqlite3`的版本号：

```ts
import { dlopen, FFIType, suffix } from "bun:ffi";

// `suffix` 可以是 "dylib"、"so" 或 "dll"，取决于平台
// 没有必要使用 "suffix"，它只是为了方便而存在
const path = `libsqlite3.${suffix}`;

const {
  symbols: {
    sqlite3_libversion, // 要调用的函数
  },
} = dlopen(
  path, // 库名称或文件路径
  {
    sqlite3_libversion: {
      // 无参数，返回一个字符串
      args: [],
      returns: FFIType.cstring,
    },
  }
);

console.log(`SQLite 3 版本：${sqlite3_libversion()}`);
```

## 性能

根据[我们的基准测试](https://github.com/oven-sh/bun/tree/main/bench/ffi)，`bun:ffi`大约比通过`Node-API`的 Node.js FFI 快 2-6 倍。

![image](/static/image/ffi.png)

Bun 生成并即时编译 C 绑定，以有效地在 JavaScript 类型和本机类型之间转换值。为了编译 C 代码，Bun 嵌入了[小型且快速的 C 编译器 TinyCC](https://github.com/TinyCC/tinycc)。

## 用法

### Zig

```zig
// add.zig
pub export fn add(a: i32, b: i32) i32 {
  return a + b;
}
```

要编译：

```bash
$ zig build-lib add.zig -dynamic -OReleaseFast
```

将共享库的路径和要导入到`dlopen`中的符号映射传递给：

```ts
import { dlopen, FFIType, suffix } from "bun:ffi";

const path = `libadd.${suffix}`;

const lib = dlopen(path, {
  add: {
    args: [FFIType.i32, FFIType.i32],
    returns: FFIType.i32,
  },
});

lib.symbols.add(1, 2);
```

### Rust

```rust
// add.rs
#[no_mangle]
pub extern "C" fn add(a: isize, b: isize) -> isize {
    a + b
}
```

要编译：

```bash
$ rustc --crate-type cdylib add.rs
```

## FFI 类型

支持以下`FFIType`值。

| `FFIType` | C 类型         | 别名                        |
| --------- | -------------- | --------------------------- |
| cstring   | `char*`        |                             |
| function  | `(void*)(*)()` | `fn`、`callback`            |
| ptr       | `void*`        | `pointer`、`void*`、`char*` |
| i8        | `int8_t`       | `int8_t`                    |
| i16       | `int16_t`      | `int16_t`                   |
| i32       | `int32_t`      | `int32_t`、`int`            |
| i64       | `int64_t`      | `int64_t`                   |
| i64_fast  | `int64_t`      |                             |
| u8        | `uint8_t`      | `uint8_t`                   |
| u16       | `uint16_t`     | `uint16_t`                  |
| u32       | `uint32_t`     | `uint32_t`                  |
| u64       | `uint64_t`     | `uint64_t`                  |
| u64_fast  | `uint64_t`     |                             |
| f32       | `float`        | `float`                     |
| f64       | `double`       | `double`                    |
| bool      | `bool`         |                             |
| char      | `char`         |                             |

## 字符串

JavaScript 字符串和 C 样式字符串不同，这使得在本机库中使用字符串变得复杂。

<details>
<summary>JavaScript字符串和C字符串有何不同？</summary>
JavaScript 字符串：

- UTF16 编码（每个字母 2 个字节），或者根据 JavaScript 引擎和使用的字符而有可能是 latin1 编码
- `length`单独存储
- 不可变

C 字符串：

- UTF8 编码（每个字母 1 个字节），通常是如此
- 不存储长度。相反，字符串以空字符结尾，这意味着长度是找到的第一个`\0`的索引
- 可变

</details>

为了解决这个问题，`bun:ffi`导出了`CString`，它扩展了 JavaScript 内置的`String`，以支持以空字符结尾的字符串，并添加了一些附加功能：

```ts
class CString extends String {
  /**
   * 给定一个 `ptr`，这将自动搜索封闭的 `\0` 字符并在必要时从UTF-8转码为UTF-16。
   */
  constructor(ptr: number, byteOffset?: number, byteLength?: number): string;

  /**
   * C字符串的ptr
   *
   * 此`CString`实例是字符串的克隆，因此在释放`ptr`后继续使用此实例是安全的。
   */
  ptr: number;
  byteOffset?: number;
  byteLength?: number;
}
```

要从以空字符结尾的字符串指针转换为 JavaScript 字符串：

```ts
const myString = new CString(ptr);
```

要从具有已知长度的指针转换为 JavaScript 字符串：

```ts
const myString = new CString(ptr, 0, byteLength);
```

`new CString()`构造函数克隆了 C 字符串，因此在释放`ptr`后继续使用`myString`是安全的。

```ts
my_library_free(myString.ptr);

// 这是安全的，因为myString是一个克隆
console.log(myString);
```

在`returns`中使用时，`FFIType.cstring`将指针强制转换为 JavaScript `string`。在`args

`中使用时，`FFIType.cstring`与`ptr`相同。

## 函数指针

> **注意** — 尚不支持异步函数。

要从 JavaScript 中调用函数指针，使用`CFunction`。这在使用 Bun 的 Node-API（napi）并且已加载了某些符号时非常有用。C/FFI 函数可以调用 JavaScript/TypeScript 代码。这在处理异步代码或每当需要从 C 中调用 JavaScript 代码时非常有用。

```ts
import { CFunction } from "bun:ffi";

let myNativeLibraryGetVersion = /* 以某种方式获得此指针 */;

const getVersion = new CFunction({
  returns: "cstring",
  args: [],
  ptr: myNativeLibraryGetVersion,
});
getVersion();
```

如果有多个函数指针，可以使用`linkSymbols`一次定义它们所有：

```ts
import { linkSymbols } from "bun:ffi";

// 在其他地方定义getVersionPtrs
const [majorPtr, minorPtr, patchPtr] = getVersionPtrs();

const lib = linkSymbols({
  // 与dlopen()不同，这里的名称可以是任何你想要的
  getMajor: {
    returns: "cstring",
    args: [],

    // 由于这不使用dlsym()，您必须提供有效的ptr
    // 该ptr可以是数字或bigint
    // 无效的指针将使您的程序崩溃。
    ptr: majorPtr,
  },
  getMinor: {
    returns: "cstring",
    args: [],
    ptr: minorPtr,
  },
  getPatch: {
    returns: "cstring",
    args: [],
    ptr: patchPtr,
  },
});

const [major, minor, patch] = [
  lib.symbols.getMajor(),
  lib.symbols.getMinor(),
  lib.symbols.getPatch(),
];
```

## 回调

使用`JSCallback`创建 JavaScript 回调函数，可以传递给 C/FFI 函数。C/FFI 函数可以调用 JavaScript 代码。这对于异步代码或每当需要从 C 代码中调用 JavaScript 代码时非常有用。

```ts
import { dlopen, JSCallback, ptr, CString } from "bun:ffi";

const {
  symbols: { search },
  close,
} = dlopen("libmylib", {
  search: {
    returns: "usize",
    args: ["cstring", "callback"],
  },
});

const searchIterator = new JSCallback(
  (ptr, length) => /hello/.test(new CString(ptr, length)),
  {
    returns: "bool",
    args: ["ptr", "usize"],
  }
);

const str = Buffer.from("wwutwutwutwutwutwutwutwutwutwutut\0", "utf8");
if (search(ptr(str), searchIterator)) {
  // 找到匹配！
}

// 以后一些时候：
setTimeout(() => {
  searchIterator.close();
  close();
}, 5000);
```

在完成 JSCallback 后，应调用`close()`来释放内存。

> **⚡️ 性能提示** — 为了稍微提高性能，请直接传递`JSCallback.prototype.ptr`，而不是`JSCallback`对象：
>
> ```ts
> const onResolve = new JSCallback((arg) => arg === 42, {
>   returns: "bool",
>   args: ["i32"],
> });
> const setOnResolve = new CFunction({
>   returns: "bool",
>   args: ["function"],
>   ptr: myNativeLibrarySetOnResolve,
> });
>
> // 这段代码运行稍微快一些：
> setOnResolve(onResolve.ptr);
>
> // 而不是这样：
> setOnResolve(onResolve);
> ```

## 指针

Bun 将指针表示为 JavaScript 中的`number`。

<details>
<summary>64位指针如何适应JavaScript数字？</summary>
64位处理器支持多达[52位的可寻址空间](https://en.wikipedia.org/wiki/64-bit_computing#Limits_of_processors)。[JavaScript数字](https://en.wikipedia.org/wiki/Double-precision_floating-point_format#IEEE_754_double-precision_binary_floating-point_format:_binary64)支持53位可用空间，因此我们有大约11位额外的空间。

**为什么不使用`BigInt`？** `BigInt`速度较慢。JavaScript 引擎分配一个单独的`BigInt`，这意味着它们无法适应常规的 JavaScript 值。如果将`BigInt`传递给函数，它将转换为`number`。

</details>

要将`TypedArray`转换为指针：

```ts
import { ptr } from "bun:ffi";
let myTypedArray = new Uint8Array(32);
const myPtr = ptr(myTypedArray);
```

要将指针转换为`ArrayBuffer`：

```ts
import { ptr, toArrayBuffer } from "bun:ffi";
let myTypedArray = new Uint8Array(32);
const myPtr = ptr(myTypedArray);

// toArrayBuffer接受一个`byteOffset`和`byteLength`
// 如果未提供`byteLength`，则假定它是以空字符结尾的指针
myTypedArray = new Uint8Array(toArrayBuffer(myPtr, 0, 32), 0, 32);
```

要从指针读取数据，有两种选项。对于长期存在的指针，使用`DataView`：

```ts
import { toArrayBuffer } from "bun:ffi";
let myDataView = new DataView(toArrayBuffer(myPtr, 0, 32));

console.log(
  myDataView.getUint8(0, true),
  myDataView.getUint8(1, true),
  myDataView.getUint8(2, true),
  myDataView.getUint8(3, true)
);
```

对于短暂存在的指针，使用`read`：

```ts
import { read } from "bun:ffi";

console.log(
  // ptr, byteOffset
  read.u8(myPtr, 0),
  read.u8(myPtr, 1),
  read.u8(myPtr, 2),
  read.u8(myPtr, 3)
);
```

`read`函数的行为与`DataView`类似，但通常更快，因为它不需要创建`DataView`或`ArrayBuffer`。

| `FFIType` |

| `read`函数 |
| ---------- | ---------- |
| ptr        | `read.ptr` |
| i8         | `read.i8`  |
| i16        | `read.i16` |
| i32        | `read.i32` |
| i64        | `read.i64` |
| u8         | `read.u8`  |
| u16        | `read.u16` |
| u32        | `read.u32` |
| u64        | `read.u64` |
| f32        | `read.f32` |
| f64        | `read.f64` |

### 内存管理

`bun:ffi`不会为您管理内存。您必须在使用完后释放内存。

#### 从 JavaScript 中

如果您希望跟踪`TypedArray`何时不再从 JavaScript 中使用，可以使用[FinalizationRegistry](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry)。

#### 从 C、Rust、Zig 等中

如果您希望跟踪`TypedArray`何时不再从 C 或 FFI 中使用，可以向`toArrayBuffer`或`toBuffer`传递回调和可选的上下文指针。在某个以后的时间点，一旦垃圾回收器释放了底层的`ArrayBuffer` JavaScript 对象，此函数将被调用。

预期的签名与[JavaScriptCore 的 C API](https://developer.apple.com/documentation/javascriptcore/jstypedarraybytesdeallocator?language=objc)中的签名相同：

```c
typedef void (*JSTypedArrayBytesDeallocator)(void *bytes, void *deallocatorContext);
```

```ts
import { toArrayBuffer } from "bun:ffi";

// 使用deallocatorContext：
toArrayBuffer(
  bytes,
  byteOffset,

  byteLength,

  // 这是一个可选的指向回调的指针
  deallocatorContext,

  // 这是指向函数的指针
  jsTypedArrayBytesDeallocator
);

// 没有deallocatorContext：
toArrayBuffer(
  bytes,
  byteOffset,

  byteLength,

  // 这是指向函数的指针
  jsTypedArrayBytesDeallocator
);
```

### 内存安全

极不建议在 FFI 之外使用原始指针。Bun 的将来版本可能会添加一个禁用`bun:ffi`的 CLI 标志。

### 指针对齐

如果 API 期望指针大小与`char`或`u8`之类的其他内容不同，请确保`TypedArray`也具有相同的大小。`u64*`与`[8]u8*`不完全相同，因为存在对齐问题。

### 传递指针

当 FFI 函数期望指针时，传递等效大小的`TypedArray`：

```ts
import { dlopen, FFIType } from "bun:ffi";

const {
  symbols: { encode_png },
} = dlopen(myLibraryPath, {
  encode_png: {
    // FFIType也可以作为字符串指定
    args: ["ptr", "u32", "u32"],
    returns: FFIType.ptr,
  },
});

const pixels = new Uint8ClampedArray(128 * 128 * 4);
pixels.fill(254);
pixels.subarray(0, 32 * 32 * 2).fill(0);

const out = encode_png(
  // pixels将作为指针传递
  pixels,

  128,
  128
);
```

[自动生成的包装器](https://github.com/oven-sh/bun/blob/6a65631cbdcae75bfa1e64323a6ad613a922cd1a/src/bun.js/ffi.exports.js#L180-L182)将指针转换为`TypedArray`。

<details>
<summary>硬模式</summary>

如果您不希望自动转换或者希望将指针指向`TypedArray`内的特定字节偏移量，您也可以直接获取指向`TypedArray`的指针：

```ts
import { dlopen, FFIType, ptr } from "bun:ffi";

const {
  symbols: { encode_png },
} = dlopen(myLibraryPath, {
  encode_png: {
    // FFIType也可以作为字符串指定
    args: ["ptr", "u32", "u32"],
    returns: FFIType.ptr,
  },
});

const pixels = new Uint8ClampedArray(128 * 128 * 4);
pixels.fill(254);

// 这返回一个数字！而不是一个BigInt！
const myPtr = ptr(pixels);

const out = encode_png(
  myPtr,

  // 维度：
  128,
  128
);
```

</details>

### 读取指针

```ts
const out = encode_png(
  // pixels将作为指针传递
  pixels,

  // 维度：
  128,
  128
);

// 假设它是以空字符结尾的，可以这样读取：
let png = new Uint8Array(toArrayBuffer(out));

// 保存到磁盘：
await Bun.write("out.png", png);
```
