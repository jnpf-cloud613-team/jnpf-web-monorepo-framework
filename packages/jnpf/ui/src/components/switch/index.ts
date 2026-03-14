import type { ExtractPropTypes } from 'vue';

import { withInstall } from '@jnpf/utils';

import { switchProps } from './src/props';
import Switch from './src/Switch.vue';

export const JnpfSwitch = withInstall(Switch);
export declare type SwitchProps = Partial<ExtractPropTypes<typeof switchProps>>;
