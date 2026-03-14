<script lang="ts" setup>
import { computed, provide, reactive, ref, unref, watch } from 'vue';

import { formatToDateTime } from '@jnpf/utils';

import { useDebounceFn } from '@vueuse/core';
import CronParser from 'cron-parser';

import { cronEmits, cronProps } from './easy.cron.data';
import DayUI from './tabs/DayUI.vue';
import HourUI from './tabs/HourUI.vue';
import MinuteUI from './tabs/MinuteUI.vue';
import MonthUI from './tabs/MonthUI.vue';
import SecondUI from './tabs/SecondUI.vue';
import WeekUI from './tabs/WeekUI.vue';
import YearUI from './tabs/YearUI.vue';

interface InputValuesState {
  cron: any;
  day: any;
  hour: any;
  minute: any;
  month: any;
  second: any;
  week: any;
  year: any;
}

const props = defineProps({ ...cronProps });
const emit = defineEmits([...cronEmits]);
const prefixCls = 'jnpf-easy-cron-inner';
provide('prefixCls', prefixCls);
const activeKey = ref(props.hideSecond ? 'minute' : 'second');
const second = ref<any>('*');
const minute = ref<any>('*');
const hour = ref<any>('*');
const day = ref<any>('*');
const month = ref<any>('*');
const week = ref<any>('?');
const year = ref<any>('*');
const inputValues = reactive<InputValuesState>({
  cron: '',
  day: '',
  hour: '',
  minute: '',
  month: '',
  second: '',
  week: '',
  year: '',
});
const preTimeList = ref('执行预览，会忽略年份参数。');

// cron表达式
const cronValueInner = computed(() => {
  const result: string[] = [];
  if (!props.hideSecond) {
    result.push(second.value ? second.value : '*');
  }
  result.push(
    minute.value ? minute.value : '*',
    hour.value ? hour.value : '*',
    day.value ? day.value : '*',
    month.value ? month.value : '*',
    week.value ? week.value : '?',
  );
  if (!props.hideYear && !props.hideSecond) result.push(year.value ? year.value : '*');
  return result.join(' ');
});
// 不含年
const cronValueNoYear = computed(() => {
  const v = cronValueInner.value;
  if (props.hideYear || props.hideSecond) return v;
  const vs = v.split(' ');
  if (vs.length >= 6) {
    // 转成 Quartz 的规则
    vs[5] = convertWeekToQuartz(vs[5] as string);
  }
  return vs.slice(0, -1).join(' ');
});
const calTriggerList = useDebounceFn(calTriggerListInner, 500);

watch(
  () => unref(props.value),
  (newVal) => {
    if (newVal === cronValueInner.value) {
      return;
    }
    formatValue();
  },
  { immediate: true },
);

watch(cronValueInner, (newValue) => {
  calTriggerList();
  emitValue(newValue);
  assignInput();
});

assignInput();
formatValue();
calTriggerListInner();

function assignInput() {
  inputValues.second = second.value;
  inputValues.minute = minute.value;
  inputValues.hour = hour.value;
  inputValues.day = day.value;
  inputValues.month = month.value;
  inputValues.week = week.value;
  inputValues.year = year.value;
  inputValues.cron = cronValueInner.value;
  if (!props.value) emitValue(inputValues.cron);
}
function formatValue() {
  if (!props.value) return;
  const values = props.value.split(' ').filter((item) => !!item);
  if (!values || values.length <= 0) return;
  let i = 0;
  if (!props.hideSecond) second.value = values[i++];
  if (values.length > i) minute.value = values[i++];
  if (values.length > i) hour.value = values[i++];
  if (values.length > i) day.value = values[i++];
  if (values.length > i) month.value = values[i++];
  if (values.length > i) week.value = values[i++];
  if (values.length > i) year.value = values[i];
  assignInput();
}
// Quartz 的规则：
// 1 = 周日，2 = 周一，3 = 周二，4 = 周三，5 = 周四，6 = 周五，7 = 周六
function convertWeekToQuartz(week: string) {
  const convert = (v: string) => {
    if (v === '0') {
      return '1';
    }
    if (v === '1') {
      return '0';
    }
    return (Number.parseInt(v) - 1).toString();
  };
  // 匹配示例 1-7 or 1/7
  const patten1 = /^([0-7])([-/])([0-7])$/;
  // 匹配示例 1,4,7
  // eslint-disable-next-line regexp/no-unused-capturing-group
  const patten2 = /^([0-7])(,[0-7])+$/;
  if (/^[0-7]$/.test(week)) {
    return convert(week);
  } else if (patten1.test(week)) {
    return week.replace(patten1, (_$0, before, separator, after) => {
      return separator === '/' ? convert(before) + separator + after : convert(before) + separator + convert(after);
    });
  } else if (patten2.test(week)) {
    return week
      .split(',')
      .map((v) => convert(v))
      .join(',');
  }
  return week;
}
function calTriggerListInner() {
  // 设置了回调函数
  if (props.remote) {
    props.remote(cronValueInner.value, Date.now(), (v) => {
      preTimeList.value = v;
    });
    return;
  }
  const options = {
    currentDate: formatToDateTime(new Date()),
  };
  const iter = CronParser.parseExpression(cronValueNoYear.value, options);
  const result: string[] = [];
  for (let i = 1; i <= 10; i++) {
    result.push(formatToDateTime(new Date(iter.next() as any)));
  }
  preTimeList.value = result.length > 0 ? result.join('\n') : '无执行时间';
}
function onInputBlur() {
  second.value = inputValues.second;
  minute.value = inputValues.minute;
  hour.value = inputValues.hour;
  day.value = inputValues.day;
  month.value = inputValues.month;
  week.value = inputValues.week;
  year.value = inputValues.year;
}
function onInputCronBlur(event) {
  emitValue(event.target.value);
}
function emitValue(value) {
  emit('change', value);
  emit('update:value', value);
}
</script>

