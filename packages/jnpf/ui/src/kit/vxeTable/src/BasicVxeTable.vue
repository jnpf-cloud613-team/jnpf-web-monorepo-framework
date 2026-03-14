<!-- eslint-disable no-useless-call -->
<script lang="ts">
import type { VxeGridInstance } from 'vxe-table';

import type { CSSProperties } from 'vue';

import type { BasicTableProps, ColumnChangeParam, TableActionType } from './types/table';

import { computed, defineComponent, ref, toRaw, unref } from 'vue';

import { isFunction, isNumber } from '@jnpf/utils';

import { Empty, Pagination, Spin } from 'ant-design-vue';
import { omit } from 'lodash-es';
import { Grid as VxeGrid } from 'vxe-table';

import { BasicForm, useForm } from '../../basicForm';
import TableHeader from './components/TableHeader.vue';
import { useColumns } from './hooks/useColumns';
import { useDataSource } from './hooks/useDataSource';
import { useLoading } from './hooks/useLoading';
import { usePagination } from './hooks/usePagination';
import { useRowSelection } from './hooks/useRowSelection';
import { createTableContext } from './hooks/useTableContext';
import { useTableExpand } from './hooks/useTableExpand';
import { useTableForm } from './hooks/useTableForm';
import { basicProps } from './props';

import 'vxe-table/styles/cssvar.scss';
import 'vxe-pc-ui/styles/cssvar.scss';

