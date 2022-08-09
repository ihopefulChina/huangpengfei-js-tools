import React, { useState, useCallback, useEffect } from 'react';
import { showToast } from '@tarojs/taro';
import { regs } from './verify';

interface IUseCaptchaReturns {

  /**
   * 验证码的值，可直接作为 input 的 value 使用
   * @type {string}
   * @memberof IUseCaptchaReturns
   */
  captcha: string

  /**
   * 可再次请求验证码的倒计时
   * @type {number}
   * @memberof IUseCaptchaReturns
   */
  countdown: number

  /**
   * 设置验证码的值
   * @type {React.Dispatch<React.SetStateAction<string>>}
   * @memberof IUseCaptchaReturns
   */
  setCaptcha: React.Dispatch<React.SetStateAction<string>>

  /**
   * 调用该方法可向手机发送验证码，获取验证码，请根据不同项目的情况，适当修改发送验证码的接口
   *
   * @type {() => Promise<void>}
   * @memberof IUseCaptchaReturns
   */
  getCaptcha: () => Promise<void>

  /**
   * 校验验证码的接口，请根据不同项目的情况，适当修改校验验证码的接口
   *
   * @type {() => Promise<any>}
   * @memberof IUseCaptchaReturns
   */
  checkCaptcha: () => Promise<any>
}

/**
 * 根据电话号码获取验证码
 * @param mobile 电话号码
 * @param duration 获取验证码间隔时间，默认 60s
 */
export function useCaptcha(mobile: string, duration = 60, sendVerCode, validMobile): IUseCaptchaReturns {
  const [captcha, setCaptcha] = useState('');
  const [countdown, setCountdown] = useState(0);

  // 获取验证码
  const getCaptcha = useCallback(async () => {
    if (countdown) {
      return;
    }
    if (!regs.mobile.reg.test(mobile)) {
      showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }
    // 执行发送验证码操作
    await sendVerCode(mobile);
    showToast({ title: '验证码发送成功', icon: 'none' });
    setCountdown(duration);
  }, [mobile, countdown]);

  // 校验验证码
  const checkCaptcha = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (captcha.length < 4) {
        showToast({ title: '请输入验证码', icon: 'none' });
        reject(new Error('请输入验证码'));
      } else {
        // 校验验证码
        validMobile({ mobile, captcha })

      }
    });
  }, [mobile, captcha]);

  useEffect(() => {
    const cdSt = setTimeout(() => {
      if (countdown > 0) {
        setCountdown(num => num - 1);
      }
    }, 1000);
    return () => {
      clearTimeout(cdSt);
    };
  }, [countdown]);

  return {
    captcha,
    countdown,
    setCaptcha,
    getCaptcha,
    checkCaptcha,
  };
}
