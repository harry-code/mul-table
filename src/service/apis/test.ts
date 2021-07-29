import { Delete, Get, Post, Put } from '~/service/request';

export const List = async (data: any) => {
    return await Post('/rest/basic/material/list', data);
};

export const ADD = async (data: any) => {
    return await Post('/rest/basic/material/save', data);
};

export const DELETE = async (id: string) => {
    return await Delete('/rest/basic/material/remove/' + id, {});
};

export const EDIT = async (data: any) => {
    return await Put('/rest/basic/material/update', data);
};

export const INFO = async (id: string) => {
    return await Get('/rest/basic/material/info/' + id, {});
};