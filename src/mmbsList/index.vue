<template>
  <div class="mmbs-list">
    <yt-list :title="options.title" :params="options.query || {}" :search-api="searchApi" ref="list">
      <!--操作按鈕-->
      <template slot="buttons">
        <el-button-group>
          <el-button type="default" v-if="hasPermission('add')" @click="onCreate">添加</el-button>
          <el-button type="default" v-if="hasPermission('edit')" @click="onEdit">修改</el-button>
          <el-button type="danger" v-if="hasPermission('delete')" @click="onDel">删除</el-button>
        </el-button-group>
        <!-- @slot 自定义按钮 -->
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
          <!-- 高级过滤功能 -->
          <el-form-item>
            <el-popover placement="bottom-end" trigger="click" effect="light" ref="filter">
              <filter-plugin :columns="options.columns" @onFilter="onFilter"/>
            </el-popover>
            <el-button type="primary" icon="iconfont icon-filter" v-popover:filter>过滤</el-button>

            <!-- 统计图表 -->
            <el-popover placement="bottom-end" trigger="click" effect="light" ref="charts">
              <chart-plugin :options="options"/>
            </el-popover>
            <el-button type="primary" icon="iconfont icon-wxbbaobiao" v-popover:charts></el-button>
          </el-form-item>
        </el-form>
        <template v-else>&nbsp;</template>
      </template>
      <!-- @slot 数据列表 显示的列-->
      <template slot="columns">
        <el-table-column
                type="index"
                width="50"
                v-if="options && options.hideIndex !== false"
        >
        </el-table-column>
        <template v-for="(item, index) in (options.columns || [])">
          <!-- 上传文件列 -->
          <el-table-column
                  v-if="!item.slot && !item.hideCol && item.type === 'file' && !item.formatter"
                  :key="index"
                  :property="item.field == 'id' ? 'id' : 'attributes.' + item.field"
                  :width="item.width"
                  :label="item.title"
                  :align="item.align">
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row.attributes[item.field]" :key="index">
                <a :href="item.url" target="_blank" v-text="item.name" class="link-file"></a>
              </div>
            </template>
          </el-table-column>
          <!-- 非上传文件列 -->
          <el-table-column
                  v-else-if="!item.slot && !item.hideCol"
                  :key="index"
                  :sortable="item.sortable"
                  :property="item.field == 'id' ? 'id' : 'attributes.' + item.field"
                  :width="item.width"
                  :label="item.title"
                  :align="item.align"
                  :formatter="item.formatter || function (row, column, value) { return onFormatter(item.type, value, item) }"
          />
          <!-- @slot slot名为columns项中solt属性，一般用于复杂格式或列中嵌入组件时使用 -->
          <slot v-if="item.slot" :name="item.slot"/>
        </template>
      </template>
    </yt-list>
    <!-- dialog -->
    <yt-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" class="mmbs-form" :rules="(options && options.validRules) || {}">
        <el-row>
          <template v-for="(item, index) in (options.columns || [])">
            <el-col :span="item.formItemCols || options.formItemCols || 24" :key="index" v-if="item[action] !== false" style="min-height: 62.5px">
              <el-form-item :label="item.title" :prop="item.field" :label-width="(options && options.formLabelWidth) || '100px'">
                <!-- 字符串，text/textarea -->
                <el-input
                        v-if="!item.type || item.type === 'text' || item.type === 'textarea' || item.type ==='password'"
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
                  <el-radio
                          v-for="(oitem, index) in (item._data || [])"
                          v-model="form[item.field]"
                          :key="index"
                          :label="typeof oitem.value === 'undefined' ? oitem : oitem.value">
                    {{oitem.text || oitem}}
                  </el-radio>
                </template>
                <!-- select 下拉选择 -->
                <template v-else-if="item.type === 'select'">
                  <el-select v-model="form[item.field]" :multiple="item.multiple || false" filterable value-key="id">
                    <el-option
                            v-for="(oitem, index) in (item._data || [])"
                            :key="index"
                            :label="typeof oitem.text === 'undefined' ? oitem : oitem.text"
                            :value="typeof oitem.value === 'undefined' ? oitem : oitem.value">
                    </el-option>
                  </el-select>
                </template>
                <!-- 上传文件 -->
                <template v-else-if="item.type === 'file'">
                  <mmbs-file v-model="form[item.field]" :multiple="item.multiple !== false" :max="item.max || 99" :file-types="item.fileTypes" :list-type="item.listType || 'text'"/>
                </template>
                <template v-else-if="item.type === 'table'">
                  <table-plugin v-model="form[item.field]" :columns="item.columns"/>
                </template>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>
      <!-- @slot 表单提示信息 -->
      <slot name="formTips"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </yt-dialog>
  </div>

