import { Delete, Get, Post, Put } from '~/service/request';

/**
 * 获取已创建的表信息
 */
export const getTableInfo = async () => {
    return await Get('/api/rest/mutipate/excel/listTabe');
};

/**
 * 创建表，更新表
 */
export const saveOrUpdateTableInfo = async (data: any) => {
    return await Post('/api/rest/mutipate/excel/saveTable', data);
};
