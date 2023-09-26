---
outline: "deep"
---

# DOM testing

Bun 的测试运行器与现有的组件和 DOM 测试库（包括 React Testing Library 和[Happy DOM](https://github.com/capricorn86/happy-dom)）很好地协作。

## Happy DOM

如果要为前端代码和组件编写无头测试，我们建议使用[Happy DOM](https://github.com/capricorn86/happy-dom)。Happy DOM 在纯 JavaScript 中实现了一套完整的 HTML 和 DOM API，使得可以以高度逼真的方式模拟浏览器环境。

要开始使用 Happy DOM，请将`@happy-dom/global-registrator`包安装为开发依赖项。

```bash
$ bun add -d @happy-dom/global-registrator
```

我们将使用 Bun 的预加载功能来在运行测试之前注册`happy-dom`全局。这一步将使浏览器 API（如`document`）在全局范围内可用。在项目的根目录中创建一个名为`happydom.ts`的文件，并添加以下代码：

```ts
import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register();
```

要在运行`bun test`之前预加载此文件，请打开或创建一个`bunfig.toml`文件，并添加以下行。

```toml
[test]
preload = "./happydom.ts"
```

这将在运行`bun test`时执行`happydom.ts`。现在，您可以编写使用浏览器 API（如`document`和`window`）的测试。

```ts
#dom.test.ts
import {test, expect} from 'bun:test';

test('dom test', () => {
  document.body.innerHTML = `<button>My button</button>`;
  const button = document.querySelector('button');
  expect(button?.innerText).toEqual('My button');
});
```

根据您的`tsconfig.json`设置，您可能会在上面的代码中看到一个`"Cannot find name 'document'"`类型错误。为了为`document`和其他浏览器 API“注入”类型，向任何测试文件的顶部添加以下[三斜线指令](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html)。

```ts-diff
#dom.test.ts
+ /// <reference lib="dom" />

  import {test, expect} from 'bun:test';

  test('dom test', () => {
    document.body.innerHTML = `<button>My button</button>`;
    const button = document.querySelector('button');
    expect(button?.innerText).toEqual('My button');
  });
```

让我们使用`bun test`运行这个测试：

```bash
$ bun test
bun test v1.x

dom.test.ts:
✓ dom test [0.82ms]

 1 pass
 0 fail
 1 expect() calls
Ran 1 tests across 1 files. 1 total [125.00ms]
```

<!-- ## React Testing Library

一旦您按照上述说明设置了`happy-dom`，您可以将其与React Testing Library一起使用。要开始，请将`@testing-library/react`包安装为开发依赖项。

```bash
$ bun add -d @testing-library/react
``` -->
