import type { InjectionKey } from 'vue';

import { createContext, useContext } from '@jnpf/hooks';

export interface FormContextProps {
  resetAction: () => Promise<void>;
  submitAction: () => Promise<void>;
}

const key: InjectionKey<FormContextProps> = Symbol('key');

export function createFormContext(context: FormContextProps) {
  return createContext<FormContextProps>(context, key);
}

export function useFormContext() {
  return useContext<FormContextProps>(key);
}
