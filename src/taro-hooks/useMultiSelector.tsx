import { useEffect, useState } from 'react'

interface IitemType {
  id: number | string
  text: string
  pId?: number | string
}

interface IProps {
  /**
   * 选中的value
   * @type {[]}
   *
   */
  value: IitemType[]
  /**
   * 数组
   * @type {[]}
   *
   */
  list: IitemType[][]
}

/**
 * 官方多列选择器hooks
 * @param value 当前选中的value
 * @param list 列表数据
 */
export function useMultiSelector({ value, list }: IProps) {
  // index 合集
  const [valueIndex, setValueIndex] = useState([0, 0, 0])
  // title
  const [title, setTitle] = useState('')
  // 数组
  const [newList, setNewList] = useState('' as any)

  useEffect(() => {
    initData()
  }, [value])
  // list,滑动值和title赋值
  const initData = () => {
    const oldList = [...list]
    // index 合集
    const newIndexs = valueIndex
    if (value && value.length > 0) {
      setTitle(value.map(it => it?.text).join('-'))

      // 计算list
      oldList[1] = list[1].filter(it => `${it.pId}` === `${value[0]?.id}`)
      if (list.length === 3) {
        oldList[2] = list[2].filter(it => `${it.pId}` === `${value[1]?.id}`)
      }
      setNewList([...oldList])

      value.map((it, idx) => {
        newIndexs[idx] = oldList[idx].findIndex(val => `${val.id}` === `${it.id}`)
        return it
      })
      setValueIndex(newIndexs)
    } else {
      // 计算list
      if (list && list.length > 0) {
        oldList[1] = list[1].filter(it => `${it.pId}` === `${list[0][0]?.id}`)
        newIndexs[0] = 0
        newIndexs[1] = 0
        if (list.length === 3) {
          oldList[2] = list[2].filter(it => `${it.pId}` === `${oldList[1][0]?.id}`)
          newIndexs[2] = 0
        }
        setNewList([...oldList])
        setValueIndex(newIndexs)
      }
    }
  }

  const onColumnChange = event => {
    const { value: noneIndex, column } = event?.detail
    const oldList = [...list]
    const oldIndex = valueIndex
    oldIndex[column] = noneIndex
    if (column === 0) {
      const selected = list[column][noneIndex]
      oldList[1] = list[column + 1].filter(it => `${it.pId}` === `${selected.id}`)
      oldIndex[1] = 0
      if (list.length === 3) {
        oldList[2] = list[column + 2].filter(it => `${it.pId}` === `${oldList[1][0]?.id}`)
        oldIndex[2] = 0
      }

      setNewList([...oldList])
    } else if (column === 1 && list.length === 3) {
      const selected = newList[column][noneIndex]
      oldList[1] = newList[1]
      oldList[2] = list[column + 1].filter(it => `${it.pId}` === `${selected.id}`)
      oldIndex[2] = 0

      setNewList([...oldList])
    }

    setValueIndex([...oldIndex])
  }

  // 取消
  const onCancel = () => {
    initData()
  }

  return { title, valueIndex, range: newList || list, onColumnChange, onCancel }
}
