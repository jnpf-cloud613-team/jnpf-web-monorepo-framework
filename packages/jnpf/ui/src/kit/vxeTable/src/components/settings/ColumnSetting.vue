<script lang="ts">
import type { CheckboxChangeEvent } from 'ant-design-vue/lib/checkbox/interface';
import type Sortable from 'sortablejs';
import type { VxeColumnPropTypes } from 'vxe-table';

import type { BasicColumn, BasicTableProps, ColumnChangeParam } from '../../types/table';

import { computed, defineComponent, nextTick, reactive, ref, toRefs, unref, watchEffect } from 'vue';

import { ScrollContainer } from '@jnpf/ui';
import { getPopupContainer as getParentContainer, isFunction, isNullOrUnDef } from '@jnpf/utils';

import { ArrowAlignLeft } from '@vben/icons';
import { $t } from '@vben/locales';

import { DragOutlined, SettingOutlined } from '@ant-design/icons-vue';
import { Checkbox, Divider, Popover, Tooltip } from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';
import Sortablejs from 'sortablejs';

import { useTableContext } from '../../hooks/useTableContext';

interface State {
  checkAll: boolean;
  checkedList: string[];
  defaultCheckList: string[];
  isInit?: boolean;
}

interface Options {
  fixed?: VxeColumnPropTypes.Fixed;
  label: string;
  value: string;
}

