export interface DropMenu {
  disabled?: boolean;
  divider?: boolean;
  event: number | string;
  icon?: string;
  onClick?: Fn;
  text: string;
  to?: string;
}
