import { useEffect, useState } from 'react'

interface IitemType {
    id: number | string
    value: string
    ja_value?: string
    children?: IitemType[]
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
    list: IitemType[]
    /**
     * 深度
     *
     */
    depth?: number
    /**
     * key 值
     *
     */
    rangeKey?: string
}

/**
 * 官方多列选择器hooks
 * @param value 当前选中的value
 * @param list 列表数据 => 列表数据树结构
 */
export function useMultiSelectorTree({ value, list, depth = 3, rangeKey = 'value' }: IProps) {
    // index 合集
    const [valueIndex, setValueIndex] = useState([0, 0, 0])
    // title
    const [title, setTitle] = useState('')
    // 数组
    const [newList, setNewList] = useState('' as any)

    useEffect(() => {
        if (list && list.length > 0) {
            initData()
        }
    }, [value, list])
    // list,滑动值和title赋值
    const initData = () => {
        // index 合集
        const newIndexs = valueIndex
        const oldList = [] as any

        if (value && value.length > 0) {
            setTitle(value.map(it => it?.[rangeKey]).join('-'))
            oldList[0] = list
            // 计算list
            const twoIndex = list.findIndex(it => `${it.id}` === `${value[0]?.id}`)
            oldList[1] = list[twoIndex]?.children || []
            newIndexs[0] = twoIndex
            const lastIndex = oldList[1].findIndex(it => `${it.id}` === `${value[1]?.id}`)
            newIndexs[1] = lastIndex
            if (depth === 3) {
                oldList[2] = oldList[1][lastIndex]?.children || []
                newIndexs[2] = oldList[2].findIndex(it => `${it.id}` === `${value[2]?.id}`)
            }

            setNewList([...oldList])
            setValueIndex(newIndexs)
        } else {
            console.log(`listlistlistlistlistlist****`, list)
            // 计算list
            oldList[0] = list
            oldList[1] = list[0]?.children || []
            newIndexs[0] = 0
            newIndexs[1] = 0
            if (depth === 3) {
                oldList[2] = oldList[1][0]?.children || []
                newIndexs[2] = 0
            }
            setNewList([...oldList])
            setValueIndex(newIndexs)
        }
    }

    const onColumnChange = event => {
        const { value: noneIndex, column } = event?.detail
        const oldList = [...newList]
        const activeItem = newList[column][noneIndex]
        const newIndexs = valueIndex
        newIndexs[column] = noneIndex
        if (column === 0) {
            const twoIndex = list.findIndex(it => `${it.id}` === `${activeItem?.id}`)
            oldList[1] = list[twoIndex]?.children || []
            newIndexs[1] = 0
            if (depth === 3) {
                oldList[2] = oldList[1][0]?.children || []
                newIndexs[2] = 0
            }
            setNewList([...oldList])
        } else if (column === 1) {
            if (depth === 3) {
                oldList[2] = oldList[1][noneIndex]?.children || []
                newIndexs[2] = 0
            }

            setNewList([...oldList])
        }

        setValueIndex([...newIndexs])
    }

    // 根据index合集 获取树值
    const formatVals = idxs => {
        const activeIt = idxs.map((it, index) => {
            return newList[index][it]
        })

        return activeIt
    }

    // 取消
    const onCancel = () => {
        initData()
    }

    return { title, valueIndex, range: newList || list, onColumnChange, onCancel, formatVals }
}
