<script lang="ts" setup>
import type { FieldNames } from './props';

import { computed, ref, unref, watch } from 'vue';

import { useAttrs } from '@jnpf/hooks';

import { Checkbox, CheckboxGroup } from 'ant-design-vue';

import { checkboxProps } from './props';

defineOptions({ inheritAttrs: false, name: 'JnpfCheckbox' });
const props = defineProps(checkboxProps);
const emit = defineEmits(['update:value', 'change']);
const attrs: any = useAttrs({ excludeDefaultKeys: false });
const innerValue = ref([]);

const getBindValue = computed(() => ({
  ...unref(attrs),
  class: unref(attrs).class ? `jnpf-${props.direction}-checkbox ${unref(attrs).class}` : `jnpf-${props.direction}-checkbox`,
}));
const getOptions = computed<any[]>(() => props.options);
const getFieldNames = computed((): Required<FieldNames> => {
  const { fieldNames } = props;
  return {
    disabled: 'disabled',
    label: 'fullName',
    value: 'id',
    ...fieldNames,
  };
});

watch(
  () => unref(props.value),
  (val) => {
    setValue(val);
  },
  { immediate: true },
);

function setValue(value) {
  innerValue.value = value;
}
function onChange(val) {
  let list: any[] = [];
  for (const element of val) {
    const item = unref(getOptions).filter((o) => o[unref(getFieldNames).value] === element);
    list = [...list, ...item];
  }
  emit('update:value', val);
  emit('change', val, list);
}
</script>

<template>
  <CheckboxGroup button-style="solid" v-bind="getBindValue" v-model:value="innerValue" @change="onChange">
    <Checkbox v-for="item in getOptions" :key="item[getFieldNames.value]" :disabled="item[getFieldNames.disabled]" :value="item[getFieldNames.value]">
      {{ item[getFieldNames.label] }}
    </Checkbox>
  </CheckboxGroup>
</template>
<style lang="scss">
.jnpf-vertical-checkbox {
  .ant-checkbox-wrapper {
    width: 100%;
  }
}
</style>
