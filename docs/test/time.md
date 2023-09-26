---
outline: "deep"
---

# Dates and times

`bun:test` 允许您在测试中更改时间。

这适用于以下任何内容：

- `Date.now`
- `new Date()`
- `new Intl.DateTimeFormat().format()`

定时器目前尚未受到影响，但在将来的 Bun 发布中可能会受到影响。

## `setSystemTime`

要更改系统时间，请使用 `setSystemTime`：

```ts
import { setSystemTime, beforeAll, test, expect } from "bun:test";

beforeAll(() => {
  setSystemTime(new Date("2020-01-01T00:00:00.000Z"));
});

test("现在是2020年", () => {
  expect(new Date().getFullYear()).toBe(2020);
});
```

为了支持使用 Jest 的 `useFakeTimers` 和 `useRealTimers` 的现有测试，您可以使用 `useFakeTimers` 和 `useRealTimers`：

```ts
test("就像在 Jest 中一样", () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2020-01-01T00:00:00.000Z"));
  expect(new Date().getFullYear()).toBe(2020);
  jest.useRealTimers();
  expect(new Date().getFullYear()).toBeGreaterThan(2020);
});

test("与 Jest 不同", () => {
  const OriginalDate = Date;
  jest.useFakeTimers();
  if (typeof Bun === "undefined") {
    // 在 Jest 中，Date 构造函数会发生变化
    // 这可能会导致各种各样的错误，因为突然之间 Date !== 在测试之前的 Date。
    expect(Date).not.toBe(OriginalDate);
    expect(Date.now).not.toBe(OriginalDate.now);
  } else {
    // 在 bun:test 中，使用 useFakeTimers 时 Date 构造函数不会发生变化
    expect(Date).toBe(OriginalDate);
    expect(Date.now).toBe(OriginalDate.now);
  }
});
```

> **定时器** — 请注意，我们尚未实现内置支持以模拟定时器，但这已经在路线图上了。

### 重置系统时间

要重置系统时间，请在 `setSystemTime` 中不传递任何参数：

```ts
import { setSystemTime, beforeAll } from "bun:test";

test("那时是2020年，短暂的一刻。", () => {
  // 设置它为某个值！
  setSystemTime(new Date("2020-01-01T00:00:00.000Z"));
  expect(new Date().getFullYear()).toBe(2020);

  // 重置它！
  setSystemTime();

  expect(new Date().getFullYear()).toBeGreaterThan(2020);
});
```

## 设置时区

要更改时区，可以要么将 `$TZ` 环境变量传递给 `bun test`。

```sh
TZ=America/Los_Angeles bun test
```

要么在运行时设置 `process.env.TZ`：

```ts
import { test, expect } from "bun:test";

test("欢迎来到加利福尼亚！", () => {
  process.env.TZ = "America/Los_Angeles";
  expect(new Date().getTimezoneOffset()).toBe(420);
  expect(new Intl.DateTimeFormat().resolvedOptions().timeZone).toBe(
    "America/Los_Angeles"
  );
});

test("欢迎来到纽约！", () => {
  // 与 Jest 不同，您可以在运行时多次设置时区，它将正常工作。
  process.env.TZ = "America/New_York";
  expect(new Date().getTimezoneOffset()).toBe(240);
  expect(new Intl.DateTimeFormat().resolvedOptions().timeZone).toBe(
    "America/New_York"
  );
});
```
