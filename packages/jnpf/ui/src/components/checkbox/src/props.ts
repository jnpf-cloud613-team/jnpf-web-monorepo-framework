export interface FieldNames {
  disabled?: string;
  label?: string;
  value?: string;
}

export const checkboxProps = {
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
  value: {
    type: Array as PropType<boolean[] | number[] | string[]>,
  },
};
