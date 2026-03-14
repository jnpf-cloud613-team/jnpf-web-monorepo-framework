export interface FieldNames {
  disabled?: string;
  label?: string;
  value?: string;
}

export const radioProps = {
  direction: {
    default: 'horizontal',
    type: String,
  },
  fieldNames: {
    default: () => ({ disabled: 'disabled', label: 'fullName', value: 'id' }),
    type: Object as PropType<FieldNames>,
  },
  options: {
    default: () => [],
    type: Array,
  },
  optionType: {
    default: 'default',
    type: String as PropType<'button' | 'default'>,
  },
  value: {
    type: [String, Number, Boolean] as PropType<boolean | number | string>,
  },
};
