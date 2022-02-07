<template>
    <div id="constrolDialog">
        <el-dialog
            title="仓库管理"
            v-model="dialogVisibleRole"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            top="30px"
            width="1000px"
        >
            <div class="topText">
                <slot></slot>
            </div>
            <div class="tableRole">
                <div class="tableRoleTopAdd">
                    <div :class="showAdd ? 'textRole' : 'textRoleTitle'">
                        <span v-show="!showAdd" style="font-weight: 700">
                            仓库操作列表 {{ openType ? '出库' : '入库' }}{{ geTotalNum + currentList.unit }}/总共{{
                                (openType ? currentList.neednum : currentList.num) + currentList.unit
                            }}
                        </span>
                        <el-select style="width: 220px" v-show="showAdd" v-model="addData.itemid" placeholder="请选择">
                            <el-option v-for="item in optionsId" :key="item.itemid" :label="item.itemtype" :value="item.itemtype"> </el-option>
                        </el-select>
                    </div>
                    <div class="textRole">
                        <el-select style="width: 220px" v-show="showAdd" v-model="addData.name" placeholder="请选择">
                            <el-option v-for="item in optionsType" :key="item.itemid" :label="item.itemtype" :value="item.itemtype"> </el-option>
                        </el-select>
                    </div>
                    <div class="textRole">
                        <span v-show="showAdd">{{ openType ? currentList.needid : currentList.buyid }}</span>
                    </div>
                    <div class="textRole">
                        <el-input-number v-show="showAdd" v-model="addData.num" :step="50" :min="50" :max="999999999" label="描述文字"></el-input-number>
                    </div>
                    <div class="textRole">
                        <el-select style="width: 220px" v-show="showAdd" v-model="addData.unit" placeholder="请选择">
                            <el-option v-for="item in optionsUnit" :key="item.itemid" :label="item.itemtype" :value="item.itemtype"> </el-option>
                        </el-select>
                    </div>

                    <div class="textRole"></div>
                    <div class="textRole" v-if="!showAdd && geTotalNum < (openType ? currentList.neednum : currentList.num)">
                        <button class="bodyadd" @click="getAdd()"><i class="el-icon-plus"></i>添加</button>
                    </div>
                    <div class="textRole" v-if="showAdd">
                        <button class="modify" @click="saveAddData()">保存</button>
                        <button class="delete" @click="cancelAddData()">取消</button>
                    </div>
                </div>
                <div class="tableRoleTop">
                    <div v-for="(item, key) in tableList.tableTitle" :key="key">
                        <div class="textRole">
                            {{ item }}
                        </div>
                    </div>
                </div>
                <div class="tableRoleBody" v-for="(data, index) in list" :key="index">
                    <div v-for="(curr, ind) in tableList.tableBody" :key="ind" v-show="!data.editType">
                        <div class="textRole" v-if="curr !== 'opetation2' && curr !== 'opetation1'">
                            {{ data[curr] }}
                        </div>
                        <div class="textRole" v-if="curr === 'opetation1'">
                            <button class="roleBtn" @click="upStock(data)" v-if="!data.status">
                                {{ openType ? '出 库' : '入 库' }}
                            </button>
                            <span v-if="data.status">
                                {{ openType ? '已出库' : '已入库' }}
                            </span>
                        </div>
                        <div class="textRole" v-if="curr === 'opetation2'">
                            <button class="modify" @click="editData(data, index)" v-if="!data.status">编辑</button>
                            <el-popover placement="top" width="160" v-model="data.visible" v-if="!data.status">
                                <p>这是一段内容确定删除吗？</p>
                                <div style="text-align: right; margin: 0">
                                    <el-button size="mini" type="text" @click="data.visible = false">取消</el-button>
                                    <el-button type="primary" size="mini" @click="deletedata(data.id, index)">确定</el-button>
                                </div>
                                <button class="delete" slot="reference">删除</button>
                            </el-popover>
                        </div>
                    </div>
                    <div class="editBox" v-if="data.editType">
                        <div class="textRole">
                            <el-select style="width: 220px" v-model="editForm[index].itemid" placeholder="请选择">
                                <el-option v-for="item in optionsId" :key="item.itemid" :label="item.itemtype" :value="item.itemtype"> </el-option>
                            </el-select>
                        </div>
                        <div class="textRole">
                            <el-select style="width: 220px" v-model="editForm[index].name" placeholder="请选择">
                                <el-option v-for="item in optionsType" :key="item.itemid" :label="item.itemtype" :value="item.itemtype"> </el-option>
                            </el-select>
                        </div>
                        <div class="textRole">
                            {{ openType ? editForm[index].needid : editForm[index].buyid }}
                        </div>
                        <div class="textRole">
                            <el-input-number v-model="editForm[index].num" :step="50" :min="50" :max="999999999" label="描述文字"></el-input-number>
                        </div>
                        <div class="textRole">
                            <el-select style="width: 220px" v-model="editForm[index].unit" placeholder="请选择">
                                <el-option v-for="item in optionsUnit" :key="item.itemid" :label="item.itemtype" :value="item.itemtype"> </el-option>
                            </el-select>
                        </div>
                        <div class="textRole">
                            {{ editForm[index].time }}
                        </div>
                        <div class="textRole">
                            <button class="modify" @click="saveeditData(data, index)">保存</button>
                            <button class="delete" @click="cancelEditData(index)">取消</button>
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
                    :page-sizes="[5, 10, 15]"
                    :page-size="params.limit"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="params.total"
                >
                </el-pagination>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="closeDialog()">关 闭</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted, computed, watch } from 'vue'
