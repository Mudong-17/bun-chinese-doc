如果在工作目录或更高级目录中找不到`node_modules`目录，Bun 将放弃 Node.js 风格的模块解析，改用**Bun 模块解析算法**。

在 Bun 风格的模块解析下，所有导入的包都会在执行过程中自动安装到[全局模块缓存](/docs/install/cache)中（与[`bun install`](/docs/cli/install)使用的相同缓存）。

```ts
import { foo } from "foo"; // 安装`latest`版本

foo();
```

第一次运行此脚本时，Bun 将自动安装`"foo"`并缓存它。下次运行脚本时，它将使用缓存的版本。

## 版本解析

为了确定要安装的版本，Bun 遵循以下算法：

1. 检查项目根目录中是否存在`bun.lockb`文件。如果存在，使用锁定文件中指定的版本。
2. 否则，向上扫描树以查找将`"foo"`作为依赖项的`package.json`。如果找到，使用指定的语义版本版本或版本范围。
3. 否则，使用`latest`。

## 缓存行为

一旦确定了版本或版本范围，Bun 将：

1. 检查模块缓存中是否存在兼容的版本。如果存在，使用它。
2. 在解析`latest`时，Bun 将检查是否在过去的*24 小时*内下载并缓存了`package@latest`。如果是这样，使用它。
3. 否则，从`npm`注册表中下载并安装适当的版本。

## 安装

包被安装并缓存在`<cache>/<pkg>@<version>`中，因此可以同时缓存同一包的多个版本。此外，在`<cache>/<pkg>/<version>`下创建了一个符号链接，以便更快地查找在缓存中存在的所有版本的包。

## 版本规范

可以通过在导入语句中直接指定版本或版本范围来简化整个解析算法。

```ts
import { z } from "zod@3.0.0"; // 特定版本
import { z } from "zod@next"; // npm标签
import { z } from "zod@^3.20.0"; // semver范围
```

## 好处

这种自动安装方法有一些好处：

- **空间效率** — 每个依赖项的版本只存在于磁盘上的一个地方。与每个项目安装的重复依赖项相比，这节省了大量空间和时间。
- **可移植性** — 要共享简单的脚本和片段，您的源文件是*自包含的*。无需将包含您的代码和配置文件的目录一起压缩。使用`import`语句中的版本规范，甚至不需要`package.json`。
- **方便** — 运行文件或脚本之前无需运行`npm install`或`bun install`。只需运行`bun run`即可。
- **向后兼容性** — 由于 Bun 仍然尊重`package.json`中指定的版本，如果存在`package.json`，您可以使用单个命令切换到 Bun 风格的解析：`rm -rf node_modules`。

## 限制

- 没有智能提示。IDE 中的 TypeScript 自动完成依赖于`node_modules`中存在类型声明文件。我们正在研究各种解决方案。
- 不支持[patch-package](https://github.com/ds300/patch-package)。

## 常见问题

{% details summary="这与pnpm的工作原理有何不同?" %}

使用 pnpm 时，您必须运行`pnpm install`，它会创建一个包含符号链接的`node_modules`文件夹，以供运

行时解析。相比之下，Bun 会在运行文件时动态解析依赖项；无需提前运行任何`install`命令。Bun 也不会创建`node_modules`文件夹。

{% /details %}

{% details summary="这与Yarn Plug'N'Play有何不同?" %}
使用 Yarn，您必须在运行脚本之前运行`yarn install`。相比之下，Bun 会在运行文件时动态解析依赖项；无需提前运行任何`install`命令。

Yarn Plug'N'Play 还使用 zip 文件存储依赖项。这使得依赖项加载[运行时较慢](https://twitter.com/jarredsumner/status/1458207919636287490)，因为随机访问 zip 文件的读取速度往往比等效的磁盘查找慢。
{% /details %}

{% details summary="这与Deno的工作原理有何不同?" %}

Deno 要求在每个 npm`import`之前都要有`npm:`标识符，不支持通过`tsconfig.json`中的`compilerOptions.paths`进行导入映射，并且对`package.json`设置的支持不完整。与 Deno 不同，Bun 目前不支持 URL 导入。
