import type { VxeGridInstance } from 'vxe-table';

import type { ComputedRef, Ref } from 'vue';

import type { BasicTableProps } from '../types/table';

import { ref, unref } from 'vue';

export function useTableExpand(propsRef: ComputedRef<BasicTableProps>, tableElRef: Ref<undefined | VxeGridInstance>) {
  const isExpanded = ref<boolean>(false);

  function getIsExpanded() {
    return isExpanded.value;
  }
  function expandAll() {
    isExpanded.value = true;
    unref(tableElRef)?.setAllTreeExpand(true);
  }

  function collapseAll() {
    isExpanded.value = false;
    unref(tableElRef)?.clearTreeExpand();
  }

  return { collapseAll, expandAll, getIsExpanded };
}
