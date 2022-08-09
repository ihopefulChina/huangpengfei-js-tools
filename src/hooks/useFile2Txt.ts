
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'

/**
 *  文件转数据
 * @export
 */

export const useFile2Txt = (fileUrl) => {
  const [nodes, setNodes] = useState('')

  const init = () => {
    if (fileUrl) {
      Taro.request({
        url: fileUrl,
        success: (res) => {
          setNodes(res.data)
        }
      })
    }
  }

  useEffect(() => {
    if (fileUrl) {
      init()
    }
  }, [fileUrl])

  return { nodes }
}

