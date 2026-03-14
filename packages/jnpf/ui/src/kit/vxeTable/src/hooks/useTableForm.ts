import type { ComputedRef, Slots } from 'vue';

import type { FormProps } from '../../../basicForm';
import type { BasicTableProps, FetchParams } from '../types/table';

import { computed, unref } from 'vue';

import { isFunction } from '@jnpf/utils';

export function useTableForm(
  propsRef: ComputedRef<BasicTableProps>,
  slots: Slots,
  fetch: (opt?: FetchParams | undefined) => Promise<Recordable<any>[] | undefined>,
) {
  const getFormProps = computed((): Partial<FormProps> => {
    const { formConfig } = unref(propsRef);
    const { submitButtonOptions } = formConfig || {};
    return {
      baseColProps: { span: 6 },
      showActionButtonGroup: true,
      showAdvancedButton: true,
      ...formConfig,
      compact: true,
      labelAlign: 'left',
      submitButtonOptions: { loading: false, ...submitButtonOptions },
    };
  });

  const getFormSlotKeys: ComputedRef<string[]> = computed(() => {
    const keys = Object.keys(slots);
    return keys.map((item) => (item.startsWith('form-') ? item : null)).filter((item) => !!item) as string[];
  });

  function replaceFormSlotKey(key: string) {
    if (!key) return '';
    return key?.replace?.(/form-/, '') ?? '';
  }

  function handleSearchInfoChange(info: Recordable) {
    const { handleSearchInfoFn } = unref(propsRef);
    if (handleSearchInfoFn && isFunction(handleSearchInfoFn)) {
      info = handleSearchInfoFn(info) || info;
    }
    fetch({ page: 1, searchInfo: info });
  }

  return {
    getFormProps,
    getFormSlotKeys,
    handleSearchInfoChange,
    replaceFormSlotKey,
  };
}