import $tables from '@/assets/data/tableData'
import { controlStockDialogTs } from '@/type/homeType'
import { ElMessage } from 'element-plus' 
import $api from '@/service/api'

export default {
    props: {
        /**
         * @desc 控制弹窗打开关闭
         */
        dialogVisibleRole: {
            type: Boolean,
            default: () => {
                return false
            },
        },
        /**
         * @desc 弹窗打开类型是采购还是需求（false/true）
         */
        openType: {
            type: Boolean,
            default: () => {
                return true
            },
        },
        /**
         * @desc 角色id
         */
        roleId: {
            type: Number,
            default: () => {
                return 0
            },
        },
        /**
         * @desc 当前采购或者需求数据
         */
        currentList: {
            type: Object,
            default: () => {
                return {}
            },
        },
        /**
         * @desc 请求地址
         */
        url: {
            type: Object,
            default: () => {
                return {}
            },
        },
    },
    setup(props: any, context: any) {
        const data:controlStockDialogTs = reactive({
            visible: '',
            showAdd: false,
            addData: {
                itemid: '',
                name: '',
                needid: '',
                num: '',
                time: '',
                unit: '',
                buyid: '',
            },
            params: {
                limit: 10, // 每页显示5条记录
                page: 1, // 当前是第几页
                total: 0, // 总共几条记录去分页
                searchName: '', // 查询数据
                selectName: '', // 查询状态
            },
            editForm: {},
            tableList: {
                tableTitle: [],
                tableBody: []
            },
            loading2: true,
            list: [],
            optionsUnit: [],
            optionsType: [],
            optionsId: [],
        })
        const geTotalNum = computed(() => {
            let total = 0
            data.list.forEach((item: any) => {
                if (item.status) {
                    total += item.num
                }
            })
            return total
        })
        watch(
            () => props.dialogVisibleRole,
            function (val) {
                if (val) search()
            }
        )
        onMounted(() => {
            getUnit()
            getType()
            getId()
        })
        /**
         * @desc 关闭弹窗
         */
        const closeDialog = () => {
            cancelAddData()
            context.emit('closeDialog')
        }
        /**
         * @desc 获取代办数据
         */
        const search = async () => {
            data.tableList = props.openType ? $tables.controlOutStockList : $tables.controlInStockList
            const url = props.url.search
            data.params.selectName = props.openType ? props.currentList.needid : props.currentList.buyid
            const params = data.params
            await $api(url, { params })
                .then((res:any) => {
                    res.list.forEach((item:any) => {
                        item.editType = false
                        item.visible = false
                    })
                    data.list = res.list || [] // 获取里面的data数据
                    data.params.total = res.count // 获取后台传过来的总数据条数
                    data.loading2 = false
                })
                .catch(() => {
                    data.loading2 = false
                })
        }
        /**
         * @desc 编辑按钮点击事件
         */
        const editData = (item:any, index:number) => {
            data.editForm[index] = item
            data.list[index].editType = true
        }
        /**
         * @desc 保存编辑
         */
        const saveeditData = (data:any, index:number) => {
            const url = props.url.edit
            $api(url, data)
                .then((res:any) => {
                    if (res.code === '101') {
                        ElMessage.success('修改成功！')
                        cancelEditData(index)
                        search()
                    }
                })
                .catch(() => {})
        }
        /**
         * @desc 取消编辑
         */
        const cancelEditData = (index: number) => {
            data.list[index].editType = false
        }
        /**
         * @desc 操作入库/出库
         */
        const upStock = (item:any) => {
            const data = { ...item }
            const url = props.url.Repos
            $api(url, data)
                .then((res:any) => {
                    if (res.code === '101') {
                        ElMessage.success('仓库操作成功！')
                        search()
                    } else {
                        ElMessage.error(res.error)
                    }
                })
                .catch(() => {})
        }
        /**
         * @desc 添加按钮事件
         */
        const getAdd = () => {
            data.showAdd = !data.showAdd
        }
        /**
         * @desc 保存添加
         */
        const saveAddData = () => {
            data.addData.needid = props.currentList.needid || 1
            data.addData.buyid = props.currentList.buyid || 1
            data.addData.time = new Date()
            if (checkAdd()) {
                ElMessage.error('请填写完整！')
                return
            }
            const params = { ...data.addData }
            const url = props.url.add
            $api(url, params)
                .then((res:any) => {
                    if (res.code === '101') {
                        ElMessage.success('添加成功！')
                        cancelAddData()
                        search()
                    }
                })
                .catch(() => {})
        }
        /**
         * @desc 添加按钮验证
         */
        const checkAdd = () => {
            for (const i in data.addData) {
                if (!data.addData[i] && data.addData[i] !== 0) return true
            }
        }
        /**
         * @desc 取消添加
         */
        const cancelAddData = () => {
            for (const i in data.addData) {
                data.addData[i] = ''
            }
            data.showAdd = false
        }
        /**
         * @desc 删除事件
         */
        const deletedata = (id: number, index: number) => {
            data.list[index].visible = false
            const params = { id: id }
            const url = props.url.delete
            $api(url, { params })
                .then((res:any) => {
                    if (res.code === '101') {
                        ElMessage.success('删除成功！')
                        search()
                    }
                })
                .catch(() => {})
        }
        /**
         * @desc 页码
         */
        const handleSizeChange = (val:number) => {
            data.params.limit = val // 设置每页多少条记录
            search()
        }
        const handleCurrentChange = (val:number) => {
            data.params.page = val
            search()
        }
        /**
         * @desc 获取单位筛选框数据
         */
        const getUnit = () => {
            $api('item/findItemName', { params: { itemid: 7 } })
                .then((res:any) => {
                    data.optionsUnit = res.list
                })
                .catch(() => {})
        }
        /**
         * @desc 获取物料类别筛选框数据
         */
        const getType = () => {
            $api('item/findItemName', { params: { itemid: 1 } })
                .then((res:any) => {
                    data.optionsType = res.list
                })
                .catch(() => {})
        }
        /**
         * @desc 获取编码筛选框数据
         */
        const getId = () => {
            $api('item/findItemName', { params: { itemid: 16 } })
                .then((res:any) => {
                    data.optionsId = res.list
                })
                .catch(() => {})
        }
        return {
            ...toRefs(data),
            geTotalNum,
            closeDialog,
            search,
            editData,
            saveeditData,
            upStock,
            getAdd,
            saveAddData,
            handleSizeChange,
            handleCurrentChange,
            deletedata
        }
    },
}
</script>

