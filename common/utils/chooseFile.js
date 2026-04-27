/**
 * @description 文件选择工具函数
 * 支持APP端(plus.io)和H5端(HTML5 input)
 */

/**
 * @description APP端文件选择（使用plus.io模块）
 * @param {Object} options 配置选项
 * @param {Number} options.count 最大选择数量
 * @param {Array} options.acceptTypes 接受的文件类型，如['.pdf', '.doc', '.docx']
 * @param {Function} options.success 成功回调
 * @param {Function} options.fail 失败回调
 */
function chooseFileForApp(options = {}) {
  const { count = 1, acceptTypes = ['*'], success, fail } = options;
  
  // #ifdef APP-PLUS
  // 使用plus.io打开文件选择器
  const dtask = plus.downloader.createDownload(
    'file:///sdcard/',
    { filename: '_doc/temp.txt' },
    (d, status) => {
      if (status == 200) {
        // 下载成功
      }
    }
  );
  
  // 请求文件系统
  plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, (fs) => {
    // 获取文档目录
    fs.root.getDirectory(
      '',
      { create: false },
      (entry) => {
        console.log('文档目录路径：' + entry.fullPath);
        
        // 创建文件读取器
        const reader = entry.createReader();
        
        // 读取目录内容
        reader.readEntries(
          (entries) => {
            console.log('读取到文件数量：' + entries.length);
            
            // 过滤文件类型
            let validFiles = entries.filter(file => {
              if (acceptTypes.includes('*')) return true;
              
              const fileName = file.name;
              const ext = '.' + fileName.split('.').pop().toLowerCase();
              return acceptTypes.some(type => {
                if (type.startsWith('.')) {
                  return type.toLowerCase() === ext;
                }
                return type.toLowerCase() === ext.substring(1);
              });
            });
            
            // 限制数量
            if (validFiles.length > count) {
              validFiles = validFiles.slice(0, count);
            }
            
            // 读取文件信息
            const fileInfos = [];
            let processedCount = 0;
            
            if (validFiles.length === 0) {
              if (fail) {
                fail({ errMsg: '没有找到符合条件的文件' });
              }
              return;
            }
            
            validFiles.forEach((fileEntry) => {
              fileEntry.file(
                (file) => {
                  fileInfos.push({
                    path: fileEntry.fullPath,
                    name: file.name,
                    size: file.size,
                    type: file.type || 'application/octet-stream',
                    lastModified: file.lastModifiedDate,
                  });
                  
                  processedCount++;
                  if (processedCount === validFiles.length) {
                    if (success) {
                      success(fileInfos);
                    }
                  }
                },
                (error) => {
                  console.error('读取文件失败：', error);
                  processedCount++;
                  if (processedCount === validFiles.length) {
                    if (success && fileInfos.length > 0) {
                      success(fileInfos);
                    } else if (fail) {
                      fail({ errMsg: '读取文件失败' });
                    }
                  }
                }
              );
            });
          },
          (error) => {
            console.error('读取目录失败：', error);
            if (fail) {
              fail({ errMsg: '读取目录失败：' + JSON.stringify(error) });
            }
          }
        );
      },
      (error) => {
        console.error('获取目录失败：', error);
        if (fail) {
          fail({ errMsg: '获取目录失败：' + JSON.stringify(error) });
        }
      }
    );
  }, (error) => {
    console.error('请求文件系统失败：', error);
    if (fail) {
      fail({ errMsg: '请求文件系统失败：' + JSON.stringify(error) });
    }
  });
  // #endif
}

/**
 * @description APP端使用Native UI选择文件（更好的用户体验）
 * @param {Object} options 配置选项
 */
