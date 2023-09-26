---
outline: "deep"
---

# License

Bun 本身使用 MIT 许可证。

## JavaScriptCore

Bun 静态链接了 JavaScriptCore（以及 WebKit），它使用 LGPL-2 许可证。来自 WebKit 的 WebCore 文件也在 LGPL2 许可证下授权。根据 LGPL2：

> （1）如果您静态链接到一个 LGPL 授权的库，您必须以对象（不一定是源代码）的格式提供您的应用程序，以便用户有机会修改库并重新链接应用程序。

您可以在此处找到 Bun 使用的经过修补的 WebKit 版本：<https://github.com/oven-sh/webkit>。如果您希望使用更改重新链接 Bun：

- `git submodule update --init --recursive`
- `make jsc`
- `zig build`

这会编译 JavaScriptCore，编译 Bun 的用于 JavaScriptCore 的`.cpp`绑定（这些是使用 JavaScriptCore 的对象文件），并输出具有您的更改的新的`bun`二进制文件。

## 链接库

Bun 静态链接了以下库：

| 库                                                                     | 许可证                                                                                 |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [`boringssl`](https://boringssl.googlesource.com/boringssl/)           | [多个许可证](https://boringssl.googlesource.com/boringssl/+/refs/heads/master/LICENSE) |
| [`libarchive`](https://github.com/libarchive/libarchive)               | [多个许可证](https://github.com/libarchive/libarchive/blob/master/COPYING)             |
| [`lol-html`](https://github.com/cloudflare/lol-html/tree/master/c-api) | BSD 3-Clause                                                                           |
| [`mimalloc`](https://github.com/microsoft/mimalloc)                    | MIT                                                                                    |
| [`picohttp`](https://github.com/h2o/picohttpparser)                    | 双许可证，可根据 Perl 许可证或 MIT 许可证                                              |
| [`zstd`](https://github.com/facebook/zstd)                             | 双许可证，可根据 BSD 许可证或 GPLv2 许可证                                             |
| [`simdutf`](https://github.com/simdutf/simdutf)                        | Apache 2.0                                                                             |
| [`tinycc`](https://github.com/tinycc/tinycc)                           | LGPL v2.1                                                                              |
| [`uSockets`](https://github.com/uNetworking/uSockets)                  | Apache 2.0                                                                             |
| [`zlib-cloudflare`](https://github.com/cloudflare/zlib)                | zlib                                                                                   |
| [`c-ares`](https://github.com/c-ares/c-ares)                           | MIT 许可证                                                                             |
| [`libicu`](https://github.com/unicode-org/icu) 72                      | [许可证](https://github.com/unicode-org/icu/blob/main/icu4c/LICENSE)                   |
| [`libbase64`](https://github.com/aklomp/base64/blob/master/LICENSE)    | BSD 2-Clause                                                                           |
| [`uWebsockets`](https://github.com/jarred-sumner/uwebsockets)的分支    | Apache 2.0 许可证                                                                      |
| Tigerbeetle 的 IO 代码的部分                                           | Apache 2.0 许可证                                                                      |

## Polyfills

出于兼容性原因，以下包被嵌入到 Bun 的二进制文件中，并在导入时注入。

| 包                                                                       | 许可证 |
| ------------------------------------------------------------------------ | ------ |
| [`assert`](https://npmjs.com/package/assert)                             | MIT    |
| [`browserify-zlib`](https://npmjs.com/package/browserify-zlib)           | MIT    |
| [`buffer`](https://npmjs.com/package/buffer)                             | MIT    |
| [`constants-browserify`](https://npmjs.com/package/constants-browserify) | MIT    |
| [`crypto-browserify`](https://npmjs.com/package/crypto-browserify)       | MIT    |
| [`domain-browser`](https://npmjs.com/package/domain-browser)             | MIT    |
| [`events`](https://npmjs.com/package/events)                             | MIT    |
| [`https-browserify`](https://npmjs.com/package/https-browserify)         | MIT    |
| [`os-browserify`](https://npmjs.com/package/os-browserify)               | MIT    |
| [`path-browserify`](https://npmjs.com/package/path-browserify)           | MIT    |
| [`process`](https://npmjs.com/package/process)                           | MIT    |
| [`punycode`](https://npmjs.com/package/punycode)                         | MIT    |
| [`querystring-es3`](https://npmjs.com/package/querystring-es3)           | MIT    |
| [`stream-browserify`](https://npmjs.com/package/stream-browserify)       | MIT    |
| [`stream-http`](https://npmjs.com/package/stream-http)                   | MIT    |
| [`string_decoder`](https://npmjs.com/package/string_decoder)             | MIT    |
| [`timers-browserify`](https://npmjs.com/package/timers-browserify)       | MIT    |
| [`tty-browserify`](https://npmjs.com/package/tty-browserify)             | MIT    |
| [`url`](https://npmjs.com/package/url)                                   | MIT    |
| [`util`](https://npmjs.com/package/util)                                 | MIT    |
| [`vm-browserify`](https://npmjs.com/package/vm-browserify)               | MIT    |

## 额外的鸣谢

- Bun 的 JS 转译器、CSS 词法分析器和 Node.js 模块解析器的源代码是[@evanw](https://github.com/evanw)的[esbuild](https://github.com/evanw/esbuild)项目的 Zig 移植版本。
- 感谢[@kipply](https://github.com/kipply)为"Bun"这个名称！
