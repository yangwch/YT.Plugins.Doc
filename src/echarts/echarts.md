echarts示例
![echarts示例](/static/img/demo.png)
```html
new Vue({
    data(){
        return {
            /**
             * 图表加载中参数。若为true，则显示加载中
             */
            isloading: true,
            /**
             * echarts 图表选项
             */
            echartsOption:  {
                title: {
                    text: '堆叠区域图'
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    data:['邮件营销','联盟广告']
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : ['周一','周二','周三','周四','周五','周六','周日']
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'邮件营销',
                        type:'bar',
                        stack: '总量',
                        areaStyle: {normal: {}},
                        data:[120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name:'直接访问',
                        type:'bar',
                        stack: '总量',
                        areaStyle: {normal: {}},
                        data:[320, 332, 301, 334, 390, 330, 320]
                    }
                ]
            }
        }
    },
    template: `
        <div v-echarts="{options: this.echartsOption, loading: isloading}" style="height: 400px;width: 100%;"></div>
    `,
    create(){
        
    },
    mounted(){
        setTimeout(()=>{
            this.isloading = false
        },5000)
    }
})

```