使用树形格式渲染一个列表树
```js
new Vue({
  template: `
  <div>
    <input type="button" value="选中行1" @click="checkRows"/>
    <input type="button" value="清空选项" @click="clearSel"/>
    <yt-tree-grid :items='[{id: 1,displayName:"一级",url:"l1.do",children:[{id:2,displayName:"二级",url:"l2.do"}]}]'
       :columns='[{title: "选择",type:"selection",width: 20},{title: "菜单名称",key: "displayName",treeField: true,width: 250},{title: "URL",key: "url",width: 250}]'
       ref="treeGrid"></yt-tree-grid>
  </div>`,
  methods: {
    checkRows() {
      this.$refs.treeGrid.setChecked([1, 2], true);
      let chks = this.$refs.treeGrid.getChecked();
      console.log(chks);
    },
    clearSel(){
      this.$refs.treeGrid.clearSelection();
    }
  }
})
```

带过滤功能
```js
new Vue({
  template: `
  <div>
    <input type="text" v-model="keyword" placeholder="输入关键字">
    <yt-tree-grid :filter-node-method="filterNodeMethod" expanded :items='[{id: 1,displayName:"一级1",url:"l1.do",children:[{id:2,displayName:"二级1-1",url:"l2.do"}] }, {id: 3,displayName:"一级2",url:"l1.do",children:[{id:4,displayName:"二级2-1",url:"l2.do"}, {id:5,displayName:"二级2-2",url:"http://cn.bing.com"}]}]'
       :columns='[{title: "菜单名称",key: "displayName",treeField: true,width: 250},{title: "URL",key: "url",width: 250}]'
       ref="treeGrid"></yt-tree-grid>
  </div>`,
  data () {
    return {keyword: ''}
  },
  watch: {
    keyword (value) {
      this.$refs.treeGrid.filter(value)
    }
  },
  methods: {
    checkRows() {
      this.$refs.treeGrid.setChecked([1, 2], true);
      let chks = this.$refs.treeGrid.getChecked();
      console.log(chks);
    },
    clearSel(){
      this.$refs.treeGrid.clearSelection();
    },
    /**
     * 过滤节点方法，返回Boolean
     */
    filterNodeMethod (value, data) {
      console.log(value, data)
      if (!value) return true;
      return data.displayName.indexOf(value) !== -1 || data.url.indexOf(value) !== -1
    }
  }
})
```

  