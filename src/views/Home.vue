<template>
    <div id="Home">
        <div :class="{ leftNavigation: navshow, leftNavigationChange: !navshow }">
            <div v-for="(item, index) in routerList" v-show="item.showtab" :key="index">
                <div @click="judgeType(item, index)" class="navhome">
                    <div class="checkLineDiv" v-if="item.index == checkIndex"></div>
                    <img :src="item.imgSrc" class="navhome-img" />
                    <span
                        :class="{
                            spans1: true,
                            checkBox: item.index == checkIndex,
                        }"
                        :ref="el => (LabelRefs[item.ref] = el)"
                        >{{ item.label }}</span
                    >
                    <img v-if="item.type === 'tips' && item.showtab" :src="item.imgtips" class="arrow" :ref="el => (arrowData[index] = el)" />
                </div>
                <div class="lineTips" v-if="index === 0"></div>
                <!-- 子列表 -->
                <div class="navhome-box" ref="navhomebox" v-if="item.childrenList.length">
                    <transition
                        :name="getSonTransition(item.childrenList) === 3 ? 'navhom' : getSonTransition(item.childrenList) === 2 ? 'navhomshort' : 'navhommin'"
                    >
                        <div class="navhome-son" v-show="item.navSonShow">
                            <div
                                @click="!itemson.disabled && goToRouter(itemson)"
                                v-for="(itemson, ind) in item.childrenList"
                                :key="ind"
                                v-show="itemson.showtab"
                            >
                                <div :class="!itemson.disabled ? 'namehome-son1' : 'disabledClick'">
                                    <div class="checkLineDiv" v-if="itemson.index == checkIndex"></div>
                                    <img :src="itemson.imgSrc" class="navson-img" />
                                    <span :ref="el => (LabelRefs[itemson.ref] = el)" :class="{ checkBox: itemson.index == checkIndex }">{{
                                        itemson.label
                                    }}</span>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
        </div>

        <div :class="{ rightNavigation: navshow, rightNavigations: !navshow }">
            <div class="rightnav-top">
                <div class="rightnav-topimg">
                    <img src="@/assets/img/heng.png" class="rightnav-topimghome" ref="rightnavtopimghome" @click="changeHomeImg()" />
                </div>

                <span class="home-page">首页</span>

                <div class="topright">
                    <span class="top-time">{{ nowTime }}</span>
                    <!-- 苹果图标 -->
                    <img src="/src/assets/img/titleImportant.png" class="timg" />

                    <!-- 退出下拉框 -->
                    <el-dropdown @command="gobacklogin">
                        <span class="el-dropdown-link">
                            欢迎你: <span class="adminname">{{ adminname }} </span><i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item>退出登陆</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
            <div class="rightbody">
                <router-view ref="viewBox" @changeRouterIndex="changeRouterIndex"></router-view>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { onMounted, ref, toRefs, reactive, computed } from 'vue'
import { routerList } from '@/assets/data/homeRouter'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { HomeTs } from '@/assets/data/type'

