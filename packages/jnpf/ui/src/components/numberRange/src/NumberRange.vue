<script lang="ts" setup>
import { computed, ref, unref, watch } from 'vue';

import { useAttrs } from '@jnpf/hooks';

import { $t } from '@vben/locales';

import { Form, InputNumber } from 'ant-design-vue';

defineOptions({ inheritAttrs: false, name: 'JnpfNumberRange' });
const props = defineProps({
  precision: Number,
  value: Array,
});
const emit = defineEmits(['update:value', 'change']);
const attrs = useAttrs({ excludeDefaultKeys: false });
const min = ref<number | undefined>(undefined);
const max = ref<number | undefined>(undefined);
const formItemContext = Form.useInjectFormItemContext();

const getBindValue = computed(() => ({ ...unref(attrs) }));
const getPrecision = computed(() => (props.precision || props.precision === 0 ? props.precision : undefined));

watch(
  () => unref(props.value),
  (val) => {
    setValue(val);
  },
  { immediate: true },
);

function setValue(value) {
  if (Array.isArray(value) && value.length === 2) {
    min.value = value[0] || value[0] == 0 ? value[0] : undefined;
    max.value = value[1] || value[1] == 0 ? value[1] : undefined;
  } else {
    min.value = undefined;
    max.value = undefined;
  }
}
function onChange() {
  if (!min.value && min.value !== 0 && !max.value && max.value !== 0) {
    emit('update:value', []);
    emit('change', []);
    formItemContext.onFieldChange();
    return;
  }
  emit('update:value', [min.value, max.value]);
  emit('change', [min.value, max.value]);
  formItemContext.onFieldChange();
}
</script>

<template>
  <div class="jnpf-number-range" v-bind="getBindValue">
    <InputNumber v-model:value="min" :controls="false" :placeholder="$t('component.jnpf.numberRange.min')" :precision="getPrecision" @change="onChange" />
    <span class="separator">-</span>
    <InputNumber v-model:value="max" :controls="false" :placeholder="$t('component.jnpf.numberRange.max')" :precision="getPrecision" @change="onChange" />
  </div>
</template>
<style lang="scss" scoped>
.jnpf-number-range {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .ant-input-number {
    flex: 1;
    width: auto !important;
  }

  .separator {
    flex-shrink: 0;
    margin: 0 5px;
  }
}
</style>
