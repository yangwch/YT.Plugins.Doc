mmbs示例
```
  <mmbs-list :options="{
    title: '角色信息',
    collectionName: 'roleList',
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
  }">
    <template slot="buttons">
      <a href="###">自定义按钮</a>
    </template>
  </mmbs-list>
```