import type { ExtractPropTypes } from 'vue';

import { withInstall } from '@jnpf/utils';

import button from './src/AButton.vue';
import modelConfirmButton from './src/ModelConfirmButton.vue';
import popConfirmButton from './src/PopConfirmButton.vue';
import { buttonProps } from './src/props';

export const AButton = withInstall(button);
export const PopConfirmButton = withInstall(popConfirmButton);
export const ModelConfirmButton = withInstall(modelConfirmButton);
export declare type ButtonProps = Partial<ExtractPropTypes<typeof buttonProps>>;
