<script lang="ts" setup>
import { computed, unref } from 'vue';

import { useAttrs } from '@jnpf/hooks';

import { Divider } from 'ant-design-vue';

defineOptions({ inheritAttrs: false, name: 'JnpfDivider' });
defineProps({
  content: {
    default: '',
    type: String,
  },
  contentPosition: {
    default: 'left',
    type: String as PropType<'center' | 'left' | 'right'>,
  },
});
const attrs = useAttrs({ excludeDefaultKeys: false });

const getBindValue = computed(() => ({ ...unref(attrs) }));
</script>

<template>
  <Divider :orientation="contentPosition" v-bind="getBindValue">{{ content }}</Divider>
</template>
