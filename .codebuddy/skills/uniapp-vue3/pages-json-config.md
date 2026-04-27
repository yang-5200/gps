---
title: UniApp Vue3 pages.json 配置规范
category: uniapp-vue3
tags: [config, pages-json, routing, tabbar]
created: 2026-04-26
---

# pages.json 配置规范

## 核心原则

1. **全局自定义导航栏** - 已在 `globalStyle` 中配置 `"navigationStyle": "custom"`
2. **TabBar 页面简化配置** - TabBar 页面不需要额外 `style` 配置
3. **非 TabBar 页面按需配置** - 需要特殊功能时添加 `style`

## 页面配置规则

### 1. TabBar 页面配置

TabBar 页面**不需要** `style` 字段，保持最简配置：

```json
{
  "path": "pages/tab/device/index"
},
{
  "path": "pages/tab/map/index"
},
{
  "path": "pages/tab/mine/index"
}
```

**原因：**
- 全局已配置 `"navigationStyle": "custom"`
- TabBar 页面统一使用自定义导航栏 `cu-nav-bar`
- 不需要下拉刷新时，省略 `style` 更简洁

### 2. 非 TabBar 页面配置

普通页面根据需求添加 `style`：

```json
// 需要下拉刷新
{
  "path": "pages/order/list/index",
  "style": {
    "enablePullDownRefresh": true
  }
},

// 完全自定义导航栏（默认已全局配置，可省略）
{
  "path": "pages/detail/index"
}
```

### 3. 禁止的配置

❌ **不要** 在 `pages` 中添加以下配置：

```json
// 错误示例 - 不要添加这些
{
  "path": "pages/tab/device/index",
  "style": {
    "navigationBarTitleText": "设备",  // ❌ 不需要
    "navigationStyle": "custom"        // ❌ 全局已配置
  }
}
```

## TabBar 配置规范

### 完整配置示例

```json
{
  "pages": [
    { "path": "pages/tab/device/index" },
    { "path": "pages/tab/map/index" },
    { "path": "pages/tab/mine/index" },
    { "path": "pages/views/device/add" },
    { "path": "pages/views/settings/about" }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "uni-app",
    "navigationBarBackgroundColor": "#F8F8F8",
    "backgroundColor": "#F8F8F8",
    "navigationStyle": "custom"
  },
  "tabBar": {
    "backgroundColor": "#FFFFFF",
    "selectedColor": "#5D4037",
    "borderStyle": "black",
    "color": "#999999",
    "list": [
      {
        "pagePath": "pages/tab/device/index",
        "text": "设备",
        "iconPath": "/static/images/tabbar/facility.png",
        "selectedIconPath": "/static/images/tabbar/flacility-selected.png"
      },
      {
        "pagePath": "pages/tab/map/index",
        "text": "地图",
        "iconPath": "/static/images/tabbar/map.png",
        "selectedIconPath": "/static/images/tabbar/map-selected.png"
      },
      {
        "pagePath": "pages/tab/mine/index",
        "text": "我的",
        "iconPath": "/static/images/tabbar/mine.png",
        "selectedIconPath": "/static/images/tabbar/mine-selected.png"
      }
    ]
  }
}
```

### TabBar 配置要点

1. **必须配置原生 TabBar** - 即使使用自定义 TabBar 组件
2. **路径格式** - `pagePath` 不需要前导 `/`
3. **图标要求** - 每个 Tab 需要两张图标（选中/未选中）
4. **颜色配置** - `selectedColor` 应与项目主题色一致

## 注意事项

1. **TabBar 页面路径** - 必须在 `pages` 数组中声明
2. **路径匹配** - `tabBar.list` 中的 `pagePath` 必须与 `pages` 中的路径一致
3. **顺序无关** - TabBar 页面的顺序由 `tabBar.list` 决定，不是 `pages` 数组
4. **自定义 TabBar** - 使用自定义组件时，仍需配置原生 TabBar 以支持 `switchTab`

## 相关 Skill

- [自定义 TabBar 实现](./custom-tabbar.md)
- [页面生成规范](./page-generation.md)
