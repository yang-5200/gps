---
title: 全局弹窗系统使用规范
category: uniapp-vue3
tags: [uniapp, vue3, popup, modal, dialog]
created: 2026-04-26
---

# 全局弹窗系统使用规范

## 问题/场景
需要显示全局弹窗（如升级提示、确认对话框、视频播放等），要求弹窗可以覆盖所有页面，支持多种展示模式，并能传递回调函数接收用户操作结果。系统支持两种调用方式：App 端通过页面跳转实现，H5/小程序端通过 `cu-popup` 组件直接在页面内展示。

## 核心要点

### 1. 系统架构

全局弹窗系统由三部分组成：

```
pages/pop/index.vue          # 弹窗载体页面（透明背景，压窗屏效果）
├── cu-popup-group.vue       # 弹窗调度组件（根据 mode 渲染不同弹窗）
    ├── pop-modal            # 基础弹窗
    ├── pop-modal2           # 富文本弹窗
    ├── pop-updateapp        # App 更新弹窗
    ├── pop-modal-icon       # 带图标/输入框弹窗
    ├── pop-input-surname    # 姓氏输入弹窗
    └── pop-video            # 视频播放弹窗
```

### 2. 调用方式

通过 `uni.popInfo` 设置弹窗配置，然后跳转到弹窗页面：

```javascript
// 设置弹窗配置
uni.popInfo = {
    mode: 'modal',              // 弹窗类型
    data: {                     // 弹窗数据（各类型不同）
        title: '提示',
        content: '确定要删除吗？',
        showCancel: true
    },
    success: (result) => {      // 回调函数
        console.log('用户操作结果', result);
    },
    isBack: false               // 是否允许返回键关闭
};

// 打开弹窗页面
uni.navigateTo({ url: '/pages/pop/index' });
```

### 3. cu-popup 组件封装（推荐用法）

实际业务中通常**不直接操作 `uni.popInfo`**，而是通过 `cu-popup` 组件来调用弹窗。`cu-popup` 内部封装了平台差异处理，并自动管理 `cu-popup-group` 的调度。

#### 组件关系

```
cu-popup（外层调度组件，页面中直接使用）
  └── cu-popup-group（内层弹窗容器，根据 mode 分发到具体弹窗子组件）
        ├── pop-modal
        ├── pop-modal2
        ├── pop-updateapp
        ├── pop-modal-icon
        ├── pop-input-surname
        └── pop-video
```

- **`cu-popup`**：对外暴露的入口组件，负责处理平台差异（App 端走页面跳转，H5/小程序端走组件内显示）和对外 API 统一
- **`cu-popup-group`**：弹窗内容的容器和分发器，根据 `mode` 属性通过 `v-if` 动态渲染不同的弹窗子组件（策略模式），新增弹窗类型只需添加对应子组件

#### cu-popup Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `mode` | String | `''` | 弹窗类型，对应 cu-popup-group 中的 mode（modal/modal2/updateapp/modalIcon/inputSurname/video） |
| `isTabbarPage` | Boolean | `false` | 当前页面是否为 tabbar 页面。为 true 时，弹窗展示前会隐藏 tabBar，关闭后恢复 |

#### cu-popup Methods（通过 ref 调用）

| 方法 | 说明 | 参数 |
|------|------|------|
| `show(options)` | 展示弹窗 | `options.isBack`：是否允许返回关闭（默认 true）；`options.success`：成功回调函数；以及各弹窗类型的 data 配置 |

#### H5 / 小程序端用法（组件内显示）

在 H5 和微信小程序端，`cu-popup` 直接在当前页面内显示弹窗，**不走页面跳转**：

```vue
<template>
  <cu-popup ref="cuPopupRef" mode="modal" :isTabbarPage="false" />
</template>

<script setup>
import { ref } from 'vue';

const cuPopupRef = ref(null);

function showConfirm() {
  cuPopupRef.value.show({
    title: '提示',
    content: '确定要删除吗？',
    showCancel: true,
    success: (result) => {
      if (result.confirm) {
        console.log('用户点击确定');
      }
    }
  });
}
</script>
```

#### App 端用法（页面跳转）

在 App 端，调用 `cuPopupRef.value.show()` 会自动跳转到 `/pages/pop/index` 页面（透明背景的压窗屏），弹窗在该页面中展示：

```vue
<template>
  <!-- #ifndef APP-NVUE -->
  <cu-popup ref="cuPopupRef" mode="modalIcon" :isTabbarPage="true" />
  <!-- #endif -->
</template>

<script setup>
import { ref } from 'vue';

const cuPopupRef = ref(null);

function showInputDialog() {
  cuPopupRef.value.show({
    title: '设置昵称',
    showIcon: false,
    showInput: true,
    inputType: 'text',
    inputPlaceholder: '请输入昵称',
    maxlength: 10,
    required: true,
    validator: (value) => value.length >= 2,
    success: (result) => {
      if (result.confirm) {
        console.log('输入的值：', result.value);
      }
    }
  });
}
</script>
```

#### 内部平台差异处理

