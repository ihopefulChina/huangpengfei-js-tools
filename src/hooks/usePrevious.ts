import { useRef } from 'react'

/**
 * 保存上一次渲染时 state 的值 useRef.current 来存放变量
 * @export
 *  @param callback 运行的函数
 */
export const usePrevious = (state) => {
  const prevRef = useRef()
  const curRef = useRef()

  prevRef.current = curRef.current;
  curRef.current = state;

  return prevRef.current
}

