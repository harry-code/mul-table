import { Get, Post } from '~/service/request';
import { API_URL } from '~/service/request'

// 检查文件md5
export const md5FileCheck = async (md5: string) => {
    return await Get('/web/api/v1.0/upload/chunk/' + md5 + '?identifier=' + md5 + '&filename=file');
};

// 创建上传任务
export const createFileUpload = async (data: any) => {
    return await Post('/web/api/v1.0/upload/createTask', data);
};

// 上传分片
export const UploadUrl = (md5: any) => {
    return API_URL.production + '/web/api/v1.0/upload/chunk/' + md5;
};