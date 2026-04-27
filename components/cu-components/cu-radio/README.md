# cu-radio 单选框组件

## 介绍
单选框组件，支持不同的显示模式和数据类型，可自定义选中和未选中状态的颜色。

## 基础用法

```vue
<template>
  <cu-radio v-model="checked" @change="onChange">选项1</cu-radio>
</template>

<script setup>
import { ref } from 'vue';

const checked = ref(false);

function onChange(value) {
  //console.log('选中状态:', value);
}
</script>
```

## 不同模式

```vue
<template>
  <!-- 默认模式 -->
  <cu-radio v-model="checked1">默认模式</cu-radio>
  
  <!-- 模式1 -->
  <cu-radio v-model="checked2" mode="1">模式1</cu-radio>
</template>
```

## 自定义颜色

```vue
<template>
  <cu-radio 
    v-model="checked" 
    active-color="#FF6600" 
    inactive-color="#CCCCCC"
  >
    自定义颜色
  </cu-radio>
</template>
```

## 数字类型

```vue
<template>
  <cu-radio v-model="value" is-data-type="num">数字类型</cu-radio>
</template>

<script setup>
import { ref } from 'vue';

const value = ref(0); // 0 表示未选中，1 表示选中
</script>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| v-model | 绑定值 | Boolean/Number | false |
| mode | 显示模式 | String | 'df' |
| isDataType | 数据类型(boo/num) | String | 'boo' |
| activeColor | 选中状态的颜色 | String | 主题色($df-color) |
| inactiveColor | 未选中状态的颜色 | String | #999 |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 值更新时触发 | 新的值 |
| change | 值变化时触发 | 新的值 |

### Methods

| 方法名 | 说明 | 参数 |
|--------|------|------|
| setChecked | 设置选中状态 | value: Boolean |

## 注意事项

1. 当 isDataType 为 'num' 时：
   - 未选中状态值为 0
   - 选中状态值为 1

2. mode 支持两种模式：
   - df: 默认模式
   - 1: 白色背景模式

3. 颜色配置：
   - activeColor 为空时会使用主题色变量
   - 可以使用任何有效的 CSS 颜色值（如 #FF0000、rgba(255,0,0,0.5)、red 等） 