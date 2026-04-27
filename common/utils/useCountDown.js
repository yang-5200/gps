import { ref, onUnmounted } from 'vue';
import { validate } from '@/common/utils/validate';
import { toast, loading } from '@/common/utils/util.js';
import{http, urls} from '@/common/api/index.js'

/**
 * 获取验证码倒计时
 * @param {number} duration - 倒计时的总时长（秒）
 * @returns {Object} - 返回一个对象，包含countDown和start方法
 */
export default function useCountDown(duration = 60) {
  const countDown = ref(0);
  let timer = null; // 存储定时器
  const downTimeStr = ref('获取验证码'); // 倒计时的显示文本

  onUnmounted(() => {
    if (timer) {
      clearInterval(timer);
    }
  });

  /**
   * @description 开始倒计时
   * @returns void
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
   * @description 发送验证码
   * @param {string} phone 手机号
	 * @returns void
   */
  function sendCode(phone) {
		if(countDown.value > 0) return toast(downTimeStr.value);
		if(!validate(phone, 'null')) return toast('请输入手机号');
		if(!validate(phone, 'phone')) return toast('手机号格式错误');
		
    return new Promise((resolve, reject) => {
      loading('发送中...');
			let data = {}
			let apiUrl = ''
			
			apiUrl = urls.sendSms
			data = {
				phone: phone,
				// type: event
			}
			console.log(apiUrl);
			http.post(apiUrl, data).then(res => {
        uni.hideLoading();
        if(res.code === 200){
          start();
					toast('发送成功', 'success')
        }
				resolve(res);
      }).catch(err => {
				reject(err);
        uni.hideLoading();
        //console.log(err);
        toast(`请求错误：`+ (err.msg || err.message))
      })
    });
  }


  return {
    sendCode,
    downTimeStr
  };
}