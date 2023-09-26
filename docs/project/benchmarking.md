Bun 旨在提供高性能。它对性能关键路径进行了广泛的性能分析和基准测试。Bun 的所有公共基准测试的源代码可以在 Bun 存储库的 [`/bench`](https://github.com/oven-sh/bun/tree/main/bench) 目录中找到。

## 测量时间

为了精确测量时间，Bun 提供了两个运行时 API 函数：

1. Web 标准的[`performance.now()`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)函数。
2. `Bun.nanoseconds()`类似于`performance.now()`，但它返回自应用程序启动以来的纳秒数。您可以使用`performance.timeOrigin`将此值转换为 Unix 时间戳。

## 基准测试工具

在编写自己的基准测试时，选择正确的工具非常重要。

- 对于微基准测试，一个很好的通用工具是[`mitata`](https://github.com/evanwashere/mitata)。
- 对于负载测试，您必须使用至少与`Bun.serve()`一样快的 HTTP 基准测试工具，否则结果将不准确。一些流行的基于 Node.js 的基准测试工具，如[`autocannon`](https://github.com/mcollina/autocannon)，速度不够快。我们建议使用以下之一：
  - [`bombardier`](https://github.com/codesenberg/bombardier)
  - [`oha`](https://github.com/hatoo/oha)
  - [`http_load_test`](https://github.com/uNetworking/uSockets/blob/master/examples/http_load_test.c)
- 对于基准测试脚本或 CLI 命令，我们建议使用[`hyperfine`](https://github.com/sharkdp/hyperfine)。

## 测量内存使用

Bun 有两个堆栈。一个堆栈用于 JavaScript 运行时，另一个堆栈用于其他一切。

### JavaScript 堆栈统计

`bun:jsc`模块公开了一些用于测量内存使用的函数：

```ts
import { heapStats } from "bun:jsc";
console.log(heapStats());
```

<details>
<summary>查看示例统计信息</summary>

```ts
{
  heapSize: 1657575,
  heapCapacity: 2872775,
  extraMemorySize: 598199,
  objectCount: 13790,
  protectedObjectCount: 62,
  globalObjectCount: 1,
  protectedGlobalObjectCount: 1,
  // 堆栈中每种对象类型的计数
  objectTypeCounts: {
    CallbackObject: 25,
    FunctionExecutable: 2078,
    AsyncGeneratorFunction: 2,
    'RegExp String Iterator': 1,
    FunctionCodeBlock: 188,
    ModuleProgramExecutable: 13,
    String: 1,
    UnlinkedModuleProgramCodeBlock: 13,
    JSON: 1,
    AsyncGenerator: 1,
    Symbol: 1,
    GetterSetter: 68,
    ImportMeta: 10,
    DOMAttributeGetterSetter: 1,
    UnlinkedFunctionCodeBlock: 174,
    RegExp: 52,
    ModuleLoader: 1,
    Intl: 1,
    WeakMap: 4,
    Generator: 2,
    PropertyTable: 95,
    'Array Iterator': 1,
    JSLexicalEnvironment: 75,
    UnlinkedFunctionExecutable: 2067,
    WeakSet: 1,
    console: 1,
    Map: 23,
    SparseArrayValueMap: 14,
    StructureChain: 19,
    Set: 18,
    'String Iterator': 1,
    FunctionRareData: 3,
    JSGlobalLexicalEnvironment: 1,
    Object: 481,
    BigInt: 2,
    StructureRareData: 55,
    Array: 179,
    AbortController: 2,
    ModuleNamespaceObject: 11,
    ShadowRealm: 1,
    'Immutable Butterfly': 103,
    Primordials: 1,
    'Set Iterator': 1,
    JSGlobalProxy: 1,
    AsyncFromSyncIterator: 1,
    ModuleRecord: 13,
    FinalizationRegistry: 1,
    AsyncIterator: 1,
    InternalPromise: 22,
    Iterator: 1,
    CustomGetterSetter: 65,
    Promise: 19,
    WeakRef: 1,
    InternalPromisePrototype: 1,
    Function: 2381,
    AsyncFunction: 2,
    GlobalObject: 1,
    ArrayBuffer: 2,
    Boolean: 1,
    Math: 1,
    CallbackConstructor: 1,
    Error: 2,
    JSModuleEnvironment: 13,
    WebAssembly: 1,
    HashMapBucket: 300,
    Callee: 3,
    symbol: 37,
    string: 2484,
    Performance: 1,
    ModuleProgramCodeBlock: 12,
    JSSourceCode: 13,
    JSPropertyNameEnumerator: 3,
    NativeExecutable: 290,
    Number: 1,
    Structure: 1550,
    SymbolTable: 108,
    GeneratorFunction: 2,
    'Map Iterator': 1
  },
  protectedObjectTypeCounts: {
    CallbackConstructor: 1,
    BigInt: 1,
    RegExp: 2,
    GlobalObject: 1,
    UnlinkedModuleProgramCodeBlock: 13,
    HashMapBucket: 2,
    Structure: 41,
    JSPropertyNameEnumerator: 1
  }
}
```

</details>

JavaScript 是一种垃圾回收的语言，不是引用计数。对象不会立即在所有情况下被释放是正常的和正确的，尽管对象永远不会被释放不正常。

要强制手动运行垃圾回收：

```js
Bun.gc(true); // 同步
Bun.gc(false); // 异步
```

堆栈快照可让您检查未被释放的对象。您可以使用`bun:jsc

`模块创建堆栈快照，然后在 Safari 或 WebKit GTK 开发工具中查看它。生成堆栈快照：

```ts
import { generateHeapSnapshot } from "bun";

const snapshot = generateHeapSnapshot();
await Bun.write("heap.json", JSON.stringify(snapshot, null, 2));
```

要查看快照，请在 Safari 的开发工具中打开`heap.json`文件。

1. 打开开发者工具
2. 点击"时间轴"。
3. 在左侧菜单中点击"JavaScript 分配"。在您点击鉛笔图标以显示所有时间轴之前，可能不可见。
4. 点击"导入"并选择堆栈快照 JSON 文件。

<image alt="Import heap json" src="https://user-images.githubusercontent.com/709451/204428943-ba999e8f-8984-4f23-97cb-b4e3e280363e.png" caption="Importing a heap snapshot"/>

查看后，您应该看到类似于这样的内容：

<image alt="在Safari中查看堆栈快照" src="https://user-images.githubusercontent.com/709451/204429337-b0d8935f-3509-4071-b991-217794d1fb27.png" caption="在Safari Dev Tools中查看堆栈快照">

### 本地堆栈统计

Bun 使用 mimalloc 用于另一个堆栈。要报告非 JavaScript 内存使用的摘要，请设置`MIMALLOC_SHOW_STATS=1`环境变量。并在退出时打印统计信息。

```js
MIMALLOC_SHOW_STATS=1 bun script.js

# will show something like this:
heap stats:    peak      total      freed    current       unit      count
  reserved:   64.0 MiB   64.0 MiB      0       64.0 MiB                        not all freed!
 committed:   64.0 MiB   64.0 MiB      0       64.0 MiB                        not all freed!
     reset:      0          0          0          0                            ok
   touched:  128.5 KiB  128.5 KiB    5.4 MiB   -5.3 MiB                        ok
  segments:      1          1          0          1                            not all freed!
-abandoned:      0          0          0          0                            ok
   -cached:      0          0          0          0                            ok
     pages:      0          0         53        -53                            ok
-abandoned:      0          0          0          0                            ok
 -extended:      0
 -noretire:      0
     mmaps:      0
   commits:      0
   threads:      0          0          0          0                            ok
  searches:     0.0 avg
numa nodes:       1
   elapsed:       0.068 s
   process: user: 0.061 s, system: 0.014 s, faults: 0, rss: 57.4 MiB, commit: 64.0 MiB
```
