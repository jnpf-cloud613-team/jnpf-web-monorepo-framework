<script lang="ts">
import type { PropType } from 'vue';

import { defineComponent, onMounted, reactive, ref, toRef, toRefs } from 'vue';

import { useIntersectionObserver } from '@jnpf/hooks';

import { useTimeoutFn } from '@vueuse/core';
import { Skeleton } from 'ant-design-vue';

interface State {
  intersectionObserverInstance: IntersectionObserver | null;
  isInit: boolean;
  loading: boolean;
}

const props = {
  /**
   * The scroll direction of the viewport, vertical represents the vertical direction, horizontal represents the horizontal direction
   */
  direction: {
    default: 'vertical',
    type: String,
    validator: (v) => ['horizontal', 'vertical'].includes(v),
  },
  maxWaitingTime: { default: 80, type: Number },
  /**
   * The label name of the outer container that wraps the component
   */
  tag: { default: 'div', type: String },
  /**
   * Preload threshold, css unit
   */
  threshold: { default: '0px', type: String },
  /**
   * Waiting time, if the time is specified, whether visible or not, it will be automatically loaded after the specified time
   */
  timeout: { type: Number },
  /**
   * transition name
   */
  transitionName: { default: 'lazy-container', type: String },
  /**
   * The viewport where the component is located.
   * If the component is scrolling in the page container, the viewport is the container
   */
  viewport: {
    default: () => null,
    type: (typeof window === 'undefined' ? Object : window.HTMLElement) as PropType<HTMLElement>,
  },
};

export default defineComponent({
  components: { Skeleton },
  emits: ['init'],
  inheritAttrs: false,
  name: 'LazyContainer',
  props,
  setup(props, { emit }) {
    const elRef = ref();
    const state = reactive<State>({
      intersectionObserverInstance: null,
      isInit: false,
      loading: false,
    });

    onMounted(() => {
      immediateInit();
      initIntersectionObserver();
    });

    // If there is a set delay time, it will be executed immediately
    function immediateInit() {
      const { timeout } = props;
      timeout &&
        useTimeoutFn(() => {
          init();
        }, timeout);
    }

    function init() {
      state.loading = true;

      useTimeoutFn(() => {
        if (state.isInit) return;
        state.isInit = true;
        emit('init');
      }, props.maxWaitingTime || 80);
    }

    function initIntersectionObserver() {
      const { direction, threshold, timeout } = props;
      if (timeout) return;
      // According to the scrolling direction to construct the viewport margin, used to load in advance
      let rootMargin = '0px';
      switch (direction) {
        case 'horizontal': {
          rootMargin = `0px ${threshold}`;
          break;
        }
        case 'vertical': {
          rootMargin = `${threshold} 0px`;
          break;
        }
      }

      try {
        const { observer, stop } = useIntersectionObserver({
          onIntersect: (entries: any[]) => {
            const isIntersecting = entries[0].isIntersecting || entries[0].intersectionRatio;
            if (isIntersecting) {
              init();
              if (observer) {
                stop();
              }
            }
          },
          root: toRef(props, 'viewport'),
          rootMargin,
          target: toRef(elRef.value, '$el'),
        });
      } catch {
        init();
      }
    }
    return {
      elRef,
      ...toRefs(state),
    };
  },
});
</script>
<template>
  <transition-group class="h-full w-full" v-bind="$attrs" ref="elRef" :name="transitionName" :tag="tag" mode="out-in">
    <div v-if="isInit" key="component">
      <slot :loading="loading"></slot>
    </div>
    <div v-else key="skeleton">
      <slot v-if="$slots.skeleton" name="skeleton"></slot>
      <Skeleton v-else />
    </div>
  </transition-group>
</template>
