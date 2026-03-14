<script lang="ts" setup>
import type { Ref } from 'vue';

import { onBeforeUnmount, onDeactivated, ref, unref, watch } from 'vue';

import { onMountedOrActivated } from '@jnpf/hooks';

import { usePreferences } from '@vben/preferences';

import VditorPreview from 'vditor/dist/method.min';

import { getTheme } from './getTheme';

const props = defineProps({
  value: { type: String },
  class: { type: String },
});
const viewerRef = ref<ElRef>(null);
const vditorPreviewRef = ref(null) as Ref<Nullable<VditorPreview>>;
const { isDark } = usePreferences();

function init() {
  const viewerEl = unref(viewerRef) as HTMLElement;
  vditorPreviewRef.value = VditorPreview.preview(viewerEl, props.value, {
    mode: getTheme(isDark.value, 'content'),
    theme: {
      // 设置内容主题
      current: getTheme(isDark.value, 'content'),
    },
    hljs: {
      // 设置代码块主题
      style: getTheme(isDark.value, 'code'),
    },
  });
}
watch(
  () => isDark.value,
  (val) => {
    VditorPreview.setContentTheme(getTheme(val, 'content'));
    VditorPreview.setCodeTheme(getTheme(val, 'code'));
    init();
  },
);

watch(
  () => props.value,
  (v, oldValue) => {
    v !== oldValue && init();
  },
);

function destroy() {
  const vditorInstance = unref(vditorPreviewRef);
  if (!vditorInstance) return;
  try {
    vditorInstance?.destroy?.();
  } catch {}
  vditorPreviewRef.value = null;
}

onMountedOrActivated(init);

onBeforeUnmount(destroy);
onDeactivated(destroy);
</script>

<template>
  <div ref="viewerRef" id="markdownViewer" :class="$props.class"></div>
</template>
