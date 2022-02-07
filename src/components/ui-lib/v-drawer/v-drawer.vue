<template>
    <div class="approvalDrawar">
        <el-drawer
            title="审批信息"
            :destroy-on-close="true"
            :before-close="handleClose"
            v-model="dialog"
            direction="rtl"
            custom-class="demo-drawer"
            ref="drawer"
            :size="openType === 'write' ? '90%' : 585"
        >
            <div class="drawercenter">
                <div class="drawerStyle" :style="{ width: openType === 'write' ? '760px' : '520px' }">
                    <div class="drawertopstatus" v-if="openType === 'see'">
                        <el-steps :space="200" align-center :active="listIn.uptype === 4 ? 0 : listIn.uptype" finish-status="success">
                            <el-step title="待审核"></el-step>
                            <el-step title="部门通过"></el-step>
                            <el-step title="通过"></el-step>
                        </el-steps>
                    </div>
                    <div class="drawerFormBox">
                        <div
                            :class="{
                                formBody: openType === 'see',
                                tableBody: openType === 'write',
                            }"
                        >
                            <el-form :model="listIn" label-width="120px" v-if="openType === 'write'">
                                <el-form-item :label="item.label + '：'" v-for="(item, index) in drawerText[typeName]" :key="index">
                                    <span v-if="item.model !== 'comment'">{{
                                        item.model !== 'neednum' && item.model !== 'num' ? listIn[item.model] : listIn[item.model] + listIn.unit
                                    }}</span>
                                    <div v-if="item.model === 'comment'" class="drawerText">
                                        {{ listIn[item.model] }}
                                    </div>
                                </el-form-item>
                            </el-form>
                            <div class="drawerInputBox" v-if="openType === 'write'">
                                <h3>审批意见</h3>
                                <hr />
                                <br />
                                <div class="inputBox">
                                    <el-input type="textarea" :rows="4" placeholder="请输入意见" v-model="opinion"> </el-input>
                                </div>
                            </div>

                            <div class="drawerApprovalBox" v-if="openType === 'see'">
                                <h3>审批详情</h3>
                                <hr />
                                <br />
                                <div class="ApprovalListBlock">
                                    <el-timeline>
                                        <el-timeline-item
                                            v-for="(item, key) in list"
                                            :icon="typeList[parseInt(item.id) - 1].icon"
                                            :color="typeList[parseInt(item.id) - 1].color"
                                            size="large"
                                            :key="key"
                                            :timestamp="item.endTime"
                                            placement="top"
                                        >
                                            <el-card>
                                                <div class="departmentId">
                                                    {{ parseInt(item.id) === 2 ? '部门经理' : parseInt(item.id) === 3 ? '总经理' : '' }}
                                                </div>
                                                <span style="font-weight: bold">{{ typeList[parseInt(item.id) - 1].title }}</span
                                                ><span v-if="item.auther"> 审批人：{{ item.auther }}</span>
                                                <br />
                                                <span v-show="item.upname"> 提交人：{{ item.upname }}</span>
                                                <p v-show="item.text">审批意见：{{ item.text }}</p>
                                            </el-card>
                                        </el-timeline-item>
                                    </el-timeline>
                                </div>
                            </div>

                            <div class="demo-drawer__footer">
                                <div v-if="openType === 'see'">
                                    <el-button @click="cancelForm">关 闭</el-button>
                                    <el-button v-show="listIn.uptype === 4" type="primary" @click="upData()" :loading="loading">{{
                                        loading ? '提交中 ...' : '再次提交'
                                    }}</el-button>
                                </div>
                                <div v-else>
                                    <el-button @click="cancelForm">关 闭</el-button>
                                    <el-button @click="witeApproval('reject')" type="danger">驳 回</el-button>
                                    <el-button @click="witeApproval('pass')" type="success">通 过</el-button>
                                </div>
                            </div>
                        </div>
                        <div class="drawerApprovalBoxRight" v-if="openType === 'write'">
                            <h3>审批详情</h3>
                            <hr />
                            <br />
                            <div class="ApprovalListRightBlock">
                                <el-timeline>
                                    <el-timeline-item
                                        v-for="(item, key) in list"
                                        :icon="typeList[parseInt(item.id) - 1].icon"
                                        :color="typeList[parseInt(item.id) - 1].color"
                                        size="large"
                                        :key="key"
                                        :timestamp="item.endTime"
                                        placement="top"
                                    >
                                        <el-card>
                                            <div class="departmentId">
                                                {{ parseInt(item.id) === 2 ? '部门经理' : parseInt(item.id) === 3 ? '总经理' : '' }}
                                            </div>
                                            <span style="font-weight: bold">{{ typeList[parseInt(item.id) - 1].title }}</span
                                            ><span v-if="item.auther"> 审批人：{{ item.auther }}</span>
                                            <br />
                                            <span v-show="item.upname"> 提交人：{{ item.upname }}</span>
                                            <p v-show="item.text">审批意见：{{ item.text }}</p>
                                        </el-card>
                                    </el-timeline-item>
                                </el-timeline>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script lang="ts">
