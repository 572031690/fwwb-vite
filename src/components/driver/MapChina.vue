<template>
    <div id="mapchina" @dblclick="revertMap">
        <div class="tipsText" v-if="inflag">双击任意位置返回中国地图</div>
        <div class="earthmap1"></div>
        <div class="earthmap2"></div>
        <div class="earthmap3"></div>
        <div ref="map_ref" class="map"></div>
        <img id="imgsss" v-show="false" src="@/assets/img/mapBj.png" alt="" />
    </div>
</template>

<script lang="ts">
import { planePath } from '@/assets/data/echarts'
import { getProvinceMapInfo } from '@/assets/utils/map_utils'
import {reactive, onMounted, toRefs, ref } from 'vue'
import $api from '@/service/api'
import { mapChinaTs } from '@/type/homeType'
import * as echarts from 'echarts'
import axios from 'axios'

export default {
    name: 'map-china',
    setup(props: any, content: any) {
        const data:mapChinaTs = reactive({
            mapData: {}, // 所获取的省份地图矢量数据缓存
            totalCount: 0,
            totalValue: 0,
            topCityData: [],
            chartInstance: null,
            effectScatterData: [],
            airData: [], // 地图销量和单价数据
            labelFormatter: [],
            lineSc: [],
            planePath,
            imgDom: ref(),
            inflag: false,
            map_ref:ref()
        })
        onMounted(() => {
            getMap()
            getCountryData()
            getCompanyData()
            data.imgDom = document.querySelector('#imgsss') // 获取地图背景图dom
        })
        /**
         * @desc 获取地区销量统计数据
         */
        const getCountryData = async () => {
            const url = 'driver/countrySale'
            await $api(url).then((res:any) => {
                data.airData = res
                setTimeout(() => {
                    upDataMap()
                }, 0)
                data.airData.forEach(item => {
                    const lineData:{name:string,value:string|number} = {
                        name: '',
                        value: '',
                    }
                    lineData.name = item.name
                    const currentValue = item.value * item.count
                    lineData.value = Math.round((currentValue / 10000) * 10) / 10
                    data.totalValue += currentValue
                    data.totalCount += item.count
                    data.topCityData.push(lineData)
                })
                content.emit('backMapData', data.topCityData, data.totalCount, data.totalValue)
            })
        }
        /**
         * @desc 获取交易公司信息
         */
        const getCompanyData = async () => {
            const url = 'driver/findAllCompany'
            await $api(url).then((res:any) => {
                const homeName = res[0].countyname
                const homePort:number[] = res[0].port.split(',')
                res.forEach((item:any, index:number) => {
                    data.effectScatterData.push(item.port.split(','))
                    data.labelFormatter.push({
                        name: item.countyname,
                        matter: item.matter,
                    })
                    const lineData:{
                        coords: number[][],
                        fromName: string,
                        toName: string,
                        value: number
                    } = {
                        coords: [],
                        fromName: '',
                        toName: '',
                        value: 100,
                    }
                    if (index) {
                        lineData.fromName = item.countyname
                        lineData.toName = homeName
                        lineData.coords.push(item.port.split(','))
                        lineData.coords.push(homePort)
                        data.lineSc.push(lineData)
                    }
                })
            })
        }
        /**
         * @desc 构建地图
         */
        const getMap = async () => {
            // 基于准备好的dom，初始化echarts实例
            data.chartInstance = echarts.init(data.map_ref)
            const ret = await axios.get('http://localhost:3077/static/map/china.json') // 获得地图数据
            echarts.registerMap('chinaMap', ret.data) // 注册map数据
            // 绘制图表
            const setOption = {
                tooltip: {
                    // 鼠标一上去的信息框
                    trigger: 'item',
                },
                geo: [
                    {
                        zoom: 1.2, // 默认显示级别
                        layoutSize: '80%', // 设置地图占容器的大小百分比
                        layoutCenter: ['50%', '50%'], // 设置地图中心点位置
                        zlevel: 2,
                        type: 'map',
                        map: 'chinaMap', // chinaMap需要和registerMap中的第一个参数保持一致
                        label: {
                            show: true, // 展示标签
                            textStyle: {
                                fontSize: 12,
                                textWeight: 900,
                                color: 'white',
                            },
                        },
                        itemStyle: {
                            normal: {
                                areaColor: '#416cbb', // 地图区域的颜色。
                                borderColor: '#fff', // 图形的描边颜色。支持的颜色格式同 color，不支持回调函数。
                                shadowColor: 'black', // 阴影颜色。#41587f
                                shadowBlur: 8, // 图形阴影的模糊大小。
                                opacity: 0.75, // 图形透明度
                            },
                            emphasis: {
                                areaColor: '#fdd145',
                                borderColor: 'rgba(204, 229, 248, 0.7)',
                                borderWidth: 1,
                                shadowColor: 'rgba(204, 229, 248, 0.7)', // 119, 153, 198
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowOffsetY: 1,
                            },
                        },
                    },
                    {
                        map: 'chinaMap',
                        roam: false, // 是否允许缩放
                        zoom: 1.2, // 默认显示级别
                        layoutSize: '80%',
                        layoutCenter: ['51.5%', '51%'],
                        itemStyle: {
                            areaColor: 'rgb(0, 0, 0)', // 'rgba(0,27,95,0.4)',
                            borderWidth: 0,
                        },
                        zlevel: 1,
                        silent: true,
                    },
                ],
                series: [
                    {
                        // 地图数据
                        data: [],
                        geoIndex: 0, // 将空气质量的数据和第0个geo配置关联在一起
                        type: 'map',
                    },
                    {
                        // 动态红线
                        name: ' 杭州 Top3',
                        type: 'lines',
                        zlevel: 1, // zlevel 大的 Canvas 会放在 zlevel 小的 Canvas 的上面。
                        effect: {
                            show: true,
                            period: 4, // 动画的快慢
                            trailLength: 0.7, // 红线的宽度
                            color: 'red', // arrow箭头的颜色
                            symbolSize: 3, // 红线的宽度
                        },
                        lineStyle: {
                            width: 0,
                            curveness: 0.2, // 弯曲度
                        },
                        data: [],
                    },
                    {
                        // 箭头线
                        name: ' 杭州 Top3',
                        type: 'lines',
                        zlevel: 2,
                        symbol: ['none', 'arrow'],
                        symbolSize: 10, // 设置箭头的大小
                        effect: {
                            show: true,
                            period: 4,
                            trailLength: 0, // 红线的宽度 设置为零只显示飞机
                            symbol: data.planePath,
                            symbolSize: 18,
                        },
                        lineStyle: {
                            normal: {
                                width: 2,
                                opacity: 0.6,
                                curveness: 0.2,
                            },
                        },
                        data: [],
                    },
                    {
                        // 散点数据
                        name: '杭州',
                        data: [],
                        zlevel: 2,
                        type: 'effectScatter',
                        coordinateSystem: 'geo', // 指明散点使用的坐标系统  geo的坐标系统
                        rippleEffect: {
                            scale: 3, // 设置涟漪动画的缩放比例
                            brushType: 'stroke',
                        },
                    },
                ],
                visualMap: {
                    // 渐变分层显示
                    type: 'piecewise', // 分层
                    min: 0,
                    max: 300,
                    text: ['高(平均单价)', '低'], // 两端的文本，如 ['High', 'Low']
                    showLabel: true, // 是否显示每项的文本标签
                    orient: 'horizontal', // 图例排列方向 水平horizontal 垂直vertical
                    left: 'center',
                    bottom: '5%',
                    textStyle: {
                        // 设置文字颜色（Demo左下组件）
                        color: 'white',
                        fontSize: 12,
                    },
                    pieces: [
                        // 自定义『分段式视觉映射组件（visualMapPiecewise）』的每一段的范围，以及每一段的文字，以及每一段的特别的样式
                        { gt: 20000, lte: 9999999, label: '2万以上', color: '#0357C2' }, // (500, 900]
                        { gt: 15000, lte: 20000, label: '1.5万~2万', color: '#187EFF' }, // (310, 500]
                        { gt: 10000, lte: 15000, label: '1万~1.5万', color: '#9DC9FF' }, // (200, 300]
                        { gt: 0, lte: 10000, label: '0~1万', color: '#B8E2FF' }, // (10, 200]
                        { value: 0, label: '无数据', color: '#fff' }, // [0]
                    ],
                },
            }
            data.chartInstance.setOption(setOption)
            // 跟随屏幕自适应
            window.onresize = data.chartInstance.resize
            setOnClick()
        }
        /**
         * @desc 设置点击事件
         */
        const setOnClick = async () => {
            // 监听点击
            data.chartInstance.on('click', async (arg:{name:string,componentSubType:string}) => {
                if (data.inflag || arg.componentSubType !== 'map') return
                // 调用外部方法获取中文身份的拼音
                const provinceInfo = getProvinceMapInfo(arg.name)
                // 判断获取的地图数据是否已经缓存 如果不存在
                if (!data.mapData[provinceInfo.key]) {
                    // 获取这个省份的地图矢量数据
                    const ret = await axios.get('http://localhost:3077' + provinceInfo.path)
                    // 缓存数据
                    data.mapData[provinceInfo.key] = ret.data
                   echarts.registerMap(provinceInfo.key, ret.data)
                }
                const changeOption = {
                    geo: [
                        {
                            map: provinceInfo.key,
                            itemStyle: {
                                areaColor: {
                                    // 双击后切换地图背景为图片
                                    image: data.imgDom,
                                },
                            },
                        },
                        {
                            map: provinceInfo.key,
                        },
                    ],
                }
                data.chartInstance.setOption(changeOption)
                data.inflag = true
            })
        }
        /**
         * @desc 更新视图数据
         */
        const upDataMap = () => {
            const that = this
            const setUpOption = {
                series: [
                    {
                        data: data.airData,
                        tooltip: {
                            textStyle: {
                                fontSize: 10,
                            },
                            // 利用formatter来自定义tooltip展示的数据
                            formatter: function (params:any) {
                                if (params.value) {
                                    return (
                                        params.name +
                                        '销售<br/>成交量：' +
                                        data.airData[params.dataIndex].count +
                                        '单<br/>' +
                                        '平均每单价格：' +
                                        params.value +
                                        '元<br/>'
                                    )
                                } else {
                                    return ''
                                }
                            },
                        },
                    },
                    {
                        data: data.lineSc,
                    },
                    {
                        data: data.lineSc,
                        tooltip: {
                            // 利用formatter来自定义tooltip展示的数据
                            formatter: function (params:any) {
                                return params.data.fromName + '采购：<br/> 木材：' + params.data.value + '万吨'
                            },
                        },
                    },
                    {
                        data: data.effectScatterData, // 配置散点的坐标数据
                        label: {
                            normal: {
                                show: true,
                                position: 'right',
                                formatter: (params:any) => {
                                    return data.labelFormatter[params.dataIndex].name
                                },
                            },
                        },
                        tooltip: {
                            textStyle: {
                                fontSize: 10,
                            },
                            // 利用formatter来自定义tooltip展示的数据
                            formatter: (params:any) => {
                                return data.labelFormatter[params.dataIndex].matter
                            },
                        },
                    },
                ],
            }
            data.chartInstance.setOption(setUpOption)
        }
        /**
         * @desc 双击事件返回china
         */
        const revertMap = () => {
            if (!data.inflag) return
            const revertOption = {
                geo: [
                    {
                        map: 'chinaMap',
                    },
                    {
                        map: 'chinaMap',
                    },
                ],
            }
            data.chartInstance.setOption(revertOption)
            data.inflag = false
        }
        return {
            revertMap,
            ...toRefs(data)
        }
    },
}
</script>

