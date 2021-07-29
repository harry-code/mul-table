import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
    Form, Input, InputNumber, Mentions,
    Radio, Select, Switch, TimePicker,
    Transfer, TreeSelect, Space,
    Button, DatePicker
} from 'antd';
import Upload from '~/components/common/upload/index'

// 受控组件的陈述
export const nodes: { [key: string]: (props?: any) => JSX.Element } = {
    'input': (props: any) => <Input {...props} />,
    'inputNumber': (props: any) => <InputNumber {...props} />,
    'radio': (props: any) => <Radio.Group>{props?.map((i: { value: any; name: React.ReactNode; }) => {
        return <Radio value={i.value} key={i.value}>{i.name}</Radio>
    })}</Radio.Group>,
    'select': (props: any) => <Select>{props?.map((i: { value: any; name: React.ReactNode; }) => {
        return <Select.Option value={i.value} key={i.value}>{i.name}</Select.Option>
    })}</Select>,
    'switch': () => <Switch />,
    // 'treeSelect': <TreeSelect />,
    'datePicker': () => <DatePicker />,
    'timePicker': () => <TimePicker />,
    // 'transfer': <Transfer />,
    'upload': () => <Upload />,
}

interface props {
    formItems: any[]; // form项的渲染
    formData?: {}; // form的数据
    getParams: (data: Object) => void; // form参数获取
    formStyle?: { [key: string]: string }; // form的样式
    formBtns?: {
        name: string;
        tapType: string;
    }[]; // form的按钮们
    renderProps?: (props?: any) => JSX.Element // 增加额外的按钮
}
// 默认垂直布局form
export default function FormComp({
    formItems,
    formStyle,
    getParams,
    formBtns = [],
    formData,
    renderProps = () => <></>,
}: props) {
    const [form] = Form.useForm();
    const history = useHistory();
    // 反显form数据
    useEffect(() => {
        if (formData) {
            form.setFieldsValue(formData)
        }
    }, [formData])
    // 按钮事件的陈述
    const onFinish = () => {
        form.validateFields().then(() => {
            const values = form.getFieldsValue()
            getParams(values)
        })
    };

    const resetForm = () => {
        form.resetFields()
    };

    const backFn = () => {
        history.goBack()
    };

    // 按钮事件的映射
    const btnClicks: { [key: string]: (v: any) => void } = {
        'submit': onFinish,
        'reset': resetForm,
        'back': backFn
    }

    return (
        <Form
            {...formStyle}
            form={form}
        >
            {
                formItems?.map((i: any) => {
                    return (
                        <Form.Item
                            key={i.name}
                            label={i.label}
                            name={i.name}
                            rules={[{ required: i.required, message: i.message }]}
                        >
                            {nodes[i.type](i.options)}
                        </Form.Item>
                    )
                })
            }

            <Form.Item>
                <Space>
                    {
                        formBtns.map((i) => {
                            const isSub = i.tapType === 'submit'
                            return <Button key={i.name}
                                type={isSub ? 'primary' : 'default'}
                                onClick={btnClicks[i.tapType]}>{i.name}</Button>
                        })
                    }
                    {/* 渲染额外的btn */}
                    {renderProps(12)}
                </Space>
            </Form.Item>
        </Form>
    )
}