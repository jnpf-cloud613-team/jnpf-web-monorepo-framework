<script lang="ts" setup>
import { computed, ref, unref } from 'vue';

import { useAttrs } from '@jnpf/hooks';

import { Empty } from 'ant-design-vue';

defineOptions({ inheritAttrs: false, name: 'JnpfEmpty' });

const props = defineProps({
  image: { default: null, type: [String, Boolean, Object] },
});

const attrs = useAttrs({ excludeDefaultKeys: false });
const defaultImage = ref(Empty.PRESENTED_IMAGE_SIMPLE);

const getBindValue: any = computed(() => ({ ...unref(attrs), image: props.image || props.image === false ? props.image : unref(defaultImage) }));
</script>

<template>
  <Empty v-bind="getBindValue">
    <template v-for="item in Object.keys($slots)" #[item]="data"><slot :name="item" v-bind="data || {}"></slot></template>
  </Empty>
</template>