<style scoped>
#mapchina {
    position: relative;
    width: 40vw;
    height: 40vw;
    overflow: hidden;
    margin: 0 auto;
    margin-top: 93px;
}
.earthmap1,
.earthmap2,
.earthmap3 {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%); /* 50%为自身尺寸的一半 */
}
.earthmap1 {
    background: url(../../assets/img/map.png) no-repeat;
    background-size: 100% 100%;
    width: 70%;
    opacity: 0.3;
    height: 70%;
}
.earthmap2 {
    background: url(../../assets/img/lbx.png) no-repeat;
    background-size: 100% 100%;
    opacity: 0.5;
    width: 80%;
    height: 80%;
    animation: rotate 15s linear infinite; /* infinite代表无限循环 */
}
.earthmap3 {
    background: url(../../assets/img/jt.png) no-repeat;
    background-size: 100% 100%;
    width: 75%;
    opacity: 0.5;
    height: 75%;
    border-radius: 50%;

    animation: rotateline 10s linear infinite;
}

@keyframes rotate {
    from {
        transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}

@keyframes rotateline {
    from {
        transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
        transform: translate(-50%, -50%) rotate(-360deg);
    }
}
.map {
    position: absolute;
    width: 100%;
    height: 100%;
    /* color: rgba(204, 229, 248, 0.7); */
}
.tipsText {
    position: absolute;
    color: white;
    top: 10%;
    opacity: 0.8;
    z-index: 99999;
    background-color: rgb(84, 116, 177);
    border: 1px solid #031942;
    padding: 2px 5px;
}
</style>
