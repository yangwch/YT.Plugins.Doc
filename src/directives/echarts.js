/*
 * echarts指令
 * @author yangwp
 * @date 2017-07-31
 * @param { Boolean } loading 是否加载中，若不需要加载中效果,可以不传
 * @param { Object } options 图表参数
*/
import Vue from 'vue'
import echarts from 'echarts/lib/echarts'
// 引入图表
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/markPoint'
import 'echarts/lib/component/tooltip'

export default {
    /*
     * dom插入时，初始化echarts图表
     * @param {Object} bingding 指令绑定参数,binding.value为参数对象
    */
    inserted: function (el, binding) {
        var _this = this,
            instance = echarts.init(el);

        Vue.nextTick(function () {
            /*若loading默认传true，则不绑定数据，显示加载中*/
            if (binding.value.loading === true) {
                instance.showLoading({text: '加载中。。。'});
            }else if(binding.value.options){
                instance.setOption(binding.value.options)
            }

        });
    },
    update: function (el, binding,vNode) {
        var _this = this,
            instance = echarts.init(el);
        if(binding.value && !binding.value.loading){
            instance.hideLoading()
            instance.setOption(binding.value.options)
        }
    }
};