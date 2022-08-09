import { useCallback } from 'react';
import Taro from '@tarojs/taro';

interface INavigateOpts {
    success?: (res: any) => void
    complete?: (res: any) => void
    fail?: (res: any) => void
    events?: any
}

export function useMyRoute({ routeNames, tabbar }) {
    const tabbarUrlList = tabbar.map(item => item.url);
    // 公司修改的框架引入了 routeNames，为了方便使用，将路由封装一下，使用的时候可以直接提示
    const routerFn = <K extends Record<string, string>>(routes: K, isReplace = false) => {
        const lastCache: Record<string, number> = {};

        return (routeKey: string, prop: Record<string, number | string> = {}, opts?: INavigateOpts) => {
            const path = routeKey;
            const now = Date.now();
            if (now - lastCache[path] < 500) {
                return;
            }
            lastCache[path] = now;
            const paramList: string[] = [];
            for (const [key, val] of Object.entries(prop)) {
                paramList.push(`${key}=${val}`);
            }
            const url = paramList && paramList.length > 0 ? `${routeKey}?${paramList.join('&')}` : `${routeKey}`;
            if (!path) {
                // eslint-disable-next-line no-console
                console.log('navigate err, 路由传的 key 不对');
            } else if (tabbarUrlList.includes(routeKey)) {
                Taro.switchTab({ url, ...opts });
            } else if (isReplace) {
                Taro.redirectTo({ url, ...opts });
            } else {
                Taro.navigateTo({ url, ...opts });
            }
        };
    };
    const navigate = useCallback(routerFn(routeNames, false), []);

    const replace = useCallback(routerFn(routeNames, true), []);

    return { navigate, replace, routeNames };
}
