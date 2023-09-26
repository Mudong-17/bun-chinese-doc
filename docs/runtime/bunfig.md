Bun 的行为可以使用其配置文件`bunfig.toml`进行配置。

一般来说，Bun 依赖于预先存在的配置文件，如`package.json`和`tsconfig.json`来配置其行为。`bunfig.toml`仅用于配置 Bun 特定的内容。这个文件是可选的，没有它，Bun 也可以正常工作。

## 全局与本地

一般来说，建议将`bunfig.toml`文件添加到项目的根目录，与`package.json`放在一起。

要在全局配置 Bun，您也可以在以下路径之一创建一个`.bunfig.toml`文件：

- `$HOME/.bunfig.toml`
- `$XDG_CONFIG_HOME/.bunfig.toml`

如果同时检测到全局和本地的`bunfig`，则会进行浅层合并，本地设置会覆盖全局设置。命令行标志将在适用的情况下覆盖`bunfig`设置。

## 运行时

Bun 的运行时行为是通过`bunfig.toml`文件中的顶级字段进行配置的。

### `preload`

一个脚本数组，用于在运行文件或脚本之前执行。这对于注册插件很有用。

```toml
# 运行文件或脚本之前要运行的脚本
# 用于注册插件
preload = ["./preload.ts"]
```

### `jsx`

配置 Bun 如何处理 JSX。您还可以在`tsconfig.json`的`compilerOptions`中设置这些字段，但在非 TypeScript 项目中，它们也受到支持。

```toml
jsx = "react"
jsxFactory = "h"
jsxFragment = "Fragment"
jsxImportSource = "react"
```

有关这些字段的更多信息，请参阅 tsconfig 文档。

