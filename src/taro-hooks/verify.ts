interface IVerReg {
  reg: RegExp
  regText: string
}
export type TypeRegCode = 'nickname' | 'account' | 'password' | 'qq' | 'mobile' |
  'integer' | 'float' | 'payPwd' | 'bankCard' | 'url' |
  'email' | 'notEmpty' | 'remark' | 'ip' | 'idcard';
export const regs: { [key in TypeRegCode]: IVerReg } = {
  // 昵称 汉字、数字、字母、'_'组成
  nickname: {
    reg: /^[\u4e00-\u9fa5_a-zA-Z0-9]*$/,
    regText: `汉字、数字、字母、'_' 组成`,
  },
  // 用户名 数字、字母、'_'组成
  account: {
    reg: /^[a-zA-Z0-9][a-zA-Z0-9_]{5,11}$/,
    regText: `5 到 11 位的数字、字母、'_' 组成，且不能是 '_' 开头`,
  },
  // 用户名 数字、字母、'_'组成
  idcard: {
    reg: /^(\d{18,18}|\d{15,15}|\d{17,17}X)$/,
    regText: `有效身份证号`,
  },
  // 密码 6-20个数字、字母、符号两种及以上的组成
  password: {
    reg: /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/,
    regText: `6-20个数字、字母、符号两种及以上的组成`,
  },
  // QQ号码
  qq: {
    reg: /^[1-9]\d{4,10}$/,
    regText: `QQ 号码`,
  },
  // 手机号码
  mobile: {
    reg: /^\d{11}$/,
    regText: `有效手机号码`,
  },
  // 整数
  integer: {
    reg: /^-?\d+$/,
    regText: `整数`,
  },
  // 浮点数
  float: {
    reg: /^(-?(0|[1-9][0-9]*))(\.\d+)?$/,
    regText: `数字`,
  },
  // 支付密码
  payPwd: {
    reg: /^\d{4}$/,
    regText: '四位数字组成',
  },
  bankCard: {
    reg: /^\d{14,20}$/,
    regText: '有效银行卡号',
  },
  // 域名，不包含协议的
  url: {
    reg: /^(https?:\/\/)?([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9]+(:\d+)?(\/[\.a-zA-Z0-9_-]+)*(\?.*)?$/,
    regText: '域名',
  },
  // 邮箱
  email: {
    reg: /^[a-zA-Z0-9](\w|\-|\.)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
    regText: '邮箱地址',
  },
  // 自由，非空字符串
  notEmpty: {
    reg: /./,
    regText: '非空字符',
  },
  remark: {
    reg: /[\s.]*/,
    regText: '',
  },
  ip: {
    reg: /^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
    regText: 'IP',
  },
};

const VER_KEYS = Object.keys(regs);

export type TypeVerifyStatus = '' | 'error' | 'validating' | 'success';
export type TypeVerifySection = 'close' | 'open';
export interface IVerifyProps {
  /**
   * 校验组件的值
   * @type {string}
   * @memberof IVerifyProps
   */
  value: string
  /**
   * 校验类型
   * @type {TypeRegCode}
   * @memberof IVerifyProps
   */
  verCode?: TypeRegCode
  /**
   * 别名，可以用于提示时增强用户感知
   * @type {string}
   * @memberof IVerifyProps
   */
  alias?: string
  /**
   * 是否必填，默认 true 为必填
   * @type {boolean}
   * @memberof IVerifyProps
   */
  required?: boolean
  /**
   * 双字节字符验证，值为 true 时，一个中文占两个字符
   * @type {boolean}
   * @memberof IVerifyProps
   */
  doubleByte?: boolean
  /**
   * 字符串长度限制，[6, 12] 表示最少 6 个字符，最多 12 个字符
   * @type {number[]}
   * @memberof IVerifyProps
   */
  length?: number[]
  /**
   * 数值型值限制范围，[10, 99] 表示数值要在 10 - 99 之间
   * @type {number[]}
   * @memberof IVerifyProps
   */
  range?: number[]
  /**
   * 浮点型小数长度
   * @type {number}
   * @memberof IVerifyProps
   */
  floatLength?: number
  /**
   * 数值型的开闭区间，配合 range 字段用于限制范围
   * @type {TypeVerifySection}
   * @memberof IVerifyProps
   */
  rangeSection?: TypeVerifySection
  /**
   * 正则表达式，一般不用自己穿，传了 VerCode 之后，由上方定义的 regs 中提取
   * @type {RegExp}
   * @memberof IVerifyProps
   */
  reg?: RegExp
  /**
   * 正则表达式的中文解释，一般是和 reg 属性匹配的
   * @type {string}
   * @memberof IVerifyProps
   */
  regText?: string
  /**
   * 输入的校验状态
   * @type {TypeVerifyStatus}
   * @memberof IVerifyProps
   */
  status?: TypeVerifyStatus
  /**
   * 输入的校验提示
   * @type {string}
   * @memberof IVerifyProps
   */
  tips?: string
  /**
   * 不开启校验，默认 false
   * @type {boolean}
   * @memberof IVerifyProps
   */
  disVerify?: boolean
  /**
   * 其余参数不予限制
   * @type {any}
   * @memberof IVerifyProps
   */
  [key: string]: any
}
export interface IVerifyDefault {
  /**
   * 值
   * @type {string}
   * @memberof IVerifyDefault
   */
  value: string
  /**
   * 是否必填
   * @type {boolean}
   * @memberof IVerifyDefault
   */
  required: boolean
  /**
   * 状态
   * @type {TypeVerifyStatus}
   * @memberof IVerifyDefault
   */
  status: TypeVerifyStatus
  /**
   * 提示内容
   * @type {string}
   * @memberof IVerifyDefault
   */
  tips: string
}
export type IVerify = IVerifyProps & IVerifyDefault
// 必填验证
const valueRequired = (data: IVerify) => {
  data.status = '';
  data.tips = '';
  if (data.value === '' && data.required) {
    data.status = 'error';
    data.tips = `${data.alias || data.name || ''}不能为空`;
  }
};
// 数值型范围验证
const valueRange = (data: IVerify) => {
  const range = data.range || [];
  const num = Number(data.value);
  const section = data.rangeSection;
  const isOpen0 = section ? section[0] === 'open' : false;
  const isOpen1 = section ? section[1] === 'open' : false;
  const isErr0 = isOpen0 ? (num <= range[0]) : (num < range[0]);
  const isErr1 = isOpen1 ? (num >= range[1]) : (num > range[1]);
  if (typeof range[0] === 'number' && isErr0) {
    data.status = 'error';
    data.tips = `${data.alias || data.name || ''}不能${isOpen0 ? '小于等于' : '小于'} ${range[0]}`;
  } else if (typeof range[1] === 'number' && isErr1) {
    data.status = 'error';
    data.tips = `${data.alias || data.name || ''}不能${isOpen1 ? '大于等于' : '大于'} ${range[1]}`;
  }
  if (data.floatLength) {
    const strAfterPoint = data.value.toString().split('.')[1];
    if (strAfterPoint && strAfterPoint.length > data.floatLength) {
      data.status = 'error';
      data.tips = `小数点后最多保留 ${data.floatLength} 位有效位`;
    }
  }
};
// 字符型值长度
const valueLength = (data: IVerify) => {
  const range = data.length || [];
  let length = data.value.length;
  if (data.doubleByte) {
    const dblByteReg = /[\u4e00-\u9fa5]/;
    // eslint-disable-next-line
    for (let i = 0; i < length; i++) {
      length += dblByteReg.test(data.value[i]) ? 1 : 0;
    }
  }
  if (range[0] && length < range[0]) {
    data.status = 'error';
    data.tips = `${data.alias || data.name || ''}不能少于${range[0]}字节`;
  } else if (range[1] && length > range[1]) {
    data.status = 'error';
    data.tips = `${data.alias || data.name || ''}不能多于${range[1]}字节`;
  }
  if (data.doubleByte && data.status && (range[0] || range[1])) {
    data.tips += '，一个汉字占两个字节';
  }
};
// 正则校验
const valueTest = (data: IVerify) => {
  if (data.reg && !data.reg.test(data.value)) {
    data.status = 'error';
    data.tips = `${data.alias || data.name || ''}必须是${data.regText || '有效值'}`;
  }
};
// 校验
const verification = (data: IVerify) => {
  if (data.disVerify) {
    return;
  }
  valueRequired(data);
  if (data.value === '' || data.status) {
    return;
  }
  valueRange(data);
  // @ts-ignore
  if (data.status === 'error') {
    return;
  }
  valueLength(data);
  // @ts-ignore
  if (data.status === 'error') {
    return;
  }
  valueTest(data);
  data.status = data.status || 'success';
};

const DEFAULT_ATTR: IVerifyDefault = {
  required: true,
  status: '',
  tips: '',
  value: '',
};

const verify = (verifyData: IVerifyProps): IVerify => {
  const info = {
    verCode: '' as TypeRegCode,
    ...DEFAULT_ATTR,
    ...verifyData,
    defaultValue: verifyData.value || '',
  };

  // verCode 未定义时进行提示
  if (!VER_KEYS.includes(info.verCode)) {
    // eslint-disable-next-line
    console.warn(`verCode is not found`);
    info.disVerify = true;
  } else {
    Object.assign(info, regs[info.verCode]);
  }

  Object.defineProperty(info, 'value', {
    get() {
      return info.defaultValue;
    },
    set(val: string) {
      info.defaultValue = val;
      verification(info as IVerify);
    },
  });
  if (info.defaultValue) {
    verification(info as IVerify);
  }
  return info;
};

export {
  verify as default,
  verify,
  verification,
};
