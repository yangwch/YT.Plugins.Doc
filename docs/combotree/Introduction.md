combotree 下拉树控件

```js
new Vue({
    template: `
    <div style="position:relative">
    下拉树：单选 
    <yt-combotree
        ref="combotree"
        v-model="selectVal"
        :treeData="data2"
        :multiple="false"
        panel-height="150px"
        :dataProps="{children: 'children',label: 'label'}"
        :comboProps="{value: 'id',label: 'label'}">
    </yt-combotree>
    <input type="button" value="获取值" @click="getValue"/>
    <input type="button" value="设置值" @click="setValue"/>
    </div>
    `,
    data() {
        return {
            selectVal: 10,
            data2: [{
                id: 1,
                label: '一级 1',
                children: [{
                    id: 4,
                    label: '二级 1-1',
                    children: [{
                        id: 9,
                        label: '三级 1-1-1'
                    }, {
                        id: 10,
                        label: '三级 1-1-2'
                    }]
                }]
            }, {
                id: 2,
                label: '一级 2',
                children: [{
                    id: 5,
                    label: '二级 2-1'
                }, {
                    id: 6,
                    label: '二级 2-2'
                }]
            }, {
                id: 3,
                label: '一级 3',
                children: [{
                    id: 7,
                    label: '二级 3-1'
                }, {
                    id: 8,
                    label: '二级 3-2'
                }]
            }]
        }
    },
    methods: {
        getValue(){
            alert(this.selectVal)
        },
        setValue(){
            this.$refs.combotree.setSelected(10)
        }
    }
})
```