import BaseInfoMa from '~/assets/sider/baseInfoMa.svg';

export interface routes {
    [x: string]: any;
    title: string;
    path: string;
    icon?: string;
    breadcrumb?: string | JSX.Element;
    isLink?: boolean;
    routes?: routes[];
}

export interface bread {
    [propname: string]: any;
}

export const RoutesData: routes[] = [
    {
        title: '我是菜单1',
        path: '/base',
        icon: BaseInfoMa,
        routes: [
            {
                title: '菜单儿子1',
                path: '/info',
                isLink: true,
                routes: [
                    {
                        title: '新增库房',
                        path: '/base/warehouse/add',
                    },
                    {
                        title: '编辑库房',
                        path: '/base/warehouse/edit',
                    },
                ],
            },
            {
                title: '菜单儿子2',
                path: '/detail',
                isLink: true,
                routes: [
                    {
                        title: '新增材料类型',
                        path: '/base/materialType/add',
                    },
                    {
                        title: '编辑材料类型',
                        path: '/base/materialType/edit',
                    },
                ],
            },
            {
                title: '菜单儿子3',
                path: '/base/material',
                isLink: true,
                routes: [
                    {
                        title: '新增材料',
                        path: '/base/material/add',
                    },
                    {
                        title: '编辑材料',
                        path: '/base/material/edit',
                    },
                ],
            },
            {
                title: '菜单儿子4',
                path: '/base/pricing',
                isLink: true,
                routes: [
                    {
                        title: '新增调价',
                        path: '/base/pricing/add',
                    },
                    {
                        title: '编辑调价',
                        path: '/base/pricing/edit',
                    },
                    {
                        title: '调价记录详情',
                        path: '/base/pricing/recordDetail',
                    },
                    {
                        title: '调价详情',
                        path: '/base/pricing/applyDetail',
                    },
                    {
                        title: '审核签字',
                        path: '/base/pricing/pricingApplyNature',
                    },
                ],
            },
            {
                title: '菜单儿子5',
                path: '/base/supplier',
                isLink: true,
                routes: [
                    {
                        title: '新增供应商',
                        path: '/base/supplier/add',
                    },
                    {
                        title: '编辑供应商',
                        path: '/base/supplier/edit',
                    },
                ],
            },
        ],
    }
];
