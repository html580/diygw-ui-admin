<template>
	<div class="personal">
		<el-row>
			<!-- 个人信息 -->
			<el-col :xs="24" :sm="16">
				<el-card shadow="hover" header="个人信息">
					<div class="personal-user">
						<div class="personal-user-left">
							<el-upload class="h100 personal-user-left-upload" action="https://jsonplaceholder.typicode.com/posts/" multiple :limit="1">
								<el-image class="system-user-photo" :src="userInfos.photo ? userInfos.photo : letterAvatar(userInfos.userName)"></el-image>

							</el-upload>
						</div>
						<div class="personal-user-right">
							<el-row>
								<el-col :span="24" class="personal-title mb18">{{ currentTime }}，{{userInfos.userName}}，生活变的再糟糕，也不妨碍我变得更好！ </el-col>
								<el-col :span="24">
									<el-row>
										<el-col :xs="24" :sm="8" class="personal-item mb6">
											<div class="personal-item-label">昵称：</div>
											<div class="personal-item-value">{{userInfos.nickname}}</div>
										</el-col>
										<el-col :xs="24" :sm="16" class="personal-item mb6">
											<div class="personal-item-label">身份：</div>
											<div class="personal-item-value">超级管理</div>
										</el-col>
									</el-row>
								</el-col>
								<el-col :span="24">
									<el-row>
										<el-col :xs="24" :sm="8" class="personal-item mb6">
											<div class="personal-item-label">登录IP：</div>
											<div class="personal-item-value">192.168.1.1</div>
										</el-col>
										<el-col :xs="24" :sm="16" class="personal-item mb6">
											<div class="personal-item-label">登录时间：</div>
											<div class="personal-item-value">2021-02-05 18:47:26</div>
										</el-col>
									</el-row>
								</el-col>
							</el-row>
						</div>
					</div>
				</el-card>
			</el-col>

			<!-- 消息通知 -->
			<el-col :xs="24" :sm="8" class="pl15 personal-info">
				<el-card shadow="hover">
					<template #header>
						<span>消息通知</span>
						<span class="personal-info-more">更多</span>
					</template>
					<div class="personal-info-box">
						<ul class="personal-info-ul">
							<li v-for="(v, k) in newsInfoList" :key="k" class="personal-info-li">
								<a :href="v.link" target="_block" class="personal-info-li-title">{{ v.title }}</a>
							</li>
						</ul>
					</div>
				</el-card>
			</el-col>

			<!-- 营销推荐 -->
			<!-- <el-col :span="24">
				<el-card shadow="hover" class="mt15" header="营销推荐">
					<el-row :gutter="15" class="personal-recommend-row">
						<el-col :sm="6" v-for="(v, k) in recommendList" :key="k" class="personal-recommend-col">
							<div class="personal-recommend" :style="{ 'background-color': v.bg }">
								<SvgIcon :name="v.icon" :size="70" :style="{ color: v.iconColor }" />
								<div class="personal-recommend-auto">
									<div>{{ v.title }}</div>
									<div class="personal-recommend-msg">{{ v.msg }}</div>
								</div>
							</div>
						</el-col>
					</el-row>
				</el-card>
			</el-col> -->

			<!-- 更新信息 -->
			<el-col :span="24">
				<el-card shadow="hover" class="mt15 personal-edit" header="更新信息">
					<!-- <div class="personal-edit-title">基本信息</div>
					<el-form :model="personalForm" size="default" label-width="40px" class="mt35 mb35">
						<el-row :gutter="35">
							<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
								<el-form-item label="昵称">
									<el-input v-model="personalForm.name" placeholder="请输入昵称" clearable></el-input>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
								<el-form-item label="邮箱">
									<el-input v-model="personalForm.email" placeholder="请输入邮箱" clearable></el-input>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
								<el-form-item label="签名">
									<el-input v-model="personalForm.autograph" placeholder="请输入签名" clearable></el-input>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
								<el-form-item label="职业">
									<el-select v-model="personalForm.occupation" placeholder="请选择职业" clearable class="w100">
										<el-option label="计算机 / 互联网 / 通信" value="1"></el-option>
										<el-option label="生产 / 工艺 / 制造" value="2"></el-option>
										<el-option label="医疗 / 护理 / 制药" value="3"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
								<el-form-item label="手机">
									<el-input v-model="personalForm.phone" placeholder="请输入手机" clearable></el-input>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
								<el-form-item label="性别">
									<el-select v-model="personalForm.sex" placeholder="请选择性别" clearable class="w100">
										<el-option label="男" value="1"></el-option>
										<el-option label="女" value="2"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
								<el-form-item>
									<el-button type="primary">
										<el-icon>
											<ele-Position />
										</el-icon>
										更新个人信息
									</el-button>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form> -->
					<div class="personal-edit-title mb15">账号安全</div>
					<div class="personal-edit-safe-box">
						<div class="personal-edit-safe-item">
							<div class="personal-edit-safe-item-left">
								<div class="personal-edit-safe-item-left-label">账户密码</div>
								<!-- <div class="personal-edit-safe-item-left-value">当前密码强度：强</div> -->
							</div>
							<div class="personal-edit-safe-item-right">
								<el-button text type="primary" @click="passwordDialog=true">立即修改</el-button>
							</div>
						</div>
					</div>
					<!-- <div class="personal-edit-safe-box">
						<div class="personal-edit-safe-item">
							<div class="personal-edit-safe-item-left">
								<div class="personal-edit-safe-item-left-label">密保手机</div>
								<div class="personal-edit-safe-item-left-value">已绑定手机：132****4108</div>
							</div>
							<div class="personal-edit-safe-item-right">
								<el-button text type="primary">立即修改</el-button>
							</div>
						</div>
					</div>
					<div class="personal-edit-safe-box">
						<div class="personal-edit-safe-item">
							<div class="personal-edit-safe-item-left">
								<div class="personal-edit-safe-item-left-label">密保问题</div>
								<div class="personal-edit-safe-item-left-value">已设置密保问题，账号安全大幅度提升</div>
							</div>
							<div class="personal-edit-safe-item-right">
								<el-button text type="primary">立即设置</el-button>
							</div>
						</div>
					</div>
					<div class="personal-edit-safe-box">
						<div class="personal-edit-safe-item">
							<div class="personal-edit-safe-item-left">
								<div class="personal-edit-safe-item-left-label">绑定QQ</div>
								<div class="personal-edit-safe-item-left-value">已绑定QQ：110****566</div>
							</div>
							<div class="personal-edit-safe-item-right">
								<el-button text type="primary">立即设置</el-button>
							</div>
						</div>
					</div> -->
				</el-card>
			</el-col>
		</el-row>

		<el-dialog title="修改密码" width="600px" v-model="passwordDialog" modal close-on-click-modal close-on-press-escape show-close>
			<div class="flex flex-wrap diygw-col-24">
				<el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordFormRules" label-width="120px" label-postition="right" class="flex flex-wrap diygw-col-24">
					<div class="flex diygw-col-24">
						<el-form-item class="diygw-el-rate" label="旧密码" prop="password">
							<el-input type="password" placeholder="请输入提示" v-model="passwordForm.password"> </el-input>
						</el-form-item>
					</div>
					<div class="flex diygw-col-24">
						<el-form-item class="diygw-el-rate" label="新密码" prop="newpassword">
							<el-input type="password" placeholder="请输入提示" v-model="passwordForm.newpassword"> </el-input>
						</el-form-item>
					</div>
					<div class="flex diygw-col-24">
						<el-form-item class="diygw-el-rate" label="再次输入密码" prop="confirmpassword">
							<el-input type="password" placeholder="请输入提示" v-model="passwordForm.confirmpassword"> </el-input>
						</el-form-item>
					</div>
				</el-form>
			</div>
			<template #footer>
				<div class="dialog-footer flex justify-end"><el-button type="danger" @click="passwordDialog = false"> 取消 </el-button> <el-button type="primary" @click="submitForm"> 确定 </el-button></div>
			</template>
		</el-dialog>

	</div>
