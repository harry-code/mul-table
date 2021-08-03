import React, { forwardRef, useRef } from 'react';
import { Input } from 'antd';
import TableItem from './components/table-item/index';
import './index.less'

const { Search } = Input;
const TableItemRef = forwardRef((props, ref) => {
  return <TableItem cRef={ref} />
})

function Sider() {
  const tableRef = useRef(null);
  const onSearch = (value: string) => {
    const { filterData } = tableRef.current;
    filterData(value);
  }
  return (
    <div className="sider">
      <Search placeholder="搜索数据表" onSearch={onSearch} className="sider-search" />
      <TableItemRef ref={tableRef} />
    </div>
  )
}

export default Sider;