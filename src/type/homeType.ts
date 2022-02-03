export interface homeWelTs {
    rolaSelect: {
        value: string
        label: string
        depart: string
    }[]
    briefIntroduction: string
    tableData: {
        employeeid: string
        isDisabled: number
        isDisplayed: number
        password: string
        realname: string
        roleId: number[]
        salt: string
        telNum: string
        userid: number
        username: string,
        role?: string,
        department?: string
    }[]
    needCount: {
        approve: string
        reject: string
        sum: string
    },
    buyCount: {
        approve: string
        reject: string
        sum: string
    },
    datalist: { name: string, num: string, unit: string }[]
}
export interface personalTs {
    rolaSelect: {
        value: string
        depart: string
    }[],
    dialogFormVisible: boolean,
    userData: {
        roleId: number[],
        role: string,
        department: string
        telNum: string,
        userid: string
    }
}
export interface mapChinaTs {
    mapData: any, // 所获取的省份地图矢量数据缓存
    totalCount: number,
    totalValue: number,
    topCityData: { name: string, value: string | number }[],
    chartInstance: null | any,
    effectScatterData: number[][],
    airData: { name: string, value: number, count: number }[], // 地图销量和单价数据
    labelFormatter: {
        name: string,
        matter: number,
    }[],
    map_ref: any
    lineSc: {
        coords: number[][],
        fromName: string,
        toName: string,
        value: number,
    }[],
    planePath: string,
    imgDom: any,
    inflag: boolean,
}

export interface rankChartTs {
    chartInstance: any,
    allData: string[], // 服务器返回的数据
    series: {
        name: string,
        type: string,
        data: number[],
        itemStyle: {
            // 设置柱的颜色
            color: string,
        },
    }[],
    rank_ref: HTMLElement,
    endValue: number,
    startValue: number,
    timeId: null | NodeJS.Timeout, // 定时器类型
    colorArr: string[]
}
export interface pieChartTs {
    chartInstance: any,
    legendName: string[],
    seriesData: any[],
    pie_chart: any
}
export interface lineChartTs {
    chartInstance: any,
    line_ref: any,
    allData: string[]
    endValue: number,
    series: any[],
    startValue: number,
    timeId: null,
    colorArr: string[],
}
export interface totalChartTs {
    chartInstance: any,
    totalData: number[],
    surplusData: number[],
    DataName: string[],
    unitData: string[],
    line_ref: HTMLElement
}

export interface buyTs {
    statusColorList: ['#eee', 'rgb(92, 92, 143)', 'rgb(92, 92, 143)', 'rgb(23, 165, 23)', 'rgb(226, 63, 63)', 'rgb(98, 98, 207)'],
    tableText: {
        tableTitle: string[],
        tableBody: string[]
    },
    dialogFormShow: false,
    drawerUrlList: {
        ressetApproval: string,
        getApprovalList: string,
        passRequest: string,
        rejectRequest: string,
    },
    dialogUrl: {
        startApproval: string,
        upApproval: string,
    },
    currentApprovalType: boolean,
    drawOpenType: string,
    currentRouter: string,
    IntList: string[],
    topChange: string,
    currentIndex: number, // 查看审批数据
    showAdd: boolean,
    importanceList: {
        text: string,
        color: string,
    }[],
    params: {
        limit: number, // 每页显示5条记录
        page: number, // 当前是第几页
        total: number, // 总共几条记录去分页
        searchName: string, // 查询数据
        selectName: string, // 查询状态
        sortType: number | string,
        ordertype: number,
        department: string, // 需求单位
        itemtype: string, // 物料类别
        itemid: string, // 物料编号
        btime: string, // 需求时间: // 需求时间
    },
    sortList: {
        编号: string,
        重要程度: number,
        到货日期: number,
        需求日期: number,
    },
    select: {
        value: number,
        label: string,
        color: string,
    }[],
    // 表内静态数据列表
    list: any[],
    Draw: any
    loading2: boolean,
    thistime: null | NodeJS.Timeout,
    searchUrl: string
}

export interface needTs {
    statusColorList: string[],
    tableText: {
        tableTitle: string[],
        tableBody: string[]
    }
    dialogFormShow: boolean,
    drawerUrlList: {
        ressetApproval: string,
        getApprovalList: string
        passRequest: string
        rejectRequest: string
    },
    dialogUrl: {
        startApproval: string
        upApproval: string
    },
    params: {
        limit: number, // 每页显示5条记录
        page: number, // 当前是第几页
        total: number, // 总共几条记录去分页
        searchName: string, // 查询数据
        selectName: string, // 查询状态
        department: string, // 需求单位
        itemtype: string | number, // 物料类别
        itemid: string, // 物料编号
        needday: string // 需求时间
    },
    currentApprovalType: boolean,
    drawOpenType: string,
    IntList: string[],
    topChange: string,
    currentRouter: string,
    currentIndex: number, // 查看审批数据
    showAdd: boolean,
    list: {
        needid: number,
        needtitle: string
        itemtype: string | number,
        itemid: number,
        neednum: string
        needday: string
        unit: string
        neederid: string
        comment: string,
        uptype: number
    }[],
    select: {
        value: number,
        label: string,
        color: string
    }[],
    loading2: boolean,
    thistime: null | NodeJS.Timeout,
    searchUrl: string,
    Draw: any
}