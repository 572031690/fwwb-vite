<template>
    <div class="right-body" id="body">
        <div class="overbox">
            <div class="bodyheart">
                <div class="body-top">
                    <div class="bodytop-heart">
                        <el-row>
                            <el-col :span="8"><img src="../../assets/img/查询数据列表.png" /> <span>权限列表</span></el-col>
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
                            <el-col :span="8" v-if="$store.getters.getPermission.includes('admin:addPerm')" class="topRightBox">
                                <button class="bodyadd" @click="gethomeAdd()"><i class="el-icon-plus"></i>添加</button></el-col
                            >
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
                                :class="item === '描述' ? 'htop-th3' : item === '需求单名' ? 'htop-th7' : 'htop-th1'"
                            >
                                <div class="cell">{{ item }}</div>
                            </div>
                        </div>
                        <vNone v-if="!list.length" />
                        <div class="tbody">
                            <div class="bodyLine" v-for="(item, key) in list" :key="key">
                                <div v-for="(data, index) in tableText.tableBody" :key="index" :class="{ 'body-td4': data === 'comment' }">
                                    <div class="cell" v-if="data !== 'opetation' && data !== 'isDisabled'">
                                        {{ data === 'index' ? key + 1 : item[data] }}
                                    </div>
                                    <div class="cell" v-if="data === 'isDisabled'">
                                        <el-switch
                                            :name="item.id.toString()"
                                            v-model="item.isDisabled"
                                            active-color="#ff4949"
                                            inactive-color="#13ce66"
                                            @change="setStatus(item.id, key)"
                                        >
                                        </el-switch>
                                        {{ item.isDisabled ? '禁用' : '正常' }}
                                    </div>

                                    <div class="cell" v-if="data === 'opetation'">
                                        <button class="modify" @click="seeData(item)">编辑</button>
                                        <button class="delete" @click="deletedata({ id: item.id }, 'home/permission/deletePerm')">删除</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <vDialog
                        ref="addDialog"
                        :dialogFormShow="dialogFormShow"
                        @updata="search"
                        :editDisabled="editDisabled"
                        @closeaddDialog="closeaddDialog"
                        :currentList="currentList"
                        :openType="openType"
                        name="permissionList"
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
import { reactive, onMounted, toRefs } from 'vue'
import $tables from '@/assets/data/tableData'
import { useRoute } from 'vue-router'
import $api from '@/service/api'
import { ElMessage } from 'element-plus'

export default {
    mixins: [homeMix],
    setup(props: Record<string, any>, context: any) {
        const route = useRoute()
        const { deletedata, mixinsData, handleSizeChange, handleCurrentChange, seeData, closeaddDialog } = homeMix.setup(props, context)
        const data = reactive({
            editDisabled: ['id'],
            tableText: $tables.permList,
            dialogFormShow: false,
            list: [],
        })
        onMounted(() => {
            context.emit('changeRouterIndex', route.query.routerIndex)
            getSearchUrl()
            // 调用方法获取后端数据
            search()
        })
        /**
         * @desc 请求用户数据
         */
        const search = async () => {
            await $api(mixinsData.searchUrl, {
                params: {
                    page: mixinsData.params.page, // 传递当前是第几页参数
                    limit: mixinsData.params.limit, // 传递每页显示多少条记录参数
                    searchName: mixinsData.params.dname, // 传递搜索参数
                    selectName: mixinsData.params.selectValue, // 筛选参数
                },
            })
                .then((res: any) => {
                    mixinsData.list = res.list || [] // 获取里面的data数据
                    getEmitData()
                    mixinsData.params.total = res.count // 获取后台传过来的总数据条数
                    mixinsData.params.page = res.page // 将后端的当前页反传回来
                    mixinsData.loading2 = false
                })
                .catch(() => {
                    mixinsData.loading2 = false
                })
        }
        /**
         * @desc 更改状态
         */
        const setStatus = async (id: number, key: number) => {
            const url = 'permission/updatePermissionStatus'
            const params = {
                id: id,
                isDisabled: mixinsData.list[key].isDisabled ? 1 : 0,
            }
            await $api(url, params)
                .then(() => {
                    ElMessage.success('更改状态成功')
                })
                .catch(() => {
                    setTimeout(() => {
                        mixinsData.list[key].isDisabled = !mixinsData.list[key].isDisabled
                    }, 400)
                })
        }
        /**
         * @desc 初始化请求得到的list里的isDisabled，把1变成true，0变成false
         */
        const getEmitData = () => {
            mixinsData.list.forEach(function (item: any) {
                if (item.isDisabled) {
                    item.isDisabled = true
                } else {
                    item.isDisabled = false
                }
            })
        }
        /**
         * @desc 添加方法打开界面
         */
        const gethomeAdd = () => {
            mixinsData.openType = 'add'
            mixinsData.dialogFormShow = true
        }
        /**
         * @desc 请求列表数据
         */
        const getSearchUrl = () => {
            mixinsData.searchUrl = 'permission/listPerm'
        }
        return {
            ...toRefs(data),
            ...toRefs(mixinsData),
            setStatus,
            search,
            deletedata,
            handleSizeChange,
            handleCurrentChange,
            gethomeAdd,
            seeData,
            closeaddDialog,
        }
    },
}
</script>
<style lang="less" scoped>
@import url('../../assets/less/right-table.less');

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
