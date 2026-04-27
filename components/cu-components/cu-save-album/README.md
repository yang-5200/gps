# cu-save-album 保存相册弹窗组件

一个用于保存图片到相册的弹窗组件，支持预览图片和保存操作。

## 使用方法

```vue
<template>
  <!-- 基础用法 -->
  <cu-save-album 
    ref="saveAlbumRef"
    imageUrl="/static/share.png"
    @success="onSaveSuccess"
  />
  
  <!-- 自定义标题和按钮文字 -->
  <cu-save-album
    ref="saveAlbumRef" 
    imageUrl="/static/share.png"
    title="保存图片"
    confirmText="保存到相册"
  />
</template>

<script setup>
const saveAlbumRef = ref(null);

// 显示弹窗
function showSaveAlbum() {
  saveAlbumRef.value?.show();
}

// 保存成功回调
function onSaveSuccess() {
  uni.showToast({
    title: '保存成功',
    icon: 'success'
  });
}
</script>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| imageUrl | 图片地址 | String | - |
| title | 弹窗标题 | String | '保存图片到相册' |
| confirmText | 确认按钮文字 | String | '保存' |
| cancelText | 取消按钮文字 | String | '取消' |
| imageStyle | 图片样式 | Object | - |
| titleStyle | 标题样式 | Object | - |
| buttonStyle | 按钮样式 | Object | - |
| cancelButtonStyle | 取消按钮样式 | Object | - |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| success | 保存成功时触发 | - |
| fail | 保存失败时触发 | error |

## 方法

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| show | 显示弹窗 | - |
| hide | 隐藏弹窗 | - |

## 注意事项

1. 需要用户授权相册权限才能保存图片
2. 支持网络图片和本地图片
3. 建议图片大小不要过大，以免影响性能
4. 保存失败时会自动提示错误信息 