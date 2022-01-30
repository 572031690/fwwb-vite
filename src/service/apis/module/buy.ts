export default [
  {
    name: 'addBuy',
    method: 'POST',
    desc: '增加购买订单数据',
    path: '/webbuy/addBuy',
    data: {
      buytitle: '',
      btime: '',
      itemtype: '',
      itemid: '',
      num: '',
      unit: '',
      importance: '',
      department: '',
      comment: ''
    }
  },
  {
    name: 'deleteBuy',
    method: 'GET',
    desc: '删除购买订单数据',
    path: '/webbuy/deleteBuy',
    params: {
      buyid: ''
    }
  },
  {
    name: 'updateBuy',
    method: 'POST',
    desc: '修改购买订单数据',
    path: '/webbuy/updateBuy',
    data: {
      buyid: '',
      buytitle: '',
      btime: '',
      itemtype: '',
      unit: '',
      itemid: '',
      num: '',
      importance: '',
      department: '',
      comment: ''
    }
  },
  {
    name: 'getBuy',
    method: 'POST',
    desc: '获取购买订单数据列表',
    path: '/webbuy/findAllBuy',
    data: {
      limit: '', // 每页显示5条记录
      page: '', // 当前是第几页
      searchName: '', // 查询数据
      selectName: '', // 查询状态
      sortType: '',
      ordertype: '',
      importancetype: '',
      arrivaltimetype: '',
      btimetype: '',
      department: '', // 需求单位
      itemtype: '', // 物料类别
      itemid: '', // 物料编号
      btime: '' // 需求时间: '' // 需求时间
    }
  },
  {
    name: 'findFinishedBuy',
    method: 'POST',
    desc: '获取购买订单历史代办',
    path: '/activiti/findFinishedBuy',
    data: {
      page: '', // 传递当前是第几页参数
      limit: '', // 传递每页显示多少条记录参数
      searchName: '', // 传递搜索参数
      selectName: '' // 查看需求审批状态 ##没加
    }
  },
  {
    name: 'approvalBuy',
    method: 'POST',
    desc: '提交购买订单送审批',
    path: '/web/listUser',
    data: {
      buyid: '',
      uptype: ''
    }
  },
  {
    name: 'findHistotyBuy',
    method: 'GET',
    desc: '查看购买历史审批',
    path: '/activiti/findHistotyBuy',
    params: {
      buyid: ''// int
    }
  },
  {
    name: 'startBuyAct',
    method: 'GET',
    desc: '启动采购流程',
    path: '/activiti/startBuyAct',
    params: {
      buyid: ''// int
    }
  },
  {
    name: 'queryBuyActTask',
    method: 'POST',
    desc: '找出购买个人代办任务',
    path: '/activiti/queryBuyActTask',
    data: {
      page: '', // 传递当前是第几页参数
      limit: '', // 传递每页显示多少条记录参数
      searchName: '', // 传递搜索参数
      selectName: '' // 查看需求审批状态 ##没加
    }
  },
  {
    name: 'completeprocess',
    method: 'GET',
    desc: '完成审批节点/ 提交审批',
    path: '/activiti/completeprocess',
    params: {
      taskId: '', // int
      text: ''// String
    }
  },
  {
    name: 'deleteprocess',
    method: 'GET',
    desc: '驳回审批节点',
    path: '/activiti/deleteprocess',
    params: {
      taskId: '', // int
      text: ''// String
    }
  },
  {
    name: 'startBuyActAgain',
    method: 'GET',
    desc: '重启采购流程',
    path: '/activiti/startBuyActAgain',
    params: {
      buyid: '' // int
    }
  },
  {
    name: 'buyResult',
    method: 'GET',
    desc: '导出excel',
    path: '/webbuy/buyResult',
    params: {}
  }
]
