### mmbsList表单类型支持

定义数据类型，使用columns -> type ,默认为 text

* text      文体类型（默认）
* textarea  长文本
* number    数字
* date/datetime 日期，若不定义format，默认：YYYY-MM-DD HH:mm:ss)；也可定义formatter(row, column, value)
* file      文件上传，可选项：multiple, max(最多上传数), fileTypes(文件类型: ['.pdf', '.doc']), listType 文件列表类型(text, picture)
* radio     单选，使用options数组定义选项，例：
```c
options.columns: [
  { title: '性别', field: 'sex', type: 'radio', options: ['男', '女', {text: '保密', value: '' }] }
]

```
* select    下拉框，multiple若为true，则支持多选，options同上


```c
示例中使用了动态slot，嵌入列模板（"标签" 列）

--- 1 columns 项中定义 slot 名称(slot: 'colLabels')

--- 2 定义el-table-column(slot='colLabels')

--- 3 若某一列不想出现在编辑表单中，可以定义columns 项中 edit = false
```

注意： 通过mmbs sdk返回的数据列表，除id，其他属性都放在attributes里

```js
new Vue({
  components: {
    ElTag: require('element-ui').Tag,
    ElTableColumn: require('element-ui').TableColumn
  },
  template: `
    <mmbs-list :options="options">
      <el-table-column
        slot="colLabels"
        prop="labels"
        width="150"
        align="center"
        label="标签">
        <template slot-scope="scope">
          <el-tag type="primary" style="margin-right: 5px" close-transition v-for="(item, index) in scope.row.attributes.labels" :key="index">
            {{item}}
          </el-tag>
        </template>
      </el-table-column>
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
          {title: '是否PC', field: 'isPC', type: 'radio', options: ['是', '否', {text: '跨平台', value: '当然'}]},
          {title: '发布日期', field: 'publicDate', type: 'date', format: 'YYYY-MM-DD'},
          {title: '标签', field: 'labels', type: 'select', options: ['游戏', '赛车游戏', '益智游戏', '策略游戏'], multiple: true, formItemCols: 24, slot: 'colLabels'},
          // {title: '创建时间', field: 'createdAt', type: 'date', width: 150, edit: false, formatter(row, column, value) {return value.toLocaleDateString()}},
          {title: '附件', field: 'files', type: 'file', max: 3, fileTypes: ['.png', '.jpg', '.gif', '.jpeg'], formItemCols: 24 },
          /* 列中定义表单列宽 */
          {title: '说明', field: 'remark', type: 'textarea', formItemCols: 18}
        ],
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

### mmbsList 上传图片&图片预览
若上传的字段是图片类型，且希望可以预览，可以：
1. 定义列 type = 'file'
2. 定义列 listType = 'picture'

```js
new Vue({
  components: {
    ElTag: require('element-ui').Tag,
    ElTableColumn: require('element-ui').TableColumn
  },
  template: `
    <mmbs-list :options="options"/>
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
          {title: '附件', field: 'files', type: 'file', max: 3, fileTypes: ['.png', '.jpg', '.gif', '.jpeg'], listType: 'picture'}
        ],
        search: true,
        searchField: 'name',
        searchLabel: '输入名称'
      }
    }
  }
})

```

### mmbsList 表单验证

定义表单验证规则，使用options.validRules（同element-ui -> Form -> rules，默认为无验证

rules示例：
```c
options.validRules = {
  // 名称验证
  name: [
    {required: true, message: '请输入游戏名称', trigger: 'blur'},
    {min: 1, max: 20, message: '名称长度在1-20之间', trigger: 'change'}
  ],
  // 正则表达式验证
  tel: {
    {pattern: /^1\d{10}$/, message: '请输入电话号码', trigger: 'change'}
  }
}
```
### 表单验证示例
```js
new Vue({
  components: {
    ElTag: require('element-ui').Tag,
    ElTableColumn: require('element-ui').TableColumn
  },
  template: `
    <mmbs-list :options="options">
      <el-table-column
        slot="colLabels"
        prop="labels"
        width="150"
        align="center"
        label="标签">
        <template slot-scope="scope">
          <el-tag type="primary" style="margin-right: 5px" close-transition v-for="(item, index) in scope.row.attributes.labels" :key="index">
            {{item}}
          </el-tag>
        </template>
      </el-table-column>
    </mmbs-list>
  `,
  data () {
    return {
      options: {
        validRules: {
          name: [
            {required: true, message: '请输入游戏名称', trigger: 'blur'},
            {min: 1, max: 20, message: '名称长度在1-20之间', trigger: 'change'}
          ],
          labels: [ {type: 'array', required: true, message: '请选择至少一项'} ]
        },
        title: '游戏信息',
        collectionName: 'GameList',
        add: true,
        edit: true,
        delete: true,
        columns: [
          {title: '名称', field: 'name', width: 150},
          {title: '下载数', field: 'downloadNumber', type: 'number'},
          {title: '是否PC', field: 'isPC', type: 'radio', options: ['是', '否', {text: '跨平台', value: '当然'}]},
          {title: '发布日期', field: 'publicDate', type: 'date', format: 'YYYY-MM-DD'},
          {title: '标签', field: 'labels', type: 'select', options: ['游戏', '赛车游戏', '益智游戏', '策略游戏'], multiple: true, formItemCols: 24, slot: 'colLabels'},
          {title: '创建时间', field: 'createdAt', type: 'date', width: 150, edit: false, formatter(row, column, value) {return value.toLocaleDateString()}},
          /* 列中定义表单列宽 */
          {title: '说明', field: 'remark', type: 'textarea', formItemCols: 18}
        ],
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