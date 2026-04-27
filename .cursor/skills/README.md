---
title: Skill 目录
category: skills
tags: [skills, index]
created: 2026-04-26
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

## UniApp Vue3 规范

| Skill | 摘要 | 标签 |
|-------|------|------|
| [页面生成规范](./uniapp-vue3/page-generation.md) | 页面文件结构、导航栏、样式书写规范 | uniapp, vue3, page |
| [原子化 CSS 使用规范](./uniapp-vue3/atomic-css.md) | 尺寸、间距、颜色、Flex 等原子类使用 | css, atomic-css |
| [cu-components 自定义组件](./uniapp-vue3/cu-components.md) | 项目自定义组件（cu-nav-bar、cu-radio 等） | components, cu-components |
| [uview-plus 组件](./uniapp-vue3/uview-plus-components.md) | uview-plus UI 框架组件（u-form、u-picker 等） | components, uview-plus |
| [Picker 选择器组件](./uniapp-vue3/picker-components.md) | 日期、地区、联动等选择器组件 | components, picker |
| [接口调用规范](./uniapp-vue3/api-request.md) | HTTP 请求、响应处理、错误捕获 | api, http |
| [工具函数使用规范](./uniapp-vue3/utils.md) | 页面跳转、提示、防抖节流等工具函数 | utils |
| [图片/图标处理规范](./uniapp-vue3/image-handling.md) | 图片占位、图标使用、路径处理 | image, icon |
| [表单书写规范](./uniapp-vue3/form.md) | 表单结构、输入框、验证规则 | form, input |
| [分步表单填写模式](./uniapp-vue3/multi-step-form.md) | 多页面分步填写，最后聚合提交 | form, multi-step |
| [表单数据回显与状态管理](./uniapp-vue3/form-data-echo.md) | 接口数据回显、编辑模式、状态联动 | form, edit-mode |
| [跨页面数据传递](./uniapp-vue3/cross-page-data-transfer.md) | 使用本地存储在页面间传递数据 | storage, cross-page |
| [验证码倒计时 Hook](./uniapp-vue3/countdown-hook.md) | useCountDown 封装，短信验证码发送与倒计时 | hook, countdown, sms |
| [页面初始化动画](./uniapp-vue3/page-init-animation.md) | 页面淡入效果，数据加载完成后显示 | animation, loading, fade-in |
| [pages.json 配置规范](./uniapp-vue3/pages-json-config.md) | 页面配置、TabBar、下拉刷新 | config |
| [全局弹窗系统使用规范](./uniapp-vue3/popup-system.md) | App 端全局弹窗，支持多种模式 | popup, modal, dialog |
| [多数据源页面设计](./uniapp-vue3/multi-source-page.md) | 一个页面支持多种数据来源（消息、协议等） | page, data-source |
| [Query 参数解析与路由处理](./uniapp-vue3/query-params-handling.md) | onLoad 接收参数、类型转换、校验 | router, query |
| [富文本渲染](./uniapp-vue3/rich-text-render.md) | cu-parser 组件渲染 HTML 内容 | rich-text, html |
| [数值排列菜单组件](./uniapp-vue3/menu-list-component.md) | 菜单列表组件设计模式，数据驱动 | component, menu, list |
| [useLoadList 分页列表 Hook](./uniapp-vue3/load-list-hook.md) | 分页加载、下拉刷新、上拉加载更多 | hook, list, pagination |
| [图片预览功能](./uniapp-vue3/image-preview.md) | uni.previewImage 多图预览实现 | image, preview |
| [头像上传与裁剪](./uniapp-vue3/avatar-upload-crop.md) | 头像选择、裁剪、上传完整流程 | avatar, upload, crop |
| [页面状态管理](./uniapp-vue3/page-state-management.md) | Vue3 Composition API 页面状态管理 | state, lifecycle, pinia |
| [全局事件总线](./uniapp-vue3/global-event-bus.md) | uni.$on/$emit 正确使用与内存管理 | event-bus, memory-leak |
| [海拔选择器组件](./uniapp-vue3/altitude-picker.md) | 三列滚轮海拔选择器，支持 10~5000m 范围 | component, picker, form |
| [客服联系组件](./uniapp-vue3/contact-kefu-component.md) | 客服电话展示与拨打，支持 props 或接口获取 | component, customer-service, phone |
| [自定义 TabBar 实现与定制规范](./uniapp-vue3/custom-tabbar.md) | 隐藏原生 TabBar，自定义样式，支持红点/凸起按钮/动态显隐 | tabbar, custom, navigation |

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
3. 使用组件时，参考 [组件使用规范](./uniapp-vue3/components.md)
4. 调用接口时，参考 [接口调用规范](./uniapp-vue3/api-request.md)
5. 使用工具函数时，参考 [工具函数使用规范](./uniapp-vue3/utils.md)
6. 查看工作日志时，参考 [工作日志目录](../memory/work-log/)
