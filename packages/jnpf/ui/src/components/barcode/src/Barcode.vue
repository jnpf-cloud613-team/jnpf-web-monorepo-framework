<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, unref, watch } from 'vue';

import { buildShortUUID } from '@jnpf/utils';

import JsBarcode from 'jsbarcode';

import { barcodeProps } from './props';

defineOptions({ inheritAttrs: false, name: 'JnpfBarcode' });
const props = defineProps(barcodeProps);
const id = ref('');
const relationText = ref('');

const barcode = computed(() => {
  return props.dataType === 'static' ? props.staticText : relationText.value;
});

watch(
  () => props.formData,
  (val) => {
    if (val && props.dataType === 'relation' && props.relationField) {
      relationText.value = val[props.relationField];
    }
  },
  { deep: true, immediate: true },
);
watch(
  () => [props.format, props.lineColor, props.background, props.width, props.height, unref(barcode)],
  () => {
    nextTick(() => {
      buildBarcode();
    });
  },
);

function buildBarcode() {
  if (!unref(barcode)) return;
  const reg = /^[A-Z0-9]+$/i;
  if (!reg.test(unref(barcode))) {
    return;
  }
  JsBarcode(`#${id.value}`, unref(barcode), {
    background: props.background,
    displayValue: false,
    format: props.format,
    height: props.height,
    lineColor: props.lineColor,
    margin: 5,
    width: props.width,
  });
}
id.value = buildShortUUID('barcode');

onMounted(() => {
  buildBarcode();
});
</script>

<template>
  <div class="jnpf-barcode">
    <div v-if="barcode">
      <canvas :id="id" class="barcode"></canvas>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.jnpf-barcode {
  width: 100%;
  min-height: 40px;
  padding: 0;
  overflow: hidden;
  background: #fff;
}
</style>
