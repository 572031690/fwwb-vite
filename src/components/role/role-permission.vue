<template>
    <div id="permissionDialog">
        <el-dialog title="分配权限" v-model="dialogVisibleRole" width="1000px">
            <div class="tableRole">
                <div class="tableRoleTop">
                    <div class="btnRole">选择</div>
                    <div class="textRoleName">权限名称</div>
                    <div class="textLongRole">权限标识</div>
                    <div class="textRole">权限类型</div>
                    <div class="textLongRole">权限地址</div>
                    <div class="textRole">状态</div>
                </div>
                <el-checkbox-group v-model="currentPermission">
                    <div class="tableRoleBody" v-for="(item, index) in permissionData" :key="index">
                        <div class="btnRole">
                            <el-checkbox :label="item.id">{{ '' }}</el-checkbox>
                        </div>
                        <div class="textRoleName">{{ item.name }}</div>
                        <div class="textLongRole">{{ item.permission }}</div>
                        <div class="textRole">{{ item.type }}</div>
                        <div class="textLongRole">{{ item.url }}</div>
                        <div class="textRole" :style="{ color: item.isDisabled ? 'red' : 'green' }">
                            {{ item.isDisabled ? '禁用' : '正常' }}
                        </div>
                    </div>
                </el-checkbox-group>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="closeDialog()">取 消</el-button>
                    <el-button type="primary" @click="upCurrentPermissionList()">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { reactive, onMounted, toRefs, watch } from 'vue'
import { ElMessage } from 'element-plus'
import $api from '@/service/api'

export default {
    props: {
        dialogVisibleRole: {
            type: Boolean,
            default: () => {
                return false
            },
        },
        roleId: {
            type: Number,
            default: () => {
                return 0
            },
        },
    },
    setup(props: Record<string, any>, context: any) {
        watch(
            () => props.dialogVisibleRole,
            val => {
                if (val) getCurrentPermissionList()
            }
        )
        const data:{
           currentPermission:number[],
            permissionData:number[]
        } = reactive({
            currentPermission: [],
            permissionData: [],
        })
        onMounted(() => {
            getPermissionList()
        })
        /**
         * @desc 关闭方法
         */
        const closeDialog = () => {
            context.emit('closeDialog')
        }
        /**
         * @desc 获取权限数据
         */
        const getCurrentPermissionList = async () => {
            const url = 'role/getRolePerm'
            const params = {
                roleId: props.roleId,
            }
            await $api(url, { params }).then((res: any) => {
                data.currentPermission = []
                res.rolePerm.forEach((element: { permId: number }) => {
                    data.currentPermission.push(element.permId)
                })
            })
        }
        /**
         * @desc 修改角色权限请求
         */
        const upCurrentPermissionList = async () => {
            const url = 'role/addRolePerm'
            const params = {
                roleId: props.roleId,
                permId: data.currentPermission,
            }
            await $api(url, params).then((res: any) => {
                if (res.code === '101') {
                    ElMessage.success('修改成功！')
                    closeDialog()
                }
            })
        }
        /**
         * @desc 获取角色列表
         */
        const getPermissionList = async () => {
            const url = 'permission/listPerm'
            const params = {
                page: 0, // 传递当前是第几页参数
                limit: 0, // 传递每页显示多少条记录参数
                searchName: '', // 传递搜索参数
                selectName: '',
            }
            await $api(url, { params }).then((res: any) => {
                data.permissionData = res.list
            })
        }
        return {
            ...toRefs(data),
            upCurrentPermissionList,
            closeDialog
        }
    },
}
</script>

<style lang="less" scoped>
.tableRole {
    height: 500px;
    overflow: auto;
    &Top {
        display: flex;
        border-bottom: 1px solid rgb(235, 238, 245);
    }
    &Body {
        display: flex;
        border-bottom: 1px solid rgb(235, 238, 245);
    }
    .textLongRole {
        color: rgb(111, 115, 116);
        font-size: 14px;
        width: 300px;
        height: 50px;
        line-height: 50px;
    }
    .textRoleName {
        color: rgb(111, 115, 116);
        font-size: 14px;
        width: 200px;
        height: 50px;
        line-height: 50px;
    }
    .textRole {
        color: rgb(111, 115, 116);
        font-size: 14px;
        width: 150px;
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
}
</style>
