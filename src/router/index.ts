import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";
import { ElMessage } from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'


const routes: RouteRecordRaw[] = [
    {
        path: "/index",
        name: "index",
        component: () => import("@/views/index.vue"),
    },
    { path: '/login', component: () => import("@/views/Login.vue"), name: 'login' },
    {
        path: '/home', component: () => import("@/views/home/Home.vue"), name: 'home', children: [
            {
                path: 'user',
                component: () => import('@/views/home/User.vue'),
                meta: { title: '用户信息', isTab: true }
            },
            {
                path: 'need',
                component: () => import('@/views/home/need.vue')
            },
            {
                path: 'permission',
                component: () => import('@/views/home/permission.vue')
            },
            {
                path: 'personal',
                component: () => import('@/views/home/personal.vue')
            },
            {
                path: 'item',
                component: () => import('@/views/home/Item.vue')
            },
            {
                path: 'buy',
                component: () => import('@/views/home/Buy.vue')
            },
            {
                path: 'homewel',
                component: () => import("@/views/home/HomeWel.vue")
            },
            // {
            //     path: 'department',
            //     component: () => import('@/views/home/Department.vue')
            // },
            {
                path: 'driver',
                component: () => import('@/views/home/Driver.vue')
            },
            {
                path: 'contrstock',
                component: () => import('@/views/home/ControlStock.vue')
            },
            {
                path: 'role',
                component: () => import('@/views/home/Role.vue')
            },
            {
                path: 'warehouse',
                component: () => import('@/views/home/Warehouse.vue')
            },
            {
                path: '',
                redirect: '/home/homewel'
            }
        ]
    },
    { path: '', redirect: '/login' } // 默认跳转路由
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    // 路由守卫，类似java服务器端编写过滤器
    const store = window.sessionStorage.getItem('storeData') // 获取浏览器缓存值
    if (to.path === '/login' && !store) {
        return next()
    } else if (to.path === '/login' && store) {
        ElMessage({
            type: 'error',
            showClose: true,
            message: '请先退出登陆'
        })
        return next('/home/homewel?routerIndex=1')
    } else if (!store) {
        //   next('/login')
        //   if (to.path !== '/') {
        //     ElMessage({
        //       type: 'info',
        //       showClose: true,
        //       message: '请先登陆！'
        //     })
        //   }
        return next()
    } else {
        return next()
    }
})

export default router;