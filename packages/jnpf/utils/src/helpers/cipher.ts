import { decrypt, encrypt } from 'crypto-js/aes';
import Base64 from 'crypto-js/enc-base64';
import Hex from 'crypto-js/enc-hex';
import UTF8, { parse } from 'crypto-js/enc-utf8';
import md5 from 'crypto-js/md5';
import ECB from 'crypto-js/mode-ecb';
import pkcs7 from 'crypto-js/pad-pkcs7';

export interface EncryptionParams {
  iv: string;
  key: string;
  useHex: boolean;
}

const defaultKey = encryptByMd5((import.meta as any).env.VITE_CIPHER_KEY);

export class AesEncryption {
  private iv;
  private key;
  private useHex = true;

  constructor(opt: Partial<EncryptionParams> = {}) {
    const { iv, key = defaultKey, useHex = true } = opt;
    if (key) this.key = parse(key);
    if (iv) this.iv = parse(iv);
    this.useHex = !!useHex;
  }

  decryptByAES(cipherText: string) {
    const realCipherText = this.useHex ? Base64.stringify(Hex.parse(cipherText)) : cipherText;
    return decrypt(realCipherText, this.key as CryptoJS.lib.WordArray, this.getOptions()).toString(UTF8);
  }

  encryptByAES(cipherText: string) {
    const result = encrypt(cipherText, this.key as CryptoJS.lib.WordArray, this.getOptions()).toString();
    return this.useHex ? Hex.stringify(Base64.parse(result)) : result;
  }

  private getOptions() {
    return {
      iv: this.iv,
      mode: ECB,
      padding: pkcs7,
    };
  }
}

export function encryptByBase64(cipherText: string) {
  return UTF8.parse(cipherText).toString(Base64);
}

export function decodeByBase64(cipherText: string) {
  return Base64.parse(cipherText).toString(UTF8);
}

export function encryptByMd5(password: string) {
  return md5(password).toString();
}
