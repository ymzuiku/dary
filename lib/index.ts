import { createEle } from "./createEl";
export { nextState } from "vanilla-ob";

type PartialFn<T> = {
  [P in keyof T]?: Partial<T[P]> | (() => Partial<T[P]>);
};

type AttrFn = (string | number) | (() => string | number);

type ExportHTMLElement = {
  [key: string]: AttrFn;
};

type VanillaLifeProps = {
  onAppend: (el: HTMLElement) => any;
  onUpdate: (el: HTMLElement) => any;
  onEntry: (el: HTMLElement) => any;
  onRemove: (el: HTMLElement) => any;
};

type DaryProps<T> = PartialFn<T> | ExportHTMLElement | VanillaLifeProps;

type DaryChildren = (Node | string | number | boolean)[];

interface ExHTMLElementTagNameMap extends HTMLElementTagNameMap {
  [key: string]: HTMLElement;
}

type DaryBase = {
  [K in keyof ExHTMLElementTagNameMap]: (
    obj?: DaryProps<ExHTMLElementTagNameMap[K]>,
    ...children: DaryChildren
  ) => ExHTMLElementTagNameMap[K];
};

type DarySingle = {
  [K in keyof ExHTMLElementTagNameMap]: (
    ...children: DaryChildren
  ) => ExHTMLElementTagNameMap[K];
};

type DaryModify = <T extends Element>(
  target: T,
  obj?: DaryProps<T>,
  ...children: DaryChildren
) => T;

type DaryModifySingle = <T extends Element>(
  target: T,
  ...children: DaryChildren
) => T;

// type NextState = {
//   nextState: typeof nextState;
// };

function modify(el: any, ...attrs: any[]) {
  return (createEle as any)(el)(...attrs);
}

// modify.nextState = nextState;

type Dary = DaryBase & DarySingle & DaryModify & DaryModifySingle;

export const D: Dary = new Proxy(modify as any, {
  get(target, key) {
    if (!target[key]) {
      target[key] = createEle(key);
    }
    return target[key];
  },
}) as any;
