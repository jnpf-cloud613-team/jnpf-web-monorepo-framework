<script lang="ts" setup>
import type { DropDownActionItem } from '../types/tree';

import { computed, useSlots } from 'vue';

import { useNamespace } from '@vben/hooks';
import { $t } from '@vben/locales';

import { Dropdown, Menu, MenuDivider, MenuItem } from 'ant-design-vue';

import { BasicCaption } from '../../../index';
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
  dropDownActions: {
    default: () => [],
    type: Array as PropType<DropDownActionItem[]>,
  },
  expandAll: {
    default: undefined,
    type: Function,
  },
  helpMessage: {
    default: '',
    type: [String, Array] as PropType<string | string[]>,
  },
  isAsync: {
    default: false,
    type: Boolean,
  },
  search: {
    default: false,
    type: Boolean,
  },
  searchText: {
    default: '',
    type: String,
  },
  showToolbar: {
    default: false,
    type: Boolean,
  },
  title: {
    default: '',
    type: String,
  },
} as const);

const emit = defineEmits(['strictlyChange', 'reload', 'clearSearch']);

const { b } = useNamespace('basic-left-tree');

const slots = useSlots();

const toolbarList = computed(() => {
  const { checkable } = props;
  const defaultToolbarList = [
    { label: $t('component.tree.reload'), value: ToolbarEnum.RELOAD },
    { label: $t('component.tree.expandAll'), value: ToolbarEnum.EXPAND_ALL },
    {
      divider: checkable,
      label: $t('component.tree.unExpandAll'),
      value: ToolbarEnum.UN_EXPAND_ALL,
    },
  ];

  let list = checkable
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

  // 异步情况下，去掉全部展开和刷新数据
  if (props.isAsync) list = list.filter((o) => o.value !== ToolbarEnum.EXPAND_ALL && o.value !== ToolbarEnum.RELOAD);
  return list;
});

function handleMenuClick(e) {
  const { value } = e;
  switch (value) {
    case ToolbarEnum.CHECK_STRICTLY: {
      emit('strictlyChange', false);
      break;
    }
    case ToolbarEnum.CHECK_UN_STRICTLY: {
      emit('strictlyChange', true);
      break;
    }
    case ToolbarEnum.EXPAND_ALL: {
      emit('clearSearch');
      props.expandAll?.(true);
      break;
    }
    case ToolbarEnum.RELOAD: {
      emit('reload');
      break;
    }
    case ToolbarEnum.SELECT_ALL: {
      props.checkAll?.(true);
      break;
    }
    case ToolbarEnum.UN_EXPAND_ALL: {
      emit('clearSearch');
      props.expandAll?.(false);
      break;
    }
    case ToolbarEnum.UN_SELECT_ALL: {
      props.checkAll?.(false);
      break;
    }
    default: {
      e.onClick?.();
      break;
    }
  }
}
</script>
<template>
  <div :class="b('header')">
    <BasicCaption :content="title" :help-message="helpMessage" class="px-[10px]">
      <template v-if="slots.headerTitle" #content>
        <slot name="headerTitle"></slot>
      </template>
      <template #action>
        <div class="flex">
          <div v-if="showToolbar || dropDownActions.length > 0" class="flex flex-1 cursor-pointer items-center justify-self-stretch">
            <Dropdown @click.prevent>
              <i class="icon-ym icon-ym-mpMenu"></i>
              <template #overlay>
                <Menu>
                  <template v-if="showToolbar">
                    <template v-for="item in toolbarList" :key="item.value">
                      <MenuItem v-bind="{ key: item.value }" @click="handleMenuClick(item)">
                        {{ item.label }}
                      </MenuItem>
                      <MenuDivider v-if="item.divider" />
                    </template>
                  </template>
                  <template v-if="dropDownActions.length > 0">
                    <MenuItem v-for="(item, i) in dropDownActions" :key="i" @click="handleMenuClick(item)">
                      {{ item.label }}
                    </MenuItem>
                  </template>
                </Menu>
              </template>
            </Dropdown>
          </div>
          <slot v-if="slots.headerToolbar" name="headerToolbar"></slot>
        </div>
      </template>
    </BasicCaption>
  </div>
</template>
