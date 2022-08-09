// 作者：CreditFE信用前端
// 链接：https://www.zhihu.com/question/42879223/answer/2488319635
// 来源：知乎
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

// 提供一种数据响应式的操作体验，定义数据状态不需要写useState，直接修改属性即可刷新视图。 => https://ahooks.js.org/zh-CN/hooks/use-reactive

import { useRef, useState } from "react";

const proxyMap = new WeakMap();

const observer = (initialState, cb) => {
  const existing = proxyMap.get(initialState);
  if (existing) return existing;
  const proxy = new Proxy(initialState, {
    get(target, key, receiver) {
      const val = Reflect.get(target, key, receiver);
      return typeof val === "object" && val !== null ? observer(val, cb) : val; // 递归处理object类型
    },
    set(target, key, val) {
      const ret = Reflect.set(target, key, val);
      cb()
      return ret;
    },
    deleteProperty(target, key) {
      const ret = Reflect.deleteProperty(target, key);
      cb();
      return ret;
    }
  });
  return proxyMap.set(initialState, proxy) && proxy;
};

export function useReactive(initialState) {
  const refState = useRef(initialState);
  const [, setUpdate] = useState({});
  const refProxy = useRef({
    data: null,
    initialized: false
  });
  if (refProxy.current.initialized === false) {
    refProxy.current.data = observer(refState.current, () => {
      setUpdate({});
    });
    refProxy.current.initialized = true;
    return refProxy.current.data;
  }
  return refProxy?.current?.data || {} as any;
}