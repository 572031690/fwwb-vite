<template>
    <div class="welbody" ref="body_ref" id="bodyMap">
        <div class="bodyleft">
            <div class="tabbody">
                <rankchart class="piechart" :titleFontSize="titleFontSize"></rankchart>
                <div class="tabbodyafter"></div>
            </div>
            <div class="tabbody">
                <piechart class="piechart" :titleFontSize="titleFontSize" :pieData="pieData"></piechart>
                <div class="tabbodyafter"></div>
            </div>
        </div>
        <div class="tabmid">
            <div class="tabmidtop">
                <div class="tabmidtopTitle">2021年统计</div>
                <div class="tabmidtopBody">
                    <div class="tabmidtopBodyLeft">
                        <CountTo :start="0" :end="totalCount" :autoPlay="true" :duration="5000" />
                        <span> 单</span>
                    </div>
                    <div class="tabmidtopBodyRight">
                        <CountTo :start="0" :end="totalValue" :autoPlay="true" :duration="5000" />
                        <span> 万元</span>
                    </div>
                </div>
                <div class="tabmidtopBottom">
                    <div>销售单量</div>
                    <div>销售额</div>
                </div>
            </div>
            <mapChina @backMapData="backMapData"></mapChina>
        </div>
        <div class="bodyright">
            <div class="tabbody">
                <linechart class="piechart" :titleFontSize="titleFontSize"></linechart>
                <div class="tabbodyafter"></div>
            </div>
            <div class="tabbody">
                <totalchart class="piechart" :titleFontSize="titleFontSize"></totalchart>
                <div class="tabbodyafter"></div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import mapChina from '@/components/driver/MapChina.vue'
import piechart from '@/components/driver/leftchart/piechart.vue'
import rankchart from '@/components/driver/leftchart/rankchart.vue'
import linechart from '@/components/driver/rightchart/linechart.vue'
import totalchart from '@/components/driver/rightchart/totalchart.vue'
import elementResizeDetectorMaker from 'element-resize-detector'
import { useRoute } from 'vue-router'
import { reactive, onMounted, toRefs, ref, nextTick } from 'vue'
export default {
    name: 'driver',
    isRouter: true,
    isChildren: true,
    components: {
        mapChina,
        piechart,
        rankchart,
        linechart,
        totalchart,
    },
    setup(props: any, content: any) {
        const route = useRoute()
        const data = reactive({
            totalCount: 0,
            totalValue: 0,
            pieData: [],
            titleFontSize: 15,
            body_ref: ref(),
        })
        onMounted(() => {
            content.emit('changeRouterIndex', route.query.routerIndex)
            const erd = elementResizeDetectorMaker()
            const dom = document.getElementById('bodyMap')
            if (dom)
                erd.listenTo(dom, () => {
                    nextTick(() => {
                        // 监听到事件后执行的业务逻辑
                        screenAdapter()
                    })
                })
        })
        /**
         * @desc 屏幕适配算法
         */
        const screenAdapter = () => {
            setTimeout(() => {
                data.titleFontSize = (data.body_ref.clientWidth / 100) * 0.8 // 15
            }, 1000)
        }
        /**
         * @desc 地图传递饼状图全国销量统计数据
         */
        const backMapData = (pieData: any, totalCount: number, totalValue: number) => {
            data.totalCount = totalCount
            data.totalValue = Math.round((totalValue / 10000) * 100) / 100
            data.pieData = pieData
        }
        return {
            ...toRefs(data),
            backMapData,
        }
    },
}
</script>
<style lang="less" scoped>
.welbody {
    height: 100%;
    width: 100%;
    background: radial-gradient(220% 105% at bottom center, #0b2570 10%, #04044b 40%, #0b2570 65%, #0070aa);
    display: flex;
    justify-content: center;
    align-items: center;
}
.bodyleft {
    flex: 1;
    height: 100%;
    width: 25%;
}
.bodyright {
    flex: 1;
    height: 100%;
    width: 25%;
}
.tabmid {
    position: relative;
    flex: 2;
    width: 50%;
    height: 100%;
}
.tabbody {
    background: url(../../assets/img/line.png) no-repeat;
    background-size: 100% 100%;
    height: 49%;
    width: 97.3%;
    position: relative;
    margin: 5px;
    border: 1px solid rgba(47, 137, 207, 0.2);
    &::after {
        content: '';
        position: absolute;
        height: 10px;
        width: 10px;
        top: 0px;
        left: 0px;
        border-top: 2px solid #02a6b5;
        border-left: 2px solid #02a6b5;
    }
    &::before {
        content: '';
        position: absolute;
        height: 10px;
        width: 10px;
        top: 0px;
        right: 0px;
        border-top: 2px solid #02a6b5;
        border-right: 2px solid #02a6b5;
    }
}
.piechart {
    height: 100%;
    width: 100%;
}
.tabbodyafter {
    &::after {
        content: '';
        position: absolute;
        height: 10px;
        width: 10px;
        bottom: 0px;
        left: 0px;
        border-bottom: 2px solid #02a6b5;
        border-left: 2px solid #02a6b5;
    }
    &::before {
        content: '';
        position: absolute;
        height: 10px;
        width: 10px;
        bottom: 0px;
        right: 0px;
        border-bottom: 2px solid #02a6b5;
        border-right: 2px solid #02a6b5;
    }
}
.tabmidtop {
    position: absolute;
    height: 120px;
    width: 60%;
    border: 2px solid rgba(13, 31, 107.6);
    left: 50%;
    background-color: rgba(13, 31, 107, 0.6);
    transform: translate(-50%, 0);
    /* 50%为自身尺寸的一半 */
}
.tabmidtopTitle {
    color: white;
    font-size: 1.1vw;
    padding: 8px 15px 5px;
}
.tabmidtopBody {
    display: flex;
    height: 50px;
    width: 95%;
    margin: 0 auto;
    border: 1px solid rgba(47, 137, 207, 0.2);
}
/*引入图标字体文件*/
@font-face {
    font-family: electronicFont;
    src: url(../../assets/图标字体/DS-DIGIT.TTF);
    font-weight: normal;
    font-style: normal;
}
.tabmidtopBodyLeft {
    flex: 1;
    position: relative;
    color: rgb(255, 235, 123);
    text-align: center;
    font-size: 2vw;
    line-height: 50px;
    font-family: 'electronicFont';
    span {
        &:nth-child(2) {
            font-size: 1vw;
        }
    }
    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 15px;
        width: 35px;
        border-top: 2px solid #02a6b5;
        border-left: 2px solid #02a6b5;
    }
    &::before {
        content: '';
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        height: 35px;
        width: 2px;
        background-color: rgba(46, 147, 224, 0.2);
    }
}
.tabmidtopBodyRight {
    flex: 1;
    position: relative;
    color: rgb(255, 235, 123);
    text-align: center;
    font-size: 2vw;
    line-height: 50px;
    font-family: 'electronicFont';
    span {
        &:nth-child(2) {
            font-size: 1vw;
        }
    }
    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        right: 0;
        height: 15px;
        width: 35px;
        border-bottom: 2px solid #02a6b5;
        border-right: 2px solid #02a6b5;
    }
}
.tabmidtopBottom {
    display: flex;
    margin-top: 4px;
    & > div {
        font-size: 0.8vw;
        flex: 1;
        color: rgb(180, 187, 210);
        text-align: center;
    }
}
</style>
