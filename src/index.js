/*import * as ElementUI from "./element-ui/lib/index"*/
import Component from './yt-component/yt-component.vue'
import ytTreeGrid from './treegrid/treegrid.vue'
import ytPdf from './pdf/pdf.vue'
import ytList from './listTemp/list.vue'
import ytMap from './map/ytMap.vue'
import ytCombotree from './combotree/index.vue'
import ytDialog from './dialog/dialog.vue'
/*指令*/
import echarts from './directives/echarts'
import dtime from 'time-formater'

/*
import 'element-ui/lib/theme-default/index.css'
*/
var comps = {
    'yt-component': Component,
    'yt-tree-grid': ytTreeGrid,
    'yt-pdf': ytPdf,
    'yt-list': ytList,
    'yt-map': ytMap,
    'yt-combotree': ytCombotree,
    'yt-dialog': ytDialog
};

export default {
  install: function (Vue){
      Vue.directive('echarts', echarts);

      for(var key in comps){
          Vue.component(key, comps[key]);
      }

      Vue.prototype.$fmtDateTime = (date, format) => {
        if (date) {
          return dtime(date).format(format || 'YYYY-MM-DD HH:mm:ss')
        }
        return null;
      }
  },
    version: process.env.VERSION
}
