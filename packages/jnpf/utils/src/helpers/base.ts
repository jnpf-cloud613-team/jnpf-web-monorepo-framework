import { isObject } from '@vben/utils';

import { cloneDeep, isEqual, mergeWith, unionWith } from 'lodash-es';

import { isArray } from './is';

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = '';
  for (const key in obj) {
    parameters += `${key}=${encodeURIComponent(obj[key])}&`;
  }
  parameters = parameters.replace(/&$/, '');
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters;
}

/**
 递归合并两个对象。
 Recursively merge two objects.
 @param target 目标对象，合并后结果存放于此。The target object to merge into.
 @param source 要合并的源对象。The source object to merge from.
 @returns 合并后的对象。The merged object.
 */
export function deepMerge<T extends null | object | undefined, U extends null | object | undefined>(target: T, source: U): T & U {
  return mergeWith(cloneDeep(target), source, (objValue, srcValue) => {
    if (isObject(objValue) && isObject(srcValue)) {
      return mergeWith(cloneDeep(objValue), srcValue, (prevValue, nextValue) => {
        // 如果是数组，合并数组(去重)
        return isArray(prevValue) ? unionWith(prevValue, nextValue, isEqual) : undefined;
      });
    }
  });
}

export function checkFileType(file: File, accepts: string[]) {
  const newTypes = accepts.join('|');
  // const reg = /\.(jpg|jpeg|png|gif|txt|doc|docx|xls|xlsx|xml)$/i;
  const reg = new RegExp(`${String.raw`\.(` + newTypes})$`, 'i');

  return reg.test(file.name);
}

export function isImgTypeByName(name: string) {
  return /\.(?:jpg|jpeg|png|gif|webp)$/i.test(name);
}

export function checkImgType(file: File) {
  return isImgTypeByName(file.name);
}

export function getBase64WithFile(file: File) {
  return new Promise<{
    file: File;
    result: string;
  }>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', () => resolve({ file, result: reader.result as string }));
    // eslint-disable-next-line unicorn/prefer-add-event-listener
    reader.onerror = (error) => reject(error);
  });
}
