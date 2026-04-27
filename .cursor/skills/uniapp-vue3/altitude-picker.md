---
title: 海拔选择器组件
category: uniapp-vue3
tags: [component, picker, form, altitude]
created: 2026-04-26
---

# 海拔选择器组件

## 问题/场景

在低空飞行/无人机作业应用中，需要让用户选择作业海拔高度。海拔是飞行安全的关键参数，需要：
- 限定合理范围（10m ~ 5000m）
- 提供直观的滚轮选择体验
- 支持精度控制（10m 步进）
- 表单数据回显与验证

## 核心要点

### 1. 组件设计

- **三列滚轮选择器**：千位 + 百位 + 十位
- **范围限制**：最小 10m，最大 5000m
- **精度**：10m 步进（十位显示 "X0 m"）
- **底部弹窗**：使用 `u-popup` 组件

### 2. Props 定义

```typescript
interface Props {
  visible: boolean;           // 控制显示/隐藏
  defaultValue: string | number;  // 默认值
}
```

### 3. 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| `confirm` | `{ value: string, result: string }` | 确认选择 |
| `cancel` | - | 取消选择 |
| `update:visible` | boolean | 同步 visible（v-model）|

### 4. 数值转换逻辑

```javascript
// 海拔值 → picker 索引
function valueToPicker(val) {
  const num = parseInt(val) || 0;
  const clamped = Math.max(0, Math.min(5000, num));
  const rounded = Math.round(clamped / 10) * 10;  // 10m 精度
  const thousandIdx = Math.floor(rounded / 1000);
  const hundredIdx = Math.floor((rounded % 1000) / 100);
  const tenIdx = Math.floor((rounded % 100) / 10);
  return [thousandIdx, hundredIdx, tenIdx];
}

// picker 索引 → 海拔值
function pickerToValue(indices) {
  const t = indices[0] || 0;
  const h = indices[1] || 0;
  const d = indices[2] || 0;
  let total = t * 1000 + h * 100 + d * 10;
  if (total > 5000) total = 5000;
  return total;
}
```

### 5. 边界处理

- **最大值限制**：千位选 5 时，百位和十位强制为 0（即 5000m）
- **最小值校验**：确认时不允许选择 0，提示 "请选择有效海拔"
- **自动对齐**：输入值自动按 10m 精度四舍五入

## 示例代码

### 组件使用

```vue
<template>
  <!-- 触发区域 -->
  <view class="form-item" @click="altitudePickerVisible = true">
    <text class="form-label"><text class="text-red">*</text>作业海拔(m)</text>
    <view class="flex-sub text-right">
      <text :class="{ 'text-placeholder-gray': !taskData.altitude }">
        {{ taskData.altitudeLabel || taskData.altitude || '请选择作业海拔' }}
      </text>
    </view>
    <text class="cuIcon-right"></text>
  </view>

  <!-- 海拔选择器 -->
  <altitude-picker
    :visible="altitudePickerVisible"
    :default-value="taskData.altitude"
    @confirm="onAltitudeConfirm"
    @update:visible="altitudePickerVisible = $event"
  />
</template>

<script setup>
import { ref, reactive } from 'vue';

const altitudePickerVisible = ref(false);
const taskData = reactive({
  altitude: '',
  altitudeLabel: ''
});

const onAltitudeConfirm = (e) => {
  taskData.altitude = e.value;      // "100"
  taskData.altitudeLabel = e.result; // "100m"
};
</script>
```

### 组件实现

```vue
<template>
  <u-popup :show="visible" mode="bottom" round="16" @close="onCancel">
    <view class="altitude-picker">
      <view class="picker-header flex align-center justify-between padding-lr-sm">
        <text class="text-df text-grey" @click="onCancel">取消</text>
        <text class="text-df text-black text-bold">请选择海拔</text>
        <text class="text-df text-df-color" @click="onConfirm">确定</text>
      </view>
      <picker-view
        class="picker-view"
        :value="pickerValue"
        @change="onPickerChange"
        indicator-style="height: 88rpx;"
      >
        <!-- 千位列: 0~5 -->
        <picker-view-column>
          <view
            class="picker-item flex align-center justify-center"
            v-for="item in thousandOptions"
            :key="item"
          >
            <text class="text-df">{{ item }}</text>
          </view>
        </picker-view-column>
        <!-- 百位列: 0~9 -->
        <picker-view-column>
          <view
            class="picker-item flex align-center justify-center"
            v-for="item in hundredOptions"
            :key="item"
          >
            <text class="text-df">{{ item }}</text>
          </view>
        </picker-view-column>
        <!-- 十位列: 0~9 -->
        <picker-view-column>
          <view
            class="picker-item flex align-center justify-center"
            v-for="item in tenOptions"
            :key="item"
          >
            <text class="text-df">{{ item }}0 m</text>
          </view>
        </picker-view-column>
      </picker-view>
    </view>
  </u-popup>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  visible: { type: Boolean, default: false },
  defaultValue: { type: [String, Number], default: '' }
});

const emit = defineEmits(['update:visible', 'confirm', 'cancel']);

const thousandOptions = [0, 1, 2, 3, 4, 5];
const hundredOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const tenOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const pickerValue = ref([0, 1, 0]); // 默认 100m

// 监听 visible 变化，打开时初始化
watch(() => props.visible, (val) => {
  if (val && props.defaultValue) {
    pickerValue.value = valueToPicker(props.defaultValue);
  }
});

const onPickerChange = (e) => {
  let indices = [...e.detail.value];
  // 限制: 千位=5时百位和十位均为0 (最大5000m)
  if (indices[0] === 5 && (indices[1] > 0 || indices[2] > 0)) {
    indices = [5, 0, 0];
  }
  pickerValue.value = indices;
};

const onConfirm = () => {
  const val = pickerToValue(pickerValue.value);
  if (val === 0) {
    uni.showToast({ title: '请选择有效海拔', icon: 'none' });
    return;
  }
  emit('confirm', { value: String(val), result: `${val}m` });
  emit('update:visible', false);
};

const onCancel = () => {
  emit('cancel');
  emit('update:visible', false);
};
</script>
```

## 注意事项

1. **easycom 自动注册**：组件放在 `components/` 目录下，uni-app 会自动注册，无需手动 import

2. **默认值处理**：打开弹窗时根据 `defaultValue` 自动定位到对应位置

3. **表单验证**：
   - 必填项标记红色星号 `<text class="text-red">*</text>`
   - 未选择时显示占位文字 "请选择作业海拔"
   - 确认时校验不能为 0

4. **样式规范**：
   - 使用原子化 CSS 类（`flex`, `align-center`, `justify-between` 等）
   - 高度使用 rpx 单位（`88rpx`, `100rpx`, `480rpx`）

## 相关 skill

- [表单书写规范](./form.md)
- [表单数据回显与状态管理](./form-data-echo.md)
- [组件使用规范](./components.md)
