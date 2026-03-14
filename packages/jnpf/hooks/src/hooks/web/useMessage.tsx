import type { ModalFunc, ModalFuncProps } from 'ant-design-vue/lib/modal/Modal';
import type { ConfigProps, NotificationArgsProps } from 'ant-design-vue/lib/notification';

import { isString } from '@jnpf/utils';

import { $t } from '@vben/locales';

import { CheckCircleFilled, CloseCircleFilled, InfoCircleFilled } from '@ant-design/icons-vue';
import { message as Message, Modal, notification } from 'ant-design-vue';

export interface NotifyApi {
  close(key: string): void;
  config(options: ConfigProps): void;
  destroy(): void;
  error(config: NotificationArgsProps): void;
  info(config: NotificationArgsProps): void;
  open(args: NotificationArgsProps): void;
  success(config: NotificationArgsProps): void;
  warn(config: NotificationArgsProps): void;
  warning(config: NotificationArgsProps): void;
}

export declare type NotificationPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
export declare type IconType = 'error' | 'info' | 'success' | 'warning';
export interface ModalOptionsEx extends Omit<ModalFuncProps, 'iconType'> {
  iconType: 'error' | 'info' | 'success' | 'warning';
}
export type ModalOptionsPartial = Partial<ModalOptionsEx> & Pick<ModalOptionsEx, 'content'>;

interface ConfirmOptions {
  error: ModalFunc;
  info: ModalFunc;
  success: ModalFunc;
  warn: ModalFunc;
  warning: ModalFunc;
}

function getIcon(iconType: string) {
  switch (iconType) {
    case 'info': {
      return <InfoCircleFilled class="modal-icon-info" />;
    }
    case 'success': {
      return <CheckCircleFilled class="modal-icon-success" />;
    }
    case 'warning': {
      return <InfoCircleFilled class="modal-icon-warning" />;
    }
    default: {
      return <CloseCircleFilled class="modal-icon-error" />;
    }
  }
}

function renderContent({ content }: Pick<ModalOptionsEx, 'content'>) {
  return isString(content) ? <div innerHTML={`<div>${content as string}</div>`}></div> : content;
}

/**
 * @description: Create confirmation box
 */
function createConfirm(options: ModalOptionsEx): ConfirmOptions {
  const iconType = options.iconType || 'warning';
  Reflect.deleteProperty(options, 'iconType');
  const opt: ModalFuncProps = {
    centered: true,
    icon: getIcon(iconType),
    ...options,
    content: renderContent(options),
  };
  return Modal.confirm(opt) as unknown as ConfirmOptions;
}

const getBaseOptions = () => {
  return {
    centered: true,
    okText: $t('common.okText'),
  };
};

function createModalOptions(options: ModalOptionsPartial, icon: string): ModalOptionsPartial {
  return {
    ...getBaseOptions(),
    ...options,
    content: renderContent(options),
    icon: getIcon(icon),
  };
}

function createSuccessModal(options: ModalOptionsPartial) {
  return Modal.success(createModalOptions(options, 'success'));
}

function createErrorModal(options: ModalOptionsPartial) {
  return Modal.error(createModalOptions(options, 'error'));
}

function createInfoModal(options: ModalOptionsPartial) {
  return Modal.info(createModalOptions(options, 'info'));
}

function createWarningModal(options: ModalOptionsPartial) {
  return Modal.warning(createModalOptions(options, 'warning'));
}

Message.config({
  duration: 1.5,
  maxCount: 3,
});

notification.config({
  duration: 3,
  placement: 'topRight',
});

/**
 * @description: message
 */
export function useMessage() {
  return {
    createConfirm,
    createErrorModal,
    createInfoModal,
    createMessage: Message,
    createSuccessModal,
    createWarningModal,
    notification: notification as NotifyApi,
  };
}
