<script lang="ts" setup>
import { computed, unref } from 'vue';

import { useAttrs } from '@jnpf/hooks';

import { Cascader } from 'ant-design-vue';

export interface FieldNames {
  children?: string;
  label?: string;
  value?: string;
}

defineOptions({ inheritAttrs: false, name: 'JnpfCascader' });
const props = defineProps({
  fieldNames: {
    default: () => ({ label: 'fullName', value: 'id', children: 'children' }),
    type: Object as PropType<FieldNames>,
  },
});
const attrs = useAttrs({ excludeDefaultKeys: false });

const getFieldNames = computed((): Required<FieldNames> => {
  const { fieldNames } = props;
  return {
    label: 'fullName',
    value: 'id',
    children: 'children',
    ...fieldNames,
  };
});
const getBindValue = computed(() => ({ ...unref(attrs), fieldNames: unref(getFieldNames), showCheckedStrategy: Cascader.SHOW_CHILD }));
</script>

<template>
  <Cascader v-bind="getBindValue">
    <template v-for="item in Object.keys($slots)" #[item]="data"><slot :name="item" v-bind="data || {}"></slot></template>
  </Cascader>
</template>
