<!-- eslint-disable new-cap -->
<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { usePreferences } from '@vben/preferences';

import * as monaco from 'monaco-editor';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

import { defaultOptions, editorProps } from './monacoEditorType';

export default defineComponent({
  emits: ['update:modelValue', 'change', 'editorMounted'],
  name: 'MonacoEditor',
  props: editorProps,
  setup(props, { emit, expose }) {
    const { isDark } = usePreferences();
    // eslint-disable-next-line no-restricted-globals
    self.MonacoEnvironment = {
      getWorker(_: string, label: string) {
        if (label === 'json') {
          return new jsonWorker();
        }
        if (['css', 'less', 'scss'].includes(label)) {
          return new cssWorker();
        }
        if (['handlebars', 'html', 'razor'].includes(label)) {
          return new htmlWorker();
        }
        if (['javascript', 'typescript'].includes(label)) {
          return new tsWorker();
        }
        return new EditorWorker();
      },
    };
    let editor: monaco.editor.IStandaloneCodeEditor;
    const codeEditBox = ref();

    const init = () => {
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false,
      });
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        allowNonTsExtensions: true,
        target: monaco.languages.typescript.ScriptTarget.ES2020,
      });

      editor = monaco.editor.create(codeEditBox.value, {
        language: props.language,
        theme: isDark.value ? 'vs-dark' : 'vs',
        value: props.modelValue,
        ...defaultOptions,
        ...props.options,
      });

      // 监听值的变化
      editor.onDidChangeModelContent(() => {
        const value = editor.getValue(); // 给父组件实时返回最新文本
        emit('update:modelValue', value);
        emit('change', value);
      });

      emit('editorMounted', editor);
    };
    watch(
      () => props.modelValue,
      (newValue) => {
        if (editor) {
          const value = editor.getValue();
          if (newValue !== value) {
            editor.setValue(newValue);
          }
        }
      },
    );

    watch(
      () => props.options,
      (newValue) => {
        editor.updateOptions({ ...defaultOptions, ...newValue });
      },
      { deep: true },
    );

    watch(
      () => props.language,
      (newValue) => {
        monaco.editor.setModelLanguage(editor.getModel()!, newValue);
      },
    );
    watch(
      () => isDark.value,
      async () => {
        monaco.editor.setTheme(isDark.value ? 'vs-dark' : 'vs');
      },
      { immediate: true },
    );

    function insert(text = '') {
      const position = editor.getPosition();
      editor.executeEdits('', [
        {
          range: {
            endColumn: position?.column as number,
            endLineNumber: position?.lineNumber as number,
            startColumn: position?.column as number,
            startLineNumber: position?.lineNumber as number,
          },
          text,
        },
      ]);
    }
    expose({ insert });

    onBeforeUnmount(() => {
      editor.dispose();
    });

    onMounted(() => {
      init();
    });

    return { codeEditBox };
  },
});
</script>

<template>
  <div ref="codeEditBox" class="codeEditBox"></div>
</template>

<style lang="scss" scoped>
.codeEditBox {
  width: v-bind(width);
  height: v-bind(height);
}
</style>
