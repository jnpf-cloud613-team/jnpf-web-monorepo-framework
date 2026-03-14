<script lang="ts">
import { computed, defineComponent, watch } from 'vue';

import { InputNumber } from 'ant-design-vue';

import { TypeEnum, useTabEmits, useTabProps, useTabSetup } from './useTabMixin';

export default defineComponent({
  components: { InputNumber },
  emits: useTabEmits(),
  name: 'DayUI',
  props: useTabProps({
    defaultValue: '*',
    props: {
      week: { default: '?', type: String },
    },
  }),
  setup(props: any, context) {
    const disabledChoice = computed(() => {
      return (props.week && props.week !== '?') || props.disabled;
    });
    const setup = useTabSetup(props, context, {
      defaultValue: '*',
      disabled: disabledChoice,
      maxValue: 31,
      minValue: 1,
      valueLoop: { interval: 1, start: 1 },
      valueRange: { end: 31, start: 1 },
      valueWork: 1,
    });
    const typeWorkAttrs = computed(() => ({
      disabled: setup.type.value !== TypeEnum.work || props.disabled || disabledChoice.value,
      ...setup.inputNumberAttrs.value,
    }));

    watch(
      () => props.week,
      () => {
        setup.updateValue(disabledChoice.value ? '?' : setup.computeValue.value);
      },
    );

    return { ...setup, typeWorkAttrs };
  },
});
</script>

<template>
  <div :class="`${prefixCls}-config-list`">
    <a-radio-group v-model:value="type">
      <div class="item">
        <a-radio :value="TypeEnum.unset" v-bind="beforeRadioAttrs">不设置</a-radio>
        <span class="tip-info">日和周只能设置其中之一</span>
      </div>
      <div class="item">
        <a-radio :value="TypeEnum.every" v-bind="beforeRadioAttrs">每日</a-radio>
      </div>
      <div class="item">
        <a-radio :value="TypeEnum.range" v-bind="beforeRadioAttrs">区间</a-radio>
        <span> 从 </span>
        <InputNumber v-model:value="valueRange.start" v-bind="typeRangeAttrs" />
        <span> 日 至 </span>
        <InputNumber v-model:value="valueRange.end" v-bind="typeRangeAttrs" />
        <span> 日 </span>
      </div>
      <div class="item">
        <a-radio :value="TypeEnum.loop" v-bind="beforeRadioAttrs">循环</a-radio>
        <span> 从 </span>
        <InputNumber v-model:value="valueLoop.start" v-bind="typeLoopAttrs" />
        <span> 日开始，间隔 </span>
        <InputNumber v-model:value="valueLoop.interval" v-bind="typeLoopAttrs" />
        <span> 日 </span>
      </div>
      <div class="item">
        <a-radio :value="TypeEnum.last" v-bind="beforeRadioAttrs">最后一日</a-radio>
      </div>
      <div class="item">
        <a-radio :value="TypeEnum.specify" v-bind="beforeRadioAttrs">指定</a-radio>
        <div class="list">
          <a-checkbox-group v-model:value="valueList">
            <template v-for="i in specifyRange" :key="i">
              <a-checkbox :value="i" v-bind="typeSpecifyAttrs">{{ i }}</a-checkbox>
            </template>
          </a-checkbox-group>
        </div>
      </div>
    </a-radio-group>
  </div>
</template>
