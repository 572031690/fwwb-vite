import { RouteRecordRaw } from 'vue-router'
function getModules() {
    const components = import.meta.glob('../views/**/*.vue')
    return components
}
function getComponents() {
    const components = import.meta.globEager('../views/**/*.vue')
    return components
}
// 自动注册路由
export const vueRouters = function (): Array<RouteRecordRaw> {
    const routerList: Array<RouteRecordRaw> = []
    const modules = getModules()
    const components = getComponents()
    Object.keys(components).forEach(key => {
        const viewSrc = components[key]
        const file = viewSrc.default
        const name = key.replace(/(\...views\/|\.vue)/g, '') // 取出..views前缀到.vue中间的字符串
        const nameArray = name.split('/') // 分割路径
        const lowNameArray = nameArray.map((item:string) => item.slice(0, 1).toLowerCase() + item.slice(1)) // 第一位字母大写变成小写
        const pathName = lowNameArray.join('/')
        if (!file.isRouter) return
        if(file.isChildren) { // 只能解决一级的children子路由嵌套
            const faterIndex:number = routerList.findIndex((item:any) => item.name===lowNameArray.slice(-2)[0])
            if(faterIndex===-1) return
            const lastName = lowNameArray.slice(-1)[0]
            routerList[faterIndex].children.push({
                path: lastName,
                name: lastName,
                component: modules[key] // 使用此生成的是() => import("**")动态引入路由
            })
        }else {
            routerList.push({
                path: `/${pathName}`,
                name: lowNameArray.slice(-1)[0],
                component: modules[key], // 使用此生成的是() => import("**")动态引入路由
                children:[]
            })
        }
    })
    return routerList
} 