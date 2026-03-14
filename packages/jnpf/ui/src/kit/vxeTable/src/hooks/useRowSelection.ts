import type { VxeGridInstance } from 'vxe-table';

import type { ComputedRef, Ref } from 'vue';

import type { BasicTableProps, TableRowSelection } from '../types/table';

import { computed, ref, toRaw, unref } from 'vue';

import { findNodeAll } from '@jnpf/utils';

import { ROW_KEY } from '../const';

export function useRowSelection(propsRef: ComputedRef<BasicTableProps>, tableData: Ref<Recordable[]>, tableElRef: Ref<undefined | VxeGridInstance>) {
  const selectedRowKeysRef = ref<string[]>([]);
  const selectedRowRef = ref<Recordable[]>([]);

  const getRowSelectionRef = computed((): null | TableRowSelection => {
    const { rowSelection } = unref(propsRef);
    return rowSelection || null;
  });

  const getAutoCreateKey = computed(() => {
    return unref(propsRef).autoCreateKey && !unref(propsRef).rowKey;
  });

  const getRowKey = computed(() => {
    const { rowKey } = unref(propsRef);
    return unref(getAutoCreateKey) ? ROW_KEY : rowKey;
  });
  const getIsCheckbox = computed(() => unref(getRowSelectionRef)?.type === 'checkbox');

  function setSelectedRowKeys(rowKeys: any[]) {
    selectedRowKeysRef.value = rowKeys;
    const allSelectedRows = findNodeAll(
      [...toRaw(unref(tableData)), ...toRaw(unref(selectedRowRef))],
      (item) => rowKeys?.includes(item[unref(getRowKey) as string]),
      {
        children: propsRef.value.childrenColumnName ?? 'children',
      },
    );
    const trueSelectedRows: any[] = [];
    rowKeys?.forEach((key: string) => {
      const found = allSelectedRows.find((item) => item[unref(getRowKey) as string] === key);
      found && trueSelectedRows.push(found);
    });
    setSelectedRows(trueSelectedRows);
  }

  function setSelectedRows(rows: Recordable[]) {
    if (unref(getIsCheckbox)) {
      unref(tableElRef)?.setCheckboxRow(rows, true);
    } else {
      if (rows.length === 0) return;
      unref(tableElRef)?.setRadioRow(rows[0]);
    }
  }

  function clearSelectedRowKeys() {
    selectedRowRef.value = [];
    selectedRowKeysRef.value = [];
    unref(getIsCheckbox) ? unref(tableElRef)?.clearCheckboxRow() : unref(tableElRef)?.clearRadioRow();
  }

  function deleteSelectRowByKey(key: string) {
    if (!unref(getIsCheckbox)) return unref(tableElRef)?.clearRadioRow();
    const selectedRowKeys = unref(selectedRowKeysRef);
    const index = selectedRowKeys.indexOf(key);
    if (index !== -1) {
      unref(selectedRowKeysRef).splice(index, 1);
    }
    const allDeleteRows = findNodeAll([...toRaw(unref(tableData)), ...toRaw(unref(selectedRowRef))], (item) => key === item[unref(getRowKey) as string], {
      children: propsRef.value.childrenColumnName ?? 'children',
    });
    unref(tableElRef)?.setCheckboxRow(allDeleteRows, false);
  }

  function getSelectRowKeys() {
    getSelectRows();
    selectedRowKeysRef.value = unref(selectedRowRef).map((o) => o[unref(getRowKey) as string]);
    return unref(selectedRowKeysRef);
  }

  function getSelectRows<T = Recordable>(isFull = false) {
    if (unref(getIsCheckbox)) {
      // 4.13.3版本树形表格选择框isFull=false获取不到值
      if (unref(propsRef).isTreeTable) isFull = true;
      selectedRowRef.value = unref(tableElRef)?.getCheckboxRecords(isFull) || [];
    } else {
      selectedRowRef.value = unref(tableElRef)?.getRadioRecord(isFull) ? [unref(tableElRef)?.getRadioRecord(isFull)] : [];
    }
    return unref(selectedRowRef) as T[];
  }

  function getRowSelection() {
    return unref(getRowSelectionRef)!;
  }

  return {
    clearSelectedRowKeys,
    deleteSelectRowByKey,
    getRowSelection,
    getRowSelectionRef,
    getSelectRowKeys,
    getSelectRows,
    setSelectedRowKeys,
    setSelectedRows,
  };
}
