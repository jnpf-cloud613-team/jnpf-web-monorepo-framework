export default {
  endOfLine: 'auto',
  overrides: [
    {
      files: ['*.json5'],
      options: {
        quoteProps: 'preserve',
        singleQuote: false,
      },
    },
  ],
  // 设置是否将 HTML、Vue、JSX 的标签闭合括号放在同一行
  bracketSameLine: true,
  plugins: ['prettier-plugin-tailwindcss'],
  printWidth: 160,
  proseWrap: 'never',
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
};
