import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosResponseHeaders } from 'axios';

import type { CreateAxiosOptions, RequestOptions } from './types';

import { bindMethods, cloneDeep, isString, merge } from '@vben/utils';

import axios from 'axios';
import JSONBigInt from 'json-bigint';
import qs from 'qs';

import { ContentTypeEnum, RequestEnum } from './enum';
import { joinTimestamp, setObjToUrlParams } from './helper';
import { FileDownloader } from './modules/downloader';
import { InterceptorManager } from './modules/interceptor';
import { FileUploader } from './modules/uploader';

class RequestClient {
  public addRequestInterceptor: InterceptorManager['addRequestInterceptor'];

  public addResponseInterceptor: InterceptorManager['addResponseInterceptor'];
  public download: FileDownloader['download'];

  // 是否正在刷新token
  public isRefreshing = false;
  // 刷新token队列
  public refreshTokenQueue: ((token: string) => void)[] = [];
  public upload: FileUploader['upload'];
  private readonly instance: AxiosInstance;
  private readonly options: CreateAxiosOptions;

  /**
   * 构造函数，用于创建Axios实例
   * @param options - Axios请求配置，可选
   */
  constructor(options: Partial<CreateAxiosOptions> = {}) {
    // 合并默认配置和传入的配置
    const defaultConfig: CreateAxiosOptions = {
      headers: { 'Content-Type': ContentTypeEnum.JSON },
      // 配置项，下面的选项都可以在独立的接口请求中覆盖
      requestOptions: {
        // 接口地址
        apiUrl: '',
        // 消息提示类型
        errorMessageMode: 'message',
        // 是否返回原生响应头 比如：需要获取响应头时使用该属性
        isReturnNativeResponse: false,
        // 需要对返回数据进行处理
        isTransformResponse: true,
        // post请求的时候添加参数到url
        joinParamsToUrl: false,
        //  是否加入时间戳
        joinTime: true,
        // 是否加密
        useCipher: false,
      },
      // 默认超时时间
      timeout: 1_000_000,
      transformResponse: (data: any, header: AxiosResponseHeaders) => {
        // storeAsString指示将BigInt存储为字符串，设为false则会存储为内置的BigInt类型
        return header.getContentType()?.toString().includes('application/json')
          ? cloneDeep(JSONBigInt({ storeAsString: true, strict: true }).parse(data))
          : data;
      },
    };
    const { ...axiosConfig } = options;
    const requestConfig = merge(axiosConfig, defaultConfig);
    this.options = requestConfig;
    this.instance = axios.create(requestConfig);

    bindMethods(this);

    // 实例化拦截器管理器
    const interceptorManager = new InterceptorManager(this.instance);
    this.addRequestInterceptor = interceptorManager.addRequestInterceptor.bind(interceptorManager);
    this.addResponseInterceptor = interceptorManager.addResponseInterceptor.bind(interceptorManager);

    // 实例化文件上传器
    const fileUploader = new FileUploader(this);
    this.upload = fileUploader.upload.bind(fileUploader);
    // 实例化文件下载器
    const fileDownloader = new FileDownloader(this);
    this.download = fileDownloader.download.bind(fileDownloader);
  }
  // 请求之前处理config
  beforeRequestHook(config: CreateAxiosOptions, options: RequestOptions) {
    const { apiUrl, joinParamsToUrl, joinTime = true } = options;

    if (apiUrl && isString(apiUrl) && !/https?:\/\//.test(config.url || '')) {
      config.url = `${apiUrl}${config.url}`;
    }
    const params = config.params || config.data || {};
    const data = config.data || false;
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (isString(params)) {
        // 兼容restful风格
        config.url = `${config.url + params}${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      } else {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      }
    } else {
      if (isString(params)) {
        // 兼容restful风格
        config.url = config.url + params;
        config.params = undefined;
      } else {
        if (Reflect.has(config, 'data') && config.data && (Object.keys(config.data).length > 0 || config.data instanceof FormData)) {
          config.data = data;
          config.params = undefined;
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params;
          config.params = undefined;
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(config.url as string, Object.assign({}, config.params, config.data));
        }
      }
    }
    return config;
  }

  /**
   * DELETE请求方法
   */
  public delete<T = any>(config?: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' }, options);
  }

  /**
   * GET请求方法
   */
  public get<T = any>(config?: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' }, options);
  }

  /**
   * POST请求方法
   */
  public post<T = any>(config?: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' }, options);
  }

  /**
   * PUT请求方法
   */
  public put<T = any>(config?: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT' }, options);
  }

  /**
   * 通用的请求方法
   */
  public async request<T>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    try {
      let conf: CreateAxiosOptions = cloneDeep(config);
      const { requestOptions } = this.options;
      const opt: RequestOptions = Object.assign({}, requestOptions, options);
      conf.requestOptions = opt;
      this.beforeRequestHook(conf, opt);
      conf = this.supportFormData(conf);
      const response: AxiosResponse<T> = await this.instance({
        ...conf,
      });
      return response as T;
    } catch (error: any) {
      throw error.response ? error.response.data : error;
    }
  }
  // 支持 form-data
  supportFormData(config: AxiosRequestConfig) {
    const headers = config.headers;
    const contentType = headers?.['Content-Type'] || headers?.['content-type'];

    if (contentType !== ContentTypeEnum.FORM_URLENCODED || !Reflect.has(config, 'data') || config.method?.toUpperCase() === RequestEnum.GET) {
      return config;
    }

    return {
      ...config,
      data: qs.stringify(config.data, { arrayFormat: 'brackets' }),
    };
  }
}

export { RequestClient };
