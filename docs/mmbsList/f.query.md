## mmbsList默认查询条件

若要使用默认查询条件，例如：

* 下载数大于0的数据，可以定义
```c
options.query = {
  downloadNumber: {
    type: 'greaterThan',
    value: 0
  }
}
```
* 若同一字段，在查询中使用多次，则可以这样定义
```c
options.query = {
  downloadNumber1: {
    field: 'downloadNumber',
    type: 'greaterThan',
    value: 0
  },
  downloadNumber2: {
    field: 'downloadNumber',
    type: 'lessThan',
    value: 1000
  }
}
```
* 隐藏添加，修改，删除；只需要将 options 中 add,edit,delete移除或改为false
* 若要隐藏默认查询条件，只需要将 options 中 search 改为 false

#### 示例：隐藏操作按钮，查询下载数在0-1000内的游戏,并隐藏操作按钮与查询

```js
new Vue({
  template: `
    <mmbs-list :options="options">
    </mmbs-list>
  `,
  data () {
    return {
      options: {
        title: '游戏信息',
        collectionName: 'GameList',
        columns: [
          {title: '名称', field: 'name', width: 150},
          {title: '下载数', field: 'downloadNumber', type: 'number'},
          {title: '创建时间', field: 'createdAt', type: 'date', width: 150, edit: false, formatter(row, column, value) {return value.toLocaleDateString()}},
          /* 列中定义表单列宽 */
          {title: '说明', field: 'remark', type: 'textarea', formItemCols: 18}
        ],
        // 查询条件：下载数大于0，小于1000
        query: {
          downloadNumber1: {
            field: 'downloadNumber',
            type: 'greaterThan',
            value: 0
          },
          downloadNumber2: {
            field: 'downloadNumber',
            type: 'lessThan',
            value: 1000
          }
        },
        search: false,
        /* 表单列宽，用于定义表单栅格布局的宽度 */
        formItemCols: 12
      }
    }
  }
})

```