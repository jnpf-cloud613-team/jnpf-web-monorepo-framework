import type { ComputedRef } from 'vue';

import { computed, ref, unref } from 'vue';

import { useEventListener } from './useEventListener';

// 可以用这个替换，优化项
// import { Grid } from 'ant-design-vue';
// const { useBreakpoint } = Grid;

export enum sizeEnum {
  LG = 'LG',
  MD = 'MD',
  SM = 'SM',
  XL = 'XL',
  XS = 'XS',
  XXL = 'XXL',
}

export enum screenEnum {
  LG = 992,
  MD = 768,
  SM = 576,
  XL = 1200,
  XS = 480,
  XXL = 1600,
}

const screenMap = new Map<sizeEnum, number>();

screenMap.set(sizeEnum.XS, screenEnum.XS);
screenMap.set(sizeEnum.SM, screenEnum.SM);
screenMap.set(sizeEnum.MD, screenEnum.MD);
screenMap.set(sizeEnum.LG, screenEnum.LG);
screenMap.set(sizeEnum.XL, screenEnum.XL);
screenMap.set(sizeEnum.XXL, screenEnum.XXL);

let globalScreenRef: ComputedRef<sizeEnum | undefined>;
let globalWidthRef: ComputedRef<number>;
let globalRealWidthRef: ComputedRef<number>;

export interface CreateCallbackParams {
  realWidth: ComputedRef<number>;
  screen: ComputedRef<sizeEnum | undefined>;
  screenEnum: typeof screenEnum;
  screenMap: Map<sizeEnum, number>;
  sizeEnum: typeof sizeEnum;
  width: ComputedRef<number>;
}

export function useBreakpoint() {
  return {
    realWidthRef: globalRealWidthRef,
    screenEnum,
    screenRef: computed(() => unref(globalScreenRef)),
    widthRef: globalWidthRef,
  };
}

// Just call it once
export function createBreakpointListen(fn?: (opt: CreateCallbackParams) => void) {
  const screenRef = ref<sizeEnum>(sizeEnum.XL);
  const realWidthRef = ref(window.innerWidth);

  function getWindowWidth() {
    const width = document.body.clientWidth;
    const xs = screenMap.get(sizeEnum.XS)!;
    const sm = screenMap.get(sizeEnum.SM)!;
    const md = screenMap.get(sizeEnum.MD)!;
    const lg = screenMap.get(sizeEnum.LG)!;
    const xl = screenMap.get(sizeEnum.XL)!;
    if (width < xs) {
      screenRef.value = sizeEnum.XS;
    } else if (width < sm) {
      screenRef.value = sizeEnum.SM;
    } else if (width < md) {
      screenRef.value = sizeEnum.MD;
    } else if (width < lg) {
      screenRef.value = sizeEnum.LG;
    } else if (width < xl) {
      screenRef.value = sizeEnum.XL;
    } else {
      screenRef.value = sizeEnum.XXL;
    }
    realWidthRef.value = width;
  }

  useEventListener({
    el: window,
    name: 'resize',

    listener: () => {
      getWindowWidth();
      resizeFn();
    },
    // wait: 100,
  });

  getWindowWidth();
  globalScreenRef = computed(() => unref(screenRef));
  globalWidthRef = computed((): number => screenMap.get(unref(screenRef)!)!);
  globalRealWidthRef = computed((): number => unref(realWidthRef));

  function resizeFn() {
    fn?.({
      realWidth: globalRealWidthRef,
      screen: globalScreenRef,
      screenEnum,
      screenMap,
      sizeEnum,
      width: globalWidthRef,
    });
  }

  resizeFn();
  return {
    realWidthRef: globalRealWidthRef,
    screenEnum,
    screenRef: globalScreenRef,
    widthRef: globalWidthRef,
  };
}
