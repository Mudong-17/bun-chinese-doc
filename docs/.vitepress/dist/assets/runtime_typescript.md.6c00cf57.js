import{_ as o,C as l,o as p,c as e,H as t,w as c,Q as r,k as s,a as n}from"./chunks/framework.33544f09.js";const B=JSON.parse('{"title":"TypeScript","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"runtime/typescript.md","filePath":"runtime/typescript.md"}'),y={name:"runtime/typescript.md"},E=r(`<h1 id="typescript" tabindex="-1">TypeScript <a class="header-anchor" href="#typescript" aria-label="Permalink to &quot;TypeScript&quot;">​</a></h1><p>Bun 将 TypeScript 视为一等公民。</p><h2 id="运行-ts-文件" tabindex="-1">运行 <code>.ts</code> 文件 <a class="header-anchor" href="#运行-ts-文件" aria-label="Permalink to &quot;运行 \`.ts\` 文件&quot;">​</a></h2><p>Bun 可以直接执行 <code>.ts</code> 和 <code>.tsx</code> 文件，就像执行普通 JavaScript 一样，无需额外配置。如果您导入 <code>.ts</code> 或 <code>.tsx</code> 文件（或导出这些文件的 <code>npm</code> 模块），Bun 会在内部将其转译为 JavaScript 然后执行文件。</p><p><strong>注意</strong> — 与其他构建工具类似，Bun 不会对文件进行类型检查。如果要捕获静态类型错误，可以使用<a href="https://www.typescriptlang.org/docs/handbook/compiler-options.html" target="_blank" rel="noreferrer"><code>tsc</code></a>（官方 TypeScript CLI）。</p><blockquote><p><strong>是否仍然需要转译？</strong> — 由于 Bun 可以直接执行 TypeScript，您可能不需要将 TypeScript 转译以在生产环境中运行。Bun 会在执行的每个文件（包括 <code>.js</code> 和 <code>.ts</code>）时进行内部转译，因此直接执行 <code>.ts/.tsx</code> 源文件的额外开销可以忽略不计。</p><p>但是，如果您将 Bun 用作开发工具，但在生产环境中仍以 Node.js 或浏览器为目标，那么您仍然需要进行转译。</p></blockquote><h2 id="配置-tsconfig-json" tabindex="-1">配置 <code>tsconfig.json</code> <a class="header-anchor" href="#配置-tsconfig-json" aria-label="Permalink to &quot;配置 \`tsconfig.json\`&quot;">​</a></h2><p>Bun 支持一些 TypeScript 默认不支持的功能，例如扩展导入、顶级等待和 <code>exports</code> 条件。它还实现了全局 API，如 <code>Bun</code>。要启用这些功能，必须正确配置您的 <code>tsconfig.json</code>。</p><blockquote><p>如果您使用 <code>bun init</code> 初始化项目，则一切都已正确配置。</p></blockquote><p>要开始，请安装 <code>bun-types</code> 包。</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">$</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">bun</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">add</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-d</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">bun-types</span><span style="color:#E1E4E8;"> </span><span style="color:#6A737D;"># dev 依赖</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">$</span><span style="color:#24292E;"> </span><span style="color:#032F62;">bun</span><span style="color:#24292E;"> </span><span style="color:#032F62;">add</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-d</span><span style="color:#24292E;"> </span><span style="color:#032F62;">bun-types</span><span style="color:#24292E;"> </span><span style="color:#6A737D;"># dev 依赖</span></span></code></pre></div><p>如果您使用的是 Bun 的 canary 版本，请使用 <code>canary</code> 标签。canary 包会在 <code>main</code> 分支的每次提交时更新。</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">$</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">bun</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">add</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-d</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">bun-types@canary</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">$</span><span style="color:#24292E;"> </span><span style="color:#032F62;">bun</span><span style="color:#24292E;"> </span><span style="color:#032F62;">add</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-d</span><span style="color:#24292E;"> </span><span style="color:#032F62;">bun-types@canary</span></span></code></pre></div><h3 id="推荐的-compileroptions" tabindex="-1">推荐的 <code>compilerOptions</code> <a class="header-anchor" href="#推荐的-compileroptions" aria-label="Permalink to &quot;推荐的 \`compilerOptions\`&quot;">​</a></h3><p>以下是 Bun 项目的推荐 <code>compilerOptions</code>。</p><div class="language-jsonc vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">jsonc</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">&quot;compilerOptions&quot;</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 添加Bun类型定义</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;types&quot;</span><span style="color:#E1E4E8;">: [</span><span style="color:#9ECBFF;">&quot;bun-types&quot;</span><span style="color:#E1E4E8;">],</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 启用最新功能</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;lib&quot;</span><span style="color:#E1E4E8;">: [</span><span style="color:#9ECBFF;">&quot;esnext&quot;</span><span style="color:#E1E4E8;">],</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;module&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;esnext&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;target&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;esnext&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 如果使用TS 5.x+</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;moduleResolution&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;bundler&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;noEmit&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;allowImportingTsExtensions&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;moduleDetection&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;force&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 如果使用TS 4.x或更早版本</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;moduleResolution&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;nodenext&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;jsx&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;react-jsx&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#6A737D;">// 支持JSX</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;allowJs&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">, </span><span style="color:#6A737D;">// 允许从 \`.ts\` 导入 \`.js\`</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;esModuleInterop&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">, </span><span style="color:#6A737D;">// 允许CommonJS模块的默认导入</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 最佳实践</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;strict&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;forceConsistentCasingInFileNames&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;skipLibCheck&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">true</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">&quot;compilerOptions&quot;</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 添加Bun类型定义</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;types&quot;</span><span style="color:#24292E;">: [</span><span style="color:#032F62;">&quot;bun-types&quot;</span><span style="color:#24292E;">],</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 启用最新功能</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;lib&quot;</span><span style="color:#24292E;">: [</span><span style="color:#032F62;">&quot;esnext&quot;</span><span style="color:#24292E;">],</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;module&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;esnext&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;target&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;esnext&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 如果使用TS 5.x+</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;moduleResolution&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;bundler&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;noEmit&quot;</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;allowImportingTsExtensions&quot;</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;moduleDetection&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;force&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 如果使用TS 4.x或更早版本</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;moduleResolution&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;nodenext&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;jsx&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;react-jsx&quot;</span><span style="color:#24292E;">, </span><span style="color:#6A737D;">// 支持JSX</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;allowJs&quot;</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">, </span><span style="color:#6A737D;">// 允许从 \`.ts\` 导入 \`.js\`</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;esModuleInterop&quot;</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">, </span><span style="color:#6A737D;">// 允许CommonJS模块的默认导入</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 最佳实践</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;strict&quot;</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;forceConsistentCasingInFileNames&quot;</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;skipLibCheck&quot;</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">true</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="添加-dom-类型" tabindex="-1">添加 DOM 类型 <a class="header-anchor" href="#添加-dom-类型" aria-label="Permalink to &quot;添加 DOM 类型&quot;">​</a></h3><p>设置 <code>&quot;types&quot;: [&quot;bun-types&quot;]</code> 意味着 TypeScript 将忽略其他全局类型定义，包括 <code>lib: [&quot;dom&quot;]</code>。要将 DOM 类型添加到您的项目中，请在项目中的任何 TypeScript 文件的顶部添加以下<a href="https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html" target="_blank" rel="noreferrer">三斜杠指令</a>。</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">/// &lt;</span><span style="color:#85E89D;">reference</span><span style="color:#6A737D;"> </span><span style="color:#B392F0;">lib</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;dom&quot;</span><span style="color:#6A737D;"> /&gt;</span></span>
<span class="line"><span style="color:#6A737D;">/// &lt;</span><span style="color:#85E89D;">reference</span><span style="color:#6A737D;"> </span><span style="color:#B392F0;">lib</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;dom.iterable&quot;</span><span style="color:#6A737D;"> /&gt;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">/// &lt;</span><span style="color:#22863A;">reference</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">lib</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;dom&quot;</span><span style="color:#6A737D;"> /&gt;</span></span>
<span class="line"><span style="color:#6A737D;">/// &lt;</span><span style="color:#22863A;">reference</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">lib</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;dom.iterable&quot;</span><span style="color:#6A737D;"> /&gt;</span></span></code></pre></div><p>对于其他全局类型定义，如 <code>webworker</code>，也适用相同的规则。</p><h2 id="路径映射" tabindex="-1">路径映射 <a class="header-anchor" href="#路径映射" aria-label="Permalink to &quot;路径映射&quot;">​</a></h2><p>在解析模块时</p><p>，Bun 的运行时会尊重 <code>tsconfig.json</code> 中定义的 <a href="https://www.typescriptlang.org/tsconfig#paths" target="_blank" rel="noreferrer"><code>compilerOptions.paths</code></a>。没有其他运行时会这样做。</p><p>假设以下 <code>tsconfig.json</code>...</p><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">&quot;compilerOptions&quot;</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;paths&quot;</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#79B8FF;">&quot;data&quot;</span><span style="color:#E1E4E8;">: [</span><span style="color:#9ECBFF;">&quot;./data.ts&quot;</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">&quot;compilerOptions&quot;</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;paths&quot;</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#005CC5;">&quot;data&quot;</span><span style="color:#24292E;">: [</span><span style="color:#032F62;">&quot;./data.ts&quot;</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>...从 <code>&quot;data&quot;</code> 导入将按预期工作。</p>`,26),i=s("div",{class:"language-ts vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"ts"),s("pre",{class:"shiki github-dark vp-code-dark"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{color:"#E1E4E8"}},"#index.ts")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F97583"}},"import"),s("span",{style:{color:"#E1E4E8"}}," { foo } "),s("span",{style:{color:"#F97583"}},"from"),s("span",{style:{color:"#E1E4E8"}}," "),s("span",{style:{color:"#9ECBFF"}},'"data"'),s("span",{style:{color:"#E1E4E8"}},";")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#E1E4E8"}},"console."),s("span",{style:{color:"#B392F0"}},"log"),s("span",{style:{color:"#E1E4E8"}},"(foo); "),s("span",{style:{color:"#6A737D"}},'// => "Hello world!"')])])]),s("pre",{class:"shiki github-light vp-code-light"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{color:"#24292E"}},"#index.ts")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#D73A49"}},"import"),s("span",{style:{color:"#24292E"}}," { foo } "),s("span",{style:{color:"#D73A49"}},"from"),s("span",{style:{color:"#24292E"}}," "),s("span",{style:{color:"#032F62"}},'"data"'),s("span",{style:{color:"#24292E"}},";")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292E"}},"console."),s("span",{style:{color:"#6F42C1"}},"log"),s("span",{style:{color:"#24292E"}},"(foo); "),s("span",{style:{color:"#6A737D"}},'// => "Hello world!"')])])])],-1),u=s("div",{class:"language-ts vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"ts"),s("pre",{class:"shiki github-dark vp-code-dark"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{color:"#E1E4E8"}},"#data.ts")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F97583"}},"export"),s("span",{style:{color:"#E1E4E8"}}," "),s("span",{style:{color:"#F97583"}},"const"),s("span",{style:{color:"#E1E4E8"}}," "),s("span",{style:{color:"#79B8FF"}},"foo"),s("span",{style:{color:"#E1E4E8"}}," "),s("span",{style:{color:"#F97583"}},"="),s("span",{style:{color:"#E1E4E8"}}," "),s("span",{style:{color:"#9ECBFF"}},'"Hello world!"')])])]),s("pre",{class:"shiki github-light vp-code-light"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{color:"#24292E"}},"#data.ts")]),n(`
`),s("span",{class:"line"},[s("span",{style:{color:"#D73A49"}},"export"),s("span",{style:{color:"#24292E"}}," "),s("span",{style:{color:"#D73A49"}},"const"),s("span",{style:{color:"#24292E"}}," "),s("span",{style:{color:"#005CC5"}},"foo"),s("span",{style:{color:"#24292E"}}," "),s("span",{style:{color:"#D73A49"}},"="),s("span",{style:{color:"#24292E"}}," "),s("span",{style:{color:"#032F62"}},'"Hello world!"')])])])],-1);function d(q,F,C,h,g,b){const a=l("codetabs");return p(),e("div",null,[E,t(a,null,{default:c(()=>[i,u]),_:1})])}const k=o(y,[["render",d]]);export{B as __pageData,k as default};