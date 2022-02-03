<template>
    <div>
        <!-- 添加模板 -->
        <el-dialog
            :title="openType === 'add' ? '添加数据' : openType === 'edit' ? '修改数据' : '提交送审'"
            v-model="dialogFormShow"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            :show-close="false"
            :destroy-on-close="true"
            top="12vh"
            center
            width="672px"
        >
            <el-form :model="dialogData.formList" :rules="rulesData" ref="form" label-width="120px" class="demo-ruleForm">
                <el-form-item
                    v-for="(item, index) in dialogData.dataTableList"
                    :key="index"
                    :label="item.label"
                    :prop="item.dataName"
                    v-show="item.putType === 'disput' ? false : true"
                >
                    <el-input
                        v-model="dialogData.formList[item.dataName]"
                        style="width: 400px"
                        v-if="item.putType === 'input'"
                        :placeholder="item.placeholder"
                        clearable
                    ></el-input>

                    <el-date-picker
                        v-model="dialogData.formList[item.dataName]"
                        type="date"
                        style="width: 150px"
                        v-if="item.putType === 'date'"
                        placeholder="选择日期"
                    >
                    </el-date-picker>

                    <el-select v-model="dialogData.formList[item.dataName]" placeholder="请选择类型" v-if="item.putType === 'select'">
                        <el-option :label="dat.label" :value="dat.value" v-for="(dat, key) in item.selectData" :key="key"></el-option>
                    </el-select>

                    <div v-if="item.putType === 'selectUrl'">
                        <el-select
                            v-model="dialogData.formList[item.dataName]"
                            placeholder="请选择"
                            @change="getChangeUrl"
                            @visible-change="getSelectUrlList(item, index)"
                        >
                            <el-option :label="dat.itemtype" :value="dat.itemtype" v-for="(dat, key) in item.selectData" :key="key"></el-option>
                        </el-select>
                    </div>

                    <div v-if="item.putType === 'selectItem'">
                        <el-select v-model.number="dialogData.formList[item.dataName]" placeholder="请选择材料" @change="getUnit" @visible-change="getItemList">
                            <el-option :label="dat.itemtype" :value="dat.itemtype" v-for="(dat, key) in itemList" :key="key"></el-option>
                        </el-select>
                        单位：{{ dialogData.formList.unit }}
                    </div>
                    <el-input-number
                        v-model="dialogData.formList[item.dataName]"
                        :step="50"
                        :min="50"
                        :max="999999999"
                        label="描述文字"
                        v-if="item.putType === 'num'"
                    ></el-input-number>

                    <el-input
                        type="age"
                        v-model.number="dialogData.formList[item.dataName]"
                        style="width: 400px"
                        v-if="item.putType === 'numput'"
                        :placeholder="item.placeholder"
                        clearable
                    ></el-input>

                    <el-input
                        type="age"
                        auto-complete="off"
                        style="width: 400px"
                        v-model.number="dialogData.formList[item.dataName]"
                        disabled
                        v-if="item.putType === 'disput'"
                    ></el-input>

                    <el-input
                        type="textarea"
                        v-model.number="dialogData.formList[item.dataName]"
                        auto-complete="off"
                        style="width: 400px"
                        v-if="item.putType === 'textarea'"
                        :placeholder="item.placeholder"
                    ></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="close">取 消</el-button>
                    <el-button type="primary" @click="submitForm(form)">{{
                        openType === 'add' ? '添 加' : openType === 'edit' ? '修 改' : '提交送审'
                    }}</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
/* post请求
类型 putType：selectUrl textarea disput numput num select date input selectItem
*/
import { rulesData } from '@/assets/data/rules'
import { addEditList } from '@/assets/data/addEditList'
import { reactive, onMounted, toRefs, ref, watch } from 'vue'
import $api from '@/service/api'
import { dialogTs } from '@/type/globalType'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, ElForm } from 'element-plus'