function chooseFileForAppNative(options = {}) {
  const { count = 1, acceptTypes = ['*'], success, fail } = options;
  
  // #ifdef APP-PLUS
  try {
    // Android平台使用原生文件选择器
    if (uni.getSystemInfoSync().platform === 'android') {
      const Intent = plus.android.importClass('android.content.Intent');
      const Activity = plus.android.importClass('android.app.Activity');
      const activity = plus.android.runtimeMainActivity();
      
      const intent = new Intent(Intent.ACTION_GET_CONTENT);
      
      // 根据 acceptTypes 设置 MIME 类型
      let mimeType = '*/*';
      if (!acceptTypes.includes('*') && acceptTypes.length > 0) {
        // 将扩展名转换为 MIME 类型
        const mimeTypes = acceptTypes.map(type => {
          const ext = type.startsWith('.') ? type.substring(1) : type;
          return getMimeTypeFromExtension(ext);
        });
        
        // 如果只有一种类型，直接使用
        // 如果有多种类型，使用 */*（Android Intent 不支持多个 MIME 类型）
        if (mimeTypes.length === 1) {
          mimeType = mimeTypes[0];
        }
      }
      
      intent.setType(mimeType);
      intent.addCategory(Intent.CATEGORY_OPENABLE);
      
      // 支持多选
      if (count > 1) {
        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
      }
      
      // 设置请求码
      const REQUEST_CODE = 1001;
      
      // 保存原来的onActivityResult
      const originalOnActivityResult = activity.onActivityResult;
      
      // 设置结果回调
      activity.onActivityResult = function(requestCode, resultCode, data) {
        if (requestCode === REQUEST_CODE) {
          if (resultCode === Activity.RESULT_OK && data) {
            try {
              const fileInfos = [];
              const clipData = data.getClipData();
              
              if (clipData) {
                // 多选情况
                const itemCount = clipData.getItemCount();
                for (let i = 0; i < Math.min(itemCount, count); i++) {
                  const item = clipData.getItemAt(i);
                  const uri = item.getUri();
                  
                  // 从Content URI获取真实的文件信息
                  const fileInfo = getFileInfoFromContentUri(uri);
                  
                  // 尝试转换为本地路径，如果失败则使用原始URI
                  let filePath = uri.toString();
                  try {
                    const convertedPath = plus.io.convertAbsoluteFileSystem(filePath);
                    if (convertedPath && convertedPath.startsWith('file://')) {
                      filePath = convertedPath;
                    }
                  } catch (e) {
                    console.log('路径转换失败，使用原始URI：', e);
                  }
                  
                  fileInfos.push({
                    path: filePath,
                    name: fileInfo.name,
                    size: fileInfo.size,
                    type: fileInfo.type,
                  });
                }
              } else {
                // 单选情况
                const uri = data.getData();
                if (uri) {
                  // 从Content URI获取真实的文件信息
                  const fileInfo = getFileInfoFromContentUri(uri);
                  
                  // 尝试转换为本地路径，如果失败则使用原始URI
                  let filePath = uri.toString();
                  try {
                    const convertedPath = plus.io.convertAbsoluteFileSystem(filePath);
                    if (convertedPath && convertedPath.startsWith('file://')) {
                      filePath = convertedPath;
                    }
                  } catch (e) {
                    console.log('路径转换失败，使用原始URI：', e);
                  }
                  
                  fileInfos.push({
                    path: filePath,
                    name: fileInfo.name,
                    size: fileInfo.size,
                    type: fileInfo.type,
                  });
                }
              }
              
              if (fileInfos.length > 0 && success) {
                success(fileInfos);
              } else if (fail) {
                fail({ errMsg: '未获取到文件' });
              }
            } catch (error) {
              console.error('处理文件选择结果失败：', error);
              if (fail) {
                fail({ errMsg: '处理文件失败：' + error.message });
              }
            }
          } else {
            if (fail) {
              fail({ errMsg: '用户取消选择' });
            }
          }
          
          // 恢复原来的onActivityResult
          if (originalOnActivityResult) {
            activity.onActivityResult = originalOnActivityResult;
          }
        } else if (originalOnActivityResult) {
          // 其他请求码，调用原来的处理函数
          originalOnActivityResult.call(activity, requestCode, resultCode, data);
        }
      };
      
      // 启动文件选择器
      activity.startActivityForResult(intent, REQUEST_CODE);
      
    } else if (uni.getSystemInfoSync().platform === 'ios') {
      // iOS平台使用document picker
      // 注意：iOS需要在manifest.json中配置相应权限
      if (fail) {
        fail({ errMsg: 'iOS平台暂不支持该功能，请使用其他方式上传' });
      }
    }
  } catch (error) {
    console.error('启动文件选择器失败：', error);
    if (fail) {
      fail({ errMsg: '启动文件选择器失败：' + error.message });
    }
  }
  // #endif
}

