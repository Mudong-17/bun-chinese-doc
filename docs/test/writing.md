您可以使用内置的`bun:test`模块导入与 Jest 类似的 API 来定义测试。长期来看，Bun 旨在实现完全的 Jest 兼容性；目前，支持的`expect`匹配器集合有限。以下是一些基本的用法示例：

要定义一个简单的测试：

```ts#math.test.ts
import { expect, test } from "bun:test";

test("2 + 2", () => {
  expect(2 + 2).toBe(4);
});
```

测试可以使用`describe`分组：

```ts#math.test.ts
import { expect, test, describe } from "bun:test";

describe("arithmetic", () => {
  test("2 + 2", () => {
    expect(2 + 2).toBe(4);
  });

  test("2 * 2", () => {
    expect(2 * 2).toBe(4);
  });
});
```

测试可以是`async`的：

```ts
import { expect, test } from "bun:test";

test("2 * 2", async () => {
  const result = await Promise.resolve(2 * 2);
  expect(result).toEqual(4);
});
```

或者，使用`done`回调来表示完成。如果在测试定义中将`done`回调作为参数包含在内，那么您必须调用它，否则测试将挂起。

```ts
import { expect, test } from "bun:test";

test("2 * 2", (done) => {
  Promise.resolve(2 * 2).then((result) => {
    expect(result).toEqual(4);
    done();
  });
});
```

## 超时

通过将数字作为`test`的第三个参数可选地指定以毫秒为单位的每个测试的超时时间。

```ts
import { test } from "bun:test";

test("wat", async () => {
  const data = await slowOperation();
  expect(data).toBe(42);
}, 500); // 测试必须在<500ms内运行
```

## `test.skip`

使用`test.skip`跳过单个测试。这些测试将不会被运行。

```ts
import { expect, test } from "bun:test";

test.skip("wat", () => {
  // TODO: 修复这个
  expect(0.1 + 0.2).toEqual(0.3);
});
```

## `test.todo`

使用`test.todo`标记测试为待办事项。这些测试将会运行，并且测试运行器将期望它们失败。如果它们通过了，您将被提示将其标记为常规测试。

```ts
import { expect, test } from "bun:test";

test.todo("fix this", () => {
  myTestFunction();
});
```

要专门运行标记为待办事项的测试，请使用`bun test --todo`。

```sh
$ bun test --todo
```

## `test.only`

要运行特定的测试或测试套件，请使用`test.only()`或`describe.only()`。一旦声明，运行`bun test --only`将只执行标有`.only()`的测试/测试套件。

```ts
import { test, describe } from "bun:test";

test("test #1", () => {
  // 不运行
});

test.only("test #2", () => {
  // 运行
});

describe.only("only", () => {
  test("test #3", () => {
    // 运行
  });
});
```

以下命令将只执行测试#2 和#3。

```sh
$ bun test --only
```

## `test.if`

要有条件地运行测试，请使用`test.if()`。如果条件为真，测试将会运行。这对于只应在特定架构或操作系统上运行的测试特别有用。

```ts
test.if(Math.random() > 0.5)("runs half the time", () => {
  // ...
});
```

```ts
test.if(Math.random() > 0.5)("runs half the time", () => {
  // ...
});

const macOS = process.arch === "darwin";
test.if(macOS)("runs on macOS", () => {
  // 在macOS上运行
});
```

要根据某些条件跳过测试，可以使用`test.skipIf()`或`describe.skipIf()`。

```ts
const macOS = process.arch === "darwin";

test.skipIf(macOS)("runs on non-macOS", () => {
  // 如果*不是*macOS，则运行
});
```

## 匹配器

