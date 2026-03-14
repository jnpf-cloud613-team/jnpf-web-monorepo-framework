<script lang="ts" setup>
import { computed, ref, unref, watch } from 'vue';

import { useAttrs } from '@jnpf/hooks';

import { Checkbox } from 'ant-design-vue';
import { omit } from 'lodash-es';

defineOptions({ inheritAttrs: false, name: 'JnpfCheckboxSingle' });
const props = defineProps({
  checkedValue: { default: 1, type: [Number, Boolean, String] },
  label: { default: '', type: String },
  unCheckedValue: { default: 0, type: [Number, Boolean, String] },
  value: { type: [Number, Boolean, String] },
});
const emit = defineEmits(['update:value', 'change']);
const attrs = useAttrs({ excludeDefaultKeys: false });
const innerValue = ref(false);

const getBindValue = computed(() => ({ ...unref(attrs), ...omit(props, ['value']) }));

watch(
  () => unref(props.value),
  (val) => {
    setValue(val);
  },
  { immediate: true },
);

function setValue(value) {
  innerValue.value = value === props.checkedValue;
}
function onChange(e) {
  const value = e.target.checked ? props.checkedValue : props.unCheckedValue;
  emit('update:value', value);
  emit('change', value);
}
</script>

<template>
  <Checkbox v-model:checked="innerValue" v-bind="getBindValue" @change="onChange">
    <slot>{{ label }}</slot>
  </Checkbox>
</template>
