# cu-page-footer 页脚组件

一个灵活的页脚组件，支持固定定位、占位和安全区适配。

## 使用方法

```vue
<template>
  <!-- 基础用法 -->
  <cu-page-footer>
    <view>页脚内容</view>
  </cu-page-footer>

  <!-- 固定在底部 -->
  <cu-page-footer :is-fixed="true">
    <view>固定在底部的页脚</view>
  </cu-page-footer>

  <!-- 固定在底部但不占位 -->
  <cu-page-footer :is-fixed="true" :placeholder="false">
    <view>固定在底部但不占位的页脚</view>
  </cu-page-footer>

  <!-- 不适配安全区 -->
  <cu-page-footer :safe-area-inset-bottom="false">
    <view>不适配安全区的页脚</view>
  </cu-page-footer>

  <!-- 自定义背景色 -->
  <cu-page-footer background="#f5f5f5">
    <view>自定义背景色的页脚</view>
  </cu-page-footer>
</template>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| isFixed | 是否固定在底部 | Boolean | false |
| placeholder | 固定时是否占位 | Boolean | true |
| safeAreaInsetBottom | 是否适配底部安全区 | Boolean | true |
| background | 背景颜色 | String | #FFFFFF |

## 功能特点

1. 支持固定定位：通过 `isFixed` 属性控制是否固定在页面底部
2. 智能占位：固定定位时可通过 `placeholder` 属性控制是否在原位置保留占位元素
3. 自动高度：占位高度根据内容自动计算
4. 安全区适配：支持底部安全区适配，可通过 `safeAreaInsetBottom` 属性控制
5. 背景色配置：支持自定义背景色，通过 `background` 属性设置

## 注意事项

1. 当使用固定定位时，组件会自动计算内容高度并创建相应的占位元素
2. 底部安全区适配主要用于适配全面屏手机，避免内容被物理按键遮挡
3. 背景色支持任何有效的 CSS 颜色值，包括：
   - 颜色关键字：`white`、`transparent` 等
   - HEX 值：`#FFFFFF`
   - RGB/RGBA 值：`rgb(255, 255, 255)`、`rgba(255, 255, 255, 0.5)` 