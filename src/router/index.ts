import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";
import { ElMessage } from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import { vueRouters } from './getRouter'
const routes: RouteRecordRaw[] = [
    // { path: '/login', component: () => import("@/views/Login.vue"), name: 'login' },
    // {
    //     path: '/home', component: () => import("@/views/Home.vue"), name: 'home', children: [
    //         {
    //             path: 'homewel',
    //             component: () => import("@/views/home/HomeWel.vue")
    //         },
    //         {
    //             path: '',
    //             redirect: '/home/homewel'
    //         }
    //     ]
    // },
    { path: '', redirect: '/login' }, // 默认跳转路由
    ...vueRouters()
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