import{_ as s,o as n,c as a,Q as l}from"./chunks/framework.33544f09.js";const q=JSON.parse('{"title":"Configuration","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"runtime/configuration.md","filePath":"runtime/configuration.md"}'),p={name:"runtime/configuration.md"},o=l(`<h1 id="configuration" tabindex="-1">Configuration <a class="header-anchor" href="#configuration" aria-label="Permalink to &quot;Configuration&quot;">​</a></h1><p>Bun 可以通过两种主要机制进行配置：</p><ul><li>环境变量</li><li><code>bunfig.toml</code>：Bun 的配置文件</li></ul><p>使用<code>bunfig.toml</code>进行配置是可选的。Bun 旨在开箱即用，不需要任何配置，但也支持高级用例的高度配置。您的<code>bunfig.toml</code>应该位于项目根目录，与<code>package.json</code>放在一起。</p><p>您还可以在以下路径创建全局配置文件：</p><ul><li><code>$HOME/.bunfig.toml</code></li><li><code>$XDG_CONFIG_HOME/.bunfig.toml</code></li></ul><p>如果检测到全局和本地的<code>bunfig</code>，则结果将进行浅层合并，以本地配置为准。在适用的情况下，CLI 标志将覆盖<code>bunfig</code>设置。</p><h2 id="bunfig-toml" tabindex="-1"><code>bunfig.toml</code> <a class="header-anchor" href="#bunfig-toml" aria-label="Permalink to &quot;\`bunfig.toml\`&quot;">​</a></h2><h3 id="运行时" tabindex="-1">运行时 <a class="header-anchor" href="#运行时" aria-label="Permalink to &quot;运行时&quot;">​</a></h3><div class="language-toml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">toml</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;"># 在\`bun run\`之前运行的脚本或脚本</span></span>
<span class="line"><span style="color:#6A737D;"># 用于注册插件</span></span>
<span class="line"><span style="color:#E1E4E8;">preload = [</span><span style="color:#9ECBFF;">&quot;./preload.ts&quot;</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 相当于相应的tsconfig compilerOptions</span></span>
<span class="line"><span style="color:#E1E4E8;">jsx = </span><span style="color:#9ECBFF;">&quot;react&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">jsxFactory = </span><span style="color:#9ECBFF;">&quot;h&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">jsxFragment = </span><span style="color:#9ECBFF;">&quot;Fragment&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">jsxImportSource = </span><span style="color:#9ECBFF;">&quot;react&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 以降低性能为代价减少内存使用</span></span>
<span class="line"><span style="color:#E1E4E8;">smol = </span><span style="color:#79B8FF;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 设置Bun的日志级别</span></span>
<span class="line"><span style="color:#E1E4E8;">logLevel = </span><span style="color:#9ECBFF;">&quot;debug&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#6A737D;"># &quot;debug&quot;, &quot;warn&quot;, &quot;error&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">[</span><span style="color:#B392F0;">define</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"><span style="color:#6A737D;"># 将任何使用&quot;p<wbr>rocess.env.bagel&quot;的地方替换为字符串\`lox\`。</span></span>
<span class="line"><span style="color:#6A737D;"># 值被解析为JSON，除非支持单引号字符串，且\`&#39;undefined&#39;\`在JS中变为\`undefined\`。</span></span>
<span class="line"><span style="color:#6A737D;"># 这可能会在将来的版本中更改为普通的TOML。这是从CLI参数解析的遗留物。</span></span>
<span class="line"><span style="color:#E1E4E8;">&quot;p<wbr>rocess.env.bagel&quot; = </span><span style="color:#9ECBFF;">&quot;&#39;lox&#39;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">[</span><span style="color:#B392F0;">loader</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"><span style="color:#6A737D;"># 在加载.bagel文件时运行JS解析器</span></span>
<span class="line"><span style="color:#E1E4E8;">&quot;.bagel&quot; = </span><span style="color:#9ECBFF;">&quot;js&quot;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;"># 在\`bun run\`之前运行的脚本或脚本</span></span>
<span class="line"><span style="color:#6A737D;"># 用于注册插件</span></span>
<span class="line"><span style="color:#24292E;">preload = [</span><span style="color:#032F62;">&quot;./preload.ts&quot;</span><span style="color:#24292E;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 相当于相应的tsconfig compilerOptions</span></span>
<span class="line"><span style="color:#24292E;">jsx = </span><span style="color:#032F62;">&quot;react&quot;</span></span>
<span class="line"><span style="color:#24292E;">jsxFactory = </span><span style="color:#032F62;">&quot;h&quot;</span></span>
<span class="line"><span style="color:#24292E;">jsxFragment = </span><span style="color:#032F62;">&quot;Fragment&quot;</span></span>
<span class="line"><span style="color:#24292E;">jsxImportSource = </span><span style="color:#032F62;">&quot;react&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 以降低性能为代价减少内存使用</span></span>
<span class="line"><span style="color:#24292E;">smol = </span><span style="color:#005CC5;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 设置Bun的日志级别</span></span>
<span class="line"><span style="color:#24292E;">logLevel = </span><span style="color:#032F62;">&quot;debug&quot;</span><span style="color:#24292E;"> </span><span style="color:#6A737D;"># &quot;debug&quot;, &quot;warn&quot;, &quot;error&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">[</span><span style="color:#6F42C1;">define</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#6A737D;"># 将任何使用&quot;p<wbr>rocess.env.bagel&quot;的地方替换为字符串\`lox\`。</span></span>
<span class="line"><span style="color:#6A737D;"># 值被解析为JSON，除非支持单引号字符串，且\`&#39;undefined&#39;\`在JS中变为\`undefined\`。</span></span>
<span class="line"><span style="color:#6A737D;"># 这可能会在将来的版本中更改为普通的TOML。这是从CLI参数解析的遗留物。</span></span>
<span class="line"><span style="color:#24292E;">&quot;p<wbr>rocess.env.bagel&quot; = </span><span style="color:#032F62;">&quot;&#39;lox&#39;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">[</span><span style="color:#6F42C1;">loader</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#6A737D;"># 在加载.bagel文件时运行JS解析器</span></span>
<span class="line"><span style="color:#24292E;">&quot;.bagel&quot; = </span><span style="color:#032F62;">&quot;js&quot;</span></span></code></pre></div><h3 id="测试运行器" tabindex="-1">测试运行器 <a class="header-anchor" href="#测试运行器" aria-label="Permalink to &quot;测试运行器&quot;">​</a></h3><div class="language-toml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">toml</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">[</span><span style="color:#B392F0;">test</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"><span style="color:#6A737D;"># 在所有测试文件之前运行的脚本</span></span>
<span class="line"><span style="color:#E1E4E8;">preload = [</span><span style="color:#9ECBFF;">&quot;./setup.ts&quot;</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 以降低性能为代价减少内存使用</span></span>
<span class="line"><span style="color:#E1E4E8;">smol = </span><span style="color:#79B8FF;">true</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">[</span><span style="color:#6F42C1;">test</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#6A737D;"># 在所有测试文件之前运行的脚本</span></span>
<span class="line"><span style="color:#24292E;">preload = [</span><span style="color:#032F62;">&quot;./setup.ts&quot;</span><span style="color:#24292E;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 以降低性能为代价减少内存使用</span></span>
<span class="line"><span style="color:#24292E;">smol = </span><span style="color:#005CC5;">true</span></span></code></pre></div><h3 id="包管理器" tabindex="-1">包管理器 <a class="header-anchor" href="#包管理器" aria-label="Permalink to &quot;包管理器&quot;">​</a></h3><p>包管理是一个复杂的问题；为了支持各种用例，可以在<a href="/runtime/configuration.html"><code>bunfig.toml</code></a>中配置<code>bun install</code>的行为。</p><h3 id="默认标志" tabindex="-1">默认标志 <a class="header-anchor" href="#默认标志" aria-label="Permalink to &quot;默认标志&quot;">​</a></h3><p>以下设置修改了 Bun 的包管理命令的核心行为。<strong>默认值如下所示。</strong></p><div class="language-toml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">toml</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">[</span><span style="color:#B392F0;">install</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 是否安装optionalDependencies</span></span>
<span class="line"><span style="color:#E1E4E8;">optional = </span><span style="color:#79B8FF;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 是否安装devDependencies</span></span>
<span class="line"><span style="color:#E1E4E8;">dev = </span><span style="color:#79B8FF;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 是否安装peerDependencies</span></span>
<span class="line"><span style="color:#E1E4E8;">peer = </span><span style="color:#79B8FF;">false</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 相当于\`--production\`标志</span></span>
<span class="line"><span style="color:#E1E4E8;">production = </span><span style="color:#79B8FF;">false</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 相当于\`--frozen-lockfile\`标志</span></span>
<span class="line"><span style="color:#E1E4E8;">frozenLockfile = </span><span style="color:#79B8FF;">false</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 相当于\`--dry-run\`标志</span></span>
<span class="line"><span style="color:#E1E4E8;">dryRun = </span><span style="color:#79B8FF;">false</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">[</span><span style="color:#6F42C1;">install</span><span style="color:#24292E;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 是否安装optionalDependencies</span></span>
<span class="line"><span style="color:#24292E;">optional = </span><span style="color:#005CC5;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 是否安装devDependencies</span></span>
<span class="line"><span style="color:#24292E;">dev = </span><span style="color:#005CC5;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 是否安装peerDependencies</span></span>
<span class="line"><span style="color:#24292E;">peer = </span><span style="color:#005CC5;">false</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 相当于\`--production\`标志</span></span>
<span class="line"><span style="color:#24292E;">production = </span><span style="color:#005CC5;">false</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 相当于\`--frozen-lockfile\`标志</span></span>
<span class="line"><span style="color:#24292E;">frozenLockfile = </span><span style="color:#005CC5;">false</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 相当于\`--dry-run\`标志</span></span>
<span class="line"><span style="color:#24292E;">dryRun = </span><span style="color:#005CC5;">false</span></span></code></pre></div><h3 id="私有范围和注册表" tabindex="-1">私有范围和注册表 <a class="header-anchor" href="#私有范围和注册表" aria-label="Permalink to &quot;私有范围和注册表&quot;">​</a></h3><p>默认注册表是<code>https://registry.npmjs.org/</code>。这可以在<code>bunfig.toml</code>中进行全局配置：</p><div class="language-toml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">toml</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">[</span><span style="color:#B392F0;">install</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"><span style="color:#6A737D;"># 将默认注册表设置为字符串</span></span>
<span class="line"><span style="color:#E1E4E8;">registry = </span><span style="color:#9ECBFF;">&quot;https://registry.npmjs.org&quot;</span></span>
<span class="line"><span style="color:#6A737D;"># 设置令牌</span></span>
<span class="line"><span style="color:#E1E4E8;">registry = { url = </span><span style="color:#9ECBFF;">&quot;https://registry.npmjs.org&quot;</span><span style="color:#E1E4E8;">, token = </span><span style="color:#9ECBFF;">&quot;123456&quot;</span><span style="color:#E1E4E8;"> }</span></span>
<span class="line"><span style="color:#6A737D;"># 设置用户名/密码</span></span>
<span class="line"><span style="color:#E1E4E8;">registry = </span><span style="color:#9ECBFF;">&quot;https://username:password@registry.npmjs.org&quot;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">[</span><span style="color:#6F42C1;">install</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#6A737D;"># 将默认注册表设置为字符串</span></span>
<span class="line"><span style="color:#24292E;">registry = </span><span style="color:#032F62;">&quot;https://registry.npmjs.org&quot;</span></span>
<span class="line"><span style="color:#6A737D;"># 设置令牌</span></span>
<span class="line"><span style="color:#24292E;">registry = { url = </span><span style="color:#032F62;">&quot;https://registry.npmjs.org&quot;</span><span style="color:#24292E;">, token = </span><span style="color:#032F62;">&quot;123456&quot;</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#6A737D;"># 设置用户名/密码</span></span>
<span class="line"><span style="color:#24292E;">registry = </span><span style="color:#032F62;">&quot;https://username:password@registry.npmjs.org&quot;</span></span></code></pre></div><p>要配置作用域注册表：</p><div class="language-toml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">toml</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">[</span><span style="color:#B392F0;">install</span><span style="color:#E1E4E8;">.</span><span style="color:#B392F0;">scopes</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"><span style="color:#6A737D;"># 作为字符串的注册表</span></span>
<span class="line"><span style="color:#E1E4E8;">myorg1 = </span><span style="color:#9ECBFF;">&quot;https://username:password@registry.myorg.com/&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 带有用户名/密码的注册表</span></span>
<span class="line"><span style="color:#6A737D;"># 您可以引用环境变量</span></span>
<span class="line"><span style="color:#E1E4E8;">myorg12 = { username = </span><span style="color:#9ECBFF;">&quot;myusername&quot;</span><span style="color:#E1E4E8;">, password = </span><span style="color:#9ECBFF;">&quot;$NPM_PASS&quot;</span><span style="color:#E1E4E8;">, url = </span><span style="color:#9ECBFF;">&quot;https://registry.myorg.com/&quot;</span><span style="color:#E1E4E8;"> }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 带有令牌的注册表</span></span>
<span class="line"><span style="color:#E1E4E8;">myorg3 = { token = </span><span style="color:#9ECBFF;">&quot;$npm_token&quot;</span><span style="color:#E1E4E8;">, url = </span><span style="color:#9ECBFF;">&quot;https://registry.myorg.com/&quot;</span><span style="color:#E1E4E8;"> }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">[</span><span style="color:#6F42C1;">install</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">scopes</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#6A737D;"># 作为字符串的注册表</span></span>
<span class="line"><span style="color:#24292E;">myorg1 = </span><span style="color:#032F62;">&quot;https://username:password@registry.myorg.com/&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 带有用户名/密码的注册表</span></span>
<span class="line"><span style="color:#6A737D;"># 您可以引用环境变量</span></span>
<span class="line"><span style="color:#24292E;">myorg12 = { username = </span><span style="color:#032F62;">&quot;myusername&quot;</span><span style="color:#24292E;">, password = </span><span style="color:#032F62;">&quot;$NPM_PASS&quot;</span><span style="color:#24292E;">, url = </span><span style="color:#032F62;">&quot;https://registry.myorg.com/&quot;</span><span style="color:#24292E;"> }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 带有令牌的注册表</span></span>
<span class="line"><span style="color:#24292E;">myorg3 = { token = </span><span style="color:#032F62;">&quot;$npm_token&quot;</span><span style="color:#24292E;">, url = </span><span style="color:#032F62;">&quot;https://registry.myorg.com/&quot;</span><span style="color:#24292E;"> }</span></span></code></pre></div><h3 id="缓存" tabindex="-1">缓存 <a class="header-anchor" href="#缓存" aria-label="Permalink to &quot;缓存&quot;">​</a></h3><p>要配置缓存行为：</p><div class="language-toml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">toml</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">[</span><span style="color:#B392F0;">install</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"><span style="color:#6A737D;"># \`bun install --global\`安装软件包的位置</span></span>
<span class="line"><span style="color:#E1E4E8;">globalDir = </span><span style="color:#9ECBFF;">&quot;~/.bun/install/global&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 全局安装软件包bin的链接位置</span></span>
<span class="line"><span style="color:#E1E4E8;">globalBinDir = </span><span style="color:#9ECBFF;">&quot;~/.bun/bin&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">[</span><span style="color:#B392F0;">install</span><span style="color:#E1E4E8;">.</span><span style="color:#B392F0;">cache</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"><span style="color:#6A737D;"># 用于缓存的目录</span></span>
<span class="line"><span style="color:#E1E4E8;">dir = </span><span style="color:#9ECBFF;">&quot;~/.bun/install/cache&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 当为true时，不要从全局缓存加载。</span></span>
<span class="line"><span style="color:#6A737D;"># Bun仍然可能会写入node_modules/.cache</span></span>
<span class="line"><span style="color:#E1E4E8;">disable = </span><span style="color:#79B8FF;">false</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 当为true时，总是从注册表中解析最新版本</span></span>
<span class="line"><span style="color:#E1E4E8;">disableManifest = </span><span style="color:#79B8FF;">false</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">[</span><span style="color:#6F42C1;">install</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#6A737D;"># \`bun install --global\`安装软件包的位置</span></span>
<span class="line"><span style="color:#24292E;">globalDir = </span><span style="color:#032F62;">&quot;~/.bun/install/global&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 全局安装软件包bin的链接位置</span></span>
<span class="line"><span style="color:#24292E;">globalBinDir = </span><span style="color:#032F62;">&quot;~/.bun/bin&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">[</span><span style="color:#6F42C1;">install</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">cache</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#6A737D;"># 用于缓存的目录</span></span>
<span class="line"><span style="color:#24292E;">dir = </span><span style="color:#032F62;">&quot;~/.bun/install/cache&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 当为true时，不要从全局缓存加载。</span></span>
<span class="line"><span style="color:#6A737D;"># Bun仍然可能会写入node_modules/.cache</span></span>
<span class="line"><span style="color:#24292E;">disable = </span><span style="color:#005CC5;">false</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 当为true时，总是从注册表中解析最新版本</span></span>
<span class="line"><span style="color:#24292E;">disableManifest = </span><span style="color:#005CC5;">false</span></span></code></pre></div><h3 id="锁定文件" tabindex="-1">锁定文件 <a class="header-anchor" href="#锁定文件" aria-label="Permalink to &quot;锁定文件&quot;">​</a></h3><p>要配置锁定文件行为：</p><div class="language-toml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">toml</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">[</span><span style="color:#B392F0;">install</span><span style="color:#E1E4E8;">.</span><span style="color:#B392F0;">lockfile</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 从中读取bun.lockb的路径</span></span>
<span class="line"><span style="color:#E1E4E8;">path = </span><span style="color:#9ECBFF;">&quot;bun.lockb&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 保存bun.lockb的路径</span></span>
<span class="line"><span style="color:#E1E4E8;">savePath = </span><span style="color:#9ECBFF;">&quot;bun.lockb&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 是否将锁定文件保存到磁盘</span></span>
<span class="line"><span style="color:#E1E4E8;">save = </span><span style="color:#79B8FF;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 是否在bun.lockb旁边保存非Bun锁定文件</span></span>
<span class="line"><span style="color:#6A737D;"># 仅支持&quot;yarn&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">print = </span><span style="color:#9ECBFF;">&quot;yarn&quot;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">[</span><span style="color:#6F42C1;">install</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">lockfile</span><span style="color:#24292E;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 从中读取bun.lockb的路径</span></span>
<span class="line"><span style="color:#24292E;">path = </span><span style="color:#032F62;">&quot;bun.lockb&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 保存bun.lockb的路径</span></span>
<span class="line"><span style="color:#24292E;">savePath = </span><span style="color:#032F62;">&quot;bun.lockb&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 是否将锁定文件保存到磁盘</span></span>
<span class="line"><span style="color:#24292E;">save = </span><span style="color:#005CC5;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 是否在bun.lockb旁边保存非Bun锁定文件</span></span>
<span class="line"><span style="color:#6A737D;"># 仅支持&quot;yarn&quot;</span></span>
<span class="line"><span style="color:#24292E;">print = </span><span style="color:#032F62;">&quot;yarn&quot;</span></span></code></pre></div><h3 id="调试" tabindex="-1">调试 <a class="header-anchor" href="#调试" aria-label="Permalink to &quot;调试&quot;">​</a></h3><div class="language-toml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">toml</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">[</span><span style="color:#B392F0;">debug</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"><span style="color:#6A737D;"># 在导航到blob:或src:链接时，在编辑器中打开文件</span></span>
<span class="line"><span style="color:#6A737D;"># 如果不是，它会尝试$EDITOR或$VISUAL</span></span>
<span class="line"><span style="color:#6A737D;"># 如果仍然失败，它将尝试Visual Studio Code，然后是Sublime Text，然后是其他一些</span></span>
<span class="line"><span style="color:#6A737D;"># 这是由Bun.openInEditor()使用的</span></span>
<span class="line"><span style="color:#E1E4E8;">editor = </span><span style="color:#9ECBFF;">&quot;code&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 编辑器列表：</span></span>
<span class="line"><span style="color:#6A737D;"># - &quot;subl&quot;, &quot;sublime&quot;</span></span>
<span class="line"><span style="color:#6A737D;"># - &quot;vscode&quot;, &quot;code&quot;</span></span>
<span class="line"><span style="color:#6A737D;"># - &quot;textmate&quot;, &quot;mate&quot;</span></span>
<span class="line"><span style="color:#6A737D;"># - &quot;idea&quot;</span></span>
<span class="line"><span style="color:#6A737D;"># - &quot;webstorm&quot;</span></span>
<span class="line"><span style="color:#6A737D;"># - &quot;nvim&quot;, &quot;neovim&quot;</span></span>
<span class="line"><span style="color:#6A737D;"># - &quot;vim&quot;,&quot;vi&quot;</span></span>
<span class="line"><span style="color:#6A737D;"># - &quot;emacs&quot;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">[</span><span style="color:#6F42C1;">debug</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#6A737D;"># 在导航到blob:或src:链接时，在编辑器中打开文件</span></span>
<span class="line"><span style="color:#6A737D;"># 如果不是，它会尝试$EDITOR或$VISUAL</span></span>
<span class="line"><span style="color:#6A737D;"># 如果仍然失败，它将尝试Visual Studio Code，然后是Sublime Text，然后是其他一些</span></span>
<span class="line"><span style="color:#6A737D;"># 这是由Bun.openInEditor()使用的</span></span>
<span class="line"><span style="color:#24292E;">editor = </span><span style="color:#032F62;">&quot;code&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 编辑器列表：</span></span>
<span class="line"><span style="color:#6A737D;"># - &quot;subl&quot;, &quot;sublime&quot;</span></span>
<span class="line"><span style="color:#6A737D;"># - &quot;vscode&quot;, &quot;code&quot;</span></span>
<span class="line"><span style="color:#6A737D;"># - &quot;textmate&quot;, &quot;mate&quot;</span></span>
<span class="line"><span style="color:#6A737D;"># - &quot;idea&quot;</span></span>
<span class="line"><span style="color:#6A737D;"># - &quot;webstorm&quot;</span></span>
<span class="line"><span style="color:#6A737D;"># - &quot;nvim&quot;, &quot;neovim&quot;</span></span>
<span class="line"><span style="color:#6A737D;"># - &quot;vim&quot;,&quot;vi&quot;</span></span>
<span class="line"><span style="color:#6A737D;"># - &quot;emacs&quot;</span></span></code></pre></div><h2 id="环境变量" tabindex="-1">环境变量 <a class="header-anchor" href="#环境变量" aria-label="Permalink to &quot;环境变量&quot;">​</a></h2><p>Bun 检查这些环境变量以检测功能并切换功能。</p><table><thead><tr><th>名称</th><th>描述</th></tr></thead><tbody><tr><td><code>TMPDIR</code></td><td>Bun 偶尔需要一个目录来存储捆绑或其他操作期间的中间资源。如果未设置，默认为特定于平台的临时目录：Linux 上为 <code>/tmp</code>，macOS 上为 <code>/private/tmp</code>。</td></tr><tr><td><code>NO_COLOR</code></td><td>如果 <code>NO_COLOR=1</code>，则禁用 ANSI 颜色输出。</td></tr><tr><td><code>FORCE_COLOR</code></td><td>如果 <code>FORCE_COLOR=1</code>，则强制启用 ANSI 颜色输出，即使设置了 <code>NO_COLOR</code>。</td></tr><tr><td><code>DO_NOT_TRACK</code></td><td>如果 <code>DO_NOT_TRACK=1</code>，则禁用分析。Bun 记录捆绑时间（以便我们可以用数据回答“Bun 是否越来越快？”）和功能使用情况（例如，“人们实际上是否在使用宏？”）。请求体大小约为 60 字节，因此数据量不大。</td></tr></tbody></table>`,33),e=[o];function t(c,r,i,y,u,E){return n(),a("div",null,e)}const g=s(p,[["render",t]]);export{q as __pageData,g as default};
