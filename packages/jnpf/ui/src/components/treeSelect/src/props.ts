export interface FieldNames {
  children?: string;
  key?: string;
  label?: string;
  value?: string;
}
export const treeSelectProps = {
  allowClear: { default: true, type: Boolean },
  disabled: { default: false, type: Boolean },
  dropdownMatchSelectWidth: { default: false, type: Boolean },
  fieldNames: {
    default: () => ({ label: 'fullName', value: 'id', children: 'children' }),
    type: Object as PropType<FieldNames>,
  },
  // 只能选择最后一层的数值
  lastLevel: { default: false, type: Boolean },
  // 只能选择最后一层的数值时，需要根据 lastLevelKey来判断是否最后一层
  lastLevelKey: { default: 'hasChildren', type: String },
  lastLevelValue: { default: false },
  modelValue: [String, Number, Array],
  multiple: { default: false, type: Boolean },
  options: { default: () => [], type: Array },
  placeholder: { default: '请选择', type: String },
  showIcon: { default: true, type: Boolean },
  showSearch: { default: true, type: Boolean },
  treeDefaultExpandAll: { default: true, type: Boolean },
  treeNodeFilterProp: { default: 'fullName', type: String },
  value: [String, Number, Array],
};
