import React from 'react'
import Taro, { useDidHide, useDidShow } from '@tarojs/taro';

interface IModifyOptions {
    /**
     * 用于匹配修改值的主键，默认是 id
     * @type {string}
     * @memberof IModifyOptions
     */
    matchKey?: string
    /**
     * 是否禁用
     * @type {boolean}
     * @memberof IModifyOptions
     */
    disabled?: boolean
}

/**
 * 从详情页面返回列表页面后，更新或者删除列表中的数据
 * @param key Taro.getStorageSync 中能获取到的数据，值是对象将会更新对应数据，值是字符串或者数值将会删除对应数据
 * @param setList 更新列表中的数据
 * @param options 额外参数，包含 matchKey 匹配用的主键，disabled 禁用
 */
export function useModify(key: string, setList: React.Dispatch<React.SetStateAction<any[]>>, options: IModifyOptions = {}) {
    useDidShow(async () => {
        const data = Taro.getStorageSync(key);
        const matchKey = options.matchKey || 'id';

        if (data && !options.disabled) {
            // 值是一个对象，执行更新操作
            const isUpdate = typeof data === 'object';
            // 值是字符串或数字，执行删除操作
            const isDel = ['number', 'string'].includes(typeof data);

            if (isUpdate) {
                await setList(list => {
                    const mockList = [...list];
                    const idx = mockList.findIndex(it => String(it[matchKey]) === String(data[matchKey]));
                    if (idx > -1) {
                        mockList.splice(idx, 1, Object.assign(mockList[idx], data));
                    }
                    return mockList;
                });
            }
            if (isDel) {
                await setList(list => list.filter(it => `${it[matchKey]}` !== `${data}`));
            }
            // 分包 部分页面不会触发useDidHide
            Taro.removeStorageSync(key);
        }
    });

    useDidHide(() => {
        Taro.removeStorageSync(key);
    });
}
