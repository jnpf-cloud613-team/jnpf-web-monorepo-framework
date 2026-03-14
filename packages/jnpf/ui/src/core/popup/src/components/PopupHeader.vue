<script lang="ts">
import { defineComponent } from 'vue';

import { BasicTitle } from '@jnpf/ui';

import { ArrowLeftOutlined } from '@ant-design/icons-vue';

import { headerProps } from '../props';

export default defineComponent({
  components: { ArrowLeftOutlined, BasicTitle },
  emits: ['close', 'ok', 'continue'],
  inheritAttrs: false,
  name: 'BasicPopupHeader',
  props: {
    ...headerProps,
  },
  setup(_, { emit }) {
    const prefixCls = 'jnpf-basic-popup-header';

    function handleOk() {
      emit('ok');
    }
    function handleContinue(e: Event) {
      emit('continue', e);
    }
    function handleClose() {
      emit('close');
    }

    return { handleClose, handleContinue, handleOk, prefixCls };
  },
});
</script>
<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}-left`">
      <span v-if="showBackIcon" @click="handleClose">
        <ArrowLeftOutlined :class="`${prefixCls}__back`" />
      </span>
      <slot v-if="$slots.title" name="title"></slot>
      <BasicTitle v-if="!$slots.title" :help-message="helpMessage">
        {{ title }}
      </BasicTitle>
    </div>
    <div :class="`${prefixCls}__toolbar`">
      <slot name="insertToolbar"></slot>
      <a-button
        :disabled="confirmLoading"
        :loading="continueLoading"
        :type="continueType"
        class="ml-[10px]"
        @click="handleContinue"
        v-bind="continueButtonProps"
        v-if="showContinueBtn">
        {{ continueText }}
      </a-button>
      <a-button
        :type="okType"
        @click="handleOk"
        v-bind="okButtonProps"
        v-if="showOkBtn"
        :disabled="okButtonProps?.disabled || continueLoading"
        :loading="confirmLoading"
        class="ml-[10px]">
        {{ okText }}
      </a-button>
      <slot name="centerToolbar"></slot>
      <a-button v-bind="cancelButtonProps" v-if="showCancelBtn" class="ml-[10px]" @click="handleClose">
        {{ cancelText }}
      </a-button>
      <slot name="appendToolbar"></slot>
    </div>
  </div>
</template>

<style lang="scss">
.jnpf-basic-popup-header {
  box-sizing: border-box;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 10px;
  border-bottom: 1px solid var(--border-color-base);

  &-left {
    display: flex;
    align-items: center;
  }

  &__back {
    padding-right: 16px;
    cursor: pointer;

    &:hover {
      color: var(--primary-color);
    }
  }

  &__toolbar {
    display: flex;
    align-items: center;
  }
}
</style>
