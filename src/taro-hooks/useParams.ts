import { useMemo } from 'react';
import { useRouter } from '@tarojs/taro';

/**
 * 用于拿页面的参数
 */
export function useParams() {
    const { params } = useRouter();

    const res = useMemo(() => {
        const result = { ...params };
        const scene = decodeURIComponent(params.scene || '');
        const sceneList = scene.split('$');
        for (const item of sceneList) {
            if (item.includes('#')) {
                const list = item.split('#');
                result[list[0]] = list[1];
                if (list[0] === 'iId') {
                    result.inviterId = list[1];
                }
            }
        }

        return result;
    }, [params]);

    return res;
}
