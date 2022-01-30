export const tableList = {
  needList: {
    tableTitle: ['编号', '需求标题', '物料名称', '物料编号', '数量', '创建日期', '提交人编号', '需求单位', '状态', '操作'],
    tableBody: ['needid', 'needtitle', 'itemtype', 'itemid', 'neednum', 'needday', 'neederid', 'department', 'opetation2', 'opetation1']
  },
  needListHistry: {
    tableTitle: ['编号', '需求标题', '物料名称', '物料编号', '数量', '创建日期', '提交人编号', '需求单位', '详情', '状态'],
    tableBody: ['needid', 'needtitle', 'itemtype', 'itemid', 'neednum', 'needday', 'neederid', 'department', 'comment', 'opetation2']
  },
  buyList: {
    tableTitle: ['编号', '订单标题', '需求日期', '到货日期', '物料名称', '物料编号', '数量', '提交人编号', '重要程度', '状态', '操作'],
    tableBody: ['buyid', 'buytitle', 'btime', 'arrivaltime', 'itemtype', 'itemid', 'num', 'buyerid', 'importance', 'opetation2', 'opetation1']
  },
  buyListHistry: {
    tableTitle: ['编号', '订单标题', '需求日期', '到货日期', '物料名称', '物料编号', '数量', '提交专员编号', '重要程度', '状态'],
    tableBody: ['buyid', 'buytitle', 'btime', 'arrivaltime', 'itemtype', 'itemid', 'num', 'buyerid', 'importance', 'opetation2']
  },
  departmentList: {
    tableTitle: ['部门名称', '部门编号', '操作'],
    tableBody: ['departmentname', 'departmentid', 'opetation']
  },
  itemListsee: {
    tableTitle: ['编号', '名称', '描述'],
    tableBody: ['itemid', 'itemtype', 'comment']
  },
  itemListedit: {
    tableTitle: ['编号', '名称', '描述', '操作'],
    tableBody: ['itemid', 'itemtype', 'comment', 'opetation']
  },
  warehouseList: {
    tableTitle: ['物料编号', '物资名称', '描述', '货量', '总货量', '单位', '操作'],
    tableBody: ['itemcode', 'name', 'comment', 'stock', 'totalstock', 'unit', 'opetation']
  },
  warehouseSeeList: {
    tableTitle: ['物料编号', '物资名称', '描述', '货量', '总货量', '单位'],
    tableBody: ['itemcode', 'name', 'comment', 'stock', 'totalstock', 'unit']
  },
  controlOutStockList: {
    tableTitle: ['物料编码', '物资名称', '申请物资编号', '货量', '单位', '创建日期', '操作', '管理'],
    tableBody: ['itemid', 'name', 'needid', 'num', 'unit', 'time', 'opetation2', 'opetation1']
  },
  controlInStockList: {
    tableTitle: ['物料编码', '物资名称', '申请物资编号', '货量', '单位', '创建日期', '操作', '管理'],
    tableBody: ['itemid', 'name', 'buyid', 'num', 'unit', 'time', 'opetation2', 'opetation1']
  },
  controlNeedList: {
    tableTitle: ['序号', '需求标题', '物料名称', '物料编号', '数量', '创建日期', '提交人编号', '需求单位', '详情', '操作'],
    tableBody: ['index', 'needtitle', 'itemtype', 'itemid', 'neednum', 'needday', 'neederid', 'department', 'comment', 'opetation']
  },
  constrolBuyList: {
    tableTitle: ['序号', '订单标题', '创建日期', '到货日期', '物料名称', '物料编号', '数量', '提交人编号', '重要程度', '详情', '操作'],
    tableBody: ['index', 'buytitle', 'btime', 'arrivaltime', 'itemtype', 'itemid', 'num', 'buyerid', 'importance', 'comment', 'opetation']
  },
  roleList: {
    tableTitle: ['序号', '角色编号', '角色名称', '描述', '状态', '操作', '权限'],
    tableBody: ['index', 'roleId', 'rolename', 'description', 'isDeleted', 'opetation', 'opetationRole']
  },
  permList: {
    tableTitle: ['序号', '权限名称', '权限类型', '请求地址', '权限标识', '状态', '操作'],
    tableBody: ['index', 'name', 'type', 'url', 'permission', 'isDisabled', 'opetation']
  },
  userListedit: {
    tableTitle: ['序号', '职工号', '用户姓名', '登陆账号', '电话号码', '状态', '操作', '角色'],
    tableBody: ['index', 'employeeid', 'realname', 'username', 'telNum', 'roleStatus', 'opetation', 'opetationRole']
  },
  userListsee: {
    tableTitle: ['序号', '职工号', '用户姓名', '登陆账号', '电话号码', '职位'],
    tableBody: ['index', 'employeeid', 'realname', 'username', 'telNum', 'roleId']
  }
}
