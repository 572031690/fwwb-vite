<!-- 商家销量统计的横向柱状图 -->
<template>
    <div class="linechart">
        <!-- 地区销售排行榜 -->
        <div class="linebody" ref="line_ref"></div>
    </div>
</template>

<script lang="ts">
import { monthData } from '@/assets/data/month'
import * as echarts from 'echarts'
import $api from '@/service/api'
import { lineChartTs } from '@/type/homeType'
import { reactive, watch, onMounted, toRefs, ref } from 'vue'

export default {
    props: {
        titleFontSize: [Number],
    },
    setup(props: any) {
        const data:lineChartTs = reactive({
            chartInstance: null,
            line_ref: ref(),
            allData: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], // 服务器返回的数据 // 服务器返回的数据
            endValue: 4,
            series: [],
            startValue: 0,
            timeId: null,
            colorArr: ['#ed3f35', '#01e2e5', '#596d90', '#f8b448']
        })
        watch(
            () => props.titleFontSize,
            val => {
                screenAdapter(val)
            }
        )
        onMounted(() => {
            initChart()
            getData()
        })
        /**
         * @desc 初始化echartInstance对象
         */
        const initChart = () => {
            data.chartInstance = echarts.init(data.line_ref)
            // 对图表初始化配置的控制
            const initOption = {
                title: {
                    text: '| 材料月增量统计',
                    left: 20,
                    top: 20,
                    textStyle: {
                        color: 'white',
                    },
                },
                legend: {
                    top: '15%',
                    right: '5%',
                    textStyle: {
                        color: 'white',
                    },
                },
                grid: {
                    top: '33%',
                    left: '0.5%',
                    right: '3%',
                    bottom: '7%',
                    // 坐标轴位置是否包含文字
                    containLabel: true,
                },
                tooltip: {
                    show: true,
                    formatter: (arg: any) => {
                        return arg.seriesName + '</br>' + arg.marker + arg.name + '增加：' + arg.value + '万吨'
                    },
                },
                xAxis: {
                    type: 'category',
                    // 把刻度标签里面的文字颜色设置为黑色
                    boundaryGap: false, // x轴的第1个元素是否与y轴有距离

                    axisLabel: {
                        color: 'white',
                        interval: 0,
                    },
                    // 坐标轴配置
                    axisLine: {
                        lineStyle: {
                            color: '#5470c6',
                        },
                    },
                    axisTick: {
                        alignWithLabel: true,
                    },
                },
                yAxis: {
                    name: '(万吨)',
                    nameLocation: 'end', // name的具体位置，可调整上中下左
                    nameTextStyle: {
                        color: 'white',
                        fonstSize: 15,
                        padding: [0, 15, 0, 0],
                    },
                    type: 'value',
                    // 设置轴分割线的颜色
                    splitLine: {
                        lineStyle: {
                            color: '#5470c6',
                        },
                    },
                    // 把刻度标签里面的文字颜色设置为黑色
                    axisLabel: {
                        color: 'white',
                    },
                },
                series: [
                    {
                        type: 'line',
                        stack: 'all', // 堆叠图的设置
                        smooth: true, // 是否为平滑线
                        symbol: 'circle', // 折线节点为小圆点
                        symbolSize: '5', // 折线点大小
                    },
                ],
            }
            data.chartInstance.setOption(initOption)
        }
        /**
         * @desc 获取服务器的数据
         */
        const getData = async () => {
            const url = 'driver/monthIncrement'
            await $api(url).then((res:any) => {
                res.forEach((element:{[key:string]:string}, index:number) => {
                    const myInitSeriseData = {
                        name: '',
                        type: 'line',
                        stack: 'all', // 堆叠图的设置
                        smooth: true, // 是否为平滑线
                        symbol: 'circle', // 折线节点为小圆点
                        symbolSize: '5', // 折线点大小
                        data: [],
                        lineStyle: {
                            // 设置柱的样式
                            color: ''
                        },
                        itemStyle: {
                            // 设置线拐点的样式
                            borderColor: '', // 折线点边框色
                            color: 'white',
                            borderWidth: 1
                        }
                    }
                    myInitSeriseData.name = element.materiakName
                    myInitSeriseData.lineStyle.color = data.colorArr[index]
                    myInitSeriseData.itemStyle.borderColor = data.colorArr[index]
                    myInitSeriseData.data = []
                    data.allData.forEach((item: string) => {
                        myInitSeriseData.data.push(element[monthData[item]])
                    })
                    data.series.push({ ...myInitSeriseData })
                })
                updateChart()
            })
        }
        /**
         * @desc 更新图表
         */
        const updateChart = () => {
            const dataOption = {
                xAxis: {
                    data: data.allData,
                },
                series: data.series,
            }
            data.chartInstance.setOption(dataOption)
        }
        /**
         * @desc 当浏览器的大小发生变化的时候, 会调用的方法, 来完成屏幕的适配
         */
        const screenAdapter = (val: number) => {
            // 和分辨率大小相关的配置项
            const adapterOption = {
                title: {
                    textStyle: {
                        fontSize: val * 1.5,
                    },
                },
            }
            data.chartInstance.setOption(adapterOption)
            // 手动的调用图表对象的resize 才能产生效果
            data.chartInstance.resize()
        }
        return {
            ...toRefs(data),
        }
    },
}
</script>

<style scoped>
.linechart {
    height: 100%;
    width: 100%;
}
.linebody {
    height: 100%;
    width: 100%;
}
</style>
