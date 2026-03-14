export const buttonProps = {
  align: { default: 'left', type: String },
  buttonText: { default: '', type: String },
  onClick: { default: null, type: Function as PropType<(...args) => any> },
};
