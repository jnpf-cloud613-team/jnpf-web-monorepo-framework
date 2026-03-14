<script lang="ts" setup>
import { computed, ref, unref, watch } from 'vue';

import { useAttrs } from '@jnpf/hooks';

import { Switch } from 'ant-design-vue';
import { omit } from 'lodash-es';

import { switchProps } from './props';

defineOptions({ inheritAttrs: false, name: 'JnpfSwitch' });
const props = defineProps(switchProps);
const emit = defineEmits(['update:value', 'change']);
const attrs = useAttrs({ excludeDefaultKeys: false });
const innerValue = ref<any>(undefined);

const getBindValue = computed(() => ({ ...unref(attrs), ...omit(props, ['value']) }));

watch(
  () => unref(props.value),
  (val) => {
    setValue(val);
  },
  { immediate: true },
);

function setValue(value) {
  innerValue.value = value ? props.checkedValue : props.unCheckedValue;
  emit('update:value', innerValue.value);
}
function onChange(value) {
  emit('update:value', value);
  emit('change', value);
}
</script>

<template>
  <Switch v-bind="getBindValue" v-model:checked="innerValue" @change="onChange">
    <template v-for="item in Object.keys($slots)" #[item]="data">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </Switch>
</template>
