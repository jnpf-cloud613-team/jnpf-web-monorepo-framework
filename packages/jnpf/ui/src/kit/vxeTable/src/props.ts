import type { VxeTablePropTypes } from 'vxe-table';

import type { PropType } from 'vue';

import type { FormProps } from '../../basicForm';
import type { PaginationProps } from './types/pagination';
import type { BasicColumn, FetchSetting, SorterResult, TableCustomRecord, TableRowSelection, TableSetting } from './types/table';

import { propTypes } from '@jnpf/utils';

import { DEFAULT_FILTER_FN, DEFAULT_SIZE, DEFAULT_VXE_SORT_FN, FETCH_SETTING } from './const';

export const basicProps = {
  actionColumn: {
    default: null,
    type: Object as PropType<BasicColumn>,
  },
  afterFetch: {
    default: null,
    type: Function as PropType<Fn>,
  },
  api: {
    default: null,
    type: Function as PropType<(...arg: any[]) => Promise<any>>,
  },
  autoCreateKey: { default: true, type: Boolean },
  beforeFetch: {
    default: null,
    type: Function as PropType<Fn>,
  },
  bordered: propTypes.bool,
  clearSelectOnPageChange: propTypes.bool,
  clickToRowSelect: { type: Boolean, default: true },
  columns: {
    default: () => [],
    type: Array as PropType<BasicColumn[]>,
  },
  dataSource: {
    default: null,
    type: Array as PropType<Recordable[]>,
  },
  defaultExpandAllRows: { default: true, type: Boolean },
  // 默认的排序参数
  defSort: {
    default: null,
    type: Object as PropType<Recordable>,
  },
  ellipsis: { default: true, type: Boolean },
  expandConfig: {
    default: () => null,
    type: Object as PropType<VxeTablePropTypes.ExpandConfig>,
  },
  fetchSetting: {
    default: () => {
      return FETCH_SETTING;
    },
    type: Object as PropType<FetchSetting>,
  },
  filterFn: {
    default: DEFAULT_FILTER_FN,
    type: Function as PropType<(data: Partial<Recordable<string[]>>) => any>,
  },
  footerMethod: {
    default: null,
    type: [Function, Array] as PropType<(...arg: any[]) => any[]>,
  },
  // 表单配置
  formConfig: {
    default: null,
    type: Object as PropType<Partial<FormProps>>,
  },
  handleSearchInfoFn: {
    default: null,
    type: Function as PropType<Fn>,
  },
  height: { default: '100%', type: [Number, String] },
  // 立即请求接口
  immediate: { default: true, type: Boolean },
  indentSize: propTypes.number.def(24),
  indexColumnProps: {
    default: null,
    type: Object as PropType<BasicColumn>,
  },
  isTreeTable: Boolean,
  loading: propTypes.bool,
  pagination: {
    default: null,
    type: [Object, Boolean] as PropType<boolean | PaginationProps>,
  },
  rowClassName: {
    type: Function as PropType<(record: TableCustomRecord<any>, index: number) => string>,
  },
  rowKey: {
    default: '',
    type: [String, Function] as PropType<((record: Recordable) => string) | string>,
  },
  rowSelection: {
    default: null,
    type: Object as PropType<null | TableRowSelection>,
  },
  // 额外的请求参数
  searchInfo: {
    default: null,
    type: Object as PropType<Recordable>,
  },
  showExpandColumn: { default: false, type: Boolean },
  showFooter: Boolean,
  showIndexColumn: { default: true, type: Boolean },
  showTableSetting: { default: true, type: Boolean },
  size: {
    default: DEFAULT_SIZE,
    type: String as PropType<string>,
  },
  sortFn: {
    default: DEFAULT_VXE_SORT_FN,
    type: Function as PropType<(sortInfo: SorterResult) => any>,
  },
  tableSetting: propTypes.shape<TableSetting>({
    expand: propTypes.bool,
  }),

  treeConfig: {
    default: () => null,
    type: Object as PropType<VxeTablePropTypes.TreeConfig>,
  },
  // 使用搜索表单
  useSearchForm: propTypes.bool,
};
