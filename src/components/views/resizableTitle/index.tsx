import React, { useEffect, useState } from 'react';
import { Dropdown, Input, Form, Select, Button, Space } from 'antd';
import { ResizableBox } from 'react-resizable';
import Pubsub from 'pubsub-js';
import {
    saveFieldThead,
    getSheetThead,
    saveOrUpdateLineInfo,
    saveOrUpdateLinesInfo,
    getSheetInfoExcludeThead,
    delThead,
    delCellRow,
    shareSheet,
} from '~/service/apis/table';
import './index.less'

const { Option } = Select;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export default () => {
    // 规定最大行数
    const ROW_COUNT = 30;
    const [form] = Form.useForm();
    const [theadData, setThead] = useState<any>([]);
    const [rowCount, setRowCount] = useState<any>([]);

    useEffect(() => {
        // 监听表格信息变化
        Pubsub.subscribe('tableInfo', async (msg: string, data: any) => {
            const { sheetId } = data;
            if (sheetId) {
                await getInitData(sheetId);
            }
        })
    }, [])

    // 获取表头与单元格数据
    async function getInitData(sheetId: any) {
        try {
            const { code, data } = await getSheetThead(sheetId);
            const sheetInfo = await getSheetInfoExcludeThead(sheetId);
            if (code === 200) {
                setThead(data)
            }
            if (sheetInfo.code === 200) {
                const { data } = sheetInfo;
                let _arry = [];
                for (let i = 1; i < ROW_COUNT; i++) {
                    const res = data.filter((item: any) => item.lineNum === i);
                    if (res.length !== 0) {
                        _arry.push(res)
                    }
                    // if (res.length === 0) {
                    //     break
                    // }
                }
                setRowCount([..._arry]);
            }
        } catch (error) {
            console.error(error);
        }
    }
    // 新增一列
    const addColumn = async () => {
        const sheetId = JSON.parse(localStorage.getItem('tableInfo')!).sheetId;
        const nameNum = (+(theadData[theadData.length - 1]?.chineseFieldName[theadData[theadData.length - 1]?.chineseFieldName.length - 1]) + 1) || 1;
        let _arry = theadData.concat({
            chineseFieldName: `未命名` + nameNum,
            dropDownVisible: false,
        })
        setThead(_arry)

        const listLineInfoDTO = rowCount.length > 0 ? rowCount.map((ite: any) => {
            return {
                cellValue: '',
                fieldId: '',
                id: '',
                lineNum: ite[0]?.lineNum, // 行数
                sheetId,
            }
        }) : [];

        if (rowCount.length > 0) { // 新增列 =》 新增行
            for (let i = 0; i < listLineInfoDTO.length; i++) {
                rowCount[i].push(listLineInfoDTO[i]);
            }
            setRowCount([...rowCount]);
        }

        const { code } = await saveFieldThead({
            chineseFieldName: `未命名` + nameNum,
            sheetInfoId: sheetId,
            listLineInfoDTO,
        })
        if (code === 200) {
            await getInitData(sheetId)
            // const { code, data } = await getSheetThead(sheetId);
            // if (code === 200) {
            //     setThead(data)
            // }
        }
    }

    // 新增一行
    const addRow = () => {
        const lineNum = rowCount[rowCount.length-1]?.[0]?.lineNum + 1 || 1
        // 新增一行
        let params = theadData.map((item: any) => ({
            cellValue: '',
            fieldId: item.id,
            lineNum, // 行数
            sheetId: JSON.parse(localStorage.getItem('tableInfo')!).sheetId,
            key: item.chineseFieldName || 1
        }))
        rowCount.push(params);
        setRowCount([...rowCount]);
        addCells(params);
    }

    // 批量新增单元格
    const addCells = async (params: any) => {
        const { code } = await saveOrUpdateLinesInfo(params);
        const sheetId = JSON.parse(localStorage.getItem('tableInfo')!).sheetId;
        if (code === 200) {
            await getInitData(sheetId);
            // const sheetInfo = await getSheetInfoExcludeThead(sheetId);
            // if (sheetInfo.code === 200) {
            //     const { data } = sheetInfo;
            //     let _arry = [];
            //     for (let i = 1; i < ROW_COUNT; i++) {
            //         const res = data.filter((item: any) => item.lineNum === i);
            //         if (res.length === 0) {
            //             break
            //         }
            //         _arry.push(res)
            //     }
            //     setRowCount([..._arry]);
            // }
        }
    }

    // 双击编辑单元格
    const editCell = (ite: any, index: number) => {
        rowCount[index].find((i: { fieldId: number; }) => i.fieldId === ite.fieldId).isEdit = true;
        setRowCount([...rowCount]);
    }

    // 提交单元格数据（除表头以外）
    const submitCell = async (v: any, index: number, idx: number) => {
        rowCount[index][idx].cellValue = v.target.defaultValue;
        rowCount[index][idx].isEdit = false;
        const res = await saveOrUpdateLineInfo({
            ...rowCount[index][idx]
        })
        setRowCount([...rowCount]);
    }

    // 表头鼠标事件
    const mouseDownFn = async (index: number, e: any) => {
        const { button } = e;
        // 右键
        if (button === 2) {
            await dropdownShow(index, true);
        }
    }

    // 单元格鼠标事件
    const cellOnMouseDown = async (item: any, index: number, e: any) => {
        const { button } = e;
        // 右键
        if (button === 2) {
            await cellDropdownShow(item, index, true);
        }
    }

    // 删除表头事件
    const delTheadFn = async (index: number) => {
        const { id } = theadData[index];
        try {
            const { code } = await delThead(id);
            if (code === 200) {
                await getInitData(id);
            }
        } catch (error) {
            console.error(error);
        }
    }

    // 显示或者隐藏表头事件
    const showOrhideThead = async (index: number) => {
        theadData[index].isHide = Number(!theadData[index].isHide || true);
        try {
            const { code } = await saveFieldThead({...theadData[index]});
            if (code === 200) {
                await getInitData(theadData[index].sheetInfoId)
            }
        } catch (error) {
            console.error(error);
        }
    }

    // 删除单元格 行
    const delCellFn = async (item: any) => {
        try {
            const { code } = await delCellRow([item]);
            if (code === 200) {
                await getInitData(item.fieldId);
            }
        } catch (error) {
            console.error(error);
        }
    }

    // 控制表头弹出框的显隐
    async function dropdownShow(index: number, isRight: boolean) {
        theadData[index].dropDownVisible = !theadData[index].dropDownVisible;
        theadData[index].isRight = !theadData[index].isRight;
        form.setFieldsValue({
            ...theadData[index]
        })
        setThead([...theadData]);
    }

    // 控制单元格弹出框的显隐
    async function cellDropdownShow(item: any, index: number, isRight: boolean) {
        rowCount[index].find((i: { fieldId: number; }) => i.fieldId === item.fieldId).isRight = isRight;
        setRowCount([...rowCount]);
    }

    // 修改表头数据后提交
    const submitTabelHead = (index: number) => {
        form.validateFields().then(async v => {
            const { chineseFieldName, fieldType } = v;
            theadData[index].chineseFieldName = chineseFieldName;
            theadData[index].dropDownVisible = false;
            const res = await saveFieldThead({
                chineseFieldName,
                fieldType,
                sheetInfoId: JSON.parse(localStorage.getItem('tableInfo')!).sheetId,
                id: theadData[index].id,
            })
            setThead([...theadData]);
        })
    };

    // 表头点击出来的弹框内容
    const menu = (index: number) => (
        <div>
            <Form {...layout} form={form} onClick={e => e.preventDefault()}>
                <Form.Item name="chineseFieldName" label="标题" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="fieldType" label="字段类型" rules={[{ required: true }]}>
                    <Select
                        placeholder="选择字段类型"
                        allowClear
                    >
                        <Option value="0">文本</Option>
                        <Option value="1">关联</Option>
                    </Select>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button htmlType="button" onClick={() => { theadData[index].dropDownVisible = false; setThead([...theadData]); }}>
                        取消
                    </Button>
                    <Button type="primary" onClick={() => submitTabelHead(index)}>
                        确定
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );

    const rightMenu = (index: number) => (
        <div className="box-column-resizable-rightBox">
            <Space>
                <Button onClick={() => delTheadFn(index)}>删除字段/列</Button>
                <Button onClick={() => showOrhideThead(index)}>隐藏字段/列</Button>
            </Space>
        </div>
    )

    // 选中单元格
    const choseCell = (e: any) => {
        const args = Array.from(document.getElementsByClassName('react-resizable'));
        args.forEach((element: any) => {
            element.style.borderColor = '';
        });
        e.target.style.borderColor = '#3370ff';
    }

    return (
        <div className="box">
            <div>
                <div className="box-column-resizable">
                    {
                        theadData?.map((item: any, index: number) => {
                            return (
                                <div
                                    onMouseDown={() => mouseDownFn(index, event)}
                                    key={item.chineseFieldName}>
                                    <Dropdown
                                        overlay={() => { return item.isRight ? rightMenu(index) : menu(index) }}
                                        trigger={['click']}
                                        onVisibleChange={async () => {
                                            await dropdownShow(index, false);
                                        }}
                                        visible={item.dropDownVisible}>
                                        <a className="ant-dropdown-link"
                                            onClick={e => { e.preventDefault(); }}>
                                            <ResizableBox
                                                width={70}
                                                height={40}
                                                draggableOpts={{}}
                                                minConstraints={[70, 40]}
                                                maxConstraints={[300, 40]}>
                                                <span>{item.chineseFieldName}</span>
                                            </ResizableBox>
                                        </a>
                                    </Dropdown>
                                </div>
                            )
                        })
                    }
                </div>

                <div>
                    {
                        rowCount.map((item: any, index: number) => (
                            <div className="box-row-resizable" key={index}>
                                {
                                    item?.map((ite: any, idx: number) => {
                                        return (
                                            <div
                                                key={ite.id || ite.key}
                                                onMouseDown={() => cellOnMouseDown(item.find((i: any) => i.fieldId === theadData[idx]?.id), index, event)}
                                                onDoubleClick={() => editCell(item.find((i: any) => i.fieldId === theadData[idx]?.id), index)}
                                                onClick={choseCell}
                                            >
                                                <Dropdown
                                                    overlay={() => {
                                                        return <div className="box-column-resizable-rightBox">
                                                            <Button onClick={() => delCellFn(item.find((i: any) => i.fieldId === theadData[idx]?.id))}>删除记录/行</Button>
                                                        </div>
                                                    }}
                                                    trigger={['click']}
                                                    onVisibleChange={async () => {
                                                        await cellDropdownShow(item.find((i: any) => i.fieldId === theadData[idx]?.id), index, false);
                                                    }}
                                                    visible={ite.isRight}>
                                                    <a className="ant-dropdown-link"
                                                        onClick={e => { e.preventDefault(); }}>
                                                        <ResizableBox

                                                            width={70}
                                                            height={40}
                                                            draggableOpts={{}}
                                                            minConstraints={[70, 40]}
                                                            maxConstraints={[300, 40]}>
                                                            {
                                                                ite.isEdit ? <Input onBlur={(v) => submitCell(v, index, idx)} /> :
                                                                    <span>{item.find((i: any) => i.fieldId === theadData[idx]?.id)?.cellValue}</span>
                                                            }
                                                        </ResizableBox>
                                                    </a>
                                                </Dropdown>
                                            </div>
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
