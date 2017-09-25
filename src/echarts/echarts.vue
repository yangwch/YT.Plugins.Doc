<template>
    <div>
        <div v-echarts="{options: this.echarts_option, loading: is_loading}" style="height: 400px;width: 100%;"></div>
    </div>
</template>
<script>
    export default {
        name: 'v-echarts',
        data(){
            return {
                /**
                 * 图表加载中参数。若为true，则显示加载中
                 */
                is_loading: true,
                /**
                 * echarts 图表选项
                 */
                echarts_option:  {
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
                        data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
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
        props: {
            /**
             * 图表加载中参数。若为true，则显示加载中
             */
            isloading: {
                type: Boolean,
                default: false
            },
            /**
             * echarts图表选项
             */
            echartsOption: {
                type: Object,
                default: {}
            }
        },
        mounted(){
            setTimeout(()=>{
                this.is_loading = false
            },5000)
        }
    }
</script>