export type ScrollType = 'default' | 'main';

declare type RefType<T> = null | T;

export interface CollapseContainerOptions {
  canExpand?: boolean;
  helpMessage?: Array<any> | string;
  title?: string;
}
export interface ScrollContainerOptions {
  enableScroll?: boolean;
  type?: ScrollType;
}

export type ScrollActionType = RefType<{
  getScrollWrap: () => Nullable<HTMLElement>;
  scrollBottom: () => void;
  scrollTo: (top: number, duration?: number) => void;
}>;
