<script lang="ts" setup>
import { computed, ref, unref, watch } from 'vue';

import { useAttrs } from '@jnpf/hooks';

import { Input } from 'ant-design-vue';

import { textareaProps } from './props';

defineOptions({ inheritAttrs: false, name: 'JnpfTextarea' });
const props = defineProps(textareaProps);
const emit = defineEmits(['update:value', 'change']);
const InputTextArea = Input.TextArea;
const attrs = useAttrs({ excludeDefaultKeys: false });
const innerValue = ref('');

const getBindValue = computed(() => ({ ...unref(attrs), rows: props.rows }));

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
function onChange(e) {
  emit('update:value', e.target.value);
  emit('change', e.target.value);
}
</script>

<template>
  <InputTextArea v-bind="getBindValue" v-model:value="innerValue" @change="onChange">
    <template v-for="item in Object.keys($slots)" #[item]="data"><slot :name="item" v-bind="data || {}"></slot></template>
  </InputTextArea>
</template>
