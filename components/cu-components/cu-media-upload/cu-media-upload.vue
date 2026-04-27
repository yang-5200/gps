<template>
  <view class="cu-media-upload">
    <view class="media-list">
      <view class="flex flex-wrap grid-square flex-sub">
        <!-- ========== 图片预览模式 ========== -->
        <template v-if="type === 'image'">
          <!-- 自定义预览插槽 -->
          <template v-if="slots.preview">
            <view
              v-for="(item, index) in mediaList"
              :key="index"
              class="media-container"
            >
              <view
                class="preview"
                @click="handlePreview(item)"
                :style="previewBoxStyle"
              >
                <image
                  class="media-img"
                  :src="handleStaticFilePath(getItemUrl(item))"
                  :mode="previewImgMode"
                ></image>
                <slot
                  name="preview"
                  :src="handleStaticFilePath(getItemUrl(item))"
                ></slot>
              </view>
              <view
                v-if="!previewMode"
                class="cu-tag delete-btn"
                @click.stop="handleDelete(index)"
                :style="deleteButtonBoxStyle"
              >
                <image
                  v-if="deleteIconUrl"
                  class="delete-icon-img"
                  :src="deleteIconUrl"
                  mode="aspectFit"
                ></image>
                <text v-else class="cuIcon-close text-white"></text>
              </view>
              <view
                class="upload-time padding-tb text-center w100"
                v-if="showUploadTime"
              >
                <text class="time-text"
                  >上传时间: {{ getUploadTime(item) }}</text
                >
              </view>
            </view>
          </template>

          <!-- 默认图片预览 -->
          <template v-else>
            <view
              v-for="(item, index) in mediaList"
              :key="index"
              class="media-container"
            >
              <view
                class="media-box"
                :style="previewBoxStyle"
                @click="handlePreview(item)"
              >
                <image
                  class="media-img"
                  :src="handleStaticFilePath(getItemUrl(item))"
                  :mode="previewImgMode"
                ></image>
              </view>
              <view
                v-if="!previewMode"
                class="cu-tag delete-btn"
                @click.stop="handleDelete(index)"
                :style="deleteButtonBoxStyle"
              >
                <image
                  v-if="deleteIconUrl"
                  class="delete-icon-img"
                  :src="deleteIconUrl"
                  mode="aspectFit"
                ></image>
                <text v-else class="cuIcon-close text-white"></text>
              </view>
              <view
                class="upload-time padding-tb text-center w100"
                v-if="showUploadTime"
              >
                <text class="time-text"
                  >上传时间: {{ getUploadTime(item) }}</text
                >
              </view>
            </view>
          </template>
        </template>

        <!-- ========== 视频预览模式 ========== -->
        <template v-else-if="type === 'video'">
          <view
            v-for="(item, index) in mediaList"
            :key="index"
            class="media-container"
          >
            <view class="media-box" :style="previewBoxStyle">
              <view class="video-preview-wrap">
                <cu-img
                  className="w100 h100"
                  :src="handleFilePath(getItemUrl(item)) + videoSnapshotSuffix"
                ></cu-img>
                <view
                  @click="handlePreview(item)"
                  class="cuIcon-playfill play-icon"
                >
                </view>
              </view>
            </view>
            <view
              v-if="!previewMode"
              class="cu-tag delete-btn"
              @click.stop="handleDelete(index)"
              :style="deleteButtonBoxStyle"
            >
              <image
                v-if="deleteIconUrl"
                class="delete-icon-img"
                :src="deleteIconUrl"
                mode="aspectFit"
              ></image>
              <text v-else class="cuIcon-close text-white"></text>
            </view>
            <view
              class="upload-time padding-tb text-center w100"
              v-if="showUploadTime"
            >
              <text class="time-text">上传时间: {{ getUploadTime(item) }}</text>
            </view>
          </view>
        </template>

        <!-- ========== 文件预览模式 ========== -->
        <template v-else-if="type === 'file'">
          <!-- 自定义预览插槽 -->
          <template v-if="slots.preview">
            <view
              v-for="(item, index) in mediaList"
              :key="index"
              class="media-container"
            >
              <view
                class="preview"
                @click="handlePreview(item)"
                :style="previewBoxStyle"
              >
                <view class="file-icon">
                  <text :class="getFileIcon(item.type)"></text>
                </view>
                <view class="file-name">{{ item.name }}</view>
                <slot name="preview" :file="item"></slot>
              </view>
              <view
                v-if="!previewMode"
                class="cu-tag delete-btn"
                @click.stop="handleDelete(index)"
                :style="deleteButtonBoxStyle"
              >
                <image
                  v-if="deleteIconUrl"
                  class="delete-icon-img"
                  :src="deleteIconUrl"
                  mode="aspectFit"
                ></image>
                <text v-else class="cuIcon-close text-white"></text>
              </view>
              <view
                class="upload-time padding-tb text-center w100"
                v-if="showUploadTime"
              >
                <text class="time-text"
                  >上传时间: {{ getUploadTime(item) }}</text
                >
              </view>
            </view>
          </template>

          <!-- 默认文件预览 -->
          <template v-else>
            <view
              v-for="(item, index) in mediaList"
              :key="index"
              class="media-container"
            >
              <view
                class="file-box"
                :style="previewBoxStyle"
                @click="handlePreview(item)"
              >
                <view class="file-icon">
                  <text :class="getFileIcon(item.type)"></text>
                </view>
                <view class="file-name">{{ item.name }}</view>
              </view>
              <view
                v-if="!previewMode"
                class="cu-tag delete-btn"
                @click.stop="handleDelete(index)"
                :style="deleteButtonBoxStyle"
              >
                <image
                  v-if="deleteIconUrl"
                  class="delete-icon-img"
                  :src="deleteIconUrl"
                  mode="aspectFit"
                ></image>
                <text v-else class="cuIcon-close text-white"></text>
              </view>
              <view
                class="upload-time padding-tb text-center w100"
                v-if="showUploadTime"
              >
                <text class="time-text"
                  >上传时间: {{ getUploadTime(item) }}</text
                >
              </view>
            </view>
          </template>
        </template>

        <!-- ========== 上传按钮 ========== -->
        <template v-if="!previewMode && mediaList.length < maxCount">
          <!-- 上传按钮插槽 -->
          <template v-if="slots.default">
            <view class="upload-btn-slot" @click="handleChoose">
              <slot></slot>
            </view>
          </template>

          <!-- 自定义按钮图片 -->
          <template v-else-if="buttonUrl">
            <image
              @click="handleChoose"
              class="upload-btn-image"
              :style="mediaStyle"
              :src="buttonUrl"
              mode="aspectFit"
            ></image>
          </template>

          <!-- 默认上传按钮 -->
          <template v-else>
            <view
              class="upload-btn text-center bg-gray flex align-center flex-wrap justify-center"
              @click="handleChoose"
              :style="mediaStyle"
            >
              <text class="cuIcon-add radius-sm"></text>
            </view>
          </template>
        </template>
      </view>
    </view>

    <!-- 权限弹窗 -->
    <yk-authpup
      ref="authPupRef"
      type="top"
      @changeAuth="changeAuth(permissionFromType)"
      :permissionID="permissionID"
    ></yk-authpup>

    <!-- 视频预览弹窗 -->
    <cu-popup ref="videoPopRef" mode="video" v-if="type === 'video'"></cu-popup>
  </view>
