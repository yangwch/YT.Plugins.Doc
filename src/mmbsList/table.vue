<template>
  <table class="table table-border">
    <thead>
      <th v-for="(col, colIndex) in columns" :key="colIndex">
        {{col.title}}
      </th>
      <th>操作</th>
    </thead>
    <tbody>
      <tr v-for="(row, rowIndex) in tValue" :key="rowIndex">
        <td v-for="(item, colIndex) in columns" :key="colIndex">
          <!-- <el-input v-model="tValue[rowIndex][item.field]"></el-input> -->
          <!-- 字符串，text/textarea -->
          <el-input
            v-if="!item.type || item.type === 'text' || item.type === 'textarea' || item.type ==='password'"
            :type="item.type || 'text'"
            v-model="tValue[rowIndex][item.field]"
            @change="onChange"
            clearable>
          </el-input>
          <!-- 数字 -->
          <el-input-number
            v-else-if="item.type === 'number'"
            v-model="tValue[rowIndex][item.field]"
            @change="onChange"
            :min="item.min"
            :max="item.max"
            :controls="false"
            style="width: 100%">
          </el-input-number>
          <!-- 日期 -->
          <el-date-picker
            v-else-if="item.type === 'date'"
            v-model="tValue[rowIndex][item.field]"
            @change="onChange"
            type="date"
            placeholder="选择日期"
            style="width: 100%">
          </el-date-picker>
          <el-date-picker
            v-else-if="item.type === 'datetime'"
            v-model="tValue[rowIndex][item.field]"
            @change="onChange"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
          <!-- radio -->
          <template v-else-if="item.type ==='radio'">
            <el-radio
              v-for="(oitem, index) in (item._data || [])"
              v-model="tValue[rowIndex][item.field]"
              @change="onChange"
              :key="index"
              :label="typeof oitem.value === 'undefined' ? oitem : oitem.value">
              {{oitem.text || oitem}}
            </el-radio>
          </template>
          <!-- select 下拉选择 -->
          <template v-else-if="item.type === 'select'">
            <el-select v-model="tValue[rowIndex][item.field]"
            @change="onChange" :multiple="item.multiple || false" filterable value-key="id">
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
            <mmbs-file v-model="tValue[rowIndex][item.field]"
            @input="onChange" :multiple="item.multiple !== false" :max="item.max || 99" :file-types="item.fileTypes" :list-type="item.listType || 'text'"/>
          </template>
        </td>
        <td>
          <el-button-group>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="onAddRow()"></el-button>
            <el-button type="danger" icon="el-icon-minus" size="small" @click="onRemoveRow(rowIndex)"></el-button>
          </el-button-group>
        </td>
      </tr>
      <el-button v-if="(tValue || []).length === 0" size="small" @click="onAddRow()">添加一行</el-button>
    </tbody>
  </table>
</template>
<script>
export default {
  data () {
    let tValue = (this.value && this.value.length && [].concat(this.value)) || []
    return {
      tValue: tValue
    }
  },
  props: {
    /**
     * 列对象
     */
    columns: {
      type: Array
    },
    /**
     * 值
     */
    value: Array
  },
  created () {
    this.tValue = (this.value && this.value.length && [].concat(this.value)) || []
    let columns = this.columns
    if (columns) {
      for (let i = 0; i < columns.length; i++) {
        let element = columns[i]
        if (element.type === 'select' || element.type === 'radio') {
          this.$set(columns[i], '_data', [])
          this.$getDataByColumn(columns[i])
        }
      }
    }
  },
  watch: {
    value (value) {
      this.tValue = (this.value && this.value.length && [].concat(this.value)) || []
    }
  },
  methods: {
    initEditForm (row) {
      for (let i = 0; i < this.columns.length; i++) {
        let column = this.columns[i]
        if ((column.type === 'date' || column.type === 'datetime')) {
          this.$set(row, column.field, (row[column.field]))
        } else {
          let defVal = row[column.field] || ''
          if ((column.type === 'select' && column.multiple) || column.type === 'file' || column.type === 'table') {
            defVal = defVal || []
          }
          this.$set(row, column.field, defVal)
        }
      }
      return row
    },
    /**
     * 添加行
     */
    onAddRow () {
      let newRow = this.initEditForm({})
      this.tValue.push(newRow)
      this.$emit('input', this.tValue)
    },
    /**
     * 移除行    
     */
    onRemoveRow (index) {
      this.$confirm('是否要移除这行数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tValue.splice(index, 1)
        this.$emit('input', this.tValue)
      })
    },
    // 值变化事件
    onChange () {
      this.$emit('input', this.tValue)
    }
  }
}
</script>
<style lang="less">
//** Border color for table and cell borders.
@table-border-color:#ddd;
@line-height-base: 1.428571429;
@font-size-base: 14px;
@table-cell-padding: 4px;
@line-height-computed: floor((@font-size-base * @line-height-base));
.table {
  border-spacing: 0;
  border-collapse: collapse;
  width: 100%;
  max-width: 100%;
  margin-bottom: @line-height-computed;
  // Cells
  > thead,
  > tbody,
  > tfoot {
    > tr {
      > th,
      > td {
        padding: @table-cell-padding;
        line-height: @line-height-base;
        vertical-align: top;
        border-top: 1px solid @table-border-color;
      }
    }
  }
  // Bottom align for column headings
  > thead > tr > th {
    vertical-align: bottom;
    border-bottom: 2px solid @table-border-color;
  }
  // Remove top border from thead by default
  > caption + thead,
  > colgroup + thead,
  > thead:first-child {
    > tr:first-child {
      > th,
      > td {
        border-top: 0;
      }
    }
  }
  // Account for multiple tbody instances
  > tbody + tbody {
    border-top: 2px solid @table-border-color;
  }
}
.table-bordered {
  border: 1px solid @table-border-color;
  > thead,
  > tbody,
  > tfoot {
    > tr {
      > th,
      > td {
        border: 1px solid @table-border-color;
      }
    }
  }
  > thead > tr {
    > th,
    > td {
      border-bottom-width: 2px;
    }
  }
}
</style>
