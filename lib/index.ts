type PartialDetail<T> = {
  [P in keyof T]?: Partial<T[P]>;
};

const filterElement = (el: any) => {
  if (typeof el === "boolean" || el === void 0 || el === null) {
    return false;
  }
  return true;
};

function createEle(tag: any) {
  return (obj: any, ...children: any[]) => {
    if (
      typeof obj === "string" ||
      typeof obj === "number" ||
      typeof obj === "boolean" ||
      obj.addEventListener
    ) {
      const el = document.createElement(tag);
      el.append(...[obj, ...children].filter(filterElement));
      return el;
    }
    const el = Object.assign(document.createElement(tag), obj);
    if (children && children.length) {
      el.append(...children.filter(filterElement));
    }
    return el;
  };
}

type DaryChildren = (Node | string | number | boolean)[];

type Dary = {
  [K in keyof HTMLElementTagNameMap]: (
    obj?: PartialDetail<HTMLElementTagNameMap[K]>,
    ...children: DaryChildren
  ) => HTMLElementTagNameMap[K];
};

type DarySingle = {
  [K in keyof HTMLElementTagNameMap]: (
    ...children: DaryChildren
  ) => HTMLElementTagNameMap[K];
};

export const dary: Dary & DarySingle = new Proxy({} as any, {
  get(target, key) {
    if (!target[key]) {
      target[key] = createEle(key);
    }
    return target[key];
  },
}) as any;
