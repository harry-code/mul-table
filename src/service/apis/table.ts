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


/**
 * 创建sheet，更新sheet
 */
 export const saveOrUpdateSheetInfo = async (data: any) => {
    return await Post('/api/rest/mutipate/excel/saveSheet', data);
};

/**
 * 根据登录人id和table_info_id查看sheel_info概要信息（名称和ID）
 */
 export const getSheetInfo = async (id: string) => {
    return await Get('/api/rest/mutipate/excel/listSummartVO/' + id);
};

