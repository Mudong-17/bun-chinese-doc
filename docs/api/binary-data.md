这个页面旨在介绍在 JavaScript 中处理二进制数据的方法。Bun 实现了许多用于处理二进制数据的数据类型和实用工具，其中大多数是 Web 标准。任何 Bun 特定的 API 都将被明确标注。

以下是一个快速的“速查表”，也可作为目录使用。单击左列中的项目以跳转到该部分。

| 名称       | 描述                                                                                                                       |
| ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| TypedArray | 一系列类，为与二进制数据交互提供类似于`Array`的接口。包括`Uint8Array`、`Uint16Array`、`Int8Array`等。                      |
| Buffer     | `Uint8Array`的子类，实现了许多便利方法。与表中的其他元素不同，这是一个 Node.js API（Bun 实现了它）。它不能在浏览器中使用。 |
| DataView   | 一个提供了对`ArrayBuffer`上的一些字节进行读取或写入的`get/set` API 的类。通常用于读取或写入二进制协议。                    |
| Blob       | 通常表示文件的只读二进制数据块。具有 MIME 类型、大小和将其转换为`ArrayBuffer`、`ReadableStream`和字符串的方法。            |
| BunFile    | 仅限 Bun。表示在磁盘上延迟加载的文件的`Blob`子类。使用`Bun.file(path)`创建。                                               |

## `ArrayBuffer` 和视图

直到 2009 年，JavaScript 中没有本地语言方式来存储和操作二进制数据。ECMAScript v5 引入了一系列新的机制来实现这一点。最基本的构建块是`ArrayBuffer`，它是一种表示内存中一系列字节的简单数据结构。

```ts
// 此缓冲区可以存储8个字节
const buf = new ArrayBuffer(8);
```

尽管它的名字是`ArrayBuffer`，但它并不是一个数组，也不支持数组方法和运算符。事实上，没有直接从`ArrayBuffer`读取或写入值的方法。除了检查其大小并从中创建“片段”外，几乎没有什么可以做的。

```ts
const buf = new ArrayBuffer(8);

buf.byteLength; // => 8

const slice = buf.slice(0, 4); // 返回新的ArrayBuffer
slice.byteLength; // => 4
```

要做有趣的事情，我们需要一种称为“视图”的构造。视图是一个类，它*包装*一个`ArrayBuffer`实例，允许您读取和操作底层数据。有两种类型的视图：*类型化数组*和`DataView`。

### `DataView`

`DataView`类是用于读取和操作`ArrayBuffer`中的数据的较低级别接口。

下面我们创建一个新的`DataView`并将第一个字节设置为 5。

```ts
const buf = new ArrayBuffer(4);
// [0x0, 0x0, 0x0, 0x0]

const dv = new DataView(buf);
dv.setUint8(0, 3); // 在字节偏移0处写入值3
dv.getUint8(0); // => 3
// [0x11, 0x0, 0x0, 0x0]
```

现在让我们在字节偏移`1`处写入一个`Uint16`。这需要两个字节。我们使用值`513`，它是`2 * 256 + 1`；以字节表示，它是`00000010 00000001`。

```ts
dv.setUint16(1, 513);
// [0x11, 0x10, 0x1, 0x0]

console.log(dv.getUint16(1)); // => 513
```

现在我们已经为底层`ArrayBuffer`中的前三个字节分配了一个值。尽管第二和第三个字节是使用`set

Uint16`写入的，但`getUint16`会自动处理这两个字节，并返回合并的结果。

### 类型化数组（TypedArray）

类型化数组是 ECMAScript 6 引入的一种构造，它是对`ArrayBuffer`的包装，允许您像使用普通 JavaScript 数组一样使用它们。

有多种类型化数组，包括`Uint8Array`、`Uint16Array`、`Int32Array`等，它们允许您在`ArrayBuffer`上以不同的数据类型操作数据。

以下是一个使用`Uint8Array`的示例：

```ts
const buf = new ArrayBuffer(4);
const view = new Uint8Array(buf);

view[0] = 1;
view[1] = 2;
view[2] = 3;
view[3] = 4;

console.log(view); // => Uint8Array [ 1, 2, 3, 4 ]
```

