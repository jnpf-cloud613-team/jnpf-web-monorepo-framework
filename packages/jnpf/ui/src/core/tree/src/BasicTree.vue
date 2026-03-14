<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<script lang="tsx">
import type { CSSProperties } from 'vue';

import type { CreateContextOptions } from '../../../index';
import type { CheckKeys, FieldNames, KeyType, TreeActionType, TreeItem, TreeState } from './types/tree';

import { computed, defineComponent, onMounted, reactive, ref, toRaw, unref, watch, watchEffect } from 'vue';

import { eachTree, extendSlots, filter, getSlot, isArray, isBoolean, isEmpty, isFunction, treeToList } from '@jnpf/utils';

import { useNamespace } from '@vben/hooks';

import { Spin, Tree } from 'ant-design-vue';
import { cloneDeep, difference, get, omit } from 'lodash-es';

import { ScrollContainer, useContextMenu } from '../../../index';
import TreeHeader from './components/TreeHeader.vue';
import { useTree } from './hooks/useTree';
import { TreeIcon } from './TreeIcon';
import { treeEmits, treeProps } from './types/tree';

export default defineComponent({
  emits: treeEmits,
  inheritAttrs: false,
  name: 'BasicTree',
  props: treeProps,

  setup(props, { attrs, emit, expose, slots }) {
    const { b, e } = useNamespace('tree');

    const state = reactive<TreeState>({
      checkedKeys: props.checkedKeys || [],
      checkedNodes: [],
      checkStrictly: props.checkStrictly,
      expandedKeys: props.expandedKeys || [],
      halfCheckedKeys: [],
      selectedKeys: props.selectedKeys || [],
    });

    const searchState = reactive({
      searchData: [] as TreeItem[],
      searchText: '',
      startSearch: false,
    });

    const treeDataRef = ref<TreeItem[]>([]);

    const [createContextMenu] = useContextMenu();

    const getFieldNames = computed((): Required<FieldNames> => {
      const { fieldNames } = props;
      return {
        key: 'id',
        title: 'fullName',
        children: 'children',
        ...fieldNames,
      };
    });

    const {
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
    } = useTree(treeDataRef, getFieldNames);

    const getBindValues = computed(() => {
      const propsData = {
        blockNode: true,
        ...attrs,
        ...props,
        checkedKeys: state.checkedKeys,
        checkStrictly: state.checkStrictly,
        expandedKeys: state.expandedKeys,
        fieldNames: { ...unref(getFieldNames), title: `${unref(getFieldNames).title}_title` },
        onCheck: (v: any, e) => {
          let currentValue = toRaw(state.checkedKeys) as KeyType[];
          if (isArray(currentValue) && searchState.startSearch) {
            const value = e.node.eventKey;
            currentValue = difference(currentValue, getChildrenKeys(value));
            if (e.checked) {
              currentValue.push(value);
            }
            state.checkedKeys = currentValue;
          } else {
            state.checkedKeys = v;
          }
          state.halfCheckedKeys = e.halfCheckedKeys;
          state.checkedNodes = e.checkedNodes;
          const rawVal = toRaw(state.checkedKeys);
          emit('update:value', rawVal);
          emit('check', rawVal, e);
        },
        onRightClick: handleRightClick,
        onSelect: (_selectedKeys, nodeInfo) => {
          const { key } = nodeInfo.node;
          if (!props.checkable) state.selectedKeys = [key];
          emit('select', [key], nodeInfo);
        },
        'onUpdate:expandedKeys': (v: KeyType[]) => {
          state.expandedKeys = v;
          emit('update:expandedKeys', v);
        },
        'onUpdate:selectedKeys': (v: KeyType[]) => {
          state.selectedKeys = v;
          emit('update:selectedKeys', v);
        },
        selectedKeys: state.selectedKeys,
      };
      return omit(propsData, 'treeData', 'class');
    });

    const getTreeData = computed((): TreeItem[] => (searchState.startSearch ? searchState.searchData : unref(treeDataRef)));

    const getNotFound = computed((): boolean => {
      return !getTreeData.value || getTreeData.value.length === 0;
    });

    function getIcon(params: TreeItem, icon?: string) {
      if (!icon && props.renderIcon && isFunction(props.renderIcon)) {
        return props.renderIcon(params);
      }
      return icon;
    }

    async function handleRightClick({ event, node }: Recordable) {
      const { beforeRightClick, rightMenuList: menuList = [] } = props;
      const contextMenuOptions: CreateContextOptions = { event, items: [] };

      if (beforeRightClick && isFunction(beforeRightClick)) {
        const result = await beforeRightClick(node, event);
        if (Array.isArray(result)) {
          contextMenuOptions.items = result;
        } else {
          Object.assign(contextMenuOptions, result);
        }
      } else {
        contextMenuOptions.items = menuList;
      }
      if (!contextMenuOptions.items?.length) return;
      contextMenuOptions.items = contextMenuOptions.items.filter((item) => !item.hidden);
      (createContextMenu as any)(contextMenuOptions);
    }

    function setExpandedKeys(keys: KeyType[]) {
      state.expandedKeys = keys;
    }

    function getExpandedKeys() {
      return state.expandedKeys;
    }
    function setSelectedKeys(keys: KeyType[]) {
      state.selectedKeys = keys;
    }

    function getSelectedKeys() {
      return state.selectedKeys;
    }

    function setCheckedKeys(keys: CheckKeys) {
      state.checkedKeys = keys;
    }

    function getCheckedKeys() {
      return state.checkedKeys;
    }
    function getHalfCheckedKeys() {
      return state.halfCheckedKeys;
    }

    function getCheckedNodes() {
      return state.checkedNodes;
    }

    function checkAll(checkAll: boolean) {
      state.checkedKeys = checkAll ? getEnabledKeys() : ([] as KeyType[]);
      state.checkedNodes = checkAll ? getEnabledNodes(state.checkedKeys) : [];
    }

    function expandAll(expandAll: boolean) {
      state.expandedKeys = expandAll ? getAllKeys() : ([] as KeyType[]);
    }

    function onStrictlyChange(strictly: boolean) {
      state.checkStrictly = strictly;
    }

    watch(
      () => props.searchValue,
      (val) => {
        if (val !== searchState.searchText) {
          searchState.searchText = val;
        }
      },
      {
        immediate: true,
      },
    );

    watch(
      () => props.treeData,
      (val) => {
        if (val) {
          handleSearch(searchState.searchText);
        }
      },
    );

    function handleSearch(searchValue: string) {
      if (searchValue !== searchState.searchText) searchState.searchText = searchValue;
      emit('update:searchValue', searchValue);
      if (!searchValue) {
        searchState.startSearch = false;
        return;
      }
      const { checkable, checkOnSearch, expandOnSearch, filterFn, selectedOnSearch } = unref(props);
      searchState.startSearch = true;
      const { key: keyField, title: titleField } = unref(getFieldNames);

      const matchedKeys: string[] = [];
      searchState.searchData = filter(
        unref(treeDataRef),
        (node) => {
          const result = filterFn ? filterFn(searchValue, node, unref(getFieldNames)) : (node[titleField]?.includes(searchValue) ?? false);
          if (result) {
            matchedKeys.push(node[keyField]);
          }
          return result;
        },
        unref(getFieldNames),
      );

      if (expandOnSearch) {
        const expandKeys = treeToList(searchState.searchData).map((val) => {
          return val[keyField];
        });
        if (expandKeys && expandKeys.length > 0) {
          setExpandedKeys(expandKeys);
        }
      }

      if (checkOnSearch && checkable && matchedKeys.length > 0) {
        setCheckedKeys(matchedKeys);
      }

      if (selectedOnSearch && matchedKeys.length > 0) {
        setSelectedKeys(matchedKeys);
      }
    }

    function handleClickNode(key: string, children: TreeItem[]) {
      if (!props.clickRowToExpand || (!attrs['load-data'] && !attrs.loadData && (!children || children.length === 0))) return;
      if (state.expandedKeys.includes(key)) {
        const keys = [...state.expandedKeys];
        const index = keys.indexOf(key);
        if (index !== -1) {
          keys.splice(index, 1);
        }
        setExpandedKeys(keys);
      } else {
        setExpandedKeys([...state.expandedKeys, key]);
      }
    }

    function handleExpand() {
      if (attrs['load-data'] || attrs.loadData) return;
      const level = Number.parseInt(props.defaultExpandLevel);
      if (level > 0) {
        if (!treeDataRef.value?.length) return;
        state.expandedKeys = filterByLevel(level);
      } else if (props.defaultExpandAll) {
        expandAll(true);
      }
    }

    watchEffect(() => {
      treeDataRef.value = props.treeData as TreeItem[];
      handleExpand();
    });

    onMounted(() => {
      handleExpand();
    });

    watchEffect(() => {
      state.expandedKeys = props.expandedKeys;
    });

    watchEffect(() => {
      state.selectedKeys = props.selectedKeys;
    });

    watchEffect(() => {
      state.checkedKeys = props.checkedKeys;
    });

    watch(
      () => props.value,
      () => {
        state.checkedKeys = toRaw(props.value || []);
      },
      { immediate: true },
    );

    watch(
      () => state.checkedKeys,
      () => {
        const v = toRaw(state.checkedKeys);
        emit('update:value', v);
        emit('change', v);
      },
    );

    watchEffect(() => {
      state.checkStrictly = props.checkStrictly;
    });

    const instance: TreeActionType = {
      checkAll,
      deleteNodeByKey,
      expandAll,
      filterByLevel: (level: number) => {
        state.expandedKeys = filterByLevel(level);
      },
      getAllKeys,
      getCheckedKeys,
      getCheckedNodes,
      getExpandedKeys,
      getHalfCheckedKeys,
      getParentKeys,
      getSearchValue: () => {
        return searchState.searchText;
      },
      getSelectedKeys,
      getSelectedNode,
      insertNodeByKey,
      insertNodesByKey,
      setCheckedKeys,
      setExpandedKeys,
      setSearchValue: (value: string) => {
        handleSearch(value);
      },
      setSelectedKeys,
      updateNodeByKey,
    };

    function renderAction(node: TreeItem) {
      const { actionList } = props;
      if (!actionList || actionList.length === 0) return;
      return actionList.map((item, index) => {
        let nodeShow = true;
        if (isFunction(item.show)) {
          nodeShow = item.show?.(node);
        } else if (isBoolean(item.show)) {
          nodeShow = item.show;
        }

        if (!nodeShow) return null;

        return item.render(node) ? (
          <span class={e('action')} key={index}>
            {item.render(node)}
          </span>
        ) : null;
      });
    }
    function renderExtra(node: TreeItem) {
      const { extraInfo } = props;
      if (!extraInfo) return;
      return extraInfo.render(node) ? extraInfo.render(node) : null;
    }

    const treeData = computed(() => {
      const data = cloneDeep(getTreeData.value);
      eachTree(data, unref(getFieldNames), (item, _parent) => {
        const searchText = searchState.searchText;
        const { highlight } = unref(props);
        const { key: keyField, title: titleField, children: childrenField } = unref(getFieldNames);

        const icon = getIcon(item, item.icon);
        const title = get(item, titleField);

        const searchIdx = searchText ? title.indexOf(searchText) : -1;
        const isHighlight = searchState.startSearch && !isEmpty(searchText) && highlight && searchIdx !== -1;
        const highlightStyle = `color: ${isBoolean(highlight) ? '#f50' : highlight}`;

        // const titleDom = isHighlight ? (
        //   <span class={unref(getBindValues)?.blockNode ? `${be('content')}` : ''}>
        //     <span>{title.substr(0, searchIdx)}</span>
        //     <span style={highlightStyle}>{searchText}</span>
        //     <span>{title.substr(searchIdx + (searchText as string).length)}</span>
        //   </span>
        // ) : (
        //   title
        // );
        const titleDom = title;
        item[`${titleField}_title`] = (
          <span class={`${e('title')}`} onClick={handleClickNode.bind(null, item[keyField], item[childrenField])} title={title}>
            {slots?.title ? (
              getSlot(slots, 'title', item)
            ) : (
              <>
                {icon && <TreeIcon icon={icon} />}
                <span class={e('name')}>{titleDom}</span>
                {!!props.actionList.length && <span class={e('actions')}>{renderAction(item)}</span>}
                <span class={e('extra')}>{renderExtra(item)}</span>
              </>
            )}
          </span>
        );
        return item;
      });
      return data;
    });

    expose(instance);

    return () => {
      const { checkable, helpMessage, search, title, toolbar } = props;
      const showTitle = title || toolbar || search || slots.headerTitle;
      const scrollStyle: CSSProperties = { height: '100%' };
      return (
        <div class={[b(), 'h-full', attrs.class]}>
          {showTitle && (
            <TreeHeader
              checkable={checkable}
              checkAll={checkAll}
              expandAll={expandAll}
              helpMessage={helpMessage}
              onSearch={handleSearch}
              onStrictly-change={onStrictlyChange}
              search={search}
              searchText={searchState.searchText}
              title={title}
              toolbar={toolbar}>
              {extendSlots(slots)}
            </TreeHeader>
          )}
          <Spin spinning={unref(props.loading)} tip="加载中..." wrapperClassName={unref(props.treeWrapperClassName)}>
            <ScrollContainer style={scrollStyle} v-show={!unref(getNotFound)}>
              <Tree {...unref(getBindValues)} showIcon={false} treeData={treeData.value} />
            </ScrollContainer>
            <jnpf-empty v-show={unref(getNotFound)} />
          </Spin>
        </div>
      );
    };
  },
});
</script>
<style lang="scss">
@use '../style/index.scss' as *;
</style>
