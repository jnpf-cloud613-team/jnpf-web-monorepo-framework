/* eslint-disable regexp/no-super-linear-backtracking */
/*
 * 正则库
 */
const regularList = {
  allDate: {
    // 判断请假时间和小时是否为0.5的倍数
    msg: '时间只能是整数和0.5的倍数',
    rule: /^[1-9]\d*\.5$|0\.5$|\.0$|^[1-9]\d*$/,
  },
  bigInt: {
    // 正整数（不含0）
    msg: '请输入正整数',
    rule: /^[1-9]\d*$/,
  },
  chinese: {
    msg: '请正确输入中文',
    rule: /^[\u4E00-\u9FA5]+$/,
  },
  email: {
    msg: '请输入正确的邮箱地址',
    rule: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9][-a-z0-9]*[a-z0-9].){1,63}[a-z0-9]+$/,
  },
  enCode: {
    // 编码校验
    msg: '只能输入英文、数字和小数点且小数点不能放在首尾',
    rule: /^[a-z0-9]((([a-z0-9])*)|(([a-z0-9]+|\.)*[a-z0-9]))$/i,
  },
  field: {
    msg: '只能输入大小写英文字母、数字、下划线组合，且不能数字、下划线开头',
    // 大小写英文字母、数字、下划线组合，且不能数字、下划线开头
    rule: /^[a-z](\w)*$/i,
  },
  fullName: {
    // 名称
    msg: '名称不能含有特殊符号',
    rule: /^([\u4E00-\u9FA5a-z0-9])+$/i,
  },
  idCard: {
    msg: '请输入正确的身份证号码',
    rule: /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|12]\d)|3[01])\d{3}([0-9X])$/i,
  },
  iphone: {
    msg: '请输入正确的手机号',
    rule: /^1[3-9]\d{9}$/,
  },
  number: {
    // 数字编码
    msg: '只能输入数字',
    rule: /^(\d+)$/,
  },
  password: {
    msg: '6-16位字符的密码（数字和字母组成）',
    rule: /^(?!\d+$)(?![a-z]+$)[0-9A-Z]{6,16}$/i,
  },
  plateNumber: {
    msg: '请输入正确的车牌号',
    rule: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z][A-Z][A-Z0-9]{4}[A-Z0-9挂学警港澳]$/,
  },
  userAccount: {
    // 岗位编码
    msg: '只能输入数字英文',
    rule: /^[A-Z0-9]+$/i,
  },
  domain: {
    msg: '请输入正确的域名地址',
    rule: /^(http|https):\/\/[\w-]+(\.[\w-]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?/i,
  },
};
/*
 * 内置规则
 * @param {String} type - {pattern}中预定义正则名称 or 自定义正则
 * @param {String} msg - 正则校验不通过提示
 * 用法
 * 1、{ validator: this.formValidate('fullName', '用户名由字母、数字、下划线以及短横线组成。'), trigger: 'blur' }
 * 2、{ validator: this.formValidate('/^([w-]+|[u4e00-u9fa5]+)$/', '用户名由字母、数字、下划线以及短横线组成。'), trigger: 'blur' }
 */

const formValidate = (type: string, msg: string = '') => {
  return (_rule, value) => {
    const reg = regularList[type] && regularList[type].rule ? regularList[type].rule : type;
    msg = msg || (regularList[type] && regularList[type].msg ? regularList[type].msg : '');
    if (!value) return Promise.resolve();
    return reg.test(value) ? Promise.resolve() : Promise.reject(msg);
  };
};

export { formValidate };
