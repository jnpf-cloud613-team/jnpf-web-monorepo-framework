<script lang="ts">
import type { PropType } from 'vue';

import type Color from '../lib/color';
import type { Nullable } from '../type/types';

import { defineComponent, getCurrentInstance, onMounted, ref, shallowRef, watch } from 'vue';

import draggable from '../lib/draggable';

export default defineComponent({
  name: 'AlphaSlider',
  props: {
    color: {
      type: Object as PropType<Color>,
    },
    vertical: {
      default: false,
      type: Boolean,
    },
  },
  setup(props) {
    const instance = getCurrentInstance();

    // ref
    const bar = shallowRef<Nullable<HTMLElement>>(null);
    const thumb = shallowRef<Nullable<HTMLElement>>(null);

    // data
    const thumbLeft = ref<number>(0);
    const thumbTop = ref<number>(0);
    const background = ref<string>('');

    // watch
    watch(
      () => props.color?.get('alpha'),
      () => {
        update();
      },
    );
    watch(
      () => props.color?.value,
      () => {
        update();
      },
    );

    // methods
    function handleClick(event: Event) {
      const target = event.target;

      if (target !== thumb.value) {
        handleDrag(event);
      }
    }
    function handleDrag(event) {
      const ele = instance?.vnode.el as HTMLElement;
      const rect = ele.getBoundingClientRect();

      if (props.vertical) {
        let top = event.clientY - rect.top;
        top = Math.max((thumb.value as HTMLElement).offsetHeight / 2, top);
        top = Math.min(top, rect.height - (thumb.value as HTMLElement).offsetHeight / 2);

        props.color?.set(
          'alpha',
          Math.round(((top - (thumb.value as HTMLElement).offsetHeight / 2) / (rect.height - (thumb.value as HTMLElement).offsetHeight)) * 100),
        );
      } else {
        let left = event.clientX - rect.left;
        left = Math.max((thumb.value as HTMLElement).offsetWidth / 2, left);
        left = Math.min(left, rect.width - (thumb.value as HTMLElement).offsetWidth / 2);

        props.color?.set(
          'alpha',
          Math.round(((left - (thumb.value as HTMLElement).offsetWidth / 2) / (rect.width - (thumb.value as HTMLElement).offsetWidth)) * 100),
        );
      }
    }
    function update() {
      thumbLeft.value = getThumbLeft();
      thumbTop.value = getThumbTop();
      background.value = getBackground();
    }
    function getThumbLeft(): number {
      if (props.vertical) return 0;
      const ele = instance?.vnode.el;
      const alpha = props.color?.get('alpha');

      if (!ele) return 0;
      return Math.round((alpha * (ele.offsetWidth - (thumb.value as HTMLElement).offsetWidth / 2)) / 100);
    }
    function getThumbTop(): number {
      const ele = instance?.vnode.el;
      if (!props.vertical) return 0;
      const alpha = props.color?.get('alpha');

      if (!ele) return 0;
      return Math.round((alpha * (ele.offsetHeight - (thumb.value as HTMLElement).offsetHeight / 2)) / 100);
    }
    function getBackground() {
      if (props.color && props.color.value) {
        const { b, g, r } = props.color.toRgb();
        return `linear-gradient(to right, rgba(${r}, ${g}, ${b}, 0) 0%, rgba(${r}, ${g}, ${b}, 1) 100%)`;
      }
      return '';
    }

    onMounted(() => {
      const dragConfig = {
        drag: (event) => {
          handleDrag(event);
        },
        end: (event) => {
          handleDrag(event);
        },
      };

      draggable(bar.value as HTMLElement, dragConfig);
      draggable(thumb.value as HTMLElement, dragConfig);
      update();
    });
    return {
      background,
      bar,
      handleClick,
      thumb,
      thumbLeft,
      thumbTop,
      update,
    };
  },
});
</script>

<template>
  <div :class="{ 'is-vertical': vertical }" class="ant-color-alpha-slider">
    <div ref="bar" :style="{ background }" class="ant-color-alpha-slider__bar" @click="handleClick"></div>
    <div ref="thumb" :style="{ left: `${thumbLeft}px`, top: `${thumbTop}px` }" class="ant-color-alpha__thumb"></div>
  </div>
</template>
<style lang="scss" scoped>
.ant-color-alpha-slider {
  position: relative;
  box-sizing: border-box;
  width: 280px;
  height: 12px;
  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==');

  .ant-color-alpha-slider__bar {
    position: relative;
    height: 100%;
    background: linear-gradient(to right, rgb(255 255 255 / 0%) 0%, rgb(255 255 255 / 100%) 100%);
  }

  .ant-color-alpha__thumb {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    box-sizing: border-box;
    width: 4px;
    height: 100%;
    cursor: pointer;
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 1px;
    box-shadow: 0 0 2px rgb(0 0 0 / 60%);
  }

  &.is-vertical {
    width: 20px;
    height: 180px;

    .ant-color-alpha-slider__bar {
      background: linear-gradient(to bottom, rgb(255 255 255 / 0%) 0%, rgb(255 255 255 / 100%) 100%);
    }

    .ant-color-alpha__thumb {
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
    }
  }
}
</style>