/**
 * @description H5端文件选择（使用HTML5 input）
 * @param {Object} options 配置选项
 * @param {Number} options.count 最大选择数量
 * @param {Array} options.acceptTypes 接受的文件类型
 * @param {Function} options.success 成功回调
 * @param {Function} options.fail 失败回调
 */
function chooseFileForH5(options = {}) {
  const { count = 1, acceptTypes = ['*'], success, fail } = options;
  
  // 创建input元素
  const input = document.createElement('input');
  input.type = 'file';
  input.style.display = 'none';
  
  // 设置接受的文件类型
  if (!acceptTypes.includes('*')) {
    // 将 acceptTypes 转换为 HTML5 input accept 属性格式
    // 例如：['pdf', '.doc'] => '.pdf,.doc'
    const formattedTypes = acceptTypes.map(type => {
      if (type.startsWith('.')) {
        return type;
      }
      return '.' + type;
    });
    input.accept = formattedTypes.join(',');
  }
  
  // 设置是否多选
  if (count > 1) {
    input.multiple = true;
  }
  
  // 监听文件选择
  input.addEventListener('change', (e) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      const fileInfos = [];
      const maxFiles = Math.min(files.length, count);
      
      for (let i = 0; i < maxFiles; i++) {
        const file = files[i];
        
        // 创建临时URL
        const tempPath = URL.createObjectURL(file);
        
        fileInfos.push({
          path: tempPath,
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          lastModified: file.lastModified,
          rawFile: file, // 保存原始File对象，方便后续上传
        });
      }
      
      if (success) {
        success(fileInfos);
      }
    } else {
      if (fail) {
        fail({ errMsg: '未选择文件' });
      }
    }
    
    // 移除input元素
    document.body.removeChild(input);
  });
  
  // 监听取消
  input.addEventListener('cancel', () => {
    if (fail) {
      fail({ errMsg: '用户取消选择' });
    }
    document.body.removeChild(input);
  });
  
  // 添加到DOM并触发点击
  document.body.appendChild(input);
  input.click();
}

/**
 * @description 根据扩展名获取MIME类型
 * @param {String} extension 文件扩展名（不带点）
 * @returns {String} MIME类型
 */
function getMimeTypeFromExtension(extension) {
  const ext = extension.toLowerCase();
  const mimeMap = {
    // 文档类型
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'txt': 'text/plain',
    
    // 图片类型
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'bmp': 'image/bmp',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    
    // 视频类型
    'mp4': 'video/mp4',
    'avi': 'video/x-msvideo',
    'mov': 'video/quicktime',
    'wmv': 'video/x-ms-wmv',
    'flv': 'video/x-flv',
    
    // 音频类型
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'ogg': 'audio/ogg',
    
    // 压缩文件
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
  };
  
  return mimeMap[ext] || 'application/octet-stream';
}

/**
 * @description 从URI中获取文件名
 * @param {String} uri 文件URI
 * @returns {String} 文件名
 */
function getFileNameFromUri(uri) {
  if (!uri) return '未知文件';
  
  const pathSeparators = ['/', '\\'];
  let fileName = uri;
  
  let lastSeparatorIndex = -1;
  for (const separator of pathSeparators) {
    const index = uri.lastIndexOf(separator);
    if (index > lastSeparatorIndex) {
      lastSeparatorIndex = index;
    }
  }
  
  if (lastSeparatorIndex >= 0) {
    fileName = uri.substring(lastSeparatorIndex + 1);
  }
  
  return fileName;
}

/**
 * @description 从Android Content URI获取真实的文件信息
 * @param {Object} uri Android Uri对象
 * @returns {Object} 文件信息 { name, size, type }
 */
