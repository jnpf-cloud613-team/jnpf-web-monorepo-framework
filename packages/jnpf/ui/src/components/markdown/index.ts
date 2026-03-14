import { withInstall } from '@jnpf/utils';

import markdown from './src/Markdown.vue';
import markdownViewer from './src/MarkdownViewer.vue';

export const JnpfMarkdown = withInstall(markdown);
export const JnpfMarkdownViewer = withInstall(markdownViewer);
export * from './src/typing';
