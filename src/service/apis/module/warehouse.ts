export default [
  {
    name: 'findDepository',
    method: 'GET',
    desc: '获取仓库信息',
    path: '/depositroy/findDepository',
    params: {
      page: '',
      limit: '',
      searchName: '',
      selectName: ''
    }
  },
  {
    name: 'deleteDepository',
    method: 'GET',
    desc: '删除仓库信息',
    path: '/depositroy/deleteDepository',
    params: {
      id: ''
    }
  },
  {
    name: 'addDepository',
    method: 'POST',
    desc: '添加仓库信息',
    path: '/depositroy/addDepository',
    data: {
      itemcode: '',
      name: '',
      comment: '',
      stock: '',
      totalstock: '',
      unit: ''
    }
  },
  {
    name: 'updateDepository',
    method: 'POST',
    desc: '更新仓库数据',
    path: '/depositroy/updateDepository',
    data: {
      id: '',
      itemcode: '',
      name: '',
      comment: '',
      stock: '',
      totalstock: '',
      unit: ''
    }
  }
]
