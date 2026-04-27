import { UPLOAD_FILE_URL } from '@/common/config.js'
// import { message } from './message.js'
import { toast } from '@/common/utils/util.js'
import {
	useUserStore
} from '@/stores/user.js';

export default class UploadFile {
  /**
   * [constructor description]
   * @param  {[Array]} files [chooseFile选中的tempFiles]
   * @param  {[Object]} json  [success每上传成功一个调用 complete全部上传完成调用]
   * @return {[void]}       [description]
   */
  constructor(files, json) {
    if (!Array.isArray(files)) {
      throw new Error('Class UploadFile parameter must be an array');
    }
		// 载用户Store
		const userStore = useUserStore();
    this.data = [];
    this.fn = json.success;
    this.complete = json.complete;
    this.files = files;
    this.fileLen = this.files.length;
    this.curIndex = 0;
		this.userStore = userStore;
		
    uni.showLoading({
      title: '上传中'
    });
    this.upload();
  }

  upload() {
    const currentFile = this.files[this.curIndex];
    
    // H5端特殊处理：使用原始File对象
    // #ifdef H5
    if (currentFile.rawFile) {
      this.uploadH5File(currentFile);
      return;
    }
    // #endif
    
    // 其他平台使用uni.uploadFile
    // 注意：uni.uploadFile支持content://协议的路径
    uni.uploadFile({
      url: UPLOAD_FILE_URL,
      filePath: currentFile.path,
      name: 'file',
      // 如果有文件名，通过formData传递，帮助服务器识别
      formData: currentFile.name ? {
        fileName: currentFile.name
      } : {},
      header: {
        'token': this.userStore.userInfo.token	
      },
      success: res => {
        let data = JSON.parse(res.data);
        if (data.code === 200) {
          this.data.push(data.result);
          if (this.fn) this.fn(this.data);
        } else {
          toast('文件上传失败，请重试');
        }
      },
      fail: err => {
        console.error('文件上传失败：', err);
        toast('文件上传失败：' + (err.errMsg || '请重试'));
      },
      complete: () => {
        this.curIndex++;                                    // 这个文件执行完上传后，开始上传下一个
        if (this.curIndex == this.fileLen) {                // 当文件传完时，停止调用
          this.complete(this.data);
          uni.hideLoading()
        } else {                                            // 若文件还没有传完，则继续调用函数
          this.upload();
        }
      }
    });
	}
	
	/**
	 * H5端使用原生FormData上传文件
	 * @param {Object} fileInfo 文件信息对象
	 */
	uploadH5File(fileInfo) {
		const formData = new FormData();
		formData.append('file', fileInfo.rawFile, fileInfo.name);
		
		// 使用原生fetch上传
		fetch(UPLOAD_FILE_URL, {
			method: 'POST',
			headers: {
				'token': this.userStore.userInfo.token
			},
			body: formData
		})
		.then(response => response.json())
		.then(data => {
			if (data.code === 200) {
				this.data.push(data.result);
				if (this.fn) this.fn(this.data);
			} else {
				toast('文件上传失败，请重试');
			}
		})
		.catch(error => {
			console.error('上传失败：', error);
			toast('文件上传失败，请重试');
		})
		.finally(() => {
			this.curIndex++;
			if (this.curIndex == this.fileLen) {
				this.complete(this.data);
				uni.hideLoading();
			} else {
				this.upload();
			}
		});
	}
}
