import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Select } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { getUsers } from '~/service/apis/user';
import { shareSheet } from '~/service/apis/table';
import './index.less'

const { Option } = Select;

function Header() {
  const [visible, setVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedIds, setIds] = useState([]);
  const history = useHistory();
  const sheetId = JSON.parse(localStorage.getItem('tableInfo')!)?.sheetId
  if (!localStorage.getItem('token')) {
    history.push('/login')
  }
  useEffect(() => {
    (async function () {
      try {
        const { data, code } = await getUsers();
        if (code === 200) {
          setUsers(data)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [])

  function handleChange(value: []) {
    setIds(value)
  }
  /**
   * 分享sheet
   */
  const shareSheetFn = async () => {
    if (selectedIds.length === 0) {
      return
    }
    try {
      const params = selectedIds.map(userId => (
        {
          sheetId,
          userId,
        }
      ))
      const { code } = await shareSheet(params)
      if (code === 200) {
        setVisible(false);
      }
    } catch (error) {
      console.error(error)
    }
  }
  const menu = (
    <div>
      <Select
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
        placeholder="请选择"
        defaultValue={[]}
        onChange={handleChange}
      >
        {
          users?.map((item: { userId: number; nickname: string }) => (
            <Option value={item.userId}>{item.nickname}</Option>
          ))
        }
      </Select>
      <Button type="primary" onClick={shareSheetFn}>确定</Button>
    </div>
  );
  return (
    <div className="header">
      <div>
        <img src="~/assets/favicon.png" alt="" />
      </div>
      <Dropdown
        onVisibleChange={(e) => {
          setVisible(e);
        }}
        visible={visible}
        overlay={menu}
        trigger={['click']}>
        <Button type="primary">
          <LinkOutlined />
          分享
        </Button>
      </Dropdown>
    </div>
  )
}

export default Header