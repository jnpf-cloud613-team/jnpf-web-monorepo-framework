import type { Fn } from '@vben/types/global';

export interface Axis {
  x: number;
  y: number;
}

export interface ContextMenuItem {
  children?: ContextMenuItem[];
  disabled?: boolean;
  divider?: boolean;
  handler?: Fn;
  hidden?: boolean;
  icon?: string;
  label: string;
}
export interface CreateContextOptions {
  event: MouseEvent;
  icon?: string;
  items?: ContextMenuItem[];
  styles?: any;
}

export interface ContextMenuProps {
  axis?: Axis;
  customEvent?: MouseEvent;
  event?: MouseEvent;
  items: ContextMenuItem[];
  showIcon?: boolean;
  styles?: any;
  width?: number;
}

export interface ItemContentProps {
  handler: Fn;
  item: ContextMenuItem;
  showIcon: boolean | undefined;
}
