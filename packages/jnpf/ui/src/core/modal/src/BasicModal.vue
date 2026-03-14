<script lang="ts">
import type { ModalMethods, ModalProps } from './typing';

import { computed, defineComponent, getCurrentInstance, nextTick, ref, toRef, unref, watch, watchEffect } from 'vue';

import { isFunction, merge } from '@jnpf/utils';

import { useNamespace } from '@vben-core/composables';

import { omit } from 'lodash-es';

import Modal from './components/Modal';
import ModalClose from './components/ModalClose.vue';
import ModalFooter from './components/ModalFooter.vue';
import ModalHeader from './components/ModalHeader.vue';
import ModalWrapper from './components/ModalWrapper.vue';
import { useFullScreen } from './hooks/useModalFullScreen';
import { basicProps } from './props';

export default defineComponent({
  components: { Modal, ModalClose, ModalFooter, ModalHeader, ModalWrapper },
  emits: ['openChange', 'heightChange', 'cancel', 'ok', 'register', 'update:open'],
  inheritAttrs: false,
  name: 'BasicModal',
  props: basicProps,
  setup(props, { attrs, emit, slots }) {
    const openRef = ref(false);
    const propsRef = ref<null | Partial<ModalProps>>(null);
    const modalWrapperRef = ref<any>(null);
    const { b } = useNamespace('basic-modal');
    const prefixCls = b();

    // modal   Bottom and top height
    const extHeightRef = ref(0);
    const modalMethods: ModalMethods = {
      emitOpen: undefined,
      redoModalHeight: () => {
        nextTick(() => {
          if (unref(modalWrapperRef)) {
            (unref(modalWrapperRef) as any).setModalHeight();
          }
        });
      },
      setModalProps,
    };

    const instance = getCurrentInstance();
    if (instance) {
      emit('register', modalMethods, instance.uid);
    }

    // Custom title component: get title
    const getMergeProps = computed((): Recordable => {
      return {
        ...props,
        ...(unref(propsRef) as any),
      };
    });
    // 是否未设置标题
    const isNoTitle = computed(() => {
      // 标题为空并且不含有标题插槽
      return !unref(getMergeProps).title && !slots.title;
    });

    const { fullScreenRef, getWrapClassName, handleFullScreen } = useFullScreen({
      extHeightRef,
      modalWrapperRef,
      wrapClassName: toRef(getMergeProps.value, 'wrapClassName'),
    });

    // modal component does not need title and origin buttons
    const getProps = computed((): Recordable => {
      const opt = {
        ...unref(getMergeProps),
        cancelButtonProps: undefined,
        okButtonProps: undefined,
        open: unref(openRef),
        title: undefined,
      };
      return {
        ...opt,
        wrapClassName: unref(getWrapClassName),
      };
    });

    const getBindValue = computed((): Recordable => {
      const attr: any = {
        ...attrs,
        ...unref(getMergeProps),
        open: unref(openRef),
      };
      attr.wrapClassName = `${attr?.wrapClassName || ''} ${unref(getWrapClassName)} ${prefixCls}`;

      if (unref(fullScreenRef)) {
        return omit(attr, ['height', 'title']);
      }
      return omit(attr, 'title');
    });

    const getFooterBindValue = computed((): Recordable => {
      return omit(unref(getBindValue), ['class']);
    });

    const getWrapperHeight = computed(() => {
      if (unref(fullScreenRef)) return undefined;
      return unref(getProps).height;
    });

    watchEffect(() => {
      openRef.value = !!props.open;
      fullScreenRef.value = !!props.defaultFullscreen;
    });

    watch(
      () => unref(openRef),
      (v) => {
        emit('openChange', v);
        emit('update:open', v);
        instance && modalMethods.emitOpen?.(v, instance.uid);
        nextTick(() => {
          if (props.scrollTop && v && unref(modalWrapperRef)) {
            (unref(modalWrapperRef) as any).scrollTop();
          }
        });
      },
      {
        immediate: false,
      },
    );

    // 取消事件
    async function handleCancel(e: Event) {
      e?.stopPropagation();
      // 过滤自定义关闭按钮的空白区域
      if ((e.target as HTMLElement)?.classList?.contains(`${prefixCls}-close--custom`)) return;
      if (props.closeFunc && isFunction(props.closeFunc)) {
        const isClose: boolean = await props.closeFunc();
        openRef.value = !isClose;
        return;
      }

      openRef.value = false;
      emit('cancel', e);
    }

    /**
     * @description: 设置modal参数
     */
    function setModalProps(props: Partial<ModalProps>): void {
      // Keep the last setModalProps
      propsRef.value = merge(props, unref(propsRef) || ({} as any));
      if (Reflect.has(props, 'open')) {
        openRef.value = !!props.open;
      }
      if (Reflect.has(props, 'defaultFullscreen')) {
        fullScreenRef.value = !!props.defaultFullscreen;
      }
    }

    function handleOk(e: Event) {
      emit('ok', e);
    }

    function handleHeightChange(height: string) {
      emit('heightChange', height);
    }

    function handleExtHeight(height: number) {
      extHeightRef.value = height;
    }

    function handleTitleDbClick(e) {
      if (!props.canFullscreen) return;
      e.stopPropagation();
      handleFullScreen(e);
    }

    return {
      fullScreenRef,
      getBindValue,
      getFooterBindValue,
      getMergeProps,
      getProps,
      getWrapperHeight,
      handleCancel,
      handleExtHeight,
      handleFullScreen,
      handleHeightChange,
      handleOk,
      handleTitleDbClick,
      isNoTitle,
      modalWrapperRef,
      omit,
      openRef,
    };
  },
});
</script>
<template>
  <Modal v-bind="getBindValue" @cancel="handleCancel">
    <template v-if="!$slots.closeIcon" #closeIcon>
      <ModalClose :can-fullscreen="getProps.canFullscreen" :full-screen="fullScreenRef" @cancel="handleCancel" @fullscreen="handleFullScreen" />
    </template>

    <template v-if="!isNoTitle" #title>
      <ModalHeader :help-message="getProps.helpMessage" :title="getMergeProps.title" @dblclick="handleTitleDbClick" />
    </template>

    <template v-if="!$slots.footer" #footer>
      <ModalFooter v-bind="getFooterBindValue" @cancel="handleCancel" @ok="handleOk">
        <template v-for="item in Object.keys($slots)" #[item]="data">
          <slot :name="item" v-bind="data || {}"></slot>
        </template>
      </ModalFooter>
    </template>

    <ModalWrapper
      ref="modalWrapperRef"
      :footer-offset="wrapperFooterOffset"
      :full-screen="fullScreenRef"
      :height="getWrapperHeight"
      :loading="getProps.loading"
      :loading-tip="getProps.loadingTip"
      :min-height="getProps.minHeight"
      :modal-footer-height="footer !== undefined && !footer ? 0 : undefined"
      :open="openRef"
      :use-wrapper="getProps.useWrapper"
      v-bind="omit(getProps.wrapperProps, 'open', 'height', 'modalFooterHeight')"
      @ext-height="handleExtHeight"
      @height-change="handleHeightChange">
      <slot></slot>
    </ModalWrapper>

    <template v-for="item in Object.keys(omit($slots, 'default'))" #[item]="data">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </Modal>
</template>
