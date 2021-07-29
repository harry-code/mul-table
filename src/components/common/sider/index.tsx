import React, { useState } from 'react';
import { Menu } from 'antd';
import { RoutesData, routes } from '~/routes';
import { useHistory } from 'react-router-dom';
import './index.less'

const { SubMenu } = Menu;

function Sider() {
  const history = useHistory();
  // const [rootSubmenuKeys, setKeys] = useState(RoutesData?.map((item: any) => {
  //   // item为数组当前的元素
  //   return item.path;
  // }))

  const handleClick = (e: any) => {
    history.push(e.key)
  }
  // const onOpenChange = (keys: any[]) => {
  // console.log('keys', keys)
  //   const latestOpenKey = keys.find((key: any) => this.state.openKeys.indexOf(key) === -1);
  //   if (this.state.rootSubmenuKeys?.indexOf(latestOpenKey) === -1) {
  //     this.setState({
  //       openKeys: keys
  //     })
  //   } else {
  //     this.setState({
  //       openKeys: latestOpenKey ? [latestOpenKey] : []
  //     })
  //   }
  // };
  return (
    <>
      <Menu mode="inline"
        className="sider"
        onClick={handleClick}
        // openKeys={this.state.openKeys}
        // onOpenChange={onOpenChange}
        style={{ width: 256 }}>
        {RoutesData?.map((item: routes, index: number) => {
          return (
            <SubMenu
              key={item?.path}
              title={
                <span>
                  <img
                    src={item.icon}
                    alt="icon"
                    className="submenuIcon"
                  />
                  <span>{item?.title}</span>
                </span>
              }>
              {item.routes?.map((ite: { path: string; title: React.ReactNode; }, ind: any) => {
                return <Menu.Item key={ite.path}>{ite.title}</Menu.Item>;
              })}
            </SubMenu>
          );
        })}
      </Menu>
    </>
  )
}

export default Sider;