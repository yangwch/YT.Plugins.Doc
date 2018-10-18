<!-- 
 *  树表格组件
 *  @author yangwp
 *  @date 2017-07-21
 *  @events on-row-click 单击行或者单击操作按钮方法
 *  @events on-selection-change  多选模式下 选中项变化时触发
 *  @events on-sort-change  排序时有效，当点击排序时触发
 *  @props  items 显示的结构化数据
      columns 表格列的配置描述 sortable:true 开启排序功能 
      type: 'selection'为多选功能 type: 'action' 为操作功能 actions:[{}] 操作按钮
 *  @methods getChecked 获取选中的id，
       getSelected
-->
<template>
  <div :style="{width:tableWidth}" class='autoTbale'>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th v-for="(column, index) in cloneColumns" :style="tdStyle(column.width, column.type === 'selection' ? 'center' : column.align)" :key="index">
            <el-checkbox v-model="checks" @click.prevent.native="handleCheckAll" v-if="column.type === 'selection'"></el-checkbox>
            <label v-else>
              {{ renderHeader(column, index) }}
            </label>
          </th>
        </tr>
      </thead>
      <transition-group tag="tbody" name="bounce">
        <tr v-for="(item, index) in initItems" :key="index" v-show="show(item) && reload" :class="{'child-tr':item.parent, 'selected': item._selected}" @click="RowClick(item, index)">
          <td v-for="(column, snum) in columns" :style="tdStyle(column.width, column.align)" :key="snum">
            <el-checkbox-group v-model="checkGroup" @on-change="checkAllGroupChange" v-if="column.type === 'selection'">
              <el-checkbox :label="item.id"><span style="display:none;">&nbsp;</span></el-checkbox>
            </el-checkbox-group>
            <div v-if="column.type === 'action'">
              <el-button :type="action.type" size="small" @click="RowActionClick(item,$event,index)" v-for='(action, colindex) in (column.actions)' :key='colindex'>{{action.text}}</el-button>
            </div>
            <label v-if="!column.type">
              <span v-if='column.treeField'>
                <i v-html='item.spaceHtml'></i>
                <i @click.stop="toggle(index,item)" v-if="item.children && item.children.length > 0" :class="{'el-icon-caret-right':!item.expanded,'el-icon-caret-bottom':item.expanded }"></i>
                <i v-else class="ms-tree-space"></i>
              </span>
              <span v-html="renderBody(item,column)"></span>
            </label>
          </td>
        </tr>
      </transition-group>
    </table>
  </div>
