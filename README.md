# dary

Only: 700 byte before gzip.

> 此库是一个面向未来的库，不对历史浏览器做任何兼容，打包方式亦为 esm.
> 笔着相信未来前端会有不少开发人员回归 VanillaJS。

拥有完整 TS 提示的 document.createElement 简化函数.

此库仅有几行代码，仅仅是一个工具函数，它的目的仅仅是更简单组合原生元素，让编写原生 JS 工程时，写出类似 JSX 的树形结构。

dary 内部并无创建所有的 HTMLElement 初始化方法，为了简化代码，使用 Proxy 动态创建标签函数。

此库极小极简，非常适合用于开发跨框架的组件，同时也适合在 React、Vue、Ag 等框架中嵌套使用。

此库存在的目的只是帮助需要编写原生 JS 的人编写更少的代码。

## Example:

编写一大片类似 JSX 的代码

```js
import { D } from "dary";

const data = ["list-a", "list-b"];

// 我们可以看到我们可以呈现一个非常类似于 JSX 的解构，从代码块中可以很好的识别元素的父子关系
// 使用空注释，可迫使 prettier format 换行
const ele = D.div(
  D.header(
    { className: "header" },
    D.nav(
      "logo", //
      D.div({ className: "title" }, "Page Name"),
      D.div({ className: "edit" }, "Edit")
    )
  ),
  D.main(
    { className: "content" }, //
    ...data.map((item) => D.div(item))
  ),
  D.section({ className: "footer" }, "Footer")
);

document.body.append(ele);
```

## Detail

创建函数

```js
// 兼容所有标签名: D.div D.p D.section...
// 第二个参数可以 append 多个元素
const ele = D.div({ className: "card" }, eleA, eleB);
// 上一行代码等效于：
const ele = document.createElement("div");
ele.className = "card";
ele.append(eleA, eleB);

// append 兼容 string
const title = D.p("hello world");
// 上一行代码等效于：
const title = document.createElement("p");
title.append("hello world");
```

忽略某些参数：

```js
// 以下写法都成立
// 简单解释为，第一个参数若是一个 props 对象，则负值到元素上，将剩余的参数 append 到元素上
const ele = D.div({ className: "card" }, eleA, eleB);
const ele = D.div({ className: "card" });
const ele = D.div(null, eleA, eleB);
const ele = D.div(eleA);
```

## 默认忽略某些不应该插入到 DOM 中的值

<!--
> PS: **此特性, 作者思考了许久是否应该加上，因为 dary 的核心理念就是要保持简单，市面上许多库做着做着就变成一团乱泥，其核心原因就是添加了许多不应该添加的特性，导致变得臃肿并在许多场景显得多余** -->

> 由于 JSX 中 a && b 的 DOM 对象组合方式已经行以为常，不做此兼容会影响最终表达的树形解构的简洁性，于此考量认为应该保留此特性

参考 React 中 JSX 的实现，我们需要忽略 boolean 插入 DOM 中:

```js
// 拦截函数如下：
const filterElement = (el: any) => {
  if (typeof el === "boolean" || el === void 0 || el === null) {
    return false;
  }
  return true;
};
```

有了这个拦截，我们得以使用以下方式组合代码：

```js
// 若 isShow 成立，插入 eleA，否则不插入任何值
const ele = D.div(isShow && eleA);

// 这样以下假值可以正常插入到元素中
const ele = D.div(0, "false", "", "0");
```

## 生命周期

dary 使用 vanilla-life 扩展了元素生命周期的功能

```ts
const ele = D.div({
  onUpdate: (e) => {
    console.log("每当 aoife.next() 找到到此元素及元素父类都会执行");
  },
  onAppend: (e) => {
    console.log("out已插入到页面中");
  },
  onEntry: (e) => {
    console.log("out已从屏幕外面进入到屏幕中");
  },
  onRemove: (e) => {
    console.log("out已从页面中移除");
  },
});
```

## 动态属性

dary 使用 vanilla-ob 扩展了动态属性的能力

```ts
import { D, nextState } from "dary";

// 状态只是一个普通对象
const state = {
  name: "dog",
};
// 把直接赋值改为函数返回值，此类属性为动态属性
const ele = D.div({
  textContent: () => state.name,
});

// 修改状态
state.name = "fish";
// 派发更新
nextState(ele);
```

仅此而已，保持简单
