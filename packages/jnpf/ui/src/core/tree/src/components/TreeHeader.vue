<script lang="ts" setup>
import { computed, ref, useSlots, watch } from 'vue';

import { useNamespace } from '@vben/hooks';
import { $t } from '@vben/locales';

import { VbenIcon } from '@vben-core/shadcn-ui';

import { useDebounceFn } from '@vueuse/core';
import { Dropdown, InputSearch, Menu, MenuDivider, MenuItem } from 'ant-design-vue';

import { BasicTitle } from '../../../index';
import { ToolbarEnum } from '../types/tree';

const props = defineProps({
  checkable: {
    default: false,
    type: Boolean,
  },
  checkAll: {
    default: undefined,
    type: Function,
  },
  expandAll: {
    default: undefined,
    type: Function,
  },
  helpMessage: {
    default: '',
    type: [String, Array] as PropType<string | string[]>,
  },
  search: {
    default: false,
    type: Boolean,
  },
  searchText: {
    default: '',
    type: String,
  },
  title: {
    default: '',
    type: String,
  },
  toolbar: {
    default: false,
    type: Boolean,
  },
} as const);

const emit = defineEmits(['strictlyChange', 'search']);

const searchValue = ref('');

const { b } = useNamespace('tree-header');

const slots = useSlots();

const getInputSearchCls = computed(() => {
  const titleExists = slots.headerTitle || props.title;
  return [
    'mr-1',
    'w-full',
    {
      'ml-5': titleExists,
    },
  ];
});

const toolbarList = computed(() => {
  const { checkable } = props;
  const defaultToolbarList = [
    { label: $t('component.tree.expandAll'), value: ToolbarEnum.EXPAND_ALL },
    {
      divider: checkable,
      label: $t('component.tree.unExpandAll'),
      value: ToolbarEnum.UN_EXPAND_ALL,
    },
  ];

  return checkable
    ? [
        { label: $t('component.tree.selectAll'), value: ToolbarEnum.SELECT_ALL },
        {
          divider: checkable,
          label: $t('component.tree.unSelectAll'),
          value: ToolbarEnum.UN_SELECT_ALL,
        },
        ...defaultToolbarList,
        { label: $t('component.tree.checkStrictly'), value: ToolbarEnum.CHECK_STRICTLY },
        { label: $t('component.tree.checkUnStrictly'), value: ToolbarEnum.CHECK_UN_STRICTLY },
      ]
    : defaultToolbarList;
});

function handleMenuClick(e) {
  const { key } = e;
  switch (key) {
    case ToolbarEnum.CHECK_STRICTLY: {
      emit('strictlyChange', false);
      break;
    }
    case ToolbarEnum.CHECK_UN_STRICTLY: {
      emit('strictlyChange', true);
      break;
    }
    case ToolbarEnum.EXPAND_ALL: {
      props.expandAll?.(true);
      break;
    }
    case ToolbarEnum.SELECT_ALL: {
      props.checkAll?.(true);
      break;
    }
    case ToolbarEnum.UN_EXPAND_ALL: {
      props.expandAll?.(false);
      break;
    }
    case ToolbarEnum.UN_SELECT_ALL: {
      props.checkAll?.(false);
      break;
    }
  }
}

function emitChange(value?: string): void {
  emit('search', value);
}

const debounceEmitChange = useDebounceFn(emitChange, 200);

watch(
  () => searchValue.value,
  (v) => {
    debounceEmitChange(v);
  },
);

watch(
  () => props.searchText,
  (v) => {
    if (v !== searchValue.value) {
      searchValue.value = v;
    }
  },
);
</script>
<template>
  <div :class="b()" class="flex items-center px-2 py-1.5">
    <slot v-if="slots.headerTitle" name="headerTitle"></slot>
    <BasicTitle v-if="!slots.headerTitle && title" :help-message="helpMessage">
      {{ title }}
    </BasicTitle>
    <div v-if="search || toolbar" class="flex flex-1 cursor-pointer items-center justify-self-stretch">
      <div v-if="search" :class="getInputSearchCls">
        <InputSearch v-model:value="searchValue" :placeholder="$t('common.searchText')" allow-clear size="small" />
      </div>
      <Dropdown v-if="toolbar" @click.prevent>
        <VbenIcon icon="ion:ellipsis-vertical" />
        <template #overlay>
          <Menu @click="handleMenuClick">
            <template v-for="item in toolbarList" :key="item.value">
              <MenuItem v-bind="{ key: item.value }">
                {{ item.label }}
              </MenuItem>
              <MenuDivider v-if="item.divider" />
            </template>
          </Menu>
        </template>
      </Dropdown>
    </div>
  </div>
</template>
