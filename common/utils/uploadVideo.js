import { UPLOAD_FILE_URL } from '@/common/config.js';
import { toast } from '@/common/utils/util.js';
import { useUserStore } from '@/stores/user.js';

export default class UploadVideo {
  /**
   * @param {[Array]} files [选中的视频文件路径数组]
   * @param {[Object]} json [success每上传成功一个调用 complete全部上传完成调用]
   */
  constructor(files, json) {
    // 支持字符串或数组的文件参数，内部统一转为数组
    this.files = typeof files === 'string' ? [files] : files;
    if (!Array.isArray(this.files)) {
      throw new Error('Class UploadVideo parameter must be an array or string');
    }
    const userStore = useUserStore();
    this.data = [];
    this.fn = json.success;
    this.complete = json.complete;
    this.fileLen = this.files.length;
    this.curIndex = 0;
    this.userStore = userStore;
    uni.showLoading({
      title: '视频上传中',
    });
    this.upload();
  }

  upload() {
    uni.uploadFile({
      url: UPLOAD_FILE_URL, // 视频上传地址，和图片一致
      filePath: this.files[this.curIndex],
      name: 'file',
      header: {
        token: this.userStore.userInfo.token,
      },
      success: (res) => {
        let data = JSON.parse(res.data);
        if (data.code === 200) {
          this.data.push(data.result);
          if (this.fn) this.fn(this.data);
        } else {
          toast('视频上传失败，请重试');
        }
      },
      complete: () => {
        this.curIndex++;
        if (this.curIndex == this.fileLen) {
          this.complete(this.data);
          uni.hideLoading();
        } else {
          this.upload();
        }
      },
    });
  }
}