</template>

<script setup>
/**
 * 统一媒体上传组件
 * @description 支持图片、视频、文件的统一上传、预览、删除等功能
 * @property {String} type - 媒体类型: 'image' | 'video' | 'file'
 * @property {Array|String} modelValue - 双向绑定的媒体列表
 * @property {Number} maxCount - 最大上传数量
 * @property {String} buttonUrl - 自定义上传按钮图片
 * @property {Number} mediaHeight - 媒体预览高度，单位rpx
 * @property {Number} mediaWidth - 媒体预览宽度，单位rpx
 * @property {Object} previewStyle - 预览样式配置
 * @property {String} previewImgMode - 图片预览模式（仅 type='image' 时有效）
 * @property {Object} deleteButtonStyle - 删除按钮样式
 * @property {Boolean} showUploadTime - 是否显示上传时间
 * @property {Array} acceptTypes - 接受的文件类型（仅 type='file' 时有效）
 * @property {Boolean} previewMode - 是否为预览模式
 * @property {String} videoSnapshotSuffix - 视频封面后缀（仅 type='video' 时有效）
 * @event {Function} update:modelValue - 更新媒体列表
 * @event {Function} delete - 删除媒体时触发
 * @event {Function} preview - 预览媒体时触发
 * @event {Function} choose - 选择媒体时触发
 * @slot default - 自定义上传按钮
 * @slot preview - 自定义预览（type='image' 或 'file' 时有效）
 */

