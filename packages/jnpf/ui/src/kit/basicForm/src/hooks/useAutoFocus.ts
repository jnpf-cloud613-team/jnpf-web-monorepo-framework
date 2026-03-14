import type { ComputedRef, Ref } from 'vue';

import type { FormActionType, FormProps, FormSchema } from '../types/form';

import { nextTick, unref, watchEffect } from 'vue';

interface UseAutoFocusContext {
  formElRef: Ref<FormActionType>;
  getProps: ComputedRef<FormProps>;
  getSchema: ComputedRef<FormSchema[]>;
  isInitedDefault: Ref<boolean>;
}
export async function useAutoFocus({ formElRef, getProps, getSchema, isInitedDefault }: UseAutoFocusContext) {
  watchEffect(async () => {
    if (unref(isInitedDefault) || !unref(getProps).autoFocusFirstItem) {
      return;
    }
    await nextTick();
    const schemas = unref(getSchema);
    const formEl = unref(formElRef);
    const el = (formEl as any)?.$el as HTMLElement;
    if (!formEl || !el || !schemas || schemas.length === 0) {
      return;
    }

    const firstItem: any = schemas[0];
    // Only open when the first form item is input type
    if (!firstItem.component.includes('Input')) {
      return;
    }

    const inputEl = el.querySelector('.ant-row:first-child input') as Nullable<HTMLInputElement>;
    if (!inputEl) return;
    inputEl?.focus();
  });
}
