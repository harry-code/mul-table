import React, { useState, useEffect } from 'react';
import { Input, Popover, Collapse, Modal, Tooltip } from 'antd';
import {
  PlusSquareOutlined,
  MoreOutlined,
  FormOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  ProfileOutlined,
  EllipsisOutlined,
  PlusOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { saveOrUpdateTableInfo, getTableInfo } from '~/service/apis/table';
import './index.less'

const { confirm } = Modal;
const { Panel } = Collapse;

export default ({ }) => {
  const [tableItems, setTableItems] = useState<any[]>([])
  useEffect(() => {
    getTableInfoFn()
  }, [])

  const getTableInfoFn = async () => {
    try {
      const { code, data } = await getTableInfo();
      if (code === 200) {
        setTableItems(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function callback(key: any) {
    console.log(key);
  }

  // 打开一级菜单操作气泡框
  const handleVisibleChange = (i: number) => {
    tableItems[i].actionVisible = !tableItems[i].actionVisible;
    setTableItems([...tableItems]);
  }

  // 打开二级菜单操作气泡框
  const handleSheetVisibleChange = (first: number, i: number) => {
    tableItems[first]['sheets'][i].actionVisible = !tableItems[first]['sheets'][i].actionVisible;
    setTableItems([...tableItems]);
  }

  // 重命名表格
  const rename = (i: number, event: any) => {
    console.log('event', event);
    tableItems[i].actionVisible = !tableItems[i].actionVisible;
    tableItems[i].renameFlag = !tableItems[i].renameFlag;
    setTableItems([...tableItems]);
    setTimeout(() => {
      // tableItems[i].inputRef.current!.focus({
      //   cursor: 'all',
      // });
    }, 0)
  }

  // 重命名sheet
  const renameSheet = (first: number, i: number) => {
    tableItems[first].sheets[i].actionVisible = !tableItems[first].sheets[i].actionVisible;
    tableItems[first].sheets[i].renameFlag = !tableItems[first].sheets[i].renameFlag;
    setTableItems([...tableItems]);
    setTimeout(() => {
      // tableItems[i].inputRef.current!.focus({
      //   cursor: 'all',
      // });
    }, 0)
  }

  // 新增表
  const addTable = async () => {
    const _arry: any = tableItems.concat([{
      tableName: '未命名数据表' + (tableItems.length + 1),
      actionVisible: false,
      renameFlag: false,
      sheets: [
        {
          sheetName: '任务表1',
          actionVisible: false,
          renameFlag: false,
        }
      ]
    }])
    try {
      const { code } = await saveOrUpdateTableInfo({
        name: '未命名数据表' + (tableItems.length + 1)
      })
      if (code === 200) {
        setTableItems(_arry)
      }
    } catch (error) {
      console.error(error);
    }

  }

  // 新增sheet
  const addSheet = (i: number) => {
    tableItems[i].sheets.push(
      {
        sheetName: '任务表' + (tableItems[i].sheets.length + 1),
        actionVisible: false,
        renameFlag: false,
      }
    )
    setTableItems([...tableItems]);
  }

  // 删除表
  const delTable = (i: number) => {
    confirm({
      title: `删除数据表`,
      centered: true,
      maskClosable: true,
      icon: <ExclamationCircleOutlined />,
      content: `确认要删除数据表 ${tableItems[i].tableName} 吗？`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        tableItems.splice(i, 1);
        setTableItems([...tableItems]);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const content = (i: number) => (
    <ul>
      <li onClick={(event) => {
        rename(i, event)
        event.stopPropagation();
      }}>
        <FormOutlined />
        <span>重命名</span>
      </li>
      {
        tableItems.length > 1 ? <li
          onClick={() => delTable(i)}>
          <DeleteOutlined />
          <span>删除数据表</span>
        </li> : null
      }

    </ul >
  )

  const sheetContent = (first: number, i: number) => (
    <ul>
      <li onClick={(event) => {
        renameSheet(first, i)
        event.stopPropagation();
      }}>
        <FormOutlined />
        <span>重命名</span>
      </li>

      <li>
        <CopyOutlined />
        <span>复制sheet</span>
      </li>
      {
        tableItems.length > 1 ? <li
          onClick={() => delTable(i)}>
          <DeleteOutlined />
          <span>删除sheet</span>
        </li> : null
      }

    </ul >
  )

  return (
    <div className="table-item">
      <Collapse
        className="table-item-collapse"
        defaultActiveKey={['未命名数据表1']}
        ghost={true}
        onChange={callback}>
        {
          tableItems?.map((item, index) => {
            return (
              <Panel
                header={
                  item.renameFlag ? <Input
                    onBlur={(v) => {
                      tableItems[index].renameFlag = !tableItems[index].renameFlag;
                      tableItems[index].tableName = v.target.defaultValue;
                      setTableItems([...tableItems])
                    }}
                    defaultValue={item.name}
                    className="table-item-wrapper-table"
                    width={120}
                  /> : <span className="table-item-wrapper-table">{item.name}</span>
                }
                className={item.actionVisible ? 'ant-collapse-header-active' : ''}
                key={item.id} extra={item.renameFlag ? null : (
                  <>
                    <Tooltip title="新增sheet">
                      <PlusSquareOutlined
                        onClick={event => {
                          event.stopPropagation();
                          addSheet(index);
                        }}
                        className={item.actionVisible ? '' : "table-item-collapse-headerIcon"}
                        style={{ marginRight: '10px', fontSize: '20px' }} />
                    </Tooltip>

                    <Popover
                      visible={item.actionVisible}
                      placement="bottom"
                      onVisibleChange={() => handleVisibleChange(index)}
                      content={() => content(index)}
                      trigger="click">
                      <EllipsisOutlined
                        onClick={event => {
                          event.stopPropagation();
                        }}
                        className={item.actionVisible ? '' : "table-item-collapse-headerIcon"} />
                    </Popover>
                  </>)}>

                {
                  item?.sheets?.map((ite, idx) => {
                    return (
                      <div className="table-item-collapse-sheet" key={ite.sheetName}>
                        <div>
                          <ProfileOutlined />
                          {
                            ite.renameFlag ? <Input
                              onBlur={(v) => {
                                tableItems[index].sheets[idx].renameFlag = !tableItems[index].sheets[idx].renameFlag;
                                tableItems[index].sheets[idx].sheetName = v.target.defaultValue;
                                setTableItems([...tableItems])
                              }}
                              defaultValue={ite.sheetName}
                              className="table-item-wrapper-table"
                              width={120}
                            /> : <span className="table-item-collapse-sheet-name">{ite.sheetName}</span>
                          }
                        </div>
                        <div className="table-item-collapse-sheet-icon">
                          <Popover
                            visible={ite.actionVisible}
                            placement="bottom"
                            onVisibleChange={() => handleSheetVisibleChange(index, idx)}
                            content={() => sheetContent(index, idx)}
                            trigger="click">
                            <EllipsisOutlined
                              onClick={event => {
                                event.stopPropagation();
                              }}
                              className={ite.actionVisible ? '' : "table-item-collapse-headerIcon"}
                            />
                          </Popover>

                        </div>
                      </div>
                    )
                  })
                }
              </Panel>
            )
          })
        }

      </Collapse>

      <div className="table-item-add" onClick={addTable}>
        <PlusOutlined />
        <span>新建数据表</span>
      </div>
    </div>
  )
}