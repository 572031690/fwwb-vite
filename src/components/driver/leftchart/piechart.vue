<template>
    <div id="pie-chart">
        <div class="piebody" ref="pie_chart"></div>
    </div>
</template>

<script lang="ts">
import * as echarts from 'echarts'
import { pieChartTs } from '@/type/homeType'
import { reactive, watch, onMounted, toRefs, ref } from 'vue'
export default {
    props: {
        /**
         * @desc 界面适配比例大小值
         */
        titleFontSize: {
            type: Number,
            default: () => {
                return 15
            },
        },
        /**
         * @desc 关闭抽屉方法
         */
        pieData: {
            type: Array,
            default: () => {
                return []
            },
        },
    },
    setup(props: any) {
        const data:pieChartTs = reactive({
            chartInstance: null,
            legendName: [],
            seriesData: [],
            pie_chart:ref()
        })
        watch(
            () => props.titleFontSize,
            val => {
                screenAdapter(val)
            }
        )
        watch(
            () => props.pieData,
            val => {
                if (val.length) {
                    getData()
                }
            }
        )
        onMounted(() => {
            getinitChart()
        })
        /**
         * @desc 初始化echarts
         */
        const getinitChart = () => {
            data.chartInstance = echarts.init(data.pie_chart)
            // 对图表初始化配置的控制
            const initOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: (arg:any) => {
                        return arg.marker + arg.name + ' : ' + arg.value + '万元' // marker就是前面有颜色的标记球
                    },
                },
                title: {
                    text: '| 全国销量比TOP10',
                    top: 25,
                    left: 25,
                    textStyle: {
                        color: 'white',
                    },
                },
                legend: [
                    {
                        left: 'center',
                        bottom: '5%',

                        textStyle: {
                            color: 'white',
                        },
                    },
                    {
                        left: 'center',
                        bottom: '0%',

                        textStyle: {
                            color: 'white',
                        },
                    },
                ],
                series: [
                    {
                        type: 'pie',
                        // 饼图旁边文字显示和消失
                        radius: ['33%', '48%'], // 第0个元素代表的是內圆的半径 第1个元素外圆的半径
                        selectedMode: 'single', // 选中的效果,能够将选中的区域偏离圆点一小段距离，并点击其他的时候恢复

                        label: {
                            show: true,
                            color: 'white',
                            formatter: (arg:any) => {
                                return arg.name + ':' + arg.percent.toFixed(1) + '%'
                            },
                        },
                        labelLine: {
                            show: true,
                        },
                    },
                ],
            }
            data.chartInstance.setOption(initOption)
        }
        /**
         * @desc 赋值数据
         */
        const getData = () => {
            const pieDataCopy = JSON.parse(JSON.stringify(props.pieData))
            for (let i = 0; i < pieDataCopy.length; i++) {
                for (let j = i + 1; j < pieDataCopy.length; j++) {
                    if (pieDataCopy[i].value < pieDataCopy[j].value) {
                        const pie = pieDataCopy[i]
                        pieDataCopy[i] = pieDataCopy[j]
                        pieDataCopy[j] = pie
                    }
                }
            }
            const TopData10 = pieDataCopy.slice(0, 10)
            TopData10.forEach((item:{name:string}) => {
                data.legendName.push(item.name)
            })
            data.seriesData = TopData10
            updateChart()
        }
        /**
         * @desc 更新图表
         */
        const updateChart = () => {
            const dataOption = {
                // 顶部事例
                legend: [
                    {
                        data: data.legendName.slice(0, 6),
                    },
                    {
                        data: data.legendName.slice(6, 10),
                    },
                ],
                series: [
                    {
                        data: data.seriesData,
                    },
                ],
            }
            data.chartInstance.setOption(dataOption)
        }
        /**
         * @desc 以及屏幕适配
         */
        const screenAdapter = (val: number) => {
            const adapterOption = {
                title: {
                    textStyle: {
                        fontSize: val * 1.5,
                    },
                },
                legend: [
                    {
                        itemWidth: val * 1.5,
                        itemHeight: val,
                        itemGap: val / 2,
                        textStyle: {
                            fontSize: val / 1.2,
                        },
                    },
                    {
                        itemWidth: val * 1.5,
                        itemHeight: val,
                        itemGap: val / 2,
                        textStyle: {
                            fontSize: val / 1.2,
                        },
                    },
                ],
                series: [
                    {
                        label: {
                            fontSize: val * 0.9,
                        },
                    },
                ],
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
.pie-chart {
    height: 100%;
    width: 100%;
}
.piebody {
    height: 100%;
    width: 100%;
}
</style>
