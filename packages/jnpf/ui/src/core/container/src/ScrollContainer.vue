<script lang="ts">
import type { ScrollbarType } from '../../scrollbar';

import { defineComponent, nextTick, ref, unref } from 'vue';

import { useScrollTo } from '@jnpf/hooks';

import { Scrollbar } from '../../scrollbar';

export default defineComponent({
  components: { Scrollbar },
  name: 'ScrollContainer',
  setup() {
    const scrollbarRef = ref<Nullable<ScrollbarType>>(null);

    /**
     * Scroll to the specified position
     */
    function scrollTo(to: number, duration = 500) {
      const scrollbar = unref(scrollbarRef);
      if (!scrollbar) {
        return;
      }
      nextTick(() => {
        const wrap = unref(scrollbar.wrap);
        if (!wrap) {
          return;
        }
        const { start } = useScrollTo({
          duration,
          el: wrap,
          to,
        });
        start();
      });
    }

    function getScrollWrap() {
      const scrollbar = unref(scrollbarRef);
      if (!scrollbar) {
        return null;
      }
      return scrollbar.wrap;
    }

    /**
     * Scroll to the bottom
     */
    function scrollBottom() {
      const scrollbar = unref(scrollbarRef);
      if (!scrollbar) {
        return;
      }
      nextTick(() => {
        const wrap = unref(scrollbar.wrap) as any;
        if (!wrap) {
          return;
        }
        const scrollHeight = wrap.scrollHeight as number;
        const { start } = useScrollTo({
          el: wrap,
          to: scrollHeight,
        });
        start();
      });
    }

    return {
      getScrollWrap,
      scrollbarRef,
      scrollBottom,
      scrollTo,
    };
  },
});
</script>

<template>
  <Scrollbar ref="scrollbarRef" class="scroll-container" v-bind="$attrs">
    <slot></slot>
  </Scrollbar>
</template>
<style lang="scss">
.scroll-container {
  width: 100%;
  height: 100%;

  .scrollbar__wrap {
    margin-bottom: 18px !important;
    overflow-x: hidden;
  }

  .scrollbar__view {
    box-sizing: border-box;
  }
}
</style>
