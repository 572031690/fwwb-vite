const files = import.meta.globEager('../../assets/img/home/*.png')
const modules: any = {}
for (const key in files) {
    const keys: string = key.replace(/(\.\/module\/|\.png)/g, '') // 去除末尾的.png
    modules[keys.substring(keys.lastIndexOf('/') + 1)] = files[key].default
}
// 接口定义只能定义对象最外部不能使用[]来表示数组，只能通过[index: number]:{}来定义数组
// interface routerType {
//     [index: number]: {
//         type: string
//         index: number
//         path: string
//         label: string
//         ref: string
//         disabled: boolean
//         imgSrc: string
//         showtab: boolean
//         arrowRef?: string
//         navSonShow?: boolean
//         imgtips?: string
//         permissionName?: number | string
//         childrenList: ({
//             index: number
//             permissionName: string
//             path: string
//             label: string
//             ref: string
//             disabled: boolean
//             showtab: boolean
//             imgSrc: string
//         })[]
//     }
//     length:number
// }
export const routerList: {
    type: string
    index: number
    path: string
    label: string
    ref: string
    disabled: boolean
    imgSrc: string
    showtab: boolean
    arrowRef?: string
    navSonShow?: boolean
    imgtips?: string
    permissionName?: number | string
    childrenList: {
        index: number
        permissionName: string
        path: string
        label: string
        ref: string
        disabled: boolean
        showtab: boolean
        imgSrc: string
    }[]
}[] = [
    {
        type: 'router',
        index: 1,
        permissionName: 0,
        path: '/home/homewel',
        label: '首页',
        ref: 'spans1',
        disabled: false,
        imgSrc: modules.homeimg,
        showtab: true,
        childrenList: [],
    },
    {
        type: 'router',
        index: 7,
        permissionName: 'echart:monthsale',
        path: '/home/driver',
        label: '数据驾驶舱',
        ref: 'spans9',
        disabled: false,
        imgSrc: modules.driver,
        showtab: false,
        childrenList: [],
    },
    {
        type: 'tips',
        index: 2,
        path: '',
        label: '申报管理',
        ref: 'spans2',
        arrowRef: 'tipsarrowsee',
        navSonShow: true,
        disabled: true,
        imgSrc: modules.item,
        imgtips: modules.arrow,
        showtab: false,
        childrenList: [
            {
                index: 21,
                permissionName: 'needer:addNeed',
                path: '/home/need',
                label: '需求申报',
                ref: 'spans7',
                disabled: false,
                showtab: false,
                imgSrc: modules.body,
            },
            {
                index: 22,
                permissionName: 'buyer:addBuy',
                path: '/home/buy',
                label: '采购申报',
                ref: 'spans5',
                disabled: false,
                showtab: false,
                imgSrc: modules.buy,
            },
        ],
    },
    {
        type: 'tips',
        index: 3,
        path: '',
        label: '审批管理',
        ref: 'spans10',
        disabled: true,
        arrowRef: 'tipsarrowappro',
        navSonShow: true,
        imgSrc: modules.approal,
        imgtips: modules.arrow,
        showtab: false,
        childrenList: [
            {
                index: 31,
                permissionName: 'needManager:findHistory',
                path: '/home/need',
                label: '审批需求',
                ref: 'spans11',
                disabled: false,
                showtab: false,
                imgSrc: modules.body,
            },
            {
                index: 32,
                permissionName: 'buyManager:findHistory',
                path: '/home/buy',
                label: '审批订单',
                ref: 'spans12',
                disabled: false,
                showtab: false,
                imgSrc: modules.buy,
            },
        ],
    },
    {
        type: 'router',
        index: 4,
        permissionName: 100,
        path: '/home/department',
        label: '部门管理',
        ref: 'spans3',
        disabled: false,
        imgSrc: modules.department,
        showtab: false,
        childrenList: [],
    },
    {
        type: 'router',
        index: 5,
        permissionName: 'item:addItem',
        path: '/home/item',
        label: '基础数据',
        ref: 'spans14',
        disabled: false,
        imgSrc: modules.material,
        showtab: false,
        childrenList: [],
    },
    {
        type: 'router',
        index: 6,
        permissionName: 'admin:userlist',
        path: '/home/user',
        label: '用户信息',
        ref: 'spans8',
        disabled: false,
        imgSrc: modules.user,
        showtab: false,
        childrenList: [],
    },
    {
        type: 'router',
        index: 9,
        permissionName: 0,
        path: '/home/warehouse',
        label: '物料仓库',
        ref: 'spans16',
        disabled: false,
        imgSrc: modules.warehouse,
        showtab: true,
        childrenList: [],
    },
    {
        type: 'router',
        index: 13,
        permissionName: 'admin:listPerm',
        path: '/home/permission',
        label: '权限管理',
        ref: 'spans19',
        disabled: false,
        imgSrc: modules.permission,
        showtab: true,
        childrenList: [],
    },
    {
        type: 'router',
        index: 10,
        permissionName: 'admin:listRole',
        path: '/home/role',
        label: '角色管理',
        ref: 'spans17',
        disabled: false,
        imgSrc: modules.role,
        showtab: true,
        childrenList: [],
    },
    {
        type: 'router',
        index: 11,
        permissionName: 'storekeeper:findInRepositoryList',
        path: '/home/contrstock',
        label: '仓库管理',
        ref: 'spans18',
        disabled: false,
        imgSrc: modules.controlstock,
        showtab: true,
        childrenList: [],
    },
    {
        type: 'router',
        index: 8,
        permissionName: 0,
        path: '/home/personal',
        label: '个人中心',
        ref: 'spans15',
        disabled: false,
        imgSrc: modules.personal,
        showtab: true,
        childrenList: [],
    },
]
export const staticRoute = [0,'echart:monthsale','needer:addNeed']
