<script lang="ts">
import { defineComponent } from 'vue';

import { InputNumber } from 'ant-design-vue';

import { useTabEmits, useTabProps, useTabSetup } from './useTabMixin';

export default defineComponent({
  components: { InputNumber },
  emits: useTabEmits(),
  name: 'HourUI',
  props: useTabProps({
    defaultValue: '*',
  }),
  setup(props, context) {
    return useTabSetup(props, context, {
      defaultValue: '*',
      maxValue: 23,
      minValue: 0,
      valueLoop: { interval: 1, start: 0 },
      valueRange: { end: 23, start: 0 },
    });
  },
});
</script>

<template>
  <div :class="`${prefixCls}-config-list`">
    <a-radio-group v-model:value="type">
      <div class="item">
        <a-radio :value="TypeEnum.every" v-bind="beforeRadioAttrs">每时</a-radio>
      </div>
      <div class="item">
        <a-radio :value="TypeEnum.range" v-bind="beforeRadioAttrs">区间</a-radio>
        <span> 从 </span>
        <InputNumber v-model:value="valueRange.start" v-bind="typeRangeAttrs" />
        <span> 时 至 </span>
        <InputNumber v-model:value="valueRange.end" v-bind="typeRangeAttrs" />
        <span> 时 </span>
      </div>
      <div class="item">
        <a-radio :value="TypeEnum.loop" v-bind="beforeRadioAttrs">循环</a-radio>
        <span> 从 </span>
        <InputNumber v-model:value="valueLoop.start" v-bind="typeLoopAttrs" />
        <span> 时开始，间隔 </span>
        <InputNumber v-model:value="valueLoop.interval" v-bind="typeLoopAttrs" />
        <span> 时 </span>
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
