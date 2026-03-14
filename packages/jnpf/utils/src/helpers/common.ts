export function toDecimal(num: number = 0) {
  const sign = num == (num = Math.abs(num));
  num = Math.floor(num * 100 + 0.50000000001);
  const cents = num % 100;
  let value: string = Math.floor(num / 100).toString();
  const centsStr: string = cents < 10 ? `0${cents}` : cents.toString();
  for (let i = 0; i < Math.floor((value.length - (1 + i)) / 3); i++)
    value = `${value.slice(0, Math.max(0, value.length - (4 * i + 3)))}${value.slice(Math.max(0, value.length - (4 * i + 3)))}`;
  return `${(sign ? '' : '-') + value}.${centsStr}`;
}
export function toFileSize(size) {
  if (size == null || size == '') return '';
  if (size < 1024) return `${toDecimal(size)} 字节`;
  else if (size >= 1024 && size < 1048576) return `${toDecimal(size / 1024)} KB`;
  else if (size >= 1048576 && size < 1073741824) return `${toDecimal(size / 1024 / 1024)} MB`;
  else if (size >= 1073741824) return `${toDecimal(size / 1024 / 1024 / 1024)} GB`;
}
/**
 * 金额转中文
 * 思路：
 *                              个
 *      十     百      千       万
 *      十万   百万    千万     亿
 *      十亿   百亿    千亿
 *
 *                              1
 *      2      3       4        5
 *      6      7       8        9
 *      10
 *
 * 计算步骤
 * 1. 获取当前数值大小
 * 2. 排除个位后 数值按个，十，百，千有规律的重复 所以计算其和4的余数 pos % 4
 * 3. pos = 0 ~ 3 没有最大单位
 *    pos = 4 ~ 7 最大单位是万
 *    pos = 8 ~ 11 最大单位是亿
 * pos / 4 的整数就是最大单位
 *
 */
