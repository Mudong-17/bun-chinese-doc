---
outline: "deep"
---

# Environment variables

Bun 会自动读取您的`.env`文件，并提供以编程方式读取和写入环境变量的惯用方法。此外，Bun 特定的环境变量还可以配置 Bun 的运行时行为的某些方面。

## 设置环境变量

Bun 会自动读取以下文件（按优先级递增的顺序列出）。

- `.env`
- `.env.production`、`.env.development`、`.env.test`（根据`NODE_ENV`的值而定）
- `.env.local`

```txt
#.env
FOO=hello
BAR=world
```

变量还可以通过命令行进行设置。

```sh
$ FOO=helloworld bun run dev
```

或者通过将属性分配给`process.env`来以编程方式设置。

```ts
process.env.FOO = "hello";
```

### `dotenv`

一般来说，您将不再需要使用`dotenv`，因为 Bun 会自动读取`.env`文件。

## 读取环境变量

当前环境变量可以通过`process.env`访问。

```ts
process.env.API_TOKEN; // => "secret"
```

Bun 还通过`Bun.env`公开这些变量，这是`process.env`的简单别名。

```ts
Bun.env.API_TOKEN; // => "secret"
```

要将当前设置的所有环境变量打印到命令行，请运行`bun run env`。这对于调试很有用。

```sh
$ bun run env
BAZ=stuff
FOOBAR=aaaaaa
<lots more lines>
```

## TypeScript

在 TypeScript 中，`process.env`的所有属性都被类型化为`string | undefined`。

```ts
Bun.env.whatever;
// string | undefined
```

要获得自动完成并告诉 TypeScript 将变量视为非可选字符串，我们将使用[接口合并](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces)。

```ts
declare module "bun" {
  interface Env {
    AWESOME: string;
  }
}
```

将此行添加到项目中的任何文件中。它将全局添加`process.env`和`Bun.env`的`AWESOME`属性。

```ts
process.env.AWESOME; // => string
```

## 配置 Bun

这些环境变量由 Bun 读取，并配置其行为的各个方面。

| 名称           | 描述                                                                                                                                                                                                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `TMPDIR`       | Bun 在打包或其他操作期间偶尔需要一个目录来存储中间资源。如果未设置，默认为特定于平台的临时目录：Linux 上为 `/tmp`，macOS 上为 `/private/tmp`。                                                                                                                           |
| `NO_COLOR`     | 如果 `NO_COLOR=1`，则 [禁用](https://no-color.org/) ANSI 颜色输出。                                                                                                                                                                                                      |
| `FORCE_COLOR`  | 如果 `FORCE_COLOR=1`，则即使设置了 `NO_COLOR`，也会强制启用 ANSI 颜色输出。                                                                                                                                                                                              |
| `DO_NOT_TRACK` | 如果 `DO_NOT_TRACK=1`，则 [禁用](https://do-not-track.dev/) 分析。Bun 记录捆绑时间（以便我们可以用数据回答问题，"Bun 是否越来越快？"）和功能使用情况（例如，"人们是否真正使用宏？"）。请求主体大小约为 60 字节，因此数据量不大。相当于 `bunfig` 中的 `telemetry=false`。 |
