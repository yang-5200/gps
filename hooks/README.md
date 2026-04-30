# Hooks 自定义钩子库

包含项目业务相关的自定义 Composition API。

## 📚 目录

- [权限请求 (useAuth.js)](#权限请求-useauthjs)

---

## 权限请求 (useAuth.js)

用于 APP 端动态请求系统权限（位置、存储、相机等），并配合权限说明弹窗使用。

### 核心功能

- ✅ 统一管理权限 ID 和来源类型
- ✅ 配合 `yk-authpup` 组件展示权限使用说明
- ✅ 异步延迟处理，确保弹窗正常唤起

### 基础用法

```vue
<template>
  <view>
    <button @click="handleLocation">获取位置</button>
    
    <!-- 必须在页面中引入权限弹窗组件 -->
    <yk-authpup
      ref="authPupRef"
      :permissionID="permissionID"
      @changeAuth="handleAuthChange"
    />
  </view>
</template>

<script setup>
import { useAuth } from '@/hooks/useAuth.js';

const { 
  authPupRef, 
  permissionID, 
  permissionFromType, 
  openAuth 
} = useAuth();

function handleLocation() {
  // 1. 打开权限说明弹窗
  // 参数1: 权限ID (如 ACCESS_FINE_LOCATION)
  // 参数2: 权限来源/用途描述
  openAuth('ACCESS_FINE_LOCATION', '用于在地图上展示您的实时位置');
}

function handleAuthChange() {
  // 权限状态变更后的逻辑
}
</script>
```

### 支持的权限 ID 示例

| ID | 说明 |
|------|------|
| `ACCESS_FINE_LOCATION` | 精确位置权限 |
| `WRITE_EXTERNAL_STORAGE` | 存储空间/相册权限 |
| `CAMERA` | 相机权限 |
| `CALL_PHONE` | 拨打电话权限 |

---

### 注意事项

1. **组件配合**：`useAuth` 必须配合 `yk-authpup` 组件使用，且组件的 `ref` 必须绑定为 `authPupRef`。
2. **延迟机制**：`openAuth` 内部包含 300ms 延迟，以解决部分平台下弹窗层级冲突问题。
