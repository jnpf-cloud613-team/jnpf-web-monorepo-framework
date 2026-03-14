<script lang="ts" setup>
import type { TreeDataItem } from 'ant-design-vue/es/tree/Tree';

import type { DropDownActionItem, FieldNames, KeyType, TreeActionItem, TreeActionType, TreeItem } from './types/tree';

import { nextTick, ref, unref, useSlots, watch } from 'vue';

import { useNamespace } from '@vben/hooks';
import { $t } from '@vben/locales';

import { useDebounceFn } from '@vueuse/core';
import { InputSearch } from 'ant-design-vue';

import BasicTree from './BasicTree.vue';
import LeftTreeHeader from './components/LeftTreeHeader.vue';

const props = defineProps({
  actionList: {
    default: () => [],
    type: Array as PropType<TreeActionItem[]>,
  },
  defaultExpandAll: {
    default: true,
    type: Boolean,
  },
  dropDownActions: {
    default: () => [],
    type: Array as PropType<DropDownActionItem[]>,
  },
  extraInfo: {
    default: () => {},
    type: Object as PropType<TreeActionItem>,
  },
  fieldNames: {
    default: () => ({ key: 'id', title: 'fullName' }),
    type: Object as PropType<FieldNames>,
  },
  helpMessage: {
    default: '',
    type: [String, Array] as PropType<string | string[]>,
  },
  tipMessage: {
    default: '',
    type: [String, Array] as PropType<string | string[]>,
  },
  isCustomSearch: {
    default: false,
    type: Boolean,
  },
  loadData: {
    type: Function,
  },
  loading: {
    default: false,
    type: Boolean,
  },
  showSearch: {
    default: true,
    type: Boolean,
  },
  showToolbar: {
    default: true,
    type: Boolean,
  },
  title: {
    default: '',
    type: String,
  },
  treeData: {
    default: () => [],
    type: Array as PropType<TreeDataItem[]>,
  },
});
const emit = defineEmits(['select', 'reload', 'search']);
const { b, e } = useNamespace('basic-left-tree');
const slots = useSlots();
const searchValue = ref('');
const checkStrictly = ref(false);
const treeRef = ref<Nullable<TreeActionType>>(null);
const debounceEmitChange = useDebounceFn(handleSearch, 200);

watch(
  () => searchValue.value,
  (v) => {
    debounceEmitChange(v);
  },
);
watch(
  () => props.treeData,
  () => {
    nextTick(() => {
      if (props.defaultExpandAll) expandAll(true);
    });
  },
);

defineExpose({
  clearSearchValue,
  getSelectedNode,
  setExpandedKeys,
  setSelectedKeys,
  updateNodeByKey,
});
function getTree() {
  const tree = unref(treeRef);
  if (!tree) {
    throw new Error('tree is null!');
  }
  return tree;
}
function setExpandedKeys(keys: string[]) {
  return getTree().setExpandedKeys(keys);
}
function setSelectedKeys(keys: KeyType[]) {
  getTree().setSelectedKeys(keys);
}
function getSelectedNode(key: string) {
  return getTree().getSelectedNode(key);
}
function updateNodeByKey(key: string, node: Omit<TreeItem, 'key'>) {
  return getTree().updateNodeByKey(key, node);
}
function expandAll(expandAll: boolean) {
  getTree().expandAll(expandAll);
}
function checkAll(checkAll: boolean) {
  getTree().checkAll(checkAll);
}
function onStrictlyChange(strictly: boolean) {
  checkStrictly.value = strictly;
}
function handleSearch(value) {
  if (props.isCustomSearch) {
    emit('search', value);
  } else {
    getTree().setSearchValue(value);
  }
}
function reload() {
  searchValue.value = '';
  emit('reload');
}
function handleSelect(keys, { node }) {
  if (keys.length === 0) return;
  const nodePath: any[] = getNodePath(node);
  emit('select', keys[0], node, nodePath);
}
function getNodePath(node): any[] {
  let fullPath: any[] = [];
  const currNode = { ...node.dataRef };
  fullPath.push(currNode);
  if (node.parent) {
    const nodes = node.parent.nodes;
    fullPath = [...nodes, ...fullPath];
  }
  return fullPath;
}
function clearSearchValue() {
  searchValue.value = '';
}
</script>
<template>
  <div :class="[b()]" class="h-full">
    <LeftTreeHeader
      v-if="title || slots.headerTitle || dropDownActions.length > 0"
      :check-all="checkAll"
      :drop-down-actions="dropDownActions"
      :expand-all="expandAll"
      :help-message="helpMessage"
      :is-async="!!loadData"
      :show-toolbar="showToolbar"
      :title="title"
      @clear-search="searchValue = ''"
      @reload="reload"
      @strictly-change="onStrictlyChange">
      <template v-if="slots.headerTitle" #headerTitle>
        <slot name="headerTitle"></slot>
      </template>
      <template v-if="slots.headerToolbar" #headerToolbar>
        <slot name="headerToolbar"></slot>
      </template>
    </LeftTreeHeader>
    <a-alert v-if="tipMessage" :message="tipMessage" show-icon type="warning" class="m-[10px] mb-0" />
    <div v-if="showSearch" :class="e('search')">
      <InputSearch v-model:value="searchValue" :placeholder="$t('common.leftTreeSearchText')" allow-clear />
    </div>
    <BasicTree
      ref="treeRef"
      :action-list="actionList"
      :extra-info="extraInfo"
      :check-strictly="checkStrictly"
      :click-row-to-expand="false"
      :default-expand-all="defaultExpandAll"
      :field-names="fieldNames"
      :load-data="loadData"
      :loading="loading"
      :tree-data="treeData"
      class="tree-main"
      @select="handleSelect">
      <template v-if="slots.title" #title="data">
        <slot name="title" v-bind="data"></slot>
      </template>
    </BasicTree>
  </div>
</template>
<style lang="scss">
.jnpf-basic-left-tree {
  background-color: var(--component-background);
}
</style>
<style lang="scss" scoped>
.jnpf-basic-left-tree {
  display: flex;
  flex-direction: column;

  &__header {
    flex-shrink: 0;
  }

  &__search {
    flex-shrink: 0;
    padding: 10px;
  }

  .tree-main {
    flex: 1;
    overflow: hidden;

    :deep(.ant-spin-nested-loading) {
      height: 100%;

      .ant-spin-container {
        height: 100%;
      }

      .ant-tree-treenode {
        padding: 0 !important;
        overflow: hidden;
      }

      .ant-tree-switcher {
        line-height: 40px;
      }

      .ant-tree-node-content-wrapper {
        height: 40px;
        line-height: 40px;
      }
    }
  }
}
</style>
