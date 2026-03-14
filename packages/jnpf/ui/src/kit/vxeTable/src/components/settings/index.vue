<script lang="ts">
import type { PropType } from 'vue';

import type { ColumnChangeParam, TableSetting } from '../../types/table';

import { computed, defineComponent, unref } from 'vue';

import { useTableContext } from '../../hooks/useTableContext';
import ColumnSetting from './ColumnSetting.vue';
import ExpandSetting from './ExpandSetting.vue';
import FullScreenSetting from './FullScreenSetting.vue';
import RedoSetting from './RedoSetting.vue';
import SizeSetting from './SizeSetting.vue';

export default defineComponent({
  components: {
    ColumnSetting,
    ExpandSetting,
    FullScreenSetting,
    RedoSetting,
    SizeSetting,
  },
  emits: ['columnsChange'],
  name: 'TableSetting',
  props: {
    setting: {
      default: () => ({}),
      type: Object as PropType<TableSetting>,
    },
  },
  setup(props, { emit }) {
    const table = useTableContext();

    const getSetting = computed((): TableSetting => {
      return {
        expand: true,
        fullScreen: false,
        redo: true,
        setting: true,
        size: false,
        ...props.setting,
      };
    });
    const getIsTreeTable = computed(() => {
      const getBindValues = table.getBindValues;
      return unref(getBindValues).isTreeTable;
    });

    function handleColumnChange(data: ColumnChangeParam[]) {
      emit('columnsChange', data);
    }

    function getTableContainer() {
      return table ? unref(table.wrapRef) : document.body;
    }

    return { getIsTreeTable, getSetting, getTableContainer, handleColumnChange };
  },
});
</script>
<template>
  <div class="table-settings">
    <ExpandSetting v-if="getIsTreeTable && getSetting.expand" />
    <RedoSetting v-if="getSetting.redo" />
    <SizeSetting v-if="getSetting.size" />
    <ColumnSetting v-if="getSetting.setting" @columns-change="handleColumnChange" />
    <FullScreenSetting v-if="getSetting.fullScreen" />
  </div>
</template>
<style lang="scss">
.table-settings {
  display: flex;
  align-items: center;

  & > * {
    margin-left: 10px;
  }

  svg {
    width: 1.3em;
    height: 1.3em;
  }
}
</style>
