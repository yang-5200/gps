# cu-components 组件库文档

## 📚 目录

- [上传组件](#上传组件)
- [展示组件](#展示组件)
- [弹窗组件](#弹窗组件)
- [表单组件](#表单组件)
- [反馈组件](#反馈组件)
- [导航组件](#导航组件)
- [选择器组件](#选择器组件)
- [其他组件](#其他组件)

---

## 上传组件

### cu-media-upload 统一媒体上传组件 ⭐ 推荐

**三合一媒体上传组件**，支持图片、视频、文件的统一上传、预览、删除等功能。

**特性**

- ✅ 一个组件支持图片、视频、文件上传
- ✅ 智能预览（根据类型自动选择最佳预览方式）
- ✅ 多平台支持（微信小程序、H5、APP）
- ✅ 自动权限管理
- ✅ 丰富的配置和插槽支持

**基础用法**

```vue
<template>
  <!-- 图片上传 -->
  <cu-media-upload type="image" v-model="imageList" :maxCount="9" />

  <!-- 视频上传 -->
  <cu-media-upload type="video" v-model="videoList" :maxCount="1" />

  <!-- 文件上传 -->
  <cu-media-upload
    type="file"
    v-model="fileList"
    :acceptTypes="['.pdf', '.doc']"
  />
</template>

<script setup>
import { ref } from 'vue';
const imageList = ref([]);
const videoList = ref([]);
const fileList = ref([]);
</script>
```

**属性说明**
| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| type | 媒体类型(image/video/file) | String | image |
| modelValue | 双向绑定的媒体列表 | Array | [] |
| maxCount | 最大上传数量 | Number | 9 |
| mediaWidth | 媒体预览宽度(rpx) | Number | 150 |
| mediaHeight | 媒体预览高度(rpx) | Number | 150 |
| showUploadTime | 是否显示上传时间 | Boolean | false |
| previewMode | 是否为预览模式 | Boolean | false |
| acceptTypes | 接受的文件类型(仅 file 类型) | Array | ['*'] |
| previewImgMode | 图片预览模式(仅 image 类型) | String | aspectFill |

**详细文档**: [README.md](./cu-media-upload/README.md)

---

## 展示组件

### cu-img 图片组件

图片组件，支持加载动画、加载失败提示、懒加载等功能。

**基础用法**

```vue
<cu-img src="/static/logo.png" mode="aspectFit"></cu-img>
```

**属性说明**
| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| src | 图片链接 | String | - |
| mode | 图片裁剪模式 | String | aspectFill |
| lazyLoad | 是否开启懒加载 | Boolean | true |
| showLoading | 是否显示加载中 | Boolean | true |
| loadingIcon | 加载中图标 | String | - |
| errorIcon | 加载失败图标 | String | - |

---

### cu-image-preview 图片预览组件

支持自定义样式的图片预览组件，可用于图片列表展示、预览和删除等场景。

**基础用法**

```vue
<template>
  <!-- 单张图片 -->
  <cu-image-preview v-model="imageUrl" />

  <!-- 图片数组 -->
  <cu-image-preview v-model="imageList" show-delete @delete="handleDelete" />
</template>

<script setup>
const imageUrl = 'https://example.com/image.jpg';
const imageList = ['image1.jpg', 'image2.jpg', 'image3.jpg'];

function handleDelete({ url, index }) {
  //console.log('删除图片:', index);
}
</script>
```

**属性说明**
| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| v-model | 图片地址(数组/字符串) | Array/String | [] |
| previewStyle | 预览容器样式 | Object | - |
| previewMode | 图片显示模式 | String | aspectFill |
| showDelete | 是否显示删除按钮 | Boolean | false |
| deleteButtonStyle | 删除按钮样式 | Object | - |
| columnStyles | 列样式配置 | Object | {} |

**详细文档**: [README.md](./cu-image-preview/README.md)

---

### cu-swiper 轮播图指示器组件

提供多种样式的轮播图指示器，配合 swiper 组件使用。

**基础用法**

```vue
<template>
  <swiper @change="handleChange">
    <swiper-item v-for="(item, index) in banners" :key="index">
      <image :src="item"></image>
    </swiper-item>
    <cu-swiper :len="banners.length" :current="current" />
  </swiper>
</template>

<script setup>
const banners = ref([...]);
const current = ref(0);

function handleChange(e) {
  current.value = e.detail.current;
}
</script>
```

**属性说明**
| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| dotMode | 指示器样式(dot-df/dot-number/dot-rect/dot-round) | String | dot-df |
| dotColor | 指示器颜色 | String | rgba(0,0,0,0.5) |
| dotActiveColor | 当前指示器颜色 | String | rgba(255,255,255,1) |
| len | 轮播图总数量 | Number | 0 |
| dotPos | 指示器位置(bottom-center/bottom-left/bottom-right) | String | bottom-center |
| current | 当前轮播图索引 | Number | 0 |
| dotContentOffsetY | 指示器距底部距离(rpx) | Number | 20 |
| dotContentOffsetX | 指示器距左右距离(rpx) | Number | 20 |

---

### cu-notice-bar 滚动通知组件

功能完整的滚动通知组件，支持水平和垂直滚动。

**基础用法**

```vue
<template>
  <!-- 水平滚动 -->
  <cu-notice-bar :noticeList="noticeList" />

  <!-- 垂直滚动 -->
  <cu-notice-bar
    direction="vertical"
    :noticeList="noticeList"
    @click="handleClick"
  />
</template>

<script setup>
const noticeList = [{ text: '这是第一条通知' }, { text: '这是第二条通知' }];

function handleClick({ item, index }) {
  //console.log('点击通知:', item);
}
</script>
```

**属性说明**
| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| noticeList | 通知列表数据 | Array | [] |
| direction | 滚动方向(horizontal/vertical) | String | horizontal |
| speed | 滚动速度(px/s) | Number | 50 |
| interval | 滚动间隔(ms) | Number | 3000 |
| itemStyle | 滚动项样式 | Object | {} |
| barStyle | 通知栏样式 | Object | {} |
| showLeftIcon | 是否显示左侧图标 | Boolean | true |
| showRightIcon | 是否显示右侧图标 | Boolean | true |

**详细文档**: [README.md](./cu-notice-bar/README.md)

---

### cu-event-list 事件列表组件

可复用的事件列表组件，支持分页加载、下拉刷新、列表项点击等功能。

**基础用法**

```vue
<template>
  <cu-event-list
    :apiUrl="urls.eventList"
    :detailPath="/pages/detail/index"
    noDataText="暂无事件"
    @itemClick="handleClick"
  />
</template>

<script setup>
import { urls } from '@/common/api/index.js';

function handleClick(item) {
  //console.log('点击列表项:', item);
}
</script>
```

**属性说明**
| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| apiUrl | API 接口地址 | String | - |
| noDataText | 无数据提示文本 | String | 暂无数据 |
| detailPath | 列表项跳转路径 | String | '' |
| extraParams | 额外查询参数 | Object | {} |

**详细文档**: [README.md](./cu-event-list/README.md)

---

### cu-parser 富文本解析组件

基于 mp-html 的富文本内容解析组件。

**基础用法**

```vue
<cu-parser :html="htmlContent"></cu-parser>
```

**属性说明**
| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| html | 富文本内容 | String | '' |
| tagStyle | 标签样式 | Object | {img: 'width:100%;height:auto;'} |

---

### cu-not-data 空数据组件

用于展示空数据状态。

**基础用法**

```vue
<cu-not-data text="暂无数据" v-if="list.length === 0"></cu-not-data>
```

**属性说明**
| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| text | 提示文字 | String | 暂无数据 |
| color | 文字颜色 | String | #999 |
| fullScreen | 是否全屏 | Boolean | false |

---

## 弹窗组件

### cu-layer 弹层组件

基础弹出层容器，用于展示弹窗、信息提示等内容。支持多个方向弹出。

**基础用法**

```vue
<template>
  <cu-layer v-model="show" mode="center" :maskClosable="true">
    <view class="content">弹层内容</view>
  </cu-layer>
</template>

<script setup>
const show = ref(false);
</script>
```

**属性说明**
| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| v-model | 是否显示弹层 | Boolean | false |
| mode | 弹出方向(left/right/top/bottom/center) | String | left |
| maskClosable | 点击遮罩是否关闭 | Boolean | true |
| cuZindex | 层级 | Number | 100 |
| duration | 动画时长(ms) | Number | 300 |
| bodyBg | 内容区背景色 | String | white |
| borderRadius | 圆角大小 | String | 10rpx |
| cuBodyStyle | 自定义内容区样式 | Object | {} |

---

### cu-mask 遮罩层组件

遮罩层组件，用于强调特定页面元素，阻止用户对遮罩下层内容进行操作。

**基础用法**

```vue
<template>
  <cu-mask :show="show" @maskClick="show = false">
    <view class="content">遮罩内容</view>
  </cu-mask>
</template>

<script setup>
const show = ref(false);
</script>
```

**属性说明**
| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| show | 是否显示遮罩 | Boolean | false |
| zIndex | 层级 | Number/String | 101 |
| zoom | 是否使用缩放动画 | Boolean | true |
| duration | 过渡时间(ms) | Number | 300 |
| maskClickAble | 是否可点击遮罩关闭 | Boolean | true |
| customStyle | 自定义样式 | Object | {} |

**事件说明**
| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| maskClick | 点击遮罩时触发 | - |

---

### cu-popup 弹窗组件

基于 cu-layer 的弹窗组件，提供了常用的弹窗样式和交互。包含 modal 和 updateapp 两种模式。

**基础用法**

```vue
<template>
  <cu-popup ref="popup" mode="modal" :isTabbarPage="true" />
</template>

<script setup>
const popup = ref(null);

// 显示普通弹窗
function showModal() {
  popup.value.show({
    title: '提示',
    content: '这是一个弹窗',
    showCancel: true,
    cancelText: '取消',
    confirmText: '确定',
    success: (res) => {
      if (res.confirm) {
        //console.log('点击确定');
      } else if (res.cancel) {
        //console.log('点击取消');
      }
    },
  });
}

// 显示更新弹窗
function showUpdateApp() {
  popup.value.show({
    mode: 'updateapp',
    content: '发现新版本，是否更新?',
    success: (res) => {
      if (res.confirm) {
        // 执行更新操作
      }
    },
  });
}
</script>
```

**属性说明**
| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| mode | 弹窗类型(modal/updateapp) | String | modal |
| isTabbarPage | 是否为 tabbar 页面 | Boolean | false |

**Modal 模式参数**
| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| title | 标题 | String | - |
| content | 内容 | String | - |
| type | 类型(alert/or-success) | String | alert |
| showCancel | 是否显示取消按钮 | Boolean | true |
| cancelText | 取消按钮文字 | String | 取消 |
| confirmText | 确定按钮文字 | String | 确定 |
| cancelTextColor | 取消按钮颜色 | String | #999999 |
| confirmTextColor | 确定按钮颜色 | String | #B59453 |
| titleStyle | 标题样式 | Object | {} |
| contentStyle | 内容样式 | Object | {} |
| success | 回调函数 | Function | - |

**UpdateApp 模式参数**
| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| content | 更新内容 | String | - |
| success | 回调函数 | Function | - |

---

### cu-popup-group 弹窗组合组件

弹窗组合组件，集成了多种常用弹窗类型（modal、modal2、updateapp、modalIcon、inputSurname、input、video）。

**基础用法**

```vue
<template>
  <cu-popup-group ref="popupRef" mode="modal" @success="handleSuccess" />
</template>

<script setup>
const popupRef = ref(null);

function showPopup() {
  popupRef.value?.show();
}

function handleSuccess(result) {
  //console.log('弹窗回调:', result);
}
</script>
```

**属性说明**
| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| mode | 弹窗类型(modal/modal2/updateapp/modalIcon/inputSurname/input/video) | String | modal |

**方法说明**
| 方法名 | 说明 | 参数 |
|--------|------|------|
| show | 显示弹窗 | - |
| close | 关闭弹窗 | - |

---

### cu-popover 气泡菜单组件

支持自动定位的气泡菜单组件，可根据触发元素位置自动判断显示方向。

**基础用法**

```vue
<template>
  <cu-popover :menuList="menuList" @select="handleSelect">
    <button>点击显示菜单</button>
  </cu-popover>
</template>

<script setup>
const menuList = [
  { name: '选项1', icon: '/static/icon1.png' },
  { name: '选项2', icon: '/static/icon2.png' },
  { name: '选项3', icon: '/static/icon3.png' },
];

function handleSelect(item) {
  //console.log('选中:', item.name);
}
</script>
```

**属性说明**
| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| menuList | 菜单列表 | Array | [] |
| placement | 弹出位置(top/bottom) | String | - |

**详细文档**: [README.md](./cu-popover/README.md)

---

### cu-save-album 保存相册组件

用于保存图片到相册的弹窗组件，支持预览和保存操作。

**基础用法**

```vue
<template>
  <cu-save-album
    ref="saveAlbumRef"
    imageUrl="/static/share.png"
    @success="onSaveSuccess"
  />
</template>

<script setup>
const saveAlbumRef = ref(null);

function showSaveAlbum() {
  saveAlbumRef.value?.show();
}

function onSaveSuccess() {
  uni.showToast({ title: '保存成功', icon: 'success' });
}
</script>
```

**属性说明**
| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| imageUrl | 图片地址 | String | - |
| title | 弹窗标题 | String | 保存图片到相册 |
| confirmText | 确认按钮文字 | String | 保存 |
| cancelText | 取消按钮文字 | String | 取消 |

**详细文档**: [README.md](./cu-save-album/README.md)

---

## 表单组件

### cu-radio 单选框组件

单选框组件，支持不同显示模式和数据类型。

**基础用法**

```vue
<template>
  <cu-radio v-model="checked" @change="onChange">选项1</cu-radio>

  <!-- 数字类型 -->
  <cu-radio v-model="value" is-data-type="num">选项2</cu-radio>
</template>

<script setup>
const checked = ref(false);
const value = ref(0); // 0-未选中 1-选中

function onChange(value) {
  //console.log('选中状态:', value);
}
</script>
```

**属性说明**
| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| v-model | 绑定值 | Boolean/Number | false |
| mode | 显示模式(df/1) | String | df |
| isDataType | 数据类型(boo/num) | String | boo |
| activeColor | 选中状态颜色 | String | 主题色 |
| inactiveColor | 未选中状态颜色 | String | #999 |

**详细文档**: [README.md](./cu-radio/README.md)

---

## 反馈组件

### cu-load-list 列表加载组件

用于列表的加载状态展示，支持下拉刷新、上拉加载更多等功能。

**基础用法**

```vue
<template>
  <cu-load-list
    :len="list.length"
    :loadStatus="loadStatus"
    :needNotData="true"
    @loadmore="loadMore"
  >
    <view v-for="item in list" :key="item.id">
      {{ item.name }}
    </view>
  </cu-load-list>
</template>

<script setup>
const list = ref([]);
const loadStatus = ref('more'); // more-加载更多 loading-加载中 noMore-没有更多了

async function loadMore() {
  loadStatus.value = 'loading';
  await loadData();
  loadStatus.value = list.value.length >= 100 ? 'noMore' : 'more';
}
</script>
```

**属性说明**
| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| len | 列表长度 | Number | 0 |
| loadStatus | 加载状态(more/loading/noMore) | String | more |
| needNotData | 是否需要空数据提示 | Boolean | true |

**事件说明**
| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| loadmore | 加载更多时触发 | - |

---

### cu-load-more 加载更多组件

加载更多提示组件，展示加载状态和文本提示。

**基础用法**

```vue
<template>
  <cu-load-more :status="loadStatus" :contentText="loadText" />
</template>

<script setup>
const loadStatus = ref('more'); // more/loading/noMore
const loadText = {
  contentdown: '上拉显示更多',
  contentrefresh: '正在加载...',
  contentnomore: '没有更多数据了',
};
</script>
```

**属性说明**
| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| status | 加载状态(more/loading/noMore) | String | more |
| showIcon | 是否显示加载图标 | Boolean | true |
| color | 文字和图标颜色 | String | #777777 |
| contentText | 提示文字配置 | Object | - |
| loadType | 组件类型(load/full) | String | load |
| safeAreaInsetBottom | 是否适配底部安全区 | Boolean | true |

---

## 导航组件

### cu-nav-bar 导航栏组件

自定义导航栏组件，支持自定义按钮、标题等。

**基础用法**

```vue
<cu-nav-bar title="标题">
  <template #left>
    <view @click="back">返回</view>
  </template>
  <template #right>
    <view @click="more">更多</view>
  </template>
</cu-nav-bar>
```

**属性说明**
| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| title | 标题文字 | String | - |
| fixed | 是否固定在顶部 | Boolean | true |
| border | 是否显示底部边框 | Boolean | true |
| zIndex | 层级 | Number | 100 |

### cu-scroll-bar 滚动条组件

横向滚动条组件，支持自定义内容。

**基础用法**

```vue
<cu-scroll-bar>
  <view class="item" v-for="item in list" :key="item.id">
    {{ item.name }}
  </view>
</cu-scroll-bar>
```

**属性说明**
| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| scrollBarHeight | 滚动条高度 | Number | 80 |
| bgColor | 背景颜色 | String | transparent |
| fixed | 是否固定 | Boolean | false |

---

### cu-page-footer 页脚组件

灵活的页脚组件，支持固定定位、占位和安全区适配。

**基础用法**

```vue
<template>
  <!-- 固定在底部 -->
  <cu-page-footer :is-fixed="true">
    <view>页脚内容</view>
  </cu-page-footer>
</template>
```

**属性说明**
| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| isFixed | 是否固定在底部 | Boolean | false |
| placeholder | 固定时是否占位 | Boolean | true |
| safeAreaInsetBottom | 是否适配底部安全区 | Boolean | true |
| background | 背景颜色 | String | #FFFFFF |

**详细文档**: [README.md](./cu-page-footer/README.md)

---

## 选择器组件

### cu-picker 选择器组件

多功能选择器组件，支持日期、时间、地区、单列、多列等多种选择模式。

**基础用法**

```vue
<template>
  <!-- 日期选择器 -->
  <cu-picker mode="date" v-model="date" @confirm="handleConfirm">
    <text>日期选择</text>
  </cu-picker>

  <!-- 时间选择器 -->
  <cu-picker mode="time" v-model="time" @confirm="handleConfirm">
    <text>时间选择</text>
  </cu-picker>

  <!-- 地区选择器 -->
  <cu-picker mode="region" v-model="region" @confirm="handleConfirm">
    <text>地区选择</text>
  </cu-picker>

  <!-- 单列选择器 -->
  <cu-picker
    mode="selector"
    v-model="selected"
    :options="options"
    @confirm="handleConfirm"
  >
    <text>单列选择</text>
  </cu-picker>
</template>

<script setup>
const date = ref('');
const time = ref('');
const region = ref([]);
const selected = ref('');
const options = ['选项1', '选项2', '选项3'];

function handleConfirm(value) {
  //console.log('选择结果:', value);
}
</script>
```

**模式说明**
| 模式 | 说明 |
|------|------|
| date | 日期选择器 |
| time | 时间选择器 |
| range | 日期范围选择器 |
| half | 半年选择器 |
| shortTerm | 短期选择器 |
| selector | 单列选择器 |
| region | 地区选择器 |
| linkage | 联动选择器 |

**属性说明**
| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| mode | 选择器模式 | String | date |
| value | 绑定值 | String/Array | - |
| startYear | 开始年份 | Number | 1980 |
| endYear | 结束年份 | Number | 2050 |
| fields | 日期精度(year/month/day) | String | day |
| themeColor | 主题颜色 | String | - |
| options | 选项数据(selector 模式) | Array | [] |

---

## 其他组件

### cu-map-address 地图地址组件

地图地址选择组件，支持自动定位和手动选择。

**基础用法**

```vue
<template>
  <cu-map-address v-model:address="address" />
</template>

<script setup>
const address = ref('');

watch(address, (val) => {
  //console.log('选择地址:', val);
});
</script>
```

**属性说明**
| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| v-model:address | 地址信息 | String | '' |

**方法说明**
| 方法名 | 说明 | 参数 |
|--------|------|------|
| getLocation | 手动获取位置 | - |
| defaultLocation | 获取默认位置 | - |

---

### cu-app-update 应用更新组件

APP 应用更新检测组件，支持版本检测和热更新。

**基础用法**

```vue
<template>
  <cu-app-update ref="appUpdateRef" />
</template>

<script setup>
const appUpdateRef = ref(null);

onMounted(() => {
  // 检测更新
  appUpdateRef.value?.testUpdate({ type: 'passive' });
});
</script>
```

**方法说明**
| 方法名 | 说明 | 参数 |
|--------|------|------|
| testUpdate | 检测更新 | {type: 'passive'/'active'} |

**注意**：需要在 `common/config.js` 中配置 `APP_UPDATE_URL` 更新检测地址。

---

## 使用说明

1. 组件都是基于 Vue3 + uniapp 开发
2. 组件样式使用 scss 预处理器
3. 所有 cu- 前缀的组件都已配置 easycom 自动引入，无需手动 import
4. 部分组件依赖其他基础组件，使用时需要注意引入依赖
5. **推荐使用** `cu-media-upload` 组件进行图片、视频、文件上传

## 注意事项

1. 组件库依赖 uniapp 环境
2. 部分组件样式依赖全局样式变量(如 DfColor)
3. cu-popup 组件依赖 cu-layer 组件
4. 在 tabbar 页面使用 cu-popup 时，需要设置 isTabbarPage 属性
5. 更新弹窗(updateapp)需要配合 uni.downloadTask 使用

## 组件分类速查

### 上传组件 (1 个)

- cu-media-upload - 统一媒体上传 ⭐

### 展示组件 (7 个)

- cu-img - 图片组件
- cu-image-preview - 图片预览
- cu-swiper - 轮播图指示器
- cu-notice-bar - 滚动通知
- cu-event-list - 事件列表
- cu-parser - 富文本解析
- cu-not-data - 空数据提示

### 弹窗组件 (6 个)

- cu-layer - 弹层容器
- cu-mask - 遮罩层
- cu-popup - 弹窗
- cu-popup-group - 弹窗组合
- cu-popover - 气泡菜单
- cu-save-album - 保存相册

### 表单组件 (1 个)

- cu-radio - 单选框

### 反馈组件 (2 个)

- cu-load-list - 列表加载
- cu-load-more - 加载更多

### 导航组件 (3 个)

- cu-nav-bar - 导航栏
- cu-scroll-bar - 滚动条
- cu-page-footer - 页脚

### 选择器组件 (1 个)

- cu-picker - 多功能选择器（日期/时间/地区/单列/多列）

### 其他组件 (2 个)

- cu-map-address - 地图地址
- cu-app-update - 应用更新

---

## 更新日志

### v1.2.0 - 2024-10-16

- 📝 完善组件库文档
  - 补充所有组件的使用说明
  - 新增组件分类目录
  - 新增组件分类速查表
  - 优化文档结构和阅读体验
- 📦 现已收录 **23 个**常用组件

### v1.1.0 - 2024-01-01

- 🎉 新增 `cu-media-upload` 统一媒体上传组件
  - 支持图片、视频、文件三种类型
  - 智能预览功能（根据类型自动选择预览方式）
  - 一个组件，三种功能，统一 API

### v1.0.1

- 优化弹窗动画效果
- 修复弹窗重复触发问题
- 完善使用文档

### v1.0.0

- 初始化组件库
- 完成基础组件开发
- 添加使用文档

---

## 贡献指南

欢迎贡献新组件或改进现有组件！

1. 组件命名规范：`cu-组件名`
2. 使用 Vue3 Composition API
3. 样式使用 SCSS 预处理器
4. 编写详细的使用文档和示例代码
5. 在主文档中添加组件说明

---

## 常见问题

### 1. 组件无法自动引入？

确保组件命名为 `cu-` 前缀，且放在 `components/cu-components/` 目录下。

### 2. 组件样式不生效？

检查是否引入了全局样式文件，部分组件依赖全局样式变量。

### 3. 弹窗组件在 TabBar 页面显示异常？

在 TabBar 页面使用 `cu-popup` 时，需要设置 `isTabbarPage` 属性为 `true`。

### 4. 如何查看组件详细文档？

部分组件提供了详细文档，查看组件目录下的 `README.md` 文件。

---

**最后更新时间**: 2024-10-16  
**组件总数**: 23 个  
**维护状态**: 持续更新中 ✨
