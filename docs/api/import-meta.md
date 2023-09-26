`import.meta` 对象是一个模块用来访问有关自身信息的方式。它是 JavaScript 语言的一部分，但它的内容并没有标准化。每个 "主机"（浏览器、运行时等）都可以在 `import.meta` 对象上实现任何属性。

Bun 实现了以下属性：

- `import.meta.dir`：该属性提供了包含当前文件的目录的绝对路径，例如可能返回 "/path/to/project"。与 CommonJS 模块（和 Node.js）中的 `__dirname` 等效。

- `import.meta.file`：该属性返回当前文件的名称，例如可能返回 "file.ts"。

- `import.meta.path`：该属性提供了当前文件的绝对路径，例如可能返回 "/path/to/project/file.ts"。与 CommonJS 模块（和 Node.js）中的 `__filename` 等效。

- `import.meta.main`：这是一个布尔值属性，指示当前文件是否是当前 `bun` 进程的入口点。如果文件是直接由 `bun run` 执行的，则为 `true`，否则为 `false`。

- `import.meta.resolve{Sync}`：这些方法用于将模块导入符号（例如 `"zod"` 或 `"./file.tsx"`）解析为绝对路径。它们确定了如果导入这些符号是否将导入哪个文件。

  ```ts
  import.meta.resolveSync("zod");
  // => "/path/to/project/node_modules/zod/index.ts"

  import.meta.resolveSync("./file.tsx");
  // => "/path/to/project/file.tsx"
  ```

这些属性和方法使您能够方便地获取当前模块的信息和解析导入符号的路径。
