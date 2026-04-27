---
title: 验证码倒计时 Hook 封装
category: uniapp-vue3
tags: [hook, countdown, sms, vue3]
created: 2026-04-26
---

# 验证码倒计时 Hook 封装

## 问题/场景
在登录、注册、修改手机号等页面，需要实现"获取验证码"按钮的倒计时功能，包括：
- 点击后禁用按钮并开始倒计时
- 倒计时期间显示剩余秒数
- 倒计时结束后恢复可点击状态
- 页面卸载时清理定时器

## 核心要点

### 1. Hook 设计思路
- 使用 Vue3 Composition API 封装
- 返回 `sendCode` 方法、`downTimeStr` 显示文本、`isCounting` 倒计时状态
- 内部管理定时器和倒计时状态
- 组件卸载时自动清理定时器

### 2. 使用方式

```javascript
// 页面中使用
import useCountDown from '@/common/utils/useCountDown.js';

const { sendCode, downTimeStr, isCounting } = useCountDown(60);

// 模板中绑定 - 基础用法
<view @click="handleSendCode">{{downTimeStr}}</view>

// 模板中绑定 - 带禁用状态样式
<view 
  :class="{ 'code-btn-disabled': isCounting }" 
  @click="handleSendCode"
>{{downTimeStr}}</view>

// 发送验证码
function handleSendCode() {
  sendCode(formData.mobile, 'mobilelogin');
}
```

### 3. 完整实现代码

```javascript
import { ref, onUnmounted, computed } from 'vue';
import { validate } from '@/common/utils/validate';
import { toast, loading } from '@/common/utils/util.js';
import { http, urls } from '@/common/api/index.js';

/**
 * 获取验证码倒计时
 * @param {number} duration - 倒计时的总时长（秒），默认 60
 * @returns {Object} - 返回 { sendCode, downTimeStr, isCounting }
 */
export default function useCountDown(duration = 60) {
  const countDown = ref(0);
  let timer = null;
  const downTimeStr = ref('获取验证码');

  // 组件卸载时清理定时器
  onUnmounted(() => {
    if (timer) {
      clearInterval(timer);
    }
  });

  /**
   * 开始倒计时
   */
  const start = () => {
    if (timer) clearInterval(timer);
    countDown.value = duration;
    downTimeStr.value = `${countDown.value}s后重新获取`;
    
    timer = setInterval(() => {
      if (countDown.value > 0) {
        countDown.value--;
        downTimeStr.value = `${countDown.value}s后重新获取`;
      } else {
        downTimeStr.value = '重新发送';
        clearInterval(timer);
      }
    }, 1000);
  };

  /**
   * 发送验证码
   * @param {string|number} mobile - 手机号
   * @param {string} event - 事件名称（如 'mobilelogin'）
   * @returns {Promise}
   */
  function sendCode(mobile, event = 'mobilelogin') {
    // 倒计时中直接返回提示
    if (countDown.value > 0) {
      return toast(downTimeStr.value);
    }
    
    // 表单校验
    if (!validate(mobile, 'null')) {
      return toast('请输入手机号');
    }
    if (!validate(mobile, 'phone')) {
      return toast('手机号格式错误');
    }

    return new Promise((resolve, reject) => {
      loading('发送中...');
      const data = { mobile, event };
      
      http.post(urls.user.sendSms, data)
        .then(res => {
          uni.hideLoading();
          if (res.code === 200) {
            start();  // 发送成功开始倒计时
            toast('发送成功', 'success');
          }
          resolve(res);
        })
        .catch(err => {
          uni.hideLoading();
          toast(`请求错误：` + (err.msg || err.message));
          reject(err);
        });
    });
  }

  return {
    sendCode,
    downTimeStr,
    isCounting: computed(() => countDown.value > 0)
  };
}
```

## 注意事项/踩坑记录

1. **定时器清理**：必须在 `onUnmounted` 中清理定时器，避免内存泄漏
2. **重复点击防护**：倒计时期间再次点击应给出提示，而不是重新发送
3. **手机号校验**：发送前必须校验手机号格式，避免无效请求
4. **Promise 返回**：`sendCode` 返回 Promise，便于页面做后续处理
5. **加载状态**：发送请求时显示 loading，提升用户体验
6. **视觉反馈**：使用 `isCounting` 控制按钮禁用样式，倒计时期间变灰提示用户

## 适用场景

| 场景 | 说明 |
|------|------|
| 手机号登录 | 发送短信验证码登录 |
| 用户注册 | 注册时验证手机号 |
| 修改手机号 | 更换绑定手机号验证 |
| 密码找回 | 通过手机号找回密码 |

## 相关 skill

- [表单书写规范](./form.md)
- [接口调用规范](./api-request.md)
- [工具函数使用规范](./utils.md)
