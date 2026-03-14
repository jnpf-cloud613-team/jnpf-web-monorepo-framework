<script lang="ts">
import type { ButtonProps } from '@jnpf/ui';

import type { PropType } from 'vue';

import type { ColEx } from '../types/index';

import { computed, defineComponent } from 'vue';

import { AButton, BasicArrow } from '@jnpf/ui';
import { propTypes } from '@jnpf/utils';

import { $t } from '@vben/locales';

import { Col as ACol, Form } from 'ant-design-vue';

import { useFormContext } from '../hooks/useFormContext';

type ButtonOptions = Partial<ButtonProps> & { text: string };

export default defineComponent({
  components: {
    AButton,
    ACol,
    BasicArrow,
    FormItem: Form.Item,
  },
  emits: ['toggleAdvanced'],
  name: 'BasicFormAction',
  props: {
    actionColOptions: {
      default: () => ({}),
      type: Object as PropType<Partial<ColEx>>,
    },
    actionSpan: propTypes.number.def(6),
    hideAdvanceBtn: propTypes.bool,
    isAdvanced: propTypes.bool,
    resetButtonOptions: {
      default: () => ({}),
      type: Object as PropType<ButtonOptions>,
    },
    showActionButtonGroup: propTypes.bool.def(true),
    showAdvancedButton: propTypes.bool.def(true),
    showResetButton: propTypes.bool.def(true),
    showSubmitButton: propTypes.bool.def(true),
    submitButtonOptions: {
      default: () => ({}),
      type: Object as PropType<ButtonOptions>,
    },
  },
  setup(props, { emit }) {
    const actionColOpt = computed(() => {
      const { actionColOptions, actionSpan: span, showAdvancedButton } = props;
      const actionSpan = 24 - span;
      const advancedSpanObj = showAdvancedButton ? { span: actionSpan < 6 ? 24 : actionSpan } : {};
      const actionColOpt: Partial<ColEx> = {
        span: showAdvancedButton ? 6 : 4,
        style: { textAlign: 'left' },
        ...advancedSpanObj,
        ...actionColOptions,
      };
      return actionColOpt;
    });

    const getResetBtnOptions = computed((): ButtonOptions => {
      return Object.assign(
        {
          text: $t('common.resetText'),
        },
        props.resetButtonOptions,
      );
    });

    const getSubmitBtnOptions = computed(() => {
      return Object.assign(
        {
          text: $t('common.queryText'),
        },
        props.submitButtonOptions,
      );
    });

    function toggleAdvanced() {
      emit('toggleAdvanced');
    }

    return {
      actionColOpt,
      getResetBtnOptions,
      getSubmitBtnOptions,
      t: $t,
      toggleAdvanced,
      ...useFormContext(),
    };
  },
});
</script>
<template>
  <ACol v-bind="actionColOpt" v-if="showActionButtonGroup">
    <div :style="{ textAlign: actionColOpt.style.textAlign }" class="w-full">
      <FormItem>
        <slot name="submitBefore"></slot>
        <AButton class="mr-2" type="primary" v-bind="getSubmitBtnOptions" v-if="showSubmitButton" @click="submitAction">
          {{ getSubmitBtnOptions.text }}
        </AButton>
        <slot name="resetBefore"></slot>
        <AButton class="mr-2" type="default" v-bind="getResetBtnOptions" v-if="showResetButton" @click="resetAction">
          {{ getResetBtnOptions.text }}
        </AButton>
        <slot name="advanceBefore"></slot>
        <AButton v-if="showAdvancedButton && !hideAdvanceBtn" size="small" type="link" @click="toggleAdvanced">
          {{ isAdvanced ? t('component.form.fold') : t('component.form.unfold') }}
          <BasicArrow :expand="!isAdvanced" class="ml-1" up />
        </AButton>
        <slot name="advanceAfter"></slot>
      </FormItem>
    </div>
  </ACol>
</template>
