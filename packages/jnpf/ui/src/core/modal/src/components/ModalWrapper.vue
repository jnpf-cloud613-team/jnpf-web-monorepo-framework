<script lang="ts">
import type { CSSProperties } from 'vue';

import type { ComponentRef, ElRef } from '@vben/types/global';

import { computed, defineComponent, nextTick, onMounted, onUnmounted, ref, unref, watch, watchEffect } from 'vue';

import { useWindowSizeFn } from '@jnpf/hooks';

import { useMutationObserver } from '@vueuse/core';

import { ScrollContainer } from '../../../index';
import { createModalContext } from '../hooks/useModalContext';

const props = {
  footerOffset: { default: 0, type: Number },
  fullScreen: { type: Boolean },
  height: { type: Number },
  loading: { type: Boolean },
  loadingTip: { type: String },
  minHeight: { default: 50, type: Number },
  modalFooterHeight: { default: 74, type: Number },
  modalHeaderHeight: { default: 57, type: Number },
  open: { type: Boolean },
  useWrapper: { default: true, type: Boolean },
};

export default defineComponent({
  components: { ScrollContainer },
  emits: ['heightChange', 'extHeight'],
  inheritAttrs: false,
  name: 'ModalWrapper',
  props,
  setup(props, { emit }) {
    const wrapperRef = ref<ComponentRef>(null);
    const spinRef = ref<ElRef>(null);
    const realHeightRef = ref(0);
    const minRealHeightRef = ref(0);

    let realHeight = 0;

    const stopElResizeFn: Fn = () => {};

    useWindowSizeFn(setModalHeight.bind(null) as any);

    useMutationObserver(
      spinRef,
      () => {
        setModalHeight();
      },
      {
        attributes: true,
        childList: true,
        subtree: true,
      },
    );

    createModalContext({
      redoModalHeight: setModalHeight,
    });

    const spinStyle = computed((): CSSProperties => {
      return {
        minHeight: `${props.minHeight}px`,
        [props.fullScreen ? 'height' : 'maxHeight']: `${unref(realHeightRef)}px`,
      };
    });

    watchEffect(() => {
      props.useWrapper && setModalHeight();
    });

    watch(
      () => props.fullScreen,
      (v) => {
        setModalHeight();
        if (v) {
          minRealHeightRef.value = realHeightRef.value;
        } else {
          realHeightRef.value = minRealHeightRef.value;
        }
      },
    );

    onMounted(() => {
      const { modalFooterHeight, modalHeaderHeight } = props;
      emit('extHeight', modalHeaderHeight + modalFooterHeight);
    });

    onUnmounted(() => {
      stopElResizeFn && stopElResizeFn();
    });

    async function scrollTop() {
      nextTick(() => {
        const wrapperRefDom = unref(wrapperRef);
        if (!wrapperRefDom) return;
        (wrapperRefDom as any)?.scrollTo?.(0);
      });
    }

    async function setModalHeight() {
      // 解决在弹窗关闭的时候监听还存在,导致再次打开弹窗没有高度
      // 加上这个,就必须在使用的时候传递父级的open
      if (!props.open) return;
      const wrapperRefDom = unref(wrapperRef);
      if (!wrapperRefDom) return;

      const bodyDom = wrapperRefDom.$el.parentElement;
      if (!bodyDom) return;
      bodyDom.style.padding = '0';
      await nextTick();

      try {
        const modalDom = bodyDom.parentElement && bodyDom.parentElement.parentElement && bodyDom.parentElement.parentElement.parentElement;
        if (!modalDom) return;

        const modalRect = getComputedStyle(modalDom as Element).top;
        const modalTop = Number.parseInt(modalRect);
        let maxHeight = window.innerHeight - modalTop * 2 + (props.footerOffset! || 0) - props.modalFooterHeight - props.modalHeaderHeight;
        // 距离顶部过进会出现滚动条
        if (modalTop < 40) {
          maxHeight -= 26;
        }
        await nextTick();
        const spinEl = unref(spinRef);

        if (!spinEl) return;
        await nextTick();
        // if (!realHeight) {
        realHeight = spinEl.scrollHeight;
        // }

        if (props.fullScreen) {
          realHeightRef.value = window.innerHeight - props.modalFooterHeight - props.modalHeaderHeight - 28;
        } else {
          realHeightRef.value = props.height ? props.height : Math.min(realHeight, maxHeight);
        }
        emit('heightChange', unref(realHeightRef));
      } catch {}
    }

    return { scrollTop, setModalHeight, spinRef, spinStyle, wrapperRef };
  },
});
</script>
<template>
  <ScrollContainer ref="wrapperRef">
    <div ref="spinRef" :loading-tip="loadingTip" :style="spinStyle" v-loading="loading">
      <slot></slot>
    </div>
  </ScrollContainer>
</template>
