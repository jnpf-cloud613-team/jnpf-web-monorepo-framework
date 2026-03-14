<script lang="ts" setup>
import { computed, unref } from 'vue';

import { useAttrs } from '@jnpf/hooks';

import { Button } from 'ant-design-vue';

import { buttonProps } from './props';

defineOptions({
  // @ts-ignore
  extends: Button,
  inheritAttrs: false,
  name: 'AButton',
});

const props: any = defineProps(buttonProps);
const attrs = useAttrs({ excludeDefaultKeys: false });

const getType = computed(() => {
  const { ghost, type } = props;
  if (!type) return 'default';
  if (['error', 'info', 'success', 'warning'].includes(type) && ghost) return 'default';
  return type;
});
const getButtonClass = computed(() => {
  const { color, disabled, ghost, type } = props;
  return [
    {
      [`ant-btn-${color}`]: !!color && type !== 'dashed' && !ghost,
      [`is-disabled`]: disabled,
    },
  ];
});
const getBindValue = computed(() => ({ ...unref(attrs), ...props, type: unref(getType) }));
</script>
<template>
  <Button v-bind="getBindValue" :class="getButtonClass" @click="onClick">
    <template v-if="$slots.icon || preIcon" #icon>
      <slot name="icon">
        <i :class="[preIcon]" class="button-preIcon"></i>
      </slot>
    </template>
    <template #default="data">
      <slot v-bind="data || {}"></slot>
      <i v-if="postIcon" :class="[postIcon]" class="button-postIcon"></i>
    </template>
  </Button>
</template>
<style lang="scss" scoped>
.ant-btn {
  .button-preIcon,
  .button-postIcon,
  i {
    font-size: 14px;
  }

  :deep(.button-preIcon + span),
  :deep(i + span) {
    margin-left: 5px;
  }

  .button-postIcon {
    margin-left: 5px;
  }
}
</style>
