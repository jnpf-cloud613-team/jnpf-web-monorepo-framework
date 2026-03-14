<script lang="ts" setup>
import { computed, useSlots } from 'vue';

import BasicTitle from './BasicTitle.vue';

const props = defineProps({
  bordered: {
    default: true,
    type: Boolean,
  },
  content: {
    default: '',
    type: String,
  },
  contentPosition: {
    default: 'left',
    type: String as PropType<'center' | 'left' | 'right'>,
  },
  helpMessage: {
    default: '',
    type: [String, Array] as PropType<string | string[]>,
  },
});
const slots = useSlots();
const getClass = computed(() => ['jnpf-basic-caption', { [`jnpf-basic-caption-border`]: props.bordered }]);
const getContentPosition = computed(() => {
  if (props.contentPosition === 'left') return 'flex-start';
  if (props.contentPosition === 'right') return 'flex-end';
  return props.contentPosition;
});
</script>
<template>
  <div :class="getClass">
    <div :style="{ 'justify-content': getContentPosition }" class="jnpf-basic-caption-content">
      <slot v-if="slots.content" name="content"></slot>
      <BasicTitle v-if="!slots.content && content" :help-message="helpMessage">
        {{ content }}
      </BasicTitle>
    </div>
    <div v-if="slots.action" class="jnpf-basic-caption__action">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.jnpf-basic-caption {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 50px;
  padding-top: 10px;
  padding-bottom: 10px;
  word-break: break-all;

  &-border {
    border-bottom: 1px solid var(--border-color-base);
  }

  &-content {
    display: flex;
    flex: 1;
  }

  &__action {
    flex-shrink: 0;
    margin-left: 8px;
  }
}
</style>
