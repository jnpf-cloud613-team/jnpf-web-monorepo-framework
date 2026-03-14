<script lang="ts" setup>
import { computed, unref } from 'vue';

import { useAttrs } from '@jnpf/hooks';

import { Slider } from 'ant-design-vue';

defineOptions({ inheritAttrs: false, name: 'JnpfSlider' });

const attrs: any = useAttrs({ excludeDefaultKeys: false });

const getBindValue: any = computed(() => ({ ...unref(attrs) }));
const getStyle = computed(() => (Reflect.has(unref(attrs), 'style') ? unref(attrs).style : {}));
</script>

<template>
  <div :style="getStyle" class="jnpf-slider px-[5px]">
    <Slider v-bind="getBindValue">
      <template v-for="item in Object.keys($slots)" #[item]="data">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </Slider>
  </div>
</template>
