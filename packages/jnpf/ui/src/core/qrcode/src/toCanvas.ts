import type { RenderQrCodeParams } from './typing';

import { renderQrCode } from './drawCanvas';
import { drawLogo } from './drawLogo';

export const toCanvas = (options: RenderQrCodeParams) => {
  return renderQrCode(options)
    .then(() => {
      return options;
    })
    .then(drawLogo) as Promise<string>;
};
