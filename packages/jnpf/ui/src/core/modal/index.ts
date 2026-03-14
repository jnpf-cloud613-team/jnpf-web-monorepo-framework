import { withInstall } from '@jnpf/utils';

import basicModal from './src/BasicModal.vue';
import modalClose from './src/components/ModalClose.vue';
import modalFooter from './src/components/ModalFooter.vue';

import './src/index.scss';

export const BasicModal = withInstall(basicModal);
export const ModalClose = withInstall(modalClose);
export const ModalFooter = withInstall(modalFooter);
export { useModal, useModalInner } from './src/hooks/useModal';
export { useModalContext } from './src/hooks/useModalContext';
export { useFullScreen } from './src/hooks/useModalFullScreen';
export * from './src/typing';
