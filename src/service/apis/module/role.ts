export default [
  {
    name: 'listRole',
    method: 'GET',
    desc: '获取角色表中所有信息',
    path: '/Role/listRole',
    params: {
      page: '', // 传递当前是第几页参数
      limit: '', // 传递每页显示多少条记录参数
      searchName: '', // 传递搜索参数
      selectName: ''
    }
  },
  {
    name: 'addRole',
    method: 'POST',
    desc: '添加新的角色',
    path: '/Role/addRole',
    data: {
      roleId: '',
      rolename: '',
      description: ''
    }
  },
  {
    name: 'updateRole',
    method: 'POST',
    desc: '修改指定角色信息',
    path: '/Role/updateRole',
    data: {
      roleId: '',
      rolename: '',
      description: ''
    }
  },
  {
    name: 'deleteRole',
    method: 'GET',
    desc: '删除指定角色信息',
    path: '/Role/deleteRole',
    params: {
      roleId: ''
    }
  },
  {
    name: 'getRolePerm',
    method: 'GET',
    desc: '查看角色的权限',
    path: '/Role/getRolePerm',
    params: {
      roleId: '' // 当前用户的用户名
    }
  },
  {
    name: 'addRolePerm',
    method: 'POST',
    desc: '添加指定角色的权限',
    path: '/Role/addRolePerm',
    data: {
      roleId: '',
      permId: ''
    }
  },
  {
    name: 'updateRoleStatus',
    method: 'POST',
    desc: '修改角色状态',
    path: '/Role/updateRoleStatus',
    data: {
      roleId: '',
      isDisabled: ''
    }
  }
]
