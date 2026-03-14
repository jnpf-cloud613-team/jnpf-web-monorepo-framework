import type { VueNode } from '@jnpf/utils';
import type { ColumnProps } from 'ant-design-vue/lib/table';
import type { VxeColumnProps, VxeColumnPropTypes, VxeGridInstance, VxeTablePropTypes } from 'vxe-table';

import type { VNodeChild } from 'vue';

import type { FormProps } from '../../../basicForm';
import type { PaginationProps } from './pagination';

export declare type SortOrder = 'asc' | 'desc';

export interface TableCurrentDataSource<T = Recordable> {
  currentDataSource: T[];
}

export interface TableRowSelection {
  type: 'checkbox' | 'radio';
}

export interface TableCustomRecord<T> {
  index?: number;
  record?: T;
}

export interface ExpandedRowRenderRecord<T> extends TableCustomRecord<T> {
  expanded?: boolean;
  indent?: number;
}
export interface ColumnFilterItem {
  children?: any;
  text?: string;
  value?: string;
}

export interface TableCustomRecord<T = Recordable> {
  index?: number;
  record?: T;
}

export interface SorterResult {
  column?: ColumnProps;
  columnKey?: string;
  field?: string;
  order?: SortOrder;
}

export interface FetchParams {
  filterInfo?: Recordable;
  page?: number;
  searchInfo?: Recordable;
  sortInfo?: Recordable;
}

export interface GetColumnsParams {
  ignoreAction?: boolean;
  ignoreAllType?: boolean;
  ignoreIndex?: boolean;
  sort?: boolean;
}
export type CellFormat = ((text: string, record: Recordable, index: number) => number | string) | Map<number | string, any> | string;

export type ColumnChangeParam = {
  dataIndex: string;
  fixed: VxeColumnPropTypes.Fixed;
  visible: boolean;
};

export interface FetchSetting {
  // 请求结果列表字段  支持 a.b.c
  listField: string;
  // 请求接口当前页数
  pageField: string;
  // 每页显示多少条
  sizeField: string;
  // 请求结果总数字段  支持 a.b.c
  totalField: string;
}

export interface TableSetting {
  expand?: boolean;
  fullScreen?: boolean;
  redo?: boolean;
  setting?: boolean;
  size?: boolean;
}

export interface BasicColumn extends VxeColumnProps {
  // 权限编码控制是否显示
  auth?: string;
  children?: BasicColumn[];
  // 自定义内容
  customRender?: (opt: { column: BasicColumn; record: Recordable; row: Recordable; rowIndex: number }) => JSX.Element | VNodeChild;
  customTitle?: VueNode;
  dataIndex?: string | undefined;
  // Whether to hide the column by default, it can be displayed in the column configuration
  defaultHidden?: boolean;
  ellipsis?: boolean | undefined;
  filters?: {
    children?: ((() => unknown[]) & (() => unknown[]) & ((props: Record<string, unknown>) => unknown[])) | unknown[];
    label: string;
    value: string;
  }[];
  flag?: 'ACTION' | 'action' | 'CHECKBOX' | 'checkbox' | 'DEFAULT' | 'expand' | 'INDEX' | 'RADIO' | 'radio' | 'seq';
  format?: CellFormat;
  // Help text for table column header
  helpMessage?: string | string[];
  // 业务控制是否显示
  ifShow?: ((column: BasicColumn) => boolean) | boolean;
  key?: string | undefined;
  slots?: Recordable;
  type?: 'checkbox' | 'expand' | 'html' | 'radio' | 'seq';
  visible?: boolean;
}

