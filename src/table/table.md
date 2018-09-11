简单示例
```js
  new Vue({
    components: {
      ElTableColumn: require('element-ui').TableColumn
    },
    data: {
      searchApi: (params) => {
        console.log('yt-table params', params)
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({
              "result": {
                "total":10,
                "rows":[
                  {
                    "id":1,
                    "userName":"张三",
                    "department":"事业部"
                  }
                ]
                }
              })
          }, 2000)
        })
      },
    },
    template: `
    <div>
      <input type="button" value="刷新" @click="refresh"/>
      <yt-table :search-api="searchApi" ref="tablePlugin">
         <template slot="columns">
           <!-- 多选列，需要多选时添加这列 -->
           <el-table-column
             type="selection"
             width="55">
           </el-table-column>
           <el-table-column
             type="index"
             width="100">
           </el-table-column>
           <el-table-column
             property="department"
             label="部门">
           </el-table-column>
           <el-table-column
             property="userName"
             label="用户姓名">
           </el-table-column>
         </template>
       </yt-table>
    </div>`,
    methods:{
      refresh () {
        this.$refs.tablePlugin.search({});
      }
    }
  })
```