</template>

<script lang="ts">
import { toRefs, reactive, computed, defineComponent } from 'vue';
import { formatAxis } from '@/utils/formatTime';
import { newsInfoList, recommendList } from './mock';
import { letterAvatar } from '@/utils/index';
import { storeToRefs } from 'pinia';
import { useUserInfo } from '@/stores/userInfo';
import { postData } from '@/api';
import { ElMessage } from 'element-plus';

const stores = useUserInfo();
const { userInfos } = storeToRefs(stores);
// 定义接口来定义对象的类型
interface PersonalState {
	passwordFormRef:any,
	passwordDialog: boolean;
	newsInfoList: any;
	recommendList: any;
	personalForm: any;
	passwordFormRules: any;
	passwordForm: any
}

export default defineComponent({
	name: 'personal',
	setup() {
		const state = reactive<PersonalState>({
			passwordFormRef:null,
			newsInfoList,
			recommendList,
			passwordDialog: false,
			passwordFormRules: {
				password: [
					{
						trigger: ['blur','change'],
						required: true,
						message: '旧密码不能为空哟'
					}
				],
				newpassword: [
					{
						trigger: ['blur','change'],
						required: true,
						message: '新密码不能为空哟'
					},{
						trigger: ['chanage', 'blur'],
						message: '请输入新的密码，不能与旧密码一致',
						validator: (rule:any, val:any, callback:any) => {
							return val != state.passwordForm.password;
						}
					}
				],
				confirmpassword: [
					{
						trigger: ['blur','change'],
						required: true,
						message: '再次输入密码不能为空哟'
					},{
						trigger: ['chanage', 'blur'],
						message: '输入新密码不一致',
						validator: (rule:any, val:any, callback:any) => {
							return val == state.passwordForm.newpassword;
						}
					}
				]
			},
			passwordForm: {
				password: '',
				newpassword: '',
				confirmpassword: ''
			},
			personalForm: {
				name: '',
				email: '',
				autograph: '',
				occupation: '',
				phone: '',
				sex: '',
			},
		});
		// 当前时间提示语
		const currentTime = computed(() => {
			return formatAxis(new Date());
		});

		const submitForm = async () => {
			if (!state.passwordFormRef) return;
			await state.passwordFormRef.validate((valid:any, fields:any) => {
				if (valid) {
					postData('/admin/index/changePassword',state.passwordForm).then(res=>{
						ElMessage.success(res.msg);
						state.passwordDialog = false
					}).then((res:any)=>{
						ElMessage.error(res.msg);
					})
					console.log('submit!');
				} else {
					console.log('error submit!', fields);
				}
			});
		};

		return {
			submitForm,
			currentTime,
			userInfos,
			letterAvatar,
			...toRefs(state),
		};
	},
});
</script>

