interface HomeTs{
    nowTime: string,
    thistime: any,
    key: number,
    arrowflag: boolean,
    imghomeflag: boolean,
    adminname: string,
    permissionName: string,
    navshow: boolean,
    navSonShow: boolean,
    lastTime: number, // 默认上一次点击时间为0
    admin: boolean,
    routerChioce: number,
    checkIndex: number,
    LabelRefs: any
    routerList:  {
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
    }[] ,
    arrowData: any,
    timer: NodeJS.Timeout | null,
    rightnavtopimghome:HTMLElement|null
}
interface LoginTs{
    centerbox: boolean,
    checkCode: number | string,
    eyesflag: boolean,
    startList: number[],
    tipsList : {
        tips1: string, 
        result: string, 
        tips2: string
    },
    logindata: {
        uname: string,
        pass: string,
        inputVal: string
    },
    star:NodeList|[]
}
export{
    HomeTs,
    LoginTs
}