import { drawerText } from '@/assets/data/drawerData' // 表单字段名称和label显示内容数据
import { reactive, toRefs, nextTick } from 'vue'
import $api from '@/service/api'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
    name: 'vDrawer',
    props: {
        /**
         * @desc 表单数据
         */
        listIn: {
            type: Object,
            default: () => {
                return {}
            },
        },
        /**
         * @desc 获取drawerText对应当前表的数据
         */
        typeName: {
            type: String,
            default: () => {
                return ''
            },
        },
        /**
         * @desc 打开抽屉的类型 see write
         */
        openType: {
            type: String,
            default: () => {
                return ''
            },
        },
        /**
         * @desc 请求地址数据
         */
        urlList: {
            type: Object,
            default: () => {
                return {}
            },
        },
    },
    setup(props: any, content: any) {
        const data = reactive({
            size: '30%',
            dialog: false,
            loading: false,
            drawerText,
            opinion: '',
            typeList: [
                {
                    title: '提交申请',
                    icon: '',
                    color: '',
                },
                {
                    title: '通过',
                    icon: 'el-icon-check',
                    color: '#0bbd87',
                },
                {
                    title: '通过',
                    icon: 'el-icon-check',
                    color: '#0bbd87',
                },
                {
                    title: '驳回',
                    icon: 'el-icon-close',
                    color: 'red',
                },
            ],
            // 时间线
            list: [],
            form: {
                needid: '25',
                needtitle: '数据表',
                itemtype: '对',
                itemid: '156',
                neednum: '25000',
                needday: '2019/5/6',
                neederid: '156',
                comment: '458',
                uptype: 2,
            },
            // 进度步骤条
            active: 0,
        })
        /**
         * @desc 提交审批
         */
        const upData = () => {
            if (data.loading) return
            ElMessageBox.confirm('确定要提交表单吗？')
                .then(()=> {
                    data.loading = true
                    resetApproval()
                })
                .catch(() => {})
        }
        /**
         * @desc 驳回后重启审批请求
         */
        const resetApproval = async () => {
            const url = props.urlList.ressetApproval
            const params = {
                buyid: props.listIn.buyid,
                needid: props.listIn.needid,
            }
            $api(url, { params }).then((res: any) => {
                if (res.code === '101') {
                    resetUpApproval(res.list.taskId)
                }
            })
        }
        /**
         * @desc 驳回后重启提交审批请求
         */
        const resetUpApproval = async (taskId: number) => {
            const url = props.urlList.passRequest
            const params = {
                text: '',
                taskId,
            }
            $api(url, { params }).then((res:any) => {
                if (res.code === '101') {
                    ElMessage.success('重新提交审批成功')
                    data.loading = false
                    data.dialog = !data.dialog
                    content.emit('close')
                }
            })
        }
        /**
         * @desc 关闭抽屉之前回调
         */
        const handleClose = () => {
            data.list = []
            data.opinion = ''
            data.dialog = !data.dialog
        }
        /**
         * @desc 关闭抽屉方法
         */
        const cancelForm = () => {
            data.loading = false
            data.list = []
            data.opinion = ''
            data.dialog = !data.dialog
        }
        /**
         * @desc 获取审批记录信息请求
         */
        const searchApprovalList = async () => {
            const url = props.urlList.getApprovalList
            const params = {
                needid: props.listIn.needid,
                buyid: props.listIn.buyid,
            }
            await $api(url, { params }).then((res: any) => {
                data.list = res.list
            })
        }
        /**
         * @desc 打开抽屉方法
         */
        const showDraw = () => {
            data.dialog = !data.dialog
            nextTick(() => {
                searchApprovalList()
            })
        }
        /**
         * @desc 审批（驳回/通过）
         */
        const witeApproval = (type: string) => {
            ElMessageBox.confirm(type === 'reject' ? '是否确定驳回此申请' : '是否确定通过此申请', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                approvalAct(type)
            })
        }
        /**
         * @desc 审批请求
         */
        const approvalAct = (type: string) => {
            const url = type === 'pass' ? props.urlList.passRequest : props.urlList.rejectRequest
            const params = {
                text: data.opinion,
                taskId: props.listIn.taskId,
            }
            $api(url, { params })
                .then((res: any) => {
                    if (res.code === '101') {
                        data.loading = false
                        data.dialog = !data.dialog
                       ElMessage.success('审批成功')
                        data.list = []
                        data.opinion = ''
                        content.emit('close')
                    }
                })
                .catch(() => {})
        }
        return {
            ...toRefs(data),
            upData,
            handleClose,
            cancelForm,
            showDraw,
            witeApproval
        }
    },
}
</script>

