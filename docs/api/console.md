---
outline: "deep"
---

# Console

**注意** — Bun 提供了一个兼容浏览器和 Node.js 的[console](https://developer.mozilla.org/en-US/docs/Web/API/console)全局对象。本页仅记录了 Bun 本机 API。

在 Bun 中，`console`对象可以用作`AsyncIterable`，以便从`process.stdin`顺序读取行。

```ts
for await (const line of console) {
  console.log(line);
}
```

这对于实现交互式程序非常有用，比如下面的加法计算器示例。

```ts
console.log(`让我们加一些数字吧！`);
console.write(`计数：0\n> `);

let count = 0;
for await (const line of console) {
  count += Number(line);
  console.write(`计数：${count}\n> `);
}
```

要运行该文件：

```bash
$ bun adder.ts
让我们加一些数字吧！
计数：0
> 5
计数：5
> 5
计数：10
> 5
计数：15
```
