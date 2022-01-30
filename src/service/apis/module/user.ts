export default [
  {
    name: 'AddUser',
    method: 'POST',
    desc: '用户增加数据',
    path: '/web/addUser',
    data: {
      username: '',
      realname: '',
      password: '',
      telNum: '',
      departmentid: '',
      employeeid: ''
    }
  },
  {
    name: 'deleteUser',
    method: 'GET',
    desc: '用户删除数据',
    path: '/web/deleteUser',
    params: {
      userid: ''
    }
  },
  {
    name: 'editUser',
    method: 'POST',
    desc: '用户修改数据',
    path: '/web/updateUser',
    data: {
      userid: '',
      realname: '',
      username: '',
      telNum: '',
      employeeid: ''
    }
  },
  {
    name: 'getUser',
    method: 'GET',
    desc: '用户请求数据',
    path: '/web/listUser',
    params: {
      page: '', // 传递当前是第几页参数
      limit: '', // 传递每页显示多少条记录参数
      searchName: '', // 传递搜索参数
      selectName: '' // 筛选参数
    }
  },
  {
    name: 'resetPass',
    method: 'GET',
    desc: '重置密码',
    path: '/web/invertPassword',
    params: {
      userid: ''
    }
  },
  {
    name: 'checkRola',
    method: 'POST',
    desc: '分配角色',
    path: '/web/addUserRole',
    data: {
      userid: '',
      roleId: ''
    }
  },
  {
    name: 'changeStatus',
    method: 'GET',
    desc: '更改角色状态',
    path: '/web/updateStatus',
    params: {
      userid: ''
    }
  },
  {
    name: 'getRolaList',
    method: 'GET',
    desc: '获取角色列表',
    path: '/web/getUserRole',
    params: {}
  }
]
