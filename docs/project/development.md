为 Bun 配置开发环境可能需要 10-30 分钟，具体时间取决于您的互联网连接速度和计算机性能。您需要约 10GB 的可用磁盘空间用于存储代码库和构建产物。

如果您使用的是 Windows 操作系统，您必须使用 WSL 环境，因为 Bun 目前尚不能在 Windows 上本地编译。

在开始之前，您需要已经安装了 Bun 的发布版本，因为我们使用我们的打包工具来转译和压缩我们的代码。

<codetabs>

```bash#本地安装
$ curl -fsSL https://bun.sh/install | bash # 适用于 macOS、Linux 和 WSL
```

```bash#npm安装
$ npm install -g bun # 您将永远需要的最后一个 `npm` 命令
```

```bash#Homebrew安装
$ brew tap oven-sh/bun # 适用于 macOS 和 Linux
$ brew install bun
```

```bash#Docker安装
$ docker pull oven/bun
$ docker run --rm --init --ulimit memlock=-1:-1 oven/bun
```

```bash#proto安装
$ proto install bun
```

</codetabs>

## 安装 LLVM

Bun 需要 LLVM 16 和 Clang 16（`clang`是 LLVM 的一部分）。这个版本要求是为了与预编译的 WebKit 版本相匹配，因为不匹配的版本会导致运行时内存分配失败。在大多数情况下，您可以通过系统包管理器安装 LLVM：

<codetabs>

```bash#macOS（Homebrew）
$ brew install llvm@16
```

```bash#Ubuntu/Debian
$ # LLVM有一个自动安装脚本，与所有版本的Ubuntu兼容
$ wget https://apt.llvm.org/llvm.sh -O - | sudo bash -s -- 16 all
```

```bash#Arch
$ sudo pacman -S llvm16 clang16 lld
```

</codetabs>

