<script lang="ts" setup>
import type { PropType } from 'vue';

import type { DropMenu } from './typing';

import { computed } from 'vue';

import { useMessage } from '@jnpf/hooks';
import { isFunction } from '@jnpf/utils';

import { $t } from '@vben/locales';

import { Dropdown, Menu, Popconfirm } from 'ant-design-vue';
import { omit } from 'lodash-es';

const props = defineProps({
  dropMenuList: {
    default: () => [],
    type: Array as PropType<(DropMenu & Recordable)[]>,
  },
  popconfirm: Boolean,
  selectedKeys: {
    default: () => [],
    type: Array as PropType<string[]>,
  },
  /**
   * the trigger mode which executes the drop-down action
   * @default ['hover']
   * @type string[]
   */
  trigger: {
    default: () => {
      return ['contextmenu'];
    },
    type: Array as PropType<('click' | 'contextmenu' | 'hover')[]>,
  },
});
const emit = defineEmits(['menuEvent']);
const ADropdown = Dropdown;
const AMenu = Menu;
const AMenuItem = Menu.Item;
const AMenuDivider = Menu.Divider;
const APopconfirm = Popconfirm;
const { createConfirm } = useMessage();

function handleClickMenu(item) {
  const { event } = item;
  const menu = props.dropMenuList.find((item) => `${item.event}` === `${event}`);
  emit('menuEvent', menu);
  if (item.modelConfirm) {
    createConfirm({
      content: item.modelConfirm?.content || $t('common.delTip'),
      iconType: item.modelConfirm?.iconType || 'warning',
      onOk: item.modelConfirm?.onOk,
      title: item.modelConfirm?.title || $t('common.tipTitle'),
    });
  } else {
    !props.popconfirm && item.onClick?.();
  }
}

const getPopConfirmAttrs = computed(() => {
  return (attrs) => {
    const originAttrs = omit(attrs, ['confirm', 'cancel', 'icon']);
    if (!attrs.onConfirm && attrs.confirm && isFunction(attrs.confirm)) originAttrs.onConfirm = attrs.confirm;
    if (!attrs.onCancel && attrs.cancel && isFunction(attrs.cancel)) originAttrs.onCancel = attrs.cancel;
    return originAttrs;
  };
});

const getAttr = (key: number | string) => ({ key });
</script>

<template>
  <ADropdown :trigger="trigger" v-bind="$attrs">
    <span>
      <slot></slot>
    </span>
    <template #overlay>
      <AMenu :selected-keys="selectedKeys">
        <template v-for="item in dropMenuList" :key="`${item.event}`">
          <AMenuItem v-bind="getAttr(item.event)" :disabled="item.disabled" @click="handleClickMenu(item)">
            <APopconfirm v-if="popconfirm && item.popConfirm" v-bind="getPopConfirmAttrs(item.popConfirm)">
              <template v-if="item.popConfirm.icon" #icon>
                <i :class="item.popConfirm.icon"></i>
              </template>
              <div>
                <i v-if="item.icon" :class="item.icon"></i>
                <span class="ml-1">{{ item.text }}</span>
              </div>
            </APopconfirm>
            <template v-else>
              <i v-if="item.icon" :class="item.icon"></i>
              <span class="ml-1">{{ item.text }}</span>
            </template>
          </AMenuItem>
          <AMenuDivider v-if="item.divider" :key="`d-${item.event}`" />
        </template>
      </AMenu>
    </template>
  </ADropdown>
</template>
