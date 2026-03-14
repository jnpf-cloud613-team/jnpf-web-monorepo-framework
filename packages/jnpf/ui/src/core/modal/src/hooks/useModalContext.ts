import type { InjectionKey } from 'vue';

import { createContext, useContext } from '@jnpf/hooks';

export interface ModalContextProps {
  redoModalHeight: () => void;
}

const key: InjectionKey<ModalContextProps> = Symbol('key');

export function createModalContext(context: ModalContextProps) {
  return createContext<ModalContextProps>(context, key);
}

export function useModalContext() {
  return useContext<ModalContextProps>(key);
}
