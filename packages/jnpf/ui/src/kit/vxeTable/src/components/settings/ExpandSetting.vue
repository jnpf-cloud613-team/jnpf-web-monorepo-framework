<script lang="ts">
import { computed, defineComponent } from 'vue';

import { $t } from '@vben/locales';

import { DoubleLeftOutlined } from '@ant-design/icons-vue';
import { Tooltip } from 'ant-design-vue';

import { useTableContext } from '../../hooks/useTableContext';

export default defineComponent({
  components: {
    DoubleLeftOutlined,
    Tooltip,
  },
  name: 'ExpandSetting',
  setup() {
    const table = useTableContext();

    const isExpanded = computed(() => {
      return table.getIsExpanded();
    });

    function expandAll() {
      table.expandAll();
    }
    function collapseAll() {
      table.collapseAll();
    }

    return { collapseAll, expandAll, isExpanded, t: $t };
  },
});
</script>
<template>
  <Tooltip placement="top">
    <template #title>
      <span>{{ isExpanded ? t('common.collapseAll') : t('common.expandAll') }}</span>
    </template>
    <DoubleLeftOutlined v-if="isExpanded" class="icon-collapse" @click="collapseAll" />
    <DoubleLeftOutlined v-else class="icon-expand" @click="expandAll" />
  </Tooltip>
</template>
<style lang="scss" scoped>
.icon-collapse {
  transform: rotate(90deg);
}

.icon-expand {
  transform: rotate(270deg);
}
</style>
