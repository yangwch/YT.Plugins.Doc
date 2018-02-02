<template>
  <div>
    <table class="table">
      <tr>
        <td>
          <!-- 分组字段 -->
          <el-select v-model="field" @change="onFieldChange" placeholder="分组字段">
            <el-option
              v-for="(item, index) in columns"
              :key="index"
              :label="item.title"
              :value="item.field || ''">
            </el-option>
          </el-select>
        </td>
        <td>
          <el-select v-model="staType" @change="onStaTypeChange" placeholder="统计类型" style="width:110px">
            <el-option label="统计数量" value="count"></el-option>
            <el-option label="求合" value="sum"></el-option>
            <el-option label="求平均" value="avg"></el-option>
            <el-option label="最大值" value="min"></el-option>
            <el-option label="最小值" value="max"></el-option>
          </el-select>
        </td>
        <td>
          <el-select :disabled="staType === 'count'" v-model="staField" placeholder="统计字段">
            <template
              v-for="(item, index) in columns">
              <el-option
                v-if="['number'].indexOf(item.type) >= 0"
                :key="index"
                :label="item.title"
                :value="item.field || ''">
              </el-option>
            </template>
          </el-select>
        </td>
        <td>
          <el-select v-model="chartType" placeholder="图表类型" style="width: 100px">
            <el-option label="柱状图" value="bar"></el-option>
            <el-option label="趋势图" value="line"></el-option>
            <el-option label="饼图" value="pie"></el-option>
          </el-select>
        </td>
        <td>
          <el-button type="primary" @click="getChart">生成<i class="el-icon-upload el-icon--right"></i></el-button>
        </td>
      </tr>
    </table>
    <div v-if="showChart" class="chart" v-echarts="chartOption">
    </div>
  </div>
</template>
<style scoped>
.chart {
  height: 300px;
}
</style>

<script>
import {commonApi} from './../api/index'
import {
  Button,
  Select,
  Option
} from 'element-ui/lib/index'
import echarts from './../directives/echarts'
import dtime from 'time-formater'

export default {
  components: {
    ElButton: Button,
    ElSelect: Select,
    ElOption: Option
  },
  directives: {
    echarts
  },
  props: {
    /**
     * 列数据
     */
    options: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      columns: (this.options && this.options.columns) || [],
      collectionName: this.options.collectionName,
      // 分组字段
      field: null,
      // 统计类型
      staType: null,
      // 统计字段
      staField: null,
      // 图表类型
      chartType: 'bar',
      showChart: false,
      chartOption: { }
    }
  },
  methods: {
    onFieldChange (row) { },
    onStaTypeChange () { },
    fmtDateTime (date, format) {
      if (date) {
        return dtime(date).format(format || 'YYYY-MM-DD HH:mm:ss')
      }
      return null;
    },
    // 获取数据并显示图表
    getChart () {
      let fieldName = this.field
      let staType = this.staType
      let staField = this.staField
      let chartType = this.chartType
      if (fieldName && staType) {
        let pipeline
        let tjName = ''
        let tjField = this.columns.find(column => {
          return column.field === fieldName
        })
        if (staType === 'count') {
          pipeline = {
            group: { objectId: '$' + fieldName, count: { $sum: 1 } }
          }
          tjName = 'count'
        } else {
          pipeline = {
            group: { objectId: '$' + fieldName, count: { $sum: 1 } }
          }
          let staResult = {}
          staResult['$' + staType] = '$' + staField
          pipeline.group.staResult = staResult
          tjName = 'staResult'
        }
        commonApi.agg(this.collectionName, {}, pipeline).then(results => {
          let legendData = []
          let seriesData = []
          if (results && results.length) {
            results.map(item => {
              let legend = item.objectId
              if (tjField && (tjField.type === 'date' || tjField.type === 'datetime') && legend) {
                legend = (tjField.format && this.fmtDateTime(new Date(legend), tjField.format)) || (new Date(legend).toLocaleString())
              }
              legendData.push(legend)
              seriesData.push(item[tjName])
            })
            
            this.showChart = true
          } else {
            this.showChart = false
          }
          if (chartType !== 'pie') {
            this.chartOption = {
              xAxis: {
                type: 'category',
                data: legendData
              },
              yAxis: {
                type: 'value'
              },
              series: [{
                data: seriesData,
                type: chartType
              }]
            }
          } else if (chartType === 'pie') {
            let pieData = []
            legendData.forEach((item, index) => {
              pieData.push({
                name: item,
                value: seriesData[index]
              })
            })
            this.chartOption = {
              tooltip: {
                trigger: 'item',
                formatter: "{b} : {c} ({d}%)"
              },
              legend: {
                type: 'scroll',
                orient: 'vertical',
                right: 10,
                top: 20,
                bottom: 20,
                data: legendData
              },
              series: [
                {
                  type: 'pie',
                  radius: '55%',
                  center: ['40%', '50%'],
                  data: pieData,
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }
              ]
            }
          }
        })
      }
      setTimeout(() => {
        
      }, 2000)
    }
  }
}
</script>

