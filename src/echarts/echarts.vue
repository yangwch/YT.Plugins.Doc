<template>
	<div>
  	<div v-echarts="echarts_option" style = "height: 400px;width: 100%;"></div>
  </div>
</template>
<script >
  import echarts from './../directives/echarts'
	export default {
		name: 'v-echarts',
    directives: {
      echarts
    },
		data() {
			return {
				/**
				 * echarts 图表选项
				 */
				echarts_option: {
          title: {
            text: '基本趋势图'
          },
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line'
          }]
        }
			}
		},
		props: {
			/**
			 * echarts图表选项
			 */
			echartsOption: {
				type: Object,
				default: () => {
          return {}
        }
			}
		},
		mounted() {
			
		}
	}
</script>