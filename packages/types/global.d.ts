import type { RouteMeta as IRouteMeta } from '@vben-core/typings';

import 'vue-router';

declare module 'vue-router' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface RouteMeta extends IRouteMeta {}
}

export interface JnpfAdminProAppConfigRaw {
  VITE_GLOB_API_URL: string;
  VITE_GLOB_REPORT_API_URL: string;
  VITE_GLOB_WEBSOCKET_URL: string;
}

export interface ApplicationConfig {
  apiURL: string;
  reportApiURL: string;
  webSocketURL: string;
  isDevMode: () => boolean;
  isProdMode: () => boolean;
}

declare global {
  interface Window {
    _JNPF_ADMIN_PRO_APP_CONF_: JnpfAdminProAppConfigRaw;
  }
  namespace JSX {
    // tslint:disable no-empty-interface
    type Element = VNode;
    // tslint:disable no-empty-interface
    type ElementClass = ComponentRenderProxy;
    interface ElementAttributesProperty {
      $props: any;
    }
    interface IntrinsicElements {
      [elem: string]: any;
    }
    interface IntrinsicAttributes {
      [elem: string]: any;
    }
  }
  // vue
  declare type PropType<T> = VuePropType<T>;
  declare type VueNode = JSX.Element | VNodeChild;

  export type Writable<T> = {
    -readonly [P in keyof T]: T[P];
  };

  declare type Nullable<T> = null | T;
  declare type NonNullable<T> = T extends null | undefined ? never : T;
  declare type Recordable<T = any> = Record<string, T>;
  declare type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T;
  };
  declare interface Fn<T = any, R = T> {
    (...arg: T[]): R;
  }
  declare type EmitType = (event: string, ...args: any[]) => void;
}

declare interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}

declare interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>;
}

declare type RefType<T> = null | T;

declare type LabelValueOptions = {
  [key: string]: boolean | number | string;
  label: string;
  value: any;
}[];

declare type TargetContext = '_blank' | '_self';

declare interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
  $el: T;
}

declare type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null;

declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;