<style lang="less" >
.approvalDrawar {
    .drawercenter {
        border-top: 1px solid #eee;
        width: 100%;
        display: flex;
        justify-content: center;
        overflow: auto;
    }
    .drawerStyle {
        margin-top: 20px;
        padding: 0px 25px;
        height: 780px;
    }

    .drawertopstatus {
        margin-bottom: 30px;
    }
    .drawerFormBox {
        height: 88%;
        width: 100%;
        display: flex;
        .formBody {
            height: 100%;
            width: 80%;
            .tableBody {
                width: 54%;
            }
        }
    }
    .drawerApprovalBox {
        margin-left: 40px;
        height: 100%;
        width: 100%;
        .ApprovalListBlock {
            height: 92%;
            // width: 70%;
            padding-right: 30%;
            overflow: auto;
            padding-left: 6px;
        }
    }
    .departmentId {
        font-weight: 600;
        font-size: 15px;
        color: rgb(177, 7, 16);
    }
    .drawerApprovalBoxRight {
        margin-left: 20px;
        padding: 0 30px;
        height: 720px;
        border-left: 2px dashed #eee;
        .ApprovalListRightBlock {
            overflow: auto;
            padding: 0 10px;
            height: 90%;
        }
    }
    .drawerInputBox {
        margin: 30px 0 20px;
        .inputBox {
            padding: 0 10px;
        }
    }
    .demo-drawer__footer {
        position: absolute;
        left: 50%;
        transform: translate(-50%);
        bottom: 3%;
        text-align: center;
    }
    .drawerText {
        border: 1px solid rgba(99, 94, 94, 0.3);
        border-radius: 5px;
        font-size: 16px;
        line-height: 18px;
        padding: 5px;
        width: 270px;
        margin-top: 6px;
        min-height: 50px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        word-break: break-all;
    }
    .el-drawer__header {
        margin-bottom: 22px !important;
        span {
            text-align: center;
            font-weight: 700;
            font-size: 20px;
        }
    }
}
</style>
