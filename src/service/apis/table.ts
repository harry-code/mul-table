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

/**
 * 保存/更新field数据
 */
export const saveFieldThead = async (data: any) => {
    return await Post('/api/rest/mutipate/excel/saveField', data);
};

/**
 * 查询表头字段集合
 */
export const getSheetThead = async (id: string) => {
    return await Get('/api/rest/mutipate/excel/listFieldInfoVO/' + id);
};

/**
 * 保存/更新sheet的单元格数据
 */
export const saveOrUpdateLineInfo = async (data: any) => {
    return await Post('/api/rest/mutipate/excel/saveLineInfo', data);
};

/**
 * 批量 保存/更新sheet的单元格数据
 */
export const saveOrUpdateLinesInfo = async (data: any) => {
    return await Post('/api/rest/mutipate/excel/batchSaveLineInfo', data);
};

/**
 * sheetId查询这个sheet中的所有数据
 */
export const getSheetInfoExcludeThead = async (id: string) => {
    return await Get('/api/rest/mutipate/excel/listLineInfoVO/' + id);
};

/**
 * 删除表头，级联删除行数据
 */
export const delThead = async (id: string) => {
    return await Get('/api/rest/mutipate/excel/deleteField/' + id);
};


/**
 * 删除单元格一行数据
 */
export const delCellRow = async (data: any) => {
    return await Post('/api/rest/mutipate/excel/deleteLineInfo', data);
};

/**
 * 分享sheet
 */
export const shareSheet = async (data: any) => {
    return await Post('/api/rest/mutipate/excel/shareSheet', data);
};
