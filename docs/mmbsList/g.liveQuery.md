对集合的 增删改 操作进行订阅。

系统提供了以下5种不同类型的事件：

* create 创建
* update 数据更新
* delete 数据删除
* enter  若订阅时有查询条件，筛选条件之外的数据更新后在当前条件之内，则触发
* leave  若订阅时有查询条件，筛选条件之内的数据更新后在当前条件之外，则触发

```js
  const commonApi = require('../../src/api/index.js').commonApi
  new Vue({
    template: `
    <div>
      集合名称：<input v-model="collectionName" />&nbsp;<input type="button" value="订阅" @click="onSubscripte"/>
      <pre>
        <span style="margin-bottom: 15px" v-for="(item, index) in logs" :key="index">
        {{item.action}}： {{item.data && item.data.attributes.name}}
        </span>
      </pre>
      游戏列表（GameList)：
      <ul>
        <li v-for="(item, index) in gameList" :key="index" v-html="item.attributes.name"></li>
      </ul>
    </div>
    `,
    data () {
      return {
        collectionName: 'GameList',
        subscrite: null,
        logs: [],
        gameList: []
      }
    },
    created () {
      this.getData()
    },
    methods: {
      /**
       * 获取GameList数据
       */
      getData () {
        commonApi.findAll('GameList').then(results => {
          this.gameList = results
        })
      },
      /**
       * 订阅GameList
       */
      onSubscripte () {
        if (this.subscrite) {
          this.subscrite.unsubscribe()
        }
        // 订阅 GameList 集合（集合名称，查询参数）
        this.subscrite = commonApi.liveQuery('GameList', this.formInline)
        this.subscrite.on('create', object => {
          console.log('created', object)
          // 创建记录的时候添加这条数据
          this.gameList.push(object)
          this.logs.push({action: 'create', data: object})
        }).on('update', object => {
          console.log('update', object)
          // 更新刚刚修改的那条数据
          if (object.id) {
            let index = this.gameList.findIndex(item => { return item.id === object.id })
            Object.assign(this.gameList[index], object)
          }
          this.logs.push({action: 'update', data: object})
        }).on('delete', object => {
          console.log('delete', object)
          // 从列表中移除刚刚删除的项
          if (object.id) {
            let index = this.gameList.findIndex(item => { return item.id === object.id })
            if (index >= 0) {
              this.gameList.splice(index, 1)
            }
          }
          this.logs.push({action: 'delete', data: object})
        })
        window.alert('已订阅')
      }
    }
  })
```
### 订阅示例
```js
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