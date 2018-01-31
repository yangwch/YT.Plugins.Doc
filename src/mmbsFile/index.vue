<template>
  <div class="mmbs-files">
    <!-- 选择文件控件 -->
    <input name="file" class="el-upload__input" ref="input" type="file" @change="onChooseFile()">
    <!-- 上传按钮 - 文本类型 - start -->
    <div class="el-upload el-upload--picture" v-if="listType == 'text'">
      <button class="el-button el-button--primary el-button--mini" type="button" @click="$refs.input.click()">
        <span>点击上传</span>
      </button>
    </div>
    <!-- 文件列表 -->
    <ul class="el-upload-list el-upload-list--text" v-if="listType === 'text'">
      <li class="el-upload-list__item" v-for="(item, index) in fileList" :key="index">
        <a class="el-upload-list__item-name" target="_blank" :href="item.url">
          <i class="el-icon-document"></i>{{item.name}}
        </a>
        <i class="el-icon-close" @click="onRemove(item, index)"></i>
      </li>
    </ul>
    <!-- 上传按钮 - 文本类型 - end -->
    <!-- 图片卡片列表 - start -->
    <ul class="el-upload-list el-upload-list--picture-card" v-else-if="listType === 'picture'">
      <li class="el-upload-list__item" v-for="(item, index) in fileList" :key="index">
        <img class="el-upload-list__item-thumbnail" alt="" :src="item.url">
        <a class="el-upload-list__item-name">
          <i class="el-icon-document"></i>{{item.name}}
        </a>
        <label class="el-upload-list__item-status-label">
          <i class="el-icon-upload-success el-icon-check"></i>
        </label>
        <i class="el-icon-close"></i>
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="onPreview(item, index)"><i class="el-icon-zoom-in"></i></span>
          <span class="el-upload-list__item-delete" @click="onRemove(item, index)"><i class="el-icon-delete"></i></span>
        </span>
      </li>
    </ul>
    <!-- 上传按钮 -->
    <div v-if="listType === 'picture'" class="el-upload el-upload--picture-card" @click="$refs.input.click()">
      <i class="el-icon-plus"></i><input name="file" class="el-upload__input" type="file">
    </div>
    <!-- 图片预览 -->
    <el-dialog
      :visible.sync="previewVisible"
      append-to-body>
      <img :src="previewUrl" style="width: 100%">
    </el-dialog>
    <!-- 图片卡片列表 - end -->

  </div>
</template>
<style lang="less" scoped>
  .mmbs-files {
    min-height: 40px;
  }
</style>
<script>
import {commonApi} from '../api/index'
import {Message, MessageBox, Dialog} from 'element-ui'
export default {
  name: 'mmbsFile',
  components: {
    ElDialog: Dialog
  },
  props: {
    /**
    * 文件列表
    */
    value: {
      type: Array,
      default () {
        return []
      }
    },
    /**
     * 文件扩展类型校验，例：['.pdf', '.doc']
     */
    fileTypes: {
      type: Array,
      default () {
        return []
      }
    },
    /**
     * 是否支持选多个文件，默认：true
     */
    multiple: {
      type: Boolean,
      default () {
        return true
      }
    },
    /**
     * 最多上传个数，默认：99
     */
    max: {
      type: Number,
      default () {
        return 99
      }
    },
    /**
     * 文件列表展示类型
     */
    listType: {
      type: String,
      default () {
        return 'text'
      }
    }
  },
  watch: {
    /** @description
     * 监视值变化
     */
    value (val, oldVal) {
      let files = [].concat(val || [])
      this.fileList = files
    }
  },
  data () {
    let files = [].concat(this.value || [])
    return {
      fileList: files,
      previewTitle: null,
      previewVisible: false,
      previewUrl: null,
    }
  },
  methods: {
    /**
     * 选择文件
     */
    onChooseFile () {
      let files = this.$refs.input.files
      let self = this
      if (files.length) {
        for (let i = 0; i < files.length; i++) {
          let file = files[i]
          self.upload(file)
        }
      }
    },
    /**
     * 验证格式合法性
     */
    validFileType (file) {
      // 检查是否超过限制数量
      if (!this.multiple && this.fileList.length > 0) {
        Message({ message: '不允许选择多个文件' })
        return false
      }
      if (this.multiple && this.fileList && this.fileList.length >= this.max) {
        Message({ message: '超出文件数量限制' })
        return false
      }
      let fileTypes = [].concat(this.fileTypes)
      // 若显示类型为图片且未设置文件类型，则默认设置文件类型
      if (this.listType === 'picture' && !fileTypes.length) {
        fileTypes = ['.jpg', '.png', '.gif', '.jpeg']
      }
      if (fileTypes && fileTypes.length && file) {
        let fileName = file.name
        // 校验文件格式
        let matched = fileName.match(new RegExp(fileTypes.join('|') + '$/i'))
        if (!matched) {
          Message({ message: '请选择符合要求的格式：' + fileTypes.join('、'), type: 'error' })
        }
        return matched
      }
      return true
    },
    /**
     * 上传
     */
    upload (file) {
      if (this.validFileType(file)) {
        commonApi.upload(file).then(data => {
          console.log(data)
          this.fileList.push({name: file.name, url: data.url()})
          this.$emit('input', this.fileList)
        }).catch(ex => {
          this.$message.error(ex)
        })
      }
    },
    /**
     * @public
     * @description
     * 清除文件列表
     */
    clear () {
      this.fileList = []
      this.$emit('input', this.fileList)
    },
    /**
     * 移除文件
     */
    onRemove (item, index) {
      MessageBox.confirm('是否要删除 ' + (item.name || '') + ' ？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fileList.splice(index, 1)
        this.$emit('input', this.fileList)
      }).catch(() => { })
    },
    /**
     * 预览图片
     */
    onPreview (item, index) {
      this.previewTitle = item.name + ' - 预览'
      this.previewUrl = item.url
      this.previewVisible = true
    }
  }
}
</script>


