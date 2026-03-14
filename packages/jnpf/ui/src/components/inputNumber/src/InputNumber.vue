<script lang="ts" setup>
import { computed, ref, unref, watch } from 'vue';

import { useAttrs } from '@jnpf/hooks';
import { getAmountChinese, thousandsFormat } from '@jnpf/utils';

import { InputNumber } from 'ant-design-vue';

defineOptions({ inheritAttrs: false, name: 'JnpfInputNumber' });
const props = defineProps({
  addonAfter: { default: '', type: String },
  addonBefore: { default: '', type: String },
  detailed: { default: false, type: Boolean },
  isAmountChinese: { default: false, type: Boolean },
  thousands: { default: false, type: Boolean },
  value: [Number, String],
});
const emit = defineEmits(['update:value', 'change']);
const attrs: any = useAttrs({ excludeDefaultKeys: false });
const prefixCls = 'jnpf-input-number';
const innerValue = ref<null | number | undefined>(undefined);

const getBindValue = computed(() => {
  const bindValue = {
    ...unref(attrs),
    addonAfter: props.addonAfter || null,
    addonBefore: props.addonBefore || null,
    precision: Reflect.has(unref(attrs), 'precision') && (unref(attrs).precision || unref(attrs).precision === 0) ? unref(attrs).precision : undefined,
  };
  if (props.thousands) {
    bindValue.formatter = (value) => thousandsFormat(value);
    bindValue.parser = (value) => value.replaceAll(/\$\s?|(,*)/g, '');
  }
  return bindValue;
});
const getChineseName = computed(() => (!props.isAmountChinese || (!innerValue.value && innerValue.value !== 0) ? '' : getAmountChinese(innerValue.value)));
const getStyle = computed(() => (Reflect.has(unref(attrs), 'style') ? unref(attrs).style : {}));

watch(
  () => unref(props.value),
  (val) => {
    setValue(val);
  },
  { immediate: true },
);

function setValue(value) {
  innerValue.value = (!value && value !== 0) || Number.isNaN(value) ? null : props.detailed ? value : Number(value);
}
function onChange(value) {
  emit('update:value', value);
  emit('change', value);
}
</script>

<template>
  <div :class="`${prefixCls}`" :style="getStyle">
    <InputNumber v-model:value="innerValue" v-bind="getBindValue" v-if="!detailed" class="w-full" @change="onChange">
      <template v-for="item in Object.keys($slots)" #[item]="data">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </InputNumber>
    <p v-if="detailed" :title="thousands ? thousandsFormat(innerValue) : innerValue" class="detail-txt leading-[32px]">
      <span v-if="addonBefore">{{ addonBefore }}</span>
      {{ thousands ? thousandsFormat(innerValue) : innerValue }}
      <span v-if="addonAfter">{{ addonAfter }}</span>
    </p>
    <p v-if="isAmountChinese && getChineseName" class="amount-chinese-name">{{ getChineseName }}</p>
  </div>
</template>
<style lang="scss" scoped>
.jnpf-input-number {
  .amount-chinese-name {
    margin-top: 4px;
    font-size: 14px;
    line-height: 20px;
    color: var(--text-color-secondary);
  }
}

.ant-table,
.jnpf-vxe-table {
  .jnpf-input-number {
    .detail-txt {
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 22px !important;
      white-space: nowrap;
    }
  }
}
</style>
