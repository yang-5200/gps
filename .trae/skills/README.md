---
title: Skill 目录
category: skills
tags: [skills, index]
created: 2026-04-26
updated: 2026-04-29
---

# Skill 目录

本目录包含基于 uni-app + Vue3 技术栈的 Skill 文件，用于指导 AI 生成符合项目规范的代码。

## 目录结构

```
.trae/
├── rules/
│   └── work-log-system.md      # 工作日志规范
├── memory/
│   └── work-log/               # 每日工作日志
│       └── {YYYY-MM}/
│           └── {YYYY-MM-DD}.md
└── skills/
    ├── README.md               # 本文件
    └── uniapp-vue3/            # uni-app + Vue3 技术栈规范
```

## 工作日志

每日工作日志记录在 `.trae/memory/work-log/` 目录下：

| 日期 | 日志文件 |
|------|----------|
| 2026-04-26 | [2026-04-26.md](../memory/work-log/2026-04/2026-04-26.md) |

## 页面与布局

| Skill | 摘要 | 标签 |
|-------|------|------|
| [页面生成规范](./uniapp-vue3/page-generation.md) | 页面文件结构、导航栏、样式书写规范 | uniapp, vue3, page |
| [pages.json 配置规范](./uniapp-vue3/pages-json-config.md) | 页面配置、TabBar、下拉刷新 | config |
| [原子化 CSS 使用规范](./uniapp-vue3/atomic-css.md) | 尺寸、间距、颜色、Flex 等原子类使用 | css, atomic-css |
| [页面初始化动画](./uniapp-vue3/page-init-animation.md) | 页面淡入效果，数据加载完成后显示 | animation, loading |

## 组件规范（原子化）

### cu-components 自定义组件

| Skill | 摘要 | 标签 |
|-------|------|------|
| [cu-nav-bar 导航栏](./uniapp-vue3/cu-nav-bar.md) | 自定义导航栏，支持沉浸式 | component, nav-bar |
| [cu-popup 弹窗](./uniapp-vue3/cu-popup.md) | 页面内弹窗组件 | component, popup |
| [cu-radio 单选框](./uniapp-vue3/cu-radio.md) | 单选框，支持布尔值和数字 | component, radio, form |
| [cu-media-upload 媒体上传](./uniapp-vue3/cu-media-upload.md) | 图片上传组件 | component, upload |
| [cu-page-footer 页脚](./uniapp-vue3/cu-page-footer.md) | 底部固定区域，安全区适配 | component, footer |
| [cu-parser 富文本解析](./uniapp-vue3/cu-parser.md) | HTML 富文本渲染 | component, rich-text |
| [cu-load-list 列表加载](./uniapp-vue3/cu-load-list.md) | 列表加载状态组件 | component, list |
| [cu-components 索引](./uniapp-vue3/cu-components-index.md) | 所有 cu-components 组件索引 | index |

### uview-plus 组件

| Skill | 摘要 | 标签 |
|-------|------|------|
| [u-form 表单](./uniapp-vue3/u-form.md) | 表单容器和验证 | component, form |
| [u-input 输入框](./uniapp-vue3/u-input.md) | 输入框组件 | component, input |
| [u-button 按钮](./uniapp-vue3/u-button.md) | 按钮组件 | component, button |
| [u-picker 选择器](./uniapp-vue3/u-picker.md) | 单列/多列选择器 | component, picker |
| [uview-plus 索引](./uniapp-vue3/uview-plus-index.md) | 所有 uview-plus 组件索引 | index |

### Picker 选择器

| Skill | 摘要 | 标签 |
|-------|------|------|
| [date-picker 日期选择](./uniapp-vue3/date-picker.md) | 日期选择器 | component, picker, date |
| [region-picker 地区选择](./uniapp-vue3/region-picker.md) | 省市区选择器 | component, picker, region |
| [linkage-picker 联动选择](./uniapp-vue3/linkage-picker.md) | 多级联动选择器 | component, picker, linkage |
| [海拔选择器组件](./uniapp-vue3/altitude-picker.md) | 三列滚轮海拔选择器 | component, picker, form |
| [Picker 索引](./uniapp-vue3/picker-index.md) | 所有 Picker 组件索引 | index |

### 弹窗系统

| Skill | 摘要 | 标签 |
|-------|------|------|
| [pop-modal 基础弹窗](./uniapp-vue3/pop-modal.md) | 确认/取消弹窗 | popup, modal |
| [pop-modal-icon 带图标弹窗](./uniapp-vue3/pop-modal-icon.md) | 带图标和输入框弹窗 | popup, modal, input |
| [pop-updateapp 更新弹窗](./uniapp-vue3/pop-updateapp.md) | App 更新提示弹窗 | popup, update |
| [pop-video 视频弹窗](./uniapp-vue3/pop-video.md) | 全屏视频播放弹窗 | popup, video |
| [全局弹窗系统](./uniapp-vue3/popup-system.md) | 全局弹窗系统完整规范 | popup, modal, dialog |
| [弹窗索引](./uniapp-vue3/popup-index.md) | 所有弹窗组件索引 | index |

## 表单规范（原子化）

