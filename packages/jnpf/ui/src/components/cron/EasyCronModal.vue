<script lang="ts" setup>
import { ref } from 'vue';

import { useAttrs } from '@jnpf/hooks';
import { ModalClose } from '@jnpf/ui/modal';

import { Modal as AModal } from 'ant-design-vue';

import EasyCron from './EasyCronInner.vue';

defineOptions({ inheritAttrs: false, name: 'EasyCronModal' });
const emit = defineEmits(['ok']);
defineExpose({ openModal });
const attrs = useAttrs();
const visible = ref(false);

function openModal() {
  visible.value = true;
}
function handleCancel() {
  visible.value = false;
}
function handleSubmit() {
  handleCancel();
  emit('ok');
}
</script>

<template>
  <AModal v-model:open="visible" :mask-closable="false" :width="800" class="jnpf-cron-modal" title="Cron表达式" @cancel="handleCancel" @ok="handleSubmit">
    <template #closeIcon>
      <ModalClose :can-fullscreen="false" @cancel="handleCancel" />
    </template>
    <EasyCron v-bind="attrs" />
  </AModal>
</template>
