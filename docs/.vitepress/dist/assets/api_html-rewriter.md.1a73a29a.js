import{_ as s,o as n,c as a,Q as l}from"./chunks/framework.33544f09.js";const g=JSON.parse('{"title":"HTMLRewriter","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"api/html-rewriter.md","filePath":"api/html-rewriter.md"}'),p={name:"api/html-rewriter.md"},e=l(`<h1 id="htmlrewriter" tabindex="-1">HTMLRewriter <a class="header-anchor" href="#htmlrewriter" aria-label="Permalink to &quot;HTMLRewriter&quot;">​</a></h1><p>Bun 提供了一个快速的本地实现，该实现基于 Cloudflare 开发的<code>HTMLRewriter</code>模式。它为遍历和转换 HTML 文档提供了一个方便的<code>EventListener</code>-类似的 API。</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">rewriter</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">HTMLRewriter</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">rewriter.</span><span style="color:#B392F0;">on</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;*&quot;</span><span style="color:#E1E4E8;">, {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">element</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">el</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(el.tagName); </span><span style="color:#6A737D;">// &quot;body&quot; | &quot;div&quot; | ...</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#E1E4E8;">});</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">rewriter</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">HTMLRewriter</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">rewriter.</span><span style="color:#6F42C1;">on</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;*&quot;</span><span style="color:#24292E;">, {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">element</span><span style="color:#24292E;">(</span><span style="color:#E36209;">el</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">    console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(el.tagName); </span><span style="color:#6A737D;">// &quot;body&quot; | &quot;div&quot; | ...</span></span>
<span class="line"><span style="color:#24292E;">  },</span></span>
<span class="line"><span style="color:#24292E;">});</span></span></code></pre></div><p>要解析和/或转换 HTML：</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">rewriter.</span><span style="color:#B392F0;">transform</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Response</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">\`</span></span>
<span class="line"><span style="color:#9ECBFF;">&lt;!DOCTYPE html&gt;</span></span>
<span class="line"><span style="color:#9ECBFF;">&lt;html&gt;</span></span>
<span class="line"><span style="color:#9ECBFF;">&lt;!-- comment --&gt;</span></span>
<span class="line"><span style="color:#9ECBFF;">&lt;head&gt;</span></span>
<span class="line"><span style="color:#9ECBFF;">  &lt;title&gt;My First HTML Page&lt;/title&gt;</span></span>
<span class="line"><span style="color:#9ECBFF;">&lt;/head&gt;</span></span>
<span class="line"><span style="color:#9ECBFF;">&lt;body&gt;</span></span>
<span class="line"><span style="color:#9ECBFF;">  &lt;h1&gt;My First Heading&lt;/h1&gt;</span></span>
<span class="line"><span style="color:#9ECBFF;">  &lt;p&gt;My first paragraph.&lt;/p&gt;</span></span>
<span class="line"><span style="color:#9ECBFF;">&lt;/body&gt;</span></span>
<span class="line"><span style="color:#9ECBFF;">\`</span><span style="color:#E1E4E8;">));</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">rewriter.</span><span style="color:#6F42C1;">transform</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Response</span><span style="color:#24292E;">(</span><span style="color:#032F62;">\`</span></span>
<span class="line"><span style="color:#032F62;">&lt;!DOCTYPE html&gt;</span></span>
<span class="line"><span style="color:#032F62;">&lt;html&gt;</span></span>
<span class="line"><span style="color:#032F62;">&lt;!-- comment --&gt;</span></span>
<span class="line"><span style="color:#032F62;">&lt;head&gt;</span></span>
<span class="line"><span style="color:#032F62;">  &lt;title&gt;My First HTML Page&lt;/title&gt;</span></span>
<span class="line"><span style="color:#032F62;">&lt;/head&gt;</span></span>
<span class="line"><span style="color:#032F62;">&lt;body&gt;</span></span>
<span class="line"><span style="color:#032F62;">  &lt;h1&gt;My First Heading&lt;/h1&gt;</span></span>
<span class="line"><span style="color:#032F62;">  &lt;p&gt;My first paragraph.&lt;/p&gt;</span></span>
<span class="line"><span style="color:#032F62;">&lt;/body&gt;</span></span>
<span class="line"><span style="color:#032F62;">\`</span><span style="color:#24292E;">));</span></span></code></pre></div><p>在<a href="https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/" target="_blank" rel="noreferrer">Cloudflare 网站上查看完整文档</a>。</p>`,6),t=[e];function o(r,c,i,y,E,d){return n(),a("div",null,t)}const h=s(p,[["render",o]]);export{g as __pageData,h as default};
