<script lang="ts" setup>
import { ref, unref, watch } from 'vue';

import { propTypes } from '@jnpf/utils';

import { Button, Form } from 'ant-design-vue';

import { cronEmits, cronProps } from './easy.cron.data';
import EasyCronModal from './EasyCronModal.vue';

defineOptions({ inheritAttrs: false, name: 'JnpfCron' });

const props = defineProps({
  ...cronProps,
  exeStartTime: propTypes.oneOfType([propTypes.number, propTypes.string, propTypes.object]).def(0),
  placeholder: propTypes.string.def('Cron表达式'),
});
const emit = defineEmits([...cronEmits]);
const editCronValue = ref(props.value);
const formItemContext = Form.useInjectFormItemContext();
const easyCronModalRef = ref();

watch(
  () => unref(props.value),
  (newVal) => {
    if (newVal !== editCronValue.value) {
      editCronValue.value = newVal;
    }
  },
);

function showConfigModal() {
  if (props.disabled) return;
  easyCronModalRef.value?.openModal();
}
function handleSubmit() {
  emit('change', editCronValue.value);
  emit('update:value', editCronValue.value);
  formItemContext.onFieldChange();
}
</script>

<template>
  <div class="jnpf-easy-cron-input">
    <a-input-search v-model:value="value" :placeholder="placeholder" readonly @search="showConfigModal">
      <template #enterButton>
        <Button>
          <template #icon> <i class="icon-ym icon-ym-btn-edit"></i> </template>
        </Button>
      </template>
    </a-input-search>
    <EasyCronModal
      ref="easyCronModalRef"
      v-model:value="editCronValue"
      :exe-start-time="exeStartTime"
      :hide-second="hideSecond"
      :hide-year="hideYear"
      :remote="remote"
      @ok="handleSubmit" />
  </div>
</template>

<style lang="scss">
@use './easy.cron.input' as *;
</style>
