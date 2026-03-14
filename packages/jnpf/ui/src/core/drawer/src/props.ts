import type { PropType } from 'vue';

import { $t } from '@vben/locales';

export const footerProps = {
  cancelButtonProps: Object as PropType<Recordable>,
  cancelText: { default: () => $t('common.cancelText'), type: String },
  confirmLoading: { type: Boolean },
  continueButtonProps: Object as PropType<Recordable>,
  continueLoading: { type: Boolean },
  continueText: { default: () => $t('common.continueText'), type: String },
  continueType: { default: 'default', type: String },
  footerHeight: {
    default: 60,
    type: [String, Number] as PropType<number | string>,
  },
  okButtonProps: Object as PropType<Recordable>,
  okText: { default: () => $t('common.okText'), type: String },
  okType: { default: 'primary', type: String },
  /**
   * @description: Show close button
   */
  showCancelBtn: { default: true, type: Boolean },
  showContinueBtn: { default: false, type: Boolean },
  showFooter: { type: Boolean },
  /**
   * @description: Show confirmation button
   */
  showOkBtn: { default: true, type: Boolean },
};
export const basicProps = {
  closeFunc: {
    default: null,
    type: [Function, Object] as PropType<any>,
  },
  destroyOnClose: { type: Boolean },
  getContainer: {
    type: [Object, String] as PropType<any>,
  },
  isDetail: { type: Boolean },
  keyboard: { default: false, type: Boolean },
  loading: { type: Boolean },
  loadingText: { type: String },
  maskClosable: { default: true, type: Boolean },
  open: { type: Boolean },
  showDetailBack: { default: true, type: Boolean },
  title: { default: '', type: String },
  ...footerProps,
};
