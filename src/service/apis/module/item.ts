export default [
  {
    name: 'additem',
    method: 'POST',
    desc: '增加材料数据',
    path: '/webitem/addItem',
    data: {
      itemtype: '',
      comment: '',
      parentid: '' // 自查关键字（例如：物料类别的id 1）
    }
  },
  {
    name: 'deleteItem',
    method: 'GET',
    desc: '删除材料',
    path: '/webitem/deleteItem',
    params: {
      itemid: ''
    }
  },
  {
    name: 'editItem',
    method: 'POST',
    desc: '修改材料数据',
    path: '/webitem/updateItem',
    data: {
      itemid: '',
      itemtype: '',
      comment: '',
      parentid: ''
    }
  },
  {
    name: 'getItem',
    method: 'GET',
    desc: '材料请求数据',
    path: '/webitem/findAllitem',
    params: {
      page: '', // 传递当前是第几页参数
      limit: '', // 传递每页显示多少条记录参数
      searchName: '', // 传递搜索参数
      selectName: ''
    },
    headers: {
      asm: 'Basic dGVzdF9jbGllbnQ6dGVzdF9zZWNyZXQ='
    }
  },
  {
    name: 'findAllitem',
    method: 'GET',
    desc: '用于查找基础信息的详细内容',
    path: '/webitem/findAllitem',
    params: {
      page: '', // 传递当前是第几页参数
      limit: '', // 传递每页显示多少条记录参数
      searchName: '', // 传递搜索参数
      selectName: ''
    }
  },
  {
    name: 'findItemName',
    method: 'GET',
    desc: '用于查找基础信息的详细内容',
    path: '/webitem/findItemName',
    params: {
      itemid: ''
    }
  }
]
