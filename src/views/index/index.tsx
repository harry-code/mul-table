import React, { useEffect } from 'react';
import Bread from '~/components/views/bread'
import ResizableTitle from '~/components/views/resizableTitle'

export default () => {
    useEffect(() => {
        /**
         * 去掉默认右键事件
         */
        document.oncontextmenu = (e) => {
            e.preventDefault();
        };
    }, [])
    return <>
        <Bread />
        <ResizableTitle />
    </>
}