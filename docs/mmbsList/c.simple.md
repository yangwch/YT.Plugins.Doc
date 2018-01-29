## mmbsList简单示例

示例，createdAt 和 updatedAt，会自动生成，可以直接使用
```
new Vue({
  template: `
    <mmbs-list :options="options">
      <template slot="buttons">
        <a href="###">自定义按钮</a>
      </template>
    </mmbs-list>
  `,
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