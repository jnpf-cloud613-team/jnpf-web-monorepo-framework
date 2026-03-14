import type { ComputedRef, Ref } from 'vue';

import type { PaginationProps } from '../types/pagination';
import type { BasicTableProps, FetchParams, SorterResult } from '../types/table';

import { computed, nextTick, onMounted, reactive, ref, unref, watch, watchEffect } from 'vue';

import { buildUUID, isBoolean, isFunction, isObject } from '@jnpf/utils';

import { useTimeoutFn } from '@vueuse/core';
import { cloneDeep, get, merge } from 'lodash-es';

import { FETCH_SETTING, PAGE_SIZE, ROW_KEY } from '../const';

interface ActionType {
  clearSelectedRowKeys: () => void;
  expandAll: () => void;
  getFieldsValue: () => Recordable;
  getPaginationInfo: ComputedRef<boolean | PaginationProps>;
  getTreeConfig: ComputedRef<any>;
  setLoading: (loading: boolean) => void;
  setPagination: (info: Partial<PaginationProps>) => void;
  tableData: Ref<Recordable[]>;
}

interface SearchState {
  filterInfo: Record<string, string[]>;
  protoFilterInfo: Partial<Record<string, string[]>>;
  protoSortInfo: Recordable;
  sortInfo: Recordable;
}
export function useDataSource(
  propsRef: ComputedRef<BasicTableProps>,
  { clearSelectedRowKeys, expandAll, getFieldsValue, getPaginationInfo, getTreeConfig, setLoading, setPagination, tableData }: ActionType,
  emit: EmitType,
) {
  const searchState = reactive<SearchState>({
    filterInfo: {},
    protoFilterInfo: {},
    protoSortInfo: {},
    sortInfo: {},
  });
  const dataSourceRef = ref<Recordable[]>([]);
  const rawDataSourceRef = ref<Recordable>({});
  const fetchParams = ref<Recordable>({});

  watchEffect(() => {
    tableData.value = unref(dataSourceRef);
  });
  watch(
    () => unref(propsRef).dataSource,
    () => {
      const { api, dataSource } = unref(propsRef);
      !api && dataSource && (dataSourceRef.value = dataSource);
    },
    {
      deep: true,
      immediate: true,
    },
  );

  const getProtoFilterInfo = computed((): SorterResult => searchState.protoFilterInfo);
  const getProtoSortInfo = computed((): SorterResult => searchState.protoSortInfo);

  function handleTableChange(pagination: PaginationProps, filters: Partial<Recordable<string[]>>, sorter: SorterResult) {
    const { clearSelectOnPageChange, filterFn, sortFn } = unref(propsRef);
    if (clearSelectOnPageChange) {
      clearSelectedRowKeys();
    }
    setPagination(pagination);

    const params: Recordable = {};
    if (sorter && isFunction(sortFn)) {
      searchState.protoSortInfo = sorter;
      const sortInfo = sortFn(sorter);
      searchState.sortInfo = sortInfo;
      params.sortInfo = sortInfo;
    }

    if (filters && isFunction(filterFn)) {
      searchState.protoFilterInfo = filters;
      const filterInfo = filterFn(filters);
      searchState.filterInfo = filterInfo;
      params.filterInfo = filterInfo;
    }
    fetch(params);
  }

  function setTableKey(items: any[]) {
    if (!items || !Array.isArray(items)) return;
    items.forEach((item) => {
      if (!item[ROW_KEY]) {
        item[ROW_KEY] = buildUUID();
      }
      if (item.children && item.children.length > 0) {
        setTableKey(item.children);
      }
    });
  }

  const getAutoCreateKey = computed(() => {
    return unref(propsRef).autoCreateKey && !unref(propsRef).rowKey;
  });

  const getRowKey = computed(() => {
    const { rowKey } = unref(propsRef);
    return unref(getAutoCreateKey) ? ROW_KEY : rowKey;
  });

  const getDataSourceRef = computed(() => {
    const dataSource = unref(dataSourceRef);
    if (!dataSource || dataSource.length === 0) {
      return unref(dataSourceRef);
    }
    if (unref(getAutoCreateKey)) {
      const firstItem = dataSource[0];
      const lastItem = dataSource[dataSource.length - 1];

      if (firstItem && lastItem && (!firstItem[ROW_KEY] || !lastItem[ROW_KEY])) {
        const data = cloneDeep(unref(dataSourceRef));
        data.forEach((item) => {
          if (!item[ROW_KEY]) {
            item[ROW_KEY] = buildUUID();
          }
          if (item.children && item.children.length > 0) {
            setTableKey(item.children);
          }
        });
        dataSourceRef.value = data;
      }
    }
    return unref(dataSourceRef);
  });

  async function updateTableData(index: number, key: string, value: any) {
    const record = dataSourceRef.value[index];
    if (record) {
      (dataSourceRef.value[index] as any)[key] = value;
    }
    return dataSourceRef.value[index];
  }

  function updateTableDataRecord(rowKey: number | string, record: Recordable): Recordable | undefined {
    const row = findTableDataRecord(rowKey);

    if (row) {
      for (const field in row) {
        if (Reflect.has(record, field)) row[field] = record[field];
      }
      return row;
    }
  }

  function deleteTableDataRecord(rowKey: number | number[] | string | string[]) {
    if (!dataSourceRef.value || dataSourceRef.value.length === 0) return;
    const rowKeyName = unref(getRowKey);
    if (!rowKeyName) return;
    const rowKeys = Array.isArray(rowKey) ? rowKey : [rowKey];

    function deleteRow(data, key) {
      const row: { data: []; index: number } = findRow(data, key);
      if (row === null || row.index === -1) {
        return;
      }
      row.data.splice(row.index, 1);

      function findRow(data, key) {
        if (data === null || data === undefined) {
          return null;
        }
        for (let i = 0; i < data.length; i++) {
          const row = data[i];
          let targetKeyName: string = rowKeyName as string;
          if (isFunction(rowKeyName)) {
            targetKeyName = rowKeyName(row);
          }
          if (row[targetKeyName] === key) {
            return { data, index: i };
          }
          if (row.children?.length > 0) {
            const result = findRow(row.children, key);
            if (result != null) {
              return result;
            }
          }
        }
        return null;
      }
    }

    for (const key of rowKeys) {
      deleteRow(dataSourceRef.value, key);
      deleteRow(unref(propsRef).dataSource, key);
    }
    setPagination({
      total: unref(propsRef).dataSource?.length,
    });
  }

  function insertTableDataRecord(record: Recordable | Recordable[], index?: number): Recordable[] | undefined {
    // if (!dataSourceRef.value || dataSourceRef.value.length == 0) return;
    index = index ?? dataSourceRef.value?.length;
    const _record = isObject(record) ? [record as Recordable] : (record as Recordable[]);
    unref(dataSourceRef).splice(index, 0, ..._record);
    return unref(dataSourceRef);
  }

  function findTableDataRecord(rowKey: number | string) {
    if (!dataSourceRef.value || dataSourceRef.value.length === 0) return;

    const rowKeyName = unref(getRowKey);
    if (!rowKeyName) return;

    const { childrenColumnName = 'children' } = unref(propsRef);

    const findRow = (array: any[]) => {
      let ret;
      array.some(function iter(r) {
        if (typeof rowKeyName === 'function') {
          if ((rowKeyName(r) as string) === rowKey) {
            ret = r;
            return true;
          }
        } else {
          if (Reflect.has(r, rowKeyName) && r[rowKeyName] === rowKey) {
            ret = r;
            return true;
          }
        }
        return r[childrenColumnName] && r[childrenColumnName].some((e) => iter(e));
      });
      return ret;
    };

    // const row = dataSourceRef.value.find(r => {
    //   if (typeof rowKeyName === 'function') {
    //     return (rowKeyName(r) as string) === rowKey
    //   } else {
    //     return Reflect.has(r, rowKeyName) && r[rowKeyName] === rowKey
    //   }
    // })
    return findRow(dataSourceRef.value);
  }

  async function fetch(opt?: FetchParams) {
    const { afterFetch, api, beforeFetch, defSort, fetchSetting, pagination, searchInfo, useSearchForm } = unref(propsRef);
    if (!api || !isFunction(api)) return;
    try {
      setLoading(true);
      const { pageField, sizeField, totalField, listField } = Object.assign({}, FETCH_SETTING, fetchSetting);
      let pageParams: Recordable = {};

      const { current = 1, pageSize = PAGE_SIZE } = unref(getPaginationInfo) as PaginationProps;
      const isNoPagination = (isBoolean(pagination) && !pagination) || isBoolean(getPaginationInfo);

      if (isNoPagination) {
        pageParams = {};
      } else {
        pageParams[pageField] = (opt && opt.page) || current;
        pageParams[sizeField] = pageSize;
      }

      const { filterInfo, sortInfo = {} } = searchState;

      let params: Recordable = merge(
        pageParams,
        useSearchForm ? getFieldsValue() : {},
        searchInfo,
        opt?.searchInfo ?? {},
        defSort,
        sortInfo,
        filterInfo,
        opt?.sortInfo ?? {},
        opt?.filterInfo ?? {},
      );
      if (beforeFetch && isFunction(beforeFetch)) {
        params = (await beforeFetch(params)) || params;
      }
      fetchParams.value = params;

      const res = await api(params);
      const data = res.data;
      rawDataSourceRef.value = data;

      const isArrayResult = Array.isArray(data);

      let resultItems: Recordable[] = isArrayResult ? data : get(data, listField);
      let resultTotal: number = 0;
      if (!isNoPagination) resultTotal = isArrayResult ? data.length : get(data, totalField);

      // 假如数据变少，导致总页数变少并小于当前选中页码，通过getPaginationRef获取到的页码是不正确的，需获取正确的页码再次执行
      if (Number(resultTotal)) {
        const currentTotalPage = Math.ceil(resultTotal / pageSize);
        if (current > currentTotalPage) {
          setPagination({
            current: currentTotalPage,
          });
          return await fetch(opt);
        }
      }

      if (afterFetch && isFunction(afterFetch)) {
        resultItems = (await afterFetch(resultItems)) || resultItems;
      }
      dataSourceRef.value = resultItems;
      setPagination({
        total: resultTotal || 0,
      });
      if (opt && opt.page) {
        setPagination({
          current: opt.page || 1,
        });
      }
      emit('fetchSuccess', {
        total: resultTotal,
        items: unref(resultItems),
      });
      return resultItems;
    } catch (error) {
      emit('fetchError', error);
      dataSourceRef.value = [];
      setPagination({
        total: 0,
      });
    } finally {
      const { isTreeTable } = unref(propsRef);
      nextTick(() => {
        if (isTreeTable && unref(getTreeConfig).expandAll) expandAll();
      });
      setLoading(false);
    }
  }

  function setTableData<T = Recordable>(values: T[]) {
    dataSourceRef.value = values as [];
  }

  function getDataSource<T = Recordable>() {
    return getDataSourceRef.value as T[];
  }

  function getRawDataSource<T = Recordable>() {
    return rawDataSourceRef.value as T;
  }

  function getFetchParams<T = Recordable>() {
    return fetchParams.value as T;
  }

  async function reload(opt?: FetchParams) {
    return await fetch(opt);
  }

  onMounted(() => {
    useTimeoutFn(() => {
      unref(propsRef).immediate && fetch();
    }, 16);
  });

  return {
    deleteTableDataRecord,
    fetch,
    findTableDataRecord,
    getAutoCreateKey,
    getDataSource,
    getDataSourceRef,
    getFetchParams,
    getProtoFilterInfo,
    getProtoSortInfo,
    getRawDataSource,
    getRowKey,
    handleTableChange,
    insertTableDataRecord,
    reload,
    setTableData,
    updateTableData,
    updateTableDataRecord,
  };
}
