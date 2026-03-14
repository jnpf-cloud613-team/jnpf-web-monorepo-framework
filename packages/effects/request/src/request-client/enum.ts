// 请求结果
export enum ResultEnum {
  FORBIDDEN = 403,
  SUCCESS = 200,
  TOKEN_ERROR = 602,
  TOKEN_LOGGED = 601,
  TOKEN_TIMEOUT = 600,
}

// 请求方法
export enum RequestEnum {
  DELETE = 'DELETE',
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
}

// contentType
export enum ContentTypeEnum {
  // form-data  upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // json
  JSON = 'application/json;charset=UTF-8',
  // octet-stream
  OCTET_STREAM = 'application/octet-stream;charset=utf-8',
}
