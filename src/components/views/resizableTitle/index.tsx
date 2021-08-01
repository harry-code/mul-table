import React, { useEffect, useState } from 'react';
import { Dropdown, Input, Form, Select, Button } from 'antd';
import { ResizableBox } from 'react-resizable';
import {
    saveFieldThead,
    getSheetThead,
    saveOrUpdateLineInfo,
    saveOrUpdateLinesInfo,
    getSheetInfoExcludeThead,
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
    const ROW_COUNT = 9999;
    const [form] = Form.useForm();
    const [theadData, setThead] = useState<any>([]);
    const [rowCount, setRowCount] = useState<any>([]);

    useEffect(() => {
        (async function () {
            try {
                const sheetId = JSON.parse(localStorage.getItem('tableInfo')!).sheetId;
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
                        if (res.length === 0) {
                            break
                        }
                        _arry.push(res)
                    }
                    setRowCount([..._arry]);
                }
            } catch (error) {
                console.error(error);
            }
        })()
    }, [])
    // 新增一列
    const addColumn = async () => {
        const sheetId = JSON.parse(localStorage.getItem('tableInfo')!).sheetId;
        let _arry = theadData.concat({
            chineseFieldName: `未命名` + (theadData.length + 1),
            dropDownVisible: false,
        })
        setThead(_arry)
        const listLineInfoDTO = rowCount.length > 0 ? rowCount.map((ite: any, index: number) => {
            return {
                cellValue: '',
                fieldId: '',
                id: '',
                lineNum: index + 1, // 行数
                sheetId,
            }
        }) : [];
        if (rowCount.length > 0) {
            for (let i = 0; i < listLineInfoDTO.length; i++) {
                rowCount[i].push(listLineInfoDTO[i]);
            }
            console.log('rowCount', rowCount)
            setRowCount([...rowCount]);
        }
        const { code } = await saveFieldThead({
            chineseFieldName: `未命名` + (theadData.length + 1),
            sheetInfoId: sheetId,
            listLineInfoDTO,
        })
        if (code === 200) {
            const { code, data } = await getSheetThead(sheetId);
            if (code === 200) {
                setThead(data)
            }
        }
    }

    // 新增一行
    const addRow = () => {
        // 新增一行
        let params = theadData.map((item: any) => ({
            cellValue: '',
            fieldId: item.id,
            lineNum: rowCount.length + 1, // 行数
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
            const sheetInfo = await getSheetInfoExcludeThead(sheetId);
            if (sheetInfo.code === 200) {
                const { data } = sheetInfo;
                let _arry = [];
                for (let i = 1; i < ROW_COUNT; i++) {
                    const res = data.filter((item: any) => item.lineNum === i);
                    if (res.length === 0) {
                        break
                    }
                    _arry.push(res)
                }
                setRowCount([..._arry]);
            }
        }
    }

    // 双击编辑单元格
    const editCell = (index: number, idx: number) => {
        rowCount[index][idx].isEdit = true;
        setRowCount([...rowCount]);
        // const cell_obj = rowCount[index][idx];
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

    // 记录鼠标事件
    const mouseDownFn = (e: { button: any; }) => {
        const { button } = e;
        if (button === 2) {

        } else if (button === 0) {
            // alert("你点了左键");
        } else if (button === 1) {
            // alert("你点了滚轮");
        }
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
                                <div onMouseDown={mouseDownFn} key={item.chineseFieldName}>
                                    <Dropdown
                                        overlay={() => menu(index)}
                                        trigger={['click']}
                                        onVisibleChange={(e) => {
                                            theadData[index].dropDownVisible = e;
                                            form.setFieldsValue({
                                                ...theadData[index]
                                            })
                                            setThead([...theadData]);
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
                            <div className="box-row-resizable" key={index} >
                                {
                                    item?.map((ite: any, idx: number) => {
                                        return (
                                            <div
                                                onDoubleClick={() => editCell(index, idx)}
                                                onClick={choseCell}
                                            >
                                                <ResizableBox
                                                    key={ite.id}
                                                    width={70}
                                                    height={40}
                                                    draggableOpts={{}}
                                                    minConstraints={[70, 40]}
                                                    maxConstraints={[300, 40]}>
                                                    {
                                                        ite.isEdit ? <Input onBlur={(v) => submitCell(v, index, idx)} /> : <span>{ite.cellValue}</span>
                                                    }
                                                </ResizableBox>
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
