根据element-ui中dialog修改。（管廊项目）
### Slot

* —	-    Dialog 的内容
* title -	Dialog 标题区的内容
* footer -	Dialog 按钮操作区的内容

### events
* close -   Dialog 关闭的回调
* open  -   Dialog 打开的回调
```js
new Vue({
    template: `
    <div style="position:relative">
      <el-button @click="dialogVisible=true">弹出对话框</el-button>
      <yt-dialog
        title="鼠标放到标题上可以拖动哦"
        :visible.sync="dialogVisible"
        size="tiny">
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
    }
})
```