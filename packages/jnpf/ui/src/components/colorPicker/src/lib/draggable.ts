/* eslint-disable unicorn/prefer-add-event-listener */
let isDragging = false;

export declare interface IOptions {
  drag?: (event: Event) => void;
  end?: (event: Event) => void;
  start?: (event: Event) => void;
}

export default function draggable(ele: HTMLElement, options: IOptions) {
  const moveFun = function (event: Event) {
    options?.drag?.(event);
  };

  const upFun = function (event: Event) {
    document.removeEventListener('mousemove', moveFun);
    document.removeEventListener('mouseup', upFun);
    document.onselectstart = null;
    document.ondragstart = null;

    isDragging = false;

    options?.end?.(event);
  };

  ele.addEventListener('mousedown', (event: Event) => {
    if (isDragging) return;

    document.addEventListener('mousemove', moveFun);
    document.addEventListener('mouseup', upFun);
    document.onselectstart = () => false;
    document.ondragstart = () => false;

    isDragging = true;

    options?.start?.(event);
  });
}
