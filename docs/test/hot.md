---
outline: "deep"
---

# Watch mode

要在文件更改时自动重新运行测试，可以使用`--watch`标志：

```sh
$ bun test --watch
```

Bun 会监视测试文件中导入的任何文件的更改，并在检测到更改时重新运行测试。

这个功能非常快速
