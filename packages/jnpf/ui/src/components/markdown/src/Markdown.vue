<script lang="ts">
import type { Ref } from 'vue';

import { computed, defineComponent, nextTick, onBeforeUnmount, onDeactivated, ref, unref, watch } from 'vue';

import { onMountedOrActivated } from '@jnpf/hooks';
import { useModalContext } from '@jnpf/ui/modal';

import { usePreferences } from '@vben/preferences';

import Vditor from 'vditor';

import { getTheme } from './getTheme';

import 'vditor/dist/index.css';

type Lang = 'en_US' | 'ja_JP' | 'ko_KR' | 'zh_CN' | 'zh_TW' | undefined;

const toolbar = [
  'emoji',
  'headings',
  'bold',
  'italic',
  'strike',
  'line',
  'link',
  'quote',
  '|',
  'list',
  'ordered-list',
  'check',
  '|',
  'outdent',
  'indent',
  'code',
  'inline-code',
  'insert-after',
  'insert-before',
  '|',
  'undo',
  'redo',
  '|',
  'table',
  'edit-mode',
  'both',
  'preview',
  'fullscreen',
  'outline',
  'code-theme',
  'content-theme',
  'br',
];

export default defineComponent({
  emits: ['change', 'get', 'update:value'],
  inheritAttrs: false,
  props: {
    height: { type: Number, default: 360 },
    value: { type: String, default: '' },
    placeholder: { type: String, default: '请输入' },
  },
  setup(props, { attrs, emit }) {
    const wrapRef = ref<ElRef>(null);
    const vditorRef = ref(null) as Ref<Nullable<Vditor>>;
    const initedRef = ref(false);

    const { isDark, locale } = usePreferences();

    const modalFn = useModalContext();

    const valueRef = ref(props.value || '');

    watch(
      [() => isDark.value, () => initedRef.value],
      ([val, inited]) => {
        if (!inited) {
          return;
        }
        instance.getVditor()?.setTheme(getTheme(val) as any, getTheme(val, 'content'), getTheme(val, 'code'));
      },
      {
        immediate: true,
        flush: 'post',
      },
    );

    watch(
      () => props.value,
      (v) => {
        if (v !== valueRef.value) {
          instance.getVditor()?.setValue(v);
        }
        valueRef.value = v;
      },
    );

    const getCurrentLang = computed((): Lang => {
      let lang: Lang;
      switch (unref(locale)) {
        case 'en-US': {
          lang = 'en_US';
          break;
        }
        case 'zh-TW': {
          lang = 'zh_TW';
          break;
        }
        default: {
          lang = 'zh_CN';
        }
      }
      return lang;
    });
    function init() {
      const wrapEl = unref(wrapRef) as HTMLElement;
      if (!wrapEl) return;
      const bindValue = { ...attrs, ...props };
      const insEditor = new Vditor(wrapEl, {
        // 设置外观主题
        theme: getTheme(isDark.value) as any,
        lang: unref(getCurrentLang),
        mode: 'sv',
        toolbar,
        fullscreen: {
          index: 8800,
        },
        preview: {
          theme: {
            // 设置内容主题
            current: getTheme(isDark.value, 'content'),
          },
          hljs: {
            // 设置代码块主题
            style: getTheme(isDark.value, 'code'),
          },
          actions: [],
        },
        input: (v) => {
          valueRef.value = v;
          emit('update:value', v);
          emit('change', v);
        },
        after: () => {
          nextTick(() => {
            modalFn?.redoModalHeight?.();
            insEditor.setValue(valueRef.value);
            vditorRef.value = insEditor;
            initedRef.value = true;
            emit('get', instance);
          });
        },
        blur: () => {
          // unref(vditorRef)?.setValue(props.value);
        },
        ...bindValue,
        cache: {
          enable: false,
        },
      });
    }

    const instance = {
      getVditor: (): Vditor => vditorRef.value!,
    };

    function destroy() {
      const vditorInstance = unref(vditorRef);
      if (!vditorInstance) return;
      try {
        vditorInstance?.destroy?.();
      } catch {}
      vditorRef.value = null;
      initedRef.value = false;
    }

    onMountedOrActivated(init);

    onBeforeUnmount(destroy);
    onDeactivated(destroy);
    return {
      wrapRef,
      ...instance,
    };
  },
});
</script>
<template>
  <div ref="wrapRef"></div>
</template>
