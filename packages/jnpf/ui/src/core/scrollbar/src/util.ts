import type { BarMap } from './types';

export const BAR_MAP: BarMap = {
  horizontal: {
    axis: 'X',
    client: 'clientX',
    direction: 'left',
    key: 'horizontal',
    offset: 'offsetWidth',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    size: 'width',
  },
  vertical: {
    axis: 'Y',
    client: 'clientY',
    direction: 'top',
    key: 'vertical',
    offset: 'offsetHeight',
    scroll: 'scrollTop',
    scrollSize: 'scrollHeight',
    size: 'height',
  },
};

export function renderThumbStyle({ bar, move, size }) {
  const style = {} as any;
  const translate = `translate${bar.axis}(${move}%)`;

  style[bar.size] = size;
  style.transform = translate;
  style.msTransform = translate;
  style.webkitTransform = translate;

  return style;
}

function extend<T, K>(to: T, _from: K): K & T {
  return Object.assign(to as any, _from);
}

export function toObject<T>(arr: Array<T>): Recordable<T> {
  const res = {};
  for (const element of arr) {
    if (element) {
      extend(res, element);
    }
  }
  return res;
}
