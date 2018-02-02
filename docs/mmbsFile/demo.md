订阅示例。
```
new Vue({
  template: `<mmbs-list :options="options"/>`,
  data () {
    return {
      options: {
        title: '游戏信息',
        collectionName: 'GameList',
        add: true,
        edit: true,
        delete: true,
        columns: [
          {title: '名称', field: 'name', width: 150},
          {title: '创建时间', field: 'createdAt', type: 'date', width: 150, edit: false, formatter(row, column, value) {return value.toLocaleDateString()}},
          {title: '更新时间', field: 'updatedAt', type: 'date', width: 150, edit: false, formatter(row, column, value) {return value.toLocaleDateString()}},
          {title: '说明', field: 'remark', type: 'textarea'}
        ],
        query: { },
        search: true,
        searchField: 'name',
        searchLabel: '输入名称'
      }
    }
  }
})
```
