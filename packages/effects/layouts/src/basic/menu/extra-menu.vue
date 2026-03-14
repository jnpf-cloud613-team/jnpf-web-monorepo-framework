<script lang="ts" setup>
import type { MenuRecordRaw } from '@vben/types';

import type { MenuProps } from '@vben-core/menu-ui';

import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { $t } from '@vben/locales';
import { mapTree } from '@vben/utils';

import { Menu } from '@vben-core/menu-ui';

import { useNavigation } from './use-navigation';

interface Props extends MenuProps {
  collapse?: boolean;
  menus?: MenuRecordRaw[];
}

const props = withDefaults(defineProps<Props>(), {
  accordion: true,
  menus: () => [],
});

const route = useRoute();
const { navigation } = useNavigation();

const getMenus = computed<MenuRecordRaw[]>(() => {
  const menus = mapTree(props.menus, (item) => {
    return {
      ...item,
      name: item?.i18nCode ? $t(item.i18nCode, item.name) : item.name,
    };
  });
  return menus;
});

async function handleSelect(key: string) {
  await navigation(key);
}
</script>

<template>
  <Menu
    :accordion="accordion"
    :collapse="collapse"
    :default-active="route.meta?.activePath || route.path"
    :menus="getMenus"
    :rounded="rounded"
    :theme="theme"
    mode="vertical"
    @select="handleSelect" />
</template>
