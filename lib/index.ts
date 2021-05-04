type PartialDetail<T> = {
  [P in keyof T]?: Partial<T[P]>;
};

function createEle(tag: any) {
  return (obj: any, ...children: any[]) => {
    if (typeof obj === "string" || obj.addEventListener) {
      const el = document.createElement(tag);
      el.append(obj, ...children);
      return el;
    }
    const el = Object.assign(document.createElement(tag), obj);
    if (children && children.length) {
      el.append(...children);
    }
    return el;
  };
}

type EleType = {
  [K in keyof HTMLElementTagNameMap]: (
    obj?: PartialDetail<HTMLElementTagNameMap[K]>,
    ...children: (Node | string)[]
  ) => HTMLElementTagNameMap[K];
};

type EleTypeSingle = {
  [K in keyof HTMLElementTagNameMap]: (
    ...children: (Node | string)[]
  ) => HTMLElementTagNameMap[K];
};

export const dary: EleType & EleTypeSingle = new Proxy({ modify } as any, {
  get(target, key) {
    if (!target[key]) {
      target[key] = createEle(key);
    }
    return target[key];
  },
}) as any;