export default {
    name: 'Home',
    isRouter: true,
    setup() {
        const data: HomeTs = reactive({
            nowTime: '',
            thistime: '',
            key: 90,
            arrowflag: true,
            imghomeflag: true,
            adminname: '',
            permissionName: '',
            navshow: true,
            navSonShow: true,
            lastTime: 0, // 默认上一次点击时间为0
            admin: true,
            routerChioce: 1,
            checkIndex: 1,
            routerList: routerList || [],
            arrowData: [],
            timer: null,
            LabelRefs: {},
            rightnavtopimghome: ref(),
        })
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const reactData = toRefs(data)
        data.permissionName = JSON.parse(window.sessionStorage.getItem('permissionName') || '[]')
        store.commit('SET_PERMISSION_NAME', data.permissionName)
        data.adminname = window.sessionStorage.getItem('storeData') || '' // 获取浏览器缓存值
        onMounted(() => {
            initType(false)
            changeHomeImgCreate()
            nowTimes()
        })
        const getSonTransition = computed(() => {
            return function (list: { showtab: boolean }[]) {
                let index = 0
                list.forEach(item => {
                    if (item.showtab) index++
                })
                return index
            }
        })
        /**
         * @desc 导航栏点击样式切换
         */
        const changeRouterIndex = (index:number) => {
            data.checkIndex = index
        }
        /**
         * @desc 开始动画文字出现延迟
         */
        const changeHomeImgCreate = () => {
            changeNav()
            changeNav()
        }
        /**
         * @desc 右边栏三条杠动画事件
         */
        const changeNav = () => {
            // 动画class绑定
            data.navshow = !data.navshow
            let status = 'none'
            let rotate = 'rotate(90deg)'
            let times = 0
            // 首页旁边三条杠图标旋转和文字消失
            if (data.imghomeflag) {
                status = 'none'
                rotate = 'rotate(90deg)'
                times = 0
            } else {
                status = 'block'
                rotate = 'rotate(0deg)'
                times = 700
            }
            if (data.rightnavtopimghome) data.rightnavtopimghome.style.transform = rotate
            data.imghomeflag = !data.imghomeflag
            setTimeout(() => {
                for (let i in data.LabelRefs) {
                    data.LabelRefs[i].style.display = status
                }
                if (JSON.stringify(data.arrowData) !== '{}') {
                    data.arrowData.forEach((item: HTMLElement) => {
                        item.style.display = status
                    })
                }
            }, times)
        }
        const initType = (bool: boolean) => {
            for (let i = 1; i < data.routerList.length; i++) {
                routerList[i].showtab = bool
                if (routerList[i].childrenList.length) {
                    routerList[i].childrenList.forEach(item => {
                        if (item) item.showtab = false
                    })
                }
            }
            if (data.permissionName) {
                getAdminType()
            }
        }
        /**
         * @desc 根据角色判断显示
         */
        const getAdminType = () => {
            const constrolPermission = data.permissionName
            for (let i = 0; i < data.routerList.length; i++) {
                if (constrolPermission.includes(data.routerList[i].permissionName as string) && data.routerList[i].type === 'router') {
                    data.routerList[i].showtab = true
                }
                if (data.routerList[i].type === 'tips') {
                    data.routerList[i].childrenList.forEach(item => {
                        if (constrolPermission.includes(item.permissionName)) {
                            item.showtab = true
                            data.routerList[i].showtab = true
                        }
                    })
                }
            }
        }

        /**
         * @desc 开启监听器
         */
        const nowTimes = () => {
            data.thistime = setInterval(() => {
                timeFormate(new Date())
            }, 1000)
        }
        /**
         * @desc 显示当前时间（年月日时分秒）
         */
        const timeFormate = (timeStamp: Date) => {
            const year = new Date(timeStamp).getFullYear()
            const month = new Date(timeStamp).getMonth() + 1 < 10 ? '0' + (new Date(timeStamp).getMonth() + 1) : new Date(timeStamp).getMonth() + 1
            const date = new Date(timeStamp).getDate() < 10 ? '0' + new Date(timeStamp).getDate() : new Date(timeStamp).getDate()
            const hh = new Date(timeStamp).getHours() < 10 ? '0' + new Date(timeStamp).getHours() : new Date(timeStamp).getHours()
            const mm = new Date(timeStamp).getMinutes() < 10 ? '0' + new Date(timeStamp).getMinutes() : new Date(timeStamp).getMinutes()
            const ss = new Date(timeStamp).getSeconds() < 10 ? '0' + new Date(timeStamp).getSeconds() : new Date(timeStamp).getSeconds()
            data.nowTime = year + '年' + month + '月' + date + '日' + ' ' + hh + ':' + mm + ':' + ss
        }

        /**
         * @desc 判断点击左侧导航栏类型
         */
        const judgeType = (val: { type: string }, index: number) => {
            if (val.type === 'tips') changearrow(index)
            if (val.type === 'router') {
                goToRouter(val)
            }
        }
        /**
         * @desc 旋转子列箭头
         */
        const changearrow = (index: number) => {
            data.routerList[index].navSonShow = !data.routerList[index].navSonShow
            if (!data.routerList[index].navSonShow) {
                data.arrowData[index].style.transform = 'rotate(270deg)'
                data.arrowflag = !data.arrowflag
            } else {
                data.arrowData[index].style.transform = 'rotate(90deg)'
                data.arrowflag = !data.arrowflag
            }
        }
        /**
         * @desc 路由跳转
         */
        const goToRouter = (val: any) => {
            data.checkIndex = data.checkIndex
            if (route.query.routerIndex === val.index || val.disabled) return
            if (val.index === 21 || val.index === 22) {
                window.sessionStorage.setItem('currentRouter', 'see')
            }
            if (val.index === 31 || val.index === 32) {
                window.sessionStorage.setItem('currentRouter', 'approval')
            }
            if (
                (val.index === 21 && data.checkIndex === 31) ||
                (val.index === 31 && data.checkIndex === 21) ||
                (val.index === 22 && data.checkIndex === 32) ||
                (val.index === 32 && data.checkIndex === 22)
            ) {
                router.push({
                    // path: val.path,
                    query: { routerIndex: val.index },
                    // query: merge(route.query, { routerIndex: val.index })
                })
                // this.$refs.viewBox.getCurrentType()
            } else {
                router.push({
                    path: val.path,
                    query: { routerIndex: val.index },
                }) // 页面跳转
            }
        }
        const changeHomeImg = () => {
            changeNav()
        }
        /**
         * @desc 退出登陆方法
         */
        const gobacklogin = () => {
            ElMessageBox.confirm('是否退出登陆', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                sessionStorage.clear() // 删除所有数据
                initType(false)
                store.commit('SET_PERMISSION_NAME', '')
                router.push({ name: 'login' }) // 直接跳转
                ElMessage({
                    type: 'success',
                    message: '退出登陆成功!',
                })
            })
        }
        return {
            ...reactData,
            judgeType,
            goToRouter,
            changeHomeImg,
            gobacklogin,
            getSonTransition,
            changeRouterIndex
        }
    },
}
</script>
<style lang="less" scoped>
#Home {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: row;
    //background: radial-gradient(220% 105% at top center, rgb(82, 81, 81) 10%, #000035 40%, #0b2570 65%, #0070aa);
    // background: linear-gradient(
    //   to top left,
    //   rgb(242, 246, 253),
    //   rgb(209, 223, 245),
    //   rgb(242, 246, 253),
    //   rgb(199, 206, 218)
    // );
    background-image: url('/src/assets/img/back-img.png');
    background-size: 100% 100%;
}
.leftNavigation {
    /* position: fixed; */
    display: inline-block;
    width: 10%;
    background-color: #304156;
    height: 100%;
    min-height: 815px;
    /*占满一个屏幕的高度 */
    animation: navlong 0.7s;
}
.leftNavigationChange {
    /* position: fixed; */
    width: 2.8%;
    background-color: #304156;
    height: 100vh;
    /*占满一个屏幕的高度 */
    animation: navshort 0.7s;
}
@keyframes navlong {
    0% {
        width: 2.8%;
    }
    100% {
        width: 10%;
    }
}