在上述示例中，我们首先创建一个长度为 4 的`ArrayBuffer`，然后创建一个`Uint8Array`视图来操作它。我们分别将值 1、2、3 和 4 设置到视图的不同索引位置。最后，我们查看了`Uint8Array`的内容，它会显示我们刚刚设置的值。

需要注意的是，不同类型化数组的方法和属性会略有不同，这取决于底层数据的数据类型。在处理二进制数据时，类型化数组通常是最常见的选择。

### `Buffer`

`Buffer`是 Node.js 中的一个类，它与`TypedArray`类似，但在某些方面更加强大。它专门用于处理二进制数据，特别是在 I/O 操作中。

以下是一个示例，演示如何在 Node.js 中使用`Buffer`：

```js
const buffer = Buffer.alloc(4); // 创建一个包含4个字节的Buffer
buffer.writeUInt8(1, 0); // 在偏移0处写入一个无符号8位整数
buffer.writeUInt8(2, 1); // 在偏移1处写入一个无符号8位整数
buffer.writeUInt8(3, 2); // 在偏移2处写入一个无符号8位整数
buffer.writeUInt8(4, 3); // 在偏移3处写入一个无符号8位整数

console.log(buffer); // <Buffer 01 02 03 04>
```

在上述示例中，我们首先使用`Buffer.alloc`创建了一个包含 4 个字节的 Buffer。然后，我们使用`writeUInt8`方法在不同的偏移位置写入无符号 8 位整数。最后，我们查看了 Buffer 的内容。

`Buffer`在 Node.js 中非常有用，因为它们与文件 I/O 和网络通信等操作紧密集成。但需要注意的是，在浏览器环境中，`Buffer`不可用，因此必须使用`TypedArray`或`DataView`来处理二进制数据。

### `Blob`

`Blob`表示不可变的、原始数据的片段或文件。它通常用于处理二进制数据，例如图像、音频和视频文件。

以下是一个创建和使用`Blob`的示例：

```js
// 创建一个包含文本的Blob
const textBlob = new Blob(["Hello, world!"], { type: "text/plain" });

// 创建一个包含二进制数据的Blob
const binaryData = new Uint8Array([1, 2, 3, 4, 5]);
const binaryBlob = new Blob([binaryData], { type: "application/octet-stream" });

// 将Blob转换为ArrayBuffer
const arrayBufferPromise = binaryBlob.arrayBuffer();
arrayBufferPromise.then((arrayBuffer) => {
  console.log(new Uint8Array(arrayBuffer)); // Uint8Array [ 1, 2, 3, 4, 5 ]
});

// 获取Blob的大小和类型
console.log(textBlob.size); // 13
console.log(textBlob.type); // 'text/plain'
```

在上述示例中，我们首先创建了一个包含文本和二进制数据的两个不同 Blob。然后，我们使用`arrayBuffer`方法将二进制 Blob 转换为 ArrayBuffer，以便进一步处理。最后，我们获取了 Blob 的大小和类型。

`Blob`通常用于处理从文件上传、`Fetch API`响应和其他数据源返回的二进制数据。

### `BunFile`

`BunFile`是 Bun 框架中的一个特定概念，用于表示在磁盘上的文件。它是`Blob`的子类，具有额外的功能，例如文件路径和延迟加载。

以下是一个示例，演示如何在 Bun 中使用`BunFile`：

```js
const { Bun, BunFile } = require("bun");

const bun = new Bun();

// 创建一个BunFile对象
const file = bun.file("/path/to/myfile.txt");

// 读取文件内容
file
  .readText()
  .then((content) => {
    console.log(content);
  })
  .catch((error) => {
    console.error(error);
  });
```

在上述示例中，我们首先创建了一个`Bun`实例，然后使用`bun.file()`方法创建了一个`BunFile`对象，表示磁盘上的文件。接下来，我们使用`readText()`方法读取文件的文本内容。`BunFile`还提供了许多其他方法，用于处理文件的不同方面，例如读取二进制数据、检查文件是否存在等等。

请注意，`BunFile`是 Bun 框架的一部分，不是标准 JavaScript API。它专门用于 Bun 应用程序中处理文件和静态资源。

这个速查表提供了关于`ArrayBuffer`、`TypedArray`、`DataView`、`Blob`、`Buffer`和`BunFile`的基本信息。根据您的具体需求，您可以选择使用其中一个或多个来处理二进制数据。如果您有任何进一步的问题或需要更详细的信息，请随时提出。
