/*
 * echarts指令文件
 * @author yangwp
 * @date 2017-07-31
*/
import Vue from 'vue'
import echarts from 'echarts/lib/echarts'
// 引入图表
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/component/tooltip'

export default {
  deep: true,
  // 插入父节点时调用
  inserted: function (el, binding) {
    let myChart = echarts.init(el)
    let option = binding.value

    myChart.showLoading()
    myChart.setOption(option)
    myChart.hideLoading()
  },
  update: function (el, binding) {
    let myChart = echarts.getInstanceByDom(el)
    let option = binding.value
    myChart.clear()
    myChart.setOption(option)
  }
}