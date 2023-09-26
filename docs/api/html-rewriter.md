Bun 提供了一个快速的本地实现，该实现基于 Cloudflare 开发的`HTMLRewriter`模式。它为遍历和转换 HTML 文档提供了一个方便的`EventListener`-类似的 API。

```ts
const rewriter = new HTMLRewriter();

rewriter.on("*", {
  element(el) {
    console.log(el.tagName); // "body" | "div" | ...
  },
});
```

要解析和/或转换 HTML：

```ts#rewriter.ts
rewriter.transform(
  new Response(`
<!DOCTYPE html>
<html>
<!-- comment -->
<head>
  <title>My First HTML Page</title>
</head>
<body>
  <h1>My First Heading</h1>
  <p>My first paragraph.</p>
</body>
`));
```

在[Cloudflare 网站上查看完整文档](https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/)。