import { ref, computed, watch, useSlots } from 'vue';
import { convertStyles } from '@/common/utils/styleHandleUtil.js';
import UploadImage from '@/common/utils/uploadImage.js';
import UploadVideo from '@/common/utils/uploadVideo.js';
import UploadFile from '@/common/utils/uploadFile.js';
import { DfColor } from '@/common/style/variables.js';
import {
  handleStaticFilePath,
  handleFilePath,
  openDocument,
} from '@/common/utils/util.js';
import { useAuth } from '@/hooks/useAuth.js';
import { chooseFile } from '@/common/utils/chooseFile.js';

const { authPupRef, permissionID, permissionFromType, openAuth } = useAuth();
const slots = useSlots();

// 定义 props
const props = defineProps({
  // 媒体类型
  type: {
    type: String,
    default: 'image', // 'image' | 'video' | 'file'
    validator: (value) => ['image', 'video', 'file'].includes(value),
  },
  modelValue: {
    type: [String, Number, Array],
    default: () => [],
  },
  maxCount: {
    type: [String, Number],
    default: 9,
  },
  buttonUrl: {
    type: String,
    default: '',
  },
  mediaHeight: {
    type: Number,
    default: 150,
  },
  mediaWidth: {
    type: Number,
    default: 150,
  },
  // 预览样式配置
  previewStyle: {
    type: Object,
    default: () => ({}),
  },
  // 图片预览模式（仅 type='image' 时有效）
  previewImgMode: {
    type: String,
    default: 'aspectFill',
  },
  // 删除按钮样式
  deleteButtonStyle: {
    type: Object,
    default: () => ({
      width: '50rpx',
      height: '50rpx',
      background: 'rgba(0, 0, 0, 0.5)',
      borderRadius: '0',
    }),
  },
  // 是否显示上传时间
  showUploadTime: {
    type: Boolean,
    default: false,
  },
  // 接受的文件类型（仅 type='file' 时有效）
  acceptTypes: {
    type: Array,
    default: () => ['*'],
  },
  // 是否为预览模式
  previewMode: {
    type: Boolean,
    default: false,
  },
  // 视频封面后缀（仅 type='video' 时有效）
  videoSnapshotSuffix: {
    type: String,
    default: '?x-oss-process=video/snapshot,t_300,f_jpg,w_800,h_600,m_fast',
  },
  // 自定义删除图标 URL
  deleteIconUrl: {
    type: String,
    default: '',
  },
});

// 定义 emits
const emits = defineEmits(['update:modelValue', 'delete', 'preview', 'choose']);

// 归一化后的媒体列表
const mediaList = ref([]);
const mediaUploadTimes = ref({}); // 时间映射
const videoPopRef = ref(null);

// 媒体样式
const mediaStyle = computed(() => {
  return convertStyles({
    height: props.mediaHeight + 'rpx',
    width: props.mediaWidth + 'rpx',
  });
});

// 预览容器样式
const previewBoxStyle = computed(() => {
  return convertStyles(
    Object.assign(
      {
        width: props.mediaWidth + 'rpx',
        height: props.mediaHeight + 'rpx',
        margin: '0 24rpx 24rpx 0',
        borderRadius: '8rpx',
      },
      props.previewStyle
    )
  );
});

// 删除按钮样式
const deleteButtonBoxStyle = computed(() => {
  const defaultStyle = {
    width: '50rpx',
    height: '50rpx',
    // 如果传了自定义图片，默认使用透明背景；否则使用半透明黑色
    background: props.deleteIconUrl ? 'transparent' : 'rgba(0, 0, 0, 0.5)',
    borderRadius: '0',
  };
  return convertStyles(
    Object.assign({}, defaultStyle, props.deleteButtonStyle)
  );
});

/**
 * @description 获取项的 URL
 */
function getItemUrl(item) {
  return typeof item === 'string' ? item : item?.url || '';
}

/**
 * @description 计算上传时间显示
 */