export interface BasicTableProps {
  actionColumn?: BasicColumn;
  // 自定义处理接口返回参数
  afterFetch?: Fn;
  // 接口请求对象
  api?: (...arg: any) => Promise<any>;
  // 是否自动生成key
  autoCreateKey?: boolean;
  // 请求之前处理参数
  beforeFetch?: Fn;
  // 是否显示边框
  border?: boolean | string;
  checkboxConfig?: VxeTablePropTypes.CheckboxConfig;
  /**
   * The column contains children to display
   * @default 'children'
   * @type string | string[]
   */
  childrenColumnName?: string;
  // 在分页改变的时候清空选项
  clearSelectOnPageChange?: boolean;
  // 点击行选中
  clickToRowSelect?: boolean;
  // 列配置
  columns: BasicColumn[];
  // 数据
  dataSource?: Recordable[];
  defaultExpandAllRows: boolean;
  // 默认的排序参数
  defSort?: Recordable;
  // 文本超过宽度是否显示。。。
  ellipsis?: boolean;
  expandConfig: VxeTablePropTypes.ExpandConfig;
  // 请求接口配置
  fetchSetting?: Partial<FetchSetting>;
  // 排序方法
  filterFn?: (data: Partial<Recordable<string[]>>) => any;
  footerMethod: (record: any) => any[][];
  // 表单配置
  formConfig?: Partial<FormProps>;
  // 查询条件请求之前处理
  handleSearchInfoFn?: Fn;
  height?: number | string;
  // 立即请求接口
  immediate?: boolean;
  // 序号列配置
  indexColumnProps?: BasicColumn;
  isTreeTable?: boolean;
  // loading加载
  loading?: boolean;
  /**
   * Callback executed when pagination, filters or sorter is changed
   * @param pagination
   * @param filters
   * @param sorter
   * @param currentDataSource
   */
  onChange?: (pagination: any, filters: any, sorter: any, extra: any) => void;
  onColumnsChange?: (data: ColumnChangeParam[]) => void;
  // 分页配置
  pagination?: boolean | PaginationProps;
  radioConfig?: VxeTablePropTypes.CheckboxConfig;
  //
  rowKey?: ((record: Recordable) => string) | string;
  /**
   * Row selection config
   * @type object
   */
  rowSelection?: TableRowSelection;
  // 额外的请求参数
  searchInfo?: Recordable;
  // 是否显示扩展列
  showExpandColumn?: boolean;
  showFooter?: boolean;
  /**
   * Whether to show table header
   * @default true
   * @type boolean
   */
  showHeader?: boolean;
  // 是否显示序号列
  showIndexColumn?: boolean;
  showOverflow?: boolean;
  // 显示表格设置
  showTableSetting?: boolean;
  /**
   * Size of table
   * @default 'small'
   * @type string
   */
  size?: string;
  // 自定义排序方法
  sortFn?: (sortInfo: SorterResult) => any;
  spanMethod: VxeTablePropTypes.SpanMethod;
  // 斑马纹
  stripe?: boolean;
  tableSetting?: TableSetting;
  treeConfig: VxeTablePropTypes.TreeConfig;
  // 使用搜索表单
  useSearchForm?: boolean;
}

export interface TableActionType {
  clearSelectedRowKeys: () => void;
  collapseAll: () => void;
  deleteSelectRowByKey: (key: string) => void;
  deleteTableDataRecord: (rowKey: number | number[] | string | string[]) => void;
  emit?: EmitType;
  expandAll: () => void;
  findTableDataRecord: (rowKey: number | string) => Recordable;
  getCacheColumns: () => BasicColumn[];
  getColumns: (opt?: GetColumnsParams) => BasicColumn[];
  getDataSource: <T = Recordable>() => T[];
  getFetchParams: <T = Recordable>() => T;
  getIsExpanded: () => boolean;
  getPaginationRef: () => boolean | PaginationProps;
  getRawDataSource: <T = Recordable>() => T;
  getRowSelection: () => null | TableRowSelection;
  getSelectRowKeys: () => string[];
  getSelectRows: <T = Recordable>(isFull?: boolean) => T[];
  getShowPagination: () => boolean;
  getSize: () => string;
  getVxeTableRef: () => undefined | VxeGridInstance;
  insertTableDataRecord: (record: Recordable | Recordable[], index?: number) => Recordable[] | undefined;
  redoHeight: () => void;
  reload: (opt?: FetchParams) => Promise<Recordable<any>[] | undefined>;
  setCacheColumns?: (columns: BasicColumn[]) => void;
  setCacheColumnsByField?: (dataIndex: string | undefined, value: BasicColumn) => void;
  setColumns: (columns: BasicColumn[] | string[]) => void;
  setLoading: (loading: boolean) => void;
  setPagination: (info: Partial<PaginationProps>) => void;
  setProps: (props: Partial<BasicTableProps>) => void;
  setSelectedRowKeys: (rowKeys: number[] | string[]) => void;
  setSelectedRows: (rows: Recordable[]) => void;
  setShowPagination: (show: boolean) => Promise<void>;
  setTableData: <T = Recordable>(values: T[]) => void;
  updateTableData: (index: number, key: string, value: any) => Recordable;
  updateTableDataRecord: (rowKey: number | string, record: Recordable) => Recordable | undefined;
}
