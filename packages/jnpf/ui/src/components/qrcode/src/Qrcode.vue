<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { isNullOrUnDef } from '@jnpf/utils';

import { globalShareState } from '@vben-core/shared/global-state';

import { QrCode } from '../../../core';
import { qrcodeProps } from './props';

defineOptions({ inheritAttrs: false, name: 'JnpfQrcode' });
const props = defineProps(qrcodeProps);
const { useGeneratorStore } = globalShareState.getStores();
const generatorStore = useGeneratorStore();
const relationText = ref('');

const options = computed(() => ({
  color: { dark: props.colorDark, light: props.colorLight },
  margin: 1,
}));
const qrcode = computed(() => {
  const dynamicModelExtra = generatorStore.getDynamicModelExtra;
  if (props.dataType === 'static') {
    return props.staticText;
  } else if (props.dataType === 'relation') {
    return relationText.value;
  } else {
    if (props.formData && dynamicModelExtra && dynamicModelExtra.id && dynamicModelExtra.modelId) {
      const json = {
        fid: dynamicModelExtra.flowId || '',
        ftid: dynamicModelExtra.taskId || '',
        id: dynamicModelExtra.id,
        mid: dynamicModelExtra.modelId,
        mt: dynamicModelExtra.type,
        opt: dynamicModelExtra.opType,
        pid: dynamicModelExtra.processId || '',
        t: 'DFD',
      };
      return JSON.stringify(json);
    }
    return '';
  }
});

watch(
  () => props.formData,
  (val) => {
    if (val && props.dataType === 'relation' && props.relationField) {
      relationText.value = isNullOrUnDef(val[props.relationField]) ? '' : val[props.relationField];
    }
  },
  { deep: true, immediate: true },
);
</script>

<template>
  <div class="jnpf-qrcode">
    <QrCode :options="options" :value="qrcode" :width="width" tag="img" />
  </div>
</template>
<style lang="scss" scoped>
.jnpf-qrcode {
  width: 100%;
  max-width: 100% !important;
  min-height: 40px;
  padding: 0;
}
</style>
