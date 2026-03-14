<script lang="ts" setup>
import type { FieldNames } from './props';

import { computed, ref, unref, watch } from 'vue';

import { useAttrs } from '@jnpf/hooks';

import { selectProps } from './props';

defineOptions({ inheritAttrs: false, name: 'JnpfSelect' });
const props = defineProps(selectProps);
const emit = defineEmits(['update:value', 'change']);
defineExpose({ getSelectRef });
const attrs = useAttrs({ excludeDefaultKeys: false });
const innerValue = ref('');
const selectRef = ref(null);

const getFieldNames = computed((): Required<FieldNames> => {
  const { fieldNames } = props;
  return {
    disabled: 'disabled',
    label: 'fullName',
    options: '',
    value: 'id',
    ...fieldNames,
  };
});
const getOptionFilterProp = computed(() => props.optionFilterProp || unref(getFieldNames).label);
const getBindValue = computed(() => ({
  ...unref(attrs),
  ...props,
  fieldNames: unref(getFieldNames),
  getPopupContainer: () => document.body,
  mode: props.multiple ? 'multiple' : '',
  optionFilterProp: unref(getOptionFilterProp),
  showArrow: Reflect.has(unref(attrs), 'showArrow') ? (unref(attrs) as { showArrow: boolean }).showArrow : true,
}));

watch(
  () => unref(props.value),
  (val) => {
    setValue(val);
  },
  { immediate: true },
);

function setValue(value) {
  innerValue.value = value || value === 0 ? value : undefined;
}
function onChange(val, option) {
  emit('update:value', val);
  emit('change', val, option);
}
function getSelectRef() {
  const select = unref(selectRef);
  if (!select) {
    throw new Error('select is null!');
  }
  return select;
}
</script>

<template>
  <a-select v-bind="getBindValue" ref="selectRef" v-model:value="innerValue" @change="onChange">
    <template v-for="item in Object.keys($slots)" #[item]="data"><slot :name="item" v-bind="data || {}"></slot></template>
  </a-select>
</template>
