---
outline: "deep"
---

# Utilities

`bun pm` 命令组提供了一组工具，用于与 Bun 的包管理器一起使用。

要打印本地项目的 `bin` 目录路径：

```bash
$ bun pm bin
/path/to/current/project/node_modules/.bin
```

要打印全局 `bin` 目录的路径：

```bash
$ bun pm bin -g
<$HOME>/.bun/bin
```

要打印当前项目中已安装的依赖项列表以及它们的解析版本，不包括它们的依赖项：

```bash
$ bun pm ls
/path/to/project node_modules (135)
├── eslint@8.38.0
├── react@18.2.0
├── react-dom@18.2.0
├── typescript@5.0.4
└── zod@3.21.4
```

要打印所有已安装的依赖项，包括第 n 层依赖项：

```bash
$ bun pm ls --all
/path/to/project node_modules (135)
├── @eslint-community/eslint-utils@4.4.0
├── @eslint-community/regexpp@4.5.0
├── @eslint/eslintrc@2.0.2
├── @eslint/js@8.38.0
├── @nodelib/fs.scandir@2.1.5
├── @nodelib/fs.stat@2.0.5
├── @nodelib/fs.walk@1.2.8
├── acorn@8.8.2
├── acorn-jsx@5.3.2
├── ajv@6.12.6
├── ansi-regex@5.0.1
├── ...
```

要打印 Bun 的全局模块缓存的路径：

```bash
$ bun pm cache
```

要清除 Bun 的全局模块缓存：

```bash
$ bun pm cache rm
```
