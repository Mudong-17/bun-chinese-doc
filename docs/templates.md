# Templates

## `bun init`

使用交互式的 `bun init` 命令来创建一个空白项目。

```bash
$ bun init
bun init helps you get started with a minimal project and tries to
guess sensible defaults. Press ^C anytime to quit.

package name (quickstart):
entry point (index.ts):

Done! A package.json file was saved in the current directory.
 + index.ts
 + .gitignore
 + tsconfig.json (for editor auto-complete)
 + README.md

To get started, run:
  bun run index.ts
```

按 `enter` 键接受每个提示的默认答案，或者使用 `-y` 标志自动接受默认设置。

## `bun create`

**注意** — 您不需要使用 `bun create` 来使用 Bun。您根本不需要任何配置。这个命令存在是为了使入门更加快速和简便。

使用 `bun create` 来创建一个新的 Bun 项目。这是一个灵活的命令，可以用来创建一个新项目，使用 `create-<template>` npm 包、GitHub 仓库或本地模板。

### 从 `npm` 安装

```sh
$ bun create <template> [<destination>]
```

假设您没有与相同名称的[本地模板](#local-templates)，此命令将下载并执行来自 npm 的`create-<template>`包。以下两个命令将表现相同：

```sh
$ bun create remix
$ bunx create-remix
```

请参阅相关的`create-<template>`包的文档以获取完整的文档和使用说明。

### 从 GitHub 下载

这将下载 GitHub 存储库的内容到磁盘上。

```bash
$ bun create <user>/<repo>
$ bun create github.com/<user>/<repo>
```

可选择为目标文件夹指定名称。如果未指定目标文件夹，则将使用存储库名称。

```bash
$ bun create <user>/<repo> mydir
$ bun create github.com/<user>/<repo> mydir
```

Bun 将执行以下步骤：

- 下载模板
- 将所有模板文件复制到目标文件夹
- 使用 `bun install` 安装依赖项。
- 初始化一个新的 Git 仓库。使用 `--no-git` 标志来退出此步骤。
- 运行模板的配置的 `start` 脚本（如果定义了）。

默认情况下，Bun 不会覆盖任何现有文件。使用 `--force` 标志来覆盖现有文件。

### 从本地模板创建

**⚠️ 警告** — 与远程模板不同，使用本地模板运行 `bun create` 将删除整个目标文件夹，如果它已经存在！请谨慎使用。

Bun 的模板化工具可以扩展以支持在本地文件系统上定义的自定义模板。这些模板应该位于以下目录之一：

- `$HOME/.bun-create/<name>`：全局模板
- `<项目根目录>/.bun-create/<name>`：项目特定的模板

**注意** — 您可以通过设置 `BUN_CREATE_DIR` 环境变量来自定义全局模板路径。

要创建一个本地模板，导航到 `$HOME/.bun-create` 并创建一个具有所需模板名称的新目录。

```bash
$ cd $HOME/.bun-create
$ mkdir foo
$ cd foo
```

然后，在该目录中创建一个包含以下内容的 `package.json` 文件：

```json
{
  "name": "foo"
}
```

您可以在文件系统的其他位置运行 `bun create foo` 以验证 Bun 是否正确找到了您的本地模板。

#### 设置逻辑

您可以在本地模板的 `package.json` 的 `"bun-create"` 部分中指定预安装和后安装的设置脚本。

```json
{
  "name": "@bun-examples/simplereact",
  "version": "0.0.1",
  "main": "index.js",
  "dependencies": {
    "react": "^17.0.2",
    "react-dom": "^17.0.2"
  },
  "bun-create": {
    "preinstall": "echo 'Installing...'", // a single command
    "postinstall": ["echo 'Done!'"], // an array of commands
    "start": "bun run echo 'Hello world!'"
  }
}
```

以下字段受支持。每个字段可以对应一个字符串或字符串数组。字符串数组将按顺序执行。

{% table %}

---

- `postinstall`
- 在安装依赖项后运行

---

- `preinstall`
- 在安装依赖项之前运行

{% /table %}

在克隆模板后，`bun create` 将自动从 `package.json` 中删除 `"bun-create"` 部分，然后将其写入目标文件夹。

## 参考

### CLI 标志

{% table %}

- 标志
- 描述

---

- `--force`
- 覆盖现有文件

---

- `--no-install`
- 跳过安装 `node_modules` 和任务

---

- `--no-git`
- 不要初始化 Git 仓库

---

- `--open`
- 在完成后启动并在浏览器中打开

{% /table %}

### 环境变量

{% table %}

- 名称
- 描述

---

- `GITHUB_API_DOMAIN`
- 如果您使用的是 GitHub 企业版或代理，可以自定义 Bun 获取下载的 GitHub 域

---

- `GITHUB_API_TOKEN`
- 这使得 `bun create` 可以与私有仓库一起使用，或者如果您被限制了速率

{% /table %}

{% details summary=" `bun create` 的工作原理" %}

当您运行 `bun create ${template} ${destination}` 时，以下情况会发生：

如果是远程模板

1. 获取 `registry.npmjs.org/@bun-examples/${template}/latest` 并解析它
2. 获取 `registry.npmjs.org/@bun-examples/${template}/-/${template}-${latestVersion}.tgz`
3. 解压缩并提取 `${template}-${latestVersion}.tgz` 到 `${destination}`

   - 如果有文件将被覆盖，除非传递了 `--force`，否则会警告并退出

如果是 GitHub 仓库

1. 从 GitHub 的 API 下载 tarball
2. 解压缩并提取到 `${destination}`

   - 如果有文件将被覆盖，除非传递了 `--force`，否则会警告并退出

否则如果是本地模板

1. 打开本地模板文件夹
2. 递归删除目标目录
3. 递归复制文件，使用可用的最快系统调用（在 macOS 上是 `fcopyfile`，在 Linux 上是 `copy_file_range`）。不要复制或遍历 `node_modules` 文件夹（这个操作使其比 `cp` 更快）

4. 解析 `package.json`（再次！），将 `name` 更新为 `${basename(destination)}`，然后从 `package.json` 中删除 `"bun-create"` 部分，然后保存更新后的 `package.json` 到磁盘。
   - 如果检测到 Next.js，则将 `bun-framework-next` 添加到依赖项列表
   - 如果检测到 Create React App，则将入口点添加到 /src/index.{js,jsx,ts,tsx} 到 `public/index.html`
   - 如果检测到 Relay，则添加 `bun-macro-relay` 以使 Relay 正常工作
5. 自动检测 npm 客户端，首选 `pnpm`、`yarn`（v1），最后是 `npm`
6. 使用 npm 客户端运行任何在 `"bun-create": { "preinstall" }` 中定义的任务
7. 运行 `${npmClient} install`，除非传递了 `--no-install` 或 package.json 中没有依赖项
8. 使用 npm 客户端运行在 `"bun-create": { "preinstall" }` 中定义的任何任务
9. 运行以下命令： `git init; git add -A .; git commit -am "Initial Commit";`

   - 将 `gitignore` 重命名为 `.gitignore`。NPM 会自动删除包中的 `.gitignore` 文件。
   - 如果有依赖项，这将在单独的线程中并发运行，同时正在安装 `node_modules`
   - 使用可用的 libgit2 进行测试，性能在微型基准测试中表现出 3 倍的速度较慢。
