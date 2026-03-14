<script lang="ts" setup>
import { Maximize, Minimize } from '@vben-core/icons';

import { useFullscreen } from '@vueuse/core';

import { VbenIconButton } from '../button';

defineOptions({ name: 'FullScreen' });

const { isFullscreen, toggle } = useFullscreen();

// 重新检查全屏状态
isFullscreen.value = !!(
  document.fullscreenElement ||
  // @ts-ignore
  document.webkitFullscreenElement ||
  // @ts-ignore
  document.mozFullScreenElement ||
  // @ts-ignore
  document.msFullscreenElement
);
</script>
<template>
  <VbenIconButton @click="toggle" class="global-header-icon !mr-0 w-auto rounded-md px-[10px]">
    <Minimize v-if="isFullscreen" class="text-foreground size-[18px]" />
    <Maximize v-else class="text-foreground size-[18px]" />
  </VbenIconButton>
</template>
