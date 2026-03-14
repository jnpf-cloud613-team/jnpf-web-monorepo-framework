<script lang="tsx">
import type { CSSProperties, FunctionalComponent, PropType } from 'vue';

import type { Axis, ContextMenuItem, ItemContentProps } from './typing';

import { computed, defineComponent, nextTick, onMounted, onUnmounted, ref, unref } from 'vue';

import { VbenIcon } from '@vben-core/shadcn-ui';

import { Divider, Menu } from 'ant-design-vue';

const prefixCls = 'context-menu';

const props = {
  axis: {
    default() {
      return { x: 0, y: 0 };
    },
    // The position of the right mouse button click
    type: Object as PropType<Axis>,
  },
  customEvent: { default: null, type: Object as PropType<Event> },
  showIcon: { default: true, type: Boolean },
  styles: { type: Object as PropType<CSSProperties> },
  width: { default: 150, type: Number },
  items: {
    default() {
      return [];
    },
    // The most important list, if not, will not be displayed
    type: Array as PropType<ContextMenuItem[]>,
  },
};

const ItemContent: FunctionalComponent<ItemContentProps> = (props) => {
  const { item } = props;
  return (
    <span class="px-4" onClick={props.handler.bind(null, item)} style="display: inline-block; width: 100%; ">
      {props.showIcon && item.icon && <VbenIcon class={`${prefixCls}__icon mr-2`} icon={item.icon} />}
      <span>{item.label}</span>
    </span>
  );
};

export default defineComponent({
  name: 'ContextMenu',
  props,
  setup(props) {
    const wrapRef = ref(null);
    const showRef = ref(false);

    const getStyle = computed((): CSSProperties => {
      const { axis, styles, width, items } = props;
      const { x, y } = axis || { x: 0, y: 0 };
      const menuHeight = (items || []).length * 40;
      const menuWidth = width;
      const body = document.body;

      const left = body.clientWidth < x + menuWidth ? x - menuWidth : x;
      const top = body.clientHeight < y + menuHeight ? y - menuHeight : y;
      return {
        ...styles,
        left: `${left + 1}px`,
        position: 'absolute',
        top: `${top + 1}px`,
        width: `${width}px`,
        zIndex: 9999999,
      };
    });

    onMounted(() => {
      nextTick(() => (showRef.value = true));
    });

    onUnmounted(() => {
      const el: any = unref(wrapRef);
      el && el.remove();
    });

    function handleAction(item: ContextMenuItem, e: MouseEvent) {
      const { disabled, handler } = item;
      if (disabled) {
        return;
      }
      showRef.value = false;
      e?.stopPropagation();
      e?.preventDefault();
      handler?.();
    }

    function renderMenuItem(items: ContextMenuItem[]) {
      const visibleItems = items.filter((item) => !item.hidden);
      return visibleItems.map((item) => {
        const { disabled, divider = false, label, children } = item;

        const contentProps = {
          handler: handleAction,
          item,
          showIcon: props.showIcon,
        };

        if (!children || children.length === 0) {
          return (
            <>
              <Menu.Item class={`${prefixCls}__item`} disabled={disabled} key={label}>
                <ItemContent {...contentProps} />
              </Menu.Item>
              {divider ? <Divider key={`d-${label}`} /> : null}
            </>
          );
        }
        if (!unref(showRef)) return null;

        return (
          <Menu.SubMenu disabled={disabled} key={label} popupClassName={`${prefixCls}__popup`}>
            {{
              default: () => renderMenuItem(children),
              title: () => <ItemContent {...contentProps} />,
            }}
          </Menu.SubMenu>
        );
      });
    }
    return () => {
      if (!unref(showRef)) {
        return null;
      }
      const { items } = props;
      return (
        <div class={prefixCls}>
          <Menu class="context-menu-main" inlineIndent={12} mode="vertical" ref={wrapRef} style={unref(getStyle)}>
            {renderMenuItem(items)}
          </Menu>
        </div>
      );
    };
  },
});
</script>
<style lang="scss">
$default-height: 42px !important;

.context-menu {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999999;
  display: block;
  width: 120px;
  margin: 0;
  user-select: none;
  list-style: none;
  background-color: var(--component-background);
  background-clip: padding-box;
  border: 1px solid rgb(0 0 0 / 8%);
  border-radius: var(--radius);
  box-shadow:
    0 2px 2px 0 rgb(0 0 0 / 14%),
    0 3px 1px -2px rgb(0 0 0 / 10%),
    0 1px 5px 0 rgb(0 0 0 / 6%);

  .ant-menu {
    border-radius: var(--radius);
  }

  &__item {
    margin: 0 !important;
  }

  &__icon {
    display: inline-block;
  }

  svg.context-menu__icon {
    width: 20px;
    height: 20px;
    line-height: $default-height;
  }

  li {
    display: inline-block;
    width: 100% !important;
    height: $default-height !important;
    margin: 0 !important;
    line-height: $default-height !important;
    border-radius: var(--radius);

    span {
      font-size: 12px;
      line-height: $default-height;
    }

    > div {
      margin: 0 !important;
    }

    &:not(.ant-menu-item-disabled):hover {
      color: var(--text-color-base);
      background-color: var(--selected-hover-bg);
    }
  }

  .ant-divider {
    margin: 0;
  }

  &__popup {
    .ant-divider {
      margin: 0;
    }

    li {
      display: inline-block;
      width: 100% !important;
      height: $default-height !important;
      margin: 0 !important;
      line-height: $default-height !important;
      border-radius: var(--radius);

      span {
        font-size: 12px;
        line-height: $default-height;
      }

      > div {
        margin: 0 !important;
      }

      &:not(.ant-menu-item-disabled):hover {
        color: var(--text-color-base);
        background-color: var(--selected-hover-bg);
      }
    }
  }

  .ant-menu-submenu-title,
  .ant-menu-item {
    padding: 0 !important;
  }

  .context-menu-main {
    box-shadow:
      0 3px 6px -4px rgb(0 0 0 / 12%),
      0 6px 16px 0 rgb(0 0 0 / 8%),
      0 9px 28px 8px rgb(0 0 0 / 5%) !important;
  }
}
</style>