export default defineComponent({
  components: {
    ASpin: Spin,
    BasicForm,
    Empty,
    Pagination,
    TableHeader,
    VxeGrid,
  },
  emits: ['fetchSuccess', 'fetchError', 'register', 'change', 'columnsChange', 'selectionChange'],
  inheritAttrs: false,
  name: 'BasicVxeTable',
  props: basicProps,
  setup(props, { attrs, emit, expose, slots }) {
    const defaultTreeConfig = { hasChild: 'hasChildren', childrenField: 'children' };

    const simpleImage = ref(Empty.PRESENTED_IMAGE_SIMPLE);
    const tableElRef = ref<VxeGridInstance>();
    const tableData = ref<Recordable[]>([]);

    const wrapRef = ref(null);
    const formRef = ref(null);
    const innerPropsRef = ref<Partial<BasicTableProps>>();

    const prefixCls = 'jnpf-vxe-table';
    const [registerForm, formActions] = useForm();

    const getProps = computed(() => {
      return { ...props, ...unref(innerPropsRef) } as BasicTableProps;
    });
    const getHideTitle = computed(() => {
      return !slots.tableTitle && !slots.toolbar && !slots.toolbarAfter && !unref(getProps).showTableSetting;
    });
    const getTreeConfig = computed(() => {
      if (!unref(getProps).isTreeTable) return null;
      return { ...defaultTreeConfig, expandAll: props.defaultExpandAllRows, ...unref(getProps).treeConfig };
    });
    const getBindValues = computed(() => {
      const dataSource = unref(getDataSourceRef);
      const propsData: Recordable = {
        ...attrs,
        ...unref(getProps),
        columns: toRaw(unref(getViewColumns)),
        data: dataSource,
      };
      return propsData;
    });
    const getGridOptions = computed(() => {
      const defaultRowConfig = { keyField: unref(getRowKey), useKey: true };
      const sortConfig = { ...unref(getBindValues)?.sortConfig, trigger: 'cell' };

      const propsData: Recordable = {
        ...omit(unref(getBindValues), ['loading', 'treeConfig', 'rowKey']),
        autoResize: true,
        border: unref(getBindValues).border || 'inner',
        height: 'auto',
        onFilterChange,
        onSortChange,
        resizeConfig: { refreshDelay: 0 },
        rowConfig: {
          ...defaultRowConfig,
          ...unref(getBindValues).rowConfig,
        },
        sortConfig,
      };
      // 树形配置
      if (propsData.isTreeTable) propsData.treeConfig = unref(getTreeConfig);
      // 表格合并和展开行，不支持虚拟滚动
      if (Reflect.has(propsData, 'spanMethod') || propsData.expandConfig) {
        propsData.virtualYConfig = { enabled: false };
      }
      if (propsData.clickToRowSelect && propsData.rowSelection) {
        const isCheckbox = propsData.rowSelection.type === 'checkbox';
        if (isCheckbox) {
          propsData.checkboxConfig = {
            ...(Reflect.has(propsData, 'checkboxConfig') ? propsData.checkboxConfig : {}),
            trigger: 'row',
          };
          propsData.onCheckboxChange = () => emit('selectionChange', { keys: getSelectRowKeys(), rows: getSelectRows() });
        } else {
          propsData.radioConfig = {
            ...(Reflect.has(propsData, 'radioConfig') ? propsData.radioConfig : {}),
            trigger: 'row',
          };
          propsData.onRadioChange = () => emit('selectionChange', { keys: getSelectRowKeys(), rows: getSelectRows() });
        }
      }
      return propsData;
    });

    const getWrapperClass = computed(() => {
      const values = unref(getBindValues);
      return [
        prefixCls,
        attrs.class,
        {
          [`${prefixCls}-form-container`]: values.useSearchForm,
        },
      ];
    });
    const getWrapperStyle = computed((): CSSProperties => {
      const values = unref(getBindValues);
      const height: number | string = values.height ? (isNumber(values.height) ? `${values.height}px` : values.height) : '100%';
      const minHeight = values.minHeight ? (isNumber(values.minHeight) ? `${values.minHeight}px` : values.minHeight) : '144px';
      return { height, minHeight };
    });

    const { getLoading, setLoading } = useLoading(getProps);
    const { getPagination, getPaginationInfo, getShowPagination, setPagination, setShowPagination } = usePagination(getProps);

    const { clearSelectedRowKeys, deleteSelectRowByKey, getRowSelection, getSelectRowKeys, getSelectRows, setSelectedRowKeys, setSelectedRows } =
      useRowSelection(getProps, tableData, tableElRef);

    const { collapseAll, expandAll, getIsExpanded } = useTableExpand(getProps, tableElRef);

    const {
      deleteTableDataRecord,
      fetch,
      findTableDataRecord,
      getDataSource,
      getDataSourceRef,
      getFetchParams,
      getProtoFilterInfo,
      getProtoSortInfo,
      getRawDataSource,
      getRowKey,
      handleTableChange: onTableChange,
      insertTableDataRecord,
      reload,
      setTableData,
      updateTableData,
      updateTableDataRecord,
    } = useDataSource(
      getProps,
      {
        clearSelectedRowKeys,
        expandAll,
        getFieldsValue: formActions.getFieldsValue,
        getPaginationInfo,
        getTreeConfig,
        setLoading,
        setPagination,
        tableData,
      },
      emit as any,
    );

    const { getCacheColumns, getColumns, getViewColumns, setCacheColumns, setCacheColumnsByField, setColumns } = useColumns(getProps, getPaginationInfo);

    // 列设置改变
    const onColumnsChange = (data: ColumnChangeParam[]) => {
      unref(tableElRef)?.refreshColumn();
      emit('columnsChange', data);
    };
    // 分页器改变
    const onPaginationChange = (current, pageSize) => {
      const pagination = { current, pageSize };
      const filters = unref(getProtoFilterInfo);
      const sorter = unref(getProtoSortInfo);
      handleTableChange(pagination, filters, sorter, { action: 'paginate' });
    };
    // 过滤改变
    const onFilterChange = ({ property, values }) => {
      const pagination: any = unref(getPaginationInfo) ? unref(getPaginationInfo) : {};
      const filters = { [property]: values };
      const sorter = unref(getProtoSortInfo);
      handleTableChange(pagination, filters, sorter, { action: 'filter' });
    };
    // 排序改变
    const onSortChange = ({ sortList }) => {
      const pagination: any = unref(getPaginationInfo) ? unref(getPaginationInfo) : {};
      const filters = unref(getProtoFilterInfo);
      const sorter = sortList;
      handleTableChange(pagination, filters, sorter, { action: 'sort' });
    };
    function handleTableChange(...args: [any, any, any, any]) {
      onTableChange.call(undefined, ...(args.splice(0, 3) as [any, any, any]));
      emit('change', ...args);
      // 解决通过useTable注册onChange时不起作用的问题
      const { onChange } = unref(getProps);
      onChange && isFunction(onChange) && onChange.call(undefined, ...args);
    }
    // 切换全选
    function toggleAllCheckboxEvent() {
      unref(tableElRef)?.toggleAllCheckboxRow();
      emit('selectionChange', { keys: getSelectRowKeys(), rows: getSelectRows() });
    }
    // 多选框切换
    function toggleCheckboxEvent(row, disabled) {
      if (disabled || unref(getProps).clickToRowSelect) return;
      unref(tableElRef)?.toggleCheckboxRow(row);
      emit('selectionChange', { keys: getSelectRowKeys(), rows: getSelectRows() });
    }
    // 单选选中
    function setRadioSelectRow(row, disabled) {
      if (disabled || unref(getProps).clickToRowSelect) return;
      unref(tableElRef)?.setRadioRow(row);
      emit('selectionChange', { keys: getSelectRowKeys(), rows: getSelectRows() });
    }
    function redoHeight() {
      unref(tableElRef)?.recalculate();
    }
    function getVxeTableRef() {
      return unref(tableElRef);
    }

    const { getFormProps, getFormSlotKeys, handleSearchInfoChange, replaceFormSlotKey } = useTableForm(getProps, slots, fetch);

    function setProps(props: Partial<BasicTableProps>) {
      innerPropsRef.value = { ...unref(innerPropsRef), ...props };
    }

    const tableAction: TableActionType = {
      clearSelectedRowKeys,
      collapseAll,
      deleteSelectRowByKey,
      deleteTableDataRecord,
      emit: emit as any,
      expandAll,
      findTableDataRecord,
      getCacheColumns,
      getColumns,
      getDataSource,
      getFetchParams,
      getIsExpanded,
      getPaginationRef: getPagination,
      getRawDataSource,
      getRowSelection,
      getSelectRowKeys,
      getSelectRows,
      getShowPagination,
      getSize: () => {
        return unref(getBindValues).size;
      },
      getVxeTableRef,
      insertTableDataRecord,
      redoHeight,
      reload,
      setCacheColumns,
      setCacheColumnsByField,
      setColumns,
      setLoading,
      setPagination,
      setProps,
      setSelectedRowKeys,
      setSelectedRows,
      setShowPagination,
      setTableData,
      updateTableData,
      updateTableDataRecord,
    };
    createTableContext({ ...tableAction, getBindValues, wrapRef });

    expose(tableAction);

    emit('register', tableAction, formActions);

    return {
      columns: getViewColumns,
      formRef,
      getBindValues,
      getDataSourceRef,
      getFormProps: getFormProps as any,
      getFormSlotKeys,
      getGridOptions,
      getHideTitle,
      getLoading,
      getPaginationInfo,
      getWrapperClass,
      getWrapperStyle,
      handleSearchInfoChange,
      handleTableChange,
      onColumnsChange,
      onPaginationChange,
      prefixCls,
      redoHeight,
      registerForm,
      replaceFormSlotKey,
      setRadioSelectRow,
      simpleImage,
      tableAction,
      tableElRef,
      toggleAllCheckboxEvent,
      toggleCheckboxEvent,
      wrapRef,
    };
  },
});
</script>
<template>
  <div ref="wrapRef" :class="getWrapperClass" :style="getWrapperStyle">
    <BasicForm
      ref="formRef"
      submit-on-reset
      v-bind="getFormProps"
      v-if="getBindValues.useSearchForm"
      :table-action="tableAction"
      class="search-form"
      @advanced-change="redoHeight"
      @register="registerForm"
      @submit="handleSearchInfoChange">
      <template v-for="item in getFormSlotKeys" #[replaceFormSlotKey(item)]="data">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </BasicForm>
    <ASpin :spinning="getLoading" :wrapper-class-name="`${prefixCls}-wrapper`">
      <div class="jnpf-table-main">
        <VxeGrid ref="tableElRef" v-bind="getGridOptions">
          <template #top>
            <TableHeader v-bind="getBindValues" v-if="!getHideTitle" @columns-change="onColumnsChange">
              <template v-for="item in Object.keys($slots)" #[item]="data">
                <slot :name="item" v-bind="data ? { ...data, record: data.row, index: data.rowIndex } : {}"></slot>
              </template>
            </TableHeader>
          </template>
          <template v-for="item in Object.keys($slots)" :key="item" #[item]="data">
            <slot :name="item" v-bind="data ? { ...data, record: data.row, index: data.rowIndex } : {}" v-if="item !== 'toolbar'"></slot>
          </template>
          <template #checkboxHeader="{ checked, indeterminate, disabled }">
            <a-checkbox disabled v-if="!getDataSourceRef.length" />
            <a-checkbox :checked="checked" :disabled="disabled" :indeterminate="indeterminate" @change="toggleAllCheckboxEvent" v-else />
          </template>
          <template #checkboxDefault="{ row, checked, indeterminate, disabled }">
            <span class="select-column-box" :class="{ 'select-column-box-disabled': disabled }" @click="toggleCheckboxEvent(row, disabled)">
              <a-checkbox :checked="checked" :disabled="disabled" :indeterminate="indeterminate" />
            </span>
          </template>
          <template #radioDefault="{ row, checked, disabled }">
            <span class="select-column-box" :class="{ 'select-column-box-disabled': disabled }" @click="setRadioSelectRow(row, disabled)">
              <a-radio :checked="checked" :disabled="disabled" />
            </span>
          </template>
          <template #empty>
            <Empty :image="simpleImage" />
          </template>
          <template v-if="!!getPaginationInfo" #pager>
            <Pagination v-bind="getPaginationInfo" @change="onPaginationChange" />
          </template>
        </VxeGrid>
      </div>
    </ASpin>
  </div>
