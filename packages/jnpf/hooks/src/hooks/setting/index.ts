import { useAppConfig } from '@vben/hooks';

export interface GlobConfig {
  // 接口地址
  apiURL: string;
  dataReportPre: string;
  dataReportServer: string;
  dataVUrl: string;
  filePreviewServer: string;
  importMeta: ImportMeta;
  // 报表接口地址
  reportApiURL: string;
  uploadURL: string;
  webSocketURL: string;
}

const { apiURL, isDevMode, reportApiURL, webSocketURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

export const useGlobSetting = (): Readonly<GlobConfig> => {
  const prodUrlPrefix = apiURL && /https?:\/\//.test(apiURL) ? apiURL : window.location.origin + apiURL;

  return {
    apiURL,
    // 报表前端路径(旧)
    dataReportPre: isDevMode() ? 'http://localhost:8200' : `${apiURL}/Report`,
    // 数据报表接口(旧)
    dataReportServer: isDevMode() ? 'http://localhost:30007' : `${apiURL}/ReportServer`,
    // 大屏应用前端路径
    dataVUrl: isDevMode() ? 'http://localhost:8100/DataV/' : `${prodUrlPrefix}/DataV/`,
    // 本地文件预览
    filePreviewServer: isDevMode() ? 'http://localhost:30090/FileServer' : `${apiURL}/FileServer`,
    importMeta: import.meta,
    reportApiURL,
    uploadURL: `${apiURL}/api/file/Uploader`,
    webSocketURL,
  };
};
