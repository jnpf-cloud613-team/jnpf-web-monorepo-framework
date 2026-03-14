<script lang="ts" setup>
import { BasicTitle } from '@jnpf/ui';
import { propTypes } from '@jnpf/utils';

import { ArrowLeftOutlined } from '@ant-design/icons-vue';

defineOptions({ name: 'BasicDrawerHeader' });
defineProps({
  isDetail: propTypes.bool,
  showDetailBack: propTypes.bool,
  title: propTypes.string,
});
const emit = defineEmits(['close']);
const prefixCls = 'jnpf-basic-drawer-header';

function handleClose() {
  emit('close');
}
</script>
<template>
  <BasicTitle v-if="!isDetail" :class="prefixCls">
    <slot name="title"></slot>
    {{ !$slots.title ? title : '' }}
  </BasicTitle>

  <div v-else :class="[prefixCls, `${prefixCls}--detail`]">
    <span :class="`${prefixCls}__wrap`">
      <span v-if="showDetailBack" @click="handleClose">
        <ArrowLeftOutlined :class="`${prefixCls}__back`" />
      </span>
      <span v-if="title">{{ title }}</span>
    </span>

    <span :class="`${prefixCls}__toolbar`">
      <slot name="titleToolbar"></slot>
    </span>
  </div>
</template>

<style lang="scss">
.jnpf-basic-drawer-header {
  display: flex;
  align-items: center;
  height: 100%;

  &__back {
    padding: 0 12px;
    cursor: pointer;

    &:hover {
      color: var(--primary-color);
    }
  }

  &__wrap {
    flex: 1;
  }

  &__toolbar {
    padding-right: 50px;
  }
}
</style>
