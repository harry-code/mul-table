import React, { useEffect, useState } from 'react';
import Pubsub from 'pubsub-js';
import './index.less';

export default () => {
    useEffect(() => {
        // 监听表格信息变化
        Pubsub.subscribe('tableInfo', (msg: string, data: any) => {
            setTableInfo(data);
        })
    }, [])
    const [tableInfo, setTableInfo] = useState<{ tableName: string, sheetName: string }>({ tableName: '未命名数据表1', sheetName: '任务表1' })
    return <>
        <span>{tableInfo?.tableName} / {tableInfo?.sheetName || '任务表1'}</span>
    </>
}