<script lang="ts">
import type { Editor, RawEditorSettings } from 'tinymce';

import { computed, defineComponent, nextTick, onBeforeUnmount, onDeactivated, ref, unref, watch } from 'vue';

import { onMountedOrActivated } from '@jnpf/hooks';
import { buildShortUUID, isNumber } from '@jnpf/utils';

import { usePreferences } from '@vben/preferences';

import { useDebounceFn } from '@vueuse/core';
import tinymce from 'tinymce/tinymce';

import { bindHandlers } from './helper';
import ImgUpload from './ImgUpload.vue';
import { plugins, toolbar } from './tinymce';

import 'tinymce/themes/silver';
import 'tinymce/icons/default/icons';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/code';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/hr';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/noneditable';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/print';
import 'tinymce/plugins/save';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/spellchecker';
import 'tinymce/plugins/tabfocus';
import 'tinymce/plugins/table';
import 'tinymce/plugins/template';
import 'tinymce/plugins/textpattern';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/image';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/imagetools';
import 'tinymce/plugins/help';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/importcss';
import 'tinymce/plugins/toc';
import 'tinymce/plugins/emoticons';

const tinymceProps = {
  height: {
    default: 400,
    required: false,
    type: [Number, String] as PropType<number | string>,
  },
  options: {
    default: () => ({}),
    type: Object as PropType<Partial<RawEditorSettings>>,
  },
  placeholder: {
    default: '请输入',
    type: String,
  },
  plugins: {
    default: plugins,
    type: [String, Array] as PropType<string | string[]>,
  },
  showImageUpload: {
    default: true,
    type: Boolean,
  },
  toolbar: {
    default: toolbar,
    type: [String, Array] as PropType<string | string[]>,
  },
  value: {
    type: String,
  },
  width: {
    default: 'auto',
    required: false,
    type: [Number, String] as PropType<number | string>,
  },
  disabled: {
    default: false,
    type: Boolean,
  },
};

