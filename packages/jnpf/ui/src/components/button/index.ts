import type { ExtractPropTypes } from 'vue';

import { withInstall } from '@jnpf/utils';

import Button from './src/Button.vue';
import { buttonProps } from './src/props';

export const JnpfButton = withInstall(Button);
export declare type JnpfButtonProps = Partial<ExtractPropTypes<typeof buttonProps>>;
