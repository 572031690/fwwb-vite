<template>
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
            <el-button type="primary" @click="submitForm(ruleFormRef)">Create</el-button>
            <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { ElForm } from 'element-plus'

const formSize = ref('')

const ruleFormRef = ref<InstanceType<typeof ElForm>>()
const ruleForm = reactive({
    oldpassword: '',
    password: '',
    repass: '',
})
const submitForm = () => {}
const resetForm = () => {}
const validatePass2 = (rule: string, value: string, callback: any) => {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== ruleForm.password) {
        callback(new Error('两次输入密码不一致!'))
    } else {
        callback()
    }
}
const rules = reactive({
    oldpassword: [
        { required: true, message: '请输入原密码', trigger: 'blur' },
        { min: 6, max: 24, message: '长度不能小于六位', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 24, message: '长度不能小于六位', trigger: 'blur' },
    ],
    repass: [{ required: true, validator: validatePass2, trigger: 'blur' }],
})
</script>