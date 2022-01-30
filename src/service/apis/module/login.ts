export default [
  {
    name: 'login',
    method: 'POST',
    desc: '用户登陆接口',
    path: '/web/shirologin',
    data: {
      username: '', // 李三
      password: '' // 123456  这是目前能用的
    }
  },
  {
    name: 'rigister',
    method: 'POST',
    desc: '用户注册请求',
    path: '/web/logon',
    data: {
      username: '',
      password: '',
      telNum: '',
      employeeid: ''
    }
  },
  {
    name: 'getCode',
    method: 'POST',
    desc: '发生注册手机验证码',
    path: '/getCode',
    params: {
      phone: ''
    }
  },
  {
    name: 'getCookie',
    method: 'GET',
    desc: '获取cookie凭证',
    path: '/web/getCookie',
    params: {}
  }
]
