<template>
    <div class="right-body" id="body">
        <div class="overbox">
            <div class="bodyheart">
                <div class="body-top">
                    <div class="bodytop-heart">
                        <el-row>
                            <el-col :span="8"><img src="../../assets/img/查询数据列表.png" /> <span>需求列表</span></el-col>
                            <el-col :span="8">
                                <div class="searchfa">
                                    <!-- 搜索框 -->
                                    <div style="opacity: 0">.</div>
                                </div>
                            </el-col>
                            <el-col :span="8" class="topRightBox">
                                <div class="approvalBtn" v-if="!showAdd">
                                    <div :class="{ currentBtn: currentApprovalType }" @click="getApprovalType(true)">个人待办</div>
                                    <div :class="{ currentBtn: !currentApprovalType }" @click="getApprovalType(false)">历史待办</div>
                                </div>
                                <div class="approvalBtn" v-if="showAdd">
                                    <el-button class="systemBtn" size="small" type="primary" plain @click="getPrint()">打 印</el-button>
                                    <el-button class="systemBtn" size="small" type="primary" plain @click="outData()">导 出</el-button>
                                </div>
                                <button class="bodyadd" @click="gethomeAdd()" v-if="showAdd"><i class="el-icon-plus"></i>添加</button>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <needSearch v-if="showAdd" @getSearchForm="getSearchForm" />
                <div class="tablebody" v-loading="loading2" element-loading-text="拼命加载中">
                    <div class="mytable">
                        <div class="table-top">
                            <div
                                v-for="(item, index) in tableText.tableTitle"
                                :key="index"
                                colspan="1"
                                rowspan="1"
                                :class="{
                                    'htop-th7': item === '需求标题',
                                    'htop-th2': item === '详情',
                                    'htop-ope1': item === '操作',
                                }"
                            >
                                <div class="cell">{{ item }}</div>
                            </div>
                        </div>
                        <vNone v-if="!list.length" />
                        <div class="tbody">
                            <div class="bodyLine" v-for="(item, key) in list" :key="key">
                                <div
                                    v-for="(data, index) in tableText.tableBody"
                                    :key="index"
                                    :class="{
                                        ['body-td3']: data === 'needtitle',
                                        ['body-td2']: data === 'comment',
                                        ['body-ope1']: data === 'opetation1',
                                    }"
                                >
                                    <div class="cell" v-if="data !== 'opetation1' && data !== 'opetation2'">
                                        {{ data === 'neednum' ? item[data] + (item.unit || '') : item[data] }}
                                    </div>
                                    <div class="bodyButton" v-if="data === 'opetation1'">
                                        <div class="cell" v-if="currentRouter === 'see'">
                                            <button class="modify" @click="seeData(item)" v-if="item.uptype == 0 || item.uptype == 4">编辑</button>
                                            <button
                                                class="delete"
                                                @click="deletedata({ needid: item.needid }, 'need/deleteNeed')"
                                                v-if="item.uptype == 0 || item.uptype == 4 || item.uptype == 5"
                                            >
                                                删除
                                            </button>
                                            <button class="modify" v-if="!item.uptype" @click="upData(item,dialogUrl)">提交</button>
                                            <button class="approval" @click="seeApproval(key)" v-if="item.uptype == 1 || item.uptype == 2 || item.uptype == 3">
                                                查看审批
                                            </button>
                                            <button class="approval" @click="seeApproval(key)" v-if="item.uptype == 4">驳回结果</button>
                                        </div>
                                        <div class="cell" v-if="currentRouter === 'approval' && currentApprovalType">
                                            <button class="writeApproval" @click="writeApproval(key)">审批</button>
                                        </div>
                                    </div>

                                    <div class="bodyButton" v-if="data === 'opetation2'">
                                        <div class="cell">
                                            <span
                                                class="tipsspan"
                                                :style="{
                                                    'background-color': select[item.uptype].color,
                                                    color: item.uptype == 0 ? 'black' : 'white',
                                                }"
                                            >
                                                {{ showStatus(item.uptype, item.planName, item.approvaltype) }}
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
                @updata="upTable()"
                @closeaddDialog="closeaddDialog"
                :IntList="IntList"
                :topChange="topChange"
                :currentList="currentList"
                :openType="openType"
                name="needList"
            >
            </vDialog>

            <vDrawer :listIn="list[currentIndex]" :urlList="drawerUrlList" typeName="need" :openType="drawOpenType" @close="drawerClose" ref="Draw"></vDrawer>
        </div>
    </div>