export default defineComponent({
  components: { ImgUpload },
  emits: ['change', 'update:value', 'inited', 'initError'],
  inheritAttrs: false,
  name: 'JnpfEditor',
  props: tinymceProps,
  setup(props, { attrs, emit }) {
    const editorRef = ref<Nullable<Editor>>(null);
    const fullscreen = ref(false);
    const tinymceId = ref<string>(buildShortUUID('tiny-vue'));
    const elRef = ref<Nullable<HTMLElement>>(null);

    const prefixCls = 'jnpf-tinymce-container';

    const { isDark, locale } = usePreferences();

    const debounceUpdateEditor = useDebounceFn(updateEditor, 300);

    const tinymceContent = computed(() => props.value);

    const containerWidth = computed(() => {
      const width = props.width;
      if (isNumber(width)) {
        return `${width}px`;
      }
      return width;
    });

    const skinName = computed(() => {
      return isDark.value ? 'oxide-dark' : 'oxide';
    });

    const langName = computed(() => {
      const lang = locale.value;
      return ['en_US', 'zh_CN'].includes(lang) ? lang : 'zh_CN';
    });

    const initOptions = computed((): RawEditorSettings => {
      const { height, options, placeholder, plugins, toolbar } = props;
      const publicPath = import.meta.env.VITE_BASE || '/';
      return {
        auto_focus: undefined,
        branding: false,
        content_css: `${publicPath}resource/tinymce/skins/ui/${skinName.value}/content.min.css`,
        default_link_target: '_blank',
        height,
        language: langName.value,
        language_url: `${publicPath}resource/tinymce/langs/${langName.value}.js`,
        link_title: false,
        menubar: 'file edit insert view format table',
        object_resizing: true,
        paste_data_images: true, // 允许粘贴图像
        plugins,
        selector: `#${unref(tinymceId)}`,
        skin: skinName.value,
        skin_url: `${publicPath}resource/tinymce/skins/ui/${skinName.value}`,
        toolbar,
        ...options,
        deprecation_warnings: false,
        placeholder,
        setup: (editor: Editor) => {
          editorRef.value = editor;
          editor.on('init', (e) => initSetup(e));
        },
      };
    });

    const disabled = computed(() => {
      const { options } = props;
      const getDisabled = (options && Reflect.get(options, 'readonly')) || props.disabled;
      const editor = unref(editorRef);
      if (editor) {
        editor.setMode(getDisabled ? 'readonly' : 'design');
      }
      return !!getDisabled || false;
    });

    watch(
      () => props.disabled,
      () => {
        const editor = unref(editorRef);
        if (!editor) {
          return;
        }
        editor.setMode(props.disabled ? 'readonly' : 'design');
      },
    );
    watch(
      () => editorRef.value,
      () => {
        const editor = unref(editorRef);
        if (!editor) {
          return;
        }
        editor.setMode(props.disabled ? 'readonly' : 'design');
      },
    );
    watch(
      () => isDark.value,
      () => {
        updateEditor();
      },
    );
    watch(
      () => props.placeholder,
      () => {
        debounceUpdateEditor();
      },
    );

    onMountedOrActivated(() => {
      if (!initOptions.value.inline) {
        tinymceId.value = buildShortUUID('tiny-vue');
      }
      nextTick(() => {
        setTimeout(() => {
          initEditor();
        }, 30);
      });
    });

    onBeforeUnmount(() => {
      destroy();
    });

    onDeactivated(() => {
      destroy();
    });

    function destroy() {
      if (tinymce !== null) {
        tinymce?.remove?.(unref(initOptions).selector!);
      }
    }

    function initEditor() {
      const el = unref(elRef);
      if (el) {
        el.style.visibility = '';
      }
      tinymce
        .init(unref(initOptions))
        .then((editor) => {
          emit('inited', editor);
        })
        .catch((error) => {
          emit('initError', error);
        });
    }

    function initSetup(e) {
      const editor = unref(editorRef);
      if (!editor) {
        return;
      }
      const value = props.value || '';

      editor.setContent(value);
      bindModelHandlers(editor);
      bindHandlers(e, attrs, unref(editorRef));
    }

    function setValue(editor: Recordable, val: string, prevVal?: string) {
      if (editor && typeof val === 'string' && val !== prevVal && val !== editor.getContent({ format: attrs.outputFormat })) {
        editor.setContent(val);
      }
    }

    function bindModelHandlers(editor: any) {
      const modelEvents = attrs.modelEvents ? attrs.modelEvents : null;
      const normalizedEvents = Array.isArray(modelEvents) ? modelEvents.join(' ') : modelEvents;

      watch(
        () => unref(props.value),
        (val: string | undefined, prevVal: string | undefined) => {
          setValue(editor, val || '', prevVal);
        },
        { immediate: true },
      );

      editor.on(normalizedEvents || 'change keyup undo redo', () => {
        const content = editor.getContent({ format: attrs.outputFormat });
        emit('update:value', content);
        emit('change', content);
      });

      editor.on('FullscreenStateChanged', (e) => {
        fullscreen.value = e.state;
      });
    }

    function handleInsertImg(url: string) {
      const editor = unref(editorRef);
      if (!editor || !url) {
        return;
      }
      editor.execCommand('mceInsertContent', false, `<img src="${url}"/>`);
      const content = editor?.getContent() ?? '';
      setValue(editor, content);
    }

    function handleImageUploading(name: string) {
      const editor = unref(editorRef);
      if (!editor) {
        return;
      }
      editor.execCommand('mceInsertContent', false, getUploadingImgName(name));
      const content = editor?.getContent() ?? '';
      setValue(editor, content);
    }

    function handleDone(name: string, url: string) {
      const editor = unref(editorRef);
      if (!editor) {
        return;
      }
      const content = editor?.getContent() ?? '';
      const val = content?.replace(getUploadingImgName(name), `<img src="${url}"/>`) ?? '';
      setValue(editor, val);
    }

    function getUploadingImgName(name: string) {
      return `[uploading:${name}]`;
    }
    function updateEditor() {
      destroy();
      initEditor();
    }

    return {
      containerWidth,
      disabled,
      editorRef,
      elRef,
      fullscreen,
      handleDone,
      handleImageUploading,
      handleInsertImg,
      initOptions,
      prefixCls,
      tinymceContent,
      tinymceId,
    };
  },
});
</script>

<template>
  <div :class="prefixCls" :style="{ width: containerWidth }">
    <ImgUpload
      v-if="showImageUpload"
      v-show="editorRef"
      :disabled="disabled"
      :fullscreen="fullscreen"
      @done="handleDone"
      @insert="handleInsertImg"
      @uploading="handleImageUploading" />
    <textarea v-if="!initOptions.inline" :id="tinymceId" ref="elRef" :style="{ visibility: 'hidden' }"></textarea>
    <slot v-else></slot>
  </div>
</template>

<style lang="scss">
.jnpf-tinymce-container {
  position: relative;
  line-height: normal;

  textarea {
    z-index: -1;
    visibility: hidden;
  }
}

.tox.tox-tinymce-aux {
  z-index: 30000 !important;
}
</style>
