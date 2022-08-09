import { useCallback, useState } from 'react'

/**
 * 类似于 class 组件的 forceUpdate 的功能
 * @export
 */
export const useUpdate = () => {
  const [, setState] = useState({})

  return useCallback(() => setState({}), [])
}