@keyframes navshort {
    0% {
        width: 10%;
    }
    100% {
        width: 2.8%;
    }
}
.leftNavigation {
    a {
        text-decoration: none;
    }
}

.navhome {
    position: relative;
    display: flex;
    flex-direction: row;
    /*水平排布*/
    align-items: center;
    height: 56px;
    width: 100%;
    background-color: #304156;
    transition: all 0.5s;
    &:hover {
        background-color: #263445;
        cursor: pointer;
    }
    span {
        display: none;
        font-size: 0.9vw;
        line-height: 0.9vw;
        color: #9fc6ff;
    }
}
.navhome-img {
    /* -webkit-transform:rotate(90deg); */
    width: 1.5vw;
    margin: 0 7%;
    margin-left: 13%;
    color: #409eff;
}
.arrow {
    display: none;
    margin-left: 5%;
    width: 15%;
    transition: all 0.5s;
    transform: rotate(90deg);
}
.navhom-enter-active,
.navhomshort-enter-active,
.navhommin-enter-active {
    transition: all 0.5s;
}
.navhom-leave-active,
.navhomshort-leave-active,
.navhommin-leave-active {
    transition: all 0.5s;
}
.navhom-enter-from,
.navhomshort-enter-from,
.navhommin-enter-from {
    height: 0;
}
.navhom-leave-to,
.navhomshort-leave-to,
.navhommin-leave-to {
    height: 0;
}
.navhom-enter-to {
    height: 159px;
}
.navhom-leave-from {
    height: 159px;
}
.navhomshort-enter-to {
    height: 105px;
}
.navhomshort-leave-from {
    height: 105px;
}
.navhommin-enter-to {
    height: 52.5px;
}
.navhommin-leave-from {
    height: 52.5px;
}
.home-page {
    font-size: 16px;
}
.navhome-son {
    position: relative;
    cursor: pointer;
    background-color: #1f2d3d;
    overflow: hidden;
    span {
        display: none;
        font-size: 0.8vw;
        line-height: 0.8vw;
        color: #9fc6ff;
        margin-left: 6%;
    }
}
.namehome-son1 {
    display: flex;
    flex-direction: row;
    /*水平排布*/
    align-items: center;
    transition: all 1.5s;
    width: 100%;
    height: 53px;
    &:hover {
        background-color: #001121;
    }
}
.disabledClick {
    display: flex;
    flex-direction: row;
    /*水平排布*/
    align-items: center;
    width: 100%;
    height: 53px;
    background-color: rgb(88, 88, 88);
    cursor: no-drop;
    span {
        color: rgb(49, 48, 48);
    }
    img {
        opacity: 0.6;
    }
}
.navson-img {
    width: 1.3vw;
    margin-left: 25%;
    color: #409eff;
}
.lineTips {
    height: 2px;
    background-color: rgb(35, 101, 201);
}
.checkBox {
    color: rgb(72, 117, 216) !important;
}
.checkLineDiv {
    position: absolute;
    height: 30px;
    width: 4px;
    left: 0;
    background-color: rgb(30, 149, 212);
}
.rightNavigation {
    display: inline-block;
    width: 90%;
    height: 100vh;
    /*占满一个屏幕的高度 */
    box-sizing: border-box;
    /* margin-left: 180px; */
    animation: rightNavlong 0.7s;
}
.rightNavigations {
    display: inline-block;
    width: 97.2%;
    height: 100vh; // 占满一个屏幕的高度
    box-sizing: border-box;
    // margin-left: 50px;
    animation: rightNavshort 0.7s;
}
@keyframes rightNavlong {
    0% {
        width: 97.2%;
    }
    100% {
        width: 90%;
    }
}
@keyframes rightNavshort {
    0% {
        width: 90%;
    }
    100% {
        width: 97.2%;
    }
}
.rightnav-top {
    width: 100%;
    height: 48px;
    display: flex;
    flex-direction: row;
    // background-color: #fff;
    // background: linear-gradient(
    //   to right,
    //   rgb(242, 246, 253),
    //   rgb(235, 240, 248),
    //   rgb(242, 246, 253)
    // );
    border-bottom: 1px solid #dadce0;
    border-top: 1px solid #dadce0;
    span {
        padding-top: 12px;
        /* margin-left: 10px; */
    }
}
.rightnav-topimg {
    padding: 0 14px;
    height: 50px;
}
.rightnav-topimghome {
    cursor: pointer;
    margin-top: 10px;
    height: 25px;
    transition: all 0.4s;
}
.top-time {
    color: #409eff;
    font-size: 14px;
    margin-top: 2px;
}
.topright {
    float: right;
    right: 1%;
    position: absolute;
    display: flex;
    align-items: center;
}
.timg {
    margin: 12px 6px 0;
    height: 30px;
    cursor: pointer;
    // border-radius: 10px;
}
.weltop {
    font-size: 14px;
}
#eldown {
    margin-top: 1px;
    font-size: 20px;
}
.elsign-out {
    padding-top: 13px;
}
/deep/.el-dropdown{
    margin-top: 10px;
}
.el-dropdown-link {
    cursor: pointer;
    color: #409eff;
    font-size: 15px;
}
.el-icon-arrow-down {
    font-size: 12px;
}
.adminname {
    color: black;
    font-size: 15px;
}
.rightbody {
    height: calc(100% - 48px);
    width: 100%;
}
</style>
