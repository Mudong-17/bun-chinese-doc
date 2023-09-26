---
outline: "deep"
---

# Lockfile


运行 `bun install` 会创建一个名为 `bun.lockb` 的二进制锁定文件。

#### 为什么是二进制的？

简而言之：性能。Bun 的锁定文件保存和加载非常快速，并保存了比通常在锁定文件中包含的数据要多得多。

#### 如何检查 Bun 的锁定文件？

运行 `bun install -y` 以生成一个更容易检查的与 Yarn 兼容的 `yarn.lock`（v1）文件。

#### 如何使用 `git diff` 查看 Bun 的锁定文件？

将以下内容添加到您的本地或全局 `.gitattributes` 文件中：

```
*.lockb binary diff=lockb
```

然后使用以下命令将以下内容添加到您的本地 git 配置中：

```sh
$ git config diff.lockb.textconv bun
$ git config diff.lockb.binary true
```

或者使用 `--global` 选项将以下内容添加到您的全局 git 配置（系统范围）中：

```sh
$ git config --global diff.lockb.textconv bun
$ git config --global diff.lockb.binary true
```

**为什么这样做有效：**

- `textconv` 告诉 Git 在比较之前在文件上运行 `bun`
- `binary` 告诉 Git 将文件视为二进制文件（以防尝试逐行比较文件）

运行 `bun` 在锁定文件上将打印出易于阅读的差异。因此，我们只需要告诉 `git` 在比较之前在锁定文件上运行 `bun`。

#### 平台特定的依赖关系？

Bun 在锁定文件中存储了来自 npm 的标准化 `cpu` 和 `os` 值，以及已解析的包。它会跳过在运行时为当前目标禁用的下载、提取和安装的包。这意味着即使最终安装的包发生变化，锁定文件也不会在平台/架构之间发生更改。

#### Bun 的锁定文件存储了什么？

包、这些包的元数据、提升的安装顺序、每个包的依赖关系、这些依赖关系解析到的包、完整性哈希（如果可用）、每个包的解析以及版本（或等效版本）。

#### 为什么 Bun 的锁定文件速度快？

它对所有数据使用线性数组。包是通过自增的整数 ID 或包名称的哈希引用的。长于 8 个字符的字符串会被去重。在保存到磁盘之前，锁定文件会进行垃圾回收，并通过遍历包树并按依赖关系顺序克隆包来使其确定性。

#### 我可以选择退出吗？

要在安装时不创建锁定文件：

```bash
$ bun install --no-save
```

要额外安装 Yarn 锁定文件以补充 `bun.lockb`：

```bash
#CLI flag
$ bun install --yarn
```

```toml#bunfig.toml
[install.lockfile]
# 是否保存一个非-Bun 锁定文件与 bun.lockb 一起
# 仅支持 "yarn"
print = "yarn"
```