`cu-popup` 内部通过条件编译处理不同平台的逻辑差异：

| 平台 | 弹窗展示方式 | 返回处理 | tabbar 处理 |
|------|------------|---------|------------|
| **APP-PLUS** | 跳转到 `/pages/pop/index` 页面 | `back()` 返回上一页 | 无需特殊处理 |
| **H5 / MP-WEIXIN** | 组件内通过 `cuPopupGroupRef.show()` 直接展示 | 组件内部控制 | `show()` 前隐藏 tabbar，回调后恢复 |

> ⚠️ **注意**：`cu-popup` 模板中使用 `<!-- #ifndef APP-NVUE -->` 条件编译包裹 `cu-popup-group`，在 APP 端 `cu-popup-group` 不会被渲染，弹窗通过页面跳转到 `pages/pop/index` 来展示。

### 4. 弹窗类型说明

| 类型 | 用途 | 特点 |
|------|------|------|
| `modal` | 基础确认弹窗 | 支持标题、内容、确认/取消按钮 |
| `modal2` | 富文本弹窗 | 内容支持 HTML 富文本解析 |
| `updateapp` | App 更新弹窗 | 显示版本信息、更新内容、下载进度条 |
| `modalIcon` | 带图标弹窗 | 支持顶部图标、输入框、自定义验证 |
| `inputSurname` | 姓氏输入弹窗 | 专用姓氏输入，带 textarea |
| `video` | 视频播放弹窗 | 全屏视频播放，支持各种视频配置 |

### 5. 各类型详细配置

#### modal / modal2 通用配置

```javascript
uni.popInfo = {
    mode: 'modal',  // 或 'modal2'
    data: {
        title: '提示',                    // 标题
        content: '弹窗内容',               // 内容（modal2 支持 HTML）
        showCancel: true,                 // 是否显示取消按钮
        cancelText: '取消',                // 取消按钮文字
        cancelTextColor: '#999999',        // 取消按钮颜色
        confirmText: '确定',               // 确认按钮文字
        confirmTextColor: '#B59453',       // 确认按钮颜色
        isBack: true,                     // 点击遮罩是否关闭
        titleStyle: {},                   // 标题样式对象
        contentStyle: {}                  // 内容样式对象
    },
    success: (result) => {
        if (result.confirm) {
            console.log('用户点击确定');
        } else {
            console.log('用户点击取消');
        }
    }
};
uni.navigateTo({ url: '/pages/pop/index' });
```

#### modalIcon 配置（带图标和输入框）

```javascript
uni.popInfo = {
    mode: 'modalIcon',
    data: {
        title: '请输入验证码',
        content: '我们将发送验证码到您的手机',
        showIcon: true,                   // 是否显示图标
        icon: '/static/icon/verify.png',  // 图标路径
        iconStyle: { width: '120rpx', height: '120rpx' },
        
        // 输入框配置
        showInput: true,                  // 是否显示输入框
        inputType: 'number',              // 输入类型：text/number/password
        inputPlaceholder: '请输入验证码',
        maxlength: 6,
        required: true,                   // 是否必填
        requiredMsg: '验证码不能为空',
        validator: (value) => {           // 自定义验证函数
            return value.length === 6;
        },
        
        // 样式配置
        wrapStyle: { padding: '40rpx' },
        contentBoxStyle: {},
        inputStyle: {},
        btnBoxStyle: {},
        cancelBtnStyle: {},
        confirmBtnStyle: { 
            backgroundColor: '#B59453',
            color: 'white'
        }
    },
    success: (result) => {
        if (result.confirm) {
            console.log('输入的值：', result.value);
        }
    }
};
uni.navigateTo({ url: '/pages/pop/index' });
```

#### updateapp 配置（App 更新）

```javascript
// 先设置更新信息
uni.renewInfo = {
    version: 'v2.0.0',
    size: '25.6MB',
    content: '1. 修复已知问题\n2. 优化用户体验\n3. 新增功能模块'
};

uni.popInfo = {
    mode: 'updateapp',
    data: {
        isBack: false      // 更新弹窗通常不允许返回关闭
    },
    success: (result) => {
        console.log('更新完成');
    }
};
uni.navigateTo({ url: '/pages/pop/index' });
```

**注意**：更新弹窗内部会自动监听 `uni.downloadTask.onProgressUpdate` 显示下载进度。

#### video 配置（视频播放）

```javascript
uni.popInfo = {
    mode: 'video',
    data: {
        title: '教学视频',
        videoUrl: 'https://example.com/video.mp4',
        poster: 'https://example.com/poster.jpg',
        autoplay: true,       // 自动播放
        loop: false,          // 循环播放
        muted: false          // 静音
    },
    success: (result) => {
        console.log('视频关闭', result);
    }
};
uni.navigateTo({ url: '/pages/pop/index' });
```

#### inputSurname 配置（姓氏输入）

