import type { AxiosRequestConfig, AxiosResponse } from 'axios';

import type { RequestClient } from '../request-client';

import { isUndefined } from '@vben/utils';

class FileUploader {
  private client: RequestClient;

  constructor(client: RequestClient) {
    this.client = client;
  }

  public async upload(url: string, data: Record<string, any> & { file: Blob | File }, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          !isUndefined(item) && formData.append(`${key}[${index}]`, item);
        });
      } else {
        !isUndefined(value) && formData.append(key, value);
      }
    });

    const finalConfig: AxiosRequestConfig = {
      url,
      data: formData,
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    };

    return this.client.post(finalConfig);
  }
}

export { FileUploader };
