export const rulesData = {
  userId: [
    { required: true, message: 'ID不能为空', trigger: 'blur' },
    { type: 'number', message: 'ID必须为数字值' }
  ],
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
  ],
  realname: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 24, message: '长度不能小于六位', trigger: 'blur' }
  ],
  telNum: [
    { required: true, message: '请输入电话号码', trigger: 'blur' },
    { pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确' } // 手机号码验证！！！！
    // { type: 'number', message: '电话为数字值',trigger: 'blur'},
    // { min: 9, max: 15, message: '长度不能小于9位', trigger: 'blur' }
  ],
  arrivaltime: [{ required: true, message: '到货日期不能为空', trigger: 'blur' }],
  importance: [{ required: true, message: '请选择重要重度', trigger: 'blur' }],
  department: [{ required: true, message: '请选择需求单位', trigger: 'change' }],
  departmentid: [{ required: true, message: '请选择部门编号', trigger: 'change' }],
  employeeid: [
    { required: true, message: '请输入员工编号', trigger: 'change' },
    { type: 'number', message: '编号为数字值', trigger: 'blur' }
  ],
  address: [{ required: true, message: '请填写地址', trigger: 'blur' }],
  needid: [
    { required: true, message: 'ID不能为空', trigger: 'blur' },
    { type: 'number', message: 'ID必须为数字值' }
  ],
  needtitle: [
    { required: true, message: '请输入需求名单', trigger: 'blur' },
    {
      min: 3,
      max: 20,
      message: '长度在 3 到 20 个字符',
      trigger: 'blur'
    }
  ],
  itemid: [{ required: true, message: '需求编号不能为空', trigger: 'change' }],
  neednum: [
    { required: true, message: '需求数量不能为空', trigger: 'blur' },
    { type: 'number', message: '需求数量必须为数字值' }
  ],
  needday: [{ required: true, message: '需求日期不能为空', trigger: 'blur' }],
  comment: [{ required: true, message: '请填写详情', trigger: 'blur' }],
  buyid: [
    { required: true, message: 'ID不能为空', trigger: 'blur' },
    { type: 'number', message: 'ID必须为数字值' }
  ],
  buytitle: [
    { required: true, message: '请输入需求单名', trigger: 'blur' },
    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
  ],
  btime: [{ required: true, message: '需求日期不能为空', trigger: 'blur' }],
  itemtype: [{ required: true, message: '请选择需求类型', trigger: 'change' }],
  num: [
    { required: true, message: '需求数量不能为空', trigger: 'blur' },
    { type: 'number', message: '需求数量必须为数字值' }
  ],
  buyerid: [
    { required: true, message: 'ID不能为空', trigger: 'blur' },
    { type: 'number', message: 'ID必须为数字值' }
  ],
  auditid: [
    { required: true, message: '订单码不能为空', trigger: 'blur' },
    { type: 'number', message: '订单码必须为数字值' }
  ],
  neederid: [
    { required: true, message: 'ID不能为空', trigger: 'blur' },
    { type: 'number', message: 'ID必须为数字值' }
  ],
  departmentname: [
    { required: true, message: '请输入需求单名', trigger: 'blur' },
    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
  ],
  itemcode: [{ required: true, message: '物料编号不能为空', trigger: 'blur' }],
  unit: [{ required: true, message: '请选择单位', trigger: 'blur' }],
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  detail: [{ required: true, message: '部门描述不能为空', trigger: 'blur' }],
  itemunit: [{ required: true, message: '单位不能为空', trigger: 'blur' }]
}
