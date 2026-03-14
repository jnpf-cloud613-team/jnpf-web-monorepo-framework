<script lang="ts" setup>
import type { PropType } from 'vue';

import { computed, useSlots } from 'vue';

import BasicHelp from './BasicHelp.vue';

const props = defineProps({
  /**
   * Help text list or string
   * @default: ''
   */
  helpMessage: {
    default: '',
    type: [String, Array] as PropType<string | string[]>,
  },
  /**
   * Whether to default the text, that is, not bold
   * @default: false
   */
  normal: { default: false, type: Boolean },
  signed: { default: false, type: Boolean },
  /**
   * Whether the color block on the left side of the title
   * @default: false
   */
  span: { default: false, type: Boolean },
});

const slots = useSlots();
const getClass = computed(() => [
  'jnpf-basic-title',
  { [`jnpf-basic-title-show-span`]: props.span && slots.default },
  { [`jnpf-basic-title-normal`]: props.normal },
  { [`jnpf-basic-title-signed`]: props.signed },
]);
</script>
<template>
  <span :class="getClass">
    <slot></slot>
    <BasicHelp v-if="helpMessage" :text="helpMessage" class="jnpf-basic-title-help" />
  </span>
</template>
<style lang="scss" scoped>
.jnpf-basic-title {
  position: relative;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: var(--text-color-base);
  user-select: none;

  &-normal {
    font-size: 14px;
    font-weight: 500;
  }

  &-signed {
    padding-left: 10px;

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      width: 4px;
      height: 100%;
      overflow: hidden;
      content: '';
      background-color: var(--primary-color);
    }
  }

  &-show-span {
    padding-left: 7px;

    &::before {
      position: absolute;
      top: 4px;
      left: 0;
      width: 3px;
      height: 16px;
      margin-right: 4px;
      content: '';
      background-color: var(--primary-color);
    }
  }

  :deep(&-help) {
    display: flex;
    align-items: center;
  }
}
</style>
