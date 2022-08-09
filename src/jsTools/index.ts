import React from 'react'
/**
 * @description 数字和字符串前面加0
 * @param num 值
 */
export function addZero(num: number | string): string {
  return Number(num) < 10 ? '0' + Number(num) : String(num)
}

/**
 * @description 格式化时间
 * @param value 时间
 * @param pattern 格式化的模式
 */
export function formatDate(value: number | string, pattern = 'YYYY-MM-DD hh:mm:ss') {
  if (!value) {
    return ''
  }
  let val: any = value
  if (typeof val === 'string') {
    val = val.replace(/-/g, '/')
  }
  if (/^\d{4}\/\d{1,2}$/.test(val)) {
    val += '/01'
  }
  const date = new Date(val)
  const chinese = ['日', '一', '二', '三', '四', '五', '六']
  let model = pattern
  const year = String(date.getFullYear())
  const month = String(date.getMonth() + 1)
  const week = String(date.getDay())
  const day = String(date.getDate())
  const hour = String(date.getHours())
  const minute = String(date.getMinutes())
  const second = String(date.getSeconds())
  const time = String(date.getTime())
  if (model === 'time' || model === 'Time') {
    return time
  }
  model = model.replace(/YYYY/, year)
  model = model.replace(/YY/, String(year).slice(2))
  model = model.replace(/MM/, addZero(month))
  model = model.replace(/M/, month)
  model = model.replace(/[wW]+/, '周' + chinese[week])
  model = model.replace(/[WW]+/, '星期' + chinese[week])
  model = model.replace(/DD/, addZero(day))
  model = model.replace(/D/, day)
  model = model.replace(/hh/, addZero(hour))
  model = model.replace(/h/, hour)
  model = model.replace(/mm/, addZero(minute))
  model = model.replace(/m/, minute)
  model = model.replace(/ss/, addZero(second))
  model = model.replace(/s/, second)
  return model
}

/**
 * @description 价格显示
 * @param num 时间
 * @param fixedLen 保留小数点
 */
type toYuanFunc = (num: number, fixedLen?: number) => string
export const toYuan: toYuanFunc = (num, fixedLen = 2) => {
  const yuan = isNaN(num) ? '0.00' : num.toFixed(fixedLen)
  return yuan[0] === '-' ? `-￥${yuan.substring(1)}` : `￥${yuan}`
}

/**
 * @description 防抖函数
 * @param {function} func 执行函数
 * @param {number} wait 等待时间
 * @param {boolean} immediate 立即执行
 * @return {function} 防抖控制函数
 */
export const debounce = <T>(func: T, wait: number, immediate?: boolean): T => {
  let timer: any = null

  const cb: any = (...args: any[]) => {
    if (immediate && !timer) {
      ; (func as any)(...args)
    }
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      ; (func as any)(...args)
      timer = null
    }, wait)
  }

  return cb
}

/**
 * @description 异步防抖函数
 * @param {function} func 执行函数
 * @param {number} wait 等待时间
 * @param {boolean} immediate 立即执行
 * @return {function} 防抖控制函数
 */
export const asyncDebounce = <T>(func: T): T => {
  let timerArgs: any = null
  let isFetching = false

  const cb: any = async (...args: any[]) => {
    if (!isFetching) {
      try {
        isFetching = true
        await (func as any)(...args)
      } catch (error) {
      } finally {
        isFetching = false
        if (timerArgs) {
          cb(...timerArgs)
          timerArgs = null
        }
      }
    } else {
      timerArgs = args
    }
  }

  return cb
}

/**
 * @description 用&拼接对象成字符串
 * @param params 对象
 */
export function getUrl2Params(params) {
  let paramStr = '';
  Object.keys(params)
    .forEach((item) => {
      if (paramStr === '') {
        paramStr = `${item}=${params[item]}`;
      } else {
        paramStr = `${paramStr}&${item}=${params[item]}`;
      }
    });
  return paramStr;
}

/**
 * @description 解析 scene 参数
 * @param {string} queryStr 参数字符串
 * @return {object} 结果对象
 */
