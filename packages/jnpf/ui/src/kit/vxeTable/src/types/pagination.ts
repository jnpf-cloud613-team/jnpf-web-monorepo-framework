import type { VNodeChild } from 'vue';

import Pagination from 'ant-design-vue/lib/pagination';

interface PaginationRenderProps {
  originalElement: any;
  page: number;
  type: 'next' | 'page' | 'prev';
}

type PaginationPosition = 'bottomCenter' | 'bottomLeft' | 'bottomRight' | 'topCenter' | 'topLeft' | 'topRight';

export declare class PaginationConfig extends Pagination {
  position?: PaginationPosition[];
}

export interface PaginationProps {
  /**
   * current page number
   * @type number
   */
  current?: number;

  /**
   * default initial page number
   * @default 1
   * @type number
   */
  defaultCurrent?: number;

  /**
   * default number of data items per page
   * @default 10
   * @type number
   */
  defaultPageSize?: number;

  /**
   * Whether to hide pager on single page
   * @default false
   * @type boolean
   */
  hideOnSinglePage?: boolean;

  /**
   * to customize item innerHTML
   * @type Function
   */
  itemRender?: (props: PaginationRenderProps) => JSX.Element | VNodeChild;

  /**
   * number of data items per page
   * @type number
   */
  pageSize?: number;

  /**
   * specify the sizeChanger options
   * @default ['10', '20', '30', '40']
   * @type string[]
   */
  pageSizeOptions?: string[];

  /**
   * specify the position of Pagination
   * @default ['bottomRight']
   * @type string[]
   */
  position?: PaginationPosition[];

  /**
   * determine whether you can jump to pages directly
   * @default false
   * @type boolean
   */
  showQuickJumper?: boolean | object;

  /**
   * determine whether pageSize can be changed
   * @default false
   * @type boolean
   */
  showSizeChanger?: boolean;

  /**
   * to display the total number and range
   * @type Function
   */
  showTotal?: (total: number, range: [number, number]) => any;

  /**
   * whether to setting simple mode
   * @type boolean
   */
  simple?: boolean;

  /**
   * specify the size of Pagination, can be set to small
   * @default ''
   * @type string
   */
  size?: string;

  /**
   * total number of data items
   * @default 0
   * @type number
   */
  total?: number;
}