| Skill | 摘要 | 标签 |
|-------|------|------|
| [表单输入框规范](./uniapp-vue3/form-input.md) | 输入框样式和结构 | form, input |
| [表单验证规范](./uniapp-vue3/form-validation.md) | 数据验证方式 | form, validation |
| [表单按钮规范](./uniapp-vue3/form-button.md) | 提交按钮样式 | form, button |
| [表单数据回显与状态管理](./uniapp-vue3/form-data-echo.md) | 接口数据回显、编辑模式 | form, edit-mode |
| [分步表单填写模式](./uniapp-vue3/multi-step-form.md) | 多页面分步填写，最后聚合提交 | form, multi-step |
| [跨页面数据传递](./uniapp-vue3/cross-page-data-transfer.md) | 使用本地存储在页面间传递数据 | storage, cross-page |
| [表单索引](./uniapp-vue3/form-index.md) | 所有表单相关规范索引 | index |

## 工具函数（原子化）

| Skill | 摘要 | 标签 |
|-------|------|------|
| [toPath 页面跳转](./uniapp-vue3/to-path.md) | 统一页面跳转方式 | utils, router |
| [toast/loading 提示](./uniapp-vue3/toast-loading.md) | 轻提示和加载提示 | utils, toast |
| [debounce/throttle 防抖节流](./uniapp-vue3/debounce-throttle.md) | 高频事件优化 | utils, performance |
| [工具函数索引](./uniapp-vue3/utils-index.md) | 所有工具函数索引 | index |

## 图片处理（原子化）

| Skill | 摘要 | 标签 |
|-------|------|------|
| [图片占位处理](./uniapp-vue3/image-placeholder.md) | 图片不存在时的占位方案 | image, placeholder |
| [图片预览功能](./uniapp-vue3/image-preview.md) | uni.previewImage 多图预览 | image, preview |
| [头像上传与裁剪](./uniapp-vue3/avatar-upload-crop.md) | 头像选择、裁剪、上传完整流程 | avatar, upload |
| [图片处理索引](./uniapp-vue3/image-index.md) | 所有图片处理规范索引 | index |

## 数据与状态

| Skill | 摘要 | 标签 |
|-------|------|------|
| [接口调用规范](./uniapp-vue3/api-request.md) | HTTP 请求、响应处理、错误捕获 | api, http |
| [Query 参数解析与路由处理](./uniapp-vue3/query-params-handling.md) | onLoad 接收参数、类型转换、校验 | router, query |
| [页面状态管理](./uniapp-vue3/page-state-management.md) | Vue3 Composition API 页面状态管理 | state, lifecycle |
| [全局事件总线](./uniapp-vue3/global-event-bus.md) | uni.$on/$emit 正确使用与内存管理 | event-bus |
| [多数据源页面设计](./uniapp-vue3/multi-source-page.md) | 一个页面支持多种数据来源 | page, data-source |

## Hooks 与组件模式

| Skill | 摘要 | 标签 |
|-------|------|------|
| [验证码倒计时 Hook](./uniapp-vue3/countdown-hook.md) | useCountDown 封装，短信验证码 | hook, countdown |
| [useLoadList 分页列表 Hook](./uniapp-vue3/load-list-hook.md) | 分页加载、下拉刷新、上拉加载 | hook, list |
| [数值排列菜单组件](./uniapp-vue3/menu-list-component.md) | 菜单列表组件设计模式，数据驱动 | component, menu |
| [客服联系组件](./uniapp-vue3/contact-kefu-component.md) | 客服电话展示与拨打 | component, customer-service |
| [自定义 TabBar 实现](./uniapp-vue3/custom-tabbar.md) | 隐藏原生 TabBar，自定义样式 | tabbar, custom |

## 技术栈

- **框架**: uni-app + Vue3 (Composition API `<script setup>`)
- **UI库**: uview-plus 3.x
- **状态管理**: Pinia + pinia-plugin-persistedstate
- **样式**: SCSS + 原子化 CSS (public.css + base.scss)
- **HTTP**: uview-plus http 拦截器封装
- **组件库**: cu-components (自定义) + uni-ui + uni_modules
- **路由**: pages.json 配置，全局自定义导航栏

## 核心文件路径

| 用途 | 路径 |
|------|------|
| 原子化样式 | `common/style/public.css` |
| SCSS基础/布局 | `common/style/base.scss` |
| 主题变量 | `common/style/variables.js` |
| 工具函数 | `common/utils/util.js` |
| 沉浸式导航栏 | `common/utils/useNavbarImmerse.js` |
| HTTP请求 | `common/api/index.js` |
| 接口URL | `common/api/urls.js` |
| 全局配置 | `common/config.js` |
| 用户Store | `stores/user.js` |
| 自定义组件 | `components/cu-components/` |

## 使用说明

1. 生成页面时，首先参考 [页面生成规范](./uniapp-vue3/page-generation.md)
2. 使用原子化 CSS 时，参考 [原子化 CSS 使用规范](./uniapp-vue3/atomic-css.md)
3. 使用组件时，参考对应的组件 Skill 文件或索引文件
4. 调用接口时，参考 [接口调用规范](./uniapp-vue3/api-request.md)
5. 使用工具函数时，参考对应的工具函数 Skill 文件或索引
6. 查看工作日志时，参考 [工作日志目录](../memory/work-log/)
