const contexts: any = import.meta.globEager("./module/*.ts")
const keyApi = Object.keys(contexts)
const Api:{[key:string]:any} = {}
keyApi.forEach((item:string) => {
    const keys:string = item.replace(/(\.\/module\/|\.ts)/g, '') // 去除末尾的.png
    Api[keys.substring(keys.lastIndexOf("/")+1)] = contexts[item].default
})
export default Api