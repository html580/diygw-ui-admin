<template>
 
		<el-dialog top="5vh" append-to-body :title="forms.id ? '修改表单' : '新增表单'" v-model="isShowDialog" width="600px">
			<el-form :model="forms" ref="formsForm" size="default" :rules="formsRules" label-width="120px">
				<el-tabs
					v-model="activeName"
					type="card"
					class="demo-tabs">
					<el-tab-pane name="default" label="基本设置">
						<el-row :gutter="35">
							<el-col class="mb20" :xs="24">
								<el-form-item label="表单名称" prop="title">
									<el-input v-model="forms.title" placeholder="请输入表单名称" clearable></el-input>
								</el-form-item>
							</el-col>
							<el-col class="mb20" :xs="24">
								<el-form-item label="启用时间段" prop="startDates">
									<el-date-picker
										v-model="forms.startDates"
										type="datetimerange"
										range-separator="至"
										format="YYYY-MM-DD HH:mm:ss"
										start-placeholder="开始日期"
										end-placeholder="结束日期">
									</el-date-picker>
								</el-form-item>
							</el-col>
							<el-col class="mb20" :xs="24"  prop="submitDates">
								<el-form-item label="每日提交时段">
									<el-time-picker
										is-range
										v-model="forms.submitDates"
										range-separator="至"
										start-placeholder="开始时间"
										end-placeholder="结束时间">
									</el-time-picker>
								</el-form-item>
							</el-col>

							<el-col class="mb20" :xs="24">
								<el-form-item label="提交数量限制" prop="title">
									<el-radio-group v-model="forms.islimit" size="default">
										<el-radio-button label="total">总共</el-radio-button>
										<el-radio-button label="day">每天</el-radio-button>
										<el-radio-button label="week">每周</el-radio-button>
										<el-radio-button label="month">每月</el-radio-button>
										<el-radio-button label="year">每年</el-radio-button>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="可提交" prop="total">
									<el-input-number min="0" v-model="forms.total"  placeholder="请输入微信分享描述" clearable></el-input-number>
									<el-tooltip hide-after="0" effect="dark" content="表单提交总数达到该值，则所有用户不可再提交，为 0 则不限" placement="top">
										<SvgIcon name="ele-QuestionFilled" :size="20" />
									</el-tooltip>
								</el-form-item>
								<el-form-item v-if="forms.total>0" label="超出提示" prop="overtip">
									<el-input v-model="forms.overtip" placeholder="已达到提交上限" clearable></el-input>
								</el-form-item>
							</el-col>
							
						</el-row>
					</el-tab-pane>
					<el-tab-pane name="user" label="用户限制">

						<el-col class="mb20" :xs="24">
								<el-form-item label="提交数量限制" prop="title">
									<el-radio-group v-model="forms.isuserlimit" size="default">
										<el-radio-button label="total">总共</el-radio-button>
										<el-radio-button label="day">每天</el-radio-button>
										<el-radio-button label="week">每周</el-radio-button>
										<el-radio-button label="month">每月</el-radio-button>
										<el-radio-button label="year">每年</el-radio-button>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="可提交" prop="usertotal">
									<el-input-number v-model="forms.usertotal"  placeholder="请输入可提交次数" clearable></el-input-number>
									<el-tooltip hide-after="0" effect="dark" content="提交次数为0则不限" placement="top">
										<SvgIcon name="ele-QuestionFilled" :size="20" />
									</el-tooltip>
								</el-form-item>
								<el-form-item v-if="forms.usertotal>0" label="超出提示" prop="userovertip">
									<el-input v-model="forms.userovertip" placeholder="已达到提交上限" clearable></el-input>
								</el-form-item>
								<el-form-item v-if="forms.isuserlimit!='total'" label="总共可提交" prop="total">
									<el-input-number v-model="forms.useralltotal"  placeholder="请输入微信分享描述" clearable></el-input-number>
									<el-tooltip hide-after="0" effect="dark" content="用户总提交次数，为 0 则不限" placement="top">
										<SvgIcon name="ele-QuestionFilled" :size="20" />
									</el-tooltip>
								</el-form-item>
							</el-col>
					</el-tab-pane>
				</el-tabs>
				
		

				<!-- <el-row :gutter="35">
					<el-col class="mb20">
						<el-form-item label="" prop="title">
							<el-input v-model="forms.title" placeholder="请输入表单名称" clearable></el-input>
						</el-form-item>
					</el-col>
				</el-row> -->
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ forms.id ? '修 改' : '新 增' }}</el-button>
				</span>
			</template>
		</el-dialog>
 
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent } from 'vue';
import { postData } from '@/api/index';
import { ElMessage } from 'element-plus';
import DiygwImage from '@/components/image/index.vue';
import { deepClone } from '@/utils/other';
import * as CryptoTS from 'crypto-ts';
import { formatDate } from '@/utils/formatTime';
// 定义接口来定义对象的类型
interface MenuDataTree {
	id: number;
	label: string;
	children?: MenuDataTree[];
}

export default defineComponent({
	name: 'adminAddForms',
	components: {
		DiygwImage,
	},
	setup(props, { emit }) {
		let formsInit = {
			id: '',
			title: '', // 表单名称
			startDates:[],
			submitDates:[],
			shareTitle: '',
			total: 0,
			overtip:'已达到提交上限',
			userovertip:'已达到提交上限',
			islimit: 'total',
			isuserlimit:'total',
			usertotal:0,
			useralltotal:0,
			shareImg: '',
			password: '',
			passwordTip: '请输入密码',
			passwordErrMsg: '抱歉，您输入的密码有误',
		};
		const state = reactive({
			activeName:'default',
			formsForm: null,
			isShowDialog: false,
			forms: formsInit,
			formsRules: {
				title: { required: true, message: '表单名称不能为空', trigger: 'blur' },
			},
		});
		// 打开弹窗
		const openDialog = (forms = null) => {
			if (forms) {
				let configs = JSON.parse(forms.inits);
				if(configs.startDates.length>0){
					configs.startDates = [new Date(configs.startDates[0]),new Date(configs.startDates[1])]
				}else{
					configs.startDates = []
				}
				if(configs.submitDates.length>0){
					let date = formatDate(new Date(),'YYYY-mm-dd')
					configs.submitDates = [new Date(date+" "+configs.submitDates[0]),new Date(date+" "+configs.submitDates[1])]
				}else{
					configs.submitDates = []
				}
				configs.id = forms.id;
				state.forms = configs;
			} else {
				state.forms = deepClone(formsInit);
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
			state.formsForm.validate((valid) => {
				if (valid) {
					let forms = deepClone(state.forms);
					let keys = ['inits'];
					for (const key in keys) {
						delete forms[key];
					}
					let data = {
						title:forms.title,
						id:forms.id
					}
					if(state.forms.startDates.length>1){
						forms.startDates = [formatDate(state.forms.startDates[0],'YYYY-mm-dd HH:MM:SS'),formatDate(state.forms.startDates[1],'YYYY-mm-dd HH:MM:SS')]
					}else{
						forms.startDates = []
					}

					if(state.forms.submitDates.length>1){
						forms.submitDates = [formatDate(state.forms.submitDates[0],'HH:MM:SS'),formatDate(state.forms.submitDates[1],'HH:MM:SS')]
					}else{
						forms.submitDates = []
					}
					data.inits = JSON.stringify(forms),
				
					
					postData(state.forms.id ? '/admin/forms/update' : '/admin/forms/add', data).then((res) => {
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

