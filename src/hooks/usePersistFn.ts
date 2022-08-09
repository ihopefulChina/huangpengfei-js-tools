import { useRef } from 'react';

export type noop = (...args: any[]) => any;

/**
 * 保持引用不变的情况下让函数维持最新的功能
 */
export function usePersistFn<T extends noop>(fn: T) {
  const fnRef = useRef<T>(fn);
  fnRef.current = fn;

  const persistFn = useRef<T>();
  if (!persistFn.current) {
    persistFn.current = function (...args) {
      return fnRef.current.apply(this, args);
    } as T;
  }

  return persistFn.current;
}
