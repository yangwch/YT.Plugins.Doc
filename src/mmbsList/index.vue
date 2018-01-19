<template>
  <div>
    <yt-list :title="options.title" :params="options.query || {}" :search-api="searchApi" ref="list">
      <!--操作按鈕-->
      <template slot="buttons">
        <el-button-group>
        <el-button type="default" @click="onCreate" v-if="options && options.add == true">添加</el-button>
        <el-button type="default" @click="onEdit" v-if="options && options.edit == true">修改</el-button>
        <el-button type="danger" @click="onDel" v-if="options && options.delete == true">删除</el-button>
        </el-button-group>
        <slot name="buttons"></slot>
      </template>
      <!-- 默认查询 -->
      <template slot="search">
        <el-form :inline="true" :model="formInline" class="form-inline right" v-if="options.search != false">
          <!-- 若有默认查询字段名，则显示默认条件 -->
          <template v-if="options.searchField">
            <el-form-item>
              <el-input v-model="formInline[options.searchField]" :placeholder="options.searchLabel || ''" @keyup.enter.native="() => { return false }"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearch" icon="el-icon-search">查询</el-button>
            </el-form-item>
          </template>
          <el-form-item>
            <el-popover placement="bottom-end" trigger="click" effect="light" ref="filter">
              <filter-plugin :columns="options.columns" @onFilter="onFilter"/>
            </el-popover>
            <el-button type="primary" icon="iconfont icon-filter" v-popover:filter>过滤</el-button>
          </el-form-item>
        </el-form>
      </template>
      <!--数据列表 显示的列-->
      <template slot="columns">
        <el-table-column
         type="index"
         width="50">
        </el-table-column>
        <el-table-column
          v-for="(item, index) in (options.columns || [])"
          :key="index"
          :property="item.field == 'id' ? 'id' : 'attributes.' + item.field"
          :width="item.width"
          :label="item.title"
          :align="item.align"
          :formatter="item.formatter || function (row, column, value) { return onFormatter(item.type, value, item) }"
        />
      </template>
    </yt-list>
    <!-- dialog -->
    <yt-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form" class="mmbs-form">
        <template v-for="(item, index) in (options.columns || [])">
          <el-form-item v-if="item.edit !== false" :label="item.title" :label-width="formLabelWidth" :key="index">
            <!-- 字符串，text/textarea -->
            <el-input
              v-if="!item.type || item.type === 'text' || item.type === 'textarea'"
              :type="item.type || 'text'"
              v-model="form[item.field]"
              clearable>
            </el-input>
            <!-- 数字 -->
            <el-input-number
              v-else-if="item.type === 'number'"
              v-model="form[item.field]"
              :min="item.min"
              :max="item.max"
              :controls="false"
              style="width: 100%">
            </el-input-number>
            <!-- 日期 -->
            <el-date-picker
              v-else-if="item.type === 'date'"
              v-model="form[item.field]"
              type="date"
              placeholder="选择日期"
              style="width: 100%">
            </el-date-picker>
            <el-date-picker
              v-else-if="item.type === 'datetime'"
              v-model="form[item.field]"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
            <!-- radio -->
            <template v-else-if="item.type ==='radio'">
              <el-radio v-model="form[item.field]" v-for="(item, index) in item.options" :key="index" :label="item.value">{{item.text}}</el-radio>
            </template>
          </el-form-item>

        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </yt-dialog>
  </div>
  
</template>
<style>
form.mmbs-form .el-input-number input {
  text-align: left;
}
.right, .text-right {
  float: right;
}
</style>

