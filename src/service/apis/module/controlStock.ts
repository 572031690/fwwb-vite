export default [
  {
    name: 'findOutRepositoryList',
    method: 'GET',
    desc: '查看出库信息',
    path: '/repository/findOutRepositoryList',
    params: {
      page: '',
      limit: '',
      searchName: '',
      selectName: ''
    }
  },
  {
    name: 'deleteOutRepository',
    method: 'GET',
    desc: '删除出库信息',
    path: '/repository/deleteOutRepository',
    params: {
      id: ''
    }
  },
  {
    name: 'addOutRepository',
    method: 'POST',
    desc: '添加出库信息',
    path: '/repository/addOutRepository',
    data: {
      name: '',
      itemid: '',
      time: '',
      num: '',
      unit: '',
      outRept: '',
      needid: ''
    }
  },
  {
    name: 'updateOutRepository',
    method: 'POST',
    desc: '修改出库信息',
    path: '/repository/updateOutRepository',
    data: {
      id: '',
      name: '',
      itemid: '',
      time: '',
      num: '',
      unit: ''
    }
  },
  {
    name: 'RepositoryOut',
    method: 'POST',
    desc: '出库操作',
    path: '/repository/RepositoryOut',
    data: {
      id: '',
      name: '',
      itemid: '',
      time: '',
      num: '',
      unit: '',
      outRept: '',
      needid: ''
    }
  },
  {
    name: 'findAllNeed',
    method: 'POST',
    desc: '获取需求表',
    path: '/webneed/findAllNeed',
    data: {
      limit: 10,
      page: 1,
      planName: ''
    }
  },
  {
    name: 'findAllBuy',
    method: 'POST',
    desc: '获取购买订单数据列表',
    path: '/webbuy/findAllBuy',
    data: {
      page: '',
      limit: '',
      planName: ''
    }
  },
  {
    name: 'findInRepositoryList',
    method: 'GET',
    desc: '查看入库信息',
    path: '/repository/findInRepositoryList',
    params: {
      page: '',
      limit: '',
      searchName: '',
      selectName: ''
    }
  },
  {
    name: 'addInRepository',
    method: 'POST',
    desc: '添加入库信息',
    path: '/repository/addInRepository',
    data: {
      name: '',
      itemid: '',
      time: '',
      num: '',
      unit: '',
      outRept: '',
      buyid: ''
    }
  },
  {
    name: 'updateInRepository',
    method: 'POST',
    desc: '修改入库信息',
    path: '/repository/updateInRepository',
    data: {
      id: '',
      name: '',
      itemid: '',
      time: '',
      num: '',
      unit: ''
    }
  },
  {
    name: 'deleteInRepository',
    method: 'GET',
    desc: '删除入库信息',
    path: '/repository/deleteInRepository',
    params: {
      id: ''
    }
  },
  {
    name: 'RepositoryIn',
    method: 'POST',
    desc: '入库操作',
    path: '/repository/RepositoryIn',
    data: {
      id: '',
      name: '',
      itemid: '',
      time: '',
      num: '',
      unit: '',
      outRept: '',
      buyid: ''
    }
  }
]
