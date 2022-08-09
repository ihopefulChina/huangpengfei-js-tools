import Taro from '@tarojs/taro'

/**
 * @description toast 节流
 * @param {string} title toast 内容
 * @param {number} duration 持续时间
 */
export const toastThrottle = (() => {
    const timeMap: { [key: string]: number } = {}
    return (title: string, duration = 1000) => {
        const now = Date.now()
        const lastToast = timeMap[title] || 0
        if (now - lastToast < duration) {
            return
        }
        timeMap[title] = now
        Taro.showToast({ title, duration, icon: 'none' })
    }
})()

/**
 * 查询元素大小
 *
 * @export
 * @param {string} name
 * @param {*} scope
 * @returns
 */
export function selectRect(name: string, scope: any) {
    return new Promise<Taro.NodesRef.BoundingClientRectCallbackResult>(resolve => {
        setTimeout(() => {
            const query = Taro.createSelectorQuery().in(scope)
            query
                .select(name)
                .boundingClientRect(res => {
                    resolve(res as Taro.NodesRef.BoundingClientRectCallbackResult)
                })
                .exec()
        }, 0)
    })
}


// 把base64转换成图片
export const getBase64ImageUrl = img => {
    // / 获取到base64Data
    let base64Data = img
    // / 通过微信小程序自带方法将base64转为二进制去除特殊符号，再转回base64
    base64Data = Taro.arrayBufferToBase64(Taro.base64ToArrayBuffer(base64Data))
    // / 拼接请求头，data格式可以为image/png或者image/jpeg等，看需求
    const base64ImgUrl = 'data:image/png;base64,' + base64Data
    // / 刷新数据
    return base64ImgUrl
}


/**
 * url转成字符串
 * @param url url
 * @returns {string}
 */
export const urlFileToText = async (url: string) => {
    if (url) {
        Taro.request({
            url,
            success: async (res) => {
                return new Promise((resolve) => {
                    resolve(res.data || '');
                })
            }
        })
    }
}
// 定位方法
export const getLocation = ({ type = 'gcj02', isHighAccuracy = true, highAccuracyExpireTime = 4000 }) => {
    return Taro.getLocation({
        type,
        isHighAccuracy,
        highAccuracyExpireTime,
        success: val => {
            Taro.getSetting({
                success: res => {
                    if (!res.authSetting['scope.userLocation']) {
                        // 未授权
                        Taro.authorize({
                            scope: 'scope.userLocation',
                            success: async () => {
                                const newLatLng = {
                                    lat: val.latitude,
                                    lng: val.longitude
                                }
                                Taro.setStorageSync('latLng', newLatLng)
                                return newLatLng
                            },
                            fail: () => {
                                Taro.showModal({
                                    title: '定位失败',
                                    content: '请开启定位的权限',
                                    success: () => Taro.openSetting()
                                })
                                return ''
                            }
                        })
                    } else {
                        const newLatLng = {
                            lat: val.latitude,
                            lng: val.longitude
                        }
                        Taro.setStorageSync('latLng', newLatLng)
                        return newLatLng
                    }
                }
            })
        },
        fail: () => {
            return ''
        }
    })
}
