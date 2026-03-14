import type { ButtonProps } from 'ant-design-vue/lib/button/buttonTypes';

import type { ComputedRef, VNodeChild } from 'vue';

import type { ScrollContainerOptions } from '../../container';

export interface PopupHeaderProps {
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
  helpMessage?: Array<any> | string;

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
  showBackIcon: boolean;

  showCancelBtn: boolean;

  showContinueBtn: boolean;
  showOkBtn: boolean;

  /**
   * The title for Popup.
   * @type any (string | slot)
   */
  title?: JSX.Element | VNodeChild;
}
export interface PopupProps extends PopupHeaderProps {
  class?: string;
  /**
   * Whether a close (x) button is open on top right of the Popup dialog or not.
   * @default true
   * @type boolean
   */
  closable?: boolean;
  closeFunc?: () => Promise<any>;
  defaultFullscreen?: boolean;
  /**
   * Whether to unmount child components on closing popup or not.
   * @default false
   * @type boolean
   */
  destroyOnClose?: boolean;
  /**
   * Return the mounted node for Popup.
   * @default 'body'
   * @type any ( HTMLElement| () => HTMLElement | string)
   */
  getContainer?: () => HTMLElement | string;
  loading?: boolean;

  /**
   * Specify a callback that will be called when a user clicks mask, close button or Cancel button.
   */
  onClose?: (e?: Event) => void;

  open?: boolean;

  /**
   * Built-in ScrollContainer component configuration
   * @type ScrollContainerOptions
   */
  scrollOptions?: ScrollContainerOptions;

  triggerWindowResize?: boolean;

  /**
   * Width of the Popup dialog.
   * @default 100%
   * @type string | number
   */
  width?: number | string;

  /**
   * The z-index of the Popup.
   * @default 1000
   * @type number
   */
  zIndex?: number;
}
export interface PopupActionType {
  getScrollWrap: () => Element | null;
  scrollBottom: () => void;
  scrollTo: (to: number) => void;
}

export interface PopupInstance {
  emitOpen?: (open: boolean, uid: number) => void;
  setPopupProps: (props: Partial<PopupProps>) => void;
}

export interface PopupReturnMethods extends PopupInstance {
  closePopup: () => void;
  getOpen?: ComputedRef<boolean>;
  openPopup: <T = any>(open?: boolean, data?: T, openOnSet?: boolean) => void;
}

export type PopupRegisterFn = (popupInstance: PopupInstance, uuid: string) => void;

export interface PopupReturnInnerMethods extends PopupInstance {
  changeContinueLoading: (loading: boolean) => void;
  changeLoading: (loading: boolean) => void;
  changeOkLoading: (loading: boolean) => void;
  closePopup: () => void;
  getOpen?: ComputedRef<boolean>;
}

export type UsePopupReturnType = [PopupRegisterFn, PopupReturnMethods];

export type UsePopupInnerReturnType = [PopupRegisterFn, PopupReturnInnerMethods];
