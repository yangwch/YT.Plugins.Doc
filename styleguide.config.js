const loaders = require('vue-webpack-loaders');
//console.log(JSON.stringify(loaders))
module.exports = {
  sections: [
      {
          /* The component itself */
          name: 'yt-tree-grid',
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
          name: 'yt-table',
          content: 'docs/table/Introduction.md',
          components: 'src/table/table.vue',
          // ignore: ['src/ignored-component/ignored-component.vue'],
          sections: [
              /* One item for every different demo or doc of the component */
              /*{
                  name: '示例1',
                  content: 'docs/table/UseCase1.md'
              }*/
          ]
      },
    {
      /* The component itself */
      name: 'yt-component',
      content: 'docs/yt-component/Introduction.md',
      components: 'src/**/yt-component.vue',
      // ignore: ['src/ignored-component/ignored-component.vue'],
      sections: [
        /* One item for every different demo or doc of the component */
        {
          name: 'Use Case 1',
          content: 'docs/yt-component/UseCase1.md'
        },
        /* One item for every different demo or doc of the component */
        {
          name: 'Use Case 2',
          content: 'docs/yt-component/UseCase2.md'
        }
      ]
    }
  ],
  webpackConfig: {
    module: {
			loaders
		}
  },
    serverPort: 6062,
    showUsage: true,
    showCode: true,
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
                to: { opacity: 0 }
            }
        }
    }
};
