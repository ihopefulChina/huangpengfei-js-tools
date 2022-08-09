import { useState } from "react";
import { usePersistFn } from ".";

/**
 * @description 函数运行完成之前锁死，用法和 useCallback 一致
 * @param callback 运行的函数
 * @param duration 锁定时间
 * @return [callback, isRunning]
 */
export function useLock(callback: (...args: any[]) => any, duration = 500): [(...args: any[]) => Promise<void>, boolean] {
  const [isRunning, setIsRunning] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);

  const lockFn = usePersistFn(async (...args) => {
    const now = Date.now();
    if (isRunning || (now - lastRequestTime) < duration) {
      return;
    }
    setLastRequestTime(Date.now());
    try {
      setIsRunning(true);
      await callback(...args);
    } catch (error) {
      setIsRunning(false);
      throw error;
    }
    setIsRunning(false);
  });

  return [lockFn, isRunning];
}
