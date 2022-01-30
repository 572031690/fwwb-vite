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