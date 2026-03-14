<script lang="ts">
import type { PropType } from 'vue';

import type { ColumnChangeParam, TableSetting } from '../types/table';

import { defineComponent } from 'vue';

import { Space } from 'ant-design-vue';

import TableSettingComponent from './settings/index.vue';
import TableTitle from './TableTitle.vue';

export default defineComponent({
  components: {
    ASpace: Space,
    TableSetting: TableSettingComponent,
    TableTitle,
  },
  emits: ['columnsChange'],
  inheritAttrs: false,
  name: 'BasicTableHeader',
  props: {
    showTableSetting: {
      type: Boolean,
    },
    tableSetting: {
      type: Object as PropType<TableSetting>,
    },
    title: {
      type: [Function, String] as PropType<((data: Recordable) => string) | string>,
    },
    titleHelpMessage: {
      default: '',
      type: [String, Array] as PropType<string | string[]>,
    },
  },
  setup(_, { emit }) {
    const prefixCls = 'jnpf-vxe-table-header';
    function handleColumnChange(data: ColumnChangeParam[]) {
      emit('columnsChange', data);
    }
    return { handleColumnChange, prefixCls };
  },
});
</script>
<template>
  <div class="flex-shrink-0">
    <div v-if="$slots.headerTop">
      <slot name="headerTop"></slot>
    </div>
    <div :class="prefixCls" class="flex items-center">
      <div v-if="$slots.tableTitle" :class="`${prefixCls}__action`">
        <ASpace :size="10">
          <slot name="tableTitle"></slot>
        </ASpace>
      </div>
      <TableTitle v-if="!$slots.tableTitle && title" :help-message="titleHelpMessage" :title="title" />
      <div :class="`${prefixCls}__toolbar`">
        <slot name="toolbar"></slot>
        <TableSetting v-if="showTableSetting" :setting="tableSetting" @columns-change="handleColumnChange" />
        <div class="table-settings">
          <slot name="toolbarAfter"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.jnpf-vxe-table-header {
  height: 60px;
  padding: 0 10px;

  &__toolbar {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-end;

    svg {
      width: 1.3em;
      height: 1.3em;
      cursor: pointer;
    }
  }

  &__action {
    display: flex;
    align-items: center;

    .ant-btn + .ant-btn {
      margin-left: 10px;
    }

    .ant-btn-link {
      padding: 4px 0;
    }
  }
}
</style>
