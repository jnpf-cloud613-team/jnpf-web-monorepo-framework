<script lang="ts">
import type { PropType } from 'vue';

import { defineComponent, ref, watch, watchEffect } from 'vue';

import Color from '../lib/color';
import { useOptions } from '../useOptions';

export default defineComponent({
  name: 'PreDefine',
  props: {
    color: {
      required: true,
      type: Object as PropType<Color>,
    },
    colors: {
      required: true,
      type: Array,
    },
  },
  setup(props) {
    const currentColor: any = useOptions()?.currentColor;

    // data
    const rgbaColors = ref(parseColors(props.colors, props.color));

    // watch
    watch(
      () => currentColor.value,
      (val) => {
        const color = new Color();
        color.fromString(val);

        rgbaColors.value.forEach((item) => {
          item.selected = color.compare(item);
        });
      },
    );
    watchEffect(() => {
      rgbaColors.value = parseColors(props.colors, props.color);
    });

    // methods
    function handleSelect(index) {
      props.color.fromString(props.colors[index]);
    }
    function parseColors(colors, color) {
      return colors.map((value) => {
        const c = new Color();
        c.enableAlpha = true;
        c.format = 'rgba';
        c.fromString(value);
        c.selected = c.value === color.value;
        return c;
      });
    }

    return {
      handleSelect,
      rgbaColors,
    };
  },
});
</script>

<template>
  <div class="ant-color-predefine">
    <div class="ant-color-predefine__colors">
      <div
        v-for="(item, index) in rgbaColors"
        :key="rgbaColors[index]"
        :class="{ selected: item.selected, 'is-alpha': item._alpha < 100 }"
        class="ant-color-predefine__color-selector"
        @click="handleSelect(index)">
        <div :style="{ backgroundColor: item.value }"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ant-color-predefine {
  display: flex;
  width: 280px;
  margin-top: 8px;
  font-size: 12px;

  .ant-color-predefine__colors {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
  }

  .ant-color-predefine__color-selector {
    width: 20px;
    height: 20px;
    margin: 0 0 8px 8px;
    cursor: pointer;
    border-radius: 4px;

    &:nth-child(10n + 1) {
      margin-left: 0;
    }

    > div {
      display: flex;
      height: 100%;
      border-radius: 3px;
    }

    &.selected {
      box-shadow: 0 0 3px 2px #40a9ff;
    }
  }
}
</style>
