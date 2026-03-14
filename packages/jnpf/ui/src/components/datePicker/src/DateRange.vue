<script lang="ts" setup>
import { computed, ref, unref, watch } from 'vue';

import { useAttrs } from '@jnpf/hooks';
import { getDateFormat, getDateTimeUnit } from '@jnpf/utils';

import { RangePicker } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';

import { dateRangeProps } from './props';

defineOptions({ inheritAttrs: false, name: 'JnpfDateRange' });
const props = defineProps(dateRangeProps);
const emit = defineEmits(['update:value', 'change']);
const attrs: any = useAttrs({ excludeDefaultKeys: false });
const innerValue = ref<[string, string] | undefined>(undefined);

const getFormat = computed(() => getDateFormat(props.format || 'YYYY-MM-DD'));
const getShowTime = computed(() => unref(getFormat) === 'YYYY-MM-DD HH:mm' || unref(getFormat) === 'YYYY-MM-DD HH:mm:ss');
const getPicker = computed(() => {
  if (unref(getFormat) === 'YYYY') return 'year';
  if (unref(getFormat) === 'YYYY-MM') return 'month';
  return 'date';
});
const getRealStartTime = computed(() => {
  const format = unref(getFormat);
  if (!props.startTime || format === 'YYYY-MM-DD HH:mm:ss') return props.startTime;
  const startTime = dayjs(props.startTime).startOf(getDateTimeUnit(format)).valueOf();
  return startTime;
});
const getRealEndTime = computed(() => {
  const format = unref(getFormat);
  if (!props.endTime || format === 'YYYY-MM-DD HH:mm:ss') return props.endTime;
  const endTime = dayjs(props.endTime).endOf(getDateTimeUnit(format)).valueOf();
  return endTime;
});
const getBindValue = computed(() => ({
  ...unref(attrs),
  disabledDate: (current: Dayjs) => {
    const startTime = unref(getRealStartTime);
    const endTime = unref(getRealEndTime);
    if ((!startTime && !endTime) || !current) return false;
    const currentDate = current.valueOf();
    if (startTime && endTime) return startTime > currentDate || endTime < currentDate;
    if (startTime) return startTime > currentDate;
    if (endTime) return endTime < currentDate;
    return false;
  },
  format: unref(getFormat),
  placeholder: props.placeholder,
  showTime: Reflect.has(unref(attrs), 'showTime') ? unref(attrs).showTime : unref(getShowTime),
  valueFormat: unref(getFormat),
}));

watch(
  () => unref(props.value),
  (val) => {
    setValue(val);
  },
  { immediate: true },
);

function setValue(value) {
  if (!value || value.length === 0) return (innerValue.value = undefined);
  innerValue.value = value.map((o) => dayjs(o).format(unref(getFormat)));
}
function onChange(date) {
  date = date || [];
  const timestamp: number[] = date.map((o) => dayjs(o).valueOf());
  emit('update:value', timestamp);
  emit('change', timestamp);
}
</script>

<template>
  <RangePicker v-bind="getBindValue" v-model:value="innerValue" :picker="getPicker" @change="onChange" />
</template>
