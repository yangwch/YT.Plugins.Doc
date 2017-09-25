<!--
	pdf组件
	@desc pdf
 -->
<template>
	<div ref="pdfdom" :class="className">
	</div>
</template>
<script>
	import PDFObject from './pdfobject.js'
	export default {
	    name: 'yt-pdf',
		data(){
			return {
				pdfobject: null
			}
		},
		props: {
		    /**
			 * 渲染pdf的dom类名
			 * */
			className: {
				type: String
			},
			/**
			 * pdfObject自定义选项。
			 * 默认值 {pdfOpenParams: {pagemode: "thumbs",navpanes: 1,toolbar: 0,statusbar: 0,view: "FitV"}}
			 * */
			options: {
				type: Object,
				default() {
					return {
						pdfOpenParams: {
							pagemode: "thumbs",
							navpanes: 1,
							toolbar: 0,
							statusbar: 0,
							view: "FitV"
						}
					}
				}
			},
			/** pdf地址 */
			url: {
				type: String
			}
		},
		mounted(){
			this.init()
		},
		methods: {
			init(){
				this.pdfobject = PDFObject.embed(this.url, this.$refs.pdfdom, this.options)
			}
		}
	}
</script>