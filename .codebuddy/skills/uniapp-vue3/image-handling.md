---
title: UniApp Vue3 图片/图标处理规范
category: uniapp-vue3
tags: [uniapp, vue3, image, icon, placeholder]
created: 2026-04-26
---

# UniApp Vue3 图片/图标处理规范

## 问题/场景
在 uni-app + Vue3 项目中生成页面时，经常遇到图片或图标路径不存在的情况，需要有统一的占位处理方案。

## 核心要点

### 1. 图片路径不存在时的处理

如果生成页面时遇到图片或图标未找到，**必须注释掉 image 标签，不填写具体路径，同时使用 CSS/图标库创建占位效果**。

### 2. 占位方案优先级

1. **首选** - 使用 `cuIcon` 图标库（如 `cuIcon-locationfill`）
2. **次选** - 使用 CSS 绘制简单图形
3. **避免** - 使用错误的图片路径或空白 image 标签

## 示例代码

### Logo 占位示例

```vue
<template>
  <!-- Logo 区域 -->
  <view class="logo-box flex-column align-center">
    <!-- 图片占位 - 请替换实际路径 -->
    <!-- <image class="logo-img box-size-lg-50" src="/static/logo.png" mode="aspectFit"></image> -->
    
    <!-- Logo 占位图标 -->
    <view class="logo-placeholder box-size-lg-50 radius round flex align-center justify-center">
      <text class="cuIcon-locationfill text-white text-xxxl"></text>
    </view>
  </view>
</template>

<style lang="scss">
.logo-placeholder {
  background-color: #5D4037;
}
</style>
```

### 列表图片占位示例

```vue
<template>
  <view class="list-item flex-row">
    <!-- 图片占位 -->
    <!-- <image class="cover box-size-xs-40 radius-sm" :src="item.cover" mode="aspectFill"></image> -->
    
    <!-- 占位图标 -->
    <view class="cover-placeholder box-size-xs-40 radius-sm bg-gray flex align-center justify-center">
      <text class="cuIcon-pic text-white text-lg"></text>
    </view>
    
    <view class="info flex-sub margin-left-sm">
      <text class="text-df text-bold text-hidden">{{ item.title }}</text>
    </view>
  </view>
</template>
```

### 头像占位示例

```vue
<template>
  <view class="avatar-box flex-row align-center">
    <!-- 头像占位 -->
    <!-- <image class="avatar box-size-xs-32 radius round" :src="user.avatar" mode="aspectFill"></image> -->
    
    <!-- 头像占位图标 -->
    <view class="avatar-placeholder box-size-xs-32 radius round bg-blue flex align-center justify-center">
      <text class="cuIcon-people text-white text-sm"></text>
    </view>
    
    <text class="text-df margin-left-xs">{{ user.name }}</text>
  </view>
</template>
```

### 图片组件使用

优先使用 `cu-img` 或 `image` 标签：

```vue
<template>
  <!-- 使用 cu-img 组件 -->
  <cu-img src="/static/logo.png" mode="aspectFit"></cu-img>
  
  <!-- 或原生 image -->
  <image class="box-size-xs-32 radius-sm" src="/static/logo.png" mode="aspectFill"></image>
</template>
```

## 常用 cuIcon 图标

| 图标类名 | 用途 |
|---------|------|
| `cuIcon-locationfill` | 位置/定位 |
| `cuIcon-pic` | 图片 |
| `cuIcon-people` | 用户/头像 |
| `cuIcon-home` | 首页 |
| `cuIcon-settings` | 设置 |
| `cuIcon-search` | 搜索 |
| `cuIcon-right` | 右箭头 |
| `cuIcon-back` | 返回 |
| `cuIcon-close` | 关闭 |
| `cuIcon-check` | 勾选 |

## 注意事项/踩坑记录

1. **必须注释**: 图片路径不存在时，必须注释掉 image 标签，不能留空 src
2. **占位样式**: 占位元素需要设置背景色和圆角，保持视觉一致性
3. **图标大小**: 根据容器大小选择合适的图标尺寸类（`text-xs` ~ `text-xxxl`）
4. **颜色搭配**: 占位背景色和图标颜色要协调，常用 `bg-gray`、`bg-blue`、`bg-df-color`
5. **flex 居中**: 占位容器使用 `flex align-center justify-center` 使图标居中

## 相关 skill
- [原子化 CSS 使用规范](./atomic-css.md)
- [组件使用规范](./components.md)
