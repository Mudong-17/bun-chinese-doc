所有从注册表下载的包都存储在全局缓存中，位于 `~/.bun/install/cache`。它们存储在子目录中，名称类似于 `${name}@${version}`，因此可以缓存多个版本的包。

{% details summary="配置缓存行为" %}

```toml
[install.cache]
# 用于缓存的目录
dir = "~/.bun/install/cache"

# 当为true时，不从全局缓存中加载。
# Bun 仍可能写入 node_modules/.cache
disable = false

# 当为true时，总是从注册表中解析最新版本
disableManifest = false
```

{% /details %}

## 最小化重新下载

Bun 努力避免多次重新下载包。在安装包时，如果缓存中已经包含了`package.json`指定范围内的版本，Bun 将使用缓存的包，而不是再次下载它。

{% details summary="安装详细信息" %}
如果 semver 版本具有预发行后缀 (`1.0.0-beta.0`) 或构建后缀 (`1.0.0+20220101`)，它会被替换为该值的哈希值，以减少与长文件路径相关的错误的机会。

当存在 `node_modules` 文件夹时，在安装之前，Bun 会检查 `node_modules` 是否包含所有预期包及其适当版本。如果是这样，`bun install` 完成。Bun 使用自定义 JSON 解析器，一旦找到`"name"`和`"version"`，它就停止解析。

如果缺少一个包或其版本与 `package.json` 不兼容，Bun 会检查缓存中是否有一个兼容的模块。如果找到，它将安装到 `node_modules` 中。否则，将从注册表下载该包，然后进行安装。
{% /details %}

## 快速复制

一旦包被下载到缓存中，Bun 仍然需要将这些文件复制到 `node_modules` 中。Bun 使用可用的最快系统调用来执行此任务。在 Linux 上，它使用硬链接；在 macOS 上，它使用 `clonefile`。

## 节省磁盘空间

由于 Bun 在 Linux 上使用硬链接将模块“复制”到项目的 `node_modules` 目录中，所以包的内容只存在于磁盘上的一个位置，大大减少了专用于 `node_modules` 的磁盘空间量。

这个好处在性能原因上不适用于 macOS，macOS 出于性能原因使用 `clonefile`。

{% details summary="安装策略" %}
此行为可以通过 `--backend` 标志进行配置，该标志由 Bun 的所有包管理命令所尊重。

- **`hardlink`**：Linux 上的默认值。
- **`clonefile`**：macOS 上的默认值。
- **`clonefile_each_dir`**：与 `clonefile` 类似，但是它会为每个目录单独克隆每个文件。它仅在 macOS 上可用，性能比 `clonefile` 慢。
- **`copyfile`**：当上述任何一个失败时使用的后备选项。在 macOS 上，它使用 `fcopyfile()`；在 Linux 上，它使用 `copy_file_range()`。
- **`symlink`**：目前只用于 `file:`（以及最终 `link:`）依赖项。为防止无限循环，它跳过了 `node_modules` 文件夹的符号链接。

如果使用 `--backend=symlink` 进行安装，Node.js 在依赖项的 node_modules 中不会解析 node_modules，除非每个依赖项都有自己的 `node_modules` 文件夹，或者您向 `node` 传递 `--preserve-symlinks`。请参阅 [Node.js 对 `--preserve-symlinks` 的文档](https://nodejs.org

/api/cli.html#--preserve-symlinks)。

```bash
$ bun install --backend symlink
$ node --preserve-symlinks ./foo.js
```

Bun 的运行时目前尚未公开类似于 `--preserve-symlinks` 的等效功能。
{% /details %}
