import type { ButtonProps } from 'ant-design-vue/es/button/buttonTypes';

import type { CSSProperties, PropType } from 'vue';

import type { ModalWrapperProps } from './typing';

import { $t } from '@vben/locales';

export const modalProps = {
  cancelText: { default: () => $t('common.cancelText'), type: String },
  centered: { default: true, type: Boolean },
  closeFunc: Function as PropType<() => Promise<boolean>>,
  continueText: { default: () => $t('common.continueText'), type: String },
  // open drag
  draggable: { default: false, type: Boolean },
  height: { type: Number },
  minHeight: { type: Number },
  okText: { default: () => $t('common.okText'), type: String },
  open: { type: Boolean },

  scrollTop: { default: true, type: Boolean },
};

export const basicProps = Object.assign({}, modalProps, {
  afterClose: Function as PropType<() => Promise<VueNode>>,
  bodyStyle: Object as PropType<CSSProperties>,
  cancelButtonProps: Object as PropType<ButtonProps>,
  // Can it be full screen
  canFullscreen: { default: false, type: Boolean },
  closable: { default: true, type: Boolean },
  closeIcon: Object as PropType<VueNode>,
  confirmLoading: { type: Boolean },
  continueButtonProps: Object as PropType<ButtonProps>,
  continueLoading: { type: Boolean },

  continueType: { default: 'default', type: String },

  defaultFullscreen: { type: Boolean },

  destroyOnClose: { type: Boolean },

  footer: Object as PropType<VueNode>,

  getContainer: Function as PropType<() => any>,

  // Warm reminder message
  helpMessage: [String, Array] as PropType<string | string[]>,

  keyboard: { default: false, type: Boolean },

  loading: { type: Boolean },

  loadingTip: { type: String },

  mask: { default: true, type: Boolean },

  maskClosable: { default: false, type: Boolean },

  maskStyle: Object as PropType<CSSProperties>,

  okButtonProps: Object as PropType<ButtonProps>,

  okType: { default: 'primary', type: String },

  open: { type: Boolean },

  /**
   * @description: Show close button
   */
  showCancelBtn: { default: true, type: Boolean },

  showContinueBtn: { default: false, type: Boolean },

  /**
   * @description: Show confirmation button
   */
  showOkBtn: { default: true, type: Boolean },

  title: { type: String },

  // Whether to setting wrapper
  useWrapper: { default: true, type: Boolean },

  width: {
    default: 600,
    type: [String, Number] as PropType<number | string>,
  },

  wrapClassName: { type: String },

  // After enabling the wrapper, the bottom can be increased in height
  wrapperFooterOffset: { default: -160, type: Number },

  wrapperProps: Object as PropType<Partial<ModalWrapperProps>>,

  zIndex: { type: Number },
});
