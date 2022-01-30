export default [
  {
    name: 'getNeedCount',
    method: 'GET',
    desc: '获取需求审批统计',
    path: '/webneed/getNeedCount',
    params: {}
  },
  {
    name: 'getBuyCount',
    method: 'GET',
    desc: '获取购买审批统计',
    path: '/webbuy/getBuyCount',
    params: {}
  },
  {
    name: 'findDepository',
    method: 'GET',
    desc: '获取仓库信息',
    path: '/depositroy/findDepository',
    params: {
      page: '', // 传递当前是第几页参数
      limit: '', // 传递每页显示多少条记录参数
      searchName: '',
      selectName: ''
    }
  }
]
