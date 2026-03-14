import type { TargetContext } from '@vben/types/global';

import { useAppConfig } from '@vben/hooks';

import { openWindow, urlToBase64 } from '..';
import { dataURLtoBlob } from './base64Conver';

const { apiURL, reportApiURL } = useAppConfig((import.meta as any).env, (import.meta as any).env.PROD);

/**
 * Download online pictures
 * @param url
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadByOnlineUrl(url: string, filename: string, mime?: string, bom?: BlobPart) {
  urlToBase64(url).then((base64) => {
    downloadByBase64(base64, filename, mime, bom);
  });
}

/**
 * Download pictures based on base64
 * @param buf
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadByBase64(buf: string, filename: string, mime?: string, bom?: BlobPart) {
  const base64Buf = dataURLtoBlob(buf);
  downloadByData(base64Buf, filename, mime, bom);
}

/**
 * Download according to the background interface file stream
 * @param {*} data
 * @param {*} filename
 * @param {*} mime
 * @param {*} bom
 */
export function downloadByData(data: BlobPart, filename: string, mime?: string, bom?: BlobPart) {
  const blobData = bom === undefined ? [data] : [bom, data];
  const blob = new Blob(blobData, { type: mime || 'application/octet-stream' });

  const blobURL = window.URL.createObjectURL(blob);
  const tempLink = document.createElement('a');
  tempLink.style.display = 'none';
  tempLink.href = blobURL;
  tempLink.setAttribute('download', filename);
  if (tempLink.download === undefined) {
    tempLink.setAttribute('target', '_blank');
  }
  document.body.append(tempLink);
  tempLink.click();
  tempLink.remove();
  window.URL.revokeObjectURL(blobURL);
}

/**
 * Download file according to file address
 * @param {*} sUrl
 */
export function downloadByUrl({ fileName, target = '_blank', url }: { fileName?: string; target?: TargetContext; url: string }): boolean {
  if (!url) return false;

  const isChrome = window.navigator.userAgent.toLowerCase().includes('chrome');
  const isSafari = window.navigator.userAgent.toLowerCase().includes('safari');
  const isFirefox = window.navigator.userAgent.toLowerCase().includes('firefox');

  if (!/https?:\/\//.test(url) && !url.includes('data:image/png;base64')) url = apiURL + url;
  if (fileName && !url.includes('data:image/png;base64') && !url.includes('&name=') && !url.includes('?name=')) {
    url = url + (url.includes('?') ? `&name=${encodeURIComponent(fileName)}` : `?name=${encodeURIComponent(fileName)}`);
  }
  if (/iP/.test(window.navigator.userAgent)) {
    console.error('Your browser does not support download!');
    return false;
  }
  if (isChrome || isSafari || isFirefox) {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || '';
    if (document.createEvent) {
      const e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      link.dispatchEvent(e);
      return true;
    }
  }
  if (!url.includes('?')) {
    url += '?download';
  }
  openWindow(url, { target });
  return true;
}

export function downloadByUrlReport({ fileName, target = '_blank', url }: { fileName?: string; target?: TargetContext; url: string }): boolean {
  if (!url) return false;
  const isChrome = window.navigator.userAgent.toLowerCase().includes('chrome');
  const isSafari = window.navigator.userAgent.toLowerCase().includes('safari');
  const isFirefox = window.navigator.userAgent.toLowerCase().includes('firefox');

  if (!/https?:\/\//.test(url) && !url.includes('data:image/png;base64')) url = reportApiURL + url;
  if (fileName && !url.includes('data:image/png;base64') && !url.includes('&name=') && !url.includes('?name=')) {
    url = url + (url.includes('?') ? `&name=${encodeURIComponent(fileName)}` : `?name=${encodeURIComponent(fileName)}`);
  }
  if (/iP/.test(window.navigator.userAgent)) {
    console.error('Your browser does not support download!');
    return false;
  }
  if (isChrome || isSafari || isFirefox) {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || '';
    if (document.createEvent) {
      const e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      link.dispatchEvent(e);
      return true;
    }
  }
  if (!url.includes('?')) {
    url += '?download';
  }
  openWindow(url, { target });
  return true;
}
