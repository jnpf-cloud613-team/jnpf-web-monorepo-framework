<script lang="ts" setup>
import { computed, unref } from 'vue';

import { useAttrs } from '@jnpf/hooks';

import { DownOutlined } from '@ant-design/icons-vue';

defineOptions({ name: 'BasicArrow' });

const props = defineProps({
  /**
   * Arrow down by default
   */
  down: { type: Boolean },
  /**
   * Arrow expand state
   */
  expand: { type: Boolean },
  /**
   * Cancel padding/margin for inline
   */
  inset: { type: Boolean },
  /**
   * Arrow up by default
   */
  up: { type: Boolean },
});
const attrs: any = useAttrs({ excludeDefaultKeys: false });

// get component class
const getClass = computed(() => {
  const { down, expand, inset, up } = props;
  return [
    'jnpf-basic-arrow',
    {
      [`jnpf-basic-arrow--active`]: expand,
      down,
      inset,
      up,
    },
  ];
});
const getStyle = computed(() => unref(attrs)?.iconStyle || {});
</script>
<template>
  <span :class="getClass">
    <DownOutlined :style="getStyle" />
  </span>
</template>
<style lang="scss" scoped>
.jnpf-basic-arrow {
  display: inline-block;
  cursor: pointer;
  transform: rotate(0deg);
  transform-origin: center center;
  transition: all 0.3s ease 0.1s;

  &.jnpf-basic-arrow--active {
    transform: rotate(0deg);

    &.up {
      transform: rotate(0deg);
    }

    &.down {
      transform: rotate(-180deg);
    }
  }

  &.inset {
    line-height: 0px;
  }

  &.up {
    transform: rotate(-180deg);
  }

  &.down {
    transform: rotate(0deg);
  }
}
</style>
