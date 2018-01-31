示例
```js
new Vue({
  components: {
    ElSwitch: require('element-ui').Switch
  },
  template: `
    <div>
      <p>
        列表类型：
        <el-switch
          v-model="listType"
          active-value="text"
          inactive-value="picture"
          active-text="text"
          inactive-text="picture"
          active-color="#13ce66"
          inactive-color="#ff4949"/>
      </p>
      <mmbs-file v-model="files" multiple :max="3" :list-type="listType"/>
      <br/>
      <br/>
      </el-switch>
      值：
      <pre v-html="files"></pre>
    </div>
  `,
  data () {
    return {
      listType: 'text',
      files: [{
        name: 'v-echarts.png',
        url: '/static/img/demo.png'
      }]
    }
  }
})

```