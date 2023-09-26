Bun 的测试运行器支持以下生命周期钩子。这对于加载测试数据、模拟数据和配置测试环境非常有用。

| 钩子         | 描述                     |
| ------------ | ------------------------ |
| `beforeAll`  | 在所有测试之前运行一次。 |
| `beforeEach` | 在每个测试之前运行。     |
| `afterEach`  | 在每个测试之后运行。     |
| `afterAll`   | 在所有测试之后运行一次。 |

使用 `beforeEach` 和 `afterEach` 执行每个测试的设置和拆卸逻辑。

```ts
import { beforeEach, afterEach } from "bun:test";

beforeEach(() => {
  console.log("运行测试。");
});

afterEach(() => {
  console.log("测试完成。");
});

// 测试...
```

使用 `beforeAll` 和 `afterAll` 执行每个范围的设置和拆卸逻辑。范围由钩子的定义位置确定。

要将钩子的范围限定到特定的 `describe` 块中：

```ts
import { describe, beforeAll } from "bun:test";

describe("测试组", () => {
  beforeAll(() => {
    // 设置
  });

  // 测试...
});
```

要将钩子的范围限定到测试文件中：

```ts
import { describe, beforeAll } from "bun:test";

beforeAll(() => {
  // 设置
});

describe("测试组", () => {
  // 测试...
});
```

要将钩子的范围限定到整个多文件测试运行中，请在一个单独的文件中定义钩子。

```ts#setup.ts
import { beforeAll, afterAll } from "bun:test";

beforeAll(() => {
  // 全局设置
});

afterAll(() => {
  // 全局拆卸
});
```

然后使用 `--preload` 在运行任何测试文件之前运行设置脚本。

```sh
$ bun test --preload ./setup.ts
```

为了避免每次运行测试时都键入 `--preload`，可以将其添加到您的 `bunfig.toml` 中：

```toml
[test]
preload = ["./setup.ts"]
```
