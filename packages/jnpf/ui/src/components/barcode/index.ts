import type { ExtractPropTypes } from 'vue';

import { withInstall } from '@jnpf/utils';

import Barcode from './src/Barcode.vue';
import { barcodeProps } from './src/props';

export const JnpfBarcode = withInstall(Barcode);
export declare type JnpfBarcodeProps = Partial<ExtractPropTypes<typeof barcodeProps>>;
