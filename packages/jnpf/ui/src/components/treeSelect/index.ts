import type { ExtractPropTypes } from 'vue';

import { withInstall } from '@jnpf/utils';

import { treeSelectProps } from './src/props';
import TreeSelect from './src/TreeSelect.vue';

export const JnpfTreeSelect = withInstall(TreeSelect);
export declare type TreeSelectProps = Partial<ExtractPropTypes<typeof treeSelectProps>>;
