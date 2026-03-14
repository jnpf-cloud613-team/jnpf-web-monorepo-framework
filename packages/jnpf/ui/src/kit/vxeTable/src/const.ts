import type { SorterResult } from './types/table';

const tableSetting = {
  // 自定义过滤方法
  defaultFilterFn: (data: Partial<Recordable<string[]>>) => {
    return data;
  },
  // 默认每页显示多少条
  defaultPageSize: 20,
  // 默认尺寸
  defaultSize: 'small',
  // 默认排序方法
  defaultVxeSortFn: (sortInfo: SorterResult) => {
    const { field, order } = sortInfo;

    return field && order
      ? {
          // 排序字段
          sidx: field,
          // 排序方式 asc/desc
          sort: order,
        }
      : {};
  },
  // 表格接口请求通用配置，可在组件prop覆盖
  // 支持 xxx.xxx.xxx格式
  fetchSetting: {
    // 传给后台的当前页字段
    pageField: 'currentPage',
    // 传给后台的每页显示多少条的字段
    sizeField: 'pageSize',
    // 接口返回表格总数的字段
    totalField: 'pagination.total',
    // 接口返回表格数据的字段
    listField: 'list',
  },
  // 可选的分页选项
  pageSizeOptions: ['20', '50', '100', '500'],
};

const { defaultFilterFn, defaultPageSize, defaultSize, defaultVxeSortFn, fetchSetting, pageSizeOptions } = tableSetting;

export const ROW_KEY = 'id';

// Optional display number per page;
export const PAGE_SIZE_OPTIONS = pageSizeOptions;

// Number of items displayed per page
export const PAGE_SIZE = defaultPageSize;

// Common interface field settings
export const FETCH_SETTING = fetchSetting;

// Default Size
export const DEFAULT_SIZE = defaultSize;

// Configure general sort function
export const DEFAULT_VXE_SORT_FN = defaultVxeSortFn;

export const DEFAULT_FILTER_FN = defaultFilterFn;

//  Default layout of table cells
export const DEFAULT_ALIGN = 'left';

export const INDEX_COLUMN_FLAG = 'seq';

export const EXPAND_COLUMN_FLAG = 'expand';

export const ACTION_COLUMN_FLAG = 'action';
