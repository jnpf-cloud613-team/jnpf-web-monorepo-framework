<script lang="ts" setup>
defineOptions({ inheritAttrs: false, name: 'JnpfIframe' });
defineProps({
  borderColor: { default: '#E2E0E0', type: String },
  borderType: { default: 'solid', type: String },
  borderWidth: { default: 1, type: Number },
  height: { default: 300, type: Number },
  href: { default: '', type: String },
});
</script>
<template>
  <div class="jnpf-iframe">
    <iframe
      :src="href"
      :style="{
        '--height': `${height || 300}px`,
        '--border-type': borderType,
        '--border-color': borderColor,
        '--border-width': `${borderWidth}px`,
      }"
      class="iframe"
      frameborder="0"
      scrolling="yes"></iframe>
  </div>
</template>
<style lang="scss" scoped>
.jnpf-iframe {
  .iframe {
    width: 100%;
    height: var(--height);
    border: var(--border-width) var(--border-type) var(--border-color);
  }
}
</style>
