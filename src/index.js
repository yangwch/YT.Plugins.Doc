/*import * as ElementUI from "./element-ui/lib/index"*/
import Component from './yt-component/yt-component.vue'
import ytTreeGrid from './treegrid/treegrid.vue'
import ytPdf from './pdf/pdf.vue'
import ytList from './listTemp/list.vue'
import ytMap from './map/ytMap.vue'
/*指令*/
import echarts from './directives/echarts'

/*
import 'element-ui/lib/theme-default/index.css'
*/
var comps = {
    'yt-component': Component,
    'yt-tree-grid': ytTreeGrid,
    'yt-pdf': ytPdf,
    'yt-list': ytList,
    'yt-map': ytMap
};

export default {
  install: function (Vue){
        debugger
      Vue.directive('echarts', echarts);

      for(var key in comps){
          Vue.component(key, comps[key]);
      }
  },
    version: process.env.VERSION
}
