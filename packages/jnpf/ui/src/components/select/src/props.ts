export interface FieldNames {
  disabled?: string;
  label?: string;
  options?: string;
  value?: string;
}

export const selectProps = {
  fieldNames: {
    default: () => ({ disabled: 'disabled', label: 'fullName', value: 'id' }),
    type: Object as PropType<FieldNames>,
  },
  multiple: { default: false, type: Boolean },
  optionFilterProp: { type: String },
  options: {
    default: () => [],
    type: Array,
  },
  placeholder: { default: '请选择', type: String },
  value: {
    type: [String, Number, Array] as PropType<[string, number][] | number | number[] | string | string[]>,
  },
};
