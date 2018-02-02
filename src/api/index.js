import mmbs from './mmbs'
mmbs.login({username: 'admin', password: 'yt123456'})
// 公共api,组件 增，删，改，查，上传文件，数据订阅
export const commonApi = {
  get: (collectionName, data) => mmbs.query(collectionName, data),
  save: (collectionName, data) => mmbs.save(collectionName, data),
  update: (collectionName, data) => mmbs.update(collectionName, data.id, data.data),
  delete: (collectionName, data) => mmbs.delete(collectionName, data),
  /* 上传文件 */
  upload: file => mmbs.uploadFile(file),
  /* 数据订阅 */
  liveQuery: (collectionName, params) => mmbs.liveQuery(collectionName, params),
  agg: (collectionName, params, pipeline) => mmbs.agg(collectionName, params, pipeline)
}