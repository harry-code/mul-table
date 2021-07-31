import React from 'react';
import { Result } from 'antd';

interface Props {
    hasError: boolean
}

class ErrorBoundary extends React.Component<any, Props> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // 你同样可以将错误日志上报给服务器
  }
  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <Result
                status="warning"
                title="代码好像出现了一丢丢问题，请仔细排查下吧，奥里给！！！"
            />
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
