
# huangpengfei-js-tools

整理工作中常用的JavaScript、Taro、Hooks方法合集


# 安装
```bash
npm install huangpengfei-js-tools
````


# 引入方法
```js
import { xxx } from 'huangpengfei-js-tools'
```


# 用例

```jsx
/* 组件 -- 官方多列选择器使用 */
import { memo } from 'react'
import Taro from '@tarojs/taro'
import { Picker } from '@tarojs/components'
import { useFile2Txt, useMultiSelectorTree } from 'huangpengfei-js-tools'

interface IProps {
  children: any
  onChange: any
  value: any
  disabled?: boolean
}

const Component = ({ children, value, onChange, disabled }: IProps) => {
  const rangeKey = 'value'
  const { nodes = [] as any } = useFile2Txt(jsonUrl)
  const { valueIndex, range, onColumnChange, onCancel } = useMultiSelectorTree({ value, list: nodes, depth: 3, rangeKey })

  // 点击
  const onChangeCity = event => {
    const { value: values } = event?.detail
    if (onChange) {
      const item = values.map((it, index) => {
        return range[index][it]
      })
      onChange(item)
    }
  }

  return (
    <Picker
      mode="multiSelector"
      range={range}
      value={valueIndex}
      disabled={disabled}
      onCancel={onCancel}
      onColumnChange={onColumnChange}
      onChange={onChangeCity}
      rangeKey={rangeKey}
    >
      {children}
    </Picker>
  )
}

export default memo(Component)


```
