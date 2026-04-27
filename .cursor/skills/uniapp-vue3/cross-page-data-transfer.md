---
title: 跨页面数据传递（本地存储方案）
category: uniapp-vue3
tags: [storage, cross-page, data-transfer]
created: 2026-04-26
---

# 跨页面数据传递（本地存储方案）

## 问题/场景
在 uni-app 中，当需要在多个页面之间共享数据（如分步填写表单），但又不适合使用全局状态管理（Pinia）时，可以使用本地存储作为临时数据传递方案。

## 核心要点

### 1. 数据存储（页面 A）
```javascript
// 将数据序列化后存储
const data = {
  legal_person_name: '张三',
  legal_person_phone: '13800138000',
  legal_person_card_no: '110101199001011234'
};
uni.setStorageSync('legal_person_info', JSON.stringify(data));
```

### 2. 数据读取（页面 B）
```javascript
// 在 onLoad 或初始化时读取
function loadLegalInfo() {
  try {
    const savedInfo = uni.getStorageSync('legal_person_info');
    if (savedInfo) {
      const legalInfo = JSON.parse(savedInfo);
      // 赋值给表单数据
      formData.legal_person_name = legalInfo.legal_person_name || '';
      formData.legal_person_phone = legalInfo.legal_person_phone || '';
    }
  } catch (error) {
    console.error('读取数据失败', error);
  }
}
```

### 3. 数据清理（onUnload）
```javascript
onUnload(() => {
  // 页面卸载时清理临时数据
  uni.removeStorageSync('legal_person_info');
});
```

## 示例代码

### 页面 A：设置数据并跳转
```vue
<script setup>
import { reactive } from 'vue';
import { toPath } from '@/common/utils/util.js';

const formData = reactive({
  name: '',
  phone: ''
});

function saveAndNext() {
  // 保存到本地存储
  uni.setStorageSync('step1_data', JSON.stringify(formData));
  
  // 跳转到下一步
  toPath({
    path: '/pages/form/step2'
  });
}
</script>
```

### 页面 B：读取并合并数据
```vue
<script setup>
import { reactive, onMounted } from 'vue';
import { onLoad, onUnload } from '@dcloudio/uni-app';

const formData = reactive({
  // 页面 A 的数据
  name: '',
  phone: '',
  // 页面 B 的数据
  address: '',
  detail: ''
});

// 加载页面 A 的数据
function loadStep1Data() {
  const step1Data = uni.getStorageSync('step1_data');
  if (step1Data) {
    const parsed = JSON.parse(step1Data);
    Object.assign(formData, parsed);
  }
}

onLoad(() => {
  loadStep1Data();
});

onUnload(() => {
  // 清理临时数据
  uni.removeStorageSync('step1_data');
});

// 提交时合并所有数据
async function handleSubmit() {
  const res = await http.post(urls.submit, formData);
  if (res.code === 1) {
    // 提交成功后清理
    uni.removeStorageSync('step1_data');
  }
}
</script>
```

## 注意事项

| 注意点 | 说明 |
|--------|------|
| 数据序列化 | 存储前必须用 `JSON.stringify`，读取后用 `JSON.parse` |
| 异常处理 | 使用 try-catch 包裹，防止解析失败导致页面崩溃 |
| 及时清理 | 在 `onUnload` 或提交成功后清理，避免数据残留 |
| 数据覆盖 | 如果先调接口获取已有数据，再用本地缓存覆盖，确保用户最新输入优先 |
| 存储容量 | 本地存储有容量限制（通常 10MB），不要存储大量数据 |

## 适用场景

- ✅ 分步表单填写（如企业认证分多页）
- ✅ 临时数据传递（不适合放 Pinia 的临时状态）
- ✅ 页面刷新后需要保留的草稿数据

## 不适用场景

- ❌ 全局共享状态（用 Pinia）
- ❌ 敏感信息（本地存储不安全）
- ❌ 大量数据（受容量限制）

## 相关 skill
- [表单书写规范](./form.md)
- [接口调用规范](./api-request.md)
