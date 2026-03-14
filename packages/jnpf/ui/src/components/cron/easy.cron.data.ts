import { propTypes } from '@jnpf/utils';

export const cronEmits = ['change', 'update:value'];
export const cronProps = {
  disabled: propTypes.bool.def(false),
  hideSecond: propTypes.bool.def(false),
  hideYear: propTypes.bool.def(false),
  remote: propTypes.func,
  value: propTypes.string.def(''),
};
