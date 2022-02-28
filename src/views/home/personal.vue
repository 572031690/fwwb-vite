<template>
    <div class="personal">
        <div class="personal-title">个 人 中 心</div>
        <div class="personal-table">
            <el-descriptions direction="horizontal" :column="1" border class="style">
                <el-descriptions-item label="登陆账户">
                    {{ userData.username }}
                </el-descriptions-item>
                <el-descriptions-item label="姓名">{{ userData.realname }}</el-descriptions-item>
                <el-descriptions-item label="工号">
                    {{ userData.employeeid }}
                </el-descriptions-item>
                <el-descriptions-item label="手机号码">
                    {{ userData.telNum }}
                </el-descriptions-item>
                <el-descriptions-item label="用户角色">
                    {{ userData.role }}
                </el-descriptions-item>
                <el-descriptions-item label="账号状态">
                    {{ userData.isDisabled ? '禁用' : '正常' }}
                </el-descriptions-item>
                <el-descriptions-item label="密码">
                    <el-button type="primary" size="small" @click="changepassword()">修改密码</el-button>
                </el-descriptions-item>
            </el-descriptions>
        </div>
        <div id="register">
            <el-dialog v-model="dialogFormVisible" :modal-append-to-body="false" :close-on-click-modal="false" :show-close="false" center width="35%">
                <template #title>
                    <div style="color: #409eff; font-size: 26px; font-weight: bold; margin-top: 9px">修改密码</div>
                </template>
                <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" :size="formSize">
                    <el-form-item label="原密码" prop="oldpassword">
                        <el-input v-model="ruleForm.oldpassword" style="width: 400px" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="password">
                        <el-input v-model="ruleForm.password" style="width: 400px" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="repass">
                        <el-input v-model="ruleForm.repass" style="width: 400px" type="password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm(ruleFormRef)">修 改</el-button>
                        <el-button @click="closeres(ruleFormRef)">取 消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>

<script lang="ts">
import { desensitization } from '@/assets/utils/index'
import { reactive, onMounted, toRefs, ref } from 'vue'
import $api from '@/service/api'
import { useRoute, useRouter } from 'vue-router'
import { personalTs } from '@/type/homeType'
import { ElMessage, ElMessageBox, ElForm } from 'element-plus'

export default {
    name: 'Personal',
    isRouter: true,
    isChildren: true,
    setup(props: any, content: any) {
        const validatePass2 = (rule: string, value: string, callback: any) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== ruleForm.password) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        const route = useRoute()
        const router = useRouter()
        const ruleForm: { [key: string]: string } = reactive({
            oldpassword: '',
            password: '',
            repass: ''
        })
        const rules = reactive({
            oldpassword: [
                { required: true, message: '请输入原密码', trigger: 'blur' },
                { min: 6, max: 24, message: '长度不能小于六位', trigger: 'blur' }
            ],
            password: [
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 6, max: 24, message: '长度不能小于六位', trigger: 'blur' }
            ],
            repass: [{ required: true, validator: validatePass2, trigger: 'blur' }],
        })
        const ruleFormRef = ref<InstanceType<typeof ElForm>>()
        const data: personalTs = reactive({
            rolaSelect: [
                // {
                //     value: '10011',
                //     label: '需求专员',
                //     depart: '需求部'
                // },
                // {
                //     value: '10010',
                //     label: '需求经理',
                //     depart: '需求部'
                // },
                // {
                //     value: '10021',
                //     label: '采购专员',
                //     depart: '采购部'
                // },
                // {
                //     value: '10020',
                //     label: '采购经理',
                //     depart: '采购部'
                // },
                // {
                //     value: '10001',
                //     label: '总经理',
                //     depart: '经理部'
                // },
                // {
                //     value: '10000',
                //     label: '管理员',
                //     depart: '管理部'
                // }
            ],
            dialogFormVisible: false,
            userData: {
                roleId: [],
                role: '',
                department: '',
                telNum: '',
                userid: '',
                username: '',
                realname: ''
            }
        })

        onMounted(() => {
            content.emit('changeRouterIndex', route.query.routerIndex)
            getRoleList()
        })
        /**
         * @desc 请求角色列表
         */
        const getRoleList = async () => {
            const url = 'user/getRolaList'
            await $api(url).then((res: any) => {
                data.rolaSelect = res.roleList
                getUserData()
            })
        }
        /**
         * @desc 获取角色信息
         */
        const getUserData = () => {
            const list = window.sessionStorage.getItem('userData')
            if (!list) return
            const userList = JSON.parse(list)
            data.userData = userList
            data.userData.role = showRoleData(data.userData.roleId) || ''
            data.userData.department = showDepartData(data.userData.roleId) || ''
            data.userData.telNum = desensitization(Number(data.userData.telNum))
        }
        const showRoleData = (val: null | number[]) => {
            if (!val) return
            const rolaArr: string[] = []
            data.rolaSelect.forEach((item: any) => {
                if (val.includes(parseInt(item.roleId))) rolaArr.push(item.rolename)
            })
            return rolaArr.join(',')
        }
        /**
         * @desc 显示部门内容
         */
        const showDepartData = (val: number[]) => {
            if (!val) return
            let depart
            data.rolaSelect.forEach(item => {
                if (val.includes(parseInt(item.value))) depart = item.depart
            })
            return depart
        }
        /**
         * @desc 打开修改密码
         */
        const changepassword = () => {
            data.dialogFormVisible = true
        }
        /**
         * @desc 提交修改密码
         */
        const submitForm = (formName: any) => {
            formName.validate((valid: boolean) => {
                if (valid) {
                    ElMessageBox.confirm(`修改成功后会自动退出登陆，是否确定修改密码?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    })
                        .then(() => {
                            upPassword()
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
         * @desc 关闭窗口
         */
        const closeres = (formName: any) => {
            formName.resetFields()
            data.dialogFormVisible = false
        }
        /**
         * @desc 请求修改密码
         */
        const upPassword = async () => {
            const url = 'personal/updateUserPassword'
            const params = {
                ...ruleForm,
            }
            params.userid = data.userData.userid
            await $api(url, params)
                .then((res: any) => {
                    if (res.code === '101') {
                        ElMessage.success('修改成功')
                        sessionStorage.clear() // 删除所有数据
                        router.push({ name: 'login' }) // 直接跳转
                    } else if (res.code === '102') {
                        ElMessage.error('原密码不正确')
                    }
                })
                .catch(() => {})
        }
        return {
            changepassword,
            submitForm,
            closeres,
            ...toRefs(data),
            ruleForm,
            rules,
            ruleFormRef,
        }
    },
}
</script>

<style lang="less" scoped>
.personal {
    height: 95%;
    width: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &-title {
        color: rgba(255, 255, 255, 0.9);
        margin: 20px 0;
        font-size: 30px;
        font-weight: bold;
    }

    &-table {
        height: 90%;
        width: 90%;
        overflow: auto;
    }
    .el-descriptions {
        box-sizing: border-box;
        font-size: 16px;
        color: #303133;
    }
    .style {
        .el-descriptions__body .el-descriptions__table .el-descriptions-item__cell {
            box-sizing: border-box;
            text-align: center;
            font-weight: 400;
            line-height: 3;
        }
    }
}
</style>
