import type { ComputedRef } from 'vue';

import { inject } from 'vue';

export interface IUseOptions {
  currentColor: ComputedRef<string>;
}

export const OPTIONS_KEY = Symbol('OPTIONS_KEY');

export const useOptions = () => {
  return inject<IUseOptions>(OPTIONS_KEY);
};
