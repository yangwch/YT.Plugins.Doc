## 多列表单

添加，修改的表单，使用element-ui栅格布局，默认整行显示。

* 优先使用columns -> formItemCols
* 若未定义columns -> formItemCols，则使用options.formItemCols为表单项宽，默认24（整行）

显示两列，formItemCols 则为12；显示三列，则为8；etc...

```js
new Vue({
  template: `
    <mmbs-list :options="options">
      <template slot="buttons">
        <a href="###">button</a>
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
          {title: '下载数', field: 'downloadNumber', type: 'number'},
          {title: '创建时间', field: 'createdAt', type: 'date', width: 150, edit: false, formatter(row, column, value) {return value.toLocaleDateString()}},
          /* 列中定义表单列宽 */
          {title: '说明', field: 'remark', type: 'textarea', formItemCols: 18}
        ],
        query: { },
        search: true,
        searchField: 'name',
        searchLabel: '输入名称',
        /* 表单列宽，用于定义表单栅格布局的宽度 */
        formItemCols: 12
      }
    }
  }
})

```