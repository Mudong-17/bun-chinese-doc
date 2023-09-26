# 安装

Bun 以一个单一的可执行文件进行发布，可以通过几种不同的方式进行安装。

## macOS and Linux

> 对于 Linux 用户，安装 Bun 需要 unzip 包。强烈建议使用内核版本 5.6 或更高版本，但最低要求是 5.1。

```bash
# macOS/Linux(curl)
curl -fsSL https://bun.sh/install | bash

# NPM
npm install -g bun

# Homebrew
brew tap oven-sh/bun
brew install bun

# Docker
docker pull oven/bun
docker run --rm --init --ulimit memlock=-1:-1 oven/bun

# Proto
proto install bun
```

## Windows

Bun 为 Windows 提供了一个有限的、实验性的本机构建。目前，仅支持 Bun 运行时。

- `bun <file>`
- `bun run <file>`
  测试运行器、包管理器和打包工具仍在开发中。以下命令已被禁用。
- `bun test`
- `bun install/add/remove`
- `bun link/unlink`
- `bun build`

## 升级

一旦安装，这个可执行文件可以自行升级。

```bash
bun upgrade
```

> 对于 Homebrew 用户，为了避免与 Homebrew 发生冲突，请使用 brew upgrade bun 。对于 proto 用户，请使用 proto install bun --pin 。请按照适用于您的情况的指南进行升级。

Bun 在每次提交到主分支时自动发布一个（未经测试的）canary 版本。要升级到最新的 canary 版本：

```bash
bun upgrade --canary
```

## 卸载

如果需要从系统中移除 Bun，可以使用以下命令：

```bash
# macOS/Linux(curl)
rm -rf ~/.bun
# NPM
npm uninstall -g bun
# Homebrew
brew uninstall bun
# Proto
proto uninstall bun
```
