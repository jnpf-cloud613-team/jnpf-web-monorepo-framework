import type { DrawerInstance, DrawerProps, DrawerReturnMethods, UseDrawerInnerReturnType, UseDrawerReturnType } from './typing';

import { computed, getCurrentInstance, nextTick, reactive, ref, toRaw, unref, watchEffect } from 'vue';

import { isFunction } from '@jnpf/utils';

import { useAppConfig } from '@vben/hooks';

import { tryOnUnmounted } from '@vueuse/core';
import { isEqual } from 'lodash-es';

const { isProdMode } = useAppConfig(import.meta.env, import.meta.env.PROD);

const dataTransferRef = reactive<any>({});

const openData = reactive<{ [key: number]: boolean }>({});

/**
 * @description: Applicable to separate drawer and call outside
 */
export function useDrawer(): UseDrawerReturnType {
  if (!getCurrentInstance()) {
    throw new Error('useDrawer() can only be used inside setup() or functional components!');
  }
  const drawer = ref<DrawerInstance | null>(null);
  const loaded = ref<Nullable<boolean>>(false);
  const uid = ref<string>('');

  function register(drawerInstance: DrawerInstance, uuid: string) {
    isProdMode() &&
      tryOnUnmounted(() => {
        drawer.value = null;
        loaded.value = null;
        dataTransferRef[unref(uid)] = null;
      });

    if (unref(loaded) && isProdMode() && drawerInstance === unref(drawer)) {
      return;
    }
    uid.value = uuid;
    drawer.value = drawerInstance;
    loaded.value = true;

    drawerInstance.emitOpen = (open: boolean, uid: number) => {
      openData[uid] = open;
    };
  }

  const getInstance = () => {
    const instance = unref(drawer);
    if (!instance) {
      throw new Error('useDrawer instance is undefined!');
    }
    return instance;
  };

  const methods: DrawerReturnMethods = {
    closeDrawer: () => {
      getInstance()?.setDrawerProps({ open: false });
    },

    getOpen: computed((): boolean => {
      return openData[Math.trunc(unref(uid) as any)] || false;
    }),

    openDrawer: <T = any>(open = true, data?: T, openOnSet = true): void => {
      getInstance()?.setDrawerProps({
        open,
      });
      if (!data) return;

      if (openOnSet) {
        dataTransferRef[unref(uid)] = null;
        dataTransferRef[unref(uid)] = toRaw(data);
        return;
      }
      const equal = isEqual(toRaw(dataTransferRef[unref(uid)]), toRaw(data));
      if (!equal) {
        dataTransferRef[unref(uid)] = toRaw(data);
      }
    },
    setDrawerProps: (props: Partial<DrawerProps>): void => {
      getInstance()?.setDrawerProps(props);
    },
  };

  return [register, methods];
}

export const useDrawerInner = (callbackFn?: Fn): UseDrawerInnerReturnType => {
  const drawerInstanceRef = ref<Nullable<DrawerInstance>>(null);
  const currentInstance = getCurrentInstance();
  const uidRef = ref<string>('');

  if (!getCurrentInstance()) {
    throw new Error('useDrawerInner() can only be used inside setup() or functional components!');
  }

  const getInstance = () => {
    const instance = unref(drawerInstanceRef);
    if (!instance) {
      throw new Error('useDrawerInner instance is undefined!');
    }
    return instance;
  };

  const register = (drawerInstance: DrawerInstance, uuid: string) => {
    isProdMode() &&
      tryOnUnmounted(() => {
        drawerInstanceRef.value = null;
      });

    uidRef.value = uuid;
    drawerInstanceRef.value = drawerInstance;
    currentInstance?.emit('register', drawerInstance, uuid);
  };

  watchEffect(() => {
    const data = dataTransferRef[unref(uidRef)];
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
        getInstance()?.setDrawerProps({ continueLoading: loading });
      },

      changeLoading: (loading = true) => {
        getInstance()?.setDrawerProps({ loading });
      },

      changeOkLoading: (loading = true) => {
        getInstance()?.setDrawerProps({ confirmLoading: loading });
      },

      closeDrawer: () => {
        getInstance()?.setDrawerProps({ open: false });
      },

      getOpen: computed((): boolean => {
        return openData[Math.trunc(unref(uidRef) as any)] || false;
      }),

      setDrawerProps: (props: Partial<DrawerProps>) => {
        getInstance()?.setDrawerProps(props);
      },
    },
  ];
};
