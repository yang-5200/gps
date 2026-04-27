---
title: Picker 选择器组件使用规范
category: uniapp-vue3
tags: [uniapp, vue3, components, picker, form]
created: 2026-04-27
---

# Picker 选择器组件使用规范

## 问题/场景
在 uni-app + Vue3 项目中，需要使用各种 Picker 选择器组件处理日期、时间、地区、联动等选择场景。

## 核心要点

### 1. 引入方式
Picker 组件通过 easycom 自动引入，无需手动 import。

### 2. 组件列表

| 组件 | 用途 |
|------|------|
| `cu-picker` | 基础选择器 |
| `date-picker` | 日期选择 |
| `time-picker` | 时间选择 |
| `range-picker` | 范围选择 |
| `region-picker` | 地区选择 |
| `region-picker2` | 地区选择v2 |
| `selector-picker` | 单列选择 |
| `linkage-picker` | 联动选择 |
| `half-picker` | 半天选择 |
| `shortterm-picker` | 短期选择 |

### 3. 与 uview-plus 的 u-picker 区别

| 特性 | cu-picker / Picker 组件 | u-picker (uview-plus) |
|------|------------------------|----------------------|
| 来源 | 项目自定义 | uview-plus 框架 |
| 前缀 | `cu-picker`, `date-picker` 等 | `u-picker` |
| 适用场景 | 复杂选择、自定义业务逻辑 | 简单单列/多列选择 |
| 数据格式 | 根据组件不同 | `columns` 二维数组 |

## 示例代码

### date-picker 日期选择器

```vue
<template>
  <view class="form-item" @click="showDatePicker = true">
    <text class="form-label">出生日期</text>
    <text :class="formData.birthday ? 'text-black' : 'text-gray'">
      {{ formData.birthday || '请选择出生日期' }}
    </text>
  </view>
  
  <date-picker
    v-model="showDatePicker"
    @confirm="onDateConfirm"
  />
</template>

<script setup>
import { ref, reactive } from 'vue';

const showDatePicker = ref(false);
const formData = reactive({
  birthday: ''
});

function onDateConfirm(date) {
  formData.birthday = date;
}
</script>
```

### region-picker 地区选择器

```vue
<template>
  <view class="form-item" @click="showRegionPicker = true">
    <text class="form-label">所在地区</text>
    <text :class="formData.region ? 'text-black' : 'text-gray'">
      {{ formData.region || '请选择所在地区' }}
    </text>
  </view>
  
  <region-picker
    v-model="showRegionPicker"
    @confirm="onRegionConfirm"
  />
</template>

<script setup>
import { ref, reactive } from 'vue';

const showRegionPicker = ref(false);
const formData = reactive({
  region: '',
  province: '',
  city: '',
  district: ''
});

function onRegionConfirm(region) {
  formData.region = region.name;
  formData.province = region.province;
  formData.city = region.city;
  formData.district = region.district;
}
</script>
```

### linkage-picker 联动选择器

```vue
<template>
  <view class="form-item" @click="showLinkagePicker = true">
    <text class="form-label">选择类别</text>
    <text :class="formData.category ? 'text-black' : 'text-gray'">
      {{ formData.category || '请选择类别' }}
    </text>
  </view>
  
  <linkage-picker
    v-model="showLinkagePicker"
    :options="categoryOptions"
    @confirm="onLinkageConfirm"
  />
</template>

<script setup>
import { ref, reactive } from 'vue';

const showLinkagePicker = ref(false);
const formData = reactive({
  category: ''
});

const categoryOptions = [
  {
    label: '电子产品',
    value: 'electronics',
    children: [
      { label: '手机', value: 'phone' },
      { label: '电脑', value: 'computer' }
    ]
  },
  {
    label: '服装',
    value: 'clothing',
    children: [
      { label: '男装', value: 'men' },
      { label: '女装', value: 'women' }
    ]
  }
];

function onLinkageConfirm(result) {
  formData.category = result.map(item => item.label).join(' / ');
}
</script>
```

## 注意事项/踩坑记录

1. **区分 Picker 来源**: 
   - 项目自定义 Picker 组件（`date-picker`, `region-picker` 等）
   - uview-plus 的 `u-picker`
   - 根据场景选择合适的选择器

2. **数据格式差异**: 
   - 自定义 Picker 通常直接返回字符串或对象
   - u-picker 返回 `{ value: [], indexs: [] }` 格式

3. **显示控制**: 
   - 自定义 Picker 通常使用 `v-model` 控制显示
   - u-picker 使用 `:show` 属性控制

## 相关 skill
- [cu-components 自定义组件使用规范](./cu-components.md)
- [uview-plus 组件使用规范](./uview-plus-components.md)
- [表单书写规范](./form.md)
- [原子化 CSS 使用规范](./atomic-css.md)
