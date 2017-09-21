使用树形格式渲染一个列表树

    <yt-tree-grid :items='[{id: 1,displayName:"一级",url:"l1.do",children:[{id:2,displayName:"二级",url:"l2.do"}]}]'
        :columns='[{title: "选择",type:"selection",width: 20},{title: "菜单名称",key: "displayName",treeField: true,width: 250},{title: "URL",key: "url",width: 250}]'
        ref="treeGrid"></yt-tree-grid>