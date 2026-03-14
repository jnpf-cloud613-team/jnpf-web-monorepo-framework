import type { TreeDataItem } from 'ant-design-vue/es/tree/Tree';

import type { ComputedRef, Ref } from 'vue';

import type { FieldNames, InsertNodeParams, KeyType, TreeItem } from '../types/tree';

import { unref } from 'vue';

import { forEach } from '@jnpf/utils';

import { cloneDeep } from 'lodash-es';

export function useTree(treeDataRef: Ref<TreeDataItem[]>, getFieldNames: ComputedRef<FieldNames>) {
  function getAllKeys(list?: TreeDataItem[]) {
    const keys: string[] = [];
    const treeData = list || unref(treeDataRef);
    const { key: keyField, children: childrenField } = unref(getFieldNames);
    if (!childrenField || !keyField) return keys;

    for (const node of treeData) {
      keys.push(node[keyField]!);
      const children = node[childrenField];
      if (children && children.length > 0) {
        keys.push(...(getAllKeys(children) as string[]));
      }
    }
    return keys as KeyType[];
  }

  // get keys that can be checked and selected
  function getEnabledKeys(list?: TreeDataItem[]) {
    const keys: string[] = [];
    const treeData = list || unref(treeDataRef);
    const { key: keyField, children: childrenField } = unref(getFieldNames);
    if (!childrenField || !keyField) return keys;

    for (const node of treeData) {
      node.disabled !== true && node.selectable !== false && keys.push(node[keyField]!);
      const children = node[childrenField];
      if (children && children.length > 0) {
        keys.push(...(getEnabledKeys(children) as string[]));
      }
    }
    return keys as KeyType[];
  }

  function getChildrenKeys(nodeKey: number | string, list?: TreeDataItem[]) {
    const keys: KeyType[] = [];
    const treeData = list || unref(treeDataRef);
    const { key: keyField, children: childrenField } = unref(getFieldNames);
    if (!childrenField || !keyField) return keys;
    for (const node of treeData) {
      const children = node[childrenField];
      if (nodeKey === node[keyField]) {
        keys.push(node[keyField]!);
        if (children && children.length > 0) {
          keys.push(...(getAllKeys(children) as string[]));
        }
      } else {
        if (children && children.length > 0) {
          keys.push(...getChildrenKeys(nodeKey, children));
        }
      }
    }
    return keys as KeyType[];
  }

  // Update node
  function updateNodeByKey(key: string, node: Omit<TreeDataItem, 'key'>, list?: TreeDataItem[]) {
    if (!key) return;
    const treeData = list || unref(treeDataRef);
    const { key: keyField, children: childrenField } = unref(getFieldNames);

    if (!childrenField || !keyField) return;

    for (let index = 0; index < treeData.length; index++) {
      const element: any = treeData[index];
      const children = element[childrenField];

      if (element[keyField] === key) {
        treeData[index] = { ...treeData[index], ...node } as any;
        break;
      } else if (children && children.length > 0) {
        updateNodeByKey(key, node, element[childrenField]);
      }
    }
  }

  // Expand the specified level
  function filterByLevel(level = 1, list?: TreeDataItem[], currentLevel = 1, result?: (number | string)[]) {
    if (!level) return [];
    const res = result || [];
    // 如果超过指定层级，直接返回
    if (currentLevel > level) return res;
    const data = list || unref(treeDataRef) || [];
    for (const item of data) {
      const { key: keyField, children: childrenField } = unref(getFieldNames);
      const key = keyField ? item[keyField] : '';
      const children = childrenField ? item[childrenField] : [];
      res.push(key);
      if (children && children.length > 0 && currentLevel < level) {
        filterByLevel(level, children, currentLevel + 1, res);
      }
    }
    return res as number[] | string[];
  }

  /**
   * 添加节点
   */
  function insertNodeByKey({ node, parentKey = null, push = 'push' }: InsertNodeParams) {
    const treeData: any = cloneDeep(unref(treeDataRef));
    if (!parentKey) {
      treeData[push](node);
      treeDataRef.value = treeData;
      return;
    }
    const { key: keyField, children: childrenField } = unref(getFieldNames);
    if (!childrenField || !keyField) return;

    forEach(treeData, (treeItem) => {
      if (treeItem[keyField] === parentKey) {
        treeItem[childrenField] = treeItem[childrenField] || [];
        treeItem[childrenField][push](node);
        return true;
      }
    });
    treeDataRef.value = treeData;
  }
  /**
   * 批量添加节点
   */
  function insertNodesByKey({ parentKey = null, push = 'push', list }: InsertNodeParams) {
    const treeData: any = cloneDeep(unref(treeDataRef));
    if (!list || list.length === 0) {
      return;
    }
    if (parentKey) {
      const { key: keyField, children: childrenField } = unref(getFieldNames);
      if (!childrenField || !keyField) return;

      forEach(treeData, (treeItem) => {
        if (treeItem[keyField] === parentKey) {
          treeItem[childrenField] = treeItem[childrenField] || [];
          for (const element of list) {
            treeItem[childrenField][push](element);
          }
          treeDataRef.value = treeData;
          return true;
        }
      });
    } else {
      for (const element of list) {
        treeData[push](element);
      }
      treeDataRef.value = treeData;
    }
  }
  // Delete node
  function deleteNodeByKey(key: string, list?: TreeDataItem[]) {
    if (!key) return;
    const treeData = list || unref(treeDataRef);
    const { key: keyField, children: childrenField } = unref(getFieldNames);
    if (!childrenField || !keyField) return;

    for (let index = 0; index < treeData.length; index++) {
      const element: any = treeData[index];
      const children = element[childrenField];

      if (element[keyField] === key) {
        treeData.splice(index, 1);
        break;
      } else if (children && children.length > 0) {
        deleteNodeByKey(key, element[childrenField]);
      }
    }
  }

  // Get selected node
  function getSelectedNode(key: KeyType, list?: TreeItem[], selectedNode?: null | TreeItem) {
    if (!key && key !== 0) return null;
    const treeData = list || unref(treeDataRef);
    const { key: keyField, children: childrenField } = unref(getFieldNames);
    if (!childrenField || !keyField) return;
    treeData.forEach((item) => {
      if (selectedNode?.[keyField] || selectedNode?.[keyField] === 0) return selectedNode;
      if (item[keyField] === key) {
        selectedNode = item;
        return;
      }
      if (item[childrenField] && item[childrenField].length > 0) {
        selectedNode = getSelectedNode(key, item[childrenField], selectedNode);
      }
    });
    return selectedNode || null;
  }
  // 获取选中节点
  function getEnabledNodes(keys: KeyType[], list?: TreeItem[]) {
    const enabledNodes: TreeItem[] = [];
    if (!keys || !keys?.length) return [];
    const treeData = list || unref(treeDataRef);
    const { key: keyField, children: childrenField } = unref(getFieldNames);
    if (!childrenField || !keyField) return [];
    treeData.forEach((item) => {
      if (keys.includes(item[keyField])) enabledNodes.push(item);
      if (item[childrenField] && item[childrenField].length > 0) {
        enabledNodes.push(...getEnabledNodes(keys, item[childrenField]));
      }
    });
    return enabledNodes;
  }

  function getParentKeys(list?: TreeDataItem[], isFilterDisabledNode = false) {
    const keys: string[] = [];
    const treeData = list || unref(treeDataRef);
    const { key: keyField, children: childrenField } = unref(getFieldNames);
    if (!childrenField || !keyField) return keys;

    for (const node of treeData) {
      const children = node[childrenField];
      if (children && children.length > 0) {
        if ((isFilterDisabledNode && !node.disabled) || !isFilterDisabledNode) keys.push(node[keyField]);
        keys.push(...(getParentKeys(children, isFilterDisabledNode) as string[]));
      }
    }
    return keys as KeyType[];
  }

  return {
    deleteNodeByKey,
    filterByLevel,
    getAllKeys,
    getChildrenKeys,
    getEnabledKeys,
    getEnabledNodes,
    getParentKeys,
    getSelectedNode,
    insertNodeByKey,
    insertNodesByKey,
    updateNodeByKey,
  };
}
