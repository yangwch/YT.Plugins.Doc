/*import * as ElementUI from "./element-ui/lib/index"*/
import Component from './yt-component/yt-component.vue'
import ytTreeGrid from './treegrid/treegrid.vue'

import 'element-ui/lib/theme-default/index.css'
var comps = {
    'yt-component': Component,
    'yt-tree-grid': ytTreeGrid
};

console.log(ElementUI);
export default {
  install: function (Vue){

      for(var key in comps){
          Vue.component(key, comps[key]);
      }
  },
    version: process.env.VERSION
}
