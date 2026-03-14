<script lang="ts">
import { defineComponent } from 'vue';

import { basicProps } from '../props';

export default defineComponent({
  emits: ['ok', 'continue', 'cancel'],
  name: 'BasicModalFooter',
  props: basicProps,
  setup(_, { emit }) {
    function handleOk(e: Event) {
      emit('ok', e);
    }
    function handleContinue(e: Event) {
      emit('continue', e);
    }
    function handleCancel(e: Event) {
      emit('cancel', e);
    }

    return { handleCancel, handleContinue, handleOk };
  },
});
</script>
<template>
  <div>
    <slot name="insertFooter"></slot>
    <a-button
      :disabled="confirmLoading"
      :loading="continueLoading"
      :type="continueType"
      @click="handleContinue"
      v-bind="continueButtonProps"
      v-if="showContinueBtn">
      {{ continueText }}
    </a-button>
    <a-button v-bind="cancelButtonProps" v-if="showCancelBtn" @click="handleCancel">
      {{ cancelText }}
    </a-button>
    <slot name="centerFooter"></slot>
    <a-button
      :loading="confirmLoading"
      :type="okType"
      @click="handleOk"
      v-bind="okButtonProps"
      v-if="showOkBtn"
      :disabled="okButtonProps?.disabled || continueLoading">
      {{ okText }}
    </a-button>
    <slot name="appendFooter"></slot>
  </div>
</template>
