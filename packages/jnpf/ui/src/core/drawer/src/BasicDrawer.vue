<script lang="ts">
import type { CSSProperties } from 'vue';

import type { DrawerInstance, DrawerProps } from './typing';

import { computed, defineComponent, getCurrentInstance, nextTick, ref, unref, watch } from 'vue';

import { useAttrs } from '@jnpf/hooks';
import { ScrollContainer } from '@jnpf/ui';
import { deepMerge, isFunction, isNumber } from '@jnpf/utils';

import { $t } from '@vben/locales';

import { useNamespace } from '@vben-core/composables';
import { DEFAULT_NAMESPACE } from '@vben-core/shared/constants';

import { Drawer } from 'ant-design-vue';

import DrawerFooter from './components/DrawerFooter.vue';
import DrawerHeader from './components/DrawerHeader.vue';
import { basicProps } from './props';

export default defineComponent({
  components: { Drawer, DrawerFooter, DrawerHeader, ScrollContainer },
  emits: ['openChange', 'ok', 'close', 'register'],
  inheritAttrs: false,
  props: basicProps,
  setup(props, { emit }) {
    const openRef = ref(false);
    const attrs = useAttrs({ excludeDefaultKeys: false });
    const propsRef = ref<Partial<Nullable<DrawerProps>>>(null);

    const { b } = useNamespace('basic-drawer');
    const prefixCls = b();

    const drawerInstance: DrawerInstance = {
      emitOpen: undefined,
      setDrawerProps,
    };

    const instance = getCurrentInstance();

    instance && emit('register', drawerInstance, instance.uid);

    const getMergeProps = computed((): DrawerProps => {
      return deepMerge(props, unref(propsRef)) as any;
    });

    const getProps = computed(() => {
      const opt: Partial<DrawerProps> = {
        placement: 'right',
        ...unref(attrs),
        ...unref(getMergeProps),
        open: unref(openRef),
      };
      opt.title = undefined;
      const { getContainer, isDetail, width, wrapClassName } = opt;
      if (isDetail) {
        if (!width) {
          opt.width = '100%';
        }
        const detailCls = `${prefixCls}__detail`;
        opt.rootClassName = wrapClassName ? `${wrapClassName} ${detailCls}` : detailCls;

        if (!getContainer) {
          opt.getContainer = `.${DEFAULT_NAMESPACE}-layout-content` as any;
        }
      }
      return opt as DrawerProps;
    });

    const getBindValues = computed((): any => {
      return {
        ...attrs,
        ...unref(getProps),
      };
    });

    // Custom implementation of the bottom button,
    const getFooterHeight = computed(() => {
      const { footerHeight, showFooter } = unref(getProps);
      if (showFooter && footerHeight) {
        return isNumber(footerHeight) ? `${footerHeight}px` : `${footerHeight.replace('px', '')}px`;
      }
      return `0px`;
    });

    const getScrollContentStyle = computed((): CSSProperties => {
      const footerHeight = unref(getFooterHeight);
      return {
        height: `calc(100% - ${footerHeight})`,
        position: 'relative',
      };
    });

    const getLoading = computed(() => {
      return !!unref(getProps)?.loading;
    });

    watch(
      () => props.open,
      (newVal, oldVal) => {
        if (newVal !== oldVal) openRef.value = newVal;
      },
      { deep: true },
    );

    watch(
      () => openRef.value,
      (open) => {
        nextTick(() => {
          emit('openChange', open);
          instance && drawerInstance.emitOpen?.(open, instance.uid);
        });
      },
    );

    // Cancel event
    async function onClose(e: Recordable) {
      const { closeFunc } = unref(getProps);
      emit('close', e);
      if (closeFunc && isFunction(closeFunc)) {
        const res = await closeFunc();
        openRef.value = !res;
        return;
      }
      openRef.value = false;
    }

    function setDrawerProps(props: Partial<DrawerProps>): void {
      // Keep the last setDrawerProps
      propsRef.value = deepMerge(unref(propsRef) || ({} as any), props);

      if (Reflect.has(props, 'open')) {
        openRef.value = !!props.open;
      }
    }

    function handleOk() {
      emit('ok');
    }

    return {
      getBindValues,
      getFooterHeight,
      getLoading,
      getMergeProps: getMergeProps as any,
      getProps: getProps as any,
      getScrollContentStyle,
      handleOk,
      onClose,
      prefixCls,
      t: $t,
    };
  },
});
</script>
<template>
  <Drawer :root-class-name="prefixCls" @close="onClose" v-bind="getBindValues">
    <template v-if="!$slots.title" #title>
      <DrawerHeader :is-detail="isDetail" :show-detail-back="showDetailBack" :title="getMergeProps.title" @close="onClose">
        <template #titleToolbar>
          <slot name="titleToolbar"></slot>
        </template>
      </DrawerHeader>
    </template>
    <template v-else #title>
      <slot name="title"></slot>
    </template>
    <ScrollContainer :loading-tip="loadingText || t('common.loadingText')" :style="getScrollContentStyle" v-loading="getLoading">
      <slot></slot>
    </ScrollContainer>
    <DrawerFooter v-bind="getProps" :height="getFooterHeight" @close="onClose" @ok="handleOk">
      <template v-for="item in Object.keys($slots)" #[item]="data">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </DrawerFooter>
  </Drawer>
</template>
<style lang="scss">
$drawer-header-height: 60px;
$detail-header-height: 40px;

.jnpf-basic-drawer.ant-drawer {
  .full-drawer {
    .ant-drawer-body {
      & > .scrollbar {
        & > .scrollbar__bar {
          display: none !important;
        }

        & > .scrollbar__wrap > .scrollbar__view {
          height: 100%;
          overflow: hidden;
        }
      }
    }
  }

  .ant-drawer-wrapper-body {
    overflow: hidden;
  }

  .ant-drawer-close {
    &:hover {
      color: var(--error-color);
    }
  }

  .ant-drawer-header {
    box-sizing: border-box;
    flex: unset;
    height: $drawer-header-height;
    overflow: hidden;
    background-color: var(--app-content-background);
    border-bottom: unset;

    .ant-drawer-title,
    .jnpf-basic-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .ant-drawer-body {
    height: calc(100% - $drawer-header-height);
    padding: 0;
    background-color: var(--component-background);

    .scrollbar__wrap {
      margin-bottom: 0 !important;
    }

    > .scrollbar > .scrollbar__bar.is-horizontal {
      display: none;
    }
  }
}

.jnpf-basic-drawer__detail {
  position: absolute;

  .ant-drawer-header {
    box-sizing: border-box;
    width: 100%;
    height: $detail-header-height;
    padding: 0;
    border-top: 1px solid var(--border-color-base);
  }

  .ant-drawer-title {
    height: 100%;
  }

  .ant-drawer-close {
    height: $detail-header-height;
    line-height: $detail-header-height;
  }

  .scrollbar__wrap {
    padding: 0 !important;
  }

  .ant-drawer-body {
    height: calc(100% - $detail-header-height);
  }
}

.dark,
.dark[data-theme='custom'],
.dark[data-theme='default'] {
  .ant-drawer {
    .ant-drawer-header {
      border-bottom: 1px solid var(--border-color-base1);
    }
  }
}
</style>
