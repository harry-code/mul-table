import React from 'react';
import { useState } from 'react';
import { ResizableBox } from 'react-resizable';
import './index.less'

export default () => {
    const [rowCount, setRowCount] = useState<any>([]);
    const [columnsData, setColumns] = useState([
        {
            name: '未命名1'
        }
    ])
    const [rowsData, setRows] = useState<any[]>([])
    // 新增一列
    const addColumn = () => {
        let _arry = columnsData.concat({
            name: `未命名` + (columnsData.length + 1)
        })
        setColumns(_arry)
        if (rowsData.length > 0) {
            addRow(_arry);
        } 
    }

    // 新增一行
    const addRow = (data?: any) => {
        if (!Array.isArray(data)) {
            setRowCount(rowCount.concat({
                num: (rowCount.length + 1)
            }))
        }
        if (data.length > 0) {
            setRows(data.map((item: { name: any; }) => ({
                name: '',
                key: item.name || 1
            })));
            return
        }
        setRows(columnsData.map((item) => ({
            name: '',
            key: item.name || 1
        })))
    }

    // 记录鼠标事件
    const mouseDownFn = (e: { button: any; }) => {
        const { button } = e;
        if (button === 2){
            
        } else if (button === 0){
            alert("你点了左键");
        } else if (button === 1){
            alert("你点了滚轮");
        }
    }
    return (
        <div className="box">
            <div>
                <div className="box-column-resizable">
                    {
                        columnsData?.map(item => {
                            return (
                                <div onMouseDown={mouseDownFn} key={item.name}>
                                    <ResizableBox 
                                        key={item.name}
                                        width={70} 
                                        height={40} 
                                        draggableOpts={{}}
                                        minConstraints={[70, 40]} 
                                        maxConstraints={[300, 40]}>
                                            <span>{item.name}</span>
                                    </ResizableBox>
                                </div>
                                
                            )
                        })
                    }
                </div>

                <div>
                    {
                        rowCount.map((item: { num: React.Key | null | undefined; }) => (
                            <div className="box-row-resizable" key={item.num}>
                                {
                                    rowsData?.map((item, index) => {
                                        return (
                                            <ResizableBox 
                                                key={index}
                                                width={70} 
                                                height={40} 
                                                draggableOpts={{}}
                                                minConstraints={[70, 40]} 
                                                maxConstraints={[300, 40]}>
                                                    <span>{item.name}</span>
                                            </ResizableBox>
                                        )
                                    })
                                }
                            </div>
                        ))
                    }
                    
                </div>

                

                <div className="box-right">
                    <span onClick={addRow}>新增一行</span>
                </div>
            </div>
            

            <div className="box-bottom">
                <span onClick={addColumn}>新增一列</span>
            </div>
        </div>
        
    )
}
