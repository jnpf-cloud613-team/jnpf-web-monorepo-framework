<script lang="ts" setup>
import { useGo } from '@jnpf/hooks';
import { encryptByBase64 } from '@jnpf/utils';

import { linkProps } from './props';

defineOptions({ inheritAttrs: false, name: 'JnpfLink' });
const props = defineProps(linkProps);
const emit = defineEmits(['click']);
const go = useGo();

function onClick(e) {
  emit('click', e);
  if (!props.href) return;
  if (props.target === '_self') {
    go(`/externalLink?href=${encryptByBase64(props.href)}`);
  } else if (props.target === '_blank') {
    window.open(props.href, props.target);
  }
}
</script>

<template>
  <p :style="textStyle" class="jnpf-link">
    <span class="jnpf-link--inner" @click="onClick">{{ content }}</span>
  </p>
</template>
<style lang="scss" scoped>
.jnpf-link {
  margin: 0;
  font-size: 14px;
  line-height: 32px;
  color: var(--primary-color);

  & &--inner {
    word-break: break-all;
    cursor: pointer;
  }
}
</style>
