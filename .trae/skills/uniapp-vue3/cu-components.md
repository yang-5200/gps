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

| 组件 | 用途 | 路径 | 详情链接 |
|------|------|------|----------|
| `cu-nav-bar` | 自定义导航栏 | `cu-nav-bar/cu-nav-bar.vue` | [cu-nav-bar 使用文档](./cu-nav-bar.md) |
| `cu-popup` | 弹窗入口组件（封装平台差异） | `cu-popup/cu-popup.vue` | [全局弹窗系统](./popup-system.md) |
| `cu-popup-group` | 弹窗容器/分发器（根据 mode 渲染不同弹窗） | `cu-popup-group/cu-popup-group.vue` | [全局弹窗系统](./popup-system.md) |
| `cu-mask` | 遮罩层 | `cu-mask/cu-mask.vue` | [cu-mask 使用文档](./cu-mask.md) |
| `cu-layer` | 弹出层容器（支持5个方向） | `cu-layer/cu-layer.vue` | [cu-layer 使用文档](./cu-layer.md) |
| `cu-img` | 图片加载（自带失败占位图） | `cu-img/cu-img.vue` | [cu-img 使用文档](./cu-img.md) |
| `cu-image-preview` | 图片预览（列表展示+删除+自定义样式） | `cu-image-preview/cu-image-preview.vue` | [图片预览](./image-preview.md) |
| `cu-media-upload` | 媒体上传 | `cu-media-upload/cu-media-upload.vue` | [cu-media-upload 使用文档](./cu-media-upload.md) |
| `cu-swiper` | 轮播指示器 | `cu-swiper/cu-swiper.vue` | [cu-swiper 使用文档](./cu-swiper.md) |
| `cu-notice-bar` | 滚动通知（水平/垂直） | `cu-notice-bar/cu-notice-bar.vue` | [cu-notice-bar 使用文档](./cu-notice-bar.md) |
| `cu-not-data` | 空数据占位 | `cu-not-data/cu-not-data.vue` | [cu-not-data 使用文档](./cu-not-data.md) |
| `cu-load-more` | 加载更多状态 | `cu-load-more/cu-load-more.vue` | [cu-load-more 使用文档](./cu-load-more.md) |
| `cu-load-list` | 列表加载 | `cu-load-list/cu-load-list.vue` | [useLoadList 分页列表 Hook](./load-list-hook.md) |
| `cu-scroll-bar` | 横向滚动切换栏 | `cu-scroll-bar/cu-scroll-bar.vue` | [cu-scroll-bar 使用文档](./cu-scroll-bar.md) |
| `cu-radio` | 单选框 | `cu-radio/cu-radio.vue` | [cu-radio 使用文档](./cu-radio.md) |
| `cu-page-footer` | 页脚 | `cu-page-footer/cu-page-footer.vue` | [cu-page-footer 使用文档](./cu-page-footer.md) |
| `cu-parser` | 富文本解析 | `cu-parser/cu-parser.vue` | [富文本渲染](./rich-text-render.md) |
| `cu-save-album` | 保存相册弹窗 | `cu-save-album/cu-save-album.vue` | [cu-save-album 使用文档](./cu-save-album.md) |
| `cu-app-update` | APP更新检查 | `cu-app-update/cu-app-update.vue` | [cu-app-update 使用文档](./cu-app-update.md) |
| `cu-popover` | 气泡菜单 | `cu-popover/cu-popover.vue` | [cu-popover 使用文档](./cu-popover.md) |
| `cu-calendar` | 日历日期选择器 | `cu-calendar/cu-calendar.vue` | [cu-calendar 使用文档](./cu-calendar.md) |
| `cu-number-box` | 数字步进器 | `cu-number-box/cu-number-box.vue` | [cu-number-box 使用文档](./cu-number-box.md) |
| `cu-picker` | 多功能选择器 | `cu-picker/cu-picker.vue` | [Picker 选择器组件使用规范](./picker-components.md) |

## 注意事项/踩坑记录

1. **属性命名规范**: 模板中静态属性使用 kebab-case（短横线连接），`v-bind` 动态绑定对象属性可用驼峰
   - ✅ `<cu-radio is-data-type="boo" active-color="#5D4037">` （静态字符串值）
   - ✅ `<cu-media-upload :previewStyle="{ width: '670rpx' }">` （v-bind 动态绑定对象）
   - ❌ ~~`<cu-radio isDataType="boo">`~~（静态属性不要用驼峰）

2. **事件冒泡**: 协议链接需要阻止冒泡
   ```vue
   <text @click.stop="toProtocol('service')">《服务协议》</text>
   ```

3. **easycom 自动引入**: cu-components 组件无需手动 import

4. **cu-media-upload 数据格式**: 
   - 单张图片：`v-model` 绑定字符串（图片URL）
   - 多张图片：`v-model` 绑定数组（图片URL数组）
   - ✅ 单张：`formData.image = ''`
   - ✅ 多张：`formData.images = []`

5. **cu-calendar 调用方式**: 日历组件通过 `ref` 调用 `open()` 方法打开，不是通过 `v-model` 控制显隐
   - ✅ `calendarRef.value.open({ defaultDate: '2024-01-01' })`
   - ❌ ~~`showCalendar = true`~~

6. **cu-number-box 长按**: 默认开启长按连续步进，600ms 后开始连续步进，间隔 250ms。如不需要可通过 `:longPress="false"` 关闭

7. **cu-popup 组件搭配使用**: `cu-popup` 和 `cu-popup-group` 是父子组件关系，`cu-popup` 是对外入口，内部自动管理 `cu-popup-group` 的调度。使用时只需操作 `cu-popup` 的 `ref` 调用 `show()` 方法，不要直接操作 `cu-popup-group`
   - ✅ `cuPopupRef.value.show({ title: '提示', success: (res) => {} })`
   - ❌ ~~直接操作 `cuPopupGroupRef`~~

8. **cu-popup 平台差异**: `cu-popup` 在 App 端通过页面跳转展示弹窗（透明压窗屏），在 H5/小程序端在组件内直接渲染。通过 `isTabbarPage` 属性控制 tabbar 的显示/隐藏
   - ✅ tabbar 页面设置 `:isTabbarPage="true"`
   - ✅ 非 tabbar 页面设置 `:isTabbarPage="false"` 或不传

## 相关 skill
- [组件封装标准蓝图](./component-encapsulation-blueprint.md) ⭐ 核心封装指南
- [Picker 选择器组件使用规范](./picker-components.md) ⭐ cu-picker 详细文档
- [useLoadList 分页列表 Hook](./load-list-hook.md) - 列表加载相关
- [uview-plus 组件使用规范](./uview-plus-components.md)
- [页面生成规范](./page-generation.md)
- [原子化 CSS 使用规范](./atomic-css.md)
- [全局弹窗系统使用规范](./popup-system.md)
- [表单书写规范](./form.md)
- [图片预览](./image-preview.md)
- [富文本渲染](./rich-text-render.md)