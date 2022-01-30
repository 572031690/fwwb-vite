/*
 * @Author: Tian
 * @Date: 2021-11-02 15:52:24
 * @LastEditors: Tian
 * @LastEditTime: 2021-11-02 18:20:17
 * @Description: 
 */
// import axios from '@/utils/request'
import axios from './axios'
import {AxiosRequestHeaders} from 'axios'
export default class Request {
    /**
     * get方法
     * @param {string} url 路径
     * @param {object} params 参数
     */
    static get: any = (url: string, params?: object, headers?: AxiosRequestHeaders ) => {
        return new Promise((resolve, reject) => {
            axios.get(url, { params, headers }).then((res) => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }
    static post: any = (url: string, params?: object, headers?: AxiosRequestHeaders ) => {
        return new Promise((resolve, reject) => {
            axios.post(url, params, { headers }).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }
    static put: any = (url: string, params?: object) => {
        return new Promise((resolve, reject) => {
            axios.put(url, { params: params }).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }
}
