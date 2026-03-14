import type { ButtonProps } from 'ant-design-vue/es/button/buttonTypes';
import type { TooltipProps } from 'ant-design-vue/es/tooltip/Tooltip';

export interface PopConfirm {
  cancel?: Fn;
  cancelText?: string;
  confirm: Fn;
  icon?: string;
  okText?: string;
  placement?:
    | 'bottom'
    | 'bottomLeft'
    | 'bottomRight'
    | 'left'
    | 'leftBottom'
    | 'leftTop'
    | 'right'
    | 'rightBottom'
    | 'rightTop'
    | 'top'
    | 'topLeft'
    | 'topRight';
  title: string;
}
export interface modelConfirm {
  cancelText?: string;
  content?: string;
  okText?: string;
  okType?: string;
  onCancel?: Fn;
  onOk?: Fn;
  title?: string;
}

export interface ActionItem extends ButtonProps {
  // 权限编码控制是否显示
  auth?: string;
  color?: 'error' | 'success' | 'warning';
  disabled?: boolean;
  divider?: boolean;
  icon?: string;
  // 业务控制是否显示
  ifShow?: ((action: ActionItem) => boolean) | boolean;
  label?: string;
  modelConfirm?: modelConfirm;
  onClick?: Fn;
  popConfirm?: PopConfirm;
  tooltip?: string | TooltipProps;
}
