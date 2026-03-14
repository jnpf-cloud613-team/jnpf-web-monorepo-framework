<script lang="ts">
import type { PropType } from 'vue';

import { computed, defineComponent } from 'vue';

import { isString } from '@jnpf/utils';

import { Image } from 'ant-design-vue';

interface ImageProps {
  alt?: string;
  fallback?: string;
  height?: number | string;
  placeholder?: boolean | string;
  preview?:
    | boolean
    | {
        getContainer: (() => HTMLElement) | HTMLElement | string;
        onVisibleChange?: (visible: boolean, prevVisible: boolean) => void;
        visible?: boolean;
      };
  src: string;
  width: number | string;
}

type ImageItem = ImageProps | string;

export default defineComponent({
  components: {
    Image,
    PreviewGroup: Image.PreviewGroup,
  },
  name: 'ImagePreview',
  props: {
    functional: Boolean,
    imageList: {
      default: () => [],
      type: Array as PropType<ImageItem[]>,
    },
  },
  setup(props) {
    const getImageList = computed((): any[] => {
      const { imageList } = props;
      if (!imageList) return [];
      return (imageList as any).map((item) => {
        if (isString(item)) {
          return {
            placeholder: false,
            src: item,
          };
        }
        return item;
      });
    });

    return {
      getImageList,
    };
  },
});
</script>
<template>
  <div class="jnpf-image-preview">
    <PreviewGroup>
      <slot v-if="!imageList || $slots.default"></slot>
      <template v-else>
        <template v-for="item in getImageList" :key="item.src">
          <Image v-bind="item">
            <template v-if="item.placeholder" #placeholder>
              <Image v-bind="item" :preview="false" :src="item.placeholder" />
            </template>
          </Image>
        </template>
      </template>
    </PreviewGroup>
  </div>
</template>
<style lang="scss">
.jnpf-image-preview {
  .ant-image {
    margin-right: 10px;
  }

  .ant-image-preview-operations {
    background-color: rgb(0 0 0 / 40%);
  }
}
</style>
