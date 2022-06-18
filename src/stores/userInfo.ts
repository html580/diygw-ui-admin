import { defineStore } from 'pinia';
import { UserInfosStates } from './interface';
import { Session } from '@/utils/storage';

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfo = defineStore('userInfo', {
	state: (): UserInfosStates => ({
		userInfos: {
			userName: '',
			nickname: '',
			photo: '',
			time: 0,
			roles: [],
			authBtnList: [],
		},
	}),
	actions: {
		async setUserInfos() {
			if (Session.get('userInfo')) {
				this.userInfos = Session.get('userInfo');
			}
		},
	},
});