</template>

<style lang="scss">
.jnpf-vxe-table {
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 100%;

  .select-column-box {
    position: relative;
    display: inline-block;
    margin-left: 2px;
    overflow: hidden;
    vertical-align: middle;
    text-align: center;
    cursor: pointer;

    &.select-column-box-disabled {
      cursor: not-allowed;
    }

    .ant-radio-wrapper {
      margin-inline-end: 0;
    }

    &::after {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      display: block;
      width: 100%;
      height: 100%;
      content: '';
    }
  }

  &-form-container {
    .ant-form {
      width: 100%;
      padding: 10px 10px 0;
      margin-bottom: 10px;
      background-color: var(--component-background);
    }
  }

  &-pagination {
    flex-shrink: 0;

    .ant-pagination {
      display: flex;
      flex-wrap: wrap;
      row-gap: 8px;
      justify-content: flex-end;
      padding: 0 10px 10px;
      margin: 10px 0 0;
    }
  }

  .jnpf-vxe-table-wrapper {
    flex: 1;
    overflow: hidden;
    background-color: var(--component-background);
    border-radius: var(--radius);

    .ant-spin-container {
      display: flex;
      flex-direction: column;
      height: 100%;

      .jnpf-table-main {
        // ------解决vxeTable重新计算高度缓慢问题------
        position: absolute;
        // ------解决vxeTable重新计算高度缓慢问题------
        flex: 1 1 0;
        width: 100%;
        height: 100%;
      }

      .vxe-grid--pager-wrapper {
        padding: 10px;
        text-align: right;
      }
    }

    .vxe-table--render-default {
      .vxe-body--row-expanded-place-column {
        border-bottom: 0 !important;
      }
    }

    .vxe-body--row-expanded-cell {
      .ant-tabs-nav {
        margin: 0;
      }
    }
  }

  // ------解决vxeTable树形展开字段为空时不显示展开图标------
  .vxe-cell--wrapper {
    min-height: 22px;

    .vxe-cell--tree-node {
      min-height: 22px;
    }
  }

  .vxe-cell {
    overflow: hidden;

    .ant-tag {
      margin-right: 0;
    }

    .vxe-cell--sort {
      height: auto !important;
    }
  }

  .ant-select-auto-complete {
    width: 100%;
  }
  // ------解决vxeTable固定列与expand内容（展开行）的兼容性问题------
  .vxe-body--expanded-cell {
    z-index: 100;
    background-color: var(--component-background);
  }
}
</style>
