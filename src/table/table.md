简单示例

* 注意，刷新列表需要调用yt-table的search方法，方法的参数会传到searchApi的option.params里
```js
  new Vue({
    data: {
      searchApi: (options) => {
        // 获取分页选项 及 参数
        let {page, rows, params} = options
        console.log('yt-table options', params)
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({
              "result": {
                "total": 1,
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
      }
    },
    methods:{
      /** 刷新表格时传入参数 */
      refresh () {
        this.$refs.ytTable.search({keyword: '关键字'});
      }
    },
    template: `
    <div>
      <el-button type="button" @click="refresh">刷新</el-button>
      <yt-table :search-api="searchApi" ref="ytTable">
         <template slot="columns">
           <!-- 行号 -->
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
    </div>`
  })
```

多选示例
```js
  new Vue({
    data: {
      searchApi: (options) => {
        // 获取分页选项 及 参数
        let {page, rows, params} = options
        console.log('yt-table options', params)
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({
              "result": {
                "total": 7,
                "rows": [{
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                  }, {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                  }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                  }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                  }, {
                    date: '2016-05-08',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                  }, {
                    date: '2016-05-06',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                  }, {
                    date: '2016-05-07',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                  }
                ]
              }
            })
          }, 2000)
        })
      }
    },
    methods:{
      /** 切换选中状态 */
      toggleSelection(selection) {
        let tableData = this.$refs.ytTable.getTableData()
        let rows = tableData && [tableData[1], tableData[2]]
        if (rows) {
          rows.forEach(row => {
            this.$refs.ytTable.toggleRowSelection(row, selection);
          });
        }
      },
      // 取消选中
      clearSelection () {
        this.$refs.ytTable.clearSelection();
      }
    },
    template: `
    <div>
      <p>
        <el-button @click="toggleSelection()">切换第二、第三行的选中状态</el-button>
        <el-button @click="toggleSelection(true)">直接选中第二、第三行</el-button>
        <el-button @click="clearSelection">取消选中</el-button>
      </p>
      <yt-table :search-api="searchApi" ref="ytTable">
         <template slot="columns">
           <!-- 多选列，需要多选时添加这列 -->
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              label="日期"
              width="120">
              <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              width="120">
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址"
              show-overflow-tooltip>
            </el-table-column>

         </template>
       </yt-table>
    </div>`
  })
```