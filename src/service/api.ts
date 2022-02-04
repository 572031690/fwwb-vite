/*
 * @Author: Tian
 * @Date: 2021-11-02 16:01:48
 * @LastEditors: Tian
 * @LastEditTime: 2021-12-20 09:32:55
 * @Description: 
 */
import base from './baseServe'
import request from './index'
import ApiConfig from './apis'

const getApi = (url:string,params?:Record<string, any>) => {
    const start = url.lastIndexOf('/') + 1 // 获得最后一次出现‘/’的位置
    const strName = url.slice(start) // 取得从该位置到结束的名字也就是方法name
    const filepath = url.slice(0, start - 1)// 取得路径名
    const axiosData = ApiConfig[filepath] // api地址
    if (!axiosData) {
        alert('api地址错误!!')
        return 
    }
    let ajaxData:any = ''
    axiosData.forEach((element:any) => {
        if (element.name === strName) {
            ajaxData = element
        }
    })
    if (!ajaxData) return Promise.reject(new Error('api地址错误')) // 判断是否为请求地址错误
    const headers = ajaxData.headers || ''
    if (ajaxData.method === 'POST') {
        return request.post(`${base.controllerWar}${ajaxData.path}`,params,headers)
    }else if (ajaxData.method === 'GET') {
        return request.get(`${base.controllerWar}${ajaxData.path}`,params,headers)
    }else {
        alert('请求类型错误！')
    }
}
export default  getApi
export class LoginApi {
    static async toLogin(params: Record<string, any>) {
        return request.post(`${base.controllerWar}/web/shirologin`, params)
    }
    // static async border(params?: Record<string, any>,headers?: Record<string, any>) {
    //     return request.get(`${base.controllerWar}/water/wgms/new/border`, params, headers)
    // }
    // static async realQuality(params: Record<string, any>) {
    //     return request.get(`${base.controllerWar}/web/api/v1/analyze-map/grid-detail`, params)
    // }
    // static async carbonData() {
    //     return request.get(`${base.controllerWar}/api/v1/carbon/base`)
    // }
    
}
export class HomeApi {
    static async findDepository(params: Record<string, any>) {
        return request.post(`${base.controllerWar}/web/shirologin`, params)
    }
}