export function getAmountChinese(val) {
  if (!val && val !== 0) return '';
  if (val == 0) return '零元整';
  const regExp = /[a-z]/i;
  if (regExp.test(val)) return '数字较大溢出';
  let amount = +val;
  if (Number.isNaN(amount)) return '';
  if (amount < 0) amount = Number(amount.toString().split('-')[1]);
  const NUMBER = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const N_UNIT1 = ['', '拾', '佰', '仟'];
  const N_UNIT2 = ['', '万', '亿', '兆'];
  const D_UNIT = ['角', '分', '厘', '毫'];
  const [integer, decimal] = amount.toString().split('.');
  if (integer && (integer.length > 15 || integer.includes('e'))) return '数字较大溢出';
  let res = '';
  // 整数部分
  if (integer) {
    let zeroCount = 0;
    for (let i = 0, len = integer.length; i < len; i++) {
      const num = integer.charAt(i);
      const pos = len - i - 1; // 排除个位后 所处的索引位置
      const q = pos / 4;
      const m = pos % 4;
      if (num === '0') {
        zeroCount++;
      } else {
        if (zeroCount > 0 && m !== 3) res += NUMBER[0];
        zeroCount = 0;
        res += (NUMBER[Number.parseInt(num)] as any) + N_UNIT1[m];
      }
      if (m == 0 && zeroCount < 4) res += N_UNIT2[Math.floor(q)];
    }
  }
  if (Number(integer) != 0) res += '元';
  // 小数部分
  if (Number.parseInt(decimal as string)) {
    for (let i = 0; i < 4; i++) {
      const num = (decimal as string).charAt(i);
      if (Number.parseInt(num)) res += NUMBER[num] + D_UNIT[i];
    }
  } else {
    res += '整';
  }
  if (val < 0) res = `负数${res}`;
  return res;
}
// 转千位分隔
export function thousandsFormat(num) {
  if (num === 0) return '0';
  if (!num) return '';
  const numArr = num.toString().split('.');
  numArr[0] = numArr[0].replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',');
  return numArr.join('.');
}
export function getTimeUnit(key) {
  if (key == 1) return 'year';
  if (key == 2) return 'month';
  if (key == 3) return 'day';
  if (key == 4) return 'hour';
  if (key == 5) return 'minute';
  if (key == 6) return 'second';
  return 'day';
}
export function getDateFormat(format) {
  if (!format) return 'YYYY-MM-DD HH:mm:ss';
  const formatObj = {
    yyyy: 'YYYY',
    YYYY: 'YYYY',
    'yyyy-MM': 'YYYY-MM',
    'YYYY-MM': 'YYYY-MM',
    'yyyy-MM-dd': 'YYYY-MM-DD',
    'YYYY-MM-DD': 'YYYY-MM-DD',
    'yyyy-MM-dd HH:mm': 'YYYY-MM-DD HH:mm',
    'YYYY-MM-DD HH:mm': 'YYYY-MM-DD HH:mm',
    'yyyy-MM-dd HH:mm:ss': 'YYYY-MM-DD HH:mm:ss',
    'YYYY-MM-DD HH:mm:ss': 'YYYY-MM-DD HH:mm:ss',
  };
  return formatObj[format] || 'YYYY-MM-DD HH:mm:ss';
}
export function getDateTimeUnit(format) {
  if (format == 'YYYY' || format == 'yyyy') return 'year';
  if (format == 'YYYY-MM' || format == 'yyyy-MM') return 'month';
  if (format == 'YYYY-MM-DD' || format == 'yyyy-MM-dd') return 'day';
  if (format == 'YYYY-MM-DD HH:mm' || format == 'yyyy-MM-dd HH:mm') return 'minute';
  if (format == 'YYYY-MM-DD HH:mm:ss' || format == 'yyyy-MM-dd HH:mm:ss') return 'second';
  return 'day';
}
export function toDateText(dateTimeStamp) {
  if (!dateTimeStamp) return '';
  let result = '';
  const minute = 1000 * 60; // 把分，时，天，周，半个月，一个月用毫秒表示
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  // let halfAMonth = day * 15;
  const month = day * 30;
  const now = Date.now(); // 获取当前时间毫秒
  const diffValue = now - dateTimeStamp; // 时间差
  if (diffValue < 0) return '刚刚';
  const minC = diffValue / minute; // 计算时间差的分，时，天，周，月
  const hourC = diffValue / hour;
  const dayC = diffValue / day;
  const weekC = diffValue / week;
  const monthC = diffValue / month;
  if (monthC >= 1 && monthC <= 3) {
    result = ` ${Number.parseInt(monthC.toString())}月前`;
  } else if (weekC >= 1 && weekC <= 3) {
    result = ` ${Number.parseInt(weekC.toString())}周前`;
  } else if (dayC >= 1 && dayC <= 6) {
    result = ` ${Number.parseInt(dayC.toString())}天前`;
  } else if (hourC >= 1 && hourC <= 23) {
    result = ` ${Number.parseInt(hourC.toString())}小时前`;
  } else if (minC >= 1 && minC <= 59) {
    result = ` ${Number.parseInt(minC.toString())}分钟前`;
  } else if (diffValue >= 0 && diffValue <= minute) {
    result = '刚刚';
  } else {
    const datetime = new Date();
    datetime.setTime(dateTimeStamp);
    const nYear = datetime.getFullYear();
    const nMonth = datetime.getMonth() + 1 < 10 ? `0${datetime.getMonth() + 1}` : datetime.getMonth() + 1;
    const nDate = datetime.getDate() < 10 ? `0${datetime.getDate()}` : datetime.getDate();
    // const nHour = datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime.getHours();
    // const nMinute = datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes();
    // const nSecond = datetime.getSeconds() < 10 ? '0' + datetime.getSeconds() : datetime.getSeconds();
    result = `${nYear}-${nMonth}-${nDate}`;
  }
  return result;
}
export function toDateValue(dateTimeStamp) {
  if (!dateTimeStamp) return '';
  let result = '';
  const datetime = new Date();
  const nowYear = datetime.getFullYear();
  datetime.setTime(dateTimeStamp);
  const nYear = datetime.getFullYear();
  const nMonth = datetime.getMonth() + 1 < 10 ? `0${datetime.getMonth() + 1}` : datetime.getMonth() + 1;
  const nDate = datetime.getDate() < 10 ? `0${datetime.getDate()}` : datetime.getDate();
  const nHour = datetime.getHours() < 10 ? `0${datetime.getHours()}` : datetime.getHours();
  const nMinute = datetime.getMinutes() < 10 ? `0${datetime.getMinutes()}` : datetime.getMinutes();
  result = nYear == nowYear ? `${nMonth}-${nDate} ${nHour}:${nMinute}` : `${nYear}-${nMonth}-${nDate} ${nHour}:${nMinute}`;
  return result;
}
// 数据类型转换
export function getDataTypeText(val) {
  let text = val;
  switch (val) {
    case 'bigint': {
      text = '长整型';
      break;
    }
    case 'datetime': {
      text = '日期时间';
      break;
    }
    case 'decimal': {
      text = '浮点';
      break;
    }
    case 'int': {
      text = '整型';
      break;
    }
    case 'text': {
      text = '文本';
      break;
    }
    case 'varchar': {
      text = '字符串';
      break;
    }
    default: {
      text = val;
      break;
    }
  }
  return text;
}
export function getScriptFunc(str) {
  let func = null;
  try {
    func = eval(str);
    if (Object.prototype.toString.call(func) !== '[object Function]') return false;
    return func;
  } catch {
    return false;
  }
}
