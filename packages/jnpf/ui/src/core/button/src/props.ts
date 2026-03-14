import type { PropType } from 'vue';

const validColors = ['primary', 'error', 'warning', 'success', 'info', ''] as const;
type ButtonColorType = (typeof validColors)[number];

export const buttonProps = {
  color: {
    default: '',
    type: String as PropType<ButtonColorType>,
    validator: (v: any) => validColors.includes(v),
  },
  disabled: { type: Boolean },
  loading: { type: Boolean },
  onClick: { default: null, type: Function as PropType<(...args: any) => any> },
  /**
   * Text after icon.
   */
  postIcon: { type: String },
  /**
   * Text before icon.
   */
  preIcon: { type: String },
};