Bun 实现了以下匹配器。完全的 Jest 兼容性在路线图上；跟踪进度[在这里](https://github.com/oven-sh/bun/issues/1825)。

|     |                                                                                                                           |     |
| --- | ------------------------------------------------------------------------------------------------------------------------- | --- |
| 🟢  | [`.not`](https://jestjs.io/docs/expect#not)                                                                               |     |
| 🟢  | [`.toBe()`](https://jestjs.io/docs/expect#tobevalue)                                                                      |     |
| 🟢  | [`.toEqual()`](https://jestjs.io/docs/expect#toequalvalue)                                                                |     |
| 🟢  | [`.toBeNull()`](https://jestjs.io/docs/expect#tobenull)                                                                   |     |
| 🟢  | [`.toBeUndefined()`](https://jestjs.io/docs/expect#tobeundefined)                                                         |     |
| 🟢  | [`.toBeNaN()`](https://jestjs.io/docs/expect#tobenan)                                                                     |     |
| 🟢  | [`.toBeDefined()`](https://jestjs.io/docs/expect#tobedefined)                                                             |     |
| 🟢  | [`.toBeFalsy()`](https://jestjs.io/docs/expect#tobefalsy)                                                                 |     |
| 🟢  | [`.toBeTruthy()`](https://jestjs.io/docs/expect#tobetruthy)                                                               |     |
| 🟢  | [`.toContain()`](https://jestjs.io/docs/expect#tocontainitem)                                                             |     |
| 🟢  | [`.toStrictEqual()`](https://jestjs.io/docs/expect#tostrictequalvalue)                                                    |     |
| 🟢  | [`.toThrow()`](https://jestjs.io/docs/expect#tothrowerror)                                                                |     |
| 🟢  | [`.toHaveLength()`](https://jestjs.io/docs/expect#tohavelengthnumber)                                                     |     |
| 🟢  | [`.toHaveProperty()`](https://jestjs.io/docs/expect#tohavepropertykeypath-value)                                          |     |
| 🔴  | [`.extend`](https://jestjs.io/docs/expect#expectextendmatchers)                                                           |     |
| 🟢  | [`.anything()`](https://jestjs.io/docs/expect#expectanything)                                                             |     |
| 🟢  | [`.any()`](https://jestjs.io/docs/expect#expectanyconstructor)                                                            |     |
| 🔴  | [`.arrayContaining()`](https://jestjs.io/docs/expect#expectarraycontainingarray)                                          |     |
| 🔴  | [`.assertions()`](https://jestjs.io/docs/expect#expectassertionsnumber)                                                   |     |
| 🔴  | [`.closeTo()`](https://jestjs.io/docs/expect#expectclosetonumber-numdigits)                                               |     |
| 🔴  | [`.hasAssertions()`](https://jestjs.io/docs/expect#expecthasassertions)                                                   |     |
| 🔴  | [`.objectContaining()`](https://jestjs.io/docs/expect#expectobjectcontainingobject)                                       |     |
| 🟢  | [`.stringContaining()`](https://jestjs.io/docs/expect#expectstringcontainingstring)                                       |     |
| 🟢  | [`.stringMatching()`](https://jestjs.io/docs/expect#expectstringmatchingstring--regexp)                                   |     |
| 🔴  | [`.addSnapshotSerializer()`](https://jestjs.io/docs/expect#expectaddsnapshotserializerserializer)                         |     |
| 🟢  | [`.resolves()`](https://jestjs.io/docs/expect#resolves)                                                                   |     |
| 🟢  | [`.rejects()`](https://jestjs.io/docs/expect#rejects)                                                                     |     |
| 🟢  | [`.toHaveBeenCalled()`](https://jestjs.io/docs/expect#tohavebeencalled)                                                   |     |
| 🟢  | [`.toHaveBeenCalledTimes()`](https://jestjs.io/docs/expect#tohavebeencalledtimesnumber)                                   |     |
| 🔴  | [`.toHaveBeenCalledWith()`](https://jestjs.io/docs/expect#tohavebeencalledwitharg1-arg2-)                                 |     |
| 🔴  | [`.toHaveBeenLastCalledWith()`](https://jestjs.io/docs/expect#tohavebeenlastcalledwitharg1-arg2-)                         |     |
| 🔴  | [`.toHaveBeenNthCalledWith()`](https://jestjs.io/docs/expect#tohavebeennthcalledwithnthcall-arg1-arg2-)                   |     |
| 🔴  | [`.toHaveReturned()`](https://jestjs.io/docs/expect#tohavereturned)                                                       |     |
| 🔴  | [`.toHaveReturnedTimes()`](https://jestjs.io/docs/expect#tohavereturnedtimesnumber)                                       |     |
| 🔴  | [`.toHaveReturnedWith()`](https://jestjs.io/docs/expect#tohavereturnedwithvalue)                                          |     |
| 🔴  | [`.toHaveLastReturnedWith()`](https://jestjs.io/docs/expect#tohavelastreturnedwithvalue)                                  |     |
| 🔴  | [`.toHaveNthReturnedWith()`](https://jestjs.io/docs/expect#tohaventhreturnedwithnthcall-value)                            |     |
| 🟢  | [`.toBeCloseTo()`](https://jestjs.io/docs/expect#tobeclosetonumber-numdigits)                                             |     |
| 🟢  | [`.toBeGreaterThan()`](https://jestjs.io/docs/expect#tobegreaterthannumber--bigint)                                       |     |
| 🟢  | [`.toBeGreaterThanOrEqual()`](https://jestjs.io/docs/expect#tobegreaterthanorequalnumber--bigint)                         |     |
| 🟢  | [`.toBeLessThan()`](https://jestjs.io/docs/expect#tobelessthannumber--bigint)                                             |     |
| 🟢  | [`.toBeLessThanOrEqual()`](https://jestjs.io/docs/expect#tobelessthanorequalnumber--bigint)                               |     |
| 🟢  | [`.toBeInstanceOf()`](https://jestjs.io/docs/expect#tobeinstanceofclass)                                                  |     |
| 🔴  | [`.toContainEqual()`](https://jestjs.io/docs/expect#tocontainequalitem)                                                   |     |
| 🟢  | [`.toMatch()`](https://jestjs.io/docs/expect#tomatchregexp--string)                                                       |     |
| 🟢  | [`.toMatchObject()`](https://jestjs.io/docs/expect#tomatchobjectobject)                                                   |     |
| 🟢  | [`.toMatchSnapshot()`](https://jestjs.io/docs/expect#tomatchsnapshotpropertymatchers-hint)                                |     |
| 🔴  | [`.toMatchInlineSnapshot()`](https://jestjs.io/docs/expect#tomatchinlinesnapshotpropertymatchers-inlinesnapshot)          |     |
| 🔴  | [`.toThrowErrorMatchingSnapshot()`](https://jestjs.io/docs/expect#tothrowerrormatchingsnapshothint)                       |     |
| 🔴  | [`.toThrowErrorMatchingInlineSnapshot()`](https://jestjs.io/docs/expect#tothrowerrormatchinginlinesnapshotinlinesnapshot) |     |
