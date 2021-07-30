import React from 'react';
import { Table } from 'antd';
import './index.less';

export default () => {
    // const data = [
    //     {
    //         "sheetId": 1,
    //         "fieldId": 1,
    //         "value": "中国1",
    //         "lineNum": 1,
    //         "rowNum": 1
    //     },
    //     {
    //         "sheetId": 1,
    //         "fieldId": 2,
    //         "value": "45",
    //         "lineNum": 1,
    //         "rowNum": 2
    //     },
    //     {
    //         "sheetId": 1,
    //         "fieldId": 1,
    //         "value": "中国2",
    //         "lineNum": 2,
    //         "rowNum": 1
    //     },
    //     {
    //         "sheetId": 1,
    //         "fieldId": 2,
    //         "value": "45",
    //         "lineNum": 2,
    //         "rowNum": 2
    //     }
    // ]
    const dataSource = [
        {
            key: '1',
            '姓名': '胡彦斌',
            age: 32,
            address: '西湖区湖底公园1号',
        },
    ];

    // let _arry = []
    // data.map(item => {
    //     _arry.push({
    //         title: item.fieldId,
    //         dataIndex: item.fieldId,
    //         key: item.fieldId,
    //     })

    // })


    const columns = [
        {
            title: '年龄',
            dataIndex: '年龄',
        },
        {
            title: '姓名',
            dataIndex: '姓名',
        },
    ];
    return <>
        <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
        />
    </>
}