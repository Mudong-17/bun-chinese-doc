Bun 附带了一个快速的、内置的、与 Jest 兼容的测试运行器。测试使用 Bun 运行时执行，并支持以下功能：

- TypeScript 和 JSX
- 生命周期钩子
- 快照测试
- UI 和 DOM 测试
- 使用`--watch`进行观察模式
- 使用`--preload`进行脚本预加载

{% callout %}
Bun 旨在与 Jest 兼容，但并非所有功能都已实现。要跟踪兼容性，请参阅[此跟踪问题](https://github.com/oven-sh/bun/issues/1825)。
{% /callout %}

## 运行测试

```bash
$ bun test
```

测试以 JavaScript 或 TypeScript 编写，具有类似于 Jest 的 API。有关完整文档，请参阅[编写测试](/docs/test/writing.md)。

```ts#math.test.ts
import { expect, test } from "bun:test";

test("2 + 2", () => {
  expect(2 + 2).toBe(4);
});
```

运行器递归搜索工作目录以查找与以下模式匹配的文件：

- `*.test.{js|jsx|ts|tsx}`
- `*_test.{js|jsx|ts|tsx}`
- `*.spec.{js|jsx|ts|tsx}`
- `*_spec.{js|jsx|ts|tsx}`

您可以通过向`bun test`传递额外的位置参数来筛选要运行的测试文件集。通常，这些筛选器将是文件或目录名称；尚不支持通配符模式。

```bash
$ bun test <filter> <filter> ...
```

要按测试名称筛选，请使用`-t`/`--test-name-pattern`标志。

```sh
# 运行所有名称中包含“addition”的测试或测试套件
$ bun test --test-name-pattern addition
```

测试运行器在单个进程中运行所有测试。它加载所有`--preload`脚本（有关详细信息，请参阅[生命周期](/docs/test/lifecycle.md)），然后运行所有测试。如果测试失败，测试运行器将以非零退出代码退出。

## 超时

使用`--timeout`标志指定以毫秒为单位的每个测试的超时时间。如果测试超时，它将被标记为失败。默认值为`5000`。

```bash
# 默认值为5000
$ bun test --timeout 20
```

## 使用`--rerun-each`重新运行测试

使用`--rerun-each`标志多次运行每个测试。这对于检测不稳定或非确定性的测试失败非常有用。

```sh
$ bun test --rerun-each 100
```

## 使用`--bail`退出

使用`--bail`标志可以在预定的测试失败次数后提前中止测试运行。默认情况下，Bun 会运行所有测试并报告所有失败，但在 CI 环境中，有时更希望更早地终止以减少 CPU 使用率。

```sh
# 在1次失败后中止
$ bun test --bail

# 在10次失败后中止
$ bun test --bail 10
```

## 观察模式

与`bun run`类似，您可以在`bun test`中传递`--watch`标志以监视更改并重新运行测试。

```bash
$ bun test --watch
```

## 生命周期钩子

Bun 支持以下生命周期钩子：

| 钩子         | 描述                     |
| ------------ | ------------------------ |
| `beforeAll`  | 在所有测试之前运行一次。 |
| `beforeEach` | 在每个测试之前运行。     |
| `afterEach`  | 在每个测试之后运行。     |
| `afterAll`   | 在所有测试之后运行一次。 |

这些钩子可以在测试文件中定义，也可以在使用`--preload`标志预加载的单独文件中定义。

```ts
$ bun test --preload ./setup.ts
```

有关完整文档，请参阅[Test > 生命周期](/docs/test/lifecycle.md)。

## 模拟

{% callout %}
尚不支持模块模拟（`jest.mock()`）。跟踪其支持情况[在这里](https://github.com/oven-sh/bun/issues/5394)。
{% /callout %}

使用`mock`函数创建模拟函数。模拟函数在测试之间自动重置。

```ts
import { test, expect, mock } from "bun:test";
const random = mock(() => Math.random());

test("random", async () => {
  const val = random();
  expect(val).toBeGreaterThan(0);
  expect(random).toHaveBeenCalled();
  expect(random).toHaveBeenCalledTimes(1);
});
```

或者，您可以使用`jest.fn()`，它的行为完全相同。

```ts-diff
- import { test, expect, mock } from "bun:test";
+ import { test, expect, jest } from "bun:test";

- const random = mock(() => Math.random());
+ const random = jest.fn(() => Math.random());
```

有关完整文档，请参阅[Test > 模拟](/docs/test/mocks.md)。

## 快照测试

`bun test`支持快照。

```ts
// 使用toMatchSnapshot的示例用法
import { test, expect } from "bun:test";

test("snapshot", async () => {
  expect({ a: 1 }).toMatchSnapshot();
});
```

要更新快照，请使用`--update-snapshots`标志

。

```sh
$ bun test --update-snapshots
```

有关完整文档，请参阅[Test > 快照](/docs/test/snapshots.md)。

## UI 和 DOM 测试

Bun 与流行的 UI 测试库兼容：

- [HappyDOM](https://github.com/capricorn86/happy-dom)
- [DOM Testing Library](https://testing-library.com/docs/dom-testing-library/intro/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)

有关完整文档，请参阅[Test > DOM 测试](/docs/test/dom.md)。

## 性能

Bun 的测试运行器非常快。

![Running 266 React SSR tests faster than Jest can print its version number.](/static/image/buntest.jpeg)

<!--
考虑以下目录结构：

```
.
├── a.test.ts
├── b.test.ts
├── c.test.ts
└── foo
    ├── a.test.ts
    └── b.test.ts
```

要运行两个`a.test.ts`文件：

```
$ bun test a
```

要运行`foo`目录中的所有测试：

```
$ bun test foo
```

任何测试文件的路径包含其中一个目标的绝对路径的目录中都会运行。尚不支持通配符模式。 -->
