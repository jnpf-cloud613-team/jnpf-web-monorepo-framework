<script lang="ts">
import type { PropType } from 'vue';

import { defineComponent } from 'vue';

import { Spin } from 'ant-design-vue';

import { SizeEnum } from './typing';

export default defineComponent({
  components: { Spin },
  name: 'Loading',
  props: {
    absolute: {
      default: false,
      type: Boolean as PropType<boolean>,
    },
    background: {
      type: String as PropType<string>,
    },
    loading: {
      default: false,
      type: Boolean as PropType<boolean>,
    },
    size: {
      default: SizeEnum.LARGE,
      type: String as PropType<SizeEnum>,
      validator: (v: SizeEnum): boolean => {
        return [SizeEnum.DEFAULT, SizeEnum.LARGE, SizeEnum.SMALL].includes(v);
      },
    },
    theme: {
      type: String as PropType<'dark' | 'light'>,
    },
    tip: {
      default: '',
      type: String as PropType<string>,
    },
  },
});
</script>
<template>
  <section v-show="loading" :class="{ absolute }" :style="[background ? `background-color: ${background}` : '']" class="full-loading jnpf-loading">
    <Spin v-bind="$attrs" :size="size" :spinning="loading" :tip="tip" />
  </section>
</template>
<style lang="scss" scoped>
.full-loading {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: var(--modal-mask-bg);

  &.absolute {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 300;
  }
}
</style>
