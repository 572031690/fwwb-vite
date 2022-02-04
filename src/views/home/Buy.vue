<template>
    <div class="right-body" id="body">
        <div class="overbox">
            <div class="bodyheart">
                <div class="body-top">
                    <div class="bodytop-heart">
                        <el-row>
                            <el-col :span="8"><img src="../../assets/img/查询数据列表.png" /> <span>订单列表</span></el-col>
                            <el-col :span="8">
                                <div class="searchfa">
                                    <div style="opacity: 0">.</div>
                                </div>
                            </el-col>
                            <el-col :span="8" class="topRightBox">
                                <div class="approvalBtn" v-if="!showAdd">
                                    <div :class="{ currentBtn: currentApprovalType }" @click="getApprovalType(true)">个人待办</div>
                                    <div :class="{ currentBtn: !currentApprovalType }" @click="getApprovalType(false)">历史待办</div>
                                </div>
                                <div class="approvalBtn" v-if="showAdd">
                                    <el-button class="systemBtn" type="primary" size="small" plain @click="getPrint()">打 印</el-button>
                                    <el-button class="systemBtn" type="primary" size="small" plain @click="outData()">导 出</el-button>
                                </div>
                                <button class="bodyadd" @click="gethomeAdd()" v-if="showAdd"><i class="el-icon-plus"></i>添加</button>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <buySearch v-if="showAdd" @getSearchForm="getSearchForm" />
                <div class="tablebody" v-loading="loading2" element-loading-text="拼命加载中" id="printTest">
                    <div class="mytable">
                        <div class="table-top">
                            <div
                                v-for="(item, index) in tableText.tableTitle"
                                :key="index"
                                colspan="1"
                                rowspan="1"
                                :class="item === '订单标题' ? 'htop-th2' : item === '操作' ? 'htop-ope1' : 'htop-th1'"
                            >
                                <div class="cell" v-show="item !== '重要程度' && item !== '到货日期' && item !== '需求日期' && item !== '编号'">
                                    {{ item }}
                                </div>
                                <div
                                    class="cellSort"
                                    @click="checkTriangle(sortList[item])"
                                    v-show="item === '重要程度' || item === '到货日期' || item === '需求日期' || item === '编号'"
                                >
                                    <div class="cellSortBox">
                                        <div
                                            v-if="showAdd"
                                            :style="{
                                                'border-bottom-color': params.sortType === sortList[item] ? 'rgb(77, 90, 204)' : 'rgb(189, 207, 228)',
                                            }"
                                            class="triangleTop"
                                        ></div>
                                        <!-- <div class="triangleBottom"> </div> -->
                                    </div>
                                    <div class="cell">{{ item }}</div>
                                </div>
                            </div>
                        </div>
                        <vNone v-if="!list.length" />
                        <!-- 数据列表 -->
                        <div class="tbody">
                            <div class="bodyLine" v-for="(item, key) in list" :key="key">
                                <div
                                    v-for="(data, index) in tableText.tableBody"
                                    :key="index"
                                    :class="data === 'buytitle' ? 'body-td2' : data === 'opetation1' ? 'body-ope1' : 'body-td1'"
                                >
                                    <div class="cell" v-if="data !== 'opetation1' && data !== 'opetation2' && data !== 'importance'">
                                        {{ data === 'num' ? item[data] + (item.unit || '') : item[data] }}
                                    </div>
                                    <div class="bodyButton" v-if="data === 'opetation1'">
                                        <div class="cell" v-if="currentRouter === 'see'">
                                            <button class="modify" @click="seeData(item)" v-if="item.uptype == 0 || item.uptype == 4">编辑</button>
                                            <button
                                                class="delete"
                                                @click="deletedata({ buyid: item.buyid }, 'buy/deleteBuy')"
                                                v-if="item.uptype == 0 || item.uptype == 4 || item.uptype == 5"
                                            >
                                                删除
                                            </button>
                                            <button class="modify" v-if="!item.uptype" @click="upData(item)">提交</button>
                                            <button class="approval" @click="seeApproval(key)" v-if="item.uptype == 1 || item.uptype == 2 || item.uptype == 3">
                                                查看审批
                                            </button>
                                            <button class="approval" @click="seeApproval(key)" v-if="item.uptype == 4">驳回结果</button>
                                        </div>
                                        <div class="cell" v-if="currentRouter === 'approval'">
                                            <button class="writeApproval" @click="writeApproval(key)">审批</button>
                                        </div>
                                    </div>
                                    <div class="cell" v-if="data === 'importance' && item[data]">
                                        <span class="importantSpan">{{ importanceList[item[data] - 1].text }}</span>
                                    </div>
                                    <div class="bodyButton" v-if="data === 'opetation2'">
                                        <div class="cell" style="backgournd-color: red">
                                            <span
                                                class="tipsspan"
                                                :style="{
                                                    'background-color': select[item.uptype].color,
                                                    color: item.uptype == 0 ? 'black' : 'white',
                                                }"
                                            >
                                                {{ showStatus(item.uptype, item.buytype) }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="table-bottom">
                <!-- 底部页码功能 -->
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="params.page"
                    :page-sizes="[5, 10]"
                    :page-size="params.limit"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="params.total"
                >
                </el-pagination>
            </div>
            <vDialog
                ref="addDialog"
                :dialogFormShow="dialogFormShow"
                @updata="search"
                @closeaddDialog="closeaddDialog"
                :IntList="IntList"
                :topChange="topChange"
                :currentList="currentList"
                :openType="openType"
                name="buyList"
            >
            </vDialog>
            <vDrawer :listIn="list[currentIndex]" :urlList="drawerUrlList" typeName="buy" :openType="drawOpenType" @close="drawerClose" ref="Draw"></vDrawer>
        </div>
    </div>
</template>
<script lang="ts">
import { reactive, onMounted, onUnmounted, toRefs, ref, computed } from 'vue'
import $api from '@/service/api'
import $tables from '@/assets/data/tableData'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus' 
import buySearch from '@/components/buy/buySearch.vue'
import { buyTs } from '@/type/homeType'
import printJS from 'print-js'

export default {
      components: {
        buySearch
      },
    setup(props: Record<string, any>, context: any) {
        const route = useRoute()
        const data:buyTs = reactive({
            statusColorList: ['#eee', 'rgb(92, 92, 143)', 'rgb(92, 92, 143)', 'rgb(23, 165, 23)', 'rgb(226, 63, 63)', 'rgb(98, 98, 207)'],
            tableText: $tables.buyList,
            dialogFormShow: false,
            drawerUrlList: {
                ressetApproval: 'buy/startBuyActAgain',
                getApprovalList: 'buy/findHistotyBuy',
                passRequest: 'buy/completeprocess',
                rejectRequest: 'buy/deleteprocess',
            },
            dialogUrl: {
                startApproval: 'buy/startBuyAct',
                upApproval: 'buy/completeprocess',
            },
            currentApprovalType: true,
            drawOpenType: 'see',
            searchUrl: '',
            currentRouter: sessionStorage.getItem('currentRouter') || '',
            IntList: ['buyid', 'num', 'buyerid', 'neederid', 'auditid'],
            topChange: 'buyid',
            currentIndex: 1, // 查看审批数据
            showAdd: false,
            Draw: ref(),
            importanceList: [
                {
                    text: '一般',
                    color: 'rgb(23, 165, 23)',
                },
                {
                    text: '紧急',
                    color: 'rgb(92, 92, 143)',
                },
                {
                    text: '加急',
                    color: 'rgb(226, 63, 63)',
                },
            ],
            params: {
                limit: 10, // 每页显示5条记录
                page: 1, // 当前是第几页
                total: 0, // 总共几条记录去分页
                searchName: '', // 查询数据
                selectName: '', // 查询状态
                sortType: -1,
                ordertype: 0,
                department: '', // 需求单位
                itemtype: '', // 物料类别
                itemid: '', // 物料编号
                btime: '', // 需求时间: '' // 需求时间
            },
            sortList: {
                编号: '',
                重要程度: 1,
                到货日期: 2,
                需求日期: 3,
            },
            currentList:{},
            select: [
                // 搜索框筛选数据
                {
                    value: 0,
                    label: '未送审',
                    color: '#eee',
                },
                {
                    value: 1,
                    label: '审核中',
                    color: 'rgb(92, 92, 143)',
                },
                {
                    value: 2,
                    label: '部门通过',
                    color: 'rgb(92, 92, 143)',
                },
                {
                    value: 3,
                    label: '经理通过',
                    color: 'rgb(23, 165, 23)',
                },
                {
                    value: 4,
                    label: '驳回',
                    color: 'rgb(226, 63, 63)',
                },
                {
                    value: 5,
                    label: '逾期',
                    color: 'rgb(98, 98, 207)',
                },
            ],
            // 表内静态数据列表
            list: [],
            loading2: true,
            thistime: null,
            openType: ''
        })
        const showStatus = computed(() => {
            return function(type: number, approvaltype: number)  {
                if (type !== 3) return data.select[type].label
                else if (approvaltype === 1) return '待采购'
                else if (approvaltype === 2) return '完成采购'
                return ''
            }
        })
        onMounted(() => {
            data.thistime = setInterval(() => {
                search()
            }, 8000)
            context.emit('changeRouterIndex', route.query.routerIndex)
            getTyp()
        })
        onUnmounted(() => {
            if(data.thistime) clearInterval(data.thistime)
        })

        /**
         * @desc 修改排序方法
         */
        const checkTriangle = (tips: number|string) => {
            if (data.params.sortType === tips) {
                data.params.sortType = 0
                data.params.ordertype = 0
            } else {
                data.params.sortType = tips
                if (data.params.sortType === '') data.params.ordertype = 1
            }
            search()
        }
        /**
         * @desc 提交送审表单
         */
        const upData = (item: any) => {
            if (!item.importance) {
                ElMessage.error('请补全采购数据！')
                return
            }
            ElMessageBox.confirm('是否确定提交审批申请?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(async () => {
                    startApproval(item)
                })
                .catch(err => {
                    if (err === 'cancel') {
                        ElMessage('取消提交')
                    } else {
                        ElMessage({
                            type: 'error',
                            message: err,
                        })
                    }
                })
        }
        /**
         * @desc 启动审批请求
         */
        const startApproval = async (item:any) => {
            const url = data.dialogUrl.startApproval
            const params = {
                needid: item.needid,
                buyid: item.buyid
            }
            await $api(url, { params }).then((res: any) => {
                upApproval(res.list[0].taskId)
            })
        }
        /**
         * @desc 提交审批请求
         */
        const upApproval = async (taskId: string) => {
            const url = data.dialogUrl.upApproval
            const params = {
                taskId: taskId
            }
            await $api(url, { params }).then(() => {
                ElMessage({
                    type: 'success',
                    message: '送审成功'
                })
                search()
            })
        }
        /**
         * @desc 导出请求
         */
        const outData = () => {
            window.location.href = 'http://localhost:8081/controller_war/webbuy/buyResult'
        }
        /**
         * @desc 打印调取数据库全部数据
         */
        const getPrint = async () => {
            const params = {
                limit: 0, // 每页显示5条记录
                page: 0, // 当前是第几页
                searchName: '', // 查询数据
                selectName: '', // 查询状态
            }
            await $api(data.searchUrl, params)
                .then((res:any) => {
                    const currentPrint = []
                    for (let i = 0; i < data.list.length; i++) {
                        currentPrint.push({
                            buyid: res.list[i].buyid,
                            buytitle: res.list[i].buytitle,
                            btime: res.list[i].btime,
                            arrivaltime: res.list[i].arrivaltime,
                            itemtype: res.list[i].itemtype,
                            itemid: res.list[i].itemid,
                            num: res.list[i].num,
                            importance: data.importanceList[res.list[i].importance - 1].text,
                            uptype: showStatus(res.list[i].uptype, res.list[i].buytype),
                        })
                    }
                    setPrintJS(currentPrint)
                })
                .catch(() => {
                    data.loading2 = false
                })
        }
        /**
         * @desc 打印方法
         */
        const setPrintJS = (currentPrint:any) => {
            const titleList = ['编号', '采购标题', '需求日期', '到货日期', '物料名称', '物料编号', '数量', '重要程度', '审批状态']
            let keys = 0
            const propertiesList = []
            for (const i in currentPrint[0]) {
                propertiesList.push({
                    field: i,
                    displayName: titleList[keys],
                    columnSize: 1,
                })
                keys++
            }
            printJS({
                printable: currentPrint,
                properties: propertiesList,
                type: 'json',
                header: '采购申报列表',
                // 样式设置
                scanStyles: false,
                gridStyle: 'border: 2px solid #3c3d3d; padding: 3px 1px;',
                gridHeaderStyle: 'color: black; padding: 3px 5px; border: 2px solid #3c3d3d;',
            })
        }
        /**
         * @desc ajax请求后台数据 获得list数据 并用于分页
         */
        const search = async () => {
            const params = { ...data.params }
            await $api(data.searchUrl, params)
                .then((res:any) => {
                    data.list = res.list || [] // 获取里面的data数据
                    data.params.total = res.count // 获取后台传过来的总数据条数
                    data.loading2 = false
                })
                .catch(() => {
                    data.loading2 = false
                })
        }
        /**
         * @desc 删除方法
         */
        const deletedata = (data:any, url: string) => {
            ElMessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async () => {
                await $api(url, {
                    params: data
                }).then((res: any) => {
                    if (res) {
                        ElMessage({
                            type: 'success',
                            message: '删除成功!'
                        })
                        search()
                    } else {
                        ElMessage.error('错了哦，删除失败')
                    }
                })
            }).catch((err:any) => {
                if (err === 'cncel') {
                    ElMessage('取消删除')
                } else {
                    ElMessage({
                        type: 'error',
                        message: err
                    })
                }
            })
        }
        /**
         * @desc 页码
         */
        const handleSizeChange = (val: number) => {
            data.params.limit = val // 设置每页多少条记录
            search()
        }
        const handleCurrentChange = (val: number) => {
            data.params.page = val
            search()
        }
        /**
         * @desc 添加方法打开界面
         */
        const gethomeAdd = () => {
            data.openType = 'add'
            data.dialogFormShow = true
        }
        /**
         * @desc 修改表单
         */
        const seeData = (e:any) => {
            data.openType = 'edit'
            data.currentList = e
            data.dialogFormShow = true
        }
        /**
         * @desc 关闭蒙版
         */
        const closeaddDialog = () => {
            data.dialogFormShow = false
        }
        /**
         * @desc 顶部搜索调用更新表格
         */
        const getSearchForm = (searchFrom:{
            searchName: string, // 传递搜索参数
                selectName: string,
                department: string, // 需求单位
                itemtype: string, // 物料类别
                itemid: string, // 物料编号
                btime: string // 需求时间
        }) => {
            Object.assign(data.params, searchFrom)
            search()
        }
        /**
         * @desc 获取是管理员打开还是专员打开
         */
        const getCurrentType = () => {
            data.currentRouter = sessionStorage.getItem('currentRouter') || ''
            context.emit('changeRouterIndex', route.query.routerIndex)
            getTyp()
        }
        /**
         * @desc 获取登录账号信息
         */
        const getTyp = () => {
            if (data.currentRouter === 'approval') {
                data.searchUrl = 'buy/queryBuyActTask'
                data.drawOpenType = 'write'
                data.showAdd = false
            } else {
                data.searchUrl = 'buy/getBuy'
                data.drawOpenType = 'see'
                data.tableText = $tables.buyList
                data.currentApprovalType = true
                data.showAdd = true
            }
            search()
        }
        /**
         * @desc 切换代办任务（审批）
         */
        const getApprovalType = (type:boolean) => {
            data.currentApprovalType = type
            data.searchUrl = type ? 'buy/queryBuyActTask' : 'buy/findFinishedBuy'
            data.tableText = type ? $tables.buyList : $tables.buyListHistry
            search()
        }
        
        /**
         * @desc 打开查看抽屉
         */
        const seeApproval = (e:number) => {
            data.currentIndex = e
            data.Draw.showDraw()
        }
        /**
         * @desc 打开书写抽屉
         */
        const writeApproval = (e:number) => {
            data.currentIndex = e
            data.Draw.showDraw()
        }
        /**
         * @desc 抽屉关闭事件
         */
        const drawerClose = () => {
            search()
        }
        return {
            ...toRefs(data),
            showStatus,
            checkTriangle,
            upData,
            getSearchForm,
            getApprovalType,
            getCurrentType,
            drawerClose,
            writeApproval,
            seeApproval,
            outData,
            deletedata,
            handleSizeChange,
            handleCurrentChange,
            gethomeAdd,
            getPrint,
            seeData,
            closeaddDialog
        }
    },
}
</script>
<style lang="less" scoped>
@import url('../../assets/less/right-table.less');
.approvalBtn {
    /deep/ .el-button {
        padding: 8px 20px !important;
    }
}
.cellSort {
    display: flex;
    cursor: pointer;
    &Box {
        margin-right: 2px;
        .triangleTop {
            border-style: solid;
            border-width: 7px;
            border-color: transparent transparent rgb(189, 207, 228) transparent;
            width: 0px;
            height: 0px;
            margin-bottom: 1px;
        }
        .triangleBottom {
            border-style: solid;
            border-width: 6px;
            border-color: rgb(189, 207, 228) transparent transparent transparent;
            width: 0px;
            height: 0px;
        }
    }
}
.tipsspan {
    display: block;
    border-radius: 3px;
    width: 75px;
    height: 27px;
    line-height: 27px;
    text-align: center;
}
.selectAvro {
    div {
        .el-input__inner {
            text-align: center;
            padding: 0 24px 0 5px;
            border-radius: 4px 0 0 4px;
            &:focus {
                border-color: #dadce0;
            }
        }
    }
}
.search {
    .el-select {
        .el-input {
            &.is-focus {
                .el-input__inner {
                    border-color: #dadce0;
                }
            }
        }
    }
}
</style>
