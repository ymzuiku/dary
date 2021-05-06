import { bindState } from "vanilla-ob";
import * as life from "vanilla-life";

const filterElement = (el: any) => {
  if (typeof el === "boolean" || el === void 0 || el === null) {
    return false;
  }
  return true;
};

export function createEle(tag: any) {
  return (obj: any, ...children: any[]) => {
    const el = typeof tag === "object" ? tag : document.createElement(tag);
    if (typeof obj !== "object" || obj.addEventListener) {
      el.append(...[obj, ...children].filter(filterElement));
      return el;
    }
    Object.keys(obj).forEach((k) => {
      const v = obj[k];
      if (k === "onUpdate") {
        bindState(el, null, v);
        return;
      }
      const lifeFn = (life as any)[k];
      if (lifeFn) {
        lifeFn(el, v);
        return;
      }
      bindState(el, k, v);
    });
    if (children && children.length) {
      el.append(...children.filter(filterElement));
    }
    return el;
  };
}
