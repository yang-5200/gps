---
title: uview-plus 组件使用规范
category: uniapp-vue3
tags: [uniapp, vue3, components, uview-plus]
created: 2026-04-27
---

# uview-plus 组件使用规范

## 问题/场景
在 uni-app + Vue3 项目中，需要使用 uview-plus UI 框架的组件，了解常用组件的用法、Props 和事件。

## 核心要点

### 1. 引入方式
通过 easycom 自动引入，前缀 `u-` / `up-` / `u--`，无需手动 import。

### 2. 常用组件列表

| 组件 | 用途 |
|------|------|
| `u-button` | 按钮 |
| `u-input` | 输入框 |
| `u-form` | 表单容器 |
| `u-form-item` | 表单项 |
| `u-cell` | 单元格 |
| `u-icon` | 图标 |
| `u-tabs` | 标签页 |
| `u-swiper` | 轮播图 |
| `u-loadmore` | 加载更多 |
| `u-empty` | 空状态 |
| `u-toast` | 轻提示 |
| `u-modal` | 模态框 |
| `u-popup` | 弹出层 |
| `u-action-sheet` | 动作面板 |
| `u-upload` | 文件上传 |
| `u-picker` | 选择器 |

## 示例代码

### u-form + u-form-item 表单组件

```vue
<template>
  <u-form :model="formData" :rules="rules" ref="formRef">
    <u-form-item label="手机号" prop="mobile">
      <u-input v-model="formData.mobile" placeholder="请输入手机号" />
    </u-form-item>
    <u-form-item label="密码" prop="password">
      <u-input v-model="formData.password" type="password" placeholder="请输入密码" />
    </u-form-item>
  </u-form>
  <u-button type="primary" @click="submit">提交</u-button>
</template>

<script setup>
import { ref, reactive } from 'vue';

const formRef = ref(null);
const formData = reactive({
  mobile: '',
  password: ''
});

const rules = {
  mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};

function submit() {
  formRef.value.validate().then(() => {
    // 验证通过
  });
}
</script>
```

### u-picker 选择器组件

单列选择器，用于证件类型、性别等选项选择场景。

**Props:**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `show` | Boolean | false | 是否显示选择器 |
| `columns` | Array | [] | 列数据，二维数组格式 `[options]` |
| `keyName` | String | 'text' | 选项对象中显示文字的字段名 |
| `closeOnClickOverlay` | Boolean | true | 是否允许点击遮罩关闭 |
| `visibleItemCount` | Number | 5 | 可见选项数量 |
| `defaultIndex` | Array | [0] | 默认选中项索引 |
| `cancelText` | String | '取消' | 取消按钮文字 |
| `confirmText` | String | '确认' | 确认按钮文字 |

**Events:**

| 事件 | 说明 | 回调参数 |
|------|------|----------|
| `confirm` | 点击确认 | `{ value: [选中项], indexs: [索引] }` |
| `cancel` | 点击取消 | - |
| `close` | 选择器关闭 | - |
| `change` | 选项变化 | `{ value: [选中项], indexs: [索引] }` |

**使用示例:**

```vue
<template>
  <view class="form-item" @click="showIdTypePicker">
    <text class="form-label">证件类型</text>
    <view class="flex-1 flex-row justify-end align-center">
      <text :class="formData.idType ? 'text-black' : 'text-gray'">
        {{ formData.idType || '请选择证件类型' }}
      </text>
      <u-icon name="arrow-right" color="#999" size="14" class="margin-left-sm"></u-icon>
    </view>
  </view>

  <!-- 证件类型选择器 -->
  <u-picker
    :show="showPicker"
    :columns="[idTypeOptions]"
    keyName="label"
    @confirm="onIdTypeConfirm"
    @cancel="showPicker = false"
  ></u-picker>
</template>

<script setup>
import { ref, reactive } from 'vue';

// 选择器显示状态
const showPicker = ref(false);

// 表单数据
const formData = reactive({
  idType: '',
  idValue: ''
});

// 选项数据（label显示文字，value提交值）
const idTypeOptions = [
  { label: '身份证', value: 'id_card' },
  { label: '护照', value: 'passport' },
  { label: '港澳居民来往内地通行证', value: 'hk_macau_pass' },
  { label: '台湾居民来往大陆通行证', value: 'tw_pass' },
  { label: '外国人永久居留身份证', value: 'foreigner_id' }
];

// 显示选择器
const showIdTypePicker = () => {
  showPicker.value = true;
};

// 确认选择
const onIdTypeConfirm = (e) => {
  formData.idType = e.value[0].label;  // 显示用label
  formData.idValue = e.value[0].value; // 提交用value
  showPicker.value = false;
};
</script>
```

## 注意事项/踩坑记录

1. **u-picker 数据格式**: `columns` 需要是二维数组 `[options]`，即使只有一列也要包裹一层
   - ✅ `:columns="[idTypeOptions]"`
   - ❌ ~~`:columns="idTypeOptions"`~~

2. **u-picker 事件回调**: `confirm` 事件返回的 `e.value` 是数组，需要取 `e.value[0]` 获取选中项
   - ✅ `e.value[0].label`
   - ❌ ~~`e.value.label`~~

3. **组件前缀**: uview-plus 组件前缀为 `u-`, `up-`, `u--`

4. **easycom 自动引入**: uview-plus 组件无需手动 import

## 相关 skill
- [cu-components 自定义组件使用规范](./cu-components.md)
- [Picker 选择器组件使用规范](./picker-components.md)
- [表单书写规范](./form.md)
- [原子化 CSS 使用规范](./atomic-css.md)
