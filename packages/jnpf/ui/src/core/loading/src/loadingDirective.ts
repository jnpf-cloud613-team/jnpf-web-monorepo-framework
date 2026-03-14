import type { App, Directive } from 'vue';

import { createLoading } from './createLoading';

const loadingDirective: Directive = {
  mounted(el, binding) {
    const tip = el.getAttribute('loading-tip');
    const background = el.getAttribute('loading-background');
    const size = el.getAttribute('loading-size');
    const fullscreen = !!binding.modifiers.fullscreen;
    const instance = createLoading(
      {
        absolute: !fullscreen,
        background,
        loading: !!binding.value,
        size: size || 'large',
        tip,
      },
      fullscreen ? document.body : el,
    );
    el.instance = instance;
  },
  unmounted(el) {
    el?.instance?.close();
  },
  updated(el, binding) {
    const instance = el.instance;
    if (!instance) return;
    instance.setTip(el.getAttribute('loading-tip'));
    if (binding.oldValue !== binding.value) {
      instance.setLoading?.(binding.value && !instance.loading);
    }
  },
};

export function setupLoadingDirective(app: App) {
  app.directive('loading', loadingDirective);
}

export default loadingDirective;
