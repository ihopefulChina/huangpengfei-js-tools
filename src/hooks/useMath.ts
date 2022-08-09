
const math = {
  /**
   * 找最大值
   * @param arr 值数组
   */
  max: (arr) => Math.max(...arr),
  /**
   * 找最小值
   * @param arr 值数组
   */
  min: (arr) => Math.min(...arr),
  /**
   * 加
   * @param arr 值数组
   */
  add: (arr) => {
    const baseNum = Math.pow(10, math.max(arr.map(it => formatMathValue(it))));
    return arr.map(it => it * baseNum).reduce((prev, curr) => prev + curr) / baseNum;
  },

  /**
   * 减
   * @param arr 值数组
   */
  sub: (arr) => {
    const precision = math.max(arr.map(it => formatMathValue(it)))
    const baseNum = Math.pow(10, precision);
    return (arr.map(it => it * baseNum).reduce((prev, curr) => prev - curr) / baseNum).toFixed(precision);
  },

  /**
   * 乘
   * @param arr 值数组
   */
  multi: (arr) => {
    const baseNum = arr.map(it => formatMathValue(it)).reduce((prev, curr) => prev + curr);
    return arr.map(it => Number(it.toString().replace(".", ""))).reduce((prev, curr) => prev * curr) / Math.pow(10, baseNum);
  },

  /**
   * 除
   * @param arr 值数组
   */
  div: (arr) => {
    const baseNum = arr.map(it => formatMathValue(it));
    const baseNum2 = arr.map(it => Number(it.toString().replace(".", "")));
    return baseNum2.reduce((prev, curr) => prev / curr) / Math.pow(10, baseNum.reduce((prev, curr) => prev - curr));
  }

}
// 格式化值
const formatMathValue = (val: number) => {
  try {
    return val.toString().split(".")[1].length;
  } catch (event) {
    return 0;
  }
}

/**
 * 进行数学计算
 * @param key 类型key值<TypeCode>
 * @param vals 值数组
 * @param decimal 保留小数位数 除法用到
 */
export type TypeCode = 'add' | 'min' | 'max' | 'sub' | 'multi' | 'div';
export function useMath(key: TypeCode, vals: number[]) {
  return vals.length > 0 ? math[key]([...vals]) : 0
}