export const parseScene = (scene = '') => {
  const maps: { [key: string]: string } = {}
  const list = decodeURIComponent(scene).split('$')
  for (const item of list) {
    if (item.includes('#')) {
      const data = item.split('#')
      maps[data[0]] = data[1]
    }
  }
  return maps
}

/**
 * @description 生成多行省略的 CSS，由于写在 CSS 中会有毛病，只能这样来了
 * @param {number} line 参数字符串
 * @return {object} 结果对象
 */
export const multipleText = (line = 2) => {
  const style: React.CSSProperties = {
    wordBreak: 'break-all',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: line,
    WebkitBoxOrient: 'vertical'
  }
  return style
}

/**
 * @description 过滤富文本字符串
 * @param htmlStr 待处理的字符串
 * @returns
 */
export const formatRichText = (htmlStr: string, hiddenVideo = false) => {
  if (!htmlStr || htmlStr === '<p></p >') {
    return '<p></p >'
  }
  let res = htmlStr
    .replace(/style="[^"]+"/gi, '')
    .replace(/style='[^']+'/gi, '') // 小程序展示要自己统一的样式，替换了行内样式
    .replace(/(<!--(.|[\r\n])*?-->)/gi, '') // 替换了注释的内容这能替掉大部分
    .replace(/<xml[^>]*>(.|\n)*<\/xml>/gi, '') // 替换了xml标签<xml></xml>word粘贴带出一堆标签包含在xml里干掉它
    .replace(/undefined/gi, '')
    .replace(/\<strike/gi, '<div style=\'text-decoration: line-through\'')
    .replace(/\<img/gi, '<img style=\'max-width: 100%;height:auto;display:block;\'')

  if (hiddenVideo) {
    res = htmlStr.replace(/\<video/gi, '<p')
  }
  return res
}

/**
 * 生成唯一标识符
 *
 * @export
 * @returns
 */
export function guid() {
  return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`
}
function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}

/**
 * @description 判断对象，以及下级是否包含空对象
 * @param params 对象
 */
export const objecAtrtIsEmpty = (data: any): any => {
  // 如果是数组，遍历数组里面的
  if (Array.isArray(data)) {
    if (data.length === 0) return false;
    return data.every(el => {
      return objecAtrtIsEmpty(el);
    });
    // 非空数组
  } else if (Object.prototype.toString.call(data) === "[object Object]" && JSON.stringify(data) !== '{}') {
    // 对象or对象数组
    return Object.keys(data).every(key => {
      // 如果对象子元素为数组
      if (Array.isArray(data[key])) {
        if (data[key].length === 0) return false;
        return data[key].every((elValue: any) => {
          return objecAtrtIsEmpty(elValue);
        });
      } else if (Object.prototype.toString.call(data) === "[object Object]") {
        // 如果0表示不为空的话可以直接用!data
        // 直接用!data,非运算符的话有些值为0的话会被过滤掉
        return !!data[key];
      }
      return !!key;
    });
  } else if (Object.prototype.toString.call(data) === "[object Object]" && JSON.stringify(data) === '{}') {
    return false;
  }
  // 处理单个值
  return !!data;
}

/**
 * @description 去除空对象
 * @param params 对象
 */
export function removeEmptyValues(obj) {
  for (const propName in obj) {
    if (!obj[propName] || obj[propName].length === 0) {
      delete obj[propName];
    } else if (typeof obj[propName] === 'object') {
      removeEmptyValues(obj[propName]);
    }
  }
  return obj;
}


/**
 * 脱敏公用
 * @param str 脱敏字符串
 * @param begin 起始保留长度，从0开始
 * @param end 结束保留长度，到str.length结束
 * @returns {string}
 */
export const desensitizedCommon = (str, begin = 0, end = 2) => {
  if (!str && (begin + end) >= str.length) {
    return "";
  }

  const leftStr = str.substring(0, begin);
  const rightStr = str.substring(str.length - end, str.length);

  let strCon = ''
  for (let idx = 0; idx < str.length - end - begin; idx++) {
    strCon += '*';
  }
  return leftStr + strCon + rightStr;
}

