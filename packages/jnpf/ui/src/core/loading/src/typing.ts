export enum SizeEnum {
  DEFAULT = 'default',
  LARGE = 'large',
  SMALL = 'small',
}

export interface LoadingProps {
  absolute: boolean;
  background: string;
  loading: boolean;
  size: SizeEnum;
  theme: 'dark' | 'light';
  tip: string;
}
