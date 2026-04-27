<template>
	<!-- 旧版的微信小程序不显示图片问题 -->
	<mp-html :content="html" :tag-style="tagStyle" />
</template>

<script setup>
	const props = defineProps({
		tagStyle: { // 标签样式
			type: [Object],
			default () {
				return {
					img: 'width:100%;height:auto;'
				}
			}
		},
		html: { // 富文本内容
			type: [String],
			default: ''
		}
	})
</script>

<style lang="scss">

</style>