- [jsx](https://www.typescriptlang.org/tsconfig#jsx)
- [jsxFactory](https://www.typescriptlang.org/tsconfig#jsxFactory)
- [jsxFragment](https://www.typescriptlang.org/tsconfig#jsxFragment)
- [jsxImportSource](https://www.typescriptlang.org/tsconfig#jsxImportSource)

### `smol`

启用`smol`模式。这会降低内存使用，但性能会有所降低。

```toml
# 降低内存使用，但牺牲性能
smol = true
```

### `logLevel`

设置日志级别。可以是`"debug"`、`"warn"`或`"error"`之一。

```toml
logLevel = "debug" # "debug" | "warn" | "error"
```

### `define`

`define`字段允许您将某些全局标识符替换为常量表达式。Bun 将使用表达式替换标识符的任何用法。表达式应为 JSON 字符串。

```toml
[define]
# 将任何对"process.env.bagel"的用法替换为字符串`lox`。
# 值会解析为JSON，但支持单引号字符串和在JS中的`'undefined'`变成`undefined`。
# 这可能会在未来的版本中更改为普通的TOML。它是CLI参数解析的遗留物。
"process.env.bagel" = "'lox'"
```

### `loader`

配置 Bun 如何将文件扩展名映射到加载器。这对于加载 Bun 不原生支持的文件非常有用。如果

```toml
[loader]
# 当导入.bagel文件时，将其视为tsx文件
".bagel" = "tsx"
```

Bun 支持以下加载器：

- `jsx`
- `js`
- `ts`
- `tsx`
- `css`
- `file`
- `json`
- `toml`
- `wasm`
- `napi`
- `base64`
- `dataurl`
- `text`

### `telemetry`

`telemetry`字段允许启用/禁用分析记录。Bun 记录捆绑时间（以便我们可以用数据回答问题，"Bun 是否越来越快？"）和功能使用情况（例如，"人们是否真正使用宏？"）。请求主体大小约为 60 字节，因此数据量不大。默认情况下启用遥测。相当于`DO_NOT_TRACK`环境变量。

```toml
telemetry = false
```

## 测试运行器

测试运行器在您的 bunfig.toml 的`[test]`部分中进行配置。

```toml
[test]
# 配置信息在此处
```

### `test.root`

运行测试的根目录。默认为`。`。

```toml
[test]
root = "./__tests__"
```

### `test.preload`

与顶级`preload`字段相同，但仅适用于`bun test`。

```toml
[test]
preload = ["./setup.ts"]
```

### `test.smol`

与顶级`smol`字段相同，但仅适用于`bun test`。

```toml
[test]
smol = true
```

### `test.coverage`

启用覆盖率报告。默认为`false`。使用`--coverage`来覆盖。

```toml
[test]
coverage = false
```

### `test.coverageThreshold`

指定覆盖率阈值。默认情况下，没有设置阈值。如果您的测试套件不满足或超过此阈值，`bun test`将以非零退出代码退出以指示失败。

```toml
[test]

# 要求90%的行级和函数级覆盖率
coverageThreshold = 0.9
```

可以为行级、函数级和语句级覆盖率指定不同的阈值。

```toml
[test]
coverageThreshold = { line = 0.7, function = 0.8, statement = 0.9 }
```

### `test.coverageSkipTestFiles`

计算覆盖统计信息时是否跳过测试文件。默认为`false`。

```

toml
[test]
coverageSkipTestFiles = false
```

## 包管理器

包管理是一个复杂的问题；为了支持各种用例，`bun install`的行为可以在`[install]`部分下进行配置。

```toml
[install]
# 在此处配置
```

### `install.optional`

是否安装可选依赖项。默认为`true`。

```toml
[install]
optional = true
```

### `install.dev`

是否安装开发依赖项。默认为`true`。

```toml
[install]
dev = true
```

### `install.peer`

是否安装对等依赖项。默认为`false`。

```toml
[install]
peer = false
```

### `install.production`

`bun install`是否以"生产模式"运行。默认为`false`。

在生产模式下，不会安装"devDependencies"。您可以在 CLI 中使用`--production`来覆盖此设置。

```toml
[install]
production = false
```

### `install.exact`

是否在`package.json`中设置精确的版本。默认为`false`。

默认情况下，Bun 使用 caret 范围；如果包的“最新”版本是`2.4.1`，则您的`package.json`中的版本范围将是`^2.4.1`。这表示任何版本从`2.4.1`到`3.0.0`之前（不包括`3.0.0`）都是可接受的。

```toml
[install]
exact = false
```

### `install.auto`

配置 Bun 的包自动安装行为。默认为`"auto"` —— 当找不到`node_modules`文件夹时，Bun 将在执行过程中自动安装依赖项。

```toml
[install]
auto = "auto"
```

有效的值为：

| 值           | 描述                                                                                               |
| ------------ | -------------------------------------------------------------------------------------------------- |
| `"auto"`     | 如果存在本地的 `node_modules`，则从本地解析模块。否则，动态地在执行过程中自动安装依赖项。          |
| `"force"`    | 始终自动安装依赖项，即使存在 `node_modules`。                                                      |
| `"disable"`  | 从不自动安装依赖项。                                                                               |
| `"fallback"` | 首先检查本地的 `node_modules`，然后自动安装任何找不到的包。您可以使用 `bun -i` 从 CLI 启用此选项。 |

### `install.frozenLockfile`

当为 true 时，`bun install`不会更新`bun.lockb`。默认为`false`。如果`package.json`和现有的`bun.lockb`不一致，这将引发错误。

```toml
[install]
frozenLockfile = false
```

### `install.dryRun`

是否安装可选依赖项。默认为`false`。当为 true 时，等效于在所有`bun install`命令上设置`--dry-run`。

```toml
[install]
dryRun = false
```

### `install.globalDir`

配置 Bun 放置全局安装的包的目录。

```toml
[install]
# 全局安装的包安装到这里
globalDir = "~/.bun/install/global"
```

### `install.globalBinDir`

配置 Bun 放置全局安装的二进制文件和命令行界面的目录。

```toml
# 全局安装的包的二进制文件链接到这里
globalBinDir = "~/.bun/bin"
```

### `install.registry`

默认注册表是`https://registry.npmjs.org/`。这可以在`bunfig.toml`中全局配置：

```toml
[install]
# 将默认注册表设置为字符串
registry = "https://registry.npmjs.org"
# 设置令牌
registry = { url = "https://registry.npmjs.org", token = "123456" }
# 设置用户名/密码
registry = "https://username:password@registry.npmjs.org"
```

### `install.scopes`

要为特定作用域（例如`@myorg/<package>`）配置特定注册表，请使用`install.scopes`。您可以使用`$variable`符号引用环境变量。

```toml
[install.scopes]
# 注册表为字符串
myorg = "https://username:password@registry.myorg.com/"

# 带有用户名/密码的注册表
# 您可以引用环境变量
myorg = { username = "myusername", password = "$npm_password", url = "https://registry.myorg.com/" }

# 带有令牌的注册表
myorg = { token = "$npm_token", url = "https://registry.myorg.com/" }
```

### `install.cache`

配置缓存行为：

```toml
[install.cache]

# 用于缓存的目录
dir = "~/.bun/install/cache"

# 当为true时，不从全局缓存加载。
# Bun仍然可能会将文件写入node_modules/.cache
disable = false

# 当为true时，始终从注册表中解析最新版本
disableManifest = false
```

### `install.lockfile`

要配置锁定文件行为，请使用`install.lockfile`部分。

是否在`bun install`上生成锁定文件。默认为`true`。

```toml
[install.lockfile]
save = true
```

是否在`bun.lockb`旁边生成非 Bun

锁定文件。（始终会创建`bun.lockb`。）目前，唯一受支持的值是`"yarn"`。

```toml
[install.lockfile]
print = "yarn"
```
