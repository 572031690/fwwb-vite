export default {
  data () {
    return {
      params: {
        limit: 10, // 每页显示5条记录
        page: 1, // 当前是第几页
        total: 0, // 总共几条记录去分页
        dname: '', // 查询数据
        selectValue: '' // 查询状态
      },
      searchUrl: '',
      currentList: {},
      openType: 'edit'
    }
  },
  methods: {
    /**
     * @desc ajax请求后台数据 获得list数据 并用于分页
     */
    async search () {
      await this.$api(this.searchUrl, {
        params: {
          page: this.params.page, // 传递当前是第几页参数
          limit: this.params.limit, // 传递每页显示多少条记录参数
          searchName: this.params.dname, // 传递搜索参数
          selectName: this.params.selectValue // 筛选参数
        }
      }).then((res) => {
        this.list = res.list || [] // 获取里面的data数据
        this.params.total = res.count // 获取后台传过来的总数据条数
        this.loading2 = false
      }).catch(() => {
        this.loading2 = false
      })
    },
    /**
     * @desc 判断当是需求或购买审批时过滤历史代办数据
     */
    getApprovalCurrentData () {
      const currentRouter = this.$route.query.routerIndex
      if (!['32', '31'].includes(currentRouter)) return
      if (this.currentApprovalType) return
      const roleList = window.sessionStorage.getItem('sData')
      if (roleList.includes('10011') || roleList.includes('10021')) {
        this.list = this.list.filter(item => {
          return item.uptype !== 1 && item.uptype !== 0
        })
      }
      if (roleList.includes('10001')) {
        this.list = this.list.filter(item => {
          return item.uptype !== 1 && item.uptype !== 0 && item.uptype !== 2
        })
      }
    },
    /**
     * @desc 删除方法
     */
    deletedata (data, url) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$api(url, {
            params: data
          }).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.search()
            } else {
              this.$message.error('错了哦，删除失败')
            }
          })
        })
        .catch(err => {
          if (err === 'cancel') {
            this.$message('取消删除')
          } else {
            this.$message({
              type: 'error',
              message: err
            })
          }
        })
    },
    /**
     * @desc 页码
     */
    handleSizeChange (val) {
      this.params.limit = val // 设置每页多少条记录
      this.search()
    },
    handleCurrentChange (val) {
      this.params.page = val
      this.search()
    },
    /**
     * @desc 添加方法打开界面
     */
    gethomeAdd () {
      this.openType = 'add'
      this.dialogFormShow = true
    },
    /**
     * @desc 提交送审表单
     */
    upData (item) {
      this.$confirm('是否确定提交审批申请?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.startApproval(item)
        })
        .catch(err => {
          if (err === 'cancel') {
            this.$message('取消提交')
          } else {
            this.$message({
              type: 'error',
              message: err
            })
          }
        })
    },
    /**
     * @desc 启动审批请求
     */
    async startApproval (item) {
      const url = this.dialogUrl.startApproval
      const params = {
        needid: item.needid,
        buyid: item.buyid
      }
      await this.$api(url, { params }).then(res => {
        this.upApproval(res.list[0].taskId)
      })
    },
    /**
     * @desc 提交审批请求
     */
    async upApproval (taskId) {
      const url = this.dialogUrl.upApproval
      const params = {
        taskId: taskId
      }
      await this.$api(url, { params }).then(res => {
        this.$message({
          type: 'success',
          message: '送审成功'
        })
        this.search()
      })
    },
    /**
     * @desc 修改表单
     */
    seeData (e) {
      this.openType = 'edit'
      this.currentList = e
      this.dialogFormShow = true
    },
    /**
     * @desc 关闭蒙版
     */
    closeaddDialog () {
      this.dialogFormShow = false
    }
  }
}
