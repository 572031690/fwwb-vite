<template>
    <div class="wel-body">
        <div class="wel-body-overbox">
            <div class="top-box">
                <el-card class="box-card-right" >
                    <template #header>
                        <div>
                            系统简介
                        </div>
                    </template>
                    <div>
                       <div class="welTexts">
                            {{ briefIntroduction }}
                        </div>
                    </div>
                </el-card>
                <el-card class="box-card" style="background-color: #e6a23c">
                    <div class="img">
                        <i class="el-icon-s-marketing" style="font-size: 100px; color: white"></i>
                    </div>
                    <div v-for="(item, index) in datalist" class="item" :key="index" style="font-size: 20px; color: white; padding-left: 30px">
                        {{ item.name + '：' + item.num + item.unit }}
                    </div>
                    <div class="text1">材料库存</div>
                </el-card>
            </div>
            <div class="bottom-box">
                <el-card class="box-card" style="background-color: MediumSeaGreen" v-if="getdpartmentTypeNeed">
                    <div class="img">
                        <i class="el-icon-document-checked" style="font-size: 100px; color: white"></i>
                    </div>
                    <div class="text item">
                        {{ needCount.approve }}
                    </div>
                    <div class="text1">需求通过数量</div>
                </el-card>
                <el-card class="box-card" style="background-color: #f56c6c" v-if="getdpartmentTypeNeed">
                    <div class="img">
                        <i class="el-icon-s-data" style="font-size: 100px; color: white"></i>
                    </div>

                    <div class="text item">
                        {{ needCount.reject }}
                    </div>
                    <div class="text1">需求驳回数量</div>
                </el-card>
                <el-card class="box-card" style="background-color: #409eff" v-if="getdpartmentTypeNeed">
                    <div class="img">
                        <i class="el-icon-s-order" style="font-size: 100px; color: white"></i>
                    </div>
                    <div class="text item">
                        {{ needCount.sum }}
                    </div>
                    <div class="text1">需求总数</div>
                </el-card>
                <el-card class="box-card" style="background-color: MediumSeaGreen" v-if="getdpartmentTypeBuy">
                    <div class="img">
                        <i class="el-icon-document-checked" style="font-size: 100px; color: white"></i>
                    </div>
                    <div class="text item">
                        {{ buyCount.approve }}
                    </div>
                    <div class="text1">订单通过数量</div>
                </el-card>
                <el-card class="box-card" style="background-color: #f56c6c" v-if="getdpartmentTypeBuy">
                    <div class="img">
                        <i class="el-icon-s-data" style="font-size: 100px; color: white"></i>
                    </div>
                    <div class="text item">
                        {{ buyCount.reject }}
                    </div>
                    <div class="text1">订单驳回数量</div>
                </el-card>
                <el-card class="box-card" style="background-color: #409eff" v-if="getdpartmentTypeBuy">
                    <div class="img">
                        <i class="el-icon-s-order" style="font-size: 100px; color: white"></i>
                    </div>
                    <div class="text item">
                        {{ buyCount.sum }}
                    </div>
                    <div class="text1">订单总数量</div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, reactive, onMounted, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { homeWelTs } from '@/type/homeType'
import $api from '@/service/api'

