export interface countToTs {
    localStart: number,
    displayValue: string,
    printVal: null | number,
    paused: boolean,
    localDuration: number,
    startTime: null | number,
    timestamp: null | number,
    remaining: null | number,
    rAF: null | number
}
export interface dialogTs {
    totalstock: { required: boolean, validator: any, trigger: string }[],
    rulesData:any, // 表单rules数据
    addEditList:any, // 静态表单inpput类型和表单字段名称以及url地址
    dialogData: {
        dialogType: string,
        formList: any,
        dataTableList: any,
        url?:{
            [key:string]:string
            upApproval:string
            startApproval:string
        }
    },
    topData: {}, // 表单顶部暂存数据
    itemList: {itemid:string,unit:string,itemtype:string}[], // 物料数据
}