import type { Ref } from 'vue';

import { getCurrentInstance, reactive, shallowRef, watchEffect } from 'vue';

import { camelCase } from 'lodash-es';

interface Params {
  excludeDefaultKeys?: boolean;
  excludeKeys?: string[];
  excludeListeners?: boolean;
  isCamelCase?: boolean;
}

const DEFAULT_EXCLUDE_KEYS = ['class', 'style'];
const LISTENER_PREFIX = /^on[A-Z]/;

function entries<T>(obj: Recordable<T>): [string, T | undefined][] {
  return Object.keys(obj).map((key: string) => [key, obj[key]]);
}

export function useAttrs(params: Params = {}): object | Ref<Recordable> {
  const instance = getCurrentInstance();
  if (!instance) return {};

  const {
    excludeDefaultKeys = true,
    excludeKeys = [],
    excludeListeners = false,
    isCamelCase = true, // 是否默认转驼峰
  } = params;
  const attrs = shallowRef({});
  const allExcludeKeys = new Set([...(excludeDefaultKeys ? DEFAULT_EXCLUDE_KEYS : []), ...excludeKeys]);

  // Since attrs are not reactive, make it reactive instead of doing in `onUpdated` hook for better performance
  instance.attrs = reactive(instance.attrs);

  watchEffect(() => {
    const res = entries(instance.attrs).reduce((acm, [key, val]) => {
      if (!allExcludeKeys.has(key) && !(excludeListeners && LISTENER_PREFIX.test(key))) {
        const realKey = isCamelCase && !key.includes(':') ? camelCase(key) : key;
        acm[realKey] = val;
      }

      return acm;
    }, {} as Recordable);

    attrs.value = res;
  });

  return attrs;
}
