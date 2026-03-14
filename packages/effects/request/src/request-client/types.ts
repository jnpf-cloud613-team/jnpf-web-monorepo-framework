import type { AxiosRequestConfig, AxiosResponse, CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios';

type RequestResponse<T = any> = AxiosResponse<T>;

type RequestContentType =
  | 'application/json;charset=utf-8'
  | 'application/octet-stream;charset=utf-8'
  | 'application/x-www-form-urlencoded;charset=utf-8'
  | 'multipart/form-data;charset=utf-8';

type RequestClientOptions = CreateAxiosDefaults;

type ErrorMessageMode = 'message' | 'none' | undefined;

interface RequestOptions {
  // 接口地址
  apiUrl?: string;
  // 错误信息提示类型
  errorMessageMode?: ErrorMessageMode;
  // 需要对返回数据进行处理
  isTransformResponse?: boolean;
  // 是否返回原生响应头 比如：需要获取响应头时使用该属性
  isReturnNativeResponse?: boolean;
  // post请求的时候添加参数到url
  joinParamsToUrl?: boolean;
  //  是否加入时间戳
  joinTime?: boolean;
  // 是否加密
  useCipher?: boolean;
}

interface CreateAxiosOptions extends AxiosRequestConfig {
  requestOptions?: RequestOptions;
}

interface CreateInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  requestOptions?: RequestOptions;
}

interface RequestInterceptorConfig {
  fulfilled?: (config: CreateInternalAxiosRequestConfig) => CreateInternalAxiosRequestConfig | Promise<CreateInternalAxiosRequestConfig>;
  rejected?: (error: any) => any;
}

interface ResponseInterceptorConfig<T = any> {
  fulfilled?: (response: AxiosResponse<T>) => AxiosResponse | Promise<AxiosResponse>;
  rejected?: (error: any) => any;
}

type MakeErrorMessageFn = (message: string, error: any) => void;

interface HttpResponse<T = any> {
  /**
   * 200 表示成功 其他表示失败
   */
  code: number;
  data: T;
  msg: string;
}

export type {
  CreateAxiosOptions,
  CreateInternalAxiosRequestConfig,
  HttpResponse,
  MakeErrorMessageFn,
  RequestClientOptions,
  RequestContentType,
  RequestInterceptorConfig,
  RequestOptions,
  RequestResponse,
  ResponseInterceptorConfig,
};
