宏是一种在 Bun 中的机制，允许你在捆绑（bundle）时运行 JavaScript 函数，这些函数的返回值直接内联到你的捆绑文件中。这对于嵌入当前 Git 提交哈希、在构建时进行 API 的 fetch 请求、死代码消除等任务非常有用。

以下是宏的工作原理以及何时使用它们的简要说明：

### 定义宏

你可以通过创建常规的 JavaScript 或 TypeScript 函数来定义宏。例如，让我们创建一个简单的宏函数，它返回一个随机数：

```ts
export function random() {
  return Math.random();
}
```

### 使用宏

要使用宏，你可以使用 `with { type: 'macro' }` 导入属性语法进行导入。以下是一个示例：

```ts
import { random } from './random.ts' with { type: 'macro' };

console.log(`Your random number is ${random()}`);
```

### 注意事项

宏使用导入属性语法进行标记。如果你之前没有见过这种语法，它是 TC39 的 Stage 3 提案，允许你附加额外的元数据到 `import` 语句中。

### 宏的执行

当 Bun 的编译器遇到宏导入时，它会在捆绑过程中使用 Bun 的 JavaScript 运行时调用函数，并将 JavaScript 的返回值转换为 AST 节点。这些 JavaScript 函数在捆绑时执行，而不是在运行时执行。

宏在编译器的访问阶段同步执行，早于插件和早于编译器生成 AST。它们按照导入的顺序执行。编译器会等待宏执行完成后继续执行。如果宏返回 `Promise`，编译器也会 `await` 该 `Promise`。

Bun 的捆绑器是多线程的。因此，宏在多个生成的 JavaScript "工作线程" 内并行执行。

### 死代码消除

捆绑器在运行和内联宏之后执行死代码消除。因此，给定以下宏：

```ts#returnFalse.ts
export function returnFalse() {
  return false;
}
```

...然后捆绑以下文件将生成一个空捆绑：

```ts
import {returnFalse} from './returnFalse.ts' with { type: 'macro' };

if (returnFalse()) {
  console.log("This code is eliminated");
}
```

### 可序列化性

Bun 的编译器需要能够序列化宏的结果，以便将其内联到 AST 中。所有与 JSON 兼容的数据结构都受支持。宏可以是异步的，或返回 `Promise` 实例。Bun 的编译器将自动 `await` 该 `Promise` 并内联结果。

Bun 实现了特殊逻辑，用于序列化常见的数据格式，如 `Response`、`Blob`、`TypedArray`。

- `TypedArray`：解析为 base64 编码的字符串。
- `Response`：Bun 将读取 `Content-Type` 并相应地序列化；例如，类型为 `application/json` 的 `Response` 将自动解析为对象，而 `text/plain` 将内联为字符串。具有未识别或 `undefined` `type` 的响应将进行 base64 编码。
- `Blob`：与 `Response` 一样，序列化取决于 `type` 属性。

`fetch` 的结果是 `Promise<Response>`，因此可以直接返回。

### 参数

宏可以接受输入，但仅在有限的情况下。该值必须在静态上下文中知道。例如，以下情况是不允许的：

```ts
import {getText} from './getText.ts' with { type: 'macro' };

export function howLong() {
  // `foo` 的值无法在静态上下文中知道
  const foo = Math.random() ? "foo" : "bar";

  const text = getText(`https://example.com/${foo}`);
  console.log("The page is ", text.length, " characters long");
}
```

但是，如果 `foo` 的值在捆绑时是已知的（比如，如果它是一个常量或另一个宏的结果），那么是允许的：

```ts
import {getText} from './getText.ts' with { type: 'macro' };
import {getFoo} from './getFoo.ts' with { type: 'macro' };

export function howLong() {
  // 这可以工作，因为 getFoo() 在静态上下文中是已知的
  const foo = getFoo();
  const text = getText(`https://example.com/${foo}`);
  console.log("The page is", text.length, "characters long");
}
```

这将输出：

```ts
function howLong() {
  console.log("The page is", 1322, "characters long");
}
export { howLong };
```

### 示例

以下是两个示例，一个用于获取最新的 Git 提交哈希，另一个用于在捆绑时进行 HTTP 请求并解析 HTML 响应，然后返回包含标题和元标签的对象：

#### 嵌入最新的 Git 提交哈希

```ts#getGitCommitHash.ts
export function getGitCommitHash() {
  const {stdout} = Bun.spawnSync({
    cmd: ["git", "rev-parse", "HEAD"],
    stdout: "pipe",
  });

  return stdout.toString();
}
```

当我们构建它时，`getGitCommitHash` 将被替换为调用该函数的结果：

```ts#input
import { getGitCommitHash } from './getGitCommitHash.ts' with { type: 'macro' };

console.log(`The current Git commit hash is ${getGitCommitHash()}`);
```

```bash#output
console.log(`The current Git commit hash is 3ee3259104f`);
```

#### 捆绑时进行 `fetch()` 请求

在此示例中，我们使用 `fetch()` 进行出站 HTTP 请求，使用 `HTMLRewriter` 解析 HTML 响应，并在捆绑时返回包含标题和元标签的对象

：

```ts
export async function extractMetaTags(url: string) {
  const response = await fetch(url);
  const meta = {
    title: "",
  };
  new HTMLRewriter()
    .on("title", {
      text(element) {
        meta.title += element.text;
      },
    })
    .on("meta", {
      element(element) {
        const name =
          element.getAttribute("name") ||
          element.getAttribute("property") ||
          element.getAttribute("itemprop");

        if (name) meta[name] = element.getAttribute("content");
      },
    })
    .transform(response);

  return meta;
}
```

`extractMetaTags` 函数在捆绑时被擦除，并被函数调用的结果所替代。这意味着 `fetch` 请求会在捆绑时进行，而结果将嵌入到捆绑中。由于它是不可达的分支，所以也会被消除。

```ts#input
import { extractMetaTags } from './meta.ts' with { type: 'macro' };

export const Head = () => {
  const headTags = extractMetaTags("https://example.com");

  if (headTags.title !== "Example Domain") {
    throw new Error("Expected title to be 'Example Domain'");
  }

  return <head>
    <title>{headTags.title}</title>
    <meta name="viewport" content={headTags.viewport} />
  </head>;
};
```

```ts#output
import { jsx, jsxs } from "react/jsx-runtime";
export const Head = () => {
  jsxs("head", {
    children: [
      jsx("title", {
        children: "Example Domain",
      }),
      jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      }),
    ],
  });
};

export { Head };
```
