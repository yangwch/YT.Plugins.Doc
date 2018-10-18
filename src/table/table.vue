<!--
  表格组件，支持分页
-->
<template>
  <div>
    <el-table
      ref="table"
      :height="height"
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
      style="text-align: left;margin: 6px 0;">
      <el-pagination
        v-if="reload"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="limitNum"
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
  import { defPageSize } from './../config/index'

  export default {
    name: 'yt-table',
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
      /** 默认分页数 */
      limit: {
        type: Number,
        default() {
          return (this.$sysConfig && this.$sysConfig.defPageSize) || defPageSize
        }
      },
      /**
       * 查询数据的API方法，每次刷新/翻页时调用，参数中包括 当前页码 page(从1开始）, 每页条数 rows, 查询参数 params
       */
      searchApi: {
        type: Function,
        required: true
      },
      /** 默认查询参数 */
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
      /** 表格行样式 */
      tableRowClassName: {
        type: Function,
        required: false
      },
      /** 表格的高度 */
      height: {
        type: [String, Number]
      },
      /* 创建的时候自动去请求数据 */
      autoInit: {
        type: Boolean,
        default: true
      }
    },
    /*  数据 */
    data() {
      return {
        reload: true,
        tableData: [],
        limitNum: this.limit,
        currentRow: null,
        offset: 0,
        count: 0,
        currentPage: 1,
        emptyText: '暂无数据',
        selection: null,
        orderOption: null,
        tmpParams: {}
      }
    },
    components: {},
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
        this.limitNum = val
        this.getApiData()
      },
      /*  当前页变化事件 */
      handleCurrentChange(val) {
        this.currentPage = val
        this.offset = (val - 1) * this.limitNum
        this.getApiData()
      },
      /**
       * 行选中事件，参数为当前选中行
       * @event onCurrentChange
       * @type {Array}
       */
      onCurrentChange(selection) {
        this.currentRow = selection
        this.$emit('onCurrentChange', selection)
      },
      /*  当选择项变化时触发 */
      onSelectionChange(selection) {
        this.selection = selection
      },
      /**
       * 获取选中行数据
       * @public
       * @returns {Array} 选中行数据
       */
      getSelection() {
        return this.selection
      },
      /**
       * 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
       * @public
       * @param {Object} row 行对象
       * @param {Boolean} selection 是否选中，不传则切换选中状态
       */
      toggleRowSelection (row, selection) {
        this.$refs.table.toggleRowSelection(row, selection)
      },
      /**
       * 获取当前行
       * @public
       * @returns {Object} 当前行数据
       */
      getCurrentRow() {
        return this.currentRow
      },
      /**
       * 返回当前表格装载数据
       * @public
       * @returns {Array} 表格数据
       */
      getTableData() {
        return this.tableData
      },
      /*  获取数据 */
      async getApiData(paramsData) {
        var params = {} // this.params
        params.page = this.currentPage
        params.rows = this.limitNum
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
      /**
       * 查询刷新表格
       * @public
       * @param {Object} params 参数对象
       * @returns none
       */
      search(params) {
        this.tmpParams = params || {}
        let paramsData = Object.assign({}, this.params, params)
        this.getApiData(paramsData)
      },
      /**
       * 取消选中
       * @public
       * @returns none
       */
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
      /**
       * 
       * 改变单条数据
       * @public
       * @param {Object} obj 更新，创建，删除的行对象，使用“id”属性标识
       * @param {Object} type 操作类型（create/update/delete）
       * @returns none
       * 
       */
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
      },
      /**
       * 改变全部数据
       * @public
       * @param {Array} data 数据列表
       * @returns none
       */
      changeAllData(data) {
        this.tableData = [].concat(data)
      }
    }
  }
</script>
