echarts示例
```html
new Vue({
  data(){
    return {
      /**
       * echarts 图表选项
       */
      echartsOption: {
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
  template: `
    <div v-echarts="echartsOption" style="height: 400px;width: 100%;"></div>
  `,
})

```
```js
<v-echarts/>
```