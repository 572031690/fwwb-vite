<template>
    <div class="vSearchNav">
        <div class="vSearchNavHeart">
            <vSearchNav class="searIcon" width="280px" label="标题" labelwidth="90px">
                <el-input @change="setSearchForm" v-model="searchForm.searchName" style="width: 220px" suffix-icon="el-icon-search" clearable />
            </vSearchNav>
            <vSearchNav class="searIcon"  width="350px" label="日期" labelwidth="130px">
                <!-- <el-date-picker
                    type="date"
                    value-format="yyyy-MM-dd"
                    @change="setSearchForm"
                    v-model="searchForm.btime"
                    style="width: 220px"
                    :picker-options="pickerOptions"
                    placeholder="选择需求日期"
                    clearable
                >
                </el-date-picker> -->
                <el-date-picker 
                    v-model="searchForm.btime" 
                    type="date" 
                    format="YYYY/MM/DD"
                    value-format="YYYY-MM-DD"
                    @change="setSearchForm"
                    style="width: 220px"
                    :disabledDate="disabledDate"
                    placeholder="选择需求日期"
                    clearable
                />
            </vSearchNav>
            <vSearchNav width="350px" label="审批状态" labelwidth="120px">
                <el-select style="width: 220px" v-model="searchForm.selectName" placeholder="请选择" @change="setSearchForm" clearable>
                    <el-option v-for="item in select" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
            </vSearchNav>
            <vSearchNav width="300px" label="需求单位" labelwidth="90px">
                <el-select style="width: 220px" v-model="searchForm.department" placeholder="请选择" @change="setSearchForm" clearable>
                    <el-option v-for="item in optionsDepartment" :key="item.itemtype" :label="item.itemtype" :value="item.itemtype"> </el-option>
                </el-select>
            </vSearchNav>
            <vSearchNav width="360px" label="物料类别" labelwidth="110px">
                <el-select style="width: 220px" v-model="searchForm.itemtype" placeholder="请选择" @change="setSearchForm" clearable>
                    <el-option v-for="item in optionsType" :key="item.itemtype" :label="item.itemtype" :value="item.itemtype"> </el-option>
                </el-select>
            </vSearchNav>
            <vSearchNav width="300px" label="物料编号" labelwidth="90px">
                <el-select style="width: 220px" v-model="searchForm.itemid" placeholder="请选择" @change="setSearchForm" clearable>
                    <el-option v-for="item in optionsId" :key="item.itemtype" :label="item.itemtype" :value="item.itemtype"> </el-option>
                </el-select>
            </vSearchNav>
            <el-button size="medium" type="primary" class="resetBtn" @click="resetForm">重置</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { reactive, toRefs,onMounted } from 'vue'
import $api from '@/service/api'
export default {
    name: 'buy-search',
    setup(props: any, content: any) {
        const data = reactive({
            
            searchForm: {
                searchName: '', // 传递搜索参数
                selectName: '',
                department: '', // 需求单位
                itemtype: '', // 物料类别
                itemid: '', // 物料编号
                btime: '' // 需求时间
            },
            optionsDepartment: [],
            optionsType: [],
            optionsId: [],
            options: [],
            select: [
                // 搜索框筛选数据
                {
                    value: '0',
                    label: '未送审',
                },
                {
                    value: '1',
                    label: '审核中',
                },
                {
                    value: '2',
                    label: '部门通过',
                },
                {
                    value: '3',
                    label: '经理通过',
                },
                {
                    value: '4',
                    label: '驳回',
                },
                {
                    value: '5',
                    label: '逾期',
                },
            ],
        })
        onMounted(() => {
            getDepartment()
            getType()
            getId()
        })
        const disabledDate = (time:Date) => {
                return time.getTime() > Date.now()
        }
        /**
         * @desc 搜索
         */
        const setSearchForm = () => {
            content.emit('getSearchForm', data.searchForm)
        }
        /**
         * @desc 重置
         */
        const resetForm = () => {
            for (const i in data.searchForm) {
                (data.searchForm as any)[i] = ''
            }
            content.emit('getSearchForm', data.searchForm)
        }
        /**
         * @desc 获得部门数据
         */
        const getDepartment = () => {
            $api('item/findItemName', { params: { itemid: 12 } })
                .then((res: any) => {
                    data.optionsDepartment = res.list
                })
                .catch(() => {})
        }
        /**
         * @desc 获得编码
         */
        const getType = () => {
            $api('item/findItemName', { params: { itemid: 1 } })
                .then((res: any) => {
                    data.optionsType = res.list
                })
                .catch(() => {})
        }
        /**
         * @desc 获得物料类型数据
         */
        const getId = () => {
            $api('item/findItemName', { params: { itemid: 16 } })
                .then((res: any) => {
                    data.optionsId = res.list
                })
                .catch(() => {})
        }
        return {
            ...toRefs(data),
            resetForm,
            setSearchForm,
            disabledDate
        }
    },
}
</script>

<style lang="less" scoped>
.vSearchNav {
    width: 82%;
    background-color: #fff;
    margin: 10px auto -10px;
    padding: 10px 0;
    border: 1px solid #dadce0;
    &Heart {
        width: 99%;
        margin: 0 auto;
        display: flex;
        flex-wrap: wrap;
        .resetBtn {
            margin: 5px 100px 0 auto;
            height: 30px;
            line-height: 10px;
        }
    }
}
.searIcon {
    ::v-deep(.el-input__suffix) {
        top: 0px;
    }
}

::v-deep(.el-input__suffix) {
    top: -3px;
}
</style>
