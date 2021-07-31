import React, { useEffect, useState } from 'react';
import { Input, Space } from 'antd';
import { useHistory } from 'react-router-dom';
import TableItem from './components/table-item/index';
import './index.less'

const { Search } = Input;

function Sider() {
  const onSearch = (value: any) => console.log(value);
  return (
    <div className="sider">
      <Search placeholder="搜索数据表" onSearch={onSearch} className="sider-search" />
      <TableItem />
    </div>
  )
}

export default Sider;