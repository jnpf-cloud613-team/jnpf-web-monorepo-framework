import type { ApplicationConfig, JnpfAdminProAppConfigRaw } from '@vben/types/global';

/**
 * 由 vite-inject-app-config 注入的全局配置
 */
export function useAppConfig(env: Record<string, any>, isProduction: boolean): ApplicationConfig {
  // 生产环境下，直接使用 window._JNPF_ADMIN_PRO_APP_CONF_ 全局变量
  const config = isProduction ? window._JNPF_ADMIN_PRO_APP_CONF_ : (env as JnpfAdminProAppConfigRaw);

  function isDevMode(): boolean {
    return env.DEV;
  }
  function isProdMode(): boolean {
    return env.PROD;
  }

  const { VITE_GLOB_API_URL, VITE_GLOB_REPORT_API_URL, VITE_GLOB_WEBSOCKET_URL } = config;

  return {
    apiURL: VITE_GLOB_API_URL,
    reportApiURL: VITE_GLOB_REPORT_API_URL,
    webSocketURL: VITE_GLOB_WEBSOCKET_URL,
    isDevMode,
    isProdMode,
  };
}
