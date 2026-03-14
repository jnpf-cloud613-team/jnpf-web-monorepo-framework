import type { PropType } from 'vue';

import { propTypes } from '@jnpf/utils';

import { $t } from '@vben/locales';

export const headerProps = {
  cancelButtonProps: Object as PropType<Recordable>,
  cancelText: { default: () => $t('common.cancelText'), type: String },
  confirmLoading: { type: Boolean },
  continueButtonProps: Object as PropType<Recordable>,
  continueLoading: { type: Boolean },
  continueText: { default: () => $t('common.continueText'), type: String },
  continueType: { default: 'default', type: String },
  helpMessage: [String, Array] as PropType<string | string[]>,
  okButtonProps: Object as PropType<Recordable>,
  okText: { default: () => $t('common.okText'), type: String },
  okType: { default: 'primary', type: String },
  showBackIcon: { default: true, type: Boolean },
  /**
   * @description: Show close button
   */
  showCancelBtn: { default: true, type: Boolean },
  showContinueBtn: { default: false, type: Boolean },
  /**
   * @description: Show confirmation button
   */
  showOkBtn: { default: false, type: Boolean },
  title: { default: '', type: String },
};
export const basicProps = {
  closable: { default: true, type: Boolean },
  closeFunc: {
    default: null,
    type: [Function, Object] as PropType<any>,
  },
  closeIcon: propTypes.any,
  defaultFullscreen: { default: false, type: Boolean },
  destroyOnClose: { type: Boolean },
  getContainer: {
    type: [Object, String] as PropType<any>,
  },
  loading: { type: Boolean },
  loadingText: { type: String },
  open: { type: Boolean },
  width: propTypes.oneOfType([propTypes.string, propTypes.number]),
  zIndex: Number,
  ...headerProps,
};
