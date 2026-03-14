export const inputProps = {
  detailed: { default: false, type: Boolean },
  maskConfig: {
    default: () => ({}),
    type: Object,
  },
  prefixIcon: { default: '', type: String },
  showOverflow: { default: false, type: Boolean },
  showPassword: { default: false, type: Boolean },
  suffixIcon: { default: '', type: String },
  useMask: { default: false, type: Boolean },
  useScan: { default: false, type: Boolean },
  value: String,
};
export const textareaProps = {
  rows: { default: 3 },
  value: String,
};
