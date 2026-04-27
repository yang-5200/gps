---
title: 表单数据回显与状态管理
category: uniapp-vue3
tags: [form, data-echo, edit-mode]
created: 2026-04-26
---

# 表单数据回显与状态管理

## 问题/场景
在编辑场景（如修改资料、重新提交被拒的认证），需要：
1. 从接口获取已有数据并回显到表单
2. 支持用户修改后提交
3. 处理本地缓存与接口数据的优先级

## 核心要点

### 1. 数据加载顺序
```
调接口获取已有数据 → 保存到本地存储 → 读取本地缓存覆盖 → 表单回显
```

### 2. 优先级策略
- **接口数据**：作为基础数据，页面加载时获取
- **本地缓存**：用户最新输入，优先级更高，覆盖接口数据

### 3. 状态管理
- `authStatus`：认证状态（0未认证/1认证中/2已认证/3认证失败）
- `canShowButton`：根据状态计算是否显示提交按钮
- `hasLegalInfo`：根据数据存在性计算是否已填写

## 示例代码

### 完整的数据回显流程
```vue
<script setup>
import { ref, reactive, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

// 认证状态
const authStatus = ref(0);
const refuseReason = ref('');

// 是否显示提交按钮（未认证或认证失败）
const canShowButton = computed(() => {
  return authStatus.value === 0 || authStatus.value === 3;
});

// 表单数据
const formData = reactive({
  real_name: '',
  company_address: '',
  tax_number: '',
  business_license_image: '',
  // 法人信息
  legal_person_name: '',
  legal_person_phone: '',
  legal_person_card_no: ''
});

// 计算属性：法人信息是否已填写
const hasLegalInfo = computed(() => {
  const name = formData.legal_person_name?.trim();
  const phone = formData.legal_person_phone?.trim();
  const idNo = formData.legal_person_card_no?.trim();
  return !!(name && phone && idNo);
});

/**
 * 从接口获取认证详情
 */
async function getAuthDetail() {
  const res = await http.get(urls.tool.userAuthDetail);
  if (res.code === 1 && res.data) {
    const data = res.data;
    
    // 设置认证状态
    authStatus.value = data.status || 0;
    refuseReason.value = data.verify_remark || '';
    
    // 回显企业信息
    formData.real_name = data.real_name || '';
    formData.company_address = data.company_address || '';
    formData.tax_number = data.tax_number || '';
    formData.business_license_image = data.business_license_image || '';
    
    // 将法人信息保存到本地存储（供子页面使用）
    const legalInfo = {
      legal_person_name: data.legal_person_name,
      legal_person_phone: data.legal_person_phone,
      legal_person_card_no: data.legal_person_card_no
    };
    uni.setStorageSync('legal_person_info', JSON.stringify(legalInfo));
  }
}

/**
 * 从本地存储加载法人信息（用户最新输入）
 */
function loadLegalInfo() {
  try {
    const savedInfo = uni.getStorageSync('legal_person_info');
    if (savedInfo) {
      const legalInfo = JSON.parse(savedInfo);
      // 覆盖表单数据（本地数据优先级更高）
      formData.legal_person_name = legalInfo.legal_person_name || '';
      formData.legal_person_phone = legalInfo.legal_person_phone || '';
      formData.legal_person_card_no = legalInfo.legal_person_card_no || '';
    }
  } catch (error) {
    console.error('读取法人信息失败', error);
  }
}

/**
 * 初始化页面数据
 */
async function initPageData() {
  // 1. 先获取接口数据
  await getAuthDetail();
  // 2. 再用本地缓存覆盖（确保最新用户输入优先）
  loadLegalInfo();
}

onLoad(() => {
  initPageData();
});
</script>
```

### 模板中的状态展示
```vue
<template>
  <view class="page-wrap">
    <!-- 拒绝原因提示（认证失败时显示） -->
    <view v-if="authStatus === 3" class="refuse-tip">
      <text class="text-black">审核拒绝：{{ refuseReason }}</text>
    </view>
    
    <!-- 表单区域 -->
    <view class="form-box">
      <input v-model="formData.real_name" placeholder="企业名称" />
      
      <!-- 法人信息入口 -->
      <view class="card" @click="toLegalPage">
        <text>法人基本信息</text>
        <!-- 根据计算属性显示状态 -->
        <text v-if="hasLegalInfo" class="text-gray">已填写</text>
        <text v-else class="text-placeholder">待填写</text>
      </view>
    </view>
    
    <!-- 提交按钮（条件渲染） -->
    <button v-if="canShowButton" @click="handleSubmit">
      提交
    </button>
  </view>
</template>
```

## 关键技巧

### 1. 计算属性的使用
```javascript
// 复杂的判断逻辑用 computed，保持模板简洁
const hasLegalInfo = computed(() => {
  const { legal_person_name, legal_person_phone, legal_person_card_no } = formData;
  return !!(legal_person_name?.trim() && 
            legal_person_phone?.trim() && 
            legal_person_card_no?.trim());
});
```

### 2. 数据优先级处理
```javascript
// 接口数据作为基础
await getAuthDetail();

// 本地数据覆盖（用户最新输入优先）
loadLegalInfo();
```

### 3. 状态与 UI 联动
```javascript
// 根据状态计算是否显示按钮
const canShowButton = computed(() => {
  return authStatus.value === 0 || authStatus.value === 3; // 未认证或失败
});
```

## 注意事项

| 注意点 | 解决方案 |
|--------|----------|
| 空值处理 | 使用 `|| ''` 确保表单不显示 undefined |
| 异步顺序 | 用 `await` 确保接口数据先加载 |
| 数据同步 | 提交前重新加载本地数据，确保最新 |
| 状态响应 | 使用 computed 让 UI 自动响应状态变化 |

## 相关 skill
- [分步表单填写模式](./multi-step-form.md)
- [跨页面数据传递（本地存储方案）](./cross-page-data-transfer.md)
