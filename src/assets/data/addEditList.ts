export const addEditList = {
  needList: {
    dataTableList: [
      {
        label: '需求编号',
        putType: 'disput',
        dataName: 'needid',
        placeholder: ''
      },
      {
        label: '需求标题',
        putType: 'input',
        dataName: 'needtitle',
        placeholder: '例如:钢材购买需求申请'
      },
      {
        label: '材料类型',
        putType: 'selectUrl',
        url: 'item/findItemName',
        queryParams: {
          itemid: 1
        },
        selectData: [],
        dataName: 'itemtype',
        linkage: 'itemid'
      },
      {
        label: '物料编号',
        putType: 'selectUrl',
        url: 'item/findItemName',
        queryParams: {
          itemid: 16
        },
        selectData: [],
        dataName: 'itemid',
        linkage: ''
      },
      {
        label: '材料单位',
        putType: 'selectUrl',
        url: 'item/findItemName',
        queryParams: {
          itemid: 7
        },
        selectData: [],
        dataName: 'unit',
        linkage: ''
      },
      { label: '数量', putType: 'num', dataName: 'neednum' },
      {
        label: '需求部门',
        putType: 'selectUrl',
        url: 'item/findItemName',
        queryParams: {
          itemid: 12
        },
        selectData: [],
        dataName: 'department',
        linkage: ''
      },
      { label: '申请人编号', putType: 'disput', dataName: 'neederid' },
      { label: '详情', putType: 'textarea', dataName: 'comment', placeholder: '例如:此申请用于XXX公司的订单交易' }
    ],
    formList: {
      needid: '',
      needtitle: '',
      itemtype: '',
      itemid: '',
      neednum: '',
      needday: '',
      unit: '',
      neederid: '',
      comment: '',
      uptype: ''
    },
    url: {
      add: 'need/addNeed',
      edit: 'need/editNeed',
      approval: 'need/editNeed',
      startApproval: 'need/approvalNeed',
      upApproval: 'need/completeprocess'
    }
  },
  buyList: {
    dataTableList: [
      {
        label: '订单编号',
        putType: 'disput',
        dataName: 'buyid'
      },
      {
        label: '订单标题',
        putType: 'input',
        dataName: 'buytitle',
        placeholder: '例如:钢材购买申请'
      },
      {
        label: '材料类型',
        putType: 'selectUrl',
        url: 'item/findItemName',
        queryParams: {
          itemid: 1
        },
        selectData: [],
        dataName: 'itemtype',
        linkage: 'itemid'
      },
      {
        label: '物料编号',
        putType: 'selectUrl',
        url: 'item/findItemName',
        queryParams: {
          itemid: 16
        },
        selectData: [],
        dataName: 'itemid',
        linkage: ''
      },
      {
        label: '数量',
        putType: 'num',
        dataName: 'num'
      },
      {
        label: '材料单位',
        putType: 'selectUrl',
        url: 'item/findItemName',
        queryParams: {
          itemid: 7
        },
        selectData: [],
        dataName: 'unit',
        linkage: ''
      },
      {
        label: '重要程度',
        putType: 'select',
        selectData: [
          {
            value: 1,
            label: '一般'
          },
          {
            value: 2,
            label: '紧急'
          },
          {
            value: 3,
            label: '加急'
          }
        ],
        dataName: 'importance'
      },
      {
        label: '部门',
        putType: 'selectUrl',
        url: 'item/findItemName',
        queryParams: {
          itemid: 12
        },
        selectData: [],
        dataName: 'department',
        linkage: ''
      },
      {
        label: '详情',
        putType: 'textarea',
        dataName: 'comment',
        placeholder: '例如:此申请用于XXX公司的订单交易'
      }
    ],
    formList: {
      buyid: '',
      buytitle: '',
      btime: '',
      itemtype: '',
      itemid: '',
      num: '',
      unit: '',
      importance: '',
      comment: '',
      department: ''
    },
    url: {
      add: 'buy/addBuy',
      edit: 'buy/updateBuy',
      approval: 'buy/updateBuy',
      startApproval: 'buy/startBuyAct',
      upApproval: 'buy/completeprocess'
    }
  },
  department: {
    dataTableList: [
      {
        label: '部门名称',
        putType: 'input',
        dataName: 'departmentname'
      },
      {
        label: '部门编号',
        putType: 'numput',
        dataName: 'departmentid'
      },
      {
        label: '部门描述',
        putType: 'textarea',
        dataName: 'detail'
      }
    ],
    formList: {
      departmentname: '',
      departmentid: '',
      detail: ''
    },
    url: {
      add: 'department/addDepart',
      edit: 'department/editDepart'
    }
  },
  itemList: {
    dataTableList: [
      {
        label: '名称',
        putType: 'input',
        dataName: 'itemtype',
        placeholder: ''
      },
      {
        label: '描述',
        putType: 'textarea',
        dataName: 'comment',
        placeholder: ''
      }
    ],
    formList: {
      itemid: '',
      itemtype: '',
      comment: '',
      parentid: ''
    },
    url: {
      add: 'item/additem',
      edit: 'item/editItem',
      approval: ''
    }
  },
  warehouse: {
    dataTableList: [
      {
        label: '物料编号',
        putType: 'input',
        dataName: 'itemcode',
        placeholder: '例如:JS001，XP201，JP015'
      },
      {
        label: '物料名称',
        putType: 'selectUrl',
        url: 'item/findItemName',
        queryParams: {
          itemid: 1
        },
        selectData: [],
        dataName: 'name',
        linkage: ''
      },
      {
        label: '货量',
        putType: 'num',
        dataName: 'stock'
      },
      {
        label: '空间',
        putType: 'num',
        dataName: 'totalstock'
      },
      {
        label: '材料单位',
        putType: 'selectUrl',
        url: 'item/findItemName',
        queryParams: {
          itemid: 7
        },
        selectData: [],
        dataName: 'unit',
        linkage: ''
      },
      {
        label: '描述',
        putType: 'textarea',
        dataName: 'comment',
        placeholder: '例如:此XXX材料是最新型号合成材料，有很强的硬度'
      }
    ],
    formList: {
      id: '',
      itemcode: '',
      name: '',
      totalstock: '',
      stock: '',
      comment: '',
      unit: ''
    },
    url: {
      add: 'warehouse/addDepository',
      edit: 'warehouse/updateDepository',
      approval: ''
    }
  },
  userList: {
    dataTableList: [
      {
        label: '系统编号',
        putType: 'disput',
        dataName: 'userid',
        placeholder: ''
      },
      {
        label: '登陆账号',
        putType: 'input',
        dataName: 'username',
        placeholder: '例如: 543214'
      },
      {
        label: '真实姓名',
        putType: 'input',
        dataName: 'realname',
        placeholder: '张三'
      },
      {
        label: '电话',
        putType: 'numput',
        dataName: 'telNum',
        placeholder: '例如: 185424215411'
      },
      {
        label: '员工号',
        putType: 'numput',
        dataName: 'employeeid',
        placeholder: '例如: 12531'
      }
    ],
    formList: {
      userid: '',
      username: '',
      realname: '',
      telNum: '',
      departmentid: '',
      employeeid: ''
    },
    url: {
      add: 'user/AddUser',
      edit: 'user/editUser',
      approval: ''
    }
  },
  permissionList: {
    dataTableList: [
      {
        label: '权限名称',
        putType: 'input',
        dataName: 'name',
        placeholder: '例如:测试权限'
      },
      {
        label: '权限类型',
        putType: 'input',
        dataName: 'type',
        placeholder: '例如:user'
      },
      {
        label: '权限地址',
        putType: 'input',
        dataName: 'url',
        placeholder: '例如:/Perm/updatePerm'
      },
      {
        label: '权限标识',
        putType: 'input',
        dataName: 'permission',
        placeholder: '例如:admin:updatePerm'
      }
    ],
    formList: {
      id: '',
      url: '',
      permission: '',
      name: '',
      type: ''
    },
    url: {
      add: 'permission/addPerm',
      edit: 'permission/updatePerm',
      approval: ''
    }
  },
  roleList: {
    dataTableList: [
      {
        label: '角色编号',
        putType: 'numput',
        dataName: 'roleId',
        placeholder: '例如:11000'
      },
      {
        label: '角色名称',
        putType: 'input',
        dataName: 'rolename',
        placeholder: '例如:测试员'
      },
      {
        label: '角色描述',
        putType: 'textarea',
        dataName: 'description',
        placeholder: '例如:用于测试系统的异常'
      }
    ],
    formList: {
      roleId: '',
      rolename: '',
      description: ''
    },
    url: {
      add: 'role/addRole',
      edit: 'role/updateRole',
      approval: ''
    }
  }
}
