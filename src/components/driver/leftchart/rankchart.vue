<!-- 商家销量统计的横向柱状图 -->
<template>
    <div class="rankchart">
        <!-- 地区销售排行榜 -->
        <div class="rankbody" ref="rank_ref"></div>
    </div>
</template>

<script lang="ts">
import { monthData } from '@/assets/data/month'
import * as echarts from 'echarts'
import $api from '@/service/api'
import { rankChartTs } from '@/type/homeType'
import { reactive, watch, onMounted, toRefs, ref, onUnmounted } from 'vue'
export default {
    name: 'rank-chart',
    props: {
        titleFontSize: [Number],
    },
    setup(props: any) {
        const data:rankChartTs = reactive({
            chartInstance: null,
            allData: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], // 服务器返回的数据
            series: [
                {
                    name: '',
                    type: 'bar',
                    data: [],
                    itemStyle: {
                        // 设置柱的颜色
                        color: '',
                    },
                },
                {
                    name: '',
                    type: 'bar',
                    data: [],
                    itemStyle: {
                        // 设置柱的颜色
                        color: '',
                    },
                },
                {
                    name: '',
                    type: 'bar',
                    data: [],
                    itemStyle: {
                        // 设置柱的颜色
                        color: '',
                    },
                },
            ],
            rank_ref:ref(),
            endValue: 4,
            startValue: 0,
            timeId: null,
            colorArr: ['#578bf1', '#56d0a3', '#596d90']
        })
        onMounted(() => {
            initChart()
            getData()
        })
        onUnmounted(() => {
            clearInterval(data.timeId as NodeJS.Timeout)
        })
        watch(
            () => props.titleFontSize,
            val => {
                screenAdapter(val)
            }
        )
        /**
         * @desc 初始化echarts对象
         */
        const initChart = () => {
            data.chartInstance = echarts.init(data.rank_ref)
            // 对图表初始化配置的控制
            const initOption = {
                title: {
                    text: '| 三大支柱材料月销量统计',
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
                    left: '5%',
                    right: '5%',
                    bottom: '7%',
                    // 坐标轴位置是否包含文字
                    containLabel: true,
                },
                xAxis: {
                    type: 'category',
                    // 把刻度标签里面的文字颜色设置为黑色
                    axisLabel: {
                        color: 'white',
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
                    serise: data.series,
                },
            }
            data.chartInstance.setOption(initOption)
            data.chartInstance.on('mouseover', () => {
                clearInterval(data.timeId as NodeJS.Timeout)
            })
            data.chartInstance.on('mouseout', () => {
                startInterval()
            })
        }

        /**
         * @desc 获取服务器的数据
         */
        const getData = async() => {
            const url = 'driver/monthSales'
            await $api(url).then((res:any) => {
                res.sort((a:any, b:any) => {
                    return b.totalData - a.totalData
                })
                data.series.forEach((item, index:number) => {
                    item.name = res[index].materiakName
                    item.itemStyle.color = data.colorArr[index]
                    data.allData.forEach(datas => {
                        item.data.push(res[index][monthData[datas]])
                    })
                })
                updateChart()
                startInterval()
            })
        }
        /**
         * @desc 更新图表
         */
        const updateChart = () => {
            // 处理数据
            // 省份数据
            const dataOption = {
                tooltip: {
                    show: true,
                    formatter: (arg:any) => {
                        return arg.seriesName + '</br>' + arg.marker + arg.name + '：' + arg.value + '万吨'
                    },
                },
                xAxis: {
                    data: data.allData,
                },
                // 显示表格底部拖动显示条
                dataZoom: {
                    show: false, // 隐藏
                    startValue: data.startValue,
                    endValue: data.endValue,
                },
                series: data.series,
            }
            data.chartInstance.setOption(dataOption)
        }
        /**
         * @desc 当浏览器的大小发生变化的时候, 会调用的方法, 来完成屏幕的适配
         */
        const screenAdapter = (val:number) => {
            // 和分辨率大小相关的配置项
            const adapterOption = {
                title: {
                    textStyle: {
                        fontSize: val * 1.5,
                    },
                },
                series: [
                    {
                        barWidth: val,
                        itemStyle: {
                            barBorderRadius: [val / 2, val / 2, 0, 0],
                        },
                    },
                    {
                        barWidth: val,
                        itemStyle: {
                            barBorderRadius: [val / 2, val / 2, 0, 0],
                        },
                    },
                    {
                        barWidth: val,
                        itemStyle: {
                            barBorderRadius: [val / 2, val / 2, 0, 0],
                        },
                    },
                ],
            }
            data.chartInstance.setOption(adapterOption)
            // 手动的调用图表对象的resize 才能产生效果
            data.chartInstance.resize()
        }
        /**
         * @desc 设置柱形图动态左右滚动时间函数
         */
        const startInterval = () => {
            if (data.timeId) {
                clearInterval(data.timeId)
            }
            data.timeId = setInterval(() => {
                data.startValue++
                data.endValue++
                if (data.endValue > data.allData.length - 1) {
                    data.endValue = 4
                    data.startValue = 0
                }
                updateChart()
            }, 2000)
        }
        return {
            ...toRefs(data)
        }
    },
}
</script>

<style scoped>
.rankchart {
    height: 100%;
    width: 100%;
}
.rankbody {
    height: 100%;
    width: 100%;
}
</style>