export default {
    name: 'HomeWel',
    isRouter: true,
    isChildren: true,
    setup(props: any, content: any) {
        const store = useStore()
        const route = useRoute()
        const data: homeWelTs = reactive({
            rolaSelect: [
                {
                    value: '10011',
                    label: '需求专员',
                    depart: '需求部',
                },
                {
                    value: '10010',
                    label: '需求经理',
                    depart: '需求部',
                },
                {
                    value: '10021',
                    label: '采购专员',
                    depart: '采购部',
                },
                {
                    value: '10020',
                    label: '采购经理',
                    depart: '采购部',
                },
                {
                    value: '10001',
                    label: '总经理',
                    depart: '经理部',
                },
                {
                    value: '10000',
                    label: '管理员',
                    depart: '管理部',
                },
            ],
            briefIntroduction:
                '智能制作协调共享平台是一个后台管理审批平台，实现对需求的创建到最终订单生成并实施的全部审批流程。管理员可以对用户，材料进行修改,专员和经理可以对需求和订单进行提交和审批操作实现企业内的审批流程。',
            tableData: [],
            needCount: {
                approve: '',
                reject: '',
                sum: '',
            },
            buyCount: {
                approve: '',
                reject: '',
                sum: '',
            },
            datalist: [],
        })
        const getdpartmentTypeNeed = computed(() => {
            return store.getters.getPermission.includes('need:getNeedCount')
        })
        const getdpartmentTypeBuy = computed(() => {
            return store.getters.getPermission.includes('buy:getBuyCount')
        })
        onMounted(() => {
            content.emit('changeRouterIndex', route.query.routerIndex)
            getItemData()
            getAprovalCount()
        })
        /**
         * @desc 获取审批数据
         */
        const getAprovalCount = () => {
            if (store.getters.getPermission.includes('need:getNeedCount')) {
                $api('welcome/getNeedCount').then((res:any) => {
                    data.needCount = res
                })
            }
            if (store.getters.getPermission.includes('buy:getBuyCount')) {
                $api('welcome/getBuyCount').then((res:any) => {
                    data.buyCount = res
                })
            }
        }
        /**
         * @desc 获取用户信息
         */
        const getUserData = () => {
            const userList = JSON.parse(window.sessionStorage.getItem('userData') || '')
            data.tableData[0] = userList
            data.tableData[0].role = showRoleData(data.tableData[0].roleId)
            data.tableData[0].department = showDepartData(data.tableData[0].roleId)
        }
        /**
         * @desc 显示角色内容
         */
        const showRoleData = (val:number[]) => {
            if (!val) return
            const rolaArr:string[] = []
            data.rolaSelect.forEach((item:{value:string,label:string}) => {
                if (val.includes(parseInt(item.value))) rolaArr.push(item.label)
            })
            return rolaArr.join(',')
        }
        /**
         * @desc 显示部门内容
         */
        const showDepartData = (val:number[]) => {
            if (!val) return
            let depart
            data.rolaSelect.forEach((item:{value:string,depart:string}) => {
                if (val.includes(parseInt(item.value))) depart = item.depart
            })
            return depart
        }
        /**
         * @desc 请求库存数据
         */
        const getItemData = async () => {
            await $api('welcome/findDepository', {
                params: {
                    page: 1, // 传递当前是第几页参数
                    limit: 20, // 传递每页显示多少条记录参数
                    searchName: '',
                    selectName: '',
                },
            }).then((res: any) => {
                const itemData = res.list
                data.datalist = []
                for (let i = 0; i < 4; i++) {
                    data.datalist.push({
                        name: itemData[i].name,
                        num: itemData[i].stock,
                        unit: itemData[i].unit,
                    })
                }
            })
        }
        return {
            ...toRefs(data),
            getdpartmentTypeNeed,
            getdpartmentTypeBuy,
            getUserData
        }
    },
}
</script>

<style lang="less" scoped>
.wel-body {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &-overbox {
    overflow: auto;
  }
  .top-box {
    display: flex;
    justify-content: center;
  }
  .welTexts {
    font-size: 17px;
    color: #909399;
    text-align: center;
    width: 100%;
    padding: 0 26% 5px;
    border-bottom: 1px solid #e4e7ed;
  }
  .box-card-right {
    width: 55%;
    height: 230px;
    float: left;
    margin-top: 30px;
    margin-left: 40px;
  }
  .bottom-box {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
  .box-card {
    width: 26%;
    min-width: 315px;
    height: 200px;
    float: left;
    margin-top: 30px;
    margin-left: 40px;
  }
  .img {
    float: right;
    padding-top: 25px;
  }

  .text {
    font-size: 50px;
    color: white;
    padding-left: 40px;
    padding-top: 20px;
    width: 50px;
  }
  .text1 {
    font-size: 16px;
    color: white;
    padding-left: 40px;
  }

  .item {
    margin-bottom: 9px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }
}
::v-deep(.el-card__header){
    font-size: 16px;
}
</style>
