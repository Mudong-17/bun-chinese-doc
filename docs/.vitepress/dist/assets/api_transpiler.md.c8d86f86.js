import{_ as e,C as t,o as c,c as r,H as o,w as p,Q as a,k as s,a as n}from"./chunks/framework.33544f09.js";const S=JSON.parse('{"title":"Transpiler","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"api/transpiler.md","filePath":"api/transpiler.md"}'),y={name:"api/transpiler.md"},E=a(`<h1 id="transpiler" tabindex="-1">Transpiler <a class="header-anchor" href="#transpiler" aria-label="Permalink to &quot;Transpiler&quot;">​</a></h1><p>Bun 通过<code>Bun.Transpiler</code>类公开其内部的转译器。要创建 Bun 的转译器实例：</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">transpiler</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> Bun.</span><span style="color:#B392F0;">Transpiler</span><span style="color:#E1E4E8;">({</span></span>
<span class="line"><span style="color:#E1E4E8;">  loader: </span><span style="color:#9ECBFF;">&quot;tsx&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#6A737D;">// &quot;js | &quot;jsx&quot; | &quot;ts&quot; | &quot;tsx&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">});</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">transpiler</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> Bun.</span><span style="color:#6F42C1;">Transpiler</span><span style="color:#24292E;">({</span></span>
<span class="line"><span style="color:#24292E;">  loader: </span><span style="color:#032F62;">&quot;tsx&quot;</span><span style="color:#24292E;">, </span><span style="color:#6A737D;">// &quot;js | &quot;jsx&quot; | &quot;ts&quot; | &quot;tsx&quot;</span></span>
<span class="line"><span style="color:#24292E;">});</span></span></code></pre></div><h2 id="transformsync" tabindex="-1"><code>.transformSync()</code> <a class="header-anchor" href="#transformsync" aria-label="Permalink to &quot;\`.transformSync()\`&quot;">​</a></h2><p>使用<code>.transformSync()</code>方法同步转译代码。模块不会被解析，代码不会被执行。结果是一串普通的 JavaScript 代码字符串。</p>`,5),i=s("div",{class:"language-js#示例 vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"js#示例"),s("pre",{class:"shiki github-dark vp-code-dark"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"const transpiler = new Bun.Transpiler({")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"  loader: 'tsx',")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"});")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}})]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"const code = `")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},'import * as whatever from "./whatever.ts"')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"export function Home(props: {title: string}){")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"  return <p>{props.title}</p>;")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"}`;")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}})]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"const result = transpiler.transformSync(code);")])])]),s("pre",{class:"shiki github-light vp-code-light"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"const transpiler = new Bun.Transpiler({")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"  loader: 'tsx',")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"});")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}})]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"const code = `")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},'import * as whatever from "./whatever.ts"')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"export function Home(props: {title: string}){")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"  return <p>{props.title}</p>;")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"}`;")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}})]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"const result = transpiler.transformSync(code);")])])])],-1),F=s("div",{class:"language-js#结果 vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"js#结果"),s("pre",{class:"shiki github-dark vp-code-dark"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},'import { __require as require } from "bun:wrap";')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},'import * as JSX from "react/jsx-dev-runtime";')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"var jsx = require(JSX).jsxDEV;")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}})]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"export default jsx(")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},'  "div",')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"  {")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},'    children: "hi!",')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"  },")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"  undefined,")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"  false,")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"  undefined,")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"  this,")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},");")])])]),s("pre",{class:"shiki github-light vp-code-light"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},'import { __require as require } from "bun:wrap";')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},'import * as JSX from "react/jsx-dev-runtime";')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"var jsx = require(JSX).jsxDEV;")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}})]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"export default jsx(")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},'  "div",')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"  {")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},'    children: "hi!",')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"  },")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"  undefined,")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"  false,")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"  undefined,")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"  this,")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},");")])])])],-1),d=a('<p>要覆盖<code>new Bun.Transpiler()</code>构造函数中指定的默认加载程序，请将第二个参数传递给<code>.transformSync()</code>。</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">await</span><span style="color:#E1E4E8;"> transpiler.</span><span style="color:#B392F0;">transform</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;&lt;div&gt;hi!&lt;/div&gt;&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&quot;tsx&quot;</span><span style="color:#E1E4E8;">);</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">await</span><span style="color:#24292E;"> transpiler.</span><span style="color:#6F42C1;">transform</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;&lt;div&gt;hi!&lt;/div&gt;&quot;</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&quot;tsx&quot;</span><span style="color:#24292E;">);</span></span></code></pre></div><details><summary>详细信息</summary> 当调用`.transformSync`时，转译器在与当前执行的代码相同的线程中运行。 <p>如果使用了宏（macro），它将在与转译器相同的线程中运行，但在应用程序的其余部分的事件循环中运行在一个单独的事件循环中。目前，宏和常规代码之间共享全局变量，这意味着可以（但不建议）在宏和常规代码之间共享状态。在宏之外尝试使用 AST 节点是未定义的行为。</p></details><h2 id="transform" tabindex="-1"><code>.transform()</code> <a class="header-anchor" href="#transform" aria-label="Permalink to &quot;`.transform()`&quot;">​</a></h2><p><code>transform()</code>方法是<code>.transformSync()</code>的异步版本，返回一个<code>Promise&lt;string&gt;</code>。</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">transpiler</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> Bun.</span><span style="color:#B392F0;">Transpiler</span><span style="color:#E1E4E8;">({ loader: </span><span style="color:#9ECBFF;">&quot;jsx&quot;</span><span style="color:#E1E4E8;"> });</span></span>\n<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">result</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">await</span><span style="color:#E1E4E8;"> transpiler.</span><span style="color:#B392F0;">transform</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;&lt;div&gt;hi!&lt;/div&gt;&quot;</span><span style="color:#E1E4E8;">);</span></span>\n<span class="line"><span style="color:#E1E4E8;">console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(result);</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">transpiler</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> Bun.</span><span style="color:#6F42C1;">Transpiler</span><span style="color:#24292E;">({ loader: </span><span style="color:#032F62;">&quot;jsx&quot;</span><span style="color:#24292E;"> });</span></span>\n<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">result</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">await</span><span style="color:#24292E;"> transpiler.</span><span style="color:#6F42C1;">transform</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;&lt;div&gt;hi!&lt;/div&gt;&quot;</span><span style="color:#24292E;">);</span></span>\n<span class="line"><span style="color:#24292E;">console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(result);</span></span></code></pre></div><p>除非您要转译<em>许多</em>大文件，否则应该使用<code>Bun.Transpiler.transformSync</code>。线程池的成本通常会比实际转译代码花费的时间更长。</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">await</span><span style="color:#E1E4E8;"> transpiler.</span><span style="color:#B392F0;">transform</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;&lt;div&gt;hi!&lt;/div&gt;&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&quot;tsx&quot;</span><span style="color:#E1E4E8;">);</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">await</span><span style="color:#24292E;"> transpiler.</span><span style="color:#6F42C1;">transform</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;&lt;div&gt;hi!&lt;/div&gt;&quot;</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&quot;tsx&quot;</span><span style="color:#24292E;">);</span></span></code></pre></div><details><summary>详细信息</summary> `.transform()`方法在Bun的工作线程池中运行转译器，因此如果运行100次，它将在`Math.floor($cpu_count * 0.8)`个线程上运行，而不会阻塞主JavaScript线程。 <p>如果您的代码使用了宏，它将在新线程中潜在地生成 Bun 的 JavaScript 运行时环境的新副本。</p></details><h2 id="scan" tabindex="-1"><code>.scan()</code> <a class="header-anchor" href="#scan" aria-label="Permalink to &quot;`.scan()`&quot;">​</a></h2><p><code>Transpiler</code>实例还可以扫描一些源代码并返回其导入和导出的列表，以及有关每个导入的其他元数据。它会忽略类型仅导入（<a href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export" target="_blank" rel="noreferrer">Type-only</a>）。</p>',11),u=s("div",{class:"language-ts vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"ts"),s("pre",{class:"shiki github-dark vp-code-dark"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{color:"#F97583"}},"const"),s("span",{style:{color:"#E1E4E8"}}," "),s("span",{style:{color:"#79B8FF"}},"transpiler"),s("span",{style:{color:"#E1E4E8"}}," "),s("span",{style:{color:"#F97583"}},"="),s("span",{style:{color:"#E1E4E8"}}," "),s("span",{style:{color:"#F97583"}},"new"),s("span",{style:{color:"#E1E4E8"}}," Bun."),s("span",{style:{color:"#B392F0"}},"Transpiler"),s("span",{style:{color:"#E1E4E8"}},"({")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#E1E4E8"}},"  loader: "),s("span",{style:{color:"#9ECBFF"}},"'tsx'"),s("span",{style:{color:"#E1E4E8"}},",")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#E1E4E8"}},"});")]),n(`
`),s("span",{class:"line"}),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F97583"}},"const"),s("span",{style:{color:"#E1E4E8"}}," "),s("span",{style:{color:"#79B8FF"}},"code"),s("span",{style:{color:"#E1E4E8"}}," "),s("span",{style:{color:"#F97583"}},"="),s("span",{style:{color:"#E1E4E8"}}," "),s("span",{style:{color:"#9ECBFF"}},"`")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#9ECBFF"}},"import React from 'react';")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#9ECBFF"}},"import type {ReactNode} from 'react';")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#9ECBFF"}},"const val = require('./cjs.js')")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#9ECBFF"}},"import('./loader');")]),n(`
`),s("span",{class:"line"}),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#9ECBFF"}},'export const name = "hello";')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#9ECBFF"}},"`"),s("span",{style:{color:"#E1E4E8"}},";")]),n(`
`),s("span",{class:"line"}),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F97583"}},"const"),s("span",{style:{color:"#E1E4E8"}}," "),s("span",{style:{color:"#79B8FF"}},"result"),s("span",{style:{color:"#E1E4E8"}}," "),s("span",{style:{color:"#F97583"}},"="),s("span",{style:{color:"#E1E4E8"}}," transpiler."),s("span",{style:{color:"#B392F0"}},"scan"),s("span",{style:{color:"#E1E4E8"}},"(code);")])])]),s("pre",{class:"shiki github-light vp-code-light"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{color:"#D73A49"}},"const"),s("span",{style:{color:"#24292E"}}," "),s("span",{style:{color:"#005CC5"}},"transpiler"),s("span",{style:{color:"#24292E"}}," "),s("span",{style:{color:"#D73A49"}},"="),s("span",{style:{color:"#24292E"}}," "),s("span",{style:{color:"#D73A49"}},"new"),s("span",{style:{color:"#24292E"}}," Bun."),s("span",{style:{color:"#6F42C1"}},"Transpiler"),s("span",{style:{color:"#24292E"}},"({")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292E"}},"  loader: "),s("span",{style:{color:"#032F62"}},"'tsx'"),s("span",{style:{color:"#24292E"}},",")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292E"}},"});")]),n(`
`),s("span",{class:"line"}),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#D73A49"}},"const"),s("span",{style:{color:"#24292E"}}," "),s("span",{style:{color:"#005CC5"}},"code"),s("span",{style:{color:"#24292E"}}," "),s("span",{style:{color:"#D73A49"}},"="),s("span",{style:{color:"#24292E"}}," "),s("span",{style:{color:"#032F62"}},"`")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#032F62"}},"import React from 'react';")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#032F62"}},"import type {ReactNode} from 'react';")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#032F62"}},"const val = require('./cjs.js')")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#032F62"}},"import('./loader');")]),n(`
`),s("span",{class:"line"}),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#032F62"}},'export const name = "hello";')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#032F62"}},"`"),s("span",{style:{color:"#24292E"}},";")]),n(`
`),s("span",{class:"line"}),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#D73A49"}},"const"),s("span",{style:{color:"#24292E"}}," "),s("span",{style:{color:"#005CC5"}},"result"),s("span",{style:{color:"#24292E"}}," "),s("span",{style:{color:"#D73A49"}},"="),s("span",{style:{color:"#24292E"}}," transpiler."),s("span",{style:{color:"#6F42C1"}},"scan"),s("span",{style:{color:"#24292E"}},"(code);")])])])],-1),m=s("div",{class:"language-json#输出 vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"json#输出"),s("pre",{class:"shiki github-dark vp-code-dark"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"{")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},'  "exports": [')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},'    "name"')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"  ],")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},'  "imports": [')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"    {")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},'      "kind": "import-statement",')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},'      "path": "react"')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"    },")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"    {")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},'      "kind": "import-statement",')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},'      "path": "remix"')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"    },")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"    {")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},'      "kind": "dynamic-import",')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},'      "path": "./loader"')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"    }")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"  ]")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"}")])])]),s("pre",{class:"shiki github-light vp-code-light"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"{")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},'  "exports": [')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},'    "name"')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"  ],")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},'  "imports": [')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"    {")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},'      "kind": "import-statement",')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},'      "path": "react"')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"    },")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"    {")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},'      "kind": "import-statement",')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},'      "path": "remix"')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"    },")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"    {")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},'      "kind": "dynamic-import",')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},'      "path": "./loader"')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"    }")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"  ]")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"}")])])])],-1),A=a('<p><code>imports</code>数组中的每个导入都有一个<code>path</code>和<code>kind</code>。Bun 将导入分类为以下种类：</p><ul><li><code>import-statement</code>：JavaScript 中的<code>import foo from &#39;bar&#39;</code></li><li><code>require-call</code>：JavaScript 中的<code>const val = require(&#39;./cjs.js&#39;)</code></li><li><code>require-resolve</code>：JavaScript 中的<code>require.resolve(&#39;./cjs.js&#39;)</code></li><li><code>dynamic-import</code>：JavaScript 中的动态<code>import()</code></li><li><code>import-rule</code>：CSS 中的<code>@import()</code></li><li><code>url-token</code>：CSS 中的<code>url()</code></li></ul><h2 id="scanimports" tabindex="-1"><code>.scanImports()</code> <a class="header-anchor" href="#scanimports" aria-label="Permalink to &quot;`.scanImports()`&quot;">​</a></h2><p>对于性能敏感的代码，可以使用<code>.scanImports()</code>方法获取导入列表。它比<code>.scan()</code>更快（尤其是对于大文件），但由于一些性能优化，精度稍微降低。</p>',4),q=s("div",{class:"language-ts vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"ts"),s("pre",{class:"shiki github-dark vp-code-dark"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{color:"#F97583"}},"const"),s("span",{style:{color:"#E1E4E8"}}," "),s("span",{style:{color:"#79B8FF"}},"transpiler"),s("span",{style:{color:"#E1E4E8"}}," "),s("span",{style:{color:"#F97583"}},"="),s("span",{style:{color:"#E1E4E8"}}," "),s("span",{style:{color:"#F97583"}},"new"),s("span",{style:{color:"#E1E4E8"}}," Bun."),s("span",{style:{color:"#B392F0"}},"Transpiler"),s("span",{style:{color:"#E1E4E8"}},"({")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#E1E4E8"}},"  loader: "),s("span",{style:{color:"#9ECBFF"}},"'tsx'"),s("span",{style:{color:"#E1E4E8"}},",")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#E1E4E8"}},"});")]),n(`
`),s("span",{class:"line"}),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F97583"}},"const"),s("span",{style:{color:"#E1E4E8"}}," "),s("span",{style:{color:"#79B8FF"}},"code"),s("span",{style:{color:"#E1E4E8"}}," "),s("span",{style:{color:"#F97583"}},"="),s("span",{style:{color:"#E1E4E8"}}," "),s("span",{style:{color:"#9ECBFF"}},"`")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#9ECBFF"}},"import React from 'react';")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#9ECBFF"}},"import type {ReactNode} from 'react';")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#9ECBFF"}},"const val = require('./cjs.js')")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#9ECBFF"}},"import('./loader');")]),n(`
`),s("span",{class:"line"}),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#9ECBFF"}},'export const name = "hello";')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#9ECBFF"}},"`"),s("span",{style:{color:"#E1E4E8"}},";")]),n(`
`),s("span",{class:"line"}),n(`
`),s("span",{class:"line"}),n(`
`),s("span",{class:"line"}),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F97583"}},"const"),s("span",{style:{color:"#E1E4E8"}}," "),s("span",{style:{color:"#79B8FF"}},"result"),s("span",{style:{color:"#E1E4E8"}}," "),s("span",{style:{color:"#F97583"}},"="),s("span",{style:{color:"#E1E4E8"}}," transpiler."),s("span",{style:{color:"#B392F0"}},"scanImports"),s("span",{style:{color:"#E1E4E8"}},"(code);")])])]),s("pre",{class:"shiki github-light vp-code-light"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{color:"#D73A49"}},"const"),s("span",{style:{color:"#24292E"}}," "),s("span",{style:{color:"#005CC5"}},"transpiler"),s("span",{style:{color:"#24292E"}}," "),s("span",{style:{color:"#D73A49"}},"="),s("span",{style:{color:"#24292E"}}," "),s("span",{style:{color:"#D73A49"}},"new"),s("span",{style:{color:"#24292E"}}," Bun."),s("span",{style:{color:"#6F42C1"}},"Transpiler"),s("span",{style:{color:"#24292E"}},"({")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292E"}},"  loader: "),s("span",{style:{color:"#032F62"}},"'tsx'"),s("span",{style:{color:"#24292E"}},",")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292E"}},"});")]),n(`
`),s("span",{class:"line"}),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#D73A49"}},"const"),s("span",{style:{color:"#24292E"}}," "),s("span",{style:{color:"#005CC5"}},"code"),s("span",{style:{color:"#24292E"}}," "),s("span",{style:{color:"#D73A49"}},"="),s("span",{style:{color:"#24292E"}}," "),s("span",{style:{color:"#032F62"}},"`")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#032F62"}},"import React from 'react';")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#032F62"}},"import type {ReactNode} from 'react';")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#032F62"}},"const val = require('./cjs.js')")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#032F62"}},"import('./loader');")]),n(`
`),s("span",{class:"line"}),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#032F62"}},'export const name = "hello";')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#032F62"}},"`"),s("span",{style:{color:"#24292E"}},";")]),n(`
`),s("span",{class:"line"}),n(`
`),s("span",{class:"line"}),n(`
`),s("span",{class:"line"}),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#D73A49"}},"const"),s("span",{style:{color:"#24292E"}}," "),s("span",{style:{color:"#005CC5"}},"result"),s("span",{style:{color:"#24292E"}}," "),s("span",{style:{color:"#D73A49"}},"="),s("span",{style:{color:"#24292E"}}," transpiler."),s("span",{style:{color:"#6F42C1"}},"scanImports"),s("span",{style:{color:"#24292E"}},"(code);")])])])],-1),C=s("div",{class:"language-json#结果 vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"json#结果"),s("pre",{class:"shiki github-dark vp-code-dark"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"[")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"  {")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},'    kind: "import-statement",')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},'    path: "react"')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"  }, {")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},'    kind: "require-call",')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},'    path: "./cjs.js"')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"  }, {")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},'    kind: "dynamic-import",')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},'    path: "./loader"')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"  }")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"]")])])]),s("pre",{class:"shiki github-light vp-code-light"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"[")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"  {")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},'    kind: "import-statement",')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},'    path: "react"')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"  }, {")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},'    kind: "require-call",')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},'    path: "./cjs.js"')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"  }, {")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},'    kind: "dynamic-import",')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},'    path: "./loader"')]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"  }")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"]")])])])],-1),h=a(`<h2 id="参考" tabindex="-1">参考 <a class="header-anchor" href="#参考" aria-label="Permalink to &quot;参考&quot;">​</a></h2><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">type</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Loader</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;jsx&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">|</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;js&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">|</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;ts&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">|</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;tsx&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">interface</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">TranspilerOptions</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 用值替换键。值必须是JSON字符串。</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// { &quot;p<wbr>rocess.env.NODE_ENV&quot;: &quot;\\&quot;production\\&quot;&quot; }</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#FFAB70;">define</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Record</span><span style="color:#E1E4E8;">&lt;</span><span style="color:#79B8FF;">string</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">string</span><span style="color:#E1E4E8;">&gt;,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 此转译器的默认加载程序</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#FFAB70;">loader</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Loader</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 默认的目标平台</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 这会影响导入和/或require的使用方式</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#FFAB70;">target</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;browser&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">|</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;bun&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">|</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;node&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 指定一个tsconfig.json文件，作为字符串化的JSON或对象</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 使用它来设置自定义的JSX工厂、片段或导入源</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 例如，如果您想使用Preact而不是React。或者如果您想使用Emotion。</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#FFAB70;">tsconfig</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">string</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">|</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">TSConfig</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 将导入替换为宏</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#FFAB70;">macro</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">MacroMap</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 指定要消除的一组导出</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 或重命名某些导出</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#FFAB70;">exports</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#FFAB70;">eliminate</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">string</span><span style="color:#E1E4E8;">[];</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#FFAB70;">replace</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Record</span><span style="color:#E1E4E8;">&lt;</span><span style="color:#79B8FF;">string</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">string</span><span style="color:#E1E4E8;">&gt;;</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 是否从转译后的文件中删除未使用的导入</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 默认：false</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#FFAB70;">trimUnusedImports</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">boolean</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 是否启用一组JSX优化</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// jsxOptimizationInline ...,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 实验性的空格最小化</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#FFAB70;">minifyWhitespace</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">boolean</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 是否内联常量值</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 通常可以提高性能并减小包大小</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 默认：true</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#FFAB70;">inline</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">boolean</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 将导入路径映射到宏</span></span>
<span class="line"><span style="color:#F97583;">interface</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">MacroMap</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">//   &quot;react-relay&quot;: {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">//     &quot;graphql&quot;: &quot;bun-macro-relay/bun-macro-relay.tsx&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">//   }</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// }</span></span>
<span class="line"><span style="color:#E1E4E8;">  [</span><span style="color:#FFAB70;">packagePath</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">string</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    [</span><span style="color:#FFAB70;">importItemName</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">string</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">class</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Bun</span><span style="color:#E1E4E8;">.</span><span style="color:#B392F0;">Transpiler</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">constructor</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">options</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">TranspilerOptions</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">transform</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">code</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">string</span><span style="color:#E1E4E8;">, </span><span style="color:#FFAB70;">loader</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Loader</span><span style="color:#E1E4E8;">)</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Promise</span><span style="color:#E1E4E8;">&lt;</span><span style="color:#79B8FF;">string</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">transformSync</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">code</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">string</span><span style="color:#E1E4E8;">, </span><span style="color:#FFAB70;">loader</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Loader</span><span style="color:#E1E4E8;">)</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">string</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">scan</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">code</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">string</span><span style="color:#E1E4E8;">)</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> {</span><span style="color:#FFAB70;">exports</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">string</span><span style="color:#E1E4E8;">[], </span><span style="color:#FFAB70;">imports</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Import</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">scanImports</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">code</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">string</span><span style="color:#E1E4E8;">)</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Import</span><span style="color:#E1E4E8;">[]</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">type</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Import</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#FFAB70;">path</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#FFAB70;">kind</span><span style="color:#F97583;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// JavaScript中的import foo from &#39;bar&#39;;</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">|</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;import-statement&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// JavaScript中的require(&quot;foo&quot;)</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">|</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;require-call&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// JavaScript中的require.resolve(&quot;foo&quot;)</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">|</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;require-resolve&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// JavaScript中的动态import()</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">|</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;dynamic-import&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// CSS中的@import()</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">|</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;import-rule&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// CSS中的url()</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">|</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;url-token&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// Bun注入的导入</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">|</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;internal&quot;</span><span style="color:#E1E4E8;"> </span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 入口点（不常见）</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">|</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;entry-point&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">transpiler</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> Bun.</span><span style="color:#B392F0;">Transpiler</span><span style="color:#E1E4E8;">({ loader: </span><span style="color:#9ECBFF;">&quot;jsx&quot;</span><span style="color:#E1E4E8;"> });</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">type</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Loader</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;jsx&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;js&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;ts&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;tsx&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">interface</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">TranspilerOptions</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 用值替换键。值必须是JSON字符串。</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// { &quot;p<wbr>rocess.env.NODE_ENV&quot;: &quot;\\&quot;production\\&quot;&quot; }</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">define</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Record</span><span style="color:#24292E;">&lt;</span><span style="color:#005CC5;">string</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">string</span><span style="color:#24292E;">&gt;,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 此转译器的默认加载程序</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">loader</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Loader</span><span style="color:#24292E;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 默认的目标平台</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 这会影响导入和/或require的使用方式</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">target</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;browser&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;bun&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;node&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 指定一个tsconfig.json文件，作为字符串化的JSON或对象</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 使用它来设置自定义的JSX工厂、片段或导入源</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 例如，如果您想使用Preact而不是React。或者如果您想使用Emotion。</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">tsconfig</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">string</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">TSConfig</span><span style="color:#24292E;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 将导入替换为宏</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">macro</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MacroMap</span><span style="color:#24292E;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 指定要消除的一组导出</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 或重命名某些导出</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">exports</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#E36209;">eliminate</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">string</span><span style="color:#24292E;">[];</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#E36209;">replace</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Record</span><span style="color:#24292E;">&lt;</span><span style="color:#005CC5;">string</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">string</span><span style="color:#24292E;">&gt;;</span></span>
<span class="line"><span style="color:#24292E;">  },</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 是否从转译后的文件中删除未使用的导入</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 默认：false</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">trimUnusedImports</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">boolean</span><span style="color:#24292E;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 是否启用一组JSX优化</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// jsxOptimizationInline ...,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 实验性的空格最小化</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">minifyWhitespace</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">boolean</span><span style="color:#24292E;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 是否内联常量值</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 通常可以提高性能并减小包大小</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 默认：true</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">inline</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">boolean</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 将导入路径映射到宏</span></span>
<span class="line"><span style="color:#D73A49;">interface</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MacroMap</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">//   &quot;react-relay&quot;: {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">//     &quot;graphql&quot;: &quot;bun-macro-relay/bun-macro-relay.tsx&quot;</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">//   }</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// }</span></span>
<span class="line"><span style="color:#24292E;">  [</span><span style="color:#E36209;">packagePath</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">string</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    [</span><span style="color:#E36209;">importItemName</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">string</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  },</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Bun</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">Transpiler</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">constructor</span><span style="color:#24292E;">(</span><span style="color:#E36209;">options</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">TranspilerOptions</span><span style="color:#24292E;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">transform</span><span style="color:#24292E;">(</span><span style="color:#E36209;">code</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">string</span><span style="color:#24292E;">, </span><span style="color:#E36209;">loader</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Loader</span><span style="color:#24292E;">)</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Promise</span><span style="color:#24292E;">&lt;</span><span style="color:#005CC5;">string</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">transformSync</span><span style="color:#24292E;">(</span><span style="color:#E36209;">code</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">string</span><span style="color:#24292E;">, </span><span style="color:#E36209;">loader</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Loader</span><span style="color:#24292E;">)</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">string</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">scan</span><span style="color:#24292E;">(</span><span style="color:#E36209;">code</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">string</span><span style="color:#24292E;">)</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> {</span><span style="color:#E36209;">exports</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">string</span><span style="color:#24292E;">[], </span><span style="color:#E36209;">imports</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Import</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">scanImports</span><span style="color:#24292E;">(</span><span style="color:#E36209;">code</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">string</span><span style="color:#24292E;">)</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Import</span><span style="color:#24292E;">[]</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">type</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Import</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">path</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">kind</span><span style="color:#D73A49;">:</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// JavaScript中的import foo from &#39;bar&#39;;</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;import-statement&quot;</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// JavaScript中的require(&quot;foo&quot;)</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;require-call&quot;</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// JavaScript中的require.resolve(&quot;foo&quot;)</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;require-resolve&quot;</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// JavaScript中的动态import()</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;dynamic-import&quot;</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// CSS中的@import()</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;import-rule&quot;</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// CSS中的url()</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;url-token&quot;</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// Bun注入的导入</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;internal&quot;</span><span style="color:#24292E;"> </span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 入口点（不常见）</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;entry-point&quot;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">transpiler</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> Bun.</span><span style="color:#6F42C1;">Transpiler</span><span style="color:#24292E;">({ loader: </span><span style="color:#032F62;">&quot;jsx&quot;</span><span style="color:#24292E;"> });</span></span></code></pre></div>`,2);function D(B,g,v,f,_,b){const l=t("codetabs");return c(),r("div",null,[E,o(l,null,{default:p(()=>[i,F]),_:1}),d,o(l,null,{default:p(()=>[u,m]),_:1}),A,o(l,null,{default:p(()=>[q,C]),_:1}),h])}const x=e(y,[["render",D]]);export{S as __pageData,x as default};
