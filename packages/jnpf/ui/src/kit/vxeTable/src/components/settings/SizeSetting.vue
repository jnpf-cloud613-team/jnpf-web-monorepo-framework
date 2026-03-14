<script lang="ts">
import { defineComponent, ref } from 'vue';

import { getPopupContainer } from '@jnpf/utils';

import { $t } from '@vben/locales';

import { ColumnHeightOutlined } from '@ant-design/icons-vue';
import { Dropdown, Menu, Tooltip } from 'ant-design-vue';

import { useTableContext } from '../../hooks/useTableContext';

export default defineComponent({
  components: {
    ColumnHeightOutlined,
    Dropdown,
    Menu,
    MenuItem: Menu.Item,
    Tooltip,
  },
  name: 'SizeSetting',
  setup() {
    const table = useTableContext();

    const selectedKeysRef = ref<string[]>([table.getSize()]);

    function handleTitleClick({ key }) {
      selectedKeysRef.value = [key];
      table.setProps({
        size: key,
      });
    }

    return {
      getPopupContainer,
      handleTitleClick,
      selectedKeysRef,
      t: $t,
    };
  },
});
</script>
<template>
  <Tooltip placement="top">
    <template #title>
      <span>{{ t('component.table.settingDens') }}</span>
    </template>

    <Dropdown :get-popup-container="getPopupContainer" :trigger="['click']" placement="bottom">
      <ColumnHeightOutlined />
      <template #overlay>
        <Menu v-model:selected-keys="selectedKeysRef" selectable @click="handleTitleClick">
          <MenuItem key="small">
            <span>{{ t('component.table.settingDensDefault') }}</span>
          </MenuItem>
          <MenuItem key="medium">
            <span>{{ t('component.table.settingDensMiddle') }}</span>
          </MenuItem>
          <MenuItem key="mini">
            <span>{{ t('component.table.settingDensSmall') }}</span>
          </MenuItem>
        </Menu>
      </template>
    </Dropdown>
  </Tooltip>
</template>
