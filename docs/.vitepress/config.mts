import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Bun 中文文档",
  description: "Bun 中文文档",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Docs", link: "/what-is-bun" },
    ],

    sidebar: [
      {
        text: "Intro-介绍",
        items: [
          { text: "What is Bun", link: "/what-is-bun" },
          { text: "Installation", link: "/installation" },
          { text: "Quickstart", link: "/quickstart" },
          { text: "TypeScript", link: "/typescript" },
          { text: "Templates", link: "/templates" },
        ],
      },
      {
        text: "Runtime-运行时",
        items: [
          { text: "bun run", link: "/cli/run" },
          { text: "File types", link: "/runtime/loaders" },
          { text: "TypeScript", link: "/runtime/typescript" },
          { text: "JSX", link: "/runtime/jsx" },
          { text: "Environment variables", link: "/runtime/env" },
          { text: "Bun APIs", link: "/runtime/bun-apis" },
          { text: "Web APIs", link: "/runtime/web-api" },
          { text: "Node.js compatibility", link: "/runtime/nodejs-api" },
          { text: "Plugins", link: "/runtime/plugins" },
          { text: "Watch mode", link: "/runtime/hot" },
          { text: "Module resolution", link: "/runtime/modules" },
          { text: "Auto-install", link: "/runtime/autoimport" },
          { text: "bunfig.toml", link: "/runtime/bunfig" },
          { text: "Debugger", link: "/runtime/debugger" },
        ],
      },
      {
        text: "Package manager",
        items: [
          { text: "bun install", link: "/cli/install" },
          { text: "Global cache", link: "/install/cache" },
          { text: "Workspaces", link: "/install/workspaces" },
          { text: "Lockfile", link: "/install/lockfile" },
          { text: "Scopes and registries", link: "/install/registries" },
          { text: "Utilities", link: "/install/utilities" },
        ],
      },
      {
        text: "Bundler",
        items: [
          { text: "Bun.build", link: "/bundler/index" },
          { text: "Loaders", link: "/bundler/loaders" },
          { text: "Plugins", link: "/bundler/plugins" },
          { text: "Executables", link: "/bundler/executables" },
          { text: "Macros", link: "/bundler/macros" },
          { text: "vs esbuild", link: "/bundler/vs-esbuild" },
        ],
      },
      {
        text: "Test runner",
        items: [
          { text: "bun test", link: "/cli/test" },
          { text: "Writing tests", link: "/test/writing" },
          { text: "Watch mode", link: "/test/hot" },
          { text: "Lifecycle hooks", link: "/test/lifecycle" },
          { text: "Mocks", link: "/test/mocks" },
          { text: "Snapshots", link: "/test/snapshots" },
          { text: "Dates and times", link: "/test/time" },
          { text: "DOM testing", link: "/test/dom" },
          { text: "Code coverage", link: "/test/coverage" },
        ],
      },
      {
        text: "Package runner",
        items: [{ text: "bunx", link: "/cli/bunx" }],
      },
      {
        text: "API",
        items: [
          { text: "HTTP server", link: "/api/http" },
          { text: "WebSockets", link: "/api/websockets" },
          { text: "Workers", link: "/api/workers" },
          { text: "Binary data", link: "/api/binary-data" },
          { text: "Streams", link: "/api/streams" },
          { text: "File I/O", link: "/api/file-io" },
          { text: "import.meta", link: "/api/import-meta" },
          { text: "SQLite", link: "/api/sqlite" },
          { text: "FileSystemRouter", link: "/api/file-system-router" },
          { text: "TCP sockets", link: "/api/tcp" },
          { text: "Globals", link: "/api/globals" },
          { text: "Child processes", link: "/api/spawn" },
          { text: "Transpiler", link: "/api/transpiler" },
          { text: "Hashing", link: "/api/hashing" },
          { text: "Console", link: "/api/console" },
          { text: "FFI", link: "/api/ffi" },
          { text: "HTMLRewriter", link: "/api/html-rewriter" },
          { text: "Testing", link: "/api/test" },
          { text: "Utils", link: "/api/utils" },
          { text: "Node-API", link: "/api/node-api" },
        ],
      },
      {
        text: "Project",
        items: [
          { text: "Roadmap", link: "/project/roadmap" },
          { text: "Benchmarking", link: "/project/benchmarking" },
          { text: "Development", link: "/project/development" },
          { text: "License", link: "/project/licensing" },
        ],
      },
    ],

    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    // ]
  },
});
