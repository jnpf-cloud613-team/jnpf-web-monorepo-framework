<script lang="ts">
import { computed, defineComponent } from 'vue';

import { $t } from '@vben/locales';

import { useNamespace } from '@vben-core/composables';

import { CloseOutlined, FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons-vue';
import { Tooltip } from 'ant-design-vue';

export default defineComponent({
  components: { CloseOutlined, FullscreenExitOutlined, FullscreenOutlined, Tooltip },
  emits: ['cancel', 'fullscreen'],
  name: 'ModalClose',
  props: {
    canFullscreen: { default: true, type: Boolean },
    fullScreen: { type: Boolean },
  },
  setup(props, { emit }) {
    const { b } = useNamespace('basic-modal-close');
    const prefixCls = b();

    const getClass = computed(() => {
      return [
        prefixCls,
        `${prefixCls}--custom`,
        {
          [`${prefixCls}--can-full`]: props.canFullscreen,
        },
      ];
    });

    function handleCancel(e: Event) {
      emit('cancel', e);
    }

    function handleFullScreen(e: Event) {
      e?.stopPropagation();
      e?.preventDefault();
      emit('fullscreen');
    }

    return {
      getClass,
      handleCancel,
      handleFullScreen,
      prefixCls,
      t: $t,
    };
  },
});
</script>
<template>
  <div :class="getClass">
    <template v-if="canFullscreen">
      <Tooltip v-if="fullScreen" :title="t('component.modal.restore')" placement="bottom">
        <FullscreenExitOutlined role="full" @click="handleFullScreen" />
      </Tooltip>
      <Tooltip v-else :title="t('component.modal.maximize')" placement="bottom">
        <FullscreenOutlined role="close" @click="handleFullScreen" />
      </Tooltip>
    </template>
    <Tooltip :title="t('component.modal.close')" placement="bottom">
      <CloseOutlined @click="handleCancel" />
    </Tooltip>
  </div>
</template>
<style lang="scss">
.jnpf-basic-modal-close {
  display: flex;
  align-items: center;
  height: 100%;

  > span {
    margin-left: 48px;
    font-size: 16px;
  }

  &--can-full {
    > span {
      margin-left: 12px;
    }
  }

  &:not(&--can-full) {
    > span:nth-child(1) {
      &:hover {
        font-weight: 700;
      }
    }
  }

  & span:nth-child(1) {
    display: inline-block;
    padding: 10px;

    &:hover {
      color: var(--primary-color);
    }
  }

  & span:last-child {
    &:hover {
      color: var(--error-color);
    }
  }
}
</style>
