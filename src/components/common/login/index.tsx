import React, { useEffect } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { LoginIn } from '~/service/apis/user';
import { useHistory } from 'react-router-dom';
import './index.less'

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};


function Login() {
    useEffect(() => {
        const socket = new WebSocket('ws://121.196.179.144:8083/api/rest/websocket');
        socket.addEventListener('open', () => {
            socket.send('Hello Server!');
        })

        socket.addEventListener('message', (event) => {
            console.log('Message from server ', event.data);
        })
    }, [])
    const history = useHistory();
    const onFinish = async (values: any) => {
        try {
            const { code, data: { token, userInfo }, msg } = await LoginIn(values)
            if (code === 200) {
                localStorage.setItem('token', token);
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                message.success('登录成功', 2, () => {
                    history.push('/');
                })
            }
        } catch (error) {
            console.error(error)
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="login-wrapper">
            <Form
                {...layout}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                className="login-wrapper-form"
            >
                <Form.Item
                    label="用户名"
                    name="username"
                    rules={[{ required: true, message: '请输入用户名!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="密码"
                    name="password"
                    rules={[{ required: true, message: '请输入密码!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                    <Checkbox>记住密码</Checkbox>
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        登录
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Login