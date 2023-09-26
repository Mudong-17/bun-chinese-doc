---
outline: "deep"
---

# Watch mode

Bun 支持两种通过 CLI 标志自动重新加载的方式：

- `--watch` 模式，当导入的文件更改时，硬重启 Bun 的进程。
- `--hot` 模式，当导入的文件更改时，对代码进行软重载（不重新启动进程）。

## `--watch` 模式

可以在`bun test`或运行 TypeScript、JSX 和 JavaScript 文件时使用监视模式。

要在`--watch`模式下运行文件：

```bash
$ bun --watch index.tsx
```

要在`--watch`模式下运行测试：

```bash
$ bun --watch test
```

在`--watch`模式下，Bun 会跟踪所有导入的文件并监视它们的更改。当检测到更改时，Bun 会重新启动进程，保留了初始运行中使用的相同一组 CLI 参数和环境变量。如果 Bun 崩溃，`--watch`将尝试自动重新启动进程。

> **⚡️ 重新加载很快。** 您可能已经习惯了文件系统监视器，它们有几层库包装了本机 API，或者更糟糕的是依赖于轮询。
>
> 相比之下，Bun 使用操作系统本机文件系统监视器 API，如 kqueue 或 inotify 来检测文件的更改。Bun 还进行了一些优化，以使其适用于更大的项目（例如设置高文件描述符的 rlimit，静态分配文件路径缓冲区，尽可能复用文件描述符等）。

以下示例显示了 Bun 在编辑文件时实时重新加载文件，VSCode 配置为在[每次按键](https://code.visualstudio.com/docs/editor/codebasics#_save-auto-save)时保存文件。

<codetabs>

```bash
$ bun run --watch watchy.tsx
```

```tsx
#watchy.tsx
import { serve } from "bun";
console.log("I restarted at:", Date.now());

serve({
  port: 4003,

  fetch(request) {
    return new Response("Sup");
  },
});
```

</codetabs>

![bun watch gif](https://user-images.githubusercontent.com/709451/228439002-7b9fad11-0db2-4e48-b82d-2b88c8625625.gif)

在监视模式下运行`bun test`和启用`save-on-keypress`：

```bash
$ bun --watch test
```

![bun test gif](https://user-images.githubusercontent.com/709451/228396976-38a23864-4a1d-4c96-87cc-04e5181bf459.gif)

## `--hot` 模式

使用`bun --hot`来在 Bun 中执行代码时启用热重载。

```bash
$ bun --hot server.ts
```

从入口点开始（上面示例中的`server.ts`），Bun 构建了所有导入的源文件的注册表（不包括`node_modules`中的文件），并监视它们的更改。当检测到更改时，Bun 执行"软重载"。所有文件都会重新评估，但所有全局状态（特别是`globalThis`对象）都会保留。

```ts
#server.ts
// 让TypeScript高兴
declare global {
  var count: number;
}

globalThis.count ??= 0;
console.log(`Reloaded ${globalThis.count} times`);
globalThis.count++;

// 防止 `bun run` 退出
setInterval(function () {}, 1000000);
```

如果使用`bun --hot server.ts`运行此文件，您将看到每次保存文件时重新加载计数递增。

```bash
$ bun --hot index.ts
Reloaded 1 times
Reloaded 2 times
Reloaded 3 times
```

传统的文件监视器（如`nodemon`）会重新启动整个进程，因此 HTTP 服务器和其他有状态的对象会丢失。相比之下，`bun --hot`能够在不重新启动进程的情况下反映更新的代码。

### HTTP 服务器

Bun 提供了以下简化的 API 来实现 HTTP 服务器。有关详细信息，请参阅[API > HTTP](/api/http.md)。

```ts
#server.ts
import {serve} from "bun";

globalThis.count ??= 0;
globalThis.count++;

serve({
  fetch(req: Request) {
    return new Response(`Reloaded ${globalThis.count} times`);
  },
  port: 3000,
});
```

上面的文件只是导出了一个带有定义的`fetch`处理程序的对象。当执行此文件时，Bun 将其解释为 HTTP 服务器，并将导出的对象传递给`Bun.serve`。

当您保存文件时，HTTP 服务器将以更新的代码重新加载，而不重新启动进程。这导致刷新速度非常快。

<image src="https://user-images.githubusercontent.com/709451/195477632-5fd8a73e-014d-4589-9ba2-e075ad9eb040.gif" alt="Bun与Nodemon刷新速度比较" caption="Bun在左边，Nodemon在右边。" />

> **注意** — 在 Bun 的未来版本中，计划支持 Vite 的`import.meta.hot`，以实现更好的热重载的生命周期管理，并与生态系统对齐。

<details>
<summary>实现细节</summary>

在热重载时，Bun：

- 重置内部的`require`缓存和 ES 模块注册表（`Loader.registry`）
- 同步运行垃圾收集器（以最小化内存泄漏，以牺牲运行时性能为代价）
- 从头重新编译所有代码（包括 sourcemap）
- 使用 JavaScriptCore 重新评估代码

这个实现并不特别优化。它会重新编译没有更改的文件。它不尝试增量编译。这只是一个起点。

</details>
