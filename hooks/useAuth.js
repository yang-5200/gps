import { ref, onMounted } from 'vue';
// import { silentReload } from '@/service/request/main.js';

export function useAuth() {
	// 权限相关状态
	const permissionID = ref('');
	const permissionFromType = ref('');
	const authPupRef = ref(null);

	/**
	 * 打开自定义权限目的弹框
	 * @param {String} id - 权限ID
	 * @param {String} fromType - 权限来源类型
	 */
	function openAuth(id, fromType) {
		permissionID.value = id; // 这个是对应的权限 ACCESS_FINE_LOCATION 位置权限 / WRITE_EXTERNAL_STORAGE 存储空间/照片权限 / CAMERA相机权限 / CALL_PHONE 拨打电话
		permissionFromType.value = fromType;
		setTimeout(() => {
			if (authPupRef.value) {
				//console.log(authPupRef.value, 'authPupRef.valueauthPupRef.value');
				authPupRef.value.open();
			}
		}, 300);
	}

	return {
		permissionID,
		permissionFromType,
		authPupRef,
		openAuth
	};
}