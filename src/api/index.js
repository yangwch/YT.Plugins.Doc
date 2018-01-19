import mmbs from './mmbs'
mmbs.login({username: 'admin', password: 'yt123456'})
// 公共api,组件 增，删，改，查
export const commonApi = {
  get: (collectionName, data) => mmbs.query(collectionName, data),
  save: (collectionName, data) => mmbs.save(collectionName, data),
  update: (collectionName, data) => mmbs.update(collectionName, data.id, data.data),
  delete: (collectionName, data) => mmbs.delete(collectionName, data)
}