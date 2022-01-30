export default [
  {
    name: 'addDepart',
    method: 'POST',
    desc: '增加部门',
    path: '/webDepartment/addDepartment',
    data: {
      departmentname: '',
      departmentid: '',
      detail: '' // 部门描述
    }
  },
  {
    name: 'deleteDepart',
    method: 'GET',
    desc: '删除部门',
    path: '/webDepartment/deleteDepartment',
    params: {
      departmentid: ''
    }
  },
  {
    name: 'editDepart',
    method: 'POST',
    desc: '修改部门',
    path: '/webDepartment/updateDepartment',
    data: {
      departmentname: '',
      departmentid: '',
      // employenum 部门员工数
      detail: '' // 部门描述
    }
  },
  {
    name: 'getDepart',
    method: 'GET',
    desc: '获取部门列表',
    path: '/webDepartment/findAllDepartment',
    params: {
      page: '', // 传递当前是第几页参数
      limit: '', // 传递每页显示多少条记录参数
      username: '' // 传递搜索参数
    }
  }
]
