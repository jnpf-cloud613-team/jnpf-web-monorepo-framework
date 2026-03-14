import type { QRCodeRenderersOptions, QRCodeSegment } from 'qrcode';

export type ContentType = QRCodeSegment[] | string;

export type { QRCodeRenderersOptions };

export type LogoType = {
  bgColor: string;
  borderColor: string;
  borderRadius: number;
  borderSize: number;
  crossOrigin: string;
  logoRadius: number;
  logoSize: number;
  src: string;
};

export interface RenderQrCodeParams {
  canvas: any;
  content: ContentType;
  download?: boolean | Fn;
  downloadName?: string;
  image?: HTMLImageElement;
  logo?: LogoType | string;
  options?: QRCodeRenderersOptions;
  width?: number;
}

export type ToCanvasFn = (options: RenderQrCodeParams) => Promise<unknown>;

export interface QrCodeActionType {
  download: (fileName?: string) => void;
}

export interface QrcodeDoneEventParams {
  ctx?: CanvasRenderingContext2D | null;
  url: string;
}