export default defineComponent({
  components: {
    ArrowAlignLeft,
    Checkbox,
    CheckboxGroup: Checkbox.Group,
    Divider,
    DragOutlined,
    Popover,
    ScrollContainer,
    SettingOutlined,
    Tooltip,
  },
  emits: ['columnsChange'],
  name: 'ColumnSetting',

  setup(_, { attrs, emit }) {
    const table = useTableContext();

    // const defaultRowSelection = omit(table.getRowSelection(), 'selectedRowKeys');
    let inited = false;
    // 是否当前的setColums触发的
    let isSetColumnsFromThis = false;
    // 是否当前组件触发的setProps
    let isSetPropsFromThis = false;

    const cachePlainOptions = ref<Options[]>([]);
    const plainOptions = ref<any | Options[]>([]);

    const plainSortOptions = ref<Options[]>([]);

    const columnListRef = ref(null);

    const state = reactive<State>({
      checkAll: true,
      checkedList: [],
      defaultCheckList: [],
    });
    /** 缓存初始化props */
    let cacheTableProps: Partial<BasicTableProps> = {};
    const checkIndex = ref(false);
    const checkSelect = ref(false);

    const prefixCls = 'jnpf-basic-column-setting';

    const getValues = computed(() => {
      return unref(table?.getBindValues) || {};
    });

    watchEffect(() => {
      const columns = table.getColumns();
      setTimeout(() => {
        if (isSetColumnsFromThis) {
          isSetColumnsFromThis = false;
        } else if (columns.length > 0) {
          init();
        }
      }, 0);
    });

    watchEffect(() => {
      const values = unref(getValues);
      if (isSetPropsFromThis) {
        isSetPropsFromThis = false;
      } else {
        cacheTableProps = cloneDeep(values);
      }
      checkIndex.value = !!values.showIndexColumn;
      // checkSelect.value = !!values.rowSelection;
    });

    function getColumns() {
      const ret: Options[] = [];
      table.getColumns({ ignoreAllType: true }).forEach((item) => {
        ret.push({
          label: item.title as string,
          value: (item.dataIndex || item.title) as string,
          ...item,
        });
      });
      return ret;
    }

    async function init(isReset = false) {
      // Sortablejs存在bug，不知道在哪个步骤中会向el append了一个childNode，因此这里先清空childNode
      // 有可能复现上述问题的操作：拖拽一个元素，快速的上下移动，最后放到最后的位置中松手
      plainOptions.value = [];
      const columnListEl = unref(columnListRef);
      if (columnListEl && (columnListEl as any).$el) {
        const el = (columnListEl as any).$el as Element;
        [...el.children].forEach((item) => item.remove());
      }
      await nextTick();
      const columns = isReset ? cloneDeep(cachePlainOptions.value) : getColumns();

      const checkList = table
        .getColumns({ ignoreAllType: true })
        .map((item) => {
          if (item.defaultHidden) {
            return '';
          }
          return item.dataIndex || item.title;
        })
        .filter(Boolean) as string[];
      plainOptions.value = columns;
      plainSortOptions.value = columns;
      // 更新缓存配置
      table.setCacheColumns?.(columns);
      !isReset && (cachePlainOptions.value = cloneDeep(columns));
      state.defaultCheckList = checkList;
      state.checkedList = checkList;
      // 是否列展示全选
      state.checkAll = checkList.length === columns.length;
      inited = false;
      handleOpenChange();
    }

    // checkAll change
    function onCheckAllChange(e: CheckboxChangeEvent) {
      const checkList = plainSortOptions.value.map((item) => item.value);
      plainSortOptions.value.forEach((item) => ((item as BasicColumn).defaultHidden = !e.target.checked));
      if (e.target.checked) {
        state.checkedList = checkList;
        setColumns(checkList);
      } else {
        state.checkedList = [];
        setColumns([]);
      }
    }

    const indeterminate = computed(() => {
      const len = plainOptions.value.length;
      const checkedLen = state.checkedList.length;
      // unref(checkIndex) && checkedLen--;
      return checkedLen > 0 && checkedLen < len;
    });

    // Trigger when check/uncheck a column
    function onChange(checkedList: any[]) {
      const len = plainSortOptions.value.length;
      state.checkAll = checkedList.length === len;
      const sortList = unref(plainSortOptions).map((item) => item.value);
      checkedList.sort((prev, next) => {
        return sortList.indexOf(prev) - sortList.indexOf(next);
      });
      unref(plainSortOptions).forEach((item) => {
        (item as BasicColumn).defaultHidden = !checkedList.includes(item.value);
      });
      setColumns(checkedList);
    }

    let sortable: Sortable;
    let sortableOrder: string[] = [];
    // reset columns
    function reset() {
      setColumns(cachePlainOptions.value);
      init(true);
      checkIndex.value = !!cacheTableProps.showIndexColumn;
      // checkSelect.value = !!cacheTableProps.rowSelection;
      table.setProps({
        showIndexColumn: checkIndex.value,
        // rowSelection: checkSelect.value ? defaultRowSelection : undefined,
        // rowSelection: undefined,
      });
      sortable.sort(sortableOrder);
    }

    // Open the pop-up window for drag and drop initialization
    function handleOpenChange() {
      if (inited) return;
      nextTick(() => {
        const columnListEl = unref(columnListRef);
        if (!columnListEl) return;
        const el = (columnListEl as any).$el;
        if (!el) return;
        // Drag and drop sort
        sortable = Sortablejs.create(unref(el), {
          animation: 500,
          delay: 400,
          delayOnTouchOnly: true,
          handle: '.table-column-drag-icon',
          onEnd: (evt) => {
            const { newIndex, oldIndex } = evt;
            if (isNullOrUnDef(oldIndex) || isNullOrUnDef(newIndex) || oldIndex === newIndex) {
              return;
            }
            // Sort column
            const columns: any = cloneDeep(plainSortOptions.value);

            if (oldIndex > newIndex) {
              columns.splice(newIndex, 0, columns[oldIndex]);
              columns.splice(oldIndex + 1, 1);
            } else {
              columns.splice(newIndex + 1, 0, columns[oldIndex]);
              columns.splice(oldIndex, 1);
            }

            plainSortOptions.value = columns;
            setColumns(columns.filter((item) => state.checkedList.includes(item.value)));
          },
        });
        // 记录原始order 序列
        sortableOrder = sortable.toArray();
        inited = true;
      });
    }

    // Control whether the serial number column is displayed
    function handleIndexCheckChange(e: CheckboxChangeEvent) {
      isSetPropsFromThis = true;
      isSetColumnsFromThis = true;
      table.setProps({
        showIndexColumn: e.target.checked,
      });
    }

    function handleColumnFixed(item: BasicColumn, fixed?: VxeColumnPropTypes.Fixed) {
      if (!state.checkedList.includes(item.dataIndex as string)) return;

      const columns: any = getColumns().filter((c: BasicColumn) => state.checkedList.includes(c.dataIndex as string)) as BasicColumn[];
      const isFixed = item.fixed === fixed ? undefined : fixed;
      const index = columns.findIndex((col) => col.dataIndex === item.dataIndex);
      if (index !== -1) {
        columns[index].fixed = isFixed;
      }
      item.fixed = isFixed;

      if (isFixed && !item.width) {
        item.width = 100;
      }
      updateSortOption(item);
      table.setCacheColumnsByField?.(item.dataIndex as string, { fixed: isFixed });
      setColumns(columns);
    }

    function setColumns(columns: BasicColumn[] | string[]) {
      isSetPropsFromThis = true;
      isSetColumnsFromThis = true;
      table.setColumns(columns);
      const data: ColumnChangeParam[] = unref(plainSortOptions).map((col) => {
        const visible = columns.some((c: BasicColumn | string) => c === col.value || (typeof c !== 'string' && c.dataIndex === col.value));
        return { dataIndex: col.value, fixed: (col.fixed || undefined) as VxeColumnPropTypes.Fixed, visible };
      });

      emit('columnsChange', data);
    }

    function getPopupContainer() {
      return isFunction(attrs.getPopupContainer) ? attrs.getPopupContainer() : getParentContainer();
    }

    function updateSortOption(column: BasicColumn) {
      plainSortOptions.value.forEach((item) => {
        if (item.value === column.dataIndex) {
          Object.assign(item, column);
        }
      });
    }

    return {
      t: $t,
      ...toRefs(state),
      checkIndex,
      checkSelect,
      columnListRef,
      getPopupContainer,
      handleColumnFixed,
      handleIndexCheckChange,
      handleOpenChange,
      indeterminate,
      onChange,
      onCheckAllChange,
      plainOptions,
      prefixCls,
      reset,
    };
  },
});
</script>
<template>
  <Tooltip placement="top">
    <template #title>
      <span>{{ t('component.table.settingColumn') }}</span>
    </template>
    <Popover
      :get-popup-container="getPopupContainer"
      :overlay-class-name="`${prefixCls}__column-list`"
      placement="bottomRight"
      trigger="click"
      @open-change="handleOpenChange">
      <template #title>
        <div :class="`${prefixCls}__popover-title`">
          <Checkbox v-model:checked="checkAll" :indeterminate="indeterminate" @change="onCheckAllChange">
            {{ t('component.table.settingColumnShow') }}
          </Checkbox>
          <a-button size="small" type="link" @click="reset">
            {{ t('common.resetText') }}
          </a-button>
        </div>
      </template>

      <template #content>
        <ScrollContainer>
          <CheckboxGroup ref="columnListRef" v-model:value="checkedList" @change="onChange">
            <template v-for="item in plainOptions" :key="item.value">
              <div v-if="!('ifShow' in item && !item.ifShow)" :class="`${prefixCls}__check-item`">
                <DragOutlined class="table-column-drag-icon" />
                <Checkbox :value="item.value">
                  {{ item.labelI18nCode ? t(item.labelI18nCode, item.label) : item.label }}
                </Checkbox>

                <Tooltip :get-popup-container="getPopupContainer" :mouse-leave-delay="0.4" placement="bottomLeft">
                  <template #title>
                    {{ t('component.table.settingFixedLeft') }}
                  </template>
                  <ArrowAlignLeft
                    :class="[
                      `${prefixCls}__fixed-left`,
                      {
                        active: item.fixed === 'left',
                        disabled: !checkedList.includes(item.value),
                      },
                    ]"
                    @click="handleColumnFixed(item, 'left')" />
                </Tooltip>
                <Divider type="vertical" />
                <Tooltip :get-popup-container="getPopupContainer" :mouse-leave-delay="0.4" placement="bottomLeft">
                  <template #title>
                    {{ t('component.table.settingFixedRight') }}
                  </template>
                  <ArrowAlignLeft
                    :class="[
                      `${prefixCls}__fixed-right`,
                      {
                        active: item.fixed === 'right',
                        disabled: !checkedList.includes(item.value),
                      },
                    ]"
                    @click="handleColumnFixed(item, 'right')" />
                </Tooltip>
              </div>
            </template>
          </CheckboxGroup>
        </ScrollContainer>
      </template>
      <SettingOutlined />
    </Popover>
  </Tooltip>
