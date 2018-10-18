<!--
  列表页面模板插件 2017-06-28
  @author yangwenchao
 -->
<template>
  <el-card class="box-card table_container">
    <!-- @slot 标题-->
    <slot name="header">
      <div slot="header" class="clearfix" v-if="title" v-text="title">
      </div>
    </slot>
    <el-row>
      <el-form :inline="true" class="form-inline left">
        <slot name="buttons">&nbsp;</slot>
      </el-form>
      <!-- @slot 查询 -->
      <slot name="search">
        <!--右边的搜索-->
        <el-form :inline="true" :model="formData" class="form-inline right">
          <el-form-item label="">
          <el-input v-model="formData.search" @keyup.enter.native="onSearch" :placeholder="searchLabel"></el-input>
          </el-form-item>
          <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </slot>
    </el-row>
    <!--新增无命名的组件，用于巡检任务页面图片的排列-->
    <slot></slot>
    <slot name="tabs"></slot>
    <!--分页-->
    <yt-table ref="tablePl"
      :fit="fit"
      :params= "searchParams"
      :stripe="stripe"
      :pagination="pagination"
      :page-sizes="pageSizes"
      :search-api="searchApi"
      :tableRowClassName='tableRowClassName'>
        <template slot="columns">
          <!-- @slot 列配置 -->
          <slot name="columns">
          </slot>
        </template>
      </yt-table>
  </el-card>
</template>

<style lang="less">
.table_container {
  margin: 10px;
}
</style>
<script>
export default {
  name: 'yt-list',
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
    /** 查询字段名 */
    searchField: {
      type: String,
      default: "name",
      required: false
    },
    /** 查询字段显示名 */
    searchLabel: {
      type: String,
      default: "关键字"
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
      default: function() {
        return [5, 10, 15, 50, 100];
      },
      required: false
    },
    /** 页面标题 */
    title: {
      type: String,
      default: "列表",
      required: false
    },
    /** 查询Api,方法 */
    searchApi: {
      type: Function,
      required: true
    },
    /** 查询参数 */
    params: {
      type: Object,
      default() {
        return {};
      },
      required: false
    },
    /** 行样式 */
    tableRowClassName: {
      type: Function,
      required: false
    }
  },
  /** 数据 */

  data() {
    return {
      formData: {
        search: ""
      }
    };
  },
  computed: {
    searchParams: function() {
      var params = Object.assign({}, this.params);
      params[this.searchField] = this.formData.search;
      return params;
    }
  },
  components: {},
  created() {},
  methods: {
    /**
     * 获取选中行，用于多选
     * @public
     * @returns {Array} 选中行数据
     */
    getSelection() {
      return this.$refs.tablePl.getSelection();
    },
    /**
     * 获取当前行，用于单选
     * @public
     * @returns {Object} 当前选中行
     */ 
    getCurrentRow() {
      return this.$refs.tablePl.getCurrentRow();
    },
    /**
     * 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
     * @public
     * @param {Object} row 行对象
     * @param {Boolean} selection 是否选中，不传则切换选中状态
     */
    toggleRowSelection (row, selection) {
      this.$refs.tablePl.toggleRowSelection(row, selection)
    },
    /**
     * 返回表格当前的数据
     * @public
     * @returns {Array} 当前表格填充数据
     */
    getTableData() {
      return this.$refs.tablePl.getTableData();
    },
    /**
     * 查询
     * @public
     * @param {Object} params 参数对象
     * @returns none
     */
    onSearch(params) {
      var tmpParams = this.searchParams;
      if (params) {
        tmpParams = Object.assign({}, this.params, params);
      } else {
        tmpParams = Object.assign({}, this.params, tmpParams);
      }
      this.$refs.tablePl.search(tmpParams);
    },
    /**
     * 取消选中
     * @public
     * @returns none
     */
    clearSelection() {
      this.$refs.tablePl.clearSelection();
    },
    /**
     * 更新一条数据
     * @public
     * @param {Object} obj 行数据，使用“id”属性标识
     * @param {String} type 操作 create/update/delete
     * @returns none
     */
    changeOneData(obj, type) {
      this.$refs.tablePl.changeOneData(obj, type);
    }
  }
};
</script>