function getFileInfoFromContentUri(uri) {
  // #ifdef APP-PLUS
  try {
    // 如果传入的是字符串，需要转换为 Uri 对象
    let androidUri = uri;
    if (typeof uri === 'string') {
      const Uri = plus.android.importClass('android.net.Uri');
      androidUri = Uri.parse(uri);
    }
    
    const activity = plus.android.runtimeMainActivity();
    const ContentResolver = activity.getContentResolver();
    
    // 导入OpenableColumns类，这是标准的列名定义
    const OpenableColumns = plus.android.importClass('android.provider.OpenableColumns');
    
    // 使用null作为projection，让系统返回所有可用列
    // 在plus.android中，需要使用invoke来调用Java方法
    const cursor = plus.android.invoke(ContentResolver, 'query', androidUri, null, null, null, null);
    
    if (!cursor) {
      return {
        name: '未知文件',
        size: 0,
        type: 'application/octet-stream'
      };
    }
    
    const moveResult = plus.android.invoke(cursor, 'moveToFirst');
    
    if (moveResult) {
      // 读取数据
      let fileName = '未知文件';
      let fileSize = 0;
      let mimeType = 'application/octet-stream';
      
      try {
        // 使用OpenableColumns标准列名获取文件名
        const nameIndex = plus.android.invoke(cursor, 'getColumnIndex', OpenableColumns.DISPLAY_NAME);
        if (nameIndex >= 0) {
          const name = plus.android.invoke(cursor, 'getString', nameIndex);
          if (name) {
            fileName = name;
          }
        }
      } catch (e) {
        console.error('获取文件名失败：', e);
      }
      
      try {
        // 使用OpenableColumns标准列名获取文件大小
        const sizeIndex = plus.android.invoke(cursor, 'getColumnIndex', OpenableColumns.SIZE);
        if (sizeIndex >= 0) {
          fileSize = plus.android.invoke(cursor, 'getLong', sizeIndex);
        }
      } catch (e) {
        console.error('获取文件大小失败：', e);
      }
      
      try {
        // 获取MIME类型（通过ContentResolver.getType方法）
        const type = plus.android.invoke(ContentResolver, 'getType', androidUri);
        if (type) {
          mimeType = type;
        }
      } catch (e) {
        console.error('获取文件类型失败：', e);
      }
      
      plus.android.invoke(cursor, 'close');
      
      return {
        name: fileName,
        size: fileSize,
        type: mimeType
      };
    } else {
      plus.android.invoke(cursor, 'close');
    }
  } catch (error) {
    console.error('从ContentResolver获取文件信息失败：', error);
  }
  // #endif
  
  // 失败时返回默认值
  return {
    name: '未知文件',
    size: 0,
    type: 'application/octet-stream'
  };
}

/**
 * @description 统一的文件选择函数（自动判断平台）
 * @param {Object} options 配置选项
 * @param {Number} options.count 最大选择数量，默认1
 * @param {Array} options.acceptTypes 接受的文件类型，默认['*']，例如['.pdf', '.doc', '.docx']
 * @param {Function} options.success 成功回调，返回文件信息数组
 * @param {Function} options.fail 失败回调
 * @returns {Promise} 返回Promise对象
 */
export function chooseFile(options = {}) {
  return new Promise((resolve, reject) => {
    const opts = {
      count: options.count || 1,
      acceptTypes: options.acceptTypes || ['*'],
      success: (files) => {
        if (options.success) {
          options.success(files);
        }
        resolve(files);
      },
      fail: (error) => {
        if (options.fail) {
          options.fail(error);
        }
        reject(error);
      },
    };
    
    // #ifdef APP-PLUS
    // APP端使用原生文件选择器（更好的用户体验）
    chooseFileForAppNative(opts);
    // #endif
    
    // #ifdef H5
    // H5端使用HTML5 input
    chooseFileForH5(opts);
    // #endif
    
    // #ifdef MP-WEIXIN
    // 小程序端使用uni.chooseMessageFile
    uni.chooseMessageFile({
      count: opts.count,
      type: 'file',
      success: (res) => {
        opts.success(res.tempFiles);
      },
      fail: (error) => {
        opts.fail(error);
      },
    });
    // #endif
  });
}

export default {
  chooseFile,
  chooseFileForApp,
  chooseFileForAppNative,
  chooseFileForH5,
};

