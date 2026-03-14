<script lang="ts">
import type { CSSProperties } from 'vue';

import type { PopupInstance, PopupProps } from './typing';

import { computed, defineComponent, getCurrentInstance, nextTick, ref, unref, watch } from 'vue';

import { useAttrs } from '@jnpf/hooks';
import { ScrollContainer } from '@jnpf/ui';
import { isFunction, isNumber, merge } from '@jnpf/utils';

import { $t } from '@vben/locales';

import { useNamespace } from '@vben-core/composables';

import PopupHeader from './components/PopupHeader.vue';
import { basicProps } from './props';

export default defineComponent({
  components: { PopupHeader, ScrollContainer },
  emits: ['openChange', 'ok', 'close', 'register'],
  inheritAttrs: false,
  props: basicProps,
  setup(props, { emit }) {
    const openRef = ref(false);
    const fullScreenRef = ref(false);
    const attrs: any = useAttrs({ excludeDefaultKeys: false });
    const propsRef = ref<Partial<Nullable<PopupProps>>>(null);

    const { b } = useNamespace('basic-popup');
    const prefixCls = b();

    const popupInstance: PopupInstance = {
      emitOpen: undefined,
      setPopupProps,
    };

    const instance = getCurrentInstance();

    instance && emit('register', popupInstance, instance.uid);

    const getMergeProps = computed((): PopupProps => {
      return merge(unref(propsRef), props) as any;
    });

    const getProps = computed((): PopupProps => {
      const opt = {
        ...unref(attrs),
        ...unref(getMergeProps),
        open: unref(openRef),
      };
      return opt as unknown as PopupProps;
    });

    const getBindValues = computed((): PopupProps => {
      return {
        ...attrs,
        ...unref(getProps),
      };
    });
    const getWrapperClass = computed(() => {
      return [
        prefixCls,
        unref(attrs).class,
        {
          'fullscreen-popup': !!unref(fullScreenRef),
        },
      ];
    });

    const getBodyStyle = computed((): CSSProperties => {
      const { width, zIndex } = unref(getProps);
      return {
        margin: '0 auto',
        width: width ? (isNumber(width) ? `${width}px` : width) : '100%',
        zIndex,
      };
    });
    const getScrollContentStyle = computed((): CSSProperties => {
      return {
        height: `100%`,
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
          if (open) fullScreenRef.value = !!props.defaultFullscreen;
          emit('openChange', open);
          instance && popupInstance.emitOpen?.(open, instance.uid);
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

    function setPopupProps(props: Partial<PopupProps>): void {
      // Keep the last setPopupProps
      propsRef.value = merge(props, unref(propsRef) || ({} as any));
      if (Reflect.has(props, 'open')) {
        openRef.value = !!props.open;
      }
      if (Reflect.has(props, 'defaultFullscreen')) {
        fullScreenRef.value = !!props.defaultFullscreen;
      }
    }

    function handleOk() {
      emit('ok');
    }

    return {
      getBindValues,
      getBodyStyle,
      getLoading,
      getMergeProps: getMergeProps as any,
      getProps: getProps as any,
      getScrollContentStyle,
      getWrapperClass,
      handleOk,
      onClose,
      openRef,
      prefixCls,
      t: $t,
    };
  },
});
</script>
<template>
  <div v-if="openRef" :class="getWrapperClass">
    <PopupHeader v-bind="getProps" @close="onClose" @ok="handleOk">
      <template v-for="item in Object.keys($slots)" #[item]="data">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </PopupHeader>
    <div :class="`${prefixCls}-body`">
      <ScrollContainer :loading-tip="loadingText || t('common.loadingText')" :style="getScrollContentStyle" v-loading="getLoading">
        <div :style="getBodyStyle">
          <slot></slot>
        </div>
      </ScrollContainer>
    </div>
  </div>
</template>
<style lang="scss">
$header-height: 60px;

.jnpf-basic-popup {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 500;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--component-background);

  &.full-popup {
    .jnpf-basic-popup-body {
      & > .scrollbar {
        & > .scrollbar__bar {
          display: none !important;
        }

        & > .scrollbar__wrap {
          & > .scrollbar__view {
            height: 100%;
            padding: 0;
            overflow: hidden;

            & > div {
              height: 100%;
            }
          }
        }
      }
    }
  }

  &.fullscreen-popup {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
  }

  .word-form {
    margin-bottom: 0;
  }

  .jnpf-basic-popup-body {
    flex: 1;
    height: calc(100% - $header-height);
    padding: 0;
    overflow: hidden;
    background-color: var(--component-background);

    & > .scrollbar > .scrollbar__wrap {
      margin-bottom: 0 !important;

      & > .scrollbar__view {
        padding: 10px 0;
      }
    }

    > .scrollbar > .scrollbar__bar.is-horizontal {
      display: none;
    }
  }
}
</style>
