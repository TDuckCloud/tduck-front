export default {
  // 签名秘钥
  signSecret: '916lWh2WMcbSWiHv',
  // 密码正则
  passwordReg: /^.{6,}$/,
  passwordRegDesc: '密码最少为6位字符',
  // 强密码正则（8-20位，必须同时包含字母和数字）
  strongPasswordReg: /^(?=.*[a-zA-Z])(?=.*\d).{8,20}$/,
  strongPasswordRegDesc: '密码长度为8-20位字符，且必须同时包含字母和数字',
  userUploadUrl: `${process.env.VUE_APP_API_ROOT}/user/file/upload`,
  // 启用微信功能
  enableWx: process.env.VUE_APP_WX == 'ON'
}
