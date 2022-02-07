<template>
    <div class="right-body" id="body">
        <div class="overbox">
            <div class="bodyheart">
                <div class="body-top">
                    <div class="bodytop-heart">
                        <el-row>
                            <el-col :span="8"><img src="../../assets/img/查询数据列表.png" /> <span>仓库管理列表</span></el-col>
                            <el-col :span="8">
                                <div class="searchfa">
                                    <!-- 搜索框 -->
                                    <div class="search">
                                        <div class="search-right">
                                            <input type="text" placeholder="请输入用户姓名" @change="search" v-model="params.dname" />
                                            <button type="button" @click="search"></button>
                                        </div>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="8" class="topRightBox">
                                <div class="approvalBtn">
                                    <div :class="{ currentBtn: currentApprovalType }" @click="getApprovalType(true)">出库管理</div>
                                    <div :class="{ currentBtn: !currentApprovalType }" @click="getApprovalType(false)">入库管理</div>
                                </div>
                                <button class="bodyadd" @click="gethomeAdd()" v-if="false"><i class="el-icon-plus"></i>添加</button>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <div class="tablebody" v-loading="loading2" element-loading-text="拼命加载中">
                    <div class="mytable">
                        <div class="table-top">
                            <div
                                v-for="(item, index) in tableText.tableTitle"
                                :key="index"
                                colspan="1"
                                rowspan="1"
                                v-show="item !== '详情'"
                                :class="item === '需求单名' ? 'htop-th7' : 'htop-th1'"
                            >
                                <div class="cell">{{ item }}</div>
                            </div>
                        </div>
                        <vNone v-if="!list.length" />
                        <div class="tbody">
                            <div class="bodyLine" v-for="(item, key) in list" :key="key">
                                <div v-for="(data, index) in tableText.tableBody" :key="index" v-show="data !== 'comment'">
                                    <div class="cell" v-if="data !== 'opetation' && data !== 'importance' && data !== 'approvaltype' && data !== 'buytype'">
                                        {{ data === 'index' ? key + 1 : item[data] }}
                                    </div>
                                    <div class="cell" v-if="data === 'opetation'">
                                        <button class="roleBtn" @click="seeDialog(item)">处理代办</button>
                                    </div>
                                    <div class="cell" v-if="data === 'approvaltype' || data === 'buytype'">
                                        {{ item[data] === 1 ? '未完成' : '完成' }}
                                    </div>

                                    <div class="cell" v-if="data === 'importance' && item[data]">
                                        <span
                                            class="importantSpan"
                                            :style="{
                                                background: importanceList[item[data] - 1].color,
                                            }"
                                        >
                                            {{ importanceList[item[data] - 1].text }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <controlDialog
                        :dialogVisibleRole="dialogVisibleRole"
                        :url="urlTypeList[currentApprovalType]"
                        @closeDialog="closeDialog"
                        :currentList="currentList"
                        :roleId="roleId"
                        :openType="currentApprovalType"
                    >
                        <div>
                            <h3>{{ currentApprovalType ? '需求信息' : '采购信息' }}</h3>
                            <div class="dialogTopBody">
                                <span
                                    class="dialogTopBodyBox"
                                    v-show="item !== '序号' && item !== '操作'"
                                    v-for="(item, index) in tableText.tableTitle"
                                    :key="index"
                                >
                                    <span class="title">{{ item + '：' }}</span>
                                    <span v-if="tableText.tableBody[index] !== 'neednum' && tableText.tableBody[index] !== 'num'">{{
                                        currentList[tableText.tableBody[index]]
                                    }}</span>
                                    <span style="color: red" v-if="tableText.tableBody[index] === 'neednum' || tableText.tableBody[index] === 'num'">{{
                                        currentList[tableText.tableBody[index]] + currentList.unit
                                    }}</span>
                                </span>
                            </div>
                        </div>
                    </controlDialog>
                    <vDialog
                        ref="addDialog"
                        :dialogFormShow="dialogFormShow"
                        @updata="search"
                        :editDisabled="editDisabled"
                        @closeaddDialog="closeaddDialog"
                        :IntList="IntList"
                        :currentList="currentList"
                        :openType="openType"
                        name="itemList"
                    >
                    </vDialog>
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
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import homeMix from '@/mixins/tableControl'
import controlDialog from '@/components/ControlStock/ControlStockDialog.vue'
import { reactive, onMounted, toRefs, onUnmounted } from 'vue'
import $api from '@/service/api'
import $tables from '@/assets/data/tableData'
import { useRoute } from 'vue-router'

export default {
    mixins: [homeMix],
    components: {
        controlDialog,
    },
    setup(props: Record<string, any>, context: any) {
        const route = useRoute()
        const {  mixinsData, handleSizeChange, handleCurrentChange, gethomeAdd,  closeaddDialog } = homeMix.setup(props, context)
        const data = reactive({
            dialogVisibleRole: false,
            roleId: 0,
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
            currentApprovalType: true,
            editDisabled: ['itemid'],
            tableText: $tables.controlNeedList,
            IntList: ['stock'],
            urlTypeList: {
                true: {
                    search: 'controlStock/findOutRepositoryList',
                    add: 'controlStock/addOutRepository',
                    edit: 'controlStock/updateOutRepository',
                    delete: 'controlStock/deleteOutRepository',
                    Repos: 'controlStock/RepositoryOut',
                },
                false: {
                    search: 'controlStock/findInRepositoryList',
                    add: 'controlStock/addInRepository',
                    edit: 'controlStock/updateInRepository',
                    delete: 'controlStock/deleteInRepository',
                    Repos: 'controlStock/RepositoryIn',
                },
            },
        })
        onMounted(() => {
            mixinsData.thistime = setInterval(() => {
                search()
            }, 8000)
            context.emit('changeRouterIndex', route.query.routerIndex)
            getSearchUrl()
            // 调用方法获取后端数据
            search()
        })
        onUnmounted(() => {
            if (mixinsData.thistime) clearInterval(mixinsData.thistime)
        })
        /**
         * @desc 关闭弹窗
         */
        const closeDialog = () => {
            data.dialogVisibleRole = false
            search()
        }
        /**
         * @desc ajax请求后台数据 获得list数据 并用于分页
         */
        const search = async () => {
            const params = {
                page: mixinsData.params.page, // 传递当前是第几页参数
                limit: mixinsData.params.limit, // 传递每页显示多少条记录参数
                planName: data.currentApprovalType ? 2 : 1, // 传递搜索参数
            }
            await $api(mixinsData.searchUrl, params)
                .then((res: any) => {
                    mixinsData.list = res.list || [] // 获取里面的data数据
                    mixinsData.params.total = res.count // 获取后台传过来的总数据条数
                    // this.params.page = res.page // 将后端的当前页反传回来
                    mixinsData.loading2 = false
                })
                .catch(() => {
                    mixinsData.loading2 = false
                })
        }
        const seeDialog = (item:any) => {
            mixinsData.currentList = item
            data.dialogVisibleRole = true
        }
        /**
         * @desc 请求列表数据
         */
        const getSearchUrl = () => {
            mixinsData.searchUrl = 'controlStock/findAllNeed'
        }
        /**
         * @desc 顶部type页切换
         */
        const getApprovalType = (index: boolean) => {
            data.currentApprovalType = index
            data.tableText = index ? $tables.controlNeedList : $tables.constrolBuyList
            mixinsData.searchUrl = index ? 'controlStock/findAllNeed' : 'controlStock/findAllBuy'
            search()
        }
        return {
            ...toRefs(data),
            ...toRefs(mixinsData),
            closeDialog,
            getApprovalType,
            seeDialog,
            search,
            handleSizeChange, 
            handleCurrentChange, 
            gethomeAdd,
            closeaddDialog,
        }
    },
}
</script>
<style lang="less" scoped>
@import url('../../styles/right-table.less');
.overbox {
    .dialogTopBody {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 30px;
        &Box {
            font-size: 16px;
            padding: 10px 10px 0 10px;
            .title {
                font-weight: 700;
            }
        }
    }
}
.importantSpan {
    padding: 3px 15px;
    line-height: 24px;
    color: white;
    border-radius: 5px;
}
.searchfa {
    margin-left: 35px;
}
.search {
    margin-left: 5px;
    float: left;
    height: 30px;
    input {
        float: left;
        border: none;
        outline: none;
        width: 95.5%;
        height: 30px;
        padding-left: 13px;
        border: 2px solid #dadce0;
        border-right: 0;
        border-radius: 5px;
        color: black;
        font-size: 16px;
    }
    button {
        float: left;
        border: none;
        outline: none;
        height: 30px;
        width: 45px;
        cursor: pointer;
        position: absolute;
        top: 1.6px;
        right: 0;
        background: #dadce0;
        border-radius: 0 5px 5px 0;
        &:hover {
            background-color: #c8c8c8;
            box-shadow: 0 0 3px#c8c8c8;
        }
        &:active {
            padding-left: 1px;
            padding-top: 1px;
            background: #dadce0;
        }
        &:before {
            content: '\f002';
            font-family: FontAwesome;
            font-size: 16px;
            color: #f9f0da;
        }
    }
}
</style>
