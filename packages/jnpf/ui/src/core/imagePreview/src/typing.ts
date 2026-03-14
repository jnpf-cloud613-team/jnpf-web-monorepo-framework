export interface Options {
  defaultWidth?: number;
  imageList: string[];
  index?: number;
  maskClosable?: boolean;
  onImgError?: ({ dom, index, url }: { dom: HTMLImageElement; index: number; url: string }) => void;
  onImgLoad?: ({ dom, index, url }: { dom: HTMLImageElement; index: number; url: string }) => void;
  rememberState?: boolean;
  scaleStep?: number;
  show?: boolean;
  zIndex?: number;
}

export interface Props {
  defaultWidth: number;
  imageList: string[];
  index: number;
  instance: Props;
  maskClosable: boolean;
  rememberState: boolean;
  scaleStep: number;
  show: boolean;
}

export interface PreviewActions {
  close: () => void;
  next: () => void;
  prev: () => void;
  resume: () => void;
  setRotate: (rotate: number) => void;
  setScale: (scale: number) => void;
}

export interface ImageProps {
  alt?: string;
  fallback?: string;
  height?: number | string;
  placeholder?: boolean | string;
  preview?:
    | boolean
    | {
        getContainer: (() => HTMLElement) | HTMLElement | string;
        onVisibleChange?: (visible: boolean, prevVisible: boolean) => void;
        visible?: boolean;
      };
  src: string;
  width: number | string;
}

export type ImageItem = ImageProps | string;