</template>
<script lang="ts">
import needSearch from '@/components/need/needSearch.vue'
import { reactive, onMounted, onUnmounted, toRefs, ref, computed } from 'vue'
import $api from '@/service/api'
import $tables from '@/assets/data/tableData'
import { useRoute } from 'vue-router'
import { needTs } from '@/type/homeType'
import { ElMessage, ElMessageBox } from 'element-plus'
import printJS from 'print-js'
export default {
    name: 'Need',
    isRouter: true,
    isChildren: true,
    components: {
        needSearch,
    },
    setup(props: Record<string, any>, context: any) {
        const route = useRoute()
        const data: needTs = reactive({
            statusColorList: ['#eee', 'rgb(92, 92, 143)', 'rgb(92, 92, 143)', 'rgb(23, 165, 23)', 'rgb(226, 63, 63)'],
            tableText: $tables.needList,
            dialogFormShow: false,
            drawerUrlList: {
                ressetApproval: 'need/startNeedActAgain',
                getApprovalList: 'need/findHistoty',
                passRequest: 'need/completeprocess',
                rejectRequest: 'need/deleteprocess',
            },
            dialogUrl: {
                startApproval: 'need/approvalNeed',
                upApproval: 'need/completeprocess',
            },
            params: {
                limit: 10, // 每页显示5条记录
                page: 1, // 当前是第几页
                total: 0, // 总共几条记录去分页
                searchName: '', // 查询数据
                selectName: '', // 查询状态
                department: '', // 需求单位
                itemtype: '', // 物料类别
                itemid: '', // 物料编号
                needday: '', // 需求时间
            },
            currentApprovalType: true,
            drawOpenType: 'see',
            IntList: ['needid', 'neednum', 'neederid'],
            topChange: 'needid',
            currentRouter: sessionStorage.getItem('currentRouter') || '',
            currentIndex: 1, // 查看审批数据
            showAdd: false,
            list: [
                {
                    needid: 1,
                    needtitle: '马佳辉1',
                    itemtype: '',
                    itemid: 1373201546,
                    neednum: '3',
                    needday: '5',
                    unit: 'kg',
                    neederid: '14',
                    comment: 'dsadsadas',
                    uptype: 0,
                },
                {
                    needid: 1,
                    needtitle: '马佳辉2',
                    itemtype: 5454165,
                    itemid: 1373201546,
                    neednum: '3',
                    needday: '5',
                    unit: 'kg',
                    neederid: '18',
                    comment: 'dsadsadasdsadasdsadsadas',
                    uptype: 1,
                },
                {
                    needid: 1,
                    needtitle: '马佳辉3',
                    itemtype: 5454165,
                    itemid: 1373201546,
                    neednum: '3',
                    needday: '5',
                    unit: 'kg',
                    neederid: '15',
                    comment: 'dsadsadas',
                    uptype: 2,
                },
                {
                    needid: 1,
                    needtitle: '马佳辉4',
                    itemtype: 5454165,
                    itemid: 1373201546,
                    neednum: '3',
                    unit: 'kg',
                    needday: '5',
                    neederid: '16',
                    comment: 'dsadsadas',
                    uptype: 3,
                },
            ],
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
            loading2: true,
            thistime: null,
            searchUrl: '',
            openType:'',
            Draw: ref(),
            currentList:{}
        })
        const showStatus = computed(() => {
            return function (type: number, plan: number, approvaltype: number) {
                if (type !== 3) return data.select[type].label
                else if (approvaltype === 1) return plan === 1 ? '待采购' : '待出库'
                else if (approvaltype === 2) {
                    return plan === 1 ? '完成采购' : '完成出库'
                }
            }
        })
        onMounted(() => {
            data.thistime = setInterval(() => {
                search()
            }, 8000)
            getTyp()
            getCurrentType()
        })
        onUnmounted(() => {
            if (data.thistime) clearInterval(data.thistime)
        })
        /**
         * @desc 更新图表
         */
        const upTable = () => {
            data.dialogFormShow = false
            search()
        }
        /**
         * @desc ajax请求后台数据 获得list数据 并用于分页
         */
        const search = async () => {
            const params = { ...data.params }
            await $api(data.searchUrl, params)
                .then((res: any) => {
                    data.list = res.list || [] // 获取里面的data数据
                    data.params.total = res.count // 获取后台传过来的总数据条数
                    data.loading2 = false
                })
                .catch(() => {
                    data.loading2 = false
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
         * @desc 打印调取数据库全部数据
         */
        const getPrint = async () => {
            const params = { ...data.params }
            await $api(data.searchUrl, params)
                .then((res: any) => {
                    const currentPrint = []
                    for (let i = 0; i < res.list.length; i++) {
                        currentPrint.push({
                            needid: res.list[i].needid,
                            needtitle: res.list[i].needtitle,
                            itemtype: res.list[i].itemtype,
                            itemid: res.list[i].itemid,
                            neednum: res.list[i].neednum + res.list[i].unit,
                            needday: res.list[i].needday,
                            neederid: res.list[i].neederid,
                            department: res.list[i].department,
                            comment: res.list[i].comment,
                            uptype: showStatus(res.list[i].uptype, res.list[i].planName, res.list[i].approvaltype),
                        })
                    }
                    setPrintJS(currentPrint)
                })
                .catch(() => {
                    data.loading2 = false
                })
        }
        /**
         * @desc 导出请求
         */
        const outData = () => {
            window.location.href = 'http://localhost:8081/controller_war/webneed/needResult'
        }
        /**
         * @desc 添加方法打开界面
         */
        const gethomeAdd = () => {
            data.openType = 'add'
            data.dialogFormShow = true
        }
        /**
         * @desc 打印方法
         */
        const setPrintJS = (currentPrint: any) => {
            const titleList = ['编号', '需求标题', '物料名称', '物料编号', '数量', '需求日期', '需求专员编号', '部门', '描述', '审批状态']
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
                header: '需求申报列表',
                // 样式设置
                scanStyles: false,
                gridStyle: 'border: 2px solid #3c3d3d; padding: 3px 1px;',
                gridHeaderStyle: 'color: black; padding: 3px 5px; border: 2px solid #3c3d3d;',
            })
        }
        /**
         * @desc 顶部搜索调用更新表格
         */
        const getSearchForm = (searchFrom: {
            searchName: string // 传递搜索参数
            selectName: string
            department: string // 需求单位
            itemtype: string // 物料类别
            itemid: string // 物料编号
            needday: string // 需求时间
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
                data.searchUrl = 'need/queryNeedActTask'
                data.drawOpenType = 'write'
                data.showAdd = false
            } else {
                data.searchUrl = 'need/getNeed'
                data.drawOpenType = 'see'
                data.tableText = $tables.needList
                data.currentApprovalType = true
                data.showAdd = true
            }
            search()
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
         * @desc 切换代办任务（审批）
         */
        const getApprovalType = (type: boolean) => {
            data.loading2 = true
            data.currentApprovalType = type
            data.searchUrl = type ? 'need/queryNeedActTask' : 'need/findFinishedNeed'
            data.tableText = type ? $tables.needList : $tables.needListHistry
            search()
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
                        message: '取消删除'
                    })
                }
            })
        }
        /**
         * @desc 打开查看抽屉
         */
        const seeApproval = (e: number) => {
            data.currentIndex = e
            data.Draw.showDraw()
        }
        /**
         * @desc 抽屉关闭事件
         */
        const drawerClose = () => {
            search()
        }
        /**
         * @desc 打开书写抽屉
         */
        const writeApproval = (e: number) => {
            data.currentIndex = e
            data.Draw.showDraw()
        }
        /**
         * @desc 关闭蒙版
         */
        const closeaddDialog = () => {
            data.dialogFormShow = false
        }
        /**
         * @desc 提交送审表单
         */
        const upData = (item:any, api:{startApproval:string, upApproval:string}) => {
            ElMessageBox.confirm('是否确定提交审批申请?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    startApproval(item, api)
                })
                .catch((err:string) => {
                    if (err === 'cancel') {
                        ElMessage('取消提交')
                    } else {
                        ElMessage({
                            type: 'error',
                            message: err
                        })
                    }
                })
        }
        /**
         * @desc 启动审批请求
         */
        const startApproval = async (item:any, api:{startApproval:string, upApproval:string}) => {
            const url = api.startApproval
            // const url = mixinsData.dialogUrl.startApproval
            const params = {
                needid: item.needid,
                buyid: item.buyid
            }
            await $api(url, { params }).then((res: any) => {
                upApproval(res.list[0].taskId, api.upApproval)
            })
        }
        /**
         * @desc 提交审批请求
         */
        const upApproval = async (taskId: string, urls:string) => {
            const url = urls
            // const url = mixinsData.dialogUrl.upApproval
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
        return {
            ...toRefs(data),
            showStatus,
            getSearchForm,
            outData,
            getPrint,
            seeApproval,
            drawerClose,
            writeApproval,
            getApprovalType,
            gethomeAdd,
            upData,
            seeData,
            deletedata,
            handleSizeChange,
            handleCurrentChange,
            closeaddDialog,
            upTable
        }
    },
}
</script>
<style lang="less" scoped>
@import url('../../styles/right-table.less');

.approvalBtn {
    /deep/ .el-button {
        padding: 8px 20px !important;
    }
}
.tipsspan {
    margin: 0 auto;
    display: block;
    border-radius: 3px;
    width: 75px;
    height: 27px;
    line-height: 27px;
    text-align: center;
}
</style>
<style lang="less">
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
