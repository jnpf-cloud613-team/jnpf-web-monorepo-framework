export const linkProps = {
  content: { default: '', type: String },
  href: { default: '', type: String },
  onClick: { default: null, type: Function as PropType<(...args) => any> },
  target: { default: '_self', type: String },
  textStyle: {
    default: () => ({
      'text-align': 'left',
    }),
    type: Object,
  },
};
