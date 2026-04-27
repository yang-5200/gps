---
title: 分步表单填写模式
category: uniapp-vue3
tags: [form, multi-step, wizard]
created: 2026-04-26
---

# 分步表单填写模式

## 问题/场景
当表单字段过多（如企业认证、资质申请），一次性展示所有字段会导致：
- 页面过长，用户体验差
- 信息分组不清晰
- 用户填写压力大

分步表单将字段按逻辑分组，每页填写一部分，最后聚合提交。

## 核心要点

### 1. 页面结构划分
```
企业认证（总入口）
├── 企业基本信息（页面 1）
├── 法人信息（页面 2）
└── 提交审核（汇总提交）
```

### 2. 数据流转方式
```
页面 1 输入 → 本地存储 → 页面 2 输入 → 本地存储 → 页面 1 读取全部 → 提交
```

### 3. 状态提示设计
- 已填写页面显示"已完成"标识
- 未填写页面显示"待填写"提示
- 使用箭头图标引导用户点击

## 示例代码

### 页面 1：企业认证（主页面）
```vue
<template>
  <view class="page-wrap">
    <!-- 企业基本信息表单 -->
    <view class="form-box">
      <input v-model="formData.company_name" placeholder="企业名称" />
      <input v-model="formData.tax_number" placeholder="税号" />
    </view>
    
    <!-- 法人信息入口 -->
    <view class="card-box" @click="toLegalPage">
      <view class="flex justify-between align-center">
        <text class="text-bold">法人基本信息</text>
        <view>
          <!-- 根据状态显示不同提示 -->
          <text v-if="hasLegalInfo" class="text-gray text-26">已填写</text>
          <text v-else class="text-placeholder-gray text-26">待填写</text>
          <text class="cuIcon-right"></text>
        </view>
      </view>
    </view>
    
    <!-- 提交按钮 -->
    <button @click="handleSubmit">提交认证</button>
  </view>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { onLoad, onUnload } from '@dcloudio/uni-app';

const formData = reactive({
  company_name: '',
  tax_number: '',
  // 法人信息（从页面 2 获取）
  legal_person_name: '',
  legal_person_phone: '',
  legal_person_card_no: ''
});

// 计算属性：判断是否已填写法人信息
const hasLegalInfo = computed(() => {
  return !!(formData.legal_person_name && formData.legal_person_phone);
});

// 跳转到法人信息页
function toLegalPage() {
  // 先保存当前页面数据
  uni.setStorageSync('company_info', JSON.stringify({
    company_name: formData.company_name,
    tax_number: formData.tax_number
  }));
  
  toPath({
    path: '/pages/auth/legalInfo'
  });
}

// 加载法人信息（从页面 2 返回时）
function loadLegalInfo() {
  const legalInfo = uni.getStorageSync('legal_person_info');
  if (legalInfo) {
    const parsed = JSON.parse(legalInfo);
    Object.assign(formData, parsed);
  }
}

// 提交前校验
function handleSubmit() {
  // 重新加载法人信息（确保最新）
  loadLegalInfo();
  
  if (!formData.company_name) {
    toast('请输入企业名称');
    return;
  }
  if (!hasLegalInfo.value) {
    toast('请填写法人信息');
    return;
  }
  
  // 提交完整数据
  submitForm(formData);
}

onLoad(() => {
  loadLegalInfo();
});

onUnload(() => {
  uni.removeStorageSync('legal_person_info');
});
</script>
```

### 页面 2：法人信息
```vue
<template>
  <view class="page-wrap">
    <input v-model="formData.legal_person_name" placeholder="法人姓名" />
    <input v-model="formData.legal_person_phone" placeholder="法人电话" />
    <input v-model="formData.legal_person_card_no" placeholder="身份证号" />
    
    <button @click="saveAndBack">保存</button>
  </view>
</template>

<script setup>
import { reactive } from 'vue';
import { back } from '@/common/utils/util.js';

const formData = reactive({
  legal_person_name: '',
  legal_person_phone: '',
  legal_person_card_no: ''
});

function saveAndBack() {
  // 保存到本地存储
  uni.setStorageSync('legal_person_info', JSON.stringify(formData));
  // 返回上一页
  back();
}
</script>
```

## 关键设计决策

| 决策点 | 方案 | 说明 |
|--------|------|------|
| 数据传递 | 本地存储 | 简单直接，页面间解耦 |
| 数据聚合 | 主页面统一提交 | 子页面只保存，不提交 |
| 状态提示 | computed 计算 | 根据数据存在性动态显示 |
| 数据清理 | onUnload | 避免数据残留 |

## 注意事项

1. **数据同步时机**：提交前必须重新 `loadLegalInfo()`，确保获取最新数据
2. **返回刷新**：从子页面返回时，主页面 `onLoad` 不会触发，需要用 `onShow` 或在子页面保存后主动刷新
3. **校验分散**：每个页面的校验在各自页面处理，最终提交前统一校验完整性
4. **用户体验**：提供清晰的步骤提示和返回机制

## 相关 skill
- [跨页面数据传递（本地存储方案）](./cross-page-data-transfer.md)
- [表单书写规范](./form.md)
