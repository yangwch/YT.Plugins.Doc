<!--
  表格组件，支持分页
-->
<template>
  <div>
    <el-table
      ref="table"
      :border="border"
      :fit="fit"
      :stripe="stripe"
      :data="tableData"
      :empty-text="emptyText"
      highlight-current-row
      @sort-change="onSortChange"
      @selection-change="onSelectionChange"
      @current-change="onCurrentChange"
      :row-class-name='tableRowClassName'>
      <!-- @slot 列配置 -->
      <slot name="columns"/>
    </el-table>
    <div
      v-if="pagination"
      class="Pagination"
      style="text-align: left;margin-top: 10px;">
      <el-pagination
        v-if="reload"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="limit"
        layout="total, -> ,sizes, -> , prev, pager, next"
        :total="count"
      />
    </div>
  </div>
</template>

<style lang="less">
  .el-table th, .el-table tr {
    background-color: transparent;
  }

  .el-table__body tr.current-row > td, .el-table--striped .el-table__body tr.el-table__row--striped.current-row td {
    background: #d6e0e8;
  }
</style>

<script>
  // import { defPageSize } from '@/config/index'
  import * as ElementUI from 'element-ui/lib/index'
  const defPageSize = 15
  export default {
    name: 'yt-table',
    components: {
      ElPagination: ElementUI.Pagination,
      ElTable: ElementUI.Table,
      ElTableColumn: ElementUI.TableColumn
    },
    props: {
      /** 列宽是否自撑开 */
      fit: {
        type: Boolean,
        default: true,
        required: false
      },
      /** 是否显示斑马纹 */
      stripe: {
        type: Boolean,
        default: true,
        required: false
      },
      /** 是否分页，默认分页 */
      pagination: {
        type: Boolean,
        default: true,
        required: false
      },
      /** 分页数量选项 */
      pageSizes: {
        type: Array,
        default: function () {
          return [5, 10, 15, 50, 100]
        },
        required: false
      },
      /**
       * 查询Api,方法；
       * 参数： {page: 1, rows: 15, params: {}, _order: null}
       */
      searchApi: {
        type: Function,
        required: true
      },
      /** 查询参数 */
      params: {
        type: Object,
        default() {
          return {}
        },
        required: false
      },
      /**
       * 表格边框，默认true
       */
      border: {
        type: Boolean,
        default() {
          return true
        }
      },
      /**
       * 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。
       * Function({row, rowIndex})/String
       */
      tableRowClassName: {
        type: [Function, String],
        required: false
      },
      /** 创建的时候自动去请求数据 */
      autoInit: {
        type: Boolean,
        default: true
      }
    },
    /*  数据 */
    data() {
      let limit = (this.$sysConfig && this.$sysConfig.defPageSize) || defPageSize
      return {
        reload: true,
        tableData: [],
        currentRow: null,
        offset: 0,
        limit: limit,
        count: 0,
        currentPage: 1,
        emptyText: '暂无数据',
        selection: null,
        orderOption: null,
        tmpParams: {}
      }
    },
    created() {
      if (this.autoInit) {
        this.initData()
      }
    },
    methods: {
      async initData() {
        try {
          this.getApiData()
        } catch (err) {
          this.$message.error('获取数据失败')
        }
      },
      /*  页码数量变化 */
      handleSizeChange(val) {
        this.limit = val
        this.getApiData()
      },
      /*  当前页变化事件 */
      handleCurrentChange(val) {
        this.currentPage = val
        this.offset = (val - 1) * this.limit
        this.getApiData()
      },
      /**
       * 行选中事件：参数 selection
       * @event onCurrentChange(selection)
       */
      onCurrentChange(selection) {
        this.currentRow = selection
        this.$emit('onCurrentChange', selection)
      },
      /*  当选择项变化时触发 */
      onSelectionChange(selection) {
        this.selection = selection
      },
      /* 获取选中 */
      getSelection() {
        return this.selection
      },
      /* 获取当前行 */
      getCurrentRow() {
        return this.currentRow
      },
      /*  返回当前表格装载数据 */
      getTableData() {
        return this.tableData
      },
      /*  获取数据 */
      async getApiData(paramsData) {
        var params = {} // this.params
        params.page = this.currentPage
        params.rows = this.limit
        params.params = paramsData || Object.assign({}, this.params, this.tmpParams)
        params._order = this.orderOption
        this.emptyText = '加载中。。。'
        this.tableData = []
        this.reload = false
        const result = await this.searchApi(params)
        this.tableData = (result && result.result && result.result.rows) || []
        this.count = (result && result.result && result.result.total) || 0
        this.emptyText = '暂无数据'
        this.reload = true
      },
      /*  查询 */
      search(params) {
        this.tmpParams = params || {}
        let paramsData = Object.assign({}, this.params, params)
        this.getApiData(paramsData)
      },
      /*  取消选中 */
      clearSelection() {
        this.$refs.table.clearSelection()
      },
      /* 排序变化 */
      onSortChange(option) {
        let prop = (option.prop && option.prop.split('.')[option.prop.split('.').length - 1]) || ''
        let orderOption = (prop && (option.order === 'ascending' ? prop : '-' + prop)) || ''
        this.orderOption = orderOption
        this.getApiData()
      },
      /* 改变单条数据 */
      changeOneData(obj, type) {
        this.tableData.forEach((item, index) => {
          if (item.id === obj.id) {
            if (type === 'delete') {
              this.tableData.splice(index, 1)
            } else if (type === 'update') {
              this.tableData.splice(index, 1, obj)
            }
          }
        })
        if (type === 'create') {
          this.tableData.unshift(obj)
          this.tableData.pop()
        }
      }
    }
  }
</script>
