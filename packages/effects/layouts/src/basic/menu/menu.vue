<script lang="ts" setup>
import type { MenuRecordRaw } from '@vben/types';

import type { MenuProps } from '@vben-core/menu-ui';

import { computed } from 'vue';

import { $t } from '@vben/locales';
import { mapTree } from '@vben/utils';

import { Menu } from '@vben-core/menu-ui';

interface Props extends MenuProps {
  menus?: MenuRecordRaw[];
}

const props = withDefaults(defineProps<Props>(), {
  accordion: true,
  menus: () => [],
});

const emit = defineEmits<{
  open: [string, string[]];
  select: [string, string?];
}>();

const getMenus = computed<MenuRecordRaw[]>(() => {
  const menus = mapTree(props.menus, (item) => {
    return {
      ...item,
      name: item?.i18nCode ? $t(item.i18nCode, item.name) : item.name,
    };
  });
  return menus;
});

function handleMenuSelect(key: string) {
  emit('select', key, props.mode);
}

function handleMenuOpen(key: string, path: string[]) {
  emit('open', key, path);
}
</script>

<template>
  <Menu
    :accordion="accordion"
    :collapse="collapse"
    :collapse-show-title="collapseShowTitle"
    :default-active="defaultActive"
    :menus="getMenus"
    :mode="mode"
    :rounded="rounded"
    scroll-to-active
    :theme="theme"
    @open="handleMenuOpen"
    @select="handleMenuSelect" />
</template>
