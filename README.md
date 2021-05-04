# dary

> 此库是一个面向未来的库，不对历史浏览器做任何兼容，打包方式亦为 esm.
> 笔着相信未来前端会有不少开发人员回归 VanillaJS。

拥有完整 TS 提示的 document.createElement 简化函数.

此库仅有几行代码，仅仅是一个工具函数，它的目的仅仅是更简单组合原生元素，让编写原生 JS 工程时，写出类似 JSX 的树形结构。

dary 内部并无创建所有的 HTMLElement 初始化方法，为了简化代码，使用 Proxy 动态创建标签函数。

## Example:

编写一大片类似 JSX 的代码

```js
import dary from "dary";

const data = ["list-a", "list-b"];

// 我们可以看到我们可以呈现一个非常类似于 JSX 的解构，从代码块中可以很好的识别元素的父子关系
// 使用空注释，可迫使 prettier format 换行
const ele = dary.div(
  dary.header(
    { className: "header" },
    dary.nav(
      "logo", //
      dary.div({ className: "title" }, "Page Name"),
      dary.div({ className: "edit" }, "Edit")
    )
  ),
  dary.main(
    { className: "content" }, //
    ...data.map((item) => dary.div(item))
  ),
  dary.section({ className: "footer" }, "Footer")
);

document.body.append(ele);
```

## Detail

创建函数

```js
// 兼容所有标签名: dary.div dary.p dary.section...
// 第二个参数可以 append 多个元素
const ele = dary.div({ className: "card" }, eleA, eleB);
// 上一行代码等效于：
const ele = document.createElement("div");
ele.className = "card";
ele.append(eleA, eleB);

// append 兼容 string
const title = dary.p("hello world");
// 上一行代码等效于：
const title = document.createElement("p");
title.append("hello world");
```

忽略某些参数：

```js
// 以下写法都成立
// 简单解释为，第一个参数若是一个 props 对象，则负值到元素上，将剩余的参数 append 到元素上
const ele = dary.div({ className: "card" }, eleA, eleB);
const ele = dary.div({ className: "card" });
const ele = dary.div(null, eleA, eleB);
const ele = dary.div(eleA);
```

仅此而已，保持简单