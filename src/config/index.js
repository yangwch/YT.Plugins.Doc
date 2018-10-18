/**
 * 配置编译环境和线上环境之间的切换
 * baseUrl: api域名地址
 * routerMode: 路由模式
 * appId: 应用名
 * mmbsURL: mmbs服务地址
 * defPageSize: 默认分页数
 * locale: 默认语言
 * systemName: 系统名称
 *
 */
let baseUrl = ''
// routerMode: 路由模式
let routerMode = 'hash'
// defPageSize: 默认分页数
let defPageSize = 15
// 默认语言
let locale = 'cn'
let systemName = '曹家滩智慧矿山平台'
// 是否需要验证码才能登录
let captcha = false
// 菜单宽
let menuWidth = '235px'
// 默认 司机，乘客 角色
let roleNames = {
  driver: 'driver',
  passenger: 'passenger'
}
// 添加默认密码
let defPassword = 'yt123456'

if (process.env.NODE_ENV == 'development') {
  baseUrl = '';
}

export {
  baseUrl,
  routerMode,
  defPageSize,
  locale,
  systemName,
  captcha,
  menuWidth,
  roleNames,
  defPassword
}