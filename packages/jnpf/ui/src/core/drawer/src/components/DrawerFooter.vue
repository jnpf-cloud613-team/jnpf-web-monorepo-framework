<script lang="ts">
import type { CSSProperties } from 'vue';

import { computed, defineComponent } from 'vue';

import { footerProps } from '../props';

export default defineComponent({
  emits: ['close', 'ok', 'continue'],
  name: 'BasicDrawerFooter',
  props: {
    ...footerProps,
    height: {
      default: '60px',
      type: String,
    },
  },
  setup(props, { emit }) {
    const prefixCls = 'jnpf-basic-drawer-footer';

    const getStyle = computed((): CSSProperties => {
      const heightStr = `${props.height}`;
      return {
        height: heightStr,
        lineHeight: `calc(${heightStr} - 1px)`,
      };
    });

    function handleOk() {
      emit('ok');
    }
    function handleContinue(e: Event) {
      emit('continue', e);
    }
    function handleClose() {
      emit('close');
    }
    return { getStyle, handleClose, handleContinue, handleOk, prefixCls };
  },
});
</script>
<template>
  <div v-if="showFooter || $slots.footer" :class="prefixCls" :style="getStyle">
    <template v-if="!$slots.footer">
      <slot name="insertFooter"></slot>
      <a-button
        :disabled="confirmLoading"
        :loading="continueLoading"
        :type="continueType"
        class="mr-[10px]"
        @click="handleContinue"
        v-bind="continueButtonProps"
        v-if="showContinueBtn">
        {{ continueText }}
      </a-button>
      <a-button v-bind="cancelButtonProps" v-if="showCancelBtn" class="mr-[10px]" @click="handleClose">
        {{ cancelText }}
      </a-button>
      <slot name="centerFooter"></slot>
      <a-button
        :type="okType"
        @click="handleOk"
        v-bind="okButtonProps"
        v-if="showOkBtn"
        :disabled="okButtonProps?.disabled || continueLoading"
        :loading="confirmLoading"
        class="mr-[10px]">
        {{ okText }}
      </a-button>
      <slot name="appendFooter"></slot>
    </template>
    <template v-else>
      <slot name="footer"></slot>
    </template>
  </div>
</template>

<style lang="scss">
.jnpf-basic-drawer-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 12px 0 20px;
  text-align: right;
  background-color: var(--component-background);
  border-top: 1px solid var(--border-color-base);

  > * {
    margin-right: 8px;
  }
}
</style>
