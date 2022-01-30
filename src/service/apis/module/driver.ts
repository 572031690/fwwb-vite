export default [
  {
    name: 'monthIncrement',
    method: 'GET',
    desc: '月销增量',
    path: '/webMonthsalesup/findAll',
    params: {}
  },
  {
    name: 'monthSales',
    method: 'GET',
    desc: '月销量',
    path: '/webMonthsales/findAllMonthsales',
    params: {}
  },
  {
    name: 'countrySale',
    method: 'GET',
    desc: '省份销量数据',
    path: '/webCountrysale/findAll',
    params: {}
  },
  {
    name: 'findAllCompany',
    method: 'GET',
    desc: '公司信息',
    path: '/webCompany/findAllCompany',
    params: {}
  }
]