</template>
<style lang="less" scoped>
/* 行显示动画 */
.bounce-enter-active {
  animation: bounce-in .2s;
}
.bounce-leave-active {
  animation: bounce-in .2s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(1, 0);
  }
  50% {
    transform: scale(1, 0.8);
    transform-origin: top;
  }
  100% {
    transform: scale(1);
  }
}
/* table 样式 */
.autoTbale {
  overflow: auto;
  color: #606266;
  tbody .el-checkbox-group {
    text-align: center;
  }
  table {
    width: 100%;
    border-spacing: 0;
    border-collapse: collapse;
  }

  .table-bordered {
    border: 1px solid #ebeef5;
  }

  .table tbody tr td,
  .table tbody tr th,
  .table thead tr td,
  .table thead tr th {
    border-top: 1px solid #ebeef5;
    line-height: 1.42857;
    padding: 6px;
    vertical-align: middle;
  }
  .table > tbody > tr.selected {
    background: #d6e0e8
  }

  .table-bordered tbody tr td,
  .table-bordered tbody tr th,
  .table-bordered tfoot tr td,
  .table-bordered tfoot tr th,
  .table-bordered thead tr td,
  .table-bordered thead tr th {
    border: 1px solid #ebeef5;
    font-size: 14px;
  }

  .table thead tr th {
    border-bottom: 1px solid #ebeef5;
  }

  .table-bordered thead tr td,
  .table-bordered thead tr th {
    background-color: #fff;
    color: #909399;
    line-height: 24px;
    padding: 6px;
    font-weight: 500;
  }

  label {
    margin: 0 8px;
  }

  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 14px;
    height: 14px;
  }
  i.el-icon-caret-bottom:hover, i.el-icon-caret-right:hover {
    color: red;
    opacity: .8;
  }
  .ms-tree-space::before {
    content: "";
  }
}
</style>
<script>
  import * as ElementUI from './../../node_modules/element-ui/lib/index'

  export default {
    name: 'yt-tree-grid',
    components:{
      ElCheckbox: ElementUI.Checkbox,
      ElCheckboxGroup: ElementUI.CheckboxGroup
    },
    props: {
      /**
       * 要显示的列
       * （type: 'selection' 会变为多选列）
      */
      columns: Array,
      /**
       *  数据列表
       */
      items: Array,
      /**
       * 是否默认展开
       * */
      expanded: Boolean,
      /**
       * 过滤节点数据方法
       * 参数：(value, data)
       */
      filterNodeMethod: Function
    },
    data() {
      return {
        checked: true,
        reload: true,
        initItems: [], //处理后数据数组
        cloneColumns: [], //处理后的表头数据
        checkGroup: [], //复选框数组
        checks: false, //全选
        screenWidth: document.body.clientWidth, //自适应宽
        tdsWidth: 0, //td总宽
        timer: false, //控制监听时长

        selectedRow: null
      }
    },
    computed: {
      tableWidth() {
        return this.tdsWidth > this.screenWidth && this.screenWidth > 0 ? this.screenWidth + 'px' : '100%'
      }
    },
    watch: {
      screenWidth(val) {
        if (!this.timer) {
          this.screenWidth = val
          this.timer = true
          setTimeout(() => {
            this.timer = false
          }, 400)
        }
      },
      items() {
        if (this.items) {
          this.checks = false;
          this.initItems = [];
          this.initData(this.items, 1, null);
        }
      },
      columns: {
        handler() {
          this.cloneColumns = this.makeColumns();
        },
        deep: true
      },
    },
    mounted() {
      if (this.items) {
        this.initData(this.items, 1, null);
        this.cloneColumns = this.makeColumns();
      }
      // 绑定onresize事件 监听屏幕变化设置宽
      this.$nextTick(() => {
        this.screenWidth = document.body.clientWidth
      })
      window.onresize = () => {
        return (() => {
          window.screenWidth = document.body.clientWidth
          this.screenWidth = window.screenWidth
        })()
      }
    },
    methods: {
      //  设置td宽度
      tdStyle(width, align) {
        if (width || align) {
          let widthVal = typeof width === 'string' ? width : width + 'px'
          return {
            'width': widthVal,
            'min-width': widthVal,
            'text-align': align || 'left'
          };
        }
      },
      //  排序事件
      handleSort(index, type) {
        this.cloneColumns.forEach(col => (col._sortType = "normal"));
        if (this.cloneColumns[index]._sortType === type) {
          this.cloneColumns[index]._sortType = "normal";
        } else {
          this.cloneColumns[index]._sortType = type;
        }
        this.$emit(
          "on-sort-change",
          this.cloneColumns[index]["key"],
          this.cloneColumns[index]["_sortType"]
        );
      },
      //  点击某操作按钮事件
      RowActionClick(data, event, index) {
        this.$emit("on-row-click", data, event, index)
      },
      /* 行点击 */
      RowClick(data, index) {
        this.reload = false
        if (this.selectedRow && this.selectedRow.id === data.id) {
          data._selected = false
          this.selectedRow = null
          this.reload = true
          return
        }
        if (this.selectedRow) {
          this.selectedRow._selected = false
        }
        this.selectedRow = data
        data._selected = true
        this.reload = true
      },
      //  处理表头数据
      makeColumns() {
        let columns = this.deepCopy(this.columns);
        this.tdsWidth = 0;
        columns.forEach((column, index) => {
          column._index = index;
          column._width = column.width ? column.width : "";
          column._sortType = "normal";
          this.tdsWidth += column.width ? parseFloat(column.width) : 0;
        });
        return columns;
      },
      /* 获取空格 */
      getSpaceHtml(level) {
        let spaceHtml = "";
        for (var i = 1; i < level; i++) {
          spaceHtml +=
            "<i class='ms-tree-space' style='display:inline-block;width:14px;line-height:1;height:14px;'></i>";
        }
        return spaceHtml;
      },
      //  数据处理 增加自定义属性监听
      initData(items, level, parent) {
        // this.initItems = []
        /* 添加空格 */
        let spaceHtml = this.getSpaceHtml(level);

        items.forEach((item, index) => {
          item = Object.assign({}, item, {
            parent: parent,
            level: level,
            spaceHtml: spaceHtml,
            isShow: true
          });
          if (typeof item.expanded == "undefined") {
            item = Object.assign({}, item, {
              expanded: this.expanded
            });
          }
          /* 是否显示 */
          if (
            typeof item.isShow == "undefined" ||
            (parent && parent.expanded == false)
          ) {
            item = Object.assign({}, item, {
              isShow: this.expanded
            });
          } else if (parent && parent.expanded) {
            item = Object.assign({}, item, {
              isShow: true
            });
          }

          this.initItems.push(item);
          if (item.children) {
            this.initData(item.children, level + 1, item);
          }
        });
      },
      //   隐藏显示
      show(item) {
        return ((typeof item._filter === 'boolean' && item._filter) || typeof item._filter === 'undefined') && ((item.level == 1 && item.isShow) || (item.parent && item.isShow));
      },
      toggle(index, item) {
        let level = item.level + 1;
        let spaceHtml = this.getSpaceHtml(level);
        if (item.children) {
          if (item.expanded) {
            this.close(index, item);
          } else {
            this.open(index, item);
          }
          item.expanded = !item.expanded;
        }
      },
      /*
       * 展开
       * @param {Number} index 索引号，无实际意义
       * @param {Object} item 节点
       * @param {Boolean} setShow 是否主动修改子节点的isShow为true，默认修改
       */
      open(index, item, setShowTrue = true) {
        if (item.children) {
          this.reload = false;
          let self = this;
          this.initItems.forEach(function(firstLelItem, fIndex) {
            item.children.forEach((child, childIndex) => {
              if (firstLelItem.id == child.id) {
                if (setShowTrue) {
                  firstLelItem.isShow = true;
                }
                if (firstLelItem.expanded) {
                  self.open(fIndex, child);
                }
              }
            });
          });
          this.reload = true;
        }
      },
      /* 关闭 */
      close(index, item, setShowFalse = true) {
        if (item.children) {
          this.reload = false;
          let self = this;
          this.initItems.forEach(function(firstLelItem, fIndex) {
            item.children.forEach((child, childIndex) => {
              if (firstLelItem.id == child.id) {
                /* 隐藏，收起 */
                // firstLelItem.expanded = false
                firstLelItem.isShow = false;
                if (child.children && child.children.length) {
                  self.close(fIndex, child);
                }
                return true;
              }
              return false;
            });
          });

          this.reload = true;
        }
      },
      /**
       * checkbox 全选 选择事件
       */
      handleCheckAll() {
        this.checks = !this.checks;
        if (this.checks) {
          this.checkGroup = this.checkGroup.concat(this.All(this.items));
        } else {
          this.checkGroup = [];
        }
        this.$emit("on-selection-change", this.checkGroup);
      },
      /**
       * 单个选择
       *
       * @private
       * @param {Object} data
       * @fires Hurl#on-selection-change
       * @returns none
       */
      checkAllGroupChange(data) {
        if (data.length === this.items.length) {
          this.checks = true;
        } else {
          this.checks = false;
        }
        /**
         * 选择改变事件
         *
         * @event Hurl#on-selection-change
         * @type {object}
         * @property {Object} checkGroup - 选中的数据
         */
        this.$emit("on-selection-change", this.checkGroup);
      },
      /**
       *  多选，获取选中记录
       *
       * @public
       * @version 1.0.0
       * @param  none
       * @returns {Array} CheckGroup
       */
      getChecked() {
        return this.checkGroup;
      },
      /**
       * 单选，获取选中
       *
       * @public
       * @param none
       * @returns {Object} selectedRow
       */
      getSelected() {
        return this.deepCopy(this.selectedRow);
      },
      All(data) {
        let arr = [];
        data.forEach(item => {
          arr.push(item.id);
          if (item.children && item.children.length > 0) {
            arr = arr.concat(this.All(item.children));
          }
        });
        return arr;
      },
      //  返回表头
      renderHeader(column, $index) {
        if ("renderHeader" in this.columns[$index]) {
          return this.columns[$index].renderHeader(column, $index);
        } else {
          return column.title || "#";
        }
      },
      //  返回内容
      renderBody (row, column, index) {
        if (typeof column.formatter == "function") {
          return column.formatter(row[column.key], row, index);
        }
        return row[column.key];
      },
      deepCopy (data) {
        var t = this.type(data),
          o,
          i,
          ni;
        if (t === "array") {
          o = [];
        } else if (t === "object") {
          o = {};
        } else {
          return data;
        }
        if (t === "array") {
          for (i = 0, ni = data.length; i < ni; i++) {
            o.push(this.deepCopy(data[i]));
          }
          return o;
        } else if (t === "object") {
          for (i in data) {
            o[i] = this.deepCopy(data[i]);
          }
          return o;
        }
      },
      type(obj) {
        var toString = Object.prototype.toString;
        var map = {
          "[object Boolean]": "boolean",
          "[object Number]": "number",
          "[object String]": "string",
          "[object Function]": "function",
          "[object Array]": "array",
          "[object Date]": "date",
          "[object RegExp]": "regExp",
          "[object Undefined]": "undefined",
          "[object Null]": "null",
          "[object Object]": "object"
        };
        return map[toString.call(obj)];
      },
      /**
       * 设置选中id，触发事件 'on-selection-change'
       *
       * @public
       * @param {Array} chkIds - 选中的id
       * @param {Array} isCheck - 是否选中
       * @returns none
       * */
      setChecked (chkIds, isCheck) {
        if (typeof chkIds == "string" || typeof chkIds == "number") {
          chkIds = [chkIds];
        }

        if (isCheck == null || isCheck == true) {
          this.checkGroup = this.checkGroup.concat(chkIds);
        } else {
          for (let k in chkIds) {
            let id = chkIds[k];
            let index = this.checkGroup.findIndex(item => {
              return item == id;
            });
            if (index >= 0) {
              this.checkGroup.splice(index, 1);
            }
          }
        }
        this.$emit("on-selection-change", this.checkGroup);
      },
      /**
       * 清除选择项
       *
       * @public
       * @version 1.0.0
       * */
      clearSelection () {
        this.checkGroup = [];
        this.checks = false;
      },
      /**
       * 更新行数据
       * @public
       * @param {Object} row - 行数据，根据id来更新行
       */
      updateRow (row) {
        let data = this.initItems.find(item => {
          return item.id === row.id
        })
        let rowData = {}
        let props = Object.getOwnPropertyNames(row)
        props.map(p => {
          if (['id', 'createdAt', 'updatedAt'].indexOf(p) === -1) {
            rowData[p] = row[p]
          }
        })
        Object.assign(data, rowData)
      },
      /**
       * 追加行
       * @public
       * @param {Object} row 行数据对象
       * @param {Object|String} parent 父节点或者父节点ID
       */
      appendRow (row, parent) {
        let parentNode = parent
        // 若传的是字符串，匹配ID
        if (typeof parent !== 'undefined' && parent != null) {
          parentNode = this.initItems.find(item => {
            return item.id === (typeof parent === 'string' ? parent : parent.id)
          })
        }
        row = Object.assign({}, row, {isShow: (parentNode && parentNode.expanded) || true})
        if (parentNode && !parentNode.children) {
          this.$set(parentNode, 'children', [row])
        } else if (parentNode && parentNode.children && typeof parentNode.children === 'object') {
          parentNode.children.push(row)
        }
        this.initData([row], (parentNode && parentNode.level + 1) || 1, parentNode)
      },
      /**
       * 移除行
       * @public
       * @param {Object|String} 行数据或行ID 
       */
      removeRow (row) {
        let rowIndex = this.initItems.findIndex(item => {
          return item.id === (typeof row === 'string' ? row : row.id)
        })
        if (rowIndex >= 0) {
          let rowData = this.initItems[rowIndex]
          if (this.selectedRow === rowData) {
            this.selectedRow = null
          }
          if (rowData.parent) {
            let fIndex = rowData.parent.children.findIndex(item => {
              return item.id === rowData.id
            })
            if (fIndex >= 0) {
              rowData.parent.children.splice(fIndex, 1)
            }
          }
          this.initItems.splice(rowIndex, 1)
        }
      },
      /**
       * 获取数据
       */
      getData () {
        return this.initItems
      },
      /**
       * @public
       * 过滤节点
       * @param {String} value 过滤字符串
       */
      filter (value = '') {
        let filterNodeMethod = this.filterNodeMethod
        if (!filterNodeMethod) { throw new Error('filterNodeMethod is required') }
        
        let toggleNode = (node, show) => {
          let item = this.initItems.find(initItem => {
            return initItem.id === node.id
          })
          if (show) {
            Object.assign(item, {isShow: true, '_filter': true, expanded: true})
            this.open(1, item, false)
          } else {
            this.close(2, item)
            Object.assign(item, {isShow: false, '_filter': false, expanded: false})
          }
        }
        let traverse = (node) => {
          let childNodes = node.children
          if (childNodes && childNodes.length) {
            let exist = filterNodeMethod(value, node)
            childNodes.forEach((child, index) => {
              let isFind = traverse(child)
              toggleNode(child, isFind)
              if (isFind) { exist = true }
            })
            toggleNode(node, exist)
          } else {
            let flag = filterNodeMethod(value, node)
            toggleNode(node, flag)
            return flag
          }
        }
        this.items.forEach(item => {
          traverse(item)
        })
      }
    }
  }
</script>
