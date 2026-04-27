---
title: UniApp Vue3 表单书写规范
category: uniapp-vue3
tags: [uniapp, vue3, form, input, uview-plus]
created: 2026-04-26
---

# UniApp Vue3 表单书写规范

## 问题/场景
在 uni-app + Vue3 项目中，表单是最常见的交互元素，需要统一的样式和交互规范。

## 核心要点

### 1. 表单结构原则
- 使用 `padding` 和 `margin` 控制间距
- 使用 `flex` 布局排列元素
- 输入框高度通过容器 `padding` 或 `box-size-h-{n}` 控制
- 按钮使用 `button.btn` 类
- 表单验证使用 `u-form` + `u-form-item` (uview-plus)

### 2. 表单基础结构

```vue
<template>
  <view class="form-box padding-lr margin-lr-lg">
    <view class="form-item">
      <view class="input-box padding-lr-sm flex align-center box-size-h-49 bg-white radius-df shadow-df">
        <!-- <image class="icon box-size-18" src="" mode=""></image> -->
        <input
          class="text-df flex-grow-1 padding-lr-xs"
          type="text"
          v-model="formData.mobile"
          placeholder="请输入手机号"
          placeholder-class="text-gray"
        />
      </view>
    </view>
  </view>
</template>
```

## 示例代码

### 登录表单示例

```vue
<template>
  <view class="page-wrap">
    <view class="page-content">
      <!-- 表单区域 -->
      <view class="form-box padding-lr margin-top-xl">
        <!-- 手机号 -->
        <view class="form-item margin-bottom">
          <view class="input-box padding-lr-sm flex align-center box-size-h-49 bg-white radius-df">
            <text class="cuIcon-mobile text-gray text-lg"></text>
            <input
              class="text-df flex-grow-1 padding-lr-sm"
              type="number"
              v-model="formData.mobile"
              placeholder="请输入手机号"
              placeholder-class="text-gray"
              maxlength="11"
            />
          </view>
        </view>
        
        <!-- 密码 -->
        <view class="form-item margin-bottom">
          <view class="input-box padding-lr-sm flex align-center box-size-h-49 bg-white radius-df">
            <text class="cuIcon-lock text-gray text-lg"></text>
            <input
              class="text-df flex-grow-1 padding-lr-sm"
              type="password"
              v-model="formData.password"
              placeholder="请输入密码"
              placeholder-class="text-gray"
            />
          </view>
        </view>
        
        <!-- 登录按钮 -->
        <view class="form-item margin-top-xl">
          <button class="btn bg-df-color text-white text-lg" @click="handleLogin">登录</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive } from 'vue';
import { toast } from '@/common/utils/util.js';

const formData = reactive({
  mobile: '',
  password: ''
});

function handleLogin() {
  if (!formData.mobile) {
    toast('请输入手机号');
    return;
  }
  if (!formData.password) {
    toast('请输入密码');
    return;
  }
  // 执行登录
}
</script>

<style lang="scss">
.form-box {
  .input-box {
    border: 1rpx solid #eee;
  }
  
  .btn {
    height: 88rpx;
    line-height: 88rpx;
    border-radius: 44rpx;
  }
}
</style>
```

### 使用 uview-plus 表单验证

```vue
<template>
  <view class="page-wrap">
    <view class="page-content">
      <u-form :model="formData" :rules="rules" ref="formRef" class="padding">
        <u-form-item label="手机号" prop="mobile" borderBottom>
          <u-input
            v-model="formData.mobile"
            placeholder="请输入手机号"
            type="number"
            maxlength="11"
            border="none"
          />
        </u-form-item>
        
        <u-form-item label="密码" prop="password" borderBottom>
          <u-input
            v-model="formData.password"
            placeholder="请输入密码"
            type="password"
            border="none"
          />
        </u-form-item>
      </u-form>
      
      <view class="padding">
        <u-button type="primary" @click="submit">提交</u-button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { toast } from '@/common/utils/util.js';

const formRef = ref(null);

const formData = reactive({
  mobile: '',
  password: ''
});

const rules = {
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ]
};

function submit() {
  formRef.value.validate().then(() => {
    toast('验证通过');
    // 执行提交
  }).catch(errors => {
    console.log('验证失败', errors);
  });
}
</script>
```

### 表单输入框组合

```vue
<template>
  <view class="form-box">
    <!-- 带清除按钮的输入框 -->
    <view class="form-item flex align-center padding-lr bg-white box-size-h-49 border-bottom">
      <text class="label text-df" style="width: 160rpx;">用户名</text>
      <input
        class="flex-grow-1 text-df"
        v-model="formData.username"
        placeholder="请输入用户名"
      />
      <text v-if="formData.username" class="cuIcon-close text-gray" @click="formData.username = ''"></text>
    </view>
    
    <!-- 带发送验证码的输入框 -->
    <view class="form-item flex align-center padding-lr bg-white box-size-h-49 border-bottom">
      <text class="label text-df" style="width: 160rpx;">验证码</text>
      <input
        class="flex-grow-1 text-df"
        v-model="formData.code"
        placeholder="请输入验证码"
        type="number"
        maxlength="6"
      />
      <text class="code-btn text-sm text-blue" @click="sendCode">{{ codeText }}</text>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { toast } from '@/common/utils/util.js';

const formData = reactive({
  username: '',
  code: ''
});

const codeText = ref('获取验证码');
const countdown = ref(0);

function sendCode() {
  if (countdown.value > 0) return;
  
  countdown.value = 60;
  codeText.value = `${countdown.value}s`;
  
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
      codeText.value = '获取验证码';
    } else {
      codeText.value = `${countdown.value}s`;
    }
  }, 1000);
  
  toast('验证码已发送');
}
</script>
```

## 注意事项/踩坑记录

1. **输入框高度**：通过外层容器控制高度，不要直接设置 input 的高度
2. **placeholder 样式**：使用 `placeholder-class` 设置占位符样式
3. **表单验证**：复杂表单使用 `u-form` + `u-form-item`，简单表单手动验证
4. **输入类型**：手机号用 `type="number"`，密码用 `type="password"`
5. **清除按钮**：输入框带清除功能时，注意条件渲染 `v-if`
6. **验证码倒计时**：需要防止重复点击，设置倒计时状态

## 相关 skill
- [组件使用规范](./components.md)
- [原子化 CSS 使用规范](./atomic-css.md)
