<script lang="ts" setup>
import { computed } from 'vue';

defineOptions({ inheritAttrs: false, name: 'JnpfText' });
const props = defineProps({
  content: { default: '', type: String },
  textStyle: {
    default: () => ({
      // 'font-size': ' 12px',
      // "color": '#00000',
      // 'text-align': 'center',
      // 'line-height': '32px',
      // 'font-weight': 'normal',
      // 'font-style': 'normal',
      // 'text-decoration': 'none',
    }),
    type: Object,
  },
});

const getStyle = computed(() => ({
  ...props.textStyle,
  'font-size': `${props.textStyle['font-size']}px`,
  'line-height': `${props.textStyle['line-height']}px`,
}));
</script>

<template>
  <p :style="getStyle" class="jnpf-text">{{ content }}</p>
</template>
<style lang="scss" scoped>
.jnpf-text {
  padding: 3px 0;
  margin: 0;
}
</style>
