import React, { useState, useEffect } from 'react';
import { Input, Popover, Collapse, Modal, Tooltip } from 'antd';
import {
  PlusSquareOutlined,
  FormOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  ProfileOutlined,
  EllipsisOutlined,
  PlusOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import {
  saveOrUpdateTableInfo,
  saveOrUpdateSheetInfo,
  getTableInfo,
} from '~/service/apis/table';
import Pubsub from 'pubsub-js';
import './index.less'

const { confirm } = Modal;
const { Panel } = Collapse;

export default ({ }) => {
  const [tableItems, setTableItems] = useState<any[]>([]);
  useEffect(() => {
    getTableInfoFn();
  }, [])

  /**
   * 获取当前用户拥有的表格
   */
  const getTableInfoFn = async () => {
    try {
      const { code, data } = await getTableInfo();
      if (code === 200) {
        setTableItems(data);
        Pubsub.publish('tableInfo', { ...data[0]?.listSheetInfoSummartVO[0], tableName: data[0].name });
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
    tableItems[first]['listSheetInfoSummartVO'][i].actionVisible = !tableItems[first]['listSheetInfoSummartVO'][i].actionVisible;
    setTableItems([...tableItems]);
  }

  // 重命名表格
  const rename = (i: number) => {
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
    tableItems[first].listSheetInfoSummartVO[i].actionVisible = !tableItems[first].listSheetInfoSummartVO[i].actionVisible;
    tableItems[first].listSheetInfoSummartVO[i].renameFlag = !tableItems[first].listSheetInfoSummartVO[i].renameFlag;
    setTableItems([...tableItems]);
    setTimeout(() => {
      // tableItems[i].inputRef.current!.focus({
      //   cursor: 'all',
      // });
    }, 0)
  }

  // 新增表
  const addTable = async () => {
    // let _arry: any = tableItems.concat([{
    //   name: '未命名数据表' + (tableItems.length + 1),
    //   actionVisible: false,
    //   renameFlag: false,
    // sheets: [
    //   {
    //     sheetName: '任务表1',
    //     actionVisible: false,
    //     renameFlag: false,
    //   }
    // ]
    // }])

    try {
      const { code } = await saveOrUpdateTableInfo({
        name: '未命名数据表' + (tableItems.length + 1)
      })
      if (code === 200) {
        await getTableInfoFn();
      }
    } catch (error) {
      console.error(error);
    }

  }

  // 新增sheet
  const addSheet = async (i: number) => {
    const params = {
      sheetName: '任务表' + (tableItems[i].listSheetInfoSummartVO.length + 1),
      tableInfoId: tableItems[i].id
    }
    try {
      const { code } = await saveOrUpdateSheetInfo(params)
      if (code === 200) {
        tableItems[i].listSheetInfoSummartVO = tableItems[i].listSheetInfoSummartVO || [];
        tableItems[i].listSheetInfoSummartVO.push(params);
        setTableItems([...tableItems]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // 删除表
  const delTable = (i: number) => {
    confirm({
      title: `删除数据表`,
      centered: true,
      maskClosable: true,
      icon: <ExclamationCircleOutlined />,
      content: `确认要删除数据表 ${tableItems[i].name} 吗？`,
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

  // 选中sheet
  const choseSheet = (e: any) => {
    const { index, idx } = e.target.dataset;
    const args = Array.from(document.getElementsByClassName('table-item-collapse-sheet'));
    args.forEach((element: any) => {
      element.style.background = 'inherit';
    });
    e.currentTarget.style.background = 'rgba(31, 35, 41, 0.1)';
    const jsonData = {
      tableInfoId: tableItems[index].id,
      tableName: tableItems[index].name,
      sheetId: tableItems[index].listSheetInfoSummartVO[idx].sheetId,
      sheetName: tableItems[index].listSheetInfoSummartVO[idx].sheetName,
    };
    localStorage.setItem('tableInfo', JSON.stringify(jsonData));
    Pubsub.publish('tableInfo', jsonData);
  }

  const content = (i: number) => (
    <ul>
      <li onClick={(event) => {
        rename(i)
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
        defaultActiveKey={['']}
        ghost={true}
        onChange={callback}>
        {
          tableItems?.map((item: any, index: number) => {
            return (
              <Panel
                header={
                  item.renameFlag ? <Input
                    onBlur={async (v) => {
                      tableItems[index].renameFlag = !tableItems[index].renameFlag;
                      tableItems[index].name = v.target.defaultValue;
                      console.log('tableItems', tableItems)
                      try {
                        const { code } = await saveOrUpdateTableInfo({
                          name: v.target.defaultValue,
                          id: tableItems[index].id
                        })
                        if (code === 200) {
                          setTableItems([...tableItems])
                        }
                      } catch (error) {
                        console.error(error);
                      }
                    }}
                    defaultValue={item.name}
                    className="table-item-wrapper-table"
                    width={120}
                  /> : <span className="table-item-wrapper-table">{item.name}</span>
                }
                className={item.actionVisible ? 'ant-collapse-header-active' : ''}
                key={item.name} extra={item.renameFlag ? null :
                  <>
                    <Tooltip title="新增sheet">
                      <PlusSquareOutlined
                        onClick={event => {
                          event.stopPropagation();
                          addSheet(index);
                        }}
                        className={item.actionVisible ? '' : "table-item-collapse-headerIcon"} />
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
                  </>}>

                {
                  item?.listSheetInfoSummartVO?.map((ite: any, idx: number) => {
                    return (
                      <div
                        className="table-item-collapse-sheet"
                        key={ite.sheetName}
                        data-index={index}
                        data-idx={idx}
                        onClick={choseSheet}>
                        <div>
                          <ProfileOutlined />
                          {
                            ite.renameFlag ? <Input
                              onBlur={async (v) => {
                                tableItems[index].listSheetInfoSummartVO[idx].renameFlag = !tableItems[index].listSheetInfoSummartVO[idx].renameFlag;
                                tableItems[index].listSheetInfoSummartVO[idx].sheetName = v.target.defaultValue;
                                try {
                                  const { code } = await saveOrUpdateSheetInfo({
                                    sheetName: v.target.defaultValue,
                                    tableInfoId: tableItems[index].id,
                                    id: ite.sheetId
                                  })
                                  if (code === 200) {
                                    setTableItems([...tableItems]);
                                  }
                                } catch (error) {
                                  console.error(error);
                                }
                              }}
                              defaultValue={ite.sheetName}
                              className="table-item-wrapper-table"
                              width={120}
                            /> : <span
                              className="table-item-collapse-sheet-name"
                              data-index={index}
                              data-idx={idx}>{ite.sheetName}</span>
                          }
                        </div>
                        {/* 操作的气泡 */}
                        <div className="table-item-collapse-sheet-icon">
                          <Popover
                            visible={ite.actionVisible}
                            placement="bottom"
                            content={() => sheetContent(index, idx)}
                            onVisibleChange={() => handleSheetVisibleChange(index, idx)}
                            trigger="click">
                            <EllipsisOutlined
                              onClick={event => {
                                event.stopPropagation();
                              }}
                              className={!ite.renameFlag ? '' : "table-item-collapse-headerIcon"}
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