<script>
  import { commonApi } from './../api/index'
  import filterPlugin from './filter.vue'
  import * as ElementUI from 'element-ui/lib/index'
  export default {
    name: 'mmbsList',
    components: {
      filterPlugin,
      ElButton: ElementUI.Button,
      ElButtonGroup: ElementUI.ButtonGroup,
      ElForm: ElementUI.Form,
      ElPopover: ElementUI.Popover,
      ElFormItem: ElementUI.FormItem,
      ElInput: ElementUI.Input,
      ElDatePicker: ElementUI.DatePicker,
      ElInputNumber: ElementUI.InputNumber,
      ElTableColumn: ElementUI.TableColumn
    },
    props: {
      /**
       * 配置选项
       * @description
       *  title {String} 标题
       * 
       *  collectionName {String} 集合名称
       * 
       *  add {Boolean} 是否有添加功能
       * 
       *  edit {Boolean} 是否有修改功能
       * 
       *  delete {Boolean} 是否有删除功能
       * 
       *  columns {Array} 要显示的列
       * 
       *  search {Boolean} 是否带默认查询
       * 
       *  searchLabel {String} 默认查询标签
       * 
       *  searchField {String} 默认查询字段名
       */
      options: {
        type: Object,
        default () {
          return {
            // 标题
            title: '表格',
            // 表名
            collectionName: 'GameList',
            // 添加功能
            add: true,
            // 修改功能
            edit: true,
            // 删除功能
            delete: true,
            // 显示列
            columns: [],
            // 是否查询，若为false则不显示查询
            search: true,
            searchLabel: '',
            searchField: ''
          }
        }
      }
    },
    data () {
      return {
        formLabelWidth: '120px',
        formInline: { },
        form: { },
        objectId: '',
        dialogFormVisible: false,
        dialogTitle: '',
        searchField: this.options.searchField || 'keyword',
        searchLabel: this.options.searchField || '关键字',
        searchApi: (collectionName => {
          return params => commonApi.get(collectionName, params)
        })(this.options.collectionName)
      }
    },
    methods: {
      /** 刷新 */
      onSearch () {
        this.$refs.list.onSearch(this.formInline)
      },
      /* 创建 */
      onCreate () {
        this.objectId = ''
        this.form = { }
        this.dialogFormVisible = true
        this.dialogTitle = '编辑'
      },
      // 列表格式化
      onFormatter (type, value, colItem) {
        if (type === 'date' || type === 'datetime') {
          return (this.$fmtDateTime && this.$fmtDateTime(value, colItem.format)) || value
        }
        return value
      },
      // 提交表单
      onSubmit () {
        let api;
        if (this.objectId) {
          api = commonApi.update(this.options.collectionName, {id: this.objectId, data: this.form})
        } else {
          api = commonApi.save(this.options.collectionName, this.form)
        }
        api.then(result => {
          this.onSearch()
          this.dialogFormVisible = false
        }).catch(error => {
          this.dialogFormVisible = false
          this.$message.error(error)
        })
      },
      initEditForm (row) {
        for (let i = 0; i < this.options.columns.length; i++) {
          let column = this.options.columns[i]
          if (column.edit != false && (column.type === 'date' || column.type === 'datetime')) {
            this.form[column.field] = new Date(row.attributes[column.field]) // this.onFormatter(column.type, row.attributes[column.field], column)
          } else {
            this.form[column.field] = row.attributes[column.field]
          }
          //  this.form[column.field] = row.attributes[column.field]
        }
      },
      /**
       * 修改
       */
      onEdit () {
        let row = this.$refs.list.getCurrentRow()
        if (row) {
          this.objectId = row.id
          this.initEditForm(row)
          this.dialogFormVisible = true
          this.dialogTitle = '编辑'
        }
      },
      /**
       * 删除
       */
      onDel () {
        let row = this.$refs.list.getCurrentRow()
        if (row) {
          this.$confirm(`此操作将永久删除，是否继续？`, '提示').then(() => {
            commonApi.delete(this.options.collectionName, row.id).then((result) => {
              console.log(result)
              this.onSearch()
            }).catch(ex => {
              this.$message.error(ex)
            })
          }).catch(ex => {})
        }
      },
      /**
       * 高级查询
       */
      onFilter (params) {
        this.$refs.list.onSearch(params)
      },
      /**
       * @public
       * 获取当前选中行
       * @returns 当前选中行
       */
      getCurrentRow () {
        return this.$refs.list.getCurrentRow()
      }
    }
  }
</script>