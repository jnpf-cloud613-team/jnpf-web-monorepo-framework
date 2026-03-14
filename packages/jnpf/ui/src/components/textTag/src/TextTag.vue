<script lang="ts" setup>
import { computed } from 'vue';

defineOptions({ inheritAttrs: false, name: 'JnpfTextTag' });
const props = defineProps({
  align: { default: 'center', type: String },
  color: { default: '#1890ff', type: String },
  content: { default: '', type: String },
  showTag: { default: true, type: Boolean },
  showTextColor: { default: false, type: Boolean },
});

const getTagStyle = computed(() => ({ background: props.color }));
const getTextStyle = computed(() => ({ color: props.showTextColor ? props.color : '' }));
</script>

<template>
  <div :class="`jnpf-text-tag jnpf-text-tag-${align}`">
    <span v-if="showTag" :style="getTagStyle" class="tag"></span>
    <span :style="getTextStyle" class="text">{{ content }}</span>
  </div>
</template>
<style lang="scss" scoped>
.jnpf-text-tag {
  display: flex;
  align-items: center;

  &-left {
    justify-content: left !important;
  }

  &-center {
    justify-content: center;
  }

  &-right {
    justify-content: right !important;
  }

  .tag {
    width: 6px;
    height: 6px;
    margin-right: 4px;
    border-radius: 50%;
  }
}
</style>
