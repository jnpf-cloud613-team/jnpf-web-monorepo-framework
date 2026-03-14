<script lang="ts">
import { defineComponent } from 'vue';

import { $t } from '@vben/locales';

import { RedoOutlined } from '@ant-design/icons-vue';
import { Tooltip } from 'ant-design-vue';

import { useTableContext } from '../../hooks/useTableContext';

export default defineComponent({
  components: {
    RedoOutlined,
    Tooltip,
  },
  name: 'RedoSetting',
  setup() {
    const table = useTableContext();

    function redo() {
      table.clearSelectedRowKeys();
      table.reload();
    }

    return { redo, t: $t };
  },
});
</script>
<template>
  <Tooltip placement="top">
    <template #title>
      <span>{{ t('common.redo') }}</span>
    </template>
    <RedoOutlined @click="redo" />
  </Tooltip>
</template>
