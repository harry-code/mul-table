import { Delete, Get, Post, Put } from '~/service/request';

export const LoginIn = async (data: any) => {
    return await Post('/api/sys/login/login', data);
};
