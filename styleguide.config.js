const loaders = require('vue-webpack-loaders');
//console.log(JSON.stringify(loaders))
module.exports = {
  sections: [
      {
          /* The component itself */
          name: 'yt-tree-grid 树形表格',
          content: 'docs/treegrid/Introduction.md',
          components: 'src/treegrid/treegrid.vue',
          // ignore: ['src/ignored-component/ignored-component.vue'],
          sections: [
              /* One item for every different demo or doc of the component */
              {
                  name: '示例1',
                  content: 'docs/treegrid/UseCase1.md'
              }
          ]
      },
      {
          name: 'yt-list 列表页模板',
          content: 'docs/list/Introduction.md',
          components: 'src/listTemp/list.vue'
      },
      {
          name: 'yt-table 表格',
          content: 'docs/table/Introduction.md',
          components: 'src/table/table.vue',
          sections: [ ]
      },
      {
          name: 'yt-pdf pdf显示插件',
          content: 'docs/pdf/Introduction.md',
          components: 'src/pdf/pdf.vue'
      },
      {
          name: 'yt-map 地图插件',
          content: 'docs/map/Introduction.md',
          components: 'src/map/ytMap.vue'
      },
      {
          name: 'echarts 指令示例',
          content: 'docs/echarts/Introduction.md',
          components: 'src/echarts/echarts.vue'
      }
      /*{
        /!* The component itself *!/
        name: 'yt-component 示例',
        content: 'docs/yt-component/Introduction.md',
        components: 'src/!**!/yt-component.vue',
        // ignore: ['src/ignored-component/ignored-component.vue'],
        sections: [
          /!* One item for every different demo or doc of the component *!/
          {
            name: 'Use Case 1',
            content: 'docs/yt-component/UseCase1.md'
          },
          {
            name: 'Use Case 2',
            content: 'docs/yt-component/UseCase2.md'
          }
        ]
      }*/
  ],
  webpackConfig: {
    module: {
			loaders
		}
  },
    serverPort: 6062,
    showUsage: true,
    showCode: false,
    theme: {
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
    }
};
