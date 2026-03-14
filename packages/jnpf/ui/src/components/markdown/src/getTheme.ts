/**
 * 获取主题类型 是否深色模式 对应的值
 * @param isDark 是否深色模式
 * @param themeMode 主题类型——外观(默认), 内容, 代码块
 */
export const getTheme = (isDark: boolean, themeMode: 'code' | 'content' | 'default' = 'default') => {
  switch (themeMode) {
    case 'code': {
      return isDark ? 'dracula' : 'github';
    }
    case 'content': {
      return isDark ? 'dark' : 'light';
    }
    case 'default': {
      return isDark ? 'dark' : 'classic';
    }
  }
};
