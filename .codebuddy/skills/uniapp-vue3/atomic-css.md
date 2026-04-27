---
title: UniApp Vue3 原子化 CSS 使用规范
category: uniapp-vue3
tags: [uniapp, vue3, css, atomic-css, scss]
created: 2026-04-26
---

# UniApp Vue3 原子化 CSS 使用规范

## 问题/场景
在 uni-app + Vue3 项目中，通过原子化 CSS 可以快速构建 UI，减少自定义样式的编写，提高开发效率和代码一致性。

## 核心要点

### 1. 尺寸类 (public.css)

| 类名模式 | 说明 | 示例 |
|---------|------|------|
| `box-size-w-{n}` | 宽度 2n rpx | `box-size-w-50` = 100rpx |
| `box-size-h-{n}` | 高度 2n rpx | `box-size-h-49` = 98rpx |
| `box-size-xs-{n}` | 正方形 2n rpx | `box-size-xs-32` = 64x64rpx |
| `box-size-lg-{n}` | 正方形 200+2n rpx | `box-size-lg-1` = 202x202rpx |

### 2. 间距类

| 类名 | 值 |
|------|-----|
| `margin-xs` / `padding-xs` | 10rpx |
| `margin-sm` / `padding-sm` | 20rpx |
| `margin-hdf` / `padding-hdf` | 16rpx |
| `margin` / `padding` | 30rpx |
| `margin-df` / `padding-df` | 32rpx |
| `margin-lg` / `padding-lg` | 40rpx |
| `margin-xl` / `padding-xl` | 50rpx |
| `margin-24` / `padding-24` | 24rpx |
| `margin-8` / `padding-8` | 8rpx |

方向后缀：`-top`, `-right`, `-bottom`, `-left`, `-tb`, `-lr`

### 3. 圆角类

| 类名 | 值 |
|------|-----|
| `radius-xs` | 8rpx |
| `radius-sm` | 16rpx |
| `radius-df` | 24rpx |
| `radius-20` | 20rpx |
| `radius-10` | 10rpx |
| `round` | 5000rpx (正圆) |

### 4. 字体类

| 类名 | 大小 |
|------|------|
| `text-xs` | 20rpx |
| `text-sm` | 24rpx |
| `text-26` | 26rpx |
| `text-df` | 28rpx |
| `text-lg` | 32rpx |
| `text-xl` | 36rpx |
| `text-xxl` | 40rpx |
| `text-xxxl` | 44rpx |

字重：`text-100` ~ `text-800`

### 5. 颜色类

| 背景色 | 文字色 |
|--------|--------|
| `bg-df-color` | `text-df-color` |
| `bg-red` | `text-red` |
| `bg-orange` | `text-orange` |
| `bg-yellow` | `text-yellow` |
| `bg-green` | `text-green` |
| `bg-cyan` | `text-cyan` |
| `bg-blue` | `text-blue` |
| `bg-purple` | `text-purple` |
| `bg-grey` | `text-grey` |
| `bg-gray` | `text-gray` |
| `bg-gray-2` | `text-gray-2` |
| `bg-gray-3` | `text-gray-3` |
| `bg-black` | `text-black` |
| `bg-white` | `text-white` |

### 6. Flex布局类 (base.scss)

| 类名 | 说明 |
|------|------|
| `flex` | display: flex |
| `flex-row` | row + align-center |
| `flex-row-between` | row + between + align-center |
| `flex-column` | column |
| `flex-column-between` | column + between |
| `flex-sub` | flex: 1 |
| `flex-twice` | flex: 2 |
| `flex-treble` | flex: 3 |
| `flex-grow-1` | flex-grow: 1 |
| `flex-shrink-zero` | flex-shrink: 0 |
| `align-start` / `align-center` / `align-end` / `align-stretch` | align-items |
| `justify-start` / `justify-center` / `justify-end` / `justify-between` / `justify-around` | justify-content |
| `self-start` / `self-center` / `self-end` / `self-stretch` | align-self |

### 7. 文本工具类

| 类名 | 说明 |
|------|------|
| `text-center` / `text-left` / `text-right` | 对齐 |
| `text-bold` | 加粗 |
| `text-hidden` | 单行省略 |
| `text-hidden-2` / `text-hidden-3` | 多行省略 |
| `text-content` | line-height: 1.6 |
| `text-decoration-lt` | 中划线 |
| `text-decoration-ul` | 下划线 |

### 8. 边框与工具类

| 类名 | 说明 |
|------|------|
| `border` / `border-top` / `border-bottom` / `border-left` / `border-right` | 边框 |
| `w100` / `h100` | 宽高100% |
| `status-box` | 状态栏占位 |
| `bubbling-check` | 伪元素冒泡扩大点击区域 |

## 示例代码

### 卡片布局示例
```vue
<template>
  <view class="card-box margin-lg padding-lg bg-white radius-df shadow-df">
    <view class="card-header flex-row-between margin-bottom-sm">
      <text class="text-lg text-bold">标题</text>
      <text class="text-sm text-gray">更多</text>
    </view>
    <view class="card-body flex-row">
      <view class="avatar box-size-xs-40 radius round bg-gray"></view>
      <view class="info flex-sub margin-left-sm">
        <text class="text-df text-bold text-hidden">内容标题</text>
        <text class="text-sm text-gray-2 text-hidden-2">内容描述...</text>
      </view>
    </view>
  </view>
</template>
```

### 列表项示例
```vue
<template>
  <view class="list-item flex-row-between padding margin-bottom-sm bg-white radius-df">
    <view class="left flex-row align-center">
      <view class="icon box-size-xs-32 radius-sm bg-blue flex align-center justify-center">
        <text class="cuIcon-locationfill text-white text-sm"></text>
      </view>
      <text class="text-df margin-left-sm text-hidden flex-sub">列表项标题</text>
    </view>
    <text class="cuIcon-right text-gray text-sm"></text>
  </view>
</template>
```

## 注意事项/踩坑记录

1. **尺寸计算**：`box-size-*` 类名的数值是实际 rpx 的一半，如 `box-size-w-50` = 100rpx
2. **优先级**：原子化类与自定义样式冲突时，注意 CSS 优先级
3. **组合使用**：多个原子化类可以组合使用，如 `flex-row-between margin-lg padding-df`
4. **自定义补充**：原子化类无法覆盖的场景，在 `.page-content` 内编写自定义 SCSS

## 相关 skill
- [页面生成规范](./page-generation.md)
- [组件使用规范](./components.md)
