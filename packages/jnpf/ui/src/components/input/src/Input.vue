<script lang="ts" setup>
import { computed, ref, unref, watch } from 'vue';

import { useAttrs, useTextMask } from '@jnpf/hooks';

import { useDebounceFn } from '@vueuse/core';
import { Input } from 'ant-design-vue';

import { inputProps } from './props';

defineOptions({ inheritAttrs: false, name: 'JnpfInput' });
const props = defineProps(inputProps);
const emit = defineEmits(['update:value', 'change']);
const InputPassword = Input.Password;
const attrs = useAttrs({ excludeDefaultKeys: false });
const innerValue = ref('');
const maskedValue = ref('');
const Comp = props.showPassword ? InputPassword : Input;
const debounceOnChange = useDebounceFn((value) => {
  emit('change', value);
}, 200);

const getBindValue = computed(() => ({ ...unref(attrs) }));

watch(
  () => unref(props.value),
  (val) => {
    setValue(val);
  },
  { immediate: true },
);

function setValue(value) {
  innerValue.value = value;
  if (!props.useMask) return (maskedValue.value = value);
  const { getMaskedText } = useTextMask(props.maskConfig);
  maskedValue.value = getMaskedText(value);
}
function onChange(e) {
  emit('update:value', e.target.value);
  debounceOnChange(e.target.value);
}
</script>

<template>
  <component :is="Comp" class="jnpf-input" v-bind="getBindValue" v-if="!detailed" v-model:value="innerValue" @change="onChange">
    <template v-for="item in Object.keys($slots)" #[item]="data"><slot :name="item" v-bind="data || {}"></slot></template>
    <template v-if="prefixIcon" #prefix>
      <i :class="prefixIcon"></i>
    </template>
    <template v-if="suffixIcon" #suffix>
      <i :class="suffixIcon"></i>
    </template>
  </component>
  <p v-else :class="{ ellipsis: showOverflow }" :title="showOverflow ? maskedValue : ''" class="detail-text break-all">
    <span v-if="$attrs.addonBefore">{{ $attrs.addonBefore }}</span>
    {{ maskedValue }}
    <span v-if="$attrs.addonAfter">{{ $attrs.addonAfter }}</span>
  </p>
</template>
<style lang="scss" scoped>
.jnpf-input {
  :deep(.ant-input-prefix),
  :deep(.ant-input-suffix) {
    i {
      line-height: 20px;
      color: var(--text-color-help-dark);
    }
  }
}

.ant-table,
.jnpf-vxe-table {
  .detail-text {
    line-height: 22px !important;
    white-space: pre-wrap;

    &.ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