</template>
<style lang="scss">
.jnpf-basic-column-setting {
  &__popover-title {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 22px;
    margin-bottom: 10px;
  }

  &__check-item {
    display: flex;
    align-items: center;
    min-width: 100%;
    padding: 4px 16px 8px 0;

    .ant-checkbox-wrapper {
      display: flex;
      flex: 1;
      min-width: 0;

      .ant-checkbox + span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &:hover {
        color: var(--primary-color);
      }
    }
  }

  &__fixed-left,
  &__fixed-right {
    flex-shrink: 0;
    color: var(--text-color-label);
    cursor: pointer;

    &.active,
    &:hover {
      color: var(--primary-color);
    }

    &.disabled {
      color: rgb(0 0 0 / 25%);
      cursor: not-allowed;
    }
  }

  &__fixed-right {
    transform: rotate(180deg);
  }

  &__column-list {
    .ant-popover-title {
      font-weight: 500;
      border-bottom: 1px solid var(--border-color-base1);
    }

    svg {
      width: 1em !important;
      height: 1em !important;
    }

    .table-column-drag-icon {
      margin: 0 5px;
      cursor: move;
    }

    .ant-popover-inner-content {
      // max-height: 360px;
      padding-right: 0;
      padding-left: 0;
      // overflow: auto;
    }

    .ant-checkbox-group {
      min-width: 260px;
      max-width: 300px;
    }

    .scrollbar {
      height: 220px;
    }
  }
}
</style>
