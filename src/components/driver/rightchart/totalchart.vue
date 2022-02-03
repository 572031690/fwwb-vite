<!-- 商家销量统计的横向柱状图 -->
<template>
    <div class="linechart">
        <!-- 地区销售排行榜 -->
        <div class="linebody" ref="line_ref"></div>
    </div>
</template>

<script lang="ts">
import * as echarts from 'echarts'
import $api from '@/service/api'
import { totalChartTs } from '@/type/homeType'
import { reactive, watch, onMounted, toRefs, ref } from 'vue'

export default {
    props: {
        titleFontSize: [Number],
    },
    setup(props: any) {
        const data: totalChartTs = reactive({
            chartInstance: null,
            totalData: [],
            surplusData: [],
            line_ref: ref(),
            DataName: ['钢材', '木材', '煤炭', '塑料', '中国'],
            unitData: ['kg', 'kg', 'kg', 'kg', 'kg'],
        })
        const flag = ref(false)
        watch(
            () => props.titleFontSize,
            val => {
                if(flag.value) screenAdapter(val)
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
            var myColor = ['#1089E7', '#f57474', '#56D0e3', '#f8b448', '#8b78f6']
            // 对图表初始化配置的控制
            const initOption = {
                title: {
                    text: '| 材料库存统计',
                    left: 20,
                    top: 20,
                    textStyle: {
                        color: 'white',
                    },
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                    // 设置显示的文字内容
                    formatter: (args: any) => {
                        return args[0].name + '库存：' + ' ' + (args[1].axisValue * args[0].value) / 100 + data.unitData[args[0].dataIndex]
                    },
                },

                grid: {
                    left: '10%',
                    top: '20%',
                    bottom: '15%',
                    containLabel: true,
                },
                // 不显示x轴
                xAxis: {
                    show: false,
                },
                yAxis: [
                    {
                        type: 'category',
                        // data: this.DataName, // 数据显示的时候会反过来
                        inverse: true, // 是否不是反转数据 改成true就可以让原来反转的数据正过来了
                        // 不显示y轴的线
                        axisLine: {
                            show: false,
                        },
                        // 不显示y轴的小刻度
                        axisTick: {
                            show: false,
                        },
                        // 把刻度标签里面的文字颜色设置为黑色
                        axisLabel: {
                            color: 'white',
                        },
                    },
                    {
                        type: 'category',
                        // data: this.totalData, // 数据显示的时候会反过来
                        inverse: true, // 是否不是反转数据 改成true就可以让原来反转的数据正过来了
                        // 不显示y轴的线
                        axisLine: {
                            show: false,
                        },
                        // 不显示y轴的刻度
                        axisTick: {
                            show: false,
                        },
                        // 把刻度标签里面的文字颜色设置为黑色
                        axisLabel: {
                            textStyle: {
                                color: 'white',
                                fontSize: 12,
                            },
                            formatter: (arg: any, index: number) => {
                                return arg + data.unitData[index]
                            },
                        },
                    },
                ],
                series: [
                    {
                        yAxisIndex: 0, // 设置两个柱子重叠在一起的前后
                        name: '条',
                        type: 'bar',
                        // data: this.surplusData,
                        // 设置第一类柱子的样式
                        itemStyle: {
                            barBorderRadius: 20,
                            color: function (params: any) {
                                return myColor[params.dataIndex] // dataIndex当前柱子的索引号
                            },
                        },
                        // 柱子的间距
                        barCategoryGap: 50,
                        // 柱子的宽度
                        barWidth: 10,
                        // 显示柱子内的文字
                        label: {
                            show: true,
                            position: 'inside', // 显示的位置在柱子的内部
                            formatter: '{c}%', // 设置显示的文字的样式 c代表的就是他的data数据值    a代表系列名name，b代表数据名
                        },
                    },
                    {
                        yAxisIndex: 1, // 设置两个柱子重叠在一起的前后
                        name: '框',
                        barWidth: 15,
                        barCategoryGap: 50,
                        type: 'bar',
                        itemStyle: {
                            barBorderRadius: 15,
                            borderWidth: 3,
                            borderColor: '#00c1de',
                            color: 'none', // 看不到柱子 取而代之的是上面的border
                        },
                    },
                ],
            }
            data.chartInstance.setOption(initOption)
            flag.value = true

        }
        /**
         * @desc 获取服务器的数据
         */
        const getData = async () => {
            await $api('warehouse/findDepository', {
                params: {
                    page: 1, // 传递当前是第几页参数
                    limit: 20, // 传递每页显示多少条记录参数
                    searchName: '',
                    selectName: '',
                },
            }).then((res: any) => {
                data.totalData = []
                data.surplusData = []
                data.DataName = []
                data.unitData = []
                res.list.slice(0, 5).forEach((item:{totalstock:number,stock:number,name:string,unit:string}) => {
                    data.totalData.push(item.totalstock)
                    data.surplusData.push(parseInt(((item.stock / item.totalstock) * 100).toString()))
                    data.DataName.push(item.name)
                    data.unitData.push(item.unit)
                })
            })
            updateChart()
        }
        /**
         * @desc 更新图表
         */
        const updateChart = () => {
            const dataOption = {
                yAxis: [
                    {
                        data: data.DataName, // 数据显示的时候会反过来
                    },
                    {
                        data: data.totalData, // 数据显示的时候会反过来
                    },
                ],
                series: [
                    {
                        data: data.surplusData,
                    },
                    {
                        data: [100, 100, 100, 100, 100],
                    },
                ],
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