<style scoped lang="scss">
@import '../../theme/mixins/index.scss';
.personal {

	.system-user-photo {
		border-radius: 100%;
	}
	.personal-user {
		height: 130px;
		display: flex;
		align-items: center;
		.personal-user-left {
			width: 100px;
			height: 130px;
			border-radius: 3px;
			::v-deep(.el-upload) {
				height: 100%;
			}
			.personal-user-left-upload {
				img {
					width: 100%;
					height: 100%;
					border-radius: 3px;
				}
				&:hover {
					img {
						animation: logoAnimation 0.3s ease-in-out;
					}
				}
			}
		}
		.personal-user-right {
			flex: 1;
			padding: 0 15px;
			.personal-title {
				font-size: 18px;
				@include text-ellipsis(1);
			}
			.personal-item {
				display: flex;
				align-items: center;
				font-size: 13px;
				.personal-item-label {
					color: var(--el-text-color-secondary);
					@include text-ellipsis(1);
				}
				.personal-item-value {
					@include text-ellipsis(1);
				}
			}
		}
	}
	.personal-info {
		.personal-info-more {
			float: right;
			color: var(--el-text-color-secondary);
			font-size: 13px;
			&:hover {
				color: var(--el-color-primary);
				cursor: pointer;
			}
		}
		.personal-info-box {
			height: 130px;
			overflow: hidden;
			.personal-info-ul {
				list-style: none;
				.personal-info-li {
					font-size: 13px;
					padding-bottom: 10px;
					.personal-info-li-title {
						display: inline-block;
						@include text-ellipsis(1);
						color: var(--el-text-color-secondary);
						text-decoration: none;
					}
					& a:hover {
						color: var(--el-color-primary);
						cursor: pointer;
					}
				}
			}
		}
	}
	.personal-recommend-row {
		.personal-recommend-col {
			.personal-recommend {
				position: relative;
				height: 100px;
				border-radius: 3px;
				overflow: hidden;
				cursor: pointer;
				&:hover {
					i {
						right: 0px !important;
						bottom: 0px !important;
						transition: all ease 0.3s;
					}
				}
				i {
					position: absolute;
					right: -10px;
					bottom: -10px;
					font-size: 70px;
					transform: rotate(-30deg);
					transition: all ease 0.3s;
				}
				.personal-recommend-auto {
					padding: 15px;
					position: absolute;
					left: 0;
					top: 5%;
					color: var(--next-color-white);
					.personal-recommend-msg {
						font-size: 12px;
						margin-top: 10px;
					}
				}
			}
		}
	}
	.personal-edit {
		.personal-edit-title {
			position: relative;
			padding-left: 10px;
			color: var(--el-text-color-regular);
			&::after {
				content: '';
				width: 2px;
				height: 10px;
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				background: var(--el-color-primary);
			}
		}
		.personal-edit-safe-box {
			border-bottom: 1px solid var(--el-border-color-light, #ebeef5);
			padding: 15px 0;
			.personal-edit-safe-item {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.personal-edit-safe-item-left {
					flex: 1;
					overflow: hidden;
					.personal-edit-safe-item-left-label {
						color: var(--el-text-color-regular);
						margin-bottom: 5px;
					}
					.personal-edit-safe-item-left-value {
						color: var(--el-text-color-secondary);
						@include text-ellipsis(1);
						margin-right: 15px;
					}
				}
			}
			&:last-of-type {
				padding-bottom: 0;
				border-bottom: none;
			}
		}
	}
}
</style>
