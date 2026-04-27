# cu-popover 气泡菜单组件

## 介绍
一个支持自动定位的气泡菜单组件，可根据触发元素在页面中的位置，自动判断菜单显示在上方还是下方。

## 引入

```js
import CuPopover from '@/components/cu-components/cu-popover/cu-popover.vue'
```

## 代码演示

### 基础用法

```vue
<template>
  <cu-popover :menuList="menuList" @select="handleSelect">
    <button>点击显示菜单</button>
  </cu-popover>
</template>

<script setup>
const menuList = [
  { name: '选项1' },
  { name: '选项2' },
  { name: '选项3' }
];

function handleSelect(item) {
  //console.log('选中:', item.name);
}
</script>
```

### 带图标的菜单

```vue
<template>
  <cu-popover :menuList="menuList">
    <button>点击显示菜单</button>
  </cu-popover>
</template>

<script setup>
const menuList = [
  { 
    name: '分享',
    icon: '/static/icons/share.png'
  },
  { 
    name: '编辑',
    icon: '/static/icons/edit.png'
  },
  { 
    name: '删除',
    icon: '/static/icons/delete.png'
  }
];
</script>
```

### 手动指定弹出位置

```vue
<template>
  <cu-popover :menuList="menuList" placement="top">
    <button>点击显示菜单</button>
  </cu-popover>
</template>
```

### 手动控制显示/隐藏

```vue
<template>
  <cu-popover ref="popoverRef" :menuList="menuList">
    <button>点击显示菜单</button>
  </cu-popover>
  
  <button @click="showPopover">显示</button>
  <button @click="hidePopover">隐藏</button>
</template>

<script setup>
const popoverRef = ref(null);

function showPopover() {
  popoverRef.value?.show();
}

function hidePopover() {
  popoverRef.value?.hide();
}
</script>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| menuList | 菜单列表 | Array | [] |
| placement | 弹出位置，可选值：top/bottom | String | - |

### MenuList 数据结构

```ts
interface MenuItem {
  name: string;      // 菜单文本
  icon?: string;     // 菜单图标
  [key: string]: any // 其他自定义字段
}
```

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| select | 点击菜单项时触发 | item: MenuItem |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 触发元素插槽 |

### 方法

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| show | 显示菜单 | - |
| hide | 隐藏菜单 | - |

## 注意事项

1. 组件会自动判断页面剩余空间来决定菜单的弹出方向，也可以通过 `placement` 属性手动指定
2. 菜单项可以通过 `icon` 字段配置图标
3. 可以通过 ref 获取组件实例来手动控制菜单的显示/隐藏 