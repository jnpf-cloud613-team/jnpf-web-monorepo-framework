import type { ExtractPropTypes } from 'vue';

import { withInstall } from '@jnpf/utils';

import { qrcodeProps } from './src/props';
import Qrcode from './src/Qrcode.vue';

export const JnpfQrcode = withInstall(Qrcode);
export declare type JnpfQrcodeProps = Partial<ExtractPropTypes<typeof qrcodeProps>>;
