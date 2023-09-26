---
outline: "deep"
---

# Configuration

Bun 可以通过两种主要机制进行配置：

- 环境变量
- `bunfig.toml`：Bun 的配置文件

使用`bunfig.toml`进行配置是可选的。Bun 旨在开箱即用，不需要任何配置，但也支持高级用例的高度配置。您的`bunfig.toml`应该位于项目根目录，与`package.json`放在一起。

您还可以在以下路径创建全局配置文件：

- `$HOME/.bunfig.toml`
- `$XDG_CONFIG_HOME/.bunfig.toml`

如果检测到全局和本地的`bunfig`，则结果将进行浅层合并，以本地配置为准。在适用的情况下，CLI 标志将覆盖`bunfig`设置。

## `bunfig.toml`

### 运行时

```toml
# 在`bun run`之前运行的脚本或脚本
# 用于注册插件
preload = ["./preload.ts"]

# 相当于相应的tsconfig compilerOptions
jsx = "react"
jsxFactory = "h"
jsxFragment = "Fragment"
jsxImportSource = "react"

# 以降低性能为代价减少内存使用
smol = true

# 设置Bun的日志级别
logLevel = "debug" # "debug", "warn", "error"

[define]
# 将任何使用"process.env.bagel"的地方替换为字符串`lox`。
# 值被解析为JSON，除非支持单引号字符串，且`'undefined'`在JS中变为`undefined`。
# 这可能会在将来的版本中更改为普通的TOML。这是从CLI参数解析的遗留物。
"process.env.bagel" = "'lox'"

[loader]
# 在加载.bagel文件时运行JS解析器
".bagel" = "js"
```

### 测试运行器

```toml
[test]
# 在所有测试文件之前运行的脚本
preload = ["./setup.ts"]

# 以降低性能为代价减少内存使用
smol = true
```

### 包管理器

包管理是一个复杂的问题；为了支持各种用例，可以在[`bunfig.toml`](/runtime/configuration.md)中配置`bun install`的行为。

### 默认标志

以下设置修改了 Bun 的包管理命令的核心行为。**默认值如下所示。**

```toml
[install]

# 是否安装optionalDependencies
optional = true

# 是否安装devDependencies
dev = true

# 是否安装peerDependencies
peer = false

# 相当于`--production`标志
production = false

# 相当于`--frozen-lockfile`标志
frozenLockfile = false

# 相当于`--dry-run`标志
dryRun = false
```

### 私有范围和注册表

默认注册表是`https://registry.npmjs.org/`。这可以在`bunfig.toml`中进行全局配置：

```toml
[install]
# 将默认注册表设置为字符串
registry = "https://registry.npmjs.org"
# 设置令牌
registry = { url = "https://registry.npmjs.org", token = "123456" }
# 设置用户名/密码
registry = "https://username:password@registry.npmjs.org"
```

要配置作用域注册表：

```toml
[install.scopes]
# 作为字符串的注册表
myorg1 = "https://username:password@registry.myorg.com/"

# 带有用户名/密码的注册表
# 您可以引用环境变量
myorg12 = { username = "myusername", password = "$NPM_PASS", url = "https://registry.myorg.com/" }

# 带有令牌的注册表
myorg3 = { token = "$npm_token", url = "https://registry.myorg.com/" }
```

### 缓存

要配置缓存行为：

```toml
[install]
# `bun install --global`安装软件包的位置
globalDir = "~/.bun/install/global"

# 全局安装软件包bin的链接位置
globalBinDir = "~/.bun/bin"

[install.cache]
# 用于缓存的目录
dir = "~/.bun/install/cache"

# 当为true时，不要从全局缓存加载。
# Bun仍然可能会写入node_modules/.cache
disable = false

# 当为true时，总是从注册表中解析最新版本
disableManifest = false
```

### 锁定文件

要配置锁定文件行为：

```toml
[install.lockfile]

# 从中读取bun.lockb的路径
path = "bun.lockb"

# 保存bun.lockb的路径
savePath = "bun.lockb"

# 是否将锁定文件保存到磁盘
save = true

# 是否在bun.lockb旁边保存非Bun锁定文件
# 仅支持"yarn"
print = "yarn"
```

### 调试

```toml
[debug]
# 在导航到blob:或src:链接时，在编辑器中打开文件
# 如果不是，它会尝试$EDITOR或$VISUAL
# 如果仍然失败，它将尝试Visual Studio Code，然后是Sublime Text，然后是其他一些
# 这是由Bun.openInEditor()使用的
editor = "code"

# 编辑器列表：
# - "subl", "sublime"
# - "vscode", "code"
# - "textmate", "mate"
# - "idea"
# - "webstorm"
# - "nvim", "neovim"
# - "vim","vi"
# - "emacs"
```

## 环境变量

Bun 检查这些环境变量以检测功能并切换功能。

| 名称           | 描述                                                                                                                                                                                          |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TMPDIR`       | Bun 偶尔需要一个目录来存储捆绑或其他操作期间的中间资源。如果未设置，默认为特定于平台的临时目录：Linux 上为 `/tmp`，macOS 上为 `/private/tmp`。                                                |
| `NO_COLOR`     | 如果 `NO_COLOR=1`，则禁用 ANSI 颜色输出。                                                                                                                                                     |
| `FORCE_COLOR`  | 如果 `FORCE_COLOR=1`，则强制启用 ANSI 颜色输出，即使设置了 `NO_COLOR`。                                                                                                                       |
| `DO_NOT_TRACK` | 如果 `DO_NOT_TRACK=1`，则禁用分析。Bun 记录捆绑时间（以便我们可以用数据回答“Bun 是否越来越快？”）和功能使用情况（例如，“人们实际上是否在使用宏？”）。请求体大小约为 60 字节，因此数据量不大。 |
