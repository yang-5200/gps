---
title: cu-components 自定义组件使用规范
category: uniapp-vue3
tags: [uniapp, vue3, components, cu-components]
created: 2026-04-27
---

# cu-components 自定义组件使用规范

## 问题/场景
在 uni-app + Vue3 项目中，需要使用项目自定义的 cu-components 组件库，了解各组件的用法、Props 和事件。

## 核心要点

### 1. 引入方式
组件通过 easycom 自动引入，前缀 `cu-`，无需手动 import。

### 2. 组件列表

| 组件 | 用途 | 路径 |
|------|------|------|
| `cu-nav-bar` | 自定义导航栏 | `cu-nav-bar/cu-nav-bar.vue` |
| `cu-popup` | 弹窗 | `cu-popup/cu-popup.vue` |
| `cu-popup-group` | 弹窗组（配合全局弹窗系统使用） | `cu-popup-group/cu-popup-group.vue` |
| `cu-mask` | 遮罩层 | `cu-mask/cu-mask.vue` |
| `cu-layer` | 层级容器 | `cu-layer/cu-layer.vue` |
| `cu-img` | 图片加载 | `cu-img/cu-img.vue` |
| `cu-image-preview` | 图片预览 | `cu-image-preview/cu-image-preview.vue` |
| `cu-media-upload` | 媒体上传 | `cu-media-upload/cu-media-upload.vue` |
| `cu-swiper` | 轮播指示器 | `cu-swiper/cu-swiper.vue` |
| `cu-notice-bar` | 滚动通知 | `cu-notice-bar/cu-notice-bar.vue` |
| `cu-not-data` | 空数据 | `cu-not-data/cu-not-data.vue` |
| `cu-load-more` | 加载更多 | `cu-load-more/cu-load-more.vue` |
| `cu-load-list` | 列表加载 | `cu-load-list/cu-load-list.vue` |
| `cu-scroll-bar` | 滚动条 | `cu-scroll-bar/cu-scroll-bar.vue` |
| `cu-radio` | 单选框 | `cu-radio/cu-radio.vue` |
| `cu-page-footer` | 页脚 | `cu-page-footer/cu-page-footer.vue` |
| `cu-parser` | 富文本解析 | `cu-parser/cu-parser.vue` |
| `cu-save-album` | 保存相册 | `cu-save-album/cu-save-album.vue` |
| `cu-app-update` | APP更新 | `cu-app-update/cu-app-update.vue` |
| `cu-popover` | 气泡弹窗 | `cu-popover/cu-popover.vue` |

## 示例代码

请查阅各组件独立的 Skill 文档获取详细使用示例。

## 注意事项/踩坑记录

请查阅各组件独立的 Skill 文档获取详细注意事项。

## 相关 skill
- [uview-plus 组件使用规范](./uview-plus-components.md)
- [Picker 选择器组件使用规范](./picker-components.md)
- [页面生成规范](./page-generation.md)
- [原子化 CSS 使用规范](./atomic-css.md)
- [全局弹窗系统使用规范](./popup-system.md)
- [表单书写规范](./form.md)
