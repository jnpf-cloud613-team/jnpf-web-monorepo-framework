import type { PropType } from 'vue';

export type Theme = 'hc-black' | 'vs' | 'vs-dark';
export type FoldingStrategy = 'auto' | 'indentation';
export type RenderLineHighlight = 'all' | 'gutter' | 'line' | 'none';
export type LineNumbersType = 'interval' | 'off' | 'on' | 'relative' | ((lineNumber: number) => string);
export type WordWrapType = 'bounded' | 'off' | 'on' | 'wordWrapColumn';
export interface Options {
  automaticLayout: boolean; // 自适应布局
  foldingStrategy: FoldingStrategy; // 折叠方式  auto | indentation
  fontSize: number; // 字体大小
  lineNumbers: LineNumbersType; // 显示行号
  minimap: {
    // 关闭小地图
    enabled: boolean;
  };
  overviewRulerBorder: boolean; // 不要滚动条的边框
  readOnly: boolean; // 只读
  renderLineHighlight: RenderLineHighlight; // 行亮
  scrollBeyondLastLine: boolean; // 取消代码后面一大段空白
  selectOnLineNumbers: boolean;
  wordWrap: WordWrapType;
}

export const defaultOptions: Options = {
  automaticLayout: true,
  foldingStrategy: 'indentation',
  fontSize: 14,
  lineNumbers: 'on',
  minimap: {
    enabled: false,
  },
  overviewRulerBorder: false,
  readOnly: false,
  renderLineHighlight: 'all',
  scrollBeyondLastLine: false,
  selectOnLineNumbers: true,
  wordWrap: 'on',
};

export const editorProps = {
  height: {
    default: '100%',
    type: [String, Number] as PropType<number | string>,
  },
  language: {
    default: 'javascript',
    type: String as PropType<string>,
  },
  modelValue: {
    default: null,
    type: String as PropType<string>,
  },
  options: {
    default: () => defaultOptions,
    type: Object as PropType<Options>,
  },
  theme: {
    default: 'vs',
    type: String as PropType<Theme>,
    validator(value: string): boolean {
      return ['hc-black', 'vs', 'vs-dark'].includes(value);
    },
  },
  width: {
    default: '100%',
    type: [String, Number] as PropType<number | string>,
  },
};