</template>
<style>
  /* 数字输入框左对齐 */
  form.mmbs-form .el-input-number input {
    text-align: left;
  }
  .mmbs-list a.link-file {
    color: #66b1ff;
    text-decoration: none;
  }
</style>

<script>
  import dtime from 'time-formater'
  import 'element-ui/lib/theme-chalk/index.css'
  import './../../static/css/iconFont/iconfont.css'
  import { commonApi } from '../api/index'
  import { MessageBox } from 'element-ui'
  import filterPlugin from './filter.vue'
  import mmbsFile from './../mmbsFile/index.vue'
  import chartPlugin from './chart.vue'
  import tablePlugin from './table.vue'
  import {
    Button,
    ButtonGroup,
    Form,
    Popover,
    FormItem,
    Radio,
    Select,
    Option,
    Input,
    DatePicker,
    InputNumber,
    TableColumn,
    Row,
    Col
  } from 'element-ui/lib/index'
  export default {
    name: 'mmbsList',
    components: {
      filterPlugin,
      chartPlugin,
      mmbsFile,
      tablePlugin,
      ElButton: Button,
      ElButtonGroup: ButtonGroup,
      ElForm: Form,
      ElPopover: Popover,
      ElFormItem: FormItem,
      ElInput: Input,
      ElDatePicker: DatePicker,
      ElInputNumber: InputNumber,
      ElTableColumn: TableColumn,
      ElRow: Row,
      ElCol: Col,
      ElRadio: Radio,
      ElSelect: Select,
      ElOption: Option
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
       *  addApi {Function} 自定义添加Api
       *
       *  editApi {Function} 自定义修改Api
       *
       *  deleteApi {Function} 自定义删除Api
       *
       *  columns {Array} 要显示的列
       *
       *  search {Boolean} 是否带默认查询
       *
       *  searchLabel {String} 默认查询标签
       *
       *  searchField {String} 默认查询字段名
       *
       *  query {Object} 默认查询条件
       *
       *  authorize {Boolean} 是否需要授权按钮（增add 删delete 改edit）
       *
       *  pageName {String} 页面名，即编号（authorize为true时用来做按钮权限控制）
       *
       *  validRules {Object} Form验证规则，参见ElementUI -> Form验证 -> rules
       *
       *  formLabelWidth {String} Form标签宽度
       *
       *  formItemCols {Number} Form表单栅格宽度，默认24
       *
       *  chart {Object} 统计图表默认选项，示例：
         {
            (// 分组字段)
            field: 'compony',
            (// 统计类型 count, sum, avg, max, min)
            staType: 'sum',
            (// 统计字段)
            staField: 'downloadNumber',
            (// 图表类型)
            chartType: 'bar'
          }
       *
       *  aclRead {String, Array} acl读取权限，默认：public，示例(当前用户&&指定角色)：['currentUser', {roles: ['administrator']}]
       *
       *  aclWrite {String, Array} acl写入权限（包括增加，修改，删除），默认：public （acl读写权限对默认api有效果）
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
            searchField: '',
            formLabelWidth: '120px',
            form: {},
            // acl权限配置
            aclRead: 'public',
            aclWrite: 'public'
          }
        }
      }
    },
    data () {
      return {
        formInline: { },
        form: { },
        objectId: '',
        dialogFormVisible: false,
        dialogTitle: '',
        searchField: this.options.searchField || 'keyword',
        searchLabel: this.options.searchField || '关键字',
        searchApi: (collectionName => {
          return params => commonApi.get(collectionName, params)
        })(this.options.collectionName),
        // 当前操作 add/edit
        action: ''
      }
    },
    created () {
      let columns = this.options.columns
      if (columns) {
        for (let i = 0; i < columns.length; i++) {
          let element = columns[i];
          if (element.type === 'select' || element.type === 'radio') {
            this.getOptions(element)
          }
        }
      }
    },
    methods: {
      /**
       * 获取多选，单选的选项
       */
      getOptions (column) {
        let itemOptions = column.options
        // 从数据源选择
        if (column.fromSource && column.dataSource) {
          column.dataSource.fetch().then(result => {
            // 查出数据源配置信息
            let source = result && result.attributes
            if (source && source.collectionName) {
              // 将数据列表查出来，将参数传到查询中
              commonApi.get(source.collectionName, {rows: 999, params: source.params ? JSON.parse(source.params) : {}}).then(dataList => {
                let data = []
                dataList = dataList && dataList.result && dataList.result.rows
                for (let index = 0; index < dataList.length; index++) {
                  const item = dataList[index]
                  let getValue = fieldName => {
                    if (fieldName == null || fieldName === '') {
                      return null
                    }
                    return fieldName === 'id' ? item.id : item.attributes[fieldName]
                  }
                  data.push({text: getValue(source.textField), value: source.savePointer ? item : (source.valueField ? getValue(source.valueField) : getValue(source.textField))})
                }
                Object.assign(column, {_data: data})
              })
            }
          })
        } else if (typeof itemOptions === 'object' && typeof itemOptions.length === 'number') {
          // 数组
          Object.assign(column, {_data: itemOptions})
        } else if (typeof itemOptions === 'object' && itemOptions.then) {
          // Promise
          itemOptions.then(result => {
            Object.assign(column, {_data: result})
          })
        } else if (typeof itemOptions === 'function') {
          // 从方法中获取
          let data = itemOptions(column)
          if (typeof data === 'object' && data.then) {
            data.then(result => {
              Object.assign(column, {_data: result})
            })
          } else {
            Object.assign(column, {_data: data})
          }
        }
      },
      /**
       * 判断是否有按钮权限
       */
      hasPermission (name) {
        return this.options && this.options[name] &&
          (((typeof this.options.authorize) === 'undefined' || this.options.authorize === false) || (this.options.authorize === true && this.$hasPermission((this.options.pageName + '.') + name)))
      },
      /**
       * @public
       *
       * 刷新
       */
      onSearch () {
        this.$refs.list.onSearch(this.formInline)
      },
      /* 创建 */
      onCreate () {
        this.action = 'edit'
        this.objectId = ''
        this.form = { }
        this.initEditForm({attributes: {}})
        this.dialogFormVisible = true
        this.dialogTitle = '添加'
      },
      fmtDateTime (date, format) {
        if (date) {
          return dtime(date).format(format || 'YYYY-MM-DD HH:mm:ss')
        }
        return null;
      },
      // 列表格式化
      onFormatter (type, value, colItem) {
        if (type === 'date' || type === 'datetime') {
          return this.fmtDateTime(value, colItem.format)
        }
        if (type === 'table') {
          return ((value && value.length) || '0') + '项'
        }
        let textField = colItem.fromSource && colItem.dataSource && colItem.dataSource.attributes.textField
        if (typeof value === 'object' && colItem.fromSource && colItem.dataSource && colItem.dataSource.attributes.textField) {
          return textField === 'id' ? value.id : value.attributes[textField]
        }
        return value
      },
      // 提交表单
      onSubmit () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let api
            if (this.objectId) {
              api = (this.options.editApi && this.options.editApi(Object.assign({}, {id: this.objectId}, this.form))) || commonApi.update(this.options.collectionName, {id: this.objectId, data: this.form})
            } else {
              let userInfo = {} // this.$store.state.userInfo
              let aclOption = {aclRead: this.options.aclRead || 'public', aclWrite: this.options.aclWrite || 'public', userId: userInfo.id || userInfo.objectId}
              console.log(aclOption)
              api = (this.options.addApi && this.options.addApi(this.form)) || commonApi.save(this.options.collectionName, this.form, aclOption)
            }
            api.then(result => {
              this.onSearch()
              this.dialogFormVisible = false
            }).catch(error => {
              this.dialogFormVisible = false
              this.$message.error(error)
            })
          }
        })
      },
      initEditForm (row) {
        for (let i = 0; i < this.options.columns.length; i++) {
          let column = this.options.columns[i]
          if (column[this.action] != false && (column.type === 'date' || column.type === 'datetime')) {
            this.$set(this.form, column.field, (row.attributes[column.field]))
          } else {
            let defVal = row.attributes[column.field]
            if ((column.type === 'select' && column.multiple) || column.type === 'file' || column.type === 'table') {
              defVal = defVal || []
            }
            this.$set(this.form, column.field, defVal)
          }
        }
      },
      /**
       * 修改
       */
      onEdit () {
        let row = this.$refs.list.getCurrentRow()
        if (row) {
          this.action = 'edit'
          this.objectId = row.id
          this.initEditForm(row)
          // Object.assign(this.form, {sex: row.attributes.sex})
          this.dialogFormVisible = true
          this.dialogTitle = '修改'
        }
      },
      /**
       * 删除
       */
      onDel () {
        let row = this.$refs.list.getCurrentRow()
        if (row) {
          MessageBox.confirm(`此操作将永久删除，是否继续？`, '提示').then(() => {
            let deleteApi = (this.options.deleteApi && this.options.deleteApi({id: row.id})) || commonApi.delete(this.options.collectionName, row.id)
            deleteApi.then((result) => {
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
       */
      getCurrentRow () {
        return this.$refs.list.getCurrentRow()
      }
    }
  }
</script>
