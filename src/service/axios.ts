import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'

const messageBox = (msg: string, type?: any) => {
    ElMessage({
        message: msg,
        type: type || 'warning',
        duration: 1500
    })
}
// 获取token
const getToken = () => {
    const token = window.sessionStorage.getItem('sessionId') // 拿到浏览器的token
    return token || ''
}
/**
 * 允许某个请求可以继续进行
 * @param {array} reqList 全部请求列表
 * @param {string} url 请求地址
 */
const handleAllowRequest = function (reqList: any[], url: any) {
    for (let i = 0; i < reqList.length; i++) {
        if (reqList[i] === url) {
            reqList.splice(i, 1)
            break
        }
    }
}
// 正在请求中的请求列表
const reqList: any[] = []
/** 
 * 请求失败后的错误统一处理 
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status: number, other: string) => {
    // 状态码判断
    const msg = getErrorMessage(status)
    messageBox(msg)
    // switch (status) {
    //     // 400,401: 未登录状态，跳转登录页
    //     case 400:
    //     case 401:
    //         // redirectLogin()
    //         break
    //     // 403 token过期
    //     // 清除token并跳转登录页
    //     case 403:
    //         messageBox('登录过期，请重新登录')
    //         // removeToken()
    //         setTimeout(() => {
    //             redirectLogin()
    //         }, 1000)
    //         break
    //     // 404请求不存在
    //     case 404:
    //         messageBox('请求的资源不存在', 'error')
    //         break
    //     default:
    //         messageBox(other)
    // }
}
function getErrorMessage(status:number) {
    // if (error.code === 'ECONNABORTED') return '错误：请求超时'
    const typeData:{[key:number]:string} = {
        302: '错误：暂无权限 302',
        401: '错误：未授权 401',
        403: '错误：禁止访问 403',
        400: '错误：请求语法错误 400',
        404: '错误：请求地址无法找到  404',
        405: '错误：请求方法错误 405',
        500: '错误：服务器错误 500',
        502: '错误：网关错误 502',
        503: '错误：无法获得服务器 503'
    }
    if (typeData[status]) return typeData[status]
    return '网络异常'
}
/* 实例化请求配置 */
const instance = axios.create({
    baseURL: '/api',
    // 请求时长
    timeout: 60 * 1000,
    validateStatus() {
        // 使用async-await，处理reject情况较为繁琐，所以全部返回resolve，在业务代码中处理异常
        return true
    },
    transformResponse: [(data) => { //对于返回JSON格式数据统一转换
        if (typeof data === 'string' && data.startsWith('{')) {
            data = JSON.parse(data)
        }
        return data
    }]
})

/** 
 * 请求拦截器 
 * 每次请求前，如果存在token则在请求头中携带token 
 */
instance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        if(!config) return
        let cancel
        config.cancelToken = new axios.CancelToken(c => { cancel = c })
        // 阻止重复请求，因项目中存在复用接口的情况，此处做修改
        // handleStopRepeatRequest(reqList, config.url, cancel, `${config.url} 正在请求中，请不要重复请求！`)
        if(config.headers) {
            config.headers['Cache-Control'] = 'no-cache, no-store' // 清除缓存
            config.headers.Pragma = 'no-cache' // 清除缓存
            config.headers['x-token'] = getToken()
        }
        return config
    },
    error => {
        Promise.reject(error)
    }
)

// 响应拦截器
instance.interceptors.response.use(
    // 请求成功
    (response: AxiosResponse<any>) => {
        // 增加延迟，相同请求不得在短时间内重复发送
        setTimeout(() => {
            handleAllowRequest(reqList, response.config.url)
        }, 1000)
        //对后端返回的code做一些出错处理...
        const { code, message } = response.data
        // if (response.status === 401 || code === 400) {
        //     removeToken()
        //     return redirectLogin()
        // }
        if ([200, 'success'].includes(code) || typeof code !== 'number') {
            return response.data
        } else if (code) {
            messageBox(message || '数据异常，请稍后再试')
            return Promise.reject(response.data)
        } else {
            return Promise.resolve(response.data)
        }
    },
    // 请求失败
    error => {
        if (axios.isCancel(error)) {
            console.log(error.message)
        } else {
            // 增加延迟，相同请求不得在短时间内重复发送
            setTimeout(() => {
                handleAllowRequest(reqList, error.config.url)
            }, 1000)
        }
        const { response } = error
        if (response) {
            // 请求已发出，但是不在2xx的范围 
            errorHandle(response.status, response.data.message)
            return Promise.reject(response)
        }
    }
)
export default instance