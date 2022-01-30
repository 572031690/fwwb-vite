export default [
  {
    name: 'updateUserPassword',
    method: 'POST',
    desc: '修改密码',
    path: '/web/updateUserPassword',
    data: {
      userid: '',
      oldpassword: '',
      password: ''
    }
  }
]
