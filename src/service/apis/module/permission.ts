export default [
  {
    name: 'listPerm',
    method: 'GET',
    desc: '查看权限列表',
    path: '/Perm/listPerm',
    params: {
      page: '', // 传递当前是第几页参数
      limit: '', // 传递每页显示多少条记录参数
      searchName: '', // 传递搜索参数
      selectName: ''
    }
  },
  {
    name: 'addPerm',
    method: 'POST',
    desc: '添加权限',
    path: '/Perm/addPerm',
    data: {
      name: '',
      type: '',
      url: '',
      permission: ''
    }
  },
  {
    name: 'updatePerm',
    method: 'POST',
    desc: '修改指定权限信息',
    path: '/Perm/updatePerm',
    data: {
      id: '',
      name: '',
      type: '',
      url: '',
      permission: ''
    }
  },
  {
    name: 'deletePerm',
    method: 'GET',
    desc: '删除指定权限',
    path: '/Perm/deletePerm',
    params: {
      id: ''
    }
  },
  {
    name: 'updatePermissionStatus',
    method: 'POST',
    desc: '修改权限状态',
    path: '/Perm/updatePermissionStatus',
    data: {
      id: '',
      isDisabled: ''
    }
  }
]
