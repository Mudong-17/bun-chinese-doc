`bun` CLI 包含一个与 Node.js 兼容的包管理器，旨在极大地提高包的安装速度，可作为`npm`、`yarn`和`pnpm`的显著更快的替代品。它是一个独立的工具，适用于现有的 Node.js 项目；如果您的项目有一个`package.json`，则可以使用`bun install`来加速您的工作流程。

**要点：**

- **⚡️ 25 倍更快** — 在任何 Node.js 项目中从`npm install`切换到`bun install`，可以使安装速度提高高达 25 倍。

![package install benchmark](https://user-images.githubusercontent.com/709451/147004342-571b6123-17a9-49a2-8bfd-dcfc5204047e.png)

{% details summary="对于Linux用户" %}
最低 Linux 内核版本为 5.1。如果您使用的是 Linux 内核 5.1 - 5.5，`bun install`仍然可以工作，但由于不支持 io_uring 的`connect()`操作，HTTP 请求将变得缓慢。

如果您使用的是 Ubuntu 20.04，以下是如何安装[较新的内核](https://wiki.ubuntu.com/Kernel/LTSEnablementStack)的方法：

```bash
# 如果返回的版本 >= 5.6，则无需执行任何操作
uname -r

# 安装官方Ubuntu硬件启用内核
sudo apt install --install-recommends linux-generic-hwe-20.04
```

{% /details %}

## 管理依赖项

### `bun install`

要安装项目的所有依赖项：

```bash
$ bun install
```

在 Linux 上，`bun install`通常比`npm install`快 20-100 倍。在 macOS 上，速度大约是 4-80 倍。

运行`bun install`将会：

- **安装**所有`dependencies`、`devDependencies`和`optionalDependencies`。Bun 默认不安装`peerDependencies`。
- 在适当的时间运行项目的`{pre|post}install`和`{pre|post}prepare`脚本。出于安全原因，Bun _不会执行_ 已安装依赖项的生命周期脚本。
- 在项目根目录写入一个`bun.lockb`锁定文件。

要以生产模式安装（即不包括`devDependencies`）：

```bash
$ bun install --production
```

要使用可重现的依赖关系安装，请使用 `--frozen-lockfile`。如果您的 `package.json` 与 `bun.lockb` 不一致，Bun 将退出并显示错误消息。这对于生产构建和 CI 环境非常有用。

```bash
$ bun install --frozen-lockfile
```

要执行干运行（即不实际安装任何内容）：

```bash
$ bun install --dry-run
```

要修改日志的详细程度：

```bash
$ bun install --verbose # 调试日志
$ bun install --silent  # 无日志
```

{% details summary="配置行为" %}
`bun install`的默认行为可以在`bunfig.toml`中配置：

```toml
[install]

# 是否安装 optionalDependencies
optional = true

# 是否安装 devDependencies
dev = true

# 是否安装 peerDependencies
peer = false

# 相当于 `--production` 标志
production = false

# 相当于 `--frozen-lockfile` 标志
frozenLockfile = false

# 相当于 `--dry-run` 标志
dryRun = false
```

{% /details %}

### `bun add`

要添加特定的包：

```bash
$ bun add preact
```

要指定版本、版本范围或标签：

```bash
$ bun add zod@3.20.0
$ bun add zod@^3.0.0
$ bun add zod@latest
```

要将包添加为开发依赖项（`"devDependencies"`）：

```bash
$ bun add --dev @types/react
$ bun add -d @types/react


```

要将包添加为可选依赖项（`"optionalDependencies"`）：

```bash
$ bun add --optional lodash
```

要添加一个包并固定到解析的版本，请使用 `--exact`。这将解析包的版本，并将其添加到您的 `package.json` 中，而不是使用版本范围。

```bash
$ bun add react --exact
```

这将在您的 `package.json` 中添加以下内容：

```jsonc
{
  "dependencies": {
    // 不使用 --exact
    "react": "^18.2.0", // 这匹配 >= 18.2.0 < 19.0.0

    // 使用 --exact
    "react": "18.2.0" // 这只匹配 18.2.0
  }
}
```

要全局安装一个包：

```bash
$ bun add --global cowsay # 或 `bun add -g cowsay`
$ cowsay "Bun!"
 ______
< Bun! >
 ------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

{% details summary="配置全局安装行为" %}

```toml
[install]
# `bun install --global` 安装包的位置
globalDir = "~/.bun/install/global"

# 全局安装的包二进制文件链接的位置
globalBinDir = "~/.bun/bin"
```

{% /details %}

要查看给定命令的完整选项列表：

```bash
$ bun add --help
```

### `bun remove`

要移除一个依赖项：

```bash
$ bun remove preact
```

## 本地包（`bun link`）

在本地目录中使用 `bun link` 来注册当前包作为“可链接”的包。

```bash
$ cd /path/to/cool-pkg
$ cat package.json
{
  "name": "cool-pkg",
  "version": "1.0.0"
}
$ bun link
bun link v1.x (7416672e)
成功！已注册“cool-pkg”

要在项目中使用 cool-pkg，请运行：
  bun link cool-pkg

或在 package.json 文件的 dependencies 中添加它：
  "cool-pkg": "link:cool-pkg"
```

现在，可以使用 `bun link cool-pkg` 将此包“链接”到其他项目中。这将在目标项目的 `node_modules` 目录中创建一个符号链接，指向本地目录。

```bash
$ cd /path/to/my-app
$ bun link cool-pkg
```

此外，可以使用 `--save` 标志将 `cool-pkg` 添加到您的应用程序的 package.json 的 `dependencies` 字段中，使用特殊的版本说明符，告诉 Bun 从已注册的本地目录加载，而不是从`npm`中安装：

```json-diff
  {
    "name": "my-app",
    "version": "1.0.0",
    "dependencies": {
+     "cool-pkg": "link:cool-pkg"
    }
  }
```

## 受信任的依赖项

与其他 npm 客户端不同，Bun 不会执行已安装依赖项的任意生命周期脚本，比如 `postinstall`。这些脚本代表潜在的安全风险，因为它们可以在您的机器上执行任意代码。

<!-- Bun 维护了一个包含已知安全的具有 `postinstall` 脚本的常见包的允许列表。要运行不在此列表中的包的生命周期脚本，请将包添加到 package.json 的 `trustedDependencies` 中。 -->

要告诉 Bun 允许特定包的生命周期脚本，请将包添加到您的 package.json 的 `trustedDependencies` 中。

<!-- ```json-diff
  {
    "name": "my-app",
    "version": "1.0.0",
+   "trustedDependencies": {
+     "my-trusted-package": "*"
+   }
  }
``` -->

```json-diff
  {
    "name": "my-app",
    "version": "1.0.0",
+   "trustedDependencies": ["my-trusted-package"]
  }
```

Bun 会读取此字段，并运行 `my-trusted-package` 的生命周期脚本。

<!-- 如果指定版本范围，Bun 仅在解析的包版本与范围匹配时才执行生命周期脚本。 -->
<!--
```json
{
  "name": "my-app",
  "version": "1.0.0",
  "trustedDependencies": {
    "my-trusted-package": "^1.0.0"
  }
}
``` -->

## Git 依赖项

要从 Git 存储库添加依赖项：

```bash
$ bun install git@github.com:moment/moment.git
```

Bun 支持多种协议，包括 [`github`](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#github-urls)、[`git`](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#git-urls-as-dependencies)、`git+ssh`、`git+https` 等等。

```json
{
  "dependencies": {
    "dayjs": "git+https://github.com/iamkun/dayjs.git",
    "lodash": "git+ssh://github.com/lodash/lodash.git#4.17.21",
    "moment": "git@github.com:moment/moment.git",
    "zod": "github:colinhacks/zod"
  }
}
```

## Tarball 依赖项

包名称可以对应于公开托管的 `.tgz` 文件。在 `bun install` 期间，Bun 将从指定的 tarball URL 下载并安装包，而不是从包注册表中安装。

```json#package.json
{
  "dependencies": {
    "zod": "https://registry.npmjs.org/zod/-/zod-3.21.4.tgz"
  }
}
```

## CI/CD

想要加速 CI？使用官方的 `oven-sh/setup-bun` 操作来在 GitHub Actions 流水线中安装 `bun`。

```yaml#.github/workflows/release.yml
name: bun-types
jobs:
  build:
    name: build-app
    runs-on:

 ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v3
      - name: Install bun
        uses: oven-sh/setup-bun@v1
      - name: Install dependencies
        run: bun install
      - name: Build app
        run: bun run build
```