function getUploadTime(item) {
  const url = getItemUrl(item);
  const uploadedAt = typeof item === 'object' ? item?.uploadedAt : undefined;
  const time = uploadedAt || mediaUploadTimes.value[url] || Date.now();
  const d = new Date(time);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${y}.${m}.${dd} ${hh}:${mm}`;
}

/**
 * @description 从文件路径中获取文件名
 */
function getFileNameFromPath(filePath) {
  if (!filePath) return '未知文件';
  const pathSeparators = ['/', '\\'];
  let fileName = filePath;
  let lastSeparatorIndex = -1;
  for (const separator of pathSeparators) {
    const index = filePath.lastIndexOf(separator);
    if (index > lastSeparatorIndex) {
      lastSeparatorIndex = index;
    }
  }
  if (lastSeparatorIndex >= 0) {
    fileName = filePath.substring(lastSeparatorIndex + 1);
  }
  return fileName;
}

/**
 * @description 从文件路径或MIME类型获取文件类型
 */
function getFileTypeFromPathOrMime(filePath, mimeType) {
  if (mimeType) return mimeType;

  if (filePath) {
    const fileName = getFileNameFromPath(filePath);
    const ext = fileName.split('.').pop().toLowerCase();
    const mimeMap = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      bmp: 'image/bmp',
      webp: 'image/webp',
      mp4: 'video/mp4',
      avi: 'video/avi',
      mov: 'video/quicktime',
      wmv: 'video/x-ms-wmv',
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ppt: 'application/vnd.ms-powerpoint',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      zip: 'application/zip',
      rar: 'application/x-rar-compressed',
      txt: 'text/plain',
    };
    return mimeMap[ext] || 'application/octet-stream';
  }

  return 'application/octet-stream';
}

/**
 * @description 获取文件图标
 */
function getFileIcon(fileType) {
  if (!fileType) return 'cuIcon-file';
  const type = fileType.toLowerCase();
  if (type.includes('image')) return 'cuIcon-image';
  if (type.includes('video')) return 'cuIcon-video';
  if (type.includes('audio')) return 'cuIcon-sound';
  if (type.includes('pdf')) return 'cuIcon-file';
  if (type.includes('word') || type.includes('doc')) return 'cuIcon-file';
  if (type.includes('excel') || type.includes('sheet')) return 'cuIcon-file';
  if (type.includes('powerpoint') || type.includes('ppt')) return 'cuIcon-file';
  if (type.includes('zip') || type.includes('rar')) return 'cuIcon-file';
  if (type.includes('text') || type.includes('txt')) return 'cuIcon-file';
  return 'cuIcon-file';
}

/**
 * @description 验证文件类型
 */
function validateFileType(fileName) {
  if (props.acceptTypes.includes('*')) return true;
  const actualFileName = getFileNameFromPath(fileName);
  const ext = actualFileName.split('.').pop().toLowerCase();
  return props.acceptTypes.some((type) => {
    if (type.startsWith('.')) {
      return type.substring(1) === ext;
    }
    return type.toLowerCase() === ext;
  });
}

/**
 * @description 选择媒体（统一入口）
 */
function handleChoose() {
  if (props.type === 'image') {
    handleChooseImage();
  } else if (props.type === 'video') {
    handleChooseVideo();
  } else if (props.type === 'file') {
    handleChooseFile();
  }
}

/**
 * @description 选择图片
 */
function handleChooseImage() {
  // #ifdef MP-WEIXIN
  uni.chooseImage({
    count: props.maxCount - mediaList.value.length,
    success: (res) => {
      emits('choose', res.tempFilePaths);
      uploadMedia(res.tempFilePaths);
    },
  });
  // #endif
  // #ifdef APP-PLUS || H5
  uni.showActionSheet({
    itemList: ['拍摄', '从相册选择'],
    success: (res) => {
      switch (res.tapIndex) {
        case 0:
          openAuth('CAMERA', 'camera');
          break;
        default:
          openAuth('WRITE_EXTERNAL_STORAGE', 'album');
          break;
      }
    },
  });
  // #endif
}

/**
 * @description 选择视频
 */
function handleChooseVideo() {
  // #ifdef APP-PLUS || H5
  uni.showActionSheet({
    itemList: ['拍摄', '从相册选择'],
    success: (res) => {
      switch (res.tapIndex) {
        case 0:
          openAuth('CAMERA', 'camera');
          break;
        default:
          openAuth('WRITE_EXTERNAL_STORAGE', 'album');
          break;
      }
    },
  });
  // #endif
  // #ifdef MP-WEIXIN
  uni.chooseVideo({
    sourceType: ['camera', 'album'],
    maxDuration: 60,
    success: (res) => {
      emits('choose', res.tempFilePath);
      uploadMedia([res.tempFilePath]);
    },
  });
  // #endif
}

/**
 * @description 选择文件
 */
function handleChooseFile() {
  // #ifdef MP-WEIXIN
  uni.chooseMessageFile({
    count: props.maxCount - mediaList.value.length,
    type: 'file',
    success: (res) => {
      const validFiles = res.tempFiles.filter((file) => {
        if (!validateFileType(file.name)) {
          uni.showToast({
            title: `不支持的文件类型: ${file.name}`,
            icon: 'none',
          });
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        emits('choose', validFiles);
        uploadMedia(validFiles);
      }
    },
  });
  // #endif

  // #ifdef APP-PLUS || H5
  openAuth('WRITE_EXTERNAL_STORAGE', 'file');
  // #endif
}

/**
 * @description 权限获取成功
 */
function changeAuth(type) {
  if (props.type === 'image') {
    uni.chooseImage({
      count: props.maxCount - mediaList.value.length,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: (res) => {
        emits('choose', res.tempFilePaths);
        uploadMedia(res.tempFilePaths);
      },
    });
  } else if (props.type === 'video') {
    uni.chooseVideo({
      sourceType: [type],
      maxDuration: 60,
      success: (res) => {
        emits('choose', res.tempFilePath);
        uploadMedia([res.tempFilePath]);
      },
    });
  } else if (props.type === 'file') {
    chooseFile({
      count: props.maxCount - mediaList.value.length,
      acceptTypes: props.acceptTypes,
      success: (files) => {
        const validFiles = files.filter((file) => {
          if (!validateFileType(file.name)) {
            uni.showToast({
              title: `不支持的文件类型: ${file.name}`,
              icon: 'none',
            });
            return false;
          }
          return true;
        });

        if (validFiles.length > 0) {
          emits('choose', validFiles);
          uploadMedia(validFiles);
        }
      },
      fail: (error) => {
        console.error('文件选择失败：', error);
        uni.showToast({
          title: error.errMsg || '文件选择失败',
          icon: 'none',
        });
      },
    });
  }
}

/**
 * @description 统一上传方法
 */
function uploadMedia(files) {
  const UploaderMap = {
    image: UploadImage,
    video: UploadVideo,
    file: UploadFile,
  };

  const Uploader = UploaderMap[props.type];
  const filesToUpload = props.type === 'video' ? files[0] : files;

  new Uploader(filesToUpload, {
    complete: (urls) => {
      const now = Date.now();
      let newItems = [];

      if (props.type === 'image') {
        newItems = urls.map((url) => ({
          url: url.fullurl || url,
          uploadedAt: now,
        }));
      } else if (props.type === 'video') {
        newItems = urls.map((url) => ({
          url: url,
          uploadedAt: now,
        }));
      } else if (props.type === 'file') {
        newItems = urls.map((urlData, index) => ({
          url: urlData.fullurl || urlData,
          name: getFileNameFromPath(
            files[index].path || files[index].name || ''
          ),
          type: getFileTypeFromPathOrMime(
            files[index].name || files[index].path,
            files[index].type
          ),
          uploadedAt: now,
        }));
      }

      newItems.forEach(
        (i) => (mediaUploadTimes.value[getItemUrl(i)] = i.uploadedAt)
      );
      mediaList.value = mediaList.value.concat(newItems);
      emits('update:modelValue', mediaList.value);
    },
  });
}

/**
 * @description 判断是否为文档类型
 */
function isDocumentType(fileType, fileName) {
  const documentMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
  ];

  if (fileType && documentMimeTypes.some((mime) => fileType.includes(mime))) {
    return true;
  }

  if (fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    const documentExtensions = [
      'pdf',
      'doc',
      'docx',
      'xls',
      'xlsx',
      'ppt',
      'pptx',
      'txt',
    ];
    return documentExtensions.includes(ext);
  }

  return false;
}

/**
 * @description 预览媒体（统一入口）
 */
function handlePreview(item) {
  emits('preview', item);

  if (props.type === 'image') {
    previewImage(item);
  } else if (props.type === 'video') {
    previewVideo(item);
  } else if (props.type === 'file') {
    previewFile(item);
  }
}

/**
 * @description 预览图片
 */
function previewImage(item) {
  const url = getItemUrl(item);
  uni.previewImage({
    urls: mediaList.value.map((i) => handleStaticFilePath(getItemUrl(i))),
    current: handleStaticFilePath(url),
  });
}

/**
 * @description 预览视频
 */
function previewVideo(item) {
  const url = getItemUrl(item);
  videoPopRef.value.show({
    videoUrl: url,
    autoplay: true,
    loop: false,
    muted: false,
  });
}

/**
 * @description 预览文件
 */
function previewFile(item) {
  const url = getItemUrl(item);
  const fileName = typeof item === 'object' ? item.name : '';
  const fileType = typeof item === 'object' ? item.type : '';

  // 图片类型：使用 uni.previewImage
  if (fileType.includes('image')) {
    uni.previewImage({
      urls: mediaList.value
        .filter((f) => {
          const type = typeof f === 'object' ? f.type : '';
          return type.includes('image');
        })
        .map((i) => handleStaticFilePath(getItemUrl(i))),
      current: handleStaticFilePath(url),
    });
    return;
  }

  // #ifdef APP-PLUS
  // APP端：文档类型使用 openDocument 打开
  if (isDocumentType(fileType, fileName)) {
    openDocument(handleStaticFilePath(url));
    return;
  }

  // APP端：其他文件类型在默认浏览器打开下载
  plus.runtime.openURL(handleStaticFilePath(url));
  // #endif

  // #ifdef H5 || MP-WEIXIN
  // H5和小程序端：提供下载选项
  uni.showModal({
    title: '文件预览',
    content: `文件名: ${fileName || '未知'}`,
    showCancel: true,
    cancelText: '取消',
    confirmText: '下载',
    success: (res) => {
      if (res.confirm) {
        // #ifdef H5
        window.open(handleStaticFilePath(url), '_blank');
        // #endif

        // #ifdef MP-WEIXIN
        uni.downloadFile({
          url: handleStaticFilePath(url),
          success: (downloadRes) => {
            if (downloadRes.statusCode === 200) {
              uni.showToast({
                title: '下载成功',
                icon: 'success',
              });
              if (isDocumentType(fileType, fileName)) {
                uni.openDocument({
                  filePath: downloadRes.tempFilePath,
                  showMenu: true,
                });
              }
            }
          },
          fail: (err) => {
            uni.showToast({
              title: '下载失败',
              icon: 'none',
            });
          },
        });
        // #endif
      }
    },
  });
  // #endif
}

/**
 * @description 删除媒体
 */
function handleDelete(index) {
  const typeTextMap = {
    image: '图片',
    video: '视频',
    file: '文件',
  };

  uni.showModal({
    title: '提示',
    content: `确定要删除这个${typeTextMap[props.type]}吗？`,
    confirmColor: DfColor,
    success: (res) => {
      if (res.confirm) {
        const deletedItem = mediaList.value[index];
        const url = getItemUrl(deletedItem);
        if (url) delete mediaUploadTimes.value[url];
        mediaList.value.splice(index, 1);
        emits('delete', deletedItem);
        emits('update:modelValue', mediaList.value);
      }
    },
  });
}

/**
 * @description 清空媒体
 */
function clearMedia() {
  mediaList.value = [];
  emits('update:modelValue', mediaList.value);
}

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      const list = Array.isArray(newVal) ? newVal : [newVal];
      let normalized = [];

      if (props.type === 'file') {
        // 文件类型需要更多信息
        normalized = list
          .map((item) => {
            if (typeof item === 'string' || typeof item === 'number') {
              return {
                url: String(item),
                name: getFileNameFromPath(String(item)),
                type: getFileTypeFromPathOrMime(String(item)),
                uploadedAt: undefined,
              };
            }
            return {
              url: item?.url || String(item),
              name:
                item?.name || getFileNameFromPath(item?.url || String(item)),
              type:
                item?.type ||
                getFileTypeFromPathOrMime(item?.url || String(item)),
              uploadedAt: item?.uploadedAt,
            };
          })
          .filter((i) => i.url);
      } else {
        // 图片和视频只需要 url 和 uploadedAt
        normalized = list
          .map((item) => {
            if (typeof item === 'string' || typeof item === 'number') {
              return { url: String(item), uploadedAt: undefined };
            }
            return {
              url: item?.url || String(item),
              uploadedAt: item?.uploadedAt,
            };
          })
          .filter((i) => i.url);
      }

      mediaList.value = normalized;

      // 同步时间映射并补齐缺失时间
      const now = Date.now();
      normalized.forEach((i) => {
        const url = getItemUrl(i);
        if (i.uploadedAt) {
          mediaUploadTimes.value[url] = i.uploadedAt;
        } else if (!mediaUploadTimes.value[url]) {
          mediaUploadTimes.value[url] = now;
          i.uploadedAt = now;
        } else {
          i.uploadedAt = mediaUploadTimes.value[url];
        }
      });
    } else {
      mediaList.value = [];
    }
  },
  { immediate: true }
);

// 暴露方法
defineExpose({
  clearMedia,
});
</script>

<style lang="scss">
@import './cu-media-upload.scss';
</style>
