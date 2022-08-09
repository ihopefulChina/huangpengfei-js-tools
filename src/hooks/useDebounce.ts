import { useCallback, useRef } from 'react'

/**
 * 防抖 => 任务频繁触发的情况下，只有任务触发的间隔超过指定间隔的时间，才执行代码一次
 * @param  fn 函数
 * @param  delay 间隔秒数
 * @export
 */
export const useDebounce = (fn: Function, delay = 100) => {
  const time1 = useRef<any>();
  return useCallback((...args) => {
    if (time1.current) {
      clearInterval(time1.current)
    }
    time1.current = setTimeout(() => {
      fn(...args)
    }, delay);
  }, [delay, fn])
}

