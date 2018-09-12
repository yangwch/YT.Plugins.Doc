const loaders = require('vue-webpack-loaders');
const path = require('path');
const { theme, styles } = require('./src/styleguidist/style')

//console.log(JSON.stringify(loaders))
module.exports = {
  title: 'YT.WEB.DOC',
  highlightTheme: 'material',
  sections: [
    {
      name: 'mmbs',
      content: 'docs/mmbsList/a.Introduction.md',
      sections: [
        {
          name: 'mmbs列表页',
          components: 'src/mmbsList/index.vue',
          sections: [
            {
              // name: '一般功能',
              content: 'docs/mmbsList/c.simple.md'
            },
            {
              // name: '多行编辑表单',
              content: 'docs/mmbsList/d.multiRowForm.md'
            },
            {
              // name: '表单类型示例',
              content: 'docs/mmbsList/e.form.md'
            },
            {
              // 查询
              content: 'docs/mmbsList/f.query.md'
            }
          ]
        },
        {
          name: 'mmbs文件上传',
          components: 'src/mmbsFile/index.vue'
        },
        {
          name: 'mmbs数据订阅',
          sections: [
            {
              content: 'docs/mmbsList/g.liveQuery.md',
            }
          ]
        }
      ],
    },
    {
      name: '可拖动对话框',
      content: 'docs/dialog/Introduction.md',
      components: 'src/dialog/dialog.vue'
    },
    {
      name: '下拉树',
      content: 'docs/combotree/Introduction.md',
      components: 'src/combotree/index.vue'
    },
    {
      /* The component itself */
      name: '树形表格',
      content: 'docs/treegrid/Introduction.md',
      components: 'src/treegrid/treegrid.vue',
      // ignore: ['src/ignored-component/ignored-component.vue'],
      sections: [
        /* One item for every different demo or doc of the component */
        {
          // name: '多选树形表格',
          content: 'docs/treegrid/UseCase1.md'
        }
      ]
    },
    {
      name: '列表页模板',
      content: 'docs/list/Introduction.md',
      components: 'src/listTemp/list.vue'
    },
    {
      name: '表格',
      content: 'docs/table/Introduction.md',
      components: 'src/table/table.vue',
      sections: []
    },
    {
      name: 'pdf显示插件',
      content: 'docs/pdf/Introduction.md',
      components: 'src/pdf/pdf.vue'
    },
    {
      name: '地图插件',
      content: 'docs/map/Introduction.md',
      components: 'src/map/ytMap.vue'
    },
    {
      name: 'echarts指令',
      content: 'docs/echarts/Introduction.md',
      components: 'src/echarts/echarts.vue'
    }
  ],
  styleguideComponents: {
    Logo: path.join(__dirname, 'src/styleguidist/components/logo.js'),
  },
  webpackConfig: {
    module: {
      loaders
    }
  },
  styleguideDir: './dist',
  serverPort: 6062,
  showUsage: true,
  showCode: false,
  theme,
  styles
  /*theme: {
      color: {
          link: 'firebrick',
          linkHover: 'salmon',
      },
      fontFamily: {
          base: '"monospace", "Comic Sans MS", "Comic Sans", cursive'
      }
  },
  styles: {
      Logo: {
          logo: {
              animation: 'blink ease-in-out 3000ms infinite'
          },
          '@keyframes blink': {
              to: { opacity: 0.2 }
          }
      }
  }*/
};
