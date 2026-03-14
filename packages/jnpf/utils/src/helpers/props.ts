// copy from element-plus

import type { ComputedRef, ExtractPropTypes, PropType, Ref } from 'vue';

import { unref, warn } from 'vue';

import { isObject } from '@vben/utils';

import { fromPairs } from 'lodash-es';

const wrapperKey = Symbol('wrapperKey');
export type PropWrapper<T> = { [wrapperKey]: T };

export const propKey = Symbol('propKey');

type IfUnknown<T, V> = [unknown] extends [T] ? V : T;
type ResolveProp<T> = ExtractPropTypes<{
  key: { required: true; type: T };
}>['key'];
type ResolvePropType<T> = ResolveProp<T> extends { type: infer V } ? V : ResolveProp<T>;
type ResolvePropTypeWithReadonly<T> = Readonly<T> extends Readonly<Array<infer A>> ? ResolvePropType<A[]> : ResolvePropType<T>;
type _BuildPropType<T, V, C> = C | (T extends PropWrapper<unknown> ? T[typeof wrapperKey] : [V] extends [never] ? ResolvePropTypeWithReadonly<T> : never) | V;

export type BuildPropType<T, V, C> = _BuildPropType<IfUnknown<T, never>, IfUnknown<V, never>, IfUnknown<C, never>>;

export type BuildPropOption<T, D extends BuildPropType<T, V, C>, R, V, C> = {
  default?: R extends true ? never : D extends Array<any> | Record<string, unknown> ? () => D : (() => D) | D;
  required?: R;
  type?: T;
  validator?: ((val: any) => boolean) | ((val: any) => val is C);
  values?: readonly V[];
};

type _BuildPropDefault<T, D> = [T] extends [
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  Array<any> | Function | Record<string, unknown>,
]
  ? D
  : D extends () => T
    ? ReturnType<D>
    : D;

export type BuildPropDefault<T, D, R> = R extends true
  ? { readonly default?: undefined }
  : {
      readonly default: Exclude<D, undefined> extends never ? undefined : Exclude<_BuildPropDefault<T, D>, undefined>;
    };
export type BuildPropReturn<T, D, R, V, C> = BuildPropDefault<BuildPropType<T, V, C>, IfUnknown<D, never>, IfUnknown<R, false>> & {
  [propKey]: true;
  readonly required: IfUnknown<R, false>;
  readonly type: PropType<BuildPropType<T, V, C>>;
  readonly validator: ((val: unknown) => boolean) | undefined;
};

/**
 * @description Build prop. It can better optimize prop types
 * @description 生成 prop，能更好地优化类型
 * @example
  // limited options
  // the type will be PropType<'light' | 'dark'>
  buildProp({
    type: String,
    values: ['light', 'dark'],
  } as const)
  * @example
  // limited options and other types
  // the type will be PropType<'small' | 'medium' | number>
  buildProp({
    type: [String, Number],
    values: ['small', 'medium'],
    validator: (val: unknown): val is number => typeof val === 'number',
  } as const)
  @link see more: https://github.com/element-plus/element-plus/pull/3341
 */
export function buildProp<T = never, D extends BuildPropType<T, V, C> = never, R extends boolean = false, V = never, C = never>(
  option: BuildPropOption<T, D, R, V, C>,
  key?: string,
): BuildPropReturn<T, D, R, V, C> {
  // filter native prop type and nested prop, e.g `null`, `undefined` (from `buildProps`)
  if (!isObject(option) || !!option[propKey]) return option as any;

  const { default: defaultValue, required, type, validator, values } = option;

  const _validator =
    values || validator
      ? (val: unknown) => {
          let valid = false;
          let allowedValues: unknown[] = [];

          if (values) {
            allowedValues = [...values, defaultValue];
            valid || (valid = allowedValues.includes(val));
          }
          if (validator) valid || (valid = validator(val));

          if (!valid && allowedValues.length > 0) {
            const allowValuesText = [...new Set(allowedValues)].map((value) => JSON.stringify(value)).join(', ');
            warn(`Invalid prop: validation failed${key ? ` for prop "${key}"` : ''}. Expected one of [${allowValuesText}], got value ${JSON.stringify(val)}.`);
          }
          return valid;
        }
      : undefined;

  return {
    default: defaultValue,
    [propKey]: true,
    required: !!required,
    type: typeof type === 'object' && Object.getOwnPropertySymbols(type).includes(wrapperKey) ? (type as any)[wrapperKey] : type,
    validator: _validator,
  } as unknown as BuildPropReturn<T, D, R, V, C>;
}

type NativePropType = [((...args: any) => any) | null | undefined | { new (...args: any): any }];

export const buildProps = <
  O extends {
    [K in keyof O]: O[K] extends BuildPropReturn<any, any, any, any, any>
      ? O[K]
      : [O[K]] extends NativePropType
        ? O[K]
        : O[K] extends BuildPropOption<infer T, infer D, infer R, infer V, infer C>
          ? D extends BuildPropType<T, V, C>
            ? BuildPropOption<T, D, R, V, C>
            : never
          : never;
  },
>(
  props: O,
) =>
  fromPairs(Object.entries(props).map(([key, option]) => [key, buildProp(option as any, key)])) as unknown as {
    [K in keyof O]: O[K] extends { [propKey]: boolean }
      ? O[K]
      : [O[K]] extends NativePropType
        ? O[K]
        : O[K] extends BuildPropOption<infer T, infer _D, infer R, infer V, infer C>
          ? BuildPropReturn<T, O[K]['default'], R, V, C>
          : never;
  };

export const definePropType = <T>(val: any) => ({ [wrapperKey]: val }) as PropWrapper<T>;

export const keyOf = <T>(arr: T) => Object.keys(arr as any) as Array<keyof T>;

type Mutable<T> = { -readonly [P in keyof T]: T[P] };
export const mutable = <T extends readonly any[] | Record<string, unknown>>(val: T) => val as Mutable<typeof val>;

export const componentSize = ['large', 'medium', 'small', 'mini'] as const;

// dynamic use hook props
export type DynamicProps<T> = {
  [P in keyof T]: ComputedRef<T[P]> | Ref<T[P]> | T[P];
};
export function getDynamicProps<T extends Record<string, unknown>, U>(props: T): Partial<U> {
  const ret: Recordable = {};

  Object.keys(props).map((key) => {
    ret[key] = unref((props as Recordable)[key]);
    return key;
  });

  return ret as Partial<U>;
}
