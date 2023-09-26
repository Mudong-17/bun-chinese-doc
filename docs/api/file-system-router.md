---
outline: "deep"
---

# FileSystemRouter

Bun 提供了一个快速的 API，用于根据文件系统路径解析路由。这个 API 主要面向库的作者。目前只支持 Next.js 风格的文件系统路由，但将来可能会添加其他风格。

## Next.js 风格

`FileSystemRouter`类可以根据`pages`目录解析路由（目前还不支持 Next.js 13 的`app`目录）。考虑以下`pages`目录结构：

```txt
pages
├── index.tsx
├── settings.tsx
├── blog
│   ├── [slug].tsx
│   └── index.tsx
└── [[...catchall]].tsx
```

`FileSystemRouter`可以用于解析针对这个目录的路由：

```ts
const router = new Bun.FileSystemRouter({
  style: "nextjs",
  dir: "./pages",
  origin: "https://mydomain.com",
  assetPrefix: "_next/static/"
});
router.match("/");

// =>
{
  filePath: "/path/to/pages/index.tsx",
  kind: "exact",
  name: "/",
  pathname: "/",
  src: "https://mydomain.com/_next/static/pages/index.tsx"
}
```

查询参数将被解析并返回到`query`属性中。

```ts
router.match("/settings?foo=bar");

// =>
{
  filePath: "/Users/colinmcd94/Documents/bun/fun/pages/settings.tsx",
  kind: "dynamic",
  name: "/settings",
  pathname: "/settings?foo=bar",
  src: "https://mydomain.com/_next/static/pages/settings.tsx"
  query: {
    foo: "bar"
  }
}
```

路由器将自动解析 URL 参数并在`params`属性中返回它们：

```ts
router.match("/blog/my-cool-post");

// =>
{
  filePath: "/Users/colinmcd94/Documents/bun/fun/pages/blog/[slug].tsx",
  kind: "dynamic",
  name: "/blog/[slug]",
  pathname: "/blog/my-cool-post",
  src: "https://mydomain.com/_next/static/pages/blog/[slug].tsx"
  params: {
    slug: "my-cool-post"
  }
}
```

`.match()`方法还接受`Request`和`Response`对象。`url`属性将用于解析路由。

```ts
router.match(new Request("https://example.com/blog/my-cool-post"));
```

路由器会在初始化时读取目录内容。要重新扫描文件，请使用`.reload()`方法。

```ts
router.reload();
```

## 参考

```ts
interface Bun {
  class FileSystemRouter {
    constructor(params: {
      dir: string;
      style: "nextjs";
      origin?: string;
      assetPrefix?: string;
    });

    reload(): void;

    match(path: string | Request | Response): {
      filePath: string;
      kind: "exact" | "catch-all" | "optional-catch-all" | "dynamic";
      name: string;
      pathname: string;
      src: string;
      params?: Record<string, string>;
      query?: Record<string, string>;
    } | null
  }
}
```
