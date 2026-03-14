<script lang="ts">
import type { PropType } from 'vue';

import type Color from '../lib/color';
import type { Nullable } from '../type/types';

import { computed, defineComponent, getCurrentInstance, onMounted, ref, watch } from 'vue';

import draggable from '../lib/draggable';

export default defineComponent({
  name: 'HueSlider',
  props: {
    color: {
      required: true,
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
    const thumb = ref<Nullable<HTMLElement>>(null);
    const bar = ref<Nullable<HTMLElement>>(null);

    // data
    const thumbLeft = ref(0);
    const thumbTop = ref(0);

    // computed
    const hueValue = computed(() => props.color.get('hue'));

    // watch
    watch(
      () => hueValue.value,
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
      let hue;

      if (props.vertical) {
        let top = event.clientY - rect.top;

        top = Math.min(top, rect.height - (thumb.value as HTMLElement).offsetHeight / 2);
        top = Math.max((thumb.value as HTMLElement).offsetHeight / 2, top);
        hue = Math.round(((top - (thumb.value as HTMLElement).offsetHeight / 2) / (rect.height - (thumb.value as HTMLElement).offsetHeight)) * 360);
      } else {
        let left = event.clientX - rect.left;
        left = Math.min(left, rect.width - (thumb.value as HTMLElement).offsetWidth / 2);
        left = Math.max((thumb.value as HTMLElement).offsetWidth / 2, left);

        hue = Math.round(((left - (thumb.value as HTMLElement).offsetWidth / 2) / (rect.width - (thumb.value as HTMLElement).offsetWidth)) * 360);
      }
      props.color.set('hue', hue);
    }
    function getThumbLeft(): number {
      const ele = instance?.vnode.el as HTMLElement;

      if (props.vertical) return 0;
      const hue = props.color.get('hue');

      if (!ele) return 0;
      return Math.round((hue * (ele.offsetWidth - (thumb.value as HTMLElement).offsetWidth / 2)) / 360);
    }
    function getThumbTop(): number {
      const ele = instance?.vnode.el as HTMLElement;
      if (!props.vertical) return 0;
      const hue = props.color.get('hue');

      if (!ele) return 0;
      return Math.round((hue * (ele.offsetHeight - (thumb.value as HTMLElement).offsetHeight / 2)) / 360);
    }
    function update() {
      thumbLeft.value = getThumbLeft();
      thumbTop.value = getThumbTop();
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
      bar,
      handleClick,
      hueValue,
      thumb,
      thumbLeft,
      thumbTop,
      update,
    };
  },
});
</script>

<template>
  <div :class="{ 'is-vertical': vertical }" class="ant-color-hue-slider">
    <div ref="bar" class="ant-color-hue-slider__bar" @click="handleClick"></div>
    <div ref="thumb" :style="{ left: `${thumbLeft}px`, top: `${thumbTop}px` }" class="ant-color-hue-slider__thumb"></div>
  </div>
</template>

<style lang="scss" scoped>
.ant-color-hue-slider {
  position: relative;
  box-sizing: border-box;
  width: 280px;
  height: 12px;
  background-color: red;
  //float: right;
  &.is-vertical {
    width: 12px;
    height: 180px;
    padding: 2px 0;

    .ant-color-hue-slider__bar {
      background: linear-gradient(to bottom, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
    }

    .ant-color-hue-slider__thumb {
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
    }
  }

  .ant-color-hue-slider__bar {
    position: relative;
    height: 100%;
    background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
  }

  .ant-color-hue-slider__thumb {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    box-sizing: border-box;
    width: 4px;
    height: 100%;
    cursor: pointer;
    background-color: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 1px;
    box-shadow: 0 0 2px #0009;
  }
}
</style>
