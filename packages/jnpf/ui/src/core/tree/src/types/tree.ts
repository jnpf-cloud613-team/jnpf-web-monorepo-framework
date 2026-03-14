import type { TreeDataItem } from 'ant-design-vue/es/tree/Tree';

import type { ExtractPropTypes } from 'vue';

import type { Fn } from '@vben/types/global';

import type { ContextMenuItem } from '../../../index';

export enum ToolbarEnum {
  RELOAD,
  SELECT_ALL,
  UN_SELECT_ALL,
  EXPAND_ALL,
  UN_EXPAND_ALL,
  CHECK_STRICTLY,
  CHECK_UN_STRICTLY,
}

export const treeEmits = ['update:expandedKeys', 'update:selectedKeys', 'update:value', 'change', 'check', 'update:searchValue', 'select'];

export type KeyType = number | string;

export type CheckKeys = KeyType[] | { checked: number[] | string[]; halfChecked: number[] | string[] };

export interface TreeState {
  checkedKeys: CheckKeys;
  checkedNodes: any[];
  checkStrictly: boolean;
  expandedKeys: KeyType[];
  halfCheckedKeys: KeyType[];
  selectedKeys: KeyType[];
}

export interface FieldNames {
  children?: string;
  key?: string;
  title?: string;
}

export interface TreeItem extends TreeDataItem {
  icon?: any;
}

export interface TreeActionItem {
  render: (record: Recordable) => any;
  show?: ((record: Recordable) => boolean) | boolean;
}

export interface ContextMenuOptions {
  icon?: string;
  items?: ContextMenuItem[];
  styles?: any;
}

export const treeProps = {
  actionList: {
    default: () => [],
    type: Array as PropType<TreeActionItem[]>,
  },
  beforeRightClick: {
    default: undefined,
    type: Function as PropType<(...arg: any) => ContextMenuItem[] | ContextMenuOptions>,
  },

  checkable: Boolean,

  checkedKeys: {
    default: () => [],
    type: [Array, Object] as PropType<CheckKeys>,
  },

  // 搜索完成自动选中所有结果,当且仅当 checkable===true 时生效
  checkOnSearch: Boolean,
  checkStrictly: Boolean,
  clickRowToExpand: {
    default: false,
    type: Boolean,
  },
  defaultExpandAll: Boolean,
  defaultExpandLevel: {
    default: '',
    type: [String, Number] as PropType<number | string>,
  },
  expandedKeys: {
    default: () => [],
    type: Array as PropType<KeyType[]>,
  },
  // 搜索完成时自动展开结果
  expandOnSearch: Boolean,
  extraInfo: {
    default: () => {},
    type: Object as PropType<TreeActionItem>,
  },
  fieldNames: {
    default: () => ({ key: 'id', title: 'fullName', children: 'children' }),
    type: Object as PropType<FieldNames>,
  },

  // 自定义数据过滤判断方法(注: 不是整个过滤方法，而是内置过滤的判断方法，用于增强原本仅能通过title进行过滤的方式)
  filterFn: {
    default: undefined,
    type: Function as PropType<(searchValue: any, node: TreeItem, fieldNames: FieldNames) => boolean>,
  },

  helpMessage: {
    default: '',
    type: [String, Array] as PropType<string | string[]>,
  },

  // 高亮搜索值，仅高亮具体匹配值（通过title）值为true时使用默认色值，值为#xxx时使用此值替代且高亮开启
  highlight: {
    default: true,
    type: [Boolean, String] as PropType<boolean | string>,
  },

  loading: {
    default: false,
    type: Boolean,
  },

  renderIcon: {
    type: Function as PropType<(params: Recordable) => string>,
  },

  rightMenuList: {
    type: Array as PropType<ContextMenuItem[]>,
  },

  search: Boolean,

  searchValue: {
    default: '',
    type: String,
  },
  selectedKeys: {
    default: () => [],
    type: Array as PropType<KeyType[]>,
  },
  // 搜索完成自动select所有结果
  selectedOnSearch: Boolean,
  title: {
    default: '',
    type: String,
  },
  toolbar: Boolean,
  treeData: {
    type: Array as PropType<TreeDataItem[]>,
  },
  treeWrapperClassName: String,
  value: {
    type: [Object, Array] as PropType<CheckKeys | KeyType[]>,
  },
};

export type TreeProps = ExtractPropTypes<typeof treeProps>;

export interface DropDownActionItem {
  label: string;
  onClick?: Fn;
}

export interface InsertNodeParams {
  list?: TreeDataItem[];
  node: TreeDataItem;
  parentKey: null | string;
  push?: 'push' | 'unshift';
}

export interface TreeActionType {
  checkAll: (checkAll: boolean) => void;
  deleteNodeByKey: (key: string) => void;
  expandAll: (expandAll: boolean) => void;
  filterByLevel: (level: number) => void;
  getAllKeys: () => KeyType[];
  getCheckedKeys: () => CheckKeys;
  getCheckedNodes: () => TreeItem[];
  getExpandedKeys: () => KeyType[];
  getHalfCheckedKeys: () => KeyType[];
  getParentKeys: (treeList?: TreeItem[], isFilterDisabledNode?: boolean) => KeyType[];
  getSearchValue: () => string;
  getSelectedKeys: () => KeyType[];
  getSelectedNode: (key: KeyType, treeList?: TreeItem[], selectNode?: null | TreeItem) => null | TreeItem | undefined;
  getTree?: () => TreeActionType;
  insertNodeByKey: (opt: InsertNodeParams) => void;
  insertNodesByKey: (opt: InsertNodeParams) => void;
  setCheckedKeys: (keys: CheckKeys) => void;
  setExpandedKeys: (keys: KeyType[]) => void;
  setSearchValue: (value: string) => void;
  setSelectedKeys: (keys: KeyType[]) => void;
  updateNodeByKey: (key: string, node: Omit<TreeDataItem, 'key'>) => void;
}
