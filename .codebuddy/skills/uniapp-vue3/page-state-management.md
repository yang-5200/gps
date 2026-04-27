---
title: Vue3 组合式函数在 UniApp 中的页面状态管理
category: uniapp-vue3
tags: [vue3, composition-api, state, lifecycle, pinia]
created: 2026-04-26
---

# Vue3 组合式函数在 UniApp 中的页面状态管理

## 问题/场景
在 UniApp 页面中，需要管理页面状态（如表单数据、加载状态），并处理页面生命周期（加载、显示、卸载），同时与全局状态（Pinia Store）进行交互。

## 核心要点

### 1. 状态定义规范

#### 页面局部状态
```javascript
import { ref } from 'vue'

// 表单数据
const name = ref('')
const phoneNum = ref('')

// 加载状态
const isLoading = ref(false)
const isSubmitting = ref(false)
```

#### 全局状态（Pinia Store）
```javascript
import { useUserStore } from '@/stores/user.js'

const userStore = useUserStore()
// 直接访问：userStore.userInfo.nickname
```

### 2. 数据刷新函数

**封装数据刷新逻辑，便于多处调用：**

```javascript
// 刷新用户数据
const refreshUserData = () => {
  name.value = userStore.userInfo.nickname
  phoneNum.value = userStore.userInfo.mobile
}
```

### 3. 生命周期管理

#### 页面加载时（onLoad）
```javascript
import { onLoad } from '@dcloudio/uni-app'

onLoad(() => {
  // 初始化数据
  refreshUserData()
  
  // 注册事件监听
  uni.$on('someEvent', handleEvent)
})
```

#### 页面显示时（onShow）
```javascript
import { onShow } from '@dcloudio/uni-app'

onShow(() => {
  // 从其他页面返回时刷新数据
  refreshUserData()
})
```

**使用场景：**
- 用户从编辑页返回，需要显示最新数据
- 从后台切换到前台，需要刷新状态

#### 页面卸载时（onUnload）
```javascript
import { onUnload } from '@dcloudio/uni-app'

onUnload(() => {
  // 清理工作：移除事件监听
  uni.$off('someEvent', handleEvent)
})
```

### 4. 完整示例

```vue
<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user.js'
import { onLoad, onShow, onUnload } from '@dcloudio/uni-app'

// ========== 状态定义 ==========

// 全局状态
const userStore = useUserStore()

// 页面局部状态
const name = ref('')
const phoneNum = ref('')
const isLoading = ref(false)

// ========== 数据操作 ==========

// 刷新用户数据（从 Store 同步到页面）
const refreshUserData = () => {
  name.value = userStore.userInfo.nickname || ''
  phoneNum.value = userStore.userInfo.mobile || ''
}

// 保存数据（从页面同步到 Store 或服务器）
const saveUserData = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  try {
    const res = await http.post(urls.user.profile, {
      nickname: name.value,
      mobile: phoneNum.value
    })
    
    if (res.code === 1) {
      toast('保存成功', 'success')
      // 刷新 Store 数据
      await userStore.getUserInfo()
    }
  } finally {
    isLoading.value = false
  }
}

// ========== 生命周期 ==========

onLoad(() => {
  // 首次加载：初始化数据
  refreshUserData()
  
  // 注册全局事件
  uni.$on('userDataUpdated', refreshUserData)
})

onShow(() => {
  // 页面显示：刷新数据（处理从编辑页返回的场景）
  refreshUserData()
})

onUnload(() => {
  // 页面卸载：清理事件监听
  uni.$off('userDataUpdated', refreshUserData)
})
</script>
```

### 5. 状态流转图

```
┌─────────────────────────────────────────────────────────┐
│  Pinia Store (全局状态)                                  │
│  - userInfo.nickname                                     │
│  - userInfo.mobile                                       │
└──────────────┬──────────────────────────────────────────┘
               │
               │ onLoad / onShow / 手动刷新
               ▼
┌─────────────────────────────────────────────────────────┐
│  页面局部状态 (ref)                                      │
│  - name.value                                            │
│  - phoneNum.value                                        │
└──────────────┬──────────────────────────────────────────┘
               │
               │ 用户编辑
               ▼
┌─────────────────────────────────────────────────────────┐
│  表单输入                                                │
│  - v-model="name"                                        │
│  - v-model="phoneNum"                                    │
└──────────────┬──────────────────────────────────────────┘
               │
               │ 点击保存
               ▼
┌─────────────────────────────────────────────────────────┐
│  提交到服务器 → 刷新 Store → 页面状态同步                  │
└─────────────────────────────────────────────────────────┘
```

## 注意事项

1. **初始化时机**：`onLoad` 中做一次性初始化，`onShow` 中做数据刷新
2. **空值处理**：从 Store 取数据时做好默认值处理 `userStore.userInfo.nickname || ''`
3. **状态同步**：修改数据后，先更新服务器，再刷新 Store，最后同步到页面
4. **防抖节流**：频繁操作时使用防抖/节流，避免重复提交
5. **类型一致**：ref 的初始值类型与赋值类型保持一致

## 常见错误

```javascript
// ❌ 错误：类型不一致
const phoneNum = ref()        // undefined
phoneNum.value = '13800138000' // 赋值为字符串

// ✅ 正确：统一类型
const phoneNum = ref('')      // 空字符串
phoneNum.value = '13800138000'
```

```javascript
// ❌ 错误：忘记在 onShow 刷新
onLoad(() => {
  refreshUserData()
})
// 从编辑页返回时，数据不会更新

// ✅ 正确：onShow 中刷新
onShow(() => {
  refreshUserData()
})
```

## 相关 Skill

- [表单数据回显与状态管理](./form-data-echo.md)
- [跨页面数据传递](./cross-page-data-transfer.md)
- [接口调用规范](./api-request.md)
