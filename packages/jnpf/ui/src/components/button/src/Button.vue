<script lang="ts" setup>
import { computed, unref } from 'vue';

import { useAttrs } from '@jnpf/hooks';

import { omit } from 'lodash-es';

import { buttonProps } from './props';

defineOptions({ inheritAttrs: false, name: 'JnpfButton' });
const props = defineProps(buttonProps);
const attrs = useAttrs({ excludeDefaultKeys: false });
const getBindValue = computed(() => omit({ ...unref(attrs), ...props }, ['align', 'buttonText']));
</script>

<template>
  <div :class="`jnpf-button jnpf-button-${align}`">
    <a-button v-bind="getBindValue">{{ buttonText }}</a-button>
  </div>
</template>
<style lang="scss" scoped>
.jnpf-button {
  width: 100%;

  &-left {
    text-align: left;
  }

  &-center {
    text-align: center;
  }

  &-right {
    text-align: right;
  }
}
</style>