export default {
    name: 'vDialog',
    props: {
        /**
         * @desc 在编辑模式下禁用的变量
         */
        editDisabled: {
            type: Array,
            default: () => {
                return []
            },
        },
        /**
         * @desc 控制弹窗显示
         */
        dialogFormShow: {
            type: Boolean,
            default: () => {
                return false
            },
        },
        /**
         * @desc 需要转换为int类型的变量
         */
        IntList: {
            type: Array,
            default: () => {
                return []
            },
        },
        /**
         * @desc 打开方式 edit add approval
         */
        openType: {
            type: String,
            default: () => {
                return ''
            },
        },
        /**
         * @desc 用户获取静态数据addEditList内对应当前列表的输入框数据和表单数据
         */
        name: {
            type: String,
            default: () => {
                return ''
            },
        },
        /**
         * @desc 当前表格数据
         */
        currentList: {
            type: Object,
            default: () => {
                return {}
            },
        },
        /**
         * @desc 添加数据初始化数据
         */
        staticData: {
            type: Object,
            default: () => {
                return {}
            },
        },
        /**
         * @desc 在添加和编辑时顶部第一个参数需要改变是否能禁用 添加时无 编辑时有但是禁用
         */
        topChange: {
            type: [String, Boolean],
            default: () => {
                return false
            },
        },
    },
    setup(props: any, content: any) {
        var validatePass2 = (rule: any, value: number, callback: any) => {
            if (value < data.dialogData.formList.totalstock) {
                callback(new Error('仓库空间需要大于等于库存！'))
            } else {
                callback()
            }
        }
        const form = ref<InstanceType<typeof ElForm>>()
        const data: dialogTs = reactive({
            totalstock: [{ required: true, validator: validatePass2, trigger: 'blur' }],
            rulesData, // 表单rules数据
            addEditList, // 静态表单inpput类型和表单字段名称以及url地址
            dialogData: {
                dialogType: '',
                formList: '',
                dataTableList: '',
            },
            topData: {}, // 表单顶部暂存数据
            itemList: [], // 物料数据
        })
        watch(
            () => props.dialogFormShow,
            (val: boolean) => {
                if (val) getType()
            }
        )
        data.rulesData.totalstock = data.totalstock
        /**
         * @desc 初始化静态输入框类型数据
         */
        const getList = () => {
            const dial = data.addEditList[props.name]
            if (!dial) return
            data.dialogData = dial
            data.topData = data.dialogData.dataTableList[0]
        }
        /**
         * @desc 物料类输入框获取unit itemid itemtype
         */
        const getUnit = (datas: string) => {
            const currentItem = data.itemList.filter(function (e: any) {
                return e.itemtype === datas
            })
            data.dialogData.formList.itemid = currentItem[0].itemid
            data.dialogData.formList.unit = currentItem[0].unit
        }

        /**
         * @desc 调用对应打开类型方法
         */
        const getType = () => {
            control[props.openType]()
        }
        const control: { [key: string]: any } = {
            /**
             * @desc 添加表单数据初始化
             */
            add: () => {
                if (props.editDisabled.length) {
                    data.dialogData.dataTableList.forEach((item: any) => {
                        if (props.editDisabled.includes(item.dataName)) {
                            item.putType = 'input'
                        }
                    })
                }
                if (data.dialogData.dataTableList[0].dataName === props.topChange && props.topChange) {
                    data.dialogData.dataTableList.splice(0, 1)
                }
                for (const i in data.dialogData.formList) {
                    data.dialogData.formList[i] = ''
                }
                data.dialogData.dataTableList.forEach((item: any) => {
                    if (item.putType === 'disput') {
                        data.dialogData.formList[item.dataName] = parseInt(window.sessionStorage.getItem('userid') || '')
                    }
                })
                if (JSON.stringify(props.staticData) !== '{}') {
                    Object.assign(data.dialogData.formList, props.staticData)
                }
                data.dialogData.formList.btime = new Date()
                data.dialogData.formList.needday = new Date()
            },
            /**
             * @desc 编辑表单数据初始化
             */
            edit: () => {
                console.log(props.editDisabled, 'editDisabled')

                if (props.editDisabled.length) {
                    data.dialogData.dataTableList.forEach((item: any) => {
                        if (props.editDisabled.includes(item.dataName)) {
                            item.putType = 'disput'
                        }
                    })
                }
                if (data.dialogData.dataTableList[0].dataName !== props.topChange && props.topChange) {
                    data.dialogData.dataTableList.splice(0, 0, data.topData)
                }
                for (const i in data.dialogData.formList) {
                    if (props.IntList.includes(i)) {
                        data.dialogData.formList[i] = props.currentList[i] ? parseInt(props.currentList[i]) : ''
                    } else {
                        data.dialogData.formList[i] = props.currentList[i] ? props.currentList[i].toString() : ''
                    }
                }
                data.dialogData.dataTableList.forEach((item: any) => {
                    if (item.putType === 'disput' && (item.dataName === 'buyerid' || item.dataName === 'neederid')) {
                        data.dialogData.formList[item.dataName] = parseInt(window.sessionStorage.getItem('userid') || '')
                    }
                })
                if (JSON.stringify(props.staticData) !== '{}') {
                    Object.assign(data.dialogData.formList, props.staticData)
                }
            },
            /**
             * @desc 审批表单数据初始化
             */
            approval: () => {
                if (props.editDisabled) {
                    data.dialogData.dataTableList.forEach((item: any) => {
                        if (item.dataName === props.editDisabled) {
                            item.putType = 'input'
                        }
                    })
                }
                if (data.dialogData.dataTableList[0].dataName !== props.topChange && props.topChange) {
                    data.dialogData.dataTableList.splice(0, 0, data.topData)
                }
                for (const i in data.dialogData.formList) {
                    if (props.IntList.includes(i)) {
                        data.dialogData.formList[i] = parseInt(props.currentList[i])
                    } else data.dialogData.formList[i] = props.currentList[i]
                }
            },
        }

        /**
         * @desc 点击提交添加编辑验证
         */
        const submitForm = (formName: any) => {
            formName.validate((valid: boolean) => {
                if (valid) {
                    ElMessageBox.confirm(
                        props.openType === 'add'
                            ? '是否确定保存并添加此条数据?'
                            : props.openType === 'edit'
                            ? '是否确定保存并修改此条数据'
                            : '是否确定保存并提交此条数据',
                        '提示',
                        {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                        }
                    )
                        .then(() => {
                            submitData()
                        })
                        .catch(() => {
                            console.log('error submit!!')
                        })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        }
        /**
         * @desc 添加和修改请求
         */
        const submitData = async () => {
            var params: { [key: string]: string } = {}
            for (const i in data.dialogData.formList) {
                params[i] = data.dialogData.formList[i]
            }
            if (!data.dialogData.url) return
            const url = data.dialogData.url[props.openType]
            await $api(url, params)
                .then((res: any) => {
                    const { code } = res
                    if (parseInt(code) === 101) {
                        if (props.openType === 'approval') {
                            startApproval()
                        } else {
                            ElMessage({
                                type: 'success',
                                message: props.openType === 'add' ? '添加成功!' : props.openType === 'edit' ? '修改成功' : '送审成功',
                            })
                            content.emit('updata')
                            close()
                        }
                    } else {
                        ElMessage.error(props.openType === 'add' ? '错了哦，添加失败' : props.openType === 'edit' ? '错了哦，修改失败' : '错了哦，送审失败')
                    }
                })
                .catch(() => {})
        }
        /**
         * @desc 关闭窗口方法
         */
        const close = () => {
            for (const i in data.dialogData.formList) {
                data.dialogData.formList[i] = ''
            }
            content.emit('closeaddDialog')
        }
        /**
         * @desc 审批接口在提交之前修改表单数据
         */
        const getItemList = () => {
            if (data.itemList.length) return
            const params = {
                page: 1, // 传递当前是第几页参数
                limit: 20, // 传递每页显示多少条记录参数
                searchName: '', // 传递搜索参数
                selectName: '', // 筛选参数
            }
            $api('item/getItem', { params })
                .then((res: any) => {
                    data.itemList = res.list
                })
                .catch(() => {})
        }
        /**
         * @desc 启动审批请求
         */
        const startApproval = async () => {
            if (!data.dialogData.url) return
            const url = data.dialogData.url.startApproval
            const params = {
                needid: data.dialogData.formList.needid,
                buyid: data.dialogData.formList.buyid,
            }
            await $api(url, { params }).then((res: any) => {
                upApproval(res.list[0].taskId)
            })
        }
        /**
         * @desc 提交审批请求
         */
        const upApproval = async (taskId: number) => {
            if (!data.dialogData.url) return
            const url = data.dialogData.url.upApproval
            const params = {
                taskId: taskId,
            }
            await $api(url, { params }).then((res: any) => {
                ElMessage({
                    type: 'success',
                    message: '送审成功',
                })
                content.emit('updata')
                close()
            })
        }
        const getChangeUrl = () => {}
        const getSelectUrlList = (item: any, index: number) => {
            if (data.dialogData.dataTableList[index].selectData.length) return
            $api(item.url, { params: { ...item.queryParams } })
                .then((res: any) => {
                    data.dialogData.dataTableList[index].selectData = res.list
                })
                .catch(() => {})
        }
        getList()
        return {
            ...toRefs(data),
            getChangeUrl,
            getSelectUrlList,
            submitData,
            getItemList,
            submitForm,
            getUnit,
            form,
            close,
        }
    },
}
</script>

<style></style>
