import { FunctionExpression } from "@babel/types"

/**
 * @desc 函数 防抖 false/节流 true
  * @param fn 函数
  * @param wait 函数执行间隔时间毫秒数 默认1s Number
  * @param immediate 是否立即执行 Boolean
  */
export function debounce (fn:FunctionExpression, immediate:boolean, wait?:number) {
  wait = wait || 1000
  let timer:any
  return function () {
    if (timer && immediate) return
    const args = arguments
    if (timer && !immediate) {
      clearTimeout(timer)
    }
    if (immediate) fn.apply(this, args)
    timer = setTimeout(() => {
      timer = null
      if (!immediate) fn.apply(this, args)
    }, wait)
  }
}
/**
 * @desc 函数 电话脱敏
  * @param desNum 传入的电话/身份证... number ，string
  */
export function desensitization (desNum:number) {
  const strNum = desNum.toString()
  const length = strNum.length
  const staticNum = Math.ceil(length / 4)
  const numReplace = '*'.repeat(staticNum + 1)
  return strNum.substring(0, staticNum) + numReplace + strNum.substring(2 * staticNum + 1, length)
}