<template>
  <div class="jnpf-easy-cron-inner">
    <div class="content">
      <a-tabs v-model:active-key="activeKey" class="cron-list" size="small">
        <a-tab-pane v-if="!hideSecond" key="second" tab="秒">
          <SecondUI v-model:value="second" :disabled="disabled" />
        </a-tab-pane>
        <a-tab-pane key="minute" tab="分">
          <MinuteUI v-model:value="minute" :disabled="disabled" />
        </a-tab-pane>
        <a-tab-pane key="hour" tab="时">
          <HourUI v-model:value="hour" :disabled="disabled" />
        </a-tab-pane>
        <a-tab-pane key="day" tab="日">
          <DayUI v-model:value="day" :disabled="disabled" :week="week" />
        </a-tab-pane>
        <a-tab-pane key="month" tab="月">
          <MonthUI v-model:value="month" :disabled="disabled" />
        </a-tab-pane>
        <a-tab-pane key="week" tab="周">
          <WeekUI v-model:value="week" :day="day" :disabled="disabled" />
        </a-tab-pane>
        <a-tab-pane v-if="!hideYear && !hideSecond" key="year" tab="年">
          <YearUI v-model:value="year" :disabled="disabled" />
        </a-tab-pane>
      </a-tabs>
      <a-divider />
      <!-- 执行时间预览 -->
      <a-row :gutter="8">
        <a-col :span="24">
          <a-row :gutter="8">
            <a-col :span="24" class="time-list">
              <a-input v-model:value="inputValues.second" @blur="onInputBlur">
                <template #addonBefore>
                  <span class="allow-click" @click="activeKey = 'second'">秒</span>
                </template>
              </a-input>
              <a-input v-model:value="inputValues.minute" @blur="onInputBlur">
                <template #addonBefore>
                  <span class="allow-click" @click="activeKey = 'minute'">分</span>
                </template>
              </a-input>
              <a-input v-model:value="inputValues.hour" @blur="onInputBlur">
                <template #addonBefore>
                  <span class="allow-click" @click="activeKey = 'hour'">时</span>
                </template>
              </a-input>
              <a-input v-model:value="inputValues.day" @blur="onInputBlur">
                <template #addonBefore>
                  <span class="allow-click" @click="activeKey = 'day'">日</span>
                </template>
              </a-input>
              <a-input v-model:value="inputValues.month" @blur="onInputBlur">
                <template #addonBefore>
                  <span class="allow-click" @click="activeKey = 'month'">月</span>
                </template>
              </a-input>
              <a-input v-model:value="inputValues.week" @blur="onInputBlur">
                <template #addonBefore>
                  <span class="allow-click" @click="activeKey = 'week'">周</span>
                </template>
              </a-input>
              <a-input v-model:value="inputValues.year" @blur="onInputBlur">
                <template #addonBefore>
                  <span class="allow-click" @click="activeKey = 'year'">年</span>
                </template>
              </a-input>
            </a-col>
            <a-col :span="24">
              <a-input v-model:value="inputValues.cron" @blur="onInputCronBlur">
                <template #addonBefore>
                  <a-tooltip title="Cron表达式">Cron表达式</a-tooltip>
                </template>
              </a-input>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-row class="my-[10px]">
        <a-col :span="24">
          <div class="mb-[4px]">近十次执行时间（不含年）</div>
          <a-textarea :rows="5" :value="preTimeList" type="textarea" />
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<style lang="scss">
@use './easy.cron.inner' as *;
</style>
