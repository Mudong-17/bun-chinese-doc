---
outline: "deep"
---

# Snapshots

快照测试是使用 `.toMatchSnapshot()` 匹配器编写的：

```ts
import { test, expect } from "bun:test";

test("snap", () => {
  expect("foo").toMatchSnapshot();
});
```

第一次运行这个测试时，`expect` 的参数将被序列化并写入与测试文件相邻的 `__snapshots__` 目录中的特殊快照文件中。在以后的运行中，参数将与磁盘上的快照进行比较。可以使用以下命令重新生成快照：

```bash
$ bun test --update-snapshots
```
