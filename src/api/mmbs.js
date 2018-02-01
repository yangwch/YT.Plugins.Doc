import Mmbs from './../lib/mmbs'
// import { mmbsURL, appId, defPageSize } from '@/config/env'
// appId: 应用名
let appId = 'YTAPP'
// mmbsURL: mmbs服务地址
let mmbsURL = 'http://192.168.0.207:3080/mmbs'

// defPageSize: 默认分页数
let defPageSize = 10

Mmbs.initialize(appId)
Mmbs.serverURL = mmbsURL

const util = {
  /**
   * 保存
   * @param collectionName {String} - 集合名称
   * @param obj {Object} - 保存的对象
   */
  save (collectionName, obj) {
    var ClassObj = Mmbs.Object.extend(collectionName)
    var classObj = new ClassObj()
    return new Promise((resolve, reject) => {
      classObj.save(obj, {
        success (model) {
          resolve(model)
        },
        error (model, error) {
          if (process.env.NODE_ENV == 'development') {
            console.error(`save ${collectionName} error`, error)
          }
          reject(error)
        }
      })
    })
  },
  /** 
   * 更新数据
   * @param objectId {String} - 数据id
   * @param data {Object} - 对象
  */
  update (collectionName, objectId, data) {
    var ClassObj = Mmbs.Object.extend(collectionName)
    var obj = ClassObj.createWithoutData(objectId);
    return new Promise((resolve, reject) => {
      obj.save(data, {
        success (result) {
          resolve(result)
        },
        error (error) {
          reject(error)
        }
      })
    })
  },
  /**
   * 删除
   * @param collectionName {String} - 集合名称
   * @param objectId {String} - 对象id
   */
  delete (collectionName, objectId) {
    var ClassObj = Mmbs.Object.extend(collectionName)
    var obj = ClassObj.createWithoutData(objectId);
    return new Promise((resolve, reject) => {
      obj.destroy({
        success (result) {
          resolve(result)
        },
        error (error) {
          reject(error)
        }
      })
    })
  },
  /**
   * 将参数扩展到query对象上
   * @param {Object} query query对象
   * @param {Object} params 参数对象
   */
  extendQueryParams (query, params = {}) {
    let paramNames = Object.getOwnPropertyNames(params || {})
    if (paramNames.length) {
      paramNames.map(item => {
        let val = params[item]
        if (val && typeof val === 'string') {
          query.contains(item, val) // matches(item, new RegExp(val))
        } else if (val && typeof val === 'object') {
          query[val.type] && query[val.type](val.field || item, val.value)
        }
      })
    }
  },
  /**
   * 查询，分页，条件
   * @param collectionName {String} - 集合名称
   * @param options {Object} - 选项
   * @param options.params {Object} - 参数，示例：{playerName: 'Stan', minClassObj: {value: 60, field: 'obj', type: 'greaterThan'}} 
   */
  query (collectionName, options = {page: 1, rows: defPageSize, params: {}, _order: '-createdAt'}) {
    var ClassObj = Mmbs.Object.extend(collectionName)
    var query = new Mmbs.Query(ClassObj)
    /* 排序 */
    let order = options._order || '-createdAt'
    if (order.indexOf('-') === 0) {
      query.descending(order.replace('-', ''))
    } else {
      query.ascending(order)
    }
    // 添加查询条件到query
    util.extendQueryParams(query, options.params)
    let page = options.page || 1,
      limit = options.rows || defPageSize,
      skip = (page - 1) * limit
    return new Promise((resolve, reject) => {
      query.count({
        success (count) {
          query.limit(limit)
          query.skip(skip)
          query.find({
            success (results) {
              resolve({
                result: {
                  total: count,
                  rows: results
                }
              })
            },
            error (error) {
              reject(error)
            }
          })
        },
        error (error) {
          reject(error)
        }
      })
    })
  },
  /**
   * 数据订阅
   * @param {String} collectionName 集合名称
   * @param {Object} params 参数
   */
  liveQuery (collectionName, params) {
    var ClassObj = Mmbs.Object.extend(collectionName)
    var query = new Mmbs.Query(ClassObj)
    util.extendQueryParams(query, params)
    let subscription = query.subscribe()
    return subscription
  },
  /**
   * 查找列表所有记录
   * @param collectionName {String} - 集合名称
   */
  find (collectionName) {
    var ClassObj = Mmbs.Object.extend(collectionName)
    var query = new Mmbs.Query(ClassObj)
    return new Promise((resolve, reject) => {
      query.find({
        success (results) {
          resolve(results)
        },
        error (error) {
          if (process.env.NODE_ENV == 'development') {
            console.error(`find ${collectionName} error`, error)
          }
          reject(error)
        }
      })
    })
  },
  /**
   * 登录
   * @param data {Object} - 提交对象
   */
  login (data) {
    return new Promise((resolve, reject) => {
      Mmbs.User.logIn(data.username, data.password, {
        success: function(user) {
          resolve(user)
        },
        error: function(user, error) {
          reject(error)
        }
      });
    })
  },
  /**
   * 运行云代码
   * @param funcName {String} - 函数名称
   * @param data {Object} - 函数参数
   */
 runCloud (funcName, data) {
    return new Promise((resolve, reject) => {
      Mmbs.Cloud.run(funcName, data, {
        success: resolve,
        error: reject
      });
    })
  },
  
  /**
   * 登出
   */
  logout () {
    return Mmbs.User.logOut()
  },
  /**
   * 上传文件
   * @param {Object} file - 文件
   */
  uploadFile (file) {
    var mfile = new Mmbs.File(file.name, file)
    return mfile.save()
  },
  /**
   * 统计数据
   * @param collectionName {String} - 集合名称
   * @param options {String} - 选项
   */
  agg (collectionName, options) {
    var ClassObj = Mmbs.Object.extend(collectionName)
    var query = new Mmbs.Query(ClassObj)
    return query.aggregate(options)
  },
  // Mmbs实例
  getMmbs () {
    return Mmbs
  }
}
export default util
