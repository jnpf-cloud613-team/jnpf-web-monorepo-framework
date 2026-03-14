<script lang="ts" setup>
import { computed, useSlots } from 'vue';

import { useRefresh } from '@vben/hooks';
import { RotateCw } from '@vben/icons';
import { preferences, usePreferences } from '@vben/preferences';
import { useAccessStore } from '@vben/stores';

import { VbenFullScreen, VbenIconButton } from '@vben-core/shadcn-ui';

import { GlobalSearch, PreferencesButton } from '../../widgets';

interface Props {
  /**
   * Logo 主题
   */
  theme?: string;
}

defineOptions({
  name: 'LayoutHeader',
});

withDefaults(defineProps<Props>(), {
  theme: 'light',
});

const emit = defineEmits<{ clearPreferencesAndLogout: [] }>();

const REFERENCE_VALUE = 50;

const accessStore = useAccessStore();
const { globalSearchShortcutKey, preferencesButtonPosition } = usePreferences();
const slots = useSlots();
const { refresh } = useRefresh();

const rightSlots = computed(() => {
  const list = [{ index: REFERENCE_VALUE + 100, name: 'user-dropdown' }];
  if (preferences.widget.globalSearch) {
    list.push({
      index: REFERENCE_VALUE,
      name: 'global-search',
    });
  }
  if (preferences.widget.fullscreen) {
    list.push({
      index: REFERENCE_VALUE + 30,
      name: 'fullscreen',
    });
  }
  if (preferencesButtonPosition.value.header) {
    list.push({
      index: REFERENCE_VALUE + 50,
      name: 'preferences',
    });
  }

  Object.keys(slots).forEach((key) => {
    const name = key.split('-');
    if (key.startsWith('header-right')) {
      list.push({ index: Number(name[2]), name: key });
    }
  });
  return list.sort((a, b) => a.index - b.index);
});

const leftSlots = computed(() => {
  const list: Array<{ index: number; name: string }> = [];

  if (preferences.widget.refresh) {
    list.push({
      index: 10,
      name: 'refresh',
    });
  }

  Object.keys(slots).forEach((key) => {
    const name = key.split('-');
    if (key.startsWith('header-left')) {
      list.push({ index: Number(name[2]), name: key });
    }
  });
  return list.sort((a, b) => a.index - b.index);
});

function clearPreferencesAndLogout() {
  emit('clearPreferencesAndLogout');
}
</script>

<template>
  <template v-for="slot in leftSlots.filter((item) => item.index < REFERENCE_VALUE)" :key="slot.name">
    <slot :name="slot.name">
      <template v-if="slot.name === 'refresh'">
        <VbenIconButton class="global-header-icon my-0 rounded-md" @click="refresh">
          <RotateCw class="size-4" />
        </VbenIconButton>
      </template>
    </slot>
  </template>
  <div class="flex-center hidden lg:block">
    <slot name="breadcrumb"></slot>
  </div>
  <template v-for="slot in leftSlots.filter((item) => item.index > REFERENCE_VALUE)" :key="slot.name">
    <slot :name="slot.name"></slot>
  </template>
  <div :class="`menu-align-${preferences.header.menuAlign}`" class="flex h-full min-w-0 flex-1 items-center" id="layout-header-menu">
    <slot name="menu"></slot>
  </div>
  <div class="flex h-full min-w-0 flex-shrink-0 items-center" id="layout-header-right">
    <template v-for="slot in rightSlots" :key="slot.name">
      <slot :name="slot.name">
        <template v-if="slot.name === 'global-search'">
          <GlobalSearch :enable-shortcut-key="globalSearchShortcutKey" :menus="accessStore.accessMenus" class="mr-1" />
        </template>
        <template v-else-if="slot.name === 'fullscreen'">
          <slot name="header-fullscreen">
            <VbenFullScreen class="mr-1" />
          </slot>
        </template>
        <template v-else-if="slot.name === 'preferences'">
          <PreferencesButton class="mr-1" @clear-preferences-and-logout="clearPreferencesAndLogout" />
        </template>
      </slot>
    </template>
  </div>
</template>
<style lang="scss" scoped>
.menu-align-start {
  --menu-align: start;
}

.menu-align-center {
  --menu-align: center;
}

.menu-align-end {
  --menu-align: end;
}
</style>
