更多文档参考[element-ui官方文档](http://element.eleme.io/#/zh-CN/component/dialog)


```js
new Vue({
    components: {
      ElButton: require('element-ui').Button
    },
    template: `
    <div style="position:relative">
        非模态示例：
        <input type="button" value="弹出非模态框" @click="dialogVisible=true" />
        <yt-dialog
          title="鼠标放到标题上可以拖动哦"
          :visible.sync="dialogVisible"
          :modal="false"
          size="tiny"
          :before-close="handleClose">
          <span>这是一段信息</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </yt-dialog>
    </div>
    `,
    data() {
        return {
            dialogVisible: false
        }
    },
    methods: {
        handleClose(){
            alert('closed');
        }
    }
})
```