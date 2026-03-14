import type { ButtonProps } from 'ant-design-vue/lib/button/buttonTypes';

import type { ComputedRef, CSSProperties, VNodeChild } from 'vue';

export interface ModalWrapperProps {
  footerOffset?: number;
  fullScreen: boolean;
  height: number;
  loading: boolean;
  minHeight: number;
  modalFooterHeight: number;
  modalHeaderHeight: number;
  open: boolean;
  useWrapper: boolean;
}

export interface ModalProps {
  /**
   * Specify a function that will be called when modal is closed completely.
   * @type Function
   */
  afterClose?: () => any;
  /**
   * Body style for modal body element. Such as height, padding etc.
   * @default {}
   * @type object
   */
  bodyStyle?: CSSProperties;
  /**
   * The cancel button props, follow jsx rules
   * @type object
   */
  cancelButtonProps?: ButtonProps;
  /**
   * Text of the Cancel button
   * @default 'cancel'
   * @type string
   */
  cancelText?: string;
  // 是否可以进行全屏
  canFullscreen?: boolean;

  /**
   * Centered Modal
   * @default false
   * @type boolean
   */
  centered?: boolean;
  /**
   * Whether a close (x) button is open on top right of the modal dialog or not
   * @default true
   * @type boolean
   */
  closable?: boolean;
  closeFunc: () => Promise<any>;
  /**
   * Whether a close (x) button is open on top right of the modal dialog or not
   */
  closeIcon?: JSX.Element | VNodeChild;

  /**
   * Whether to apply loading visual effect for OK button or not
   * @default false
   * @type boolean
   */
  confirmLoading?: boolean;

  continueButtonProps?: ButtonProps;
  continueLoading?: boolean;

  continueText?: string;

  continueType?: 'danger' | 'dashed' | 'default' | 'ghost' | 'primary';
  defaultFullscreen?: boolean;
  /**
   * Whether to unmount child components on onClose
   * @default false
   * @type boolean
   */
  destroyOnClose?: boolean;
  draggable?: boolean;

  /**
   * Footer content, set as :footer="null" when you don't need default buttons
   * @default OK and Cancel buttons
   * @type any (string | slot)
   */
  footer?: JSX.Element | VNodeChild;

  /**
   * Return the mount node for Modal
   * @default () => document.body
   * @type Function
   */
  getContainer?: (instance: any) => HTMLElement;

  height?: number;

  // 温馨提醒信息
  helpMessage: string | string[];

  loading: boolean;
  loadingTip?: string;

  /**
   * Whether show mask or not.
   * @default true
   * @type boolean
   */
  mask?: boolean;

  /**
   * Whether to close the modal dialog when the mask (area outside the modal) is clicked
   * @default true
   * @type boolean
   */
  maskClosable?: boolean;

  /**
   * Style for modal's mask element.
   * @default {}
   * @type object
   */
  maskStyle?: CSSProperties;

  minHeight?: number;

  /**
   * The ok button props, follow jsx rules
   * @type object
   */
  okButtonProps?: ButtonProps;

  /**
   * Text of the OK button
   * @default 'OK'
   * @type string
   */
  okText?: string;

  /**
   * Button type of the OK button
   * @default 'primary'
   * @type string
   */
  okType?: 'danger' | 'dashed' | 'default' | 'ghost' | 'primary';

  open?: boolean;

  scrollTop?: boolean;

  showCancelBtn: boolean;

  showContinueBtn: boolean;

  showOkBtn: boolean;

  /**
   * The modal dialog's title
   * @type any (string | slot)
   */
  title?: JSX.Element | VNodeChild;

  // 是否使用modalWrapper
  useWrapper: boolean;

  /**
   * Width of the modal dialog
   * @default 520
   * @type string | number
   */
  width?: number | string;

  /**
   * The class name of the container of the modal dialog
   * @type string
   */
  wrapClassName?: string;

  // 启用wrapper后 底部可以适当增加高度
  wrapperFooterOffset?: number;

  wrapperProps: Omit<ModalWrapperProps, 'loading'>;

  /**
   * The z-index of the Modal
   * @default 1000
   * @type number
   */
  zIndex?: number;
}

/**
 * @description: 弹窗对外暴露的方法
 */
export interface ModalMethods {
  emitOpen?: (open: boolean, uid: number) => void;
  redoModalHeight?: () => void;
  setModalProps: (props: Partial<ModalProps>) => void;
}

export type RegisterFn = (modalMethods: ModalMethods, uuid: string) => void;

export interface ReturnMethods extends ModalMethods {
  closeModal: () => void;
  getOpen?: ComputedRef<boolean>;
  openModal: <T = any>(props?: boolean, data?: T, openOnSet?: boolean) => void;
}

export type UseModalReturnType = [RegisterFn, ReturnMethods];

export interface ReturnInnerMethods extends ModalMethods {
  changeContinueLoading: (loading: boolean) => void;
  changeLoading: (loading: boolean) => void;
  changeOkLoading: (loading: boolean) => void;
  closeModal: () => void;
  getOpen?: ComputedRef<boolean>;
  redoModalHeight: () => void;
}

export type UseModalInnerReturnType = [RegisterFn, ReturnInnerMethods];
