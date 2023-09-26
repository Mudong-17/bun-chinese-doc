Bun 实现了[`node:crypto`](https://nodejs.org/api/crypto.html)中的`createHash`和`createHmac`函数，除此之外，还提供了下面文档中介绍的 Bun 本地 API。

## `Bun.password`

`Bun.password`是一组用于使用各种密码学安全算法对密码进行哈希和验证的实用函数。

```ts
const password = "super-secure-pa$$word";

const hash = await Bun.password.hash(password);
// => $argon2id$v=19$m=65536,t=2,p=1$tFq+9AVr1bfPxQdh6E8DQRhEXg/M/SqYCNu6gVdRRNs$GzJ8PuBi+K+BVojzPfS5mjnC8OpLGtv8KJqF99eP6a4

const isMatch = await Bun.password.verify(password, hash);
// => true
```

`Bun.password.hash`的第二个参数接受一个参数对象，允许您选择和配置哈希算法。

```ts
const password = "super-secure-pa$$word";

// 使用argon2（默认）
const argonHash = await Bun.password.hash(password, {
  algorithm: "argon2id", // "argon2id" | "argon2i" | "argon2d"
  memoryCost: 4, // 使用的内存量（以kibibytes为单位）
  timeCost: 3, // 迭代次数
});

// 使用bcrypt
const bcryptHash = await Bun.password.hash(password, {
  algorithm: "bcrypt",
  cost: 4, // 介于4和31之间的数字
});
```

生成的哈希中包含用于创建哈希的算法。使用`bcrypt`时，返回的哈希以[Modular Crypt Format](https://passlib.readthedocs.io/en/stable/modular_crypt_format.html)编码，以兼容大多数现有的`bcrypt`实现；使用`argon2`时，结果以较新的[PHC 格式](https://github.com/P-H-C/phc-string-format/blob/master/phc-sf-spec.md)编码。

`verify`函数会根据输入哈希自动检测算法，并使用正确的验证方法。它可以正确地从 PHC 或 MCF 编码的哈希中推断算法。

```ts
const password = "super-secure-pa$$word";

const hash = await Bun.password.hash(password, {
  /* 配置 */
});

const isMatch = await Bun.password.verify(password, hash);
// => true
```

所有函数还提供了同步版本。请记住，这些函数在计算上是昂贵的，因此使用阻塞 API 可能会降低应用程序性能。

```ts
const password = "super-secure-pa$$word";

const hash = Bun.password.hashSync(password, {
  /* 配置 */
});

const isMatch = Bun.password.verifySync(password, hash);
// => true
```

## `Bun.hash`

`Bun.hash`是用于非密码学哈希的实用程序集。非密码学哈希算法被优化以计算速度为主，而不是冲突抵抗或安全性。

标准的`Bun.hash`函数使用[Wyhash](https://github.com/wangyi-fudan/wyhash)从任意大小的输入生成 64 位哈希。

```ts
Bun.hash("some data here");
// 11562320457524636935n
```

输入可以是字符串、`TypedArray`、`DataView`、`ArrayBuffer`或`SharedArrayBuffer`。

```ts
const arr = new Uint8Array([1, 2, 3, 4]);

Bun.hash("some data here");
Bun.hash(arr);
Bun.hash(arr.buffer);
Bun.hash(new DataView(arr.buffer));
```

可选地，可以指定整数种子作为第二个参数。对于 64 位哈希，应该将种子指定为 BigInt，以避免精度损失。

```ts
Bun.hash("some data here", 1234);
// 15724820720172937558n
```

`Bun.hash`属性提供了其他哈希算法，其 API 对每种算法都相同，只是返回类型从 32 位哈希的数字更改为 64 位哈希的 bigint。

```ts
Bun.hash.wyhash("data", 1234); // 相当于Bun.hash()
Bun.hash.crc32("data", 1234);
Bun.hash.adler32("data", 1234);
Bun.hash.cityHash32("data", 1234);
Bun.hash.cityHash64("data", 1234);
Bun.hash.murmur32v3("data", 1234);
Bun.hash.murmur32v2("data", 1234);
Bun.hash.murmur64v2("data", 1234);
```

## `Bun.CryptoHasher`

`Bun.CryptoHasher`是一个通用的实用程序类，允许您逐步计算字符串或二进制数据的哈希，使用一系列密码哈希算法。支持以下算法：

- `"blake2b256"`
- `"md4"`
- `"md5"`
- `"ripemd160"`
- `"sha1"`
- `"sha224"`
- `"sha256"`
- `"sha384"`
- `"sha512"`
- `"sha512-256"`

```ts
const hasher = new Bun.CryptoHasher("sha256");
hasher.update("hello world");
hasher.digest();
// Uint8Array(32) [ <byte>, <byte>, ... ]
```

初始化后，可以使用`.update()`逐步将数据提供给哈希器。此方法接受`string`、`TypedArray`和`ArrayBuffer`。

```ts
const hasher = new Bun.CryptoHasher("sha256");

hasher.update("hello world");
hasher.update(new Uint8Array([1, 2, 3]));
hasher.update(new ArrayBuffer(10));
```

如果传递了一个`string`，则可以使用可选的第二个参数来指定编码（默认为'utf-8'）。支持以下编码：

| 类型         | 值                                          |
| ------------ | ------------------------------------------- |
| 二进制编码   | `"base64"` `"base64url"` `"hex"` `"binary"` |
| 字符编码     | `"utf8"` `"utf-8"` `"utf16le"` `"latin1"`   |
| 旧版字符编码 | `"ascii"` `"binary"` `"ucs2"` `"ucs-2"`     |

```ts
hasher.update("hello world"); // 默认为utf8
hasher.update("hello world", "hex");
hasher.update("hello world", "base64");
hasher.update("hello world", "latin1");
```

在数据提供给哈希器之后，可以使用`.digest()`方法计算最终哈希值。默认情况下，此方法返回包含哈希值的`Uint8Array`。

```ts
const hasher = new Bun.CryptoHasher("sha256");
hasher.update("hello world");

hasher.digest();
// => Uint8Array(32) [ 185, 77, 39, 185, 147, ... ]
```

`.digest()`方法还可以选择将哈希值作为字符串返回。为此，请指定编码：

```ts
hasher.digest("base64");
// => "uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek="

hasher.digest("hex");
// => "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
```

另外，该方法还可以将哈希值写入现有的`TypedArray`实例中。在某些性能敏感的应用程序中，这可能是有用的。

```ts
const arr = new Uint8Array(32);

hasher.digest(arr);

console.log(arr);
// => Uint8Array(32) [ 185, 77, 39, 185, 147, ... ]
```
