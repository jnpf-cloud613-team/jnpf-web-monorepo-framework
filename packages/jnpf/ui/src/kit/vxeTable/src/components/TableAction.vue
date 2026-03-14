<script lang="ts">
import type { TooltipProps } from 'ant-design-vue';

import type { PropType } from 'vue';

import type { TableActionType } from '../types/table';
import type { ActionItem } from '../types/tableAction';

import { computed, defineComponent, toRaw, unref } from 'vue';

import { usePermission } from '@jnpf/hooks';
import { Dropdown, ModelConfirmButton, PopConfirmButton } from '@jnpf/ui';
import { isBoolean, isFunction, isString, propTypes } from '@jnpf/utils';

import { $t } from '@vben/locales';

import { DownOutlined } from '@ant-design/icons-vue';
import { Space, Tooltip } from 'ant-design-vue';

import { ACTION_COLUMN_FLAG } from '../const';
import { useTableContext } from '../hooks/useTableContext';

export default defineComponent({
  components: { ASpace: Space, DownOutlined, Dropdown, ModelConfirmButton, PopConfirmButton, Tooltip },
  name: 'TableAction',
  props: {
    actions: {
      default: null,
      type: Array as PropType<ActionItem[]>,
    },
    divider: propTypes.bool.def(true),
    dropDownActions: {
      default: null,
      type: Array as PropType<ActionItem[]>,
    },
    outside: propTypes.bool,
    stopButtonPropagation: propTypes.bool.def(false),
  },
  setup(props) {
    const prefixCls = 'jnpf-basic-table-action';
    let table: Partial<any> = {};
    if (!props.outside) {
      table = useTableContext();
    }

    const { hasBtnP } = usePermission();
    function isIfShow(action: ActionItem): boolean {
      const ifShow = action.ifShow;

      let isIfShow = true;

      if (isBoolean(ifShow)) {
        isIfShow = ifShow;
      }
      if (isFunction(ifShow)) {
        isIfShow = ifShow(action);
      }
      return isIfShow;
    }

    const getActions = computed(() => {
      return (toRaw(props.actions) || [])
        .filter((action) => {
          return hasBtnP(action.auth) && isIfShow(action);
        })
        .map((action) => {
          const { popConfirm } = action;
          return {
            getPopupContainer: () => unref((table as any)?.wrapRef) ?? document.body,
            size: 'small',
            type: 'link',
            ...action,
            ...popConfirm,
            enable: !!popConfirm,
            onCancel: popConfirm?.cancel,
            onConfirm: popConfirm?.confirm,
          };
        });
    });
    const getDropdownList = computed((): any[] => {
      const list = (toRaw(props.dropDownActions) || []).filter((action) => {
        return hasBtnP(action.auth) && isIfShow(action);
      });
      return list.map((action, index) => {
        const { label, popConfirm } = action;
        return {
          ...action,
          ...popConfirm,
          divider: index < list.length - 1 ? props.divider : false,
          onCancel: popConfirm?.cancel,
          onConfirm: popConfirm?.confirm,
          text: label,
        };
      });
    });

    const getAlign = computed(() => {
      const columns = (table as TableActionType)?.getColumns?.() || [];
      const actionColumn = columns.find((item) => item.flag === ACTION_COLUMN_FLAG);
      return actionColumn?.align ?? 'left';
    });

    function getTooltip(data: string | TooltipProps): TooltipProps {
      return {
        getPopupContainer: () => unref((table as any)?.wrapRef) ?? document.body,
        placement: 'bottom',
        ...(isString(data) ? { title: data } : data),
      };
    }

    function onCellClick(e: MouseEvent) {
      if (!props.stopButtonPropagation) return;
      const path = e.composedPath() as HTMLElement[];
      const isInButton = path.find((ele) => {
        return ele.tagName?.toUpperCase() === 'BUTTON';
      });
      isInButton && e.stopPropagation();
    }

    return { getActions, getAlign, getDropdownList, getTooltip, onCellClick, prefixCls, t: $t };
  },
});
</script>
<template>
  <ASpace :class="[prefixCls, getAlign]" @click="onCellClick">
    <template v-for="(action, index) in getActions">
      <Tooltip v-if="action.tooltip" v-bind="getTooltip(action.tooltip)" :key="`${index}-${action.label}`">
        <template v-if="action.modelConfirm">
          <ModelConfirmButton v-bind="action">
            <i v-if="action.icon" :class="[action.icon, { 'mr-5px': !!action.label }]"></i>
            <template v-if="action.label">{{ action.label }}</template>
          </ModelConfirmButton>
        </template>
        <template v-else>
          <PopConfirmButton v-bind="action">
            <i v-if="action.icon" :class="[action.icon, { 'mr-5px': !!action.label }]"></i>
            <template v-if="action.label">{{ action.label }}</template>
          </PopConfirmButton>
        </template>
      </Tooltip>
      <template v-else>
        <template v-if="action.modelConfirm">
          <ModelConfirmButton v-bind="action" :key="`${index}-${action.label}`">
            <i v-if="action.icon" :class="[action.icon, { 'mr-5px': !!action.label }]"></i>
            <template v-if="action.label">{{ action.label }}</template>
          </ModelConfirmButton>
        </template>
        <template v-else>
          <PopConfirmButton v-bind="action" :key="`${index}-${action.label}`">
            <i v-if="action.icon" :class="[action.icon, { 'mr-5px': !!action.label }]"></i>
            <template v-if="action.label">{{ action.label }}</template>
          </PopConfirmButton>
        </template>
      </template>
    </template>
    <Dropdown v-if="dropDownActions && getDropdownList.length > 0" :drop-menu-list="getDropdownList" :trigger="['hover']">
      <slot name="more"></slot>
      <a-button v-if="!$slots.more" size="small" type="link">
        {{ t('common.moreText') }}
        <DownOutlined class="icon-more" />
      </a-button>
    </Dropdown>
  </ASpace>
</template>
<style lang="scss">
.jnpf-basic-table-action {
  display: flex;
  align-items: center;

  .action-divider {
    display: table;
  }

  &.left {
    justify-content: flex-start;
  }

  &.center {
    justify-content: center;
  }

  &.right {
    justify-content: flex-end;
  }

  .ant-btn {
    padding: 0;
  }

  button {
    display: flex;
    align-items: center;

    span {
      margin-left: 0 !important;
    }

    i {
      font-size: 14px;
    }
  }

  button.ant-btn-circle {
    span {
      margin: auto !important;
    }
  }

  .ant-divider,
  .ant-divider-vertical {
    margin: 0 2px;
  }

  .icon-more {
    margin-left: 5px !important;
  }
}
</style>