```javascript
uni.popInfo = {
    mode: 'inputSurname',
    data: {
        title: '请输入您的姓氏',
        content: '请输入名字的第一个字',
        realName: '张三',     // 显示完整姓名作为提示
        showCancel: true,
        confirmText: '确认',
        cancelText: '取消'
    },
    success: (result) => {
        if (result.confirm) {
            console.log('输入的姓氏：', result.value);
        }
    }
};
uni.navigateTo({ url: '/pages/pop/index' });
```

## 示例代码

### 基础确认弹窗

```javascript
function showConfirm() {
    uni.popInfo = {
        mode: 'modal',
        data: {
            title: '退出登录',
            content: '确定要退出当前账号吗？',
            showCancel: true,
            confirmText: '退出',
            confirmTextColor: '#ff0000'
        },
        success: (result) => {
            if (result.confirm) {
                // 执行退出登录
                logout();
            }
        }
    };
    uni.navigateTo({ url: '/pages/pop/index' });
}
```

### 带输入框的弹窗

```javascript
function showInputDialog() {
    uni.popInfo = {
        mode: 'modalIcon',
        data: {
            title: '设置昵称',
            showIcon: false,
            showInput: true,
            inputType: 'text',
            inputPlaceholder: '请输入昵称（2-10个字符）',
            maxlength: 10,
            required: true,
            validator: (value) => value.length >= 2,
            showCancel: true
        },
        success: (result) => {
            if (result.confirm) {
                updateNickname(result.value);
            }
        }
    };
    uni.navigateTo({ url: '/pages/pop/index' });
}
```

### 富文本内容弹窗

```javascript
function showRichText() {
    uni.popInfo = {
        mode: 'modal2',
        data: {
            title: '用户协议',
            content: `
                <div style="text-align: left; line-height: 1.8;">
                    <p>欢迎使用我们的服务！</p>
                    <p style="color: #666;">1. 请遵守相关法律法规</p>
                    <p style="color: #666;">2. 保护您的账号安全</p>
                </div>
            `,
            showCancel: false,
            confirmText: '我知道了'
        },
        success: () => {}
    };
    uni.navigateTo({ url: '/pages/pop/index' });
}
```

### 5. 如何扩展新弹窗类型 (Self-Replication Skill)

当现有的弹窗类型无法满足业务需求时，请按照以下步骤添加新弹窗：

1. **创建具体弹窗组件**：
   在 `components/cu-components/cu-popup-group/` 目录下新建文件夹，如 `pop-new-type`。
   - 编写 `index.vue`，必须包含 `show(data)` 方法供父组件调用。
   - 必须通过 `emit('success', result)` 将操作结果回传。

2. **在 cu-popup-group 中注册**：
   修改 `components/cu-components/cu-popup-group/cu-popup-group.vue`：
   - 导入新组件。
   - 在 `<template>` 中添加对应的 `v-if` 判断。
   - 在 `show()` 方法的 `switch` 逻辑中添加新的分支。

3. **定义数据契约**：
   在 `popup-system.md` 中记录新类型的 `data` 结构。

## 注意事项

### 1. 平台差异说明

弹窗载体页面 `/pages/pop/index` 在 `pages.json` 中使用了条件编译，**仅在 App 端注册**：

```json
// #ifdef APP-PLUS
{
    "path": "pages/pop/index",
    "style": {
        "app-plus": {
            "animationType": "fade-in",
            "background": "transparent",
            "backgroundColor": "rgba(0,0,0,0)",
            "popGesture": "none"
        }
    }
}
// #endif
```

但弹窗系统**并非仅 App 端可用**：
- **App 端**：通过页面跳转到 `/pages/pop/index` 展示弹窗（压窗屏效果）
- **H5 / 小程序端**：通过 `cu-popup` 组件封装，在当前页面内直接渲染 `cu-popup-group` 展示弹窗

因此推荐使用 `cu-popup` 组件方式调用，它会自动处理平台差异。

### 2. 回调函数处理

- 弹窗通过 `uni.popInfo.success` 传递回调函数
- 回调接收一个对象参数，包含 `confirm` 属性表示用户点击了确定还是取消
- 对于带输入框的弹窗，回调中还包含 `value` 属性表示输入的值

### 3. 返回键控制

- `isBack: true` - 允许点击遮罩或返回键关闭弹窗
- `isBack: false` - 禁止点击遮罩关闭，拦截物理返回键（适用于强制更新等场景）

### 4. 样式自定义

各弹窗类型都支持通过 `xxxStyle` 参数自定义样式，样式对象会被转换为行内样式。例如：

```javascript
titleStyle: { 
    fontSize: '40rpx', 
    color: '#333',
    fontWeight: 'bold'
}
```

### 5. 清理事件监听

弹窗页面在 `onUnmounted` 生命周期中会清理 `uni.$off('OnPopSuccess')` 事件，避免内存泄漏。

## 相关 skill

- [cu-components 自定义组件使用规范](./cu-components.md) - 了解 cu-popup、cu-popup-group 等组件的 Props/Events/Methods 详情
- [页面生成规范](./page-generation.md) - 页面开发规范
- [工具函数使用规范](./utils.md) - toast、验证等工具函数
