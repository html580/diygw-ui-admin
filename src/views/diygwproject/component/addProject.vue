<template>
	<div class="admin-add-project-container">
		<el-dialog :title="project.id ? '修改应用' : '新增应用'" v-model="isShowDialog" width="800px">
			<el-form :model="project" ref="projectForm" size="default" :rules="projectRules" label-width="120px">
				<el-row :gutter="35">
					<el-col class="mb20" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item label="应用名称" prop="title">
							<el-input v-model="project.title" placeholder="请输入应用名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col class="mb20" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item label="微信分享标题" prop="shareTitle">
							<el-input v-model="project.shareTitle" placeholder="请输入微信分享标题" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col class="mb20" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<diygw-image label="微信分享图片" propname="shareImg" v-model="project.shareImg" />
					</el-col>
					<el-col class="mb20" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item label="是否微信打开" prop="title">
							<el-radio-group v-model="project.isWeixin" size="default">
								<el-radio-button label="0">否</el-radio-button>
								<el-radio-button label="1">是</el-radio-button>
							</el-radio-group>
							<el-tooltip hide-after="0" effect="dark" content="开启后只能在微信里打开" placement="top">
								<SvgIcon name="ele-QuestionFilled" :size="20" />
							</el-tooltip>
						</el-form-item>
					</el-col>
					<el-col class="mb20" :xs="24">
						<el-form-item label="微信分享描述" prop="shareDesc">
							<el-input v-model="project.shareDesc" type="textarea" placeholder="请输入微信分享描述" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col class="mb20" :xs="24">
						<el-form-item class="diygw-input-addon" label="密码访问" prop="pwd">
							<el-input v-model="project.pwd" placeholder="自定义密码后，用户需输入密码才能访问" clearable>
								<template #append>
									<el-tooltip hide-after="0" effect="dark" content="用户访问应用前必须输入设置的密码才能进入" placement="top">
										<SvgIcon name="ele-QuestionFilled" :size="20" />
									</el-tooltip>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="mb20" v-if="project.pwd" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item class="diygw-input-addon" label="密码输入提示" prop="pwdTip">
							<el-input v-model="project.pwdTip" placeholder="请输入密码" clearable> </el-input>
						</el-form-item>
					</el-col>
					<el-col class="mb20" v-if="project.pwd" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item class="diygw-input-addon" label="输入错误提示" prop="pwdErrMsg">
							<el-input v-model="project.pwdErrMsg" placeholder="抱歉，您输入的密码有误" clearable> </el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<!-- <el-row :gutter="35">
					<el-col class="mb20">
						<el-form-item label="" prop="title">
							<el-input v-model="project.title" placeholder="请输入应用名称" clearable></el-input>
						</el-form-item>
					</el-col>
				</el-row> -->
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ project.id ? '修 改' : '新 增' }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent } from 'vue';
import { postData } from '@/api/index';
import { ElMessage } from 'element-plus';
import DiygwImage from '@/components/image/index.vue';
import { deepClone } from '@/utils/other';
import * as CryptoTS from 'crypto-ts';
// 定义接口来定义对象的类型
interface MenuDataTree {
	id: number;
	label: string;
	children?: MenuDataTree[];
}

export default defineComponent({
	name: 'adminAddProject',
	components: {
		DiygwImage,
	},
	setup(props, { emit }) {
		let projectInit = {
			id: '',
			title: '', // 应用名称
			shareTitle: '',
			shareDesc: '',
			isWeixin: 0,
			shareImg: '',
			pwd: '',
			pwdTip: '请输入密码',
			pwdErrMsg: '抱歉，您输入的密码有误',
		};
		const state = reactive({
			projectForm: null,
			isShowDialog: false,
			project: projectInit,
			projectRules: {
				title: { required: true, message: '应用名称不能为空', trigger: 'blur' },
			},
		});
		// 打开弹窗
		const openDialog = (project = null) => {
			if (project) {
				let configs = JSON.parse(project.inits);
				if (configs.pwd) {
					let bytes = CryptoTS.AES.decrypt(configs.pwd, 'diygwcom');
					if (bytes) {
						configs.pwd = bytes.toString(CryptoTS.enc.Utf8);
					} else {
						configs.pwd = '';
					}
				}
				configs.id = project.id;
				state.project = configs;
			} else {
				state.project = deepClone(projectInit);
			}
			state.isShowDialog = true;
		};
		// 关闭弹窗
		const closeDialog = () => {
			state.isShowDialog = false;
		};
		// 取消
		const onCancel = () => {
			closeDialog();
		};
		// 新增
		const onSubmit = () => {
			state.projectForm.validate((valid) => {
				if (valid) {
					let project = deepClone(state.project);
					let keys = ['configs', 'groups', 'globals', 'inits'];
					for (const key in keys) {
						delete project[key];
					}
					if (project.pwd) {
						let encryptedData = CryptoTS.AES.encrypt(project.pwd, 'diygwcom');
						project.pwd = encryptedData.toString();
					}
					let data = {
						title:project.title,
						inits: JSON.stringify(project),
						id:project.id
					}
					
					postData(state.project.id ? '/admin/project/update' : '/admin/project/add', data).then((res) => {
						if (res.code == 200) {
							ElMessage.success(res.msg);
							closeDialog();
							emit('refresh');
						} else {
							ElMessage.error(res.msg);
						}
					});
				}
			});
		};

		return {
			openDialog,
			closeDialog,
			onCancel,
			onSubmit,
			...toRefs(state),
		};
	},
});
</script>

<style scoped lang="scss">
.admin-add-project-container {
	.menu-data-tree {
		border: var(--el-input-border, var(--el-border-base));
		border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
		padding: 5px;
	}
}
</style>
