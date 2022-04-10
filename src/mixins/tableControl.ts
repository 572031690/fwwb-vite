
/**
 * 功能：
 *      mixinsData             变量
 *      search()               ajax请求后台数据 获得list数据 并用于分页
 *      deletedata()           删除方法
 *      handleSizeChange()     页码
 *      handleCurrentChange()  页码
 *      gethomeAdd()           添加方法打开界面
 *      seeData()              修改表单
 *      closeaddDialog()       关闭蒙版
 */

import { reactive, onMounted, onUnmounted } from 'vue'
import $api from '@/service/api'
import { ElMessage, ElMessageBox } from 'element-plus'

interface dataList {
    params: {
        limit: number
        page: number
        total: number
        dname: string
        selectValue: string|number
    },
    searchUrl: string
    currentList: Record<string, any>,
    openType: string
    list: Record<string, any>[]
    loading2: boolean,
    dialogFormShow:boolean
    thistime: null|NodeJS.Timeout
}
const tableControler = {
    setup:(props: Record<string, any>, context: any) => {
        const mixinsData: dataList = reactive({
            params: {
                limit: 10, // 每页显示5条记录
                page: 1, // 当前是第几页
                total: 0, // 总共几条记录去分页
                dname: '', // 查询数据
                selectValue: '' // 查询状态
            },
            searchUrl: '',
            currentList: {},
            openType: 'edit',
            list: [],
            loading2: true,
            thistime: null,
            dialogFormShow:false
        })
        /**
         * @desc ajax请求后台数据 获得list数据 并用于分页
         */
        const search = async () => {
            await $api(mixinsData.searchUrl, {
                params: {
                    page: mixinsData.params.page, // 传递当前是第几页参数
                    limit: mixinsData.params.limit, // 传递每页显示多少条记录参数
                    searchName: mixinsData.params.dname, // 传递搜索参数
                    selectName: mixinsData.params.selectValue // 筛选参数
                }
            }).then((res: any) => {
                mixinsData.list = res.list || [] // 获取里面的data数据
                mixinsData.params.total = res.count // 获取后台传过来的总数据条数
                mixinsData.loading2 = false
            }).catch(() => {
                mixinsData.loading2 = false
            })
        }
        /**
         * @desc 删除方法
         */
        const deletedata = (data:any, url: string) => {
            ElMessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async () => {
                await $api(url, {
                    params: data
                }).then((res: any) => {
                    if (res) {
                        ElMessage({
                            type: 'success',
                            message: '删除成功!'
                        })
                        search()
                    } else {
                        ElMessage.error('错了哦，删除失败')
                    }
                })
            }).catch((err:any) => {
                if (err === 'cncel') {
                    ElMessage('取消删除')
                } else {
                    ElMessage({
                        type: 'error',
                        message: err
                    })
                }
            })
        }
        /**
         * @desc 页码
         */
        const handleSizeChange = (val: number) => {
            mixinsData.params.limit = val // 设置每页多少条记录
            search()
        }
        const handleCurrentChange = (val: number) => {
            mixinsData.params.page = val
            search()
        }
        /**
         * @desc 添加方法打开界面
         */
        const gethomeAdd = () => {
            mixinsData.openType = 'add'
            mixinsData.dialogFormShow = true
        }
        /**
         * @desc 提交送审表单
         */
        const upData = (item:any, api:{startApproval:string, upApproval:string}) => {
            ElMessageBox.confirm('是否确定提交审批申请?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    startApproval(item, api)
                })
                .catch((err:string) => {
                    if (err === 'cancel') {
                        ElMessage('取消提交')
                    } else {
                        ElMessage({
                            type: 'error',
                            message: err
                        })
                    }
                })
        }
        /**
         * @desc 启动审批请求
         */
        const startApproval = async (item:any, api:{startApproval:string, upApproval:string}) => {
            const url = api.startApproval
            // const url = mixinsData.dialogUrl.startApproval
            const params = {
                needid: item.needid,
                buyid: item.buyid
            }
            await $api(url, { params }).then((res: any) => {
                upApproval(res.list[0].taskId, api.upApproval)
            })
        }
        /**
         * @desc 提交审批请求
         */
        const upApproval = async (taskId: string, urls:string) => {
            const url = urls
            // const url = mixinsData.dialogUrl.upApproval
            const params = {
                taskId: taskId
            }
            await $api(url, { params }).then(() => {
                ElMessage({
                    type: 'success',
                    message: '送审成功'
                })
                search()
            })
        }
        /**
         * @desc 修改表单
         */
        const seeData = (e:any) => {
            mixinsData.openType = 'edit'
            mixinsData.currentList = e
            mixinsData.dialogFormShow = true
        }
        /**
         * @desc 关闭蒙版
         */
        const closeaddDialog = () => {
            mixinsData.dialogFormShow = false
        }
        // onMounted(() => {

        // })

        // onUnmounted(() => {

        // })

        return {
            mixinsData,
            closeaddDialog,
            seeData,
            upData,
            gethomeAdd,
            handleCurrentChange,
            handleSizeChange,
            deletedata,
            search,
            startApproval,
            upApproval
        }

    }
}
export default tableControler