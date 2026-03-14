import type { DynamicProps } from '@jnpf/utils';

import type { WatchStopHandle } from 'vue';

import type { FormActionType } from '../../../basicForm';
import type { PaginationProps } from '../types/pagination';
import type { BasicColumn, BasicTableProps, FetchParams, TableActionType } from '../types/table';

import { onUnmounted, ref, toRaw, unref, watch } from 'vue';

import { getDynamicProps } from '@jnpf/utils';

import { useAppConfig } from '@vben/hooks';

type Props = Partial<DynamicProps<BasicTableProps>>;

type UseTableMethod = TableActionType & {
  getForm: () => FormActionType;
};

const { isProdMode } = useAppConfig(import.meta.env, import.meta.env.PROD);

export function useVxeTable(tableProps?: Props): [
  (instance: TableActionType, formInstance: UseTableMethod) => void,
  TableActionType & {
    getForm: () => FormActionType;
  },
] {
  const tableRef = ref<Nullable<TableActionType>>(null);
  const loadedRef = ref<Nullable<boolean>>(false);
  const formRef = ref<Nullable<UseTableMethod>>(null);

  let stopWatch: WatchStopHandle;

  function register(instance: TableActionType, formInstance: UseTableMethod) {
    isProdMode() &&
      onUnmounted(() => {
        tableRef.value = null;
        loadedRef.value = null;
      });

    if (unref(loadedRef) && isProdMode() && instance === unref(tableRef)) return;

    tableRef.value = instance;
    formRef.value = formInstance;
    tableProps && instance.setProps(getDynamicProps(tableProps));
    loadedRef.value = true;

    stopWatch?.();

    stopWatch = watch(
      () => tableProps,
      () => {
        tableProps && instance.setProps(getDynamicProps(tableProps));
      },
      {
        deep: true,
        immediate: true,
      },
    );
  }

  function getTableInstance(): TableActionType {
    const table = unref(tableRef);
    if (!table) {
      throw new Error('The table instance has not been obtained yet, please make sure the table is presented when performing the table operation!');
    }
    return table as TableActionType;
  }

  const methods: TableActionType & {
    getForm: () => FormActionType;
  } = {
    clearSelectedRowKeys: () => {
      getTableInstance().clearSelectedRowKeys();
    },
    collapseAll: () => {
      getTableInstance().collapseAll();
    },
    deleteSelectRowByKey: (key: string) => {
      getTableInstance().deleteSelectRowByKey(key);
    },
    deleteTableDataRecord: (rowKey: number | number[] | string | string[]) => {
      return getTableInstance().deleteTableDataRecord(rowKey);
    },
    expandAll: () => {
      getTableInstance().expandAll();
    },
    findTableDataRecord: (rowKey: number | string) => {
      return getTableInstance().findTableDataRecord(rowKey);
    },
    getCacheColumns: () => {
      return toRaw(getTableInstance().getCacheColumns());
    },
    getColumns: ({ ignoreIndex = false }: { ignoreIndex?: boolean } = {}) => {
      const columns = getTableInstance().getColumns({ ignoreIndex }) || [];
      return toRaw(columns);
    },
    getDataSource: () => {
      return getTableInstance().getDataSource();
    },
    getFetchParams: () => {
      return getTableInstance().getFetchParams();
    },
    getForm: () => {
      return unref(formRef) as unknown as FormActionType;
    },
    getIsExpanded: () => {
      return getTableInstance().getIsExpanded();
    },
    getPaginationRef: () => {
      return getTableInstance().getPaginationRef();
    },
    getRawDataSource: () => {
      return getTableInstance().getRawDataSource();
    },
    getRowSelection: () => {
      return toRaw(getTableInstance().getRowSelection());
    },
    getSelectRowKeys: () => {
      return toRaw(getTableInstance().getSelectRowKeys());
    },
    getSelectRows: () => {
      return toRaw(getTableInstance().getSelectRows());
    },
    getShowPagination: () => {
      return toRaw(getTableInstance().getShowPagination());
    },
    getSize: () => {
      return toRaw(getTableInstance().getSize());
    },
    getVxeTableRef: () => {
      return getTableInstance().getVxeTableRef();
    },
    insertTableDataRecord: (record: Recordable | Recordable[], index?: number) => {
      return getTableInstance().insertTableDataRecord(record, index);
    },
    redoHeight: () => {
      getTableInstance().redoHeight();
    },
    reload: async (opt?: FetchParams) => {
      const columns = getTableInstance().getColumns();
      if (columns.some((o) => o.type == 'expand')) {
        getTableInstance()?.getVxeTableRef()?.clearRowExpand();
      }
      return await getTableInstance().reload(opt);
    },
    setColumns: (columns: BasicColumn[] | string[]) => {
      getTableInstance().setColumns(columns);
    },
    setLoading: (loading: boolean) => {
      getTableInstance().setLoading(loading);
    },
    setPagination: (info: Partial<PaginationProps>) => {
      return getTableInstance().setPagination(info);
    },
    setProps: (props: Partial<BasicTableProps>) => {
      getTableInstance().setProps(props);
    },
    setSelectedRowKeys: (keys: number[] | string[]) => {
      getTableInstance().setSelectedRowKeys(keys);
    },
    setSelectedRows: (rows: Recordable[]) => {
      return toRaw(getTableInstance().setSelectedRows(rows));
    },
    setShowPagination: async (show: boolean) => {
      getTableInstance().setShowPagination(show);
    },
    setTableData: (values: any[]) => {
      return getTableInstance().setTableData(values);
    },
    updateTableData: (index: number, key: string, value: any) => {
      return getTableInstance().updateTableData(index, key, value);
    },
    updateTableDataRecord: (rowKey: number | string, record: Recordable) => {
      return getTableInstance().updateTableDataRecord(rowKey, record);
    },
  };

  return [register, methods];
}
