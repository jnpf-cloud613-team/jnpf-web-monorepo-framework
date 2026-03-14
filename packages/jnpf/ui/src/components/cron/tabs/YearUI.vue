<script lang="ts">
import { defineComponent } from 'vue';

import { InputNumber } from 'ant-design-vue';

import { useTabEmits, useTabProps, useTabSetup } from './useTabMixin';

export default defineComponent({
  components: { InputNumber },
  emits: useTabEmits(),
  name: 'YearUI',
  props: useTabProps({
    defaultValue: '*',
  }),
  setup(props, context) {
    const nowYear = new Date().getFullYear();
    return useTabSetup(props, context, {
      defaultValue: '*',
      minValue: 0,
      valueLoop: { interval: 1, start: nowYear },
      valueRange: { end: nowYear + 100, start: nowYear },
    });
  },
});
</script>

<template>
  <div :class="`${prefixCls}-config-list`">
    <a-radio-group v-model:value="type">
      <div class="item">
        <a-radio :value="TypeEnum.every" v-bind="beforeRadioAttrs">每年</a-radio>
      </div>
      <div class="item">
        <a-radio :value="TypeEnum.range" v-bind="beforeRadioAttrs">区间</a-radio>
        <span> 从 </span>
        <InputNumber v-model:value="valueRange.start" class="w80" v-bind="typeRangeAttrs" />
        <span> 年 至 </span>
        <InputNumber v-model:value="valueRange.end" class="w80" v-bind="typeRangeAttrs" />
        <span> 年 </span>
      </div>
      <div class="item">
        <a-radio :value="TypeEnum.loop" v-bind="beforeRadioAttrs">循环</a-radio>
        <span> 从 </span>
        <InputNumber v-model:value="valueLoop.start" class="w80" v-bind="typeLoopAttrs" />
        <span> 年开始，间隔 </span>
        <InputNumber v-model:value="valueLoop.interval" class="w80" v-bind="typeLoopAttrs" />
        <span> 年 </span>
      </div>
    </a-radio-group>
  </div>
</template>