<style lang="less" scoped>
.tableRole {
    max-height: 500px;
    min-height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
    margin-bottom: 15px;
    /deep/ .el-input__inner {
        border: none;
        padding: 0;
        text-align: center;
    }
    /deep/ .el-input-number__decrease {
        width: 20px;
    }
    /deep/ .el-input-number__increase {
        width: 20px;
    }
    &Top {
        display: flex;
        border-bottom: 1px solid rgb(235, 238, 245);
        &Add {
            display: flex;
            border-top: 1px solid rgb(235, 238, 245);
        }
    }
    &Body {
        display: flex;
        border-bottom: 1px solid rgb(235, 238, 245);
    }
    .bodyadd {
        height: 28px;
        width: 48px;
        margin: 2px 15px 0 0;
        margin-left: auto;
        vertical-align: middle;
        background-color: #fff;
        border-radius: 4px;
        outline: none;
        border: 1px solid #dadce0;
        font-size: 11px;
        cursor: pointer;
        &:hover {
            background-color: #f0f7ff;
            color: #8ebaed;
            border: 1px solid #8ebaed;
        }
        &:active {
            border: 1px solid #144379;
        }
    }
    .textLongRole {
        color: rgb(111, 115, 116);
        font-size: 14px;
        width: 300px;
        height: 50px;
        line-height: 50px;
    }
    .textRole {
        display: flex;
        justify-content: center;
        align-items: center;
        color: rgb(111, 115, 116);
        font-size: 15px;
        width: 120px;
        height: 50px;
        line-height: 50px;
    }
    .textRoleTitle {
        display: flex;
        align-items: center;
        color: rgb(111, 115, 116);
        font-size: 15px;
        width: 300px;
        height: 50px;
        line-height: 50px;
    }
    .btnRole {
        color: rgb(111, 115, 116);
        font-size: 14px;
        width: 60px;
        height: 50px;
        line-height: 50px;
    }
    .modify {
        color: #8c959c;
        background-color: white;
        cursor: pointer;
        &:hover {
            background-color: #f0f7ff;
            color: #8ebaed;
            border: 1px solid #8ebaed;
        }
        &:active {
            border: 1px solid #144379;
        }
    }
    button {
        outline: none;
        border: 0.5px solid #8c959c;
        text-align: center;
        font-size: 8px;
        line-height: 26px;
        height: 26px;
        margin: 0 3px;
        width: 41px;
        cursor: pointer;
        border-radius: 4px;
    }

    .delete {
        color: #fff;
        background-color: red;
        cursor: pointer;
        &:hover {
            background-color: #df808f;
        }
        &:active {
            background: red;
        }
    }
    .roleBtn {
        color: white;
        width: 60px;
        border: 0.5px solid rgb(51, 131, 223);
        background-color: rgb(78, 110, 242);
        &:hover {
            color: #8ebaed;
            border: 1px solid #8ebaed;
        }
        &:active {
            border: 1px solid #144379;
        }
    }
    .editBox {
        display: flex;
    }
}
</style>
