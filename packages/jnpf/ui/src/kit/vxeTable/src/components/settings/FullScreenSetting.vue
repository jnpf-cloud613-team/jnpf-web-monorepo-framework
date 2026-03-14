<script lang="ts">
import { defineComponent } from 'vue';

import { $t } from '@vben/locales';

import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons-vue';
import { useFullscreen } from '@vueuse/core';
import { Tooltip } from 'ant-design-vue';

import { useTableContext } from '../../hooks/useTableContext';

export default defineComponent({
  components: {
    FullscreenExitOutlined,
    FullscreenOutlined,
    Tooltip,
  },
  name: 'FullScreenSetting',

  setup() {
    const table = useTableContext();
    const { isFullscreen, toggle } = useFullscreen(table.wrapRef);

    return {
      isFullscreen,
      t: $t,
      toggle,
    };
  },
});
</script>
<template>
  <Tooltip placement="top">
    <template #title>
      <span>{{ $t('component.table.settingFullScreen') }}</span>
    </template>
    <FullscreenOutlined v-if="!isFullscreen" @click="toggle" />
    <FullscreenExitOutlined v-else @click="toggle" />
  </Tooltip>
</template>
