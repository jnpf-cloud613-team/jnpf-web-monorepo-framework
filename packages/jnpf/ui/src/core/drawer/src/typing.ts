import type { ButtonProps } from 'ant-design-vue/lib/button/buttonTypes';

import type { ComputedRef, CSSProperties, VNodeChild } from 'vue';

import type { ScrollContainerOptions } from '../../container';

export interface DrawerFooterProps {
  /**
   * The cancel button props, follow jsx rules
   * @type object
   */
  cancelButtonProps: { on: object; props: ButtonProps };
  /**
   * Text of the Cancel button
   * @default 'cancel'
   * @type string
   */
  cancelText: string;
  /**
   * Whether to apply loading visual effect for OK button or not
   * @default false
   * @type boolean
   */
  confirmLoading: boolean;
  continueButtonProps: { on: object; props: ButtonProps };
  continueLoading?: boolean;

  continueText?: string;

  continueType?: 'danger' | 'dashed' | 'default' | 'ghost' | 'primary';

  footerHeight: number | string;
  /**
   * The ok button props, follow jsx rules
   * @type object
   */
  okButtonProps: { on: object; props: ButtonProps };

  /**
   * Text of the OK button
   * @default 'OK'
   * @type string
   */
  okText: string;

  /**
   * Button type of the OK button
   * @default 'primary'
   * @type string
   */
  okType: 'danger' | 'dashed' | 'default' | 'ghost' | 'primary';
  showCancelBtn: boolean;

  showContinueBtn: boolean;

  showFooter: boolean;
  showOkBtn: boolean;
}
export interface DrawerProps extends DrawerFooterProps {
  afterOpenChange?: (open?: boolean) => void;
  /**
   * Style of floating layer, typically used for adjusting its position.
   * @type object
   */
  bodyStyle?: CSSProperties;
  class?: string;
  /**
   * Whether a close (x) button is open on top right of the Drawer dialog or not.
   * @default true
   * @type boolean
   */
  closable?: boolean;
  closeFunc?: () => Promise<any>;
  /**
   * Whether to unmount child components on closing drawer or not.
   * @default false
   * @type boolean
   */
  destroyOnClose?: boolean;
  /**
   * Style of the popup layer element
   * @type object
   */
  drawerStyle?: CSSProperties;
  /**
   * Return the mounted node for Drawer.
   * @default 'body'
   * @type any ( HTMLElement| () => HTMLElement | string)
   */
  getContainer?: () => HTMLElement | string;

  headerStyle?: CSSProperties;

  /**
   * placement is top or bottom, height of the Drawer dialog.
   * @type string | number
   */
  height?: number | string;

  isDetail?: boolean;

  keyboard?: boolean;

  loading?: boolean;

  /**
   * Whether to show mask or not.
   * @default true
   * @type boolean
   */
  mask?: boolean;
  /**
   * Clicking on the mask (area outside the Drawer) to close the Drawer or not.
   * @default true
   * @type boolean
   */
  maskClosable?: boolean;
  /**
   * Style for Drawer's mask element.
   * @default {}
   * @type object
   */
  maskStyle?: CSSProperties;
  /**
   * Specify a callback that will be called when a user clicks mask, close button or Cancel button.
   */
  onClose?: (e?: Event) => void;
  open?: boolean;

  /**
   * The placement of the Drawer.
   * @default 'right'
   * @type string
   */
  placement?: 'bottom' | 'left' | 'right' | 'top';

  rootClassName?: string;
  /**
   * Built-in ScrollContainer component configuration
   * @type ScrollContainerOptions
   */
  scrollOptions?: ScrollContainerOptions;

  showDetailBack?: boolean;

  /**
   * The title for Drawer.
   * @type any (string | slot)
   */
  title?: JSX.Element | VNodeChild;

  triggerWindowResize?: boolean;

  /**
   * Width of the Drawer dialog.
   * @default 256
   * @type string | number
   */
  width?: number | string;
  /**
   * The class name of the container of the Drawer dialog.
   * @type string
   */
  wrapClassName?: string;
  /**
   * Style of wrapper element which **contains mask** compare to `drawerStyle`
   * @type object
   */
  wrapStyle?: CSSProperties;
  /**
   * The z-index of the Drawer.
   * @default 1000
   * @type number
   */
  zIndex?: number;
}
export interface DrawerActionType {
  getScrollWrap: () => Element | null;
  scrollBottom: () => void;
  scrollTo: (to: number) => void;
}

export interface DrawerInstance {
  emitOpen?: (open: boolean, uid: number) => void;
  setDrawerProps: (props: Partial<DrawerProps>) => void;
}

export interface DrawerReturnMethods extends DrawerInstance {
  closeDrawer: () => void;
  getOpen?: ComputedRef<boolean>;
  openDrawer: <T = any>(open?: boolean, data?: T, openOnSet?: boolean) => void;
}

export type DrawerRegisterFn = (drawerInstance: DrawerInstance, uuid: string) => void;

export interface DrawerReturnInnerMethods extends DrawerInstance {
  changeContinueLoading: (loading: boolean) => void;
  changeLoading: (loading: boolean) => void;
  changeOkLoading: (loading: boolean) => void;
  closeDrawer: () => void;
  getOpen?: ComputedRef<boolean>;
}

export type UseDrawerReturnType = [DrawerRegisterFn, DrawerReturnMethods];

export type UseDrawerInnerReturnType = [DrawerRegisterFn, DrawerReturnInnerMethods];
