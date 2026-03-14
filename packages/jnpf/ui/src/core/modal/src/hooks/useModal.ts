import type { Nullable } from '@vben/types';
import type { Fn } from '@vben/types/global';

import type { ModalMethods, ModalProps, ReturnMethods, UseModalInnerReturnType, UseModalReturnType } from '../typing';

import { computed, getCurrentInstance, nextTick, onUnmounted, reactive, ref, toRaw, unref, watchEffect } from 'vue';

import { isFunction } from '@jnpf/utils';

import { useAppConfig } from '@vben/hooks';

import { tryOnUnmounted } from '@vueuse/core';
import { isEqual } from 'lodash-es';

const { isProdMode } = useAppConfig(import.meta.env, import.meta.env.PROD);

const dataTransfer = reactive<any>({});

const openData = reactive<{ [key: number]: boolean }>({});

/**
 * @description: Applicable to independent modal and call outside
 */
export function useModal(): UseModalReturnType {
  const modal = ref<Nullable<ModalMethods>>(null);
  const loaded = ref<Nullable<boolean>>(false);
  const uid = ref<string>('');

  function register(modalMethod: ModalMethods, uuid: string) {
    if (!getCurrentInstance()) {
      throw new Error('useModal() can only be used inside setup() or functional components!');
    }
    uid.value = uuid;
    isProdMode() &&
      onUnmounted(() => {
        modal.value = null;
        loaded.value = false;
        dataTransfer[unref(uid)] = null;
      });
    if (unref(loaded) && isProdMode() && modalMethod === unref(modal)) return;

    modal.value = modalMethod;
    loaded.value = true;
    modalMethod.emitOpen = (open: boolean, uid: number) => {
      openData[uid] = open;
    };
  }

  const getInstance = () => {
    const instance = unref(modal);
    if (!instance) {
      throw new Error('useModal instance is undefined!');
    }
    return instance;
  };

  const methods: ReturnMethods = {
    closeModal: () => {
      getInstance()?.setModalProps({ open: false });
    },

    getOpen: computed((): boolean => {
      return openData[Math.trunc(unref(uid) as any)] || false;
    }),

    openModal: <T = any>(open = true, data?: T, openOnSet = true): void => {
      getInstance()?.setModalProps({
        confirmLoading: false,
        open,
      });

      if (!data) return;
      const id = unref(uid);
      if (openOnSet) {
        dataTransfer[id] = null;
        dataTransfer[id] = toRaw(data);
        return;
      }
      const equal = isEqual(toRaw(dataTransfer[id]), toRaw(data));
      if (!equal) {
        dataTransfer[id] = toRaw(data);
      }
    },

    redoModalHeight: () => {
      getInstance()?.redoModalHeight?.();
    },

    setModalProps: (props: Partial<ModalProps>): void => {
      getInstance()?.setModalProps(props);
    },
  };
  return [register, methods];
}

export const useModalInner = (callbackFn?: Fn): UseModalInnerReturnType => {
  const modalInstanceRef = ref<Nullable<ModalMethods>>(null);
  const currentInstance = getCurrentInstance();
  const uidRef = ref<string>('');

  const getInstance = () => {
    const instance = unref(modalInstanceRef);
    if (!instance) {
      throw new Error('useModalInner instance is undefined!');
    }
    return instance;
  };

  const register = (modalInstance: ModalMethods, uuid: string) => {
    isProdMode() &&
      tryOnUnmounted(() => {
        modalInstanceRef.value = null;
      });
    uidRef.value = uuid;
    modalInstanceRef.value = modalInstance;
    currentInstance?.emit('register', modalInstance, uuid);
  };

  watchEffect(() => {
    const data = dataTransfer[unref(uidRef)];
    if (!data) return;
    if (!callbackFn || !isFunction(callbackFn)) return;
    nextTick(() => {
      callbackFn(data);
    });
  });

  return [
    register,
    {
      changeContinueLoading: (loading = true) => {
        getInstance()?.setModalProps({ continueLoading: loading });
      },
      changeLoading: (loading = true) => {
        getInstance()?.setModalProps({ loading });
      },

      changeOkLoading: (loading = true) => {
        getInstance()?.setModalProps({ confirmLoading: loading });
      },

      closeModal: () => {
        getInstance()?.setModalProps({ open: false });
      },

      getOpen: computed((): boolean => {
        return openData[Math.trunc(unref(uidRef) as any)] || false;
      }),

      redoModalHeight: () => {
        const callRedo = getInstance()?.redoModalHeight;
        callRedo && callRedo();
      },

      setModalProps: (props: Partial<ModalProps>) => {
        getInstance()?.setModalProps(props);
      },
    },
  ];
};
