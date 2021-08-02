import { Delete, Get, Post, Put } from '~/service/request';

/**
 * 登录
 */
export const LoginIn = async (data: any) => {
    return await Post('/api/sys/login/login', data);
};

/**
 * 用户列表
 */
export const getUsers = async () => {
    return await Post('/api/rest/sys/user/listUserByParam', {});
};