如果以上解决方案都不适用，您将不得不[手动安装](https://github.com/llvm/llvm-project/releases/tag/llvmorg-16.0.6)LLVM。

确保 LLVM 16 在您的路径中：

```bash
$ which clang-16
```

如果没有，请运行以下命令手动链接它：

<codetabs>

```bash#macOS（Homebrew）
# 如果您使用的是fish，请使用fish_add_path
$ export PATH="$PATH:$(brew --prefix llvm@16)/bin"
$ export LDFLAGS="$LDFLAGS -L$(brew --prefix llvm@16)/lib"
$ export CPPFLAGS="$CPPFLAGS -I$(brew --prefix llvm@16)/include"
```

```bash#Arch
$ export PATH="$PATH:/usr/lib/llvm16/bin"
$ export LDFLAGS="$LDFLAGS -L/usr/lib/llvm16/lib"
$ export CPPFLAGS="$CPPFLAGS -I/usr/lib/llvm16/include"
```

</codetabs>

## 安装依赖项

使用您系统的包管理器，安装 Bun 的其他依赖项：

<codetabs>

```bash#macOS（Homebrew）
$ brew install automake ccache cmake coreutils esbuild gnu-sed go libiconv libtool ninja pkg-config rust
```

```bash#Ubuntu/Debian
$ sudo apt install cargo ccache cmake git golang libtool ninja-build pkg-config rustc esbuild
```

```bash#Arch
$ sudo pacman -S base-devel ccache cmake esbuild git go libiconv libtool make ninja pkg-config python rust sed unzip
```

</codetabs>

<details>
<summary>Ubuntu — 无法找到软件包esbuild</summary>
如果您使用的 Ubuntu 镜像不包含原始 Ubuntu 服务器的精确副本，`apt install esbuild`命令可能会失败，并显示“无法找到软件包”错误。如果您没有使用任何镜像，但启用了 Ubuntu Universe，也可能会发生相同的错误。在这种情况下，您可以手动安装 esbuild：

```bash
$ curl -fsSL https://esbuild.github.io/dl/latest | sh
$ chmod +x ./esbuild
$ sudo mv ./esbuild /usr/local/bin
```

</details>

此外，您需要一个

npm 包管理器（如`bun`、`npm`等）来安装`package.json`的依赖项。

## 安装 Zig

Zig 可以通过我们的 npm 包[`@oven/zig`](https://www.npmjs.com/package/@oven/zig)安装，也可以使用[zigup](https://github.com/marler8997/zigup)进行安装。

```bash
$ bun install -g @oven/zig
$ zigup 0.12.0-dev.163+6780a6bbf
```

> 我们最后在**2023 年 7 月 18 日**更新了 Zig

## 首次构建

在克隆代码库后，运行以下命令以进行首次构建。这可能需要一些时间，因为它会克隆子模块并构建依赖项。

```bash
$ make setup
```

二进制文件将位于`packages/debug-bun-{platform}-{arch}/bun-debug`。建议将其添加到您的`$PATH`中。要验证构建是否成功，让我们在 Bun 的开发构建上打印版本号。

```bash
$ packages/debug-bun-*/bun-debug --version
bun 1.x.y__dev
```

注意：`make setup`只是以下命令的别名：

```bash
$ make assert-deps submodule npm-install-dev node-fallbacks runtime_js fallback_decoder bun_error mimalloc picohttp zlib boringssl libarchive lolhtml sqlite usockets uws tinycc c-ares zstd base64 cpp zig link
```

## 重新构建

Bun 使用一系列 make 命令来重新构建代码库的各个部分。重新构建的一般规则是有`make link`用于重新运行链接器，然后不同的 make 目标用于代码库的不同部分。不要传递`-j`给 make，因为如果以无序的方式运行这些脚本，它们将会失败，并且在构建过程中将尽可能使用多个核心。

| 发生了什么变化                        | 运行此命令                                                                                                                            |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Zig 代码                              | `make zig`                                                                                                                            |
| C++ 代码                              | `make cpp`                                                                                                                            |
| Zig + C++ 代码                        | `make dev`（上述两个的组合）                                                                                                          |
| `src/js`中的 JS/TS 代码               | `make js`（在 bun-debug 中，js 是从磁盘加载的，无需重新编译）。如果您更改了任何文件的名称或添加/删除任何内容，还必须运行 `make dev`。 |
| `*.classes.ts`                        | `make generate-classes dev`                                                                                                           |
| JSSink                                | `make generate-sink cpp`                                                                                                              |
| `src/node_fallbacks/*`                | `make node-fallbacks zig`                                                                                                             |
| `identifier_data.zig`                 | `make identifier-cache zig`                                                                                                           |
| 使用 `cppFn`/`JSC.markBinding` 的代码 | `make headers`（TODO：解释这用于什么以及为什么有用）                                                                                  |

`make setup`克隆了一堆子模块并构建了子项目。当子模块已过时时，运行`make submodule`以快速重置/更新所有子模块，然后您可以使用各自的命令重建各个子模块。

| 依赖项         | 运行此命令                          |
| -------------- | ----------------------------------- |
| WebKit         | `bun install`（这是一个预构建的包） |
| uWebSockets    | `make uws`                          |
| Mimalloc       | `make mimalloc`                     |
| PicoHTTPParser | `make picohttp`                     |
| zlib           | `make zlib`                         |
| BoringSSL      | `make boringssl`                    |
| libarchive     | `make libarchive`                   |
| lolhtml        | `make lolhtml`                      |
| sqlite         | `make sqlite`                       |
| TinyCC         | `make tinycc`                       |
| c-ares         | `make c-ares`                       |
| zstd           | `make zstd`                         |
| Base64         | `make base64`                       |

上述命令可能还需要重新构建 Zig 和/或 C++代码。

## Visual Studio Code

Visual Studio Code 是 Bun 的推荐 IDE，因为已经进行了配置。一旦打开，您可以运行`Extensions: Show Recommended Extensions`来安装 Zig 和 C++的推荐扩展。ZLS 已经自动配置。

## JavaScript 内置模块

当您更改`src/js/builtins/*`中的任何内容或切换分支时，请运行以下命令：

```bash
$ make js cpp
```

这会将 TypeScript 代码嵌入到 C++头文件中。

> 确保已安装`ccache`，否则重新生成将花费比应该更长的时间。

有关`src/js`的工作原理的更多信息，请参阅代码库中的`src/js/README.md`。

## 代码生成脚本

Bun 利用了许多代码生成脚本。

[./src/bun.js/bindings/headers.h](https://github.com/oven-sh/bun/blob/main/src/bun.js/bindings/headers.h)文件具有 Zig <> C++代码的绑定。此文件是通过运行以下命令生成的：

```bash
$ make headers
```

这确保了 Zig 和 C++的类型正确匹配，通过导出/导入的函数使用 comptime 反射。

以`*.classes.ts`结尾的 TypeScript 文件是另一个代码生成脚本。它为在 Zig 中实现的类生成 C++样板代码。生成的代码位于以下位置：

- [src/bun.js/bindings/ZigGeneratedClasses.cpp](https://github.com/oven-sh/bun/tree/main/src/bun.js/bindings/ZigGeneratedClasses.cpp)
- [src/bun.js/bindings/ZigGeneratedClasses.h](https://github.com/oven-sh/bun/tree/main/src/bun.js/bindings/ZigGeneratedClasses.h)
- [src/bun.js/bindings/generated_classes.zig](https://github.com/oven-sh/bun/tree/main/src/bun.js/bindings/generated_classes.zig)

要生成代码，请运行：

```bash
$ make codegen
```

最后，

我们还有一个[代码生成脚本](https://github.com/oven-sh/bun/blob/main/src/bun.js/scripts/generate-jssink.js)用于我们的本地流实现。要运行它，运行：

```bash
$ make generate-sink
```

您可能不需要经常运行它。

## 修改 ESM 模块

某些模块，如`node:fs`、`node:stream`、`bun:sqlite`和`ws`，是用 JavaScript 实现的。这些模块位于`src/js/{node,bun,thirdparty}`文件中，并且使用 Bun 进行预捆绑。捆绑的代码已提交，以便 CI 构建可以在不需要 Bun 副本的情况下运行。

当更改这些模块时，请运行：

```
$ make js
```

在调试构建中，Bun 会自动从文件系统加载这些模块，无论它在何处编译，因此无需重新运行`make dev`。

## 发布构建

要构建 Bun 的发布版本，请运行：

```bash
$ make release-bindings -j12
$ make release
```

二进制文件将位于`packages/bun-{platform}-{arch}/bun`。

## Valgrind

在 Linux 上，Valgrind 可以帮助找到内存问题。

请注意：

- JavaScriptCore 不支持 Valgrind。它会报告虚假的错误。
- Valgrind 很慢
- 当启用调试构建时，Mimalloc 有时会引发虚假错误

由于 DWARF 5 调试符号的原因，您需要 Valgrind 的最新版本。您可能需要手动编译 Valgrind，而不是从 Linux 包管理器中使用它。

如果在 Bun 中运行多线程代码（例如 bundler），则需要使用`--fair-sched=try`，否则它会挂起。

```bash
$ valgrind --fair-sched=try --track-origins=yes bun-debug <args>
```

## 更新`WebKit`

Bun 团队偶尔会提升 Bun 中使用的 WebKit 版本。当这种情况发生时，您可能会在运行`git status`时看到类似以下内容：

```bash
$ git status
On branch my-branch
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   src/bun.js/WebKit (new commits)
```

出于性能原因，`make submodule`不会自动更新 WebKit 子模块。要更新，请从 Bun 仓库的根目录运行以下命令：

```bash
$ bun install
$ make cpp
```

## 故障排除

### Ubuntu 上的“span”文件未找到

> ⚠️ 请注意，下面的说明特定于在 Ubuntu 上发生的问题。其他 Linux 发行版不太可能出现相同的问题。

Clang 编译器通常默认使用`libstdc++` C++标准库。`libstdc++`是由 GNU 编译器集合（GCC）提供的默认 C++标准库实现。虽然 Clang 可能会链接到`libc++`库，但这需要在运行 Clang 时显式提供`-stdlib`标志。

Bun 依赖于 C++20 功能，如`std::span`，而这些功能在低于 11 的 GCC 版本中不可用。GCC 10 没有实现所有 C++20 功能。因此，运行`make setup`可能会失败，并显示以下错误：

```
fatal error: 'span' file not found
#include <span>
         ^~~~~~
```

要解决此错误，我们需要将 GCC 版本更新到 11。以下是一般步骤：

```bash
$ sudo apt update
$ sudo apt install gcc-11 g++-11
# 如果上面的命令失败并显示“无法找到软件包gcc-11”，我们需要添加APT存储库
$ sudo add-apt-repository -y ppa:ubuntu-toolchain-r/test
# 现在再次运行“apt install”
$ sudo apt install gcc-11 g++-11
```

现在，我们需要将 GCC 11 设置为默认编译器：

```bash
$ sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-11 100
$ sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-11 100
```

### libarchive

如果在编译`libarchive`时遇到错误，请运行以下命令：

```bash
$ brew install pkg-config
```

### `zig build obj`上的文件丢失

如果出现有关`zig build obj`上缺少文件的错误，请确保已构建了头文件。

```bash
$ make headers
```

### 未找到`cmakeconfig.h`

如果出现找不到`cmakeconfig.h`的错误，请检查预编译的 WebKit 是否正确安装。

```bash
$ bun install
```

检查命令是否安装了 webkit，并且您可以手动查找`node_modules/bun-webkit-{platform}-{arch}`：

```bash
# 这应该会显示两个目录。如果没有，请出了问题
$ echo node_modules/bun-webkit*
```

### macOS 上的“library not found for -lSystem”

如果在编译时看到此错误，请运行：

```bash
$ xcode-select --install
```

## Arch Linux / 找不到`libatomic.a`

Bun 需要以静态方式链接`libatomic`。在 Arch Linux 上，它仅以共享库的形式提供，但是可以通过创建符号链接来解决此问题，以在本地使构建正常工作。

```bash
$ sudo ln -s /lib/libatomic.so /lib/libatomic.a
```

以这种方式编译的 Bun 版本可能不适用于其他系统。
