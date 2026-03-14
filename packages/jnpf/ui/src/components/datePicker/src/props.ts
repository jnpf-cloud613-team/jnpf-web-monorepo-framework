export const datePickerProps = {
  endTime: { default: null, type: Number },
  format: { default: 'YYYY-MM-DD', type: String },
  startTime: { default: null, type: Number },
  value: [Number, String],
};
export const dateRangeProps = {
  endTime: { default: null, type: Number },
  format: { default: 'YYYY-MM-DD', type: String },
  placeholder: { default: () => ['开始日期', '结束日期'], type: Array },
  startTime: { default: null, type: Number },
  value: { type: Array as PropType<number[] | string[]> },
};
export const timePickerProps = {
  endTime: { default: null, type: String },
  format: { default: 'HH:mm:ss', type: String },
  startTime: { default: null, type: String },
  value: String,
};
export const timeRangeProps = {
  endTime: { default: null, type: String },
  format: { default: 'HH:mm:ss', type: String },
  placeholder: { default: () => ['开始时间', '结束时间'], type: Array },
  startTime: { default: null, type: String },
  value: { type: Array as PropType<string[]> },
};
