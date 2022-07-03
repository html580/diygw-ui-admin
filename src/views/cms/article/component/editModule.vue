<template>
	<div class="cms-menu-container">
		<el-dialog v-model="state.isShowDialog" width="769px" center>
			<template #title>
				<div style="font-size: large" v-drag="['.cms-menu-container .el-dialog', '.cms-menu-container .el-dialog__header']">{{ title }}</div>
			</template>
			<el-form ref="ruleFormRef" :model="state.ruleForm" :rules="state.ruleRules" label-width="80px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item label="文章昵称" prop="nickname">
							<el-input v-model="state.ruleForm.nickname" placeholder="请输入文章昵称" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item label="归属分类" prop="categoryId">
							<el-cascader
								v-model="state.ruleForm.categoryId"
								:options="state.categoryOptions"
								:props="{
									label: 'categoryName',
									value: 'categoryId',
									checkStrictly: true,
									emitPath: false,
								}"
								class="w100"
								clearable
								filterable
								placeholder="请选择归属分类"
								:show-all-levels="false"
							></el-cascader>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item v-if="state.ruleForm.articleId == undefined" label="标题" prop="articlename">
							<el-input v-model="state.ruleForm.articlename" placeholder="请输入标题" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item v-if="state.ruleForm.articleId == undefined" label="文章密码" prop="password">
							<el-input v-model="state.ruleForm.password" placeholder="请输入文章密码" type="password" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item label="手机号码" prop="phone">
							<el-input v-model="state.ruleForm.phone" placeholder="请输入手机号码" maxlength="11" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item label="邮箱" prop="email">
							<el-input v-model="state.ruleForm.email" placeholder="请输入邮箱" maxlength="50" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item label="文章性别" prop="sex">
							<el-select class="w100" v-model="state.ruleForm.sex" placeholder="请选择">
								<el-option v-for="dict in state.sexOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item label="状态">
							<el-radio-group v-model="state.ruleForm.status">
								<el-radio v-for="dict in state.statusOptions" :key="dict.dictValue" :label="dict.dictValue">{{ dict.dictLabel }} </el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item label="岗位">
							<el-select  class="w100"  v-model="state.postIds" multiple collapse-tags="true" placeholder="请选择">
								<el-option
									v-for="item in state.postOptions"
									:key="item.postId"
									:label="item.postName"
									:value="item.postId"
									:disabled="item.status == 1"
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item label="角色">
							<el-select  class="w100"  v-model="state.roleIds" multiple collapse-tags="true" placeholder="请选择">
								<el-option
									v-for="item in state.roleOptions"
									:key="item.roleId"
									:label="item.roleName"
									:value="item.roleId"
									:disabled="item.status == 1"
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<el-form-item label="备注">
							<el-input v-model="state.ruleForm.remark" type="textarea" placeholder="请输入内容"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>

			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel">取 消</el-button>
					<el-button type="primary" @click="onSubmit" :loading="state.loading">编 辑</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import { reactive, ref, unref, getCurrentInstance } from 'vue';

import { ElMessage } from 'element-plus';
import { addData, getOneData, listData, updateData } from '@/api';
import { handleTree } from "@/utils";

defineProps({
	title: {
		type: String,
		default: () => '',
	},
});

const { proxy } = getCurrentInstance() as any;
const ruleFormRef = ref<HTMLElement | null>(null);
const state = reactive({
	// 是否显示弹出层
	isShowDialog: false,
	loading: false,
	// 默认密码
	// 性别状态字典
	sexOptions: <any>[],
	// 角色选项
	roleOptions: <any>[],
	// 状态数据字典
	statusOptions: <any>[],
	// 分类树选项
	categoryOptions: <any>[],
	// 岗位选项
	postOptions: <any>[],
	ruleForm: {
		articleId: undefined, // 文章ID
		articlename: '', // 标题
		nickname: '', // 文章昵称
		categoryId: '', // 分类ID
		roleId: '', // 角色ID
		postId: '', // 岗位ID
		phone: '', // 手机号
		email: '', // 邮箱
		status: '', //文章状态
		password: '', // 文章密码
		avatar: '', // 文章头像
		sex: '', // 性别
		remark: '', // 备注
		postIds: '',
		roleIds: '',
	},
	postIds: <any>[],
	roleIds: <any>[],
	// 显示状态数据字典
	isHideOptions: [],
	// 菜单类型数据字典
	menuTypeOptions: [],
	// 数字是否数据字典
	yesOrNoOptions: [],
	// 菜单树选项
	menuOptions: [],
	// 表单校验
	ruleRules: {
		articlename: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
		nickname: [{ required: true, message: '文章昵称不能为空', trigger: 'blur' }],
		password: [{ required: true, message: '文章密码不能为空', trigger: 'blur' }],
		email: [
			{
				type: 'email',
				message: "'请输入正确的邮箱地址",
				trigger: ['blur', 'change'],
			},
		],
		phone: [
			{
				pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
				message: '请输入正确的手机号码',
				trigger: 'blur',
			},
		],
	},
});
// 打开弹窗
const openDialog = (row: any) => {
	if (row && row.articleId && row.articleId != undefined && row.articleId != 0) {
		Promise.all([listData('/sys/post', {}), listData('/sys/role', {}), getOneData('/cms/article', row.articleId)])
			.then((res) => {
				state.postOptions = res[0].data.rows;
				state.roleOptions = res[1].data.rows;
				state.ruleForm = res[2].data;
				if (state.ruleForm.postIds != '') {
					state.postIds = state.ruleForm.postIds.split(',').map((item: string) => {
						return Number(item);
					});
				} else {
					state.postIds = [];
				}
				if (state.ruleForm.roleIds != '') {
					state.roleIds = state.ruleForm.roleIds.split(',').map((item: string) => {
						return Number(item);
					});
				} else {
					state.roleIds = [];
				}

				state.ruleForm.password = '';
			})
			.then(() => {});
	} else {
		initForm();
	}
	getTreeselect();
	state.isShowDialog = true;
	state.loading = false;
	// 查询显示性別数据字典
	proxy.getDicts('sys_article_sex').then((response: any) => {
		state.sexOptions = response.data.rows;
	});
	// 查询显示狀態数据字典
	proxy.getDicts('sys_normal_disable').then((response: any) => {
		state.statusOptions = response.data.rows;
	});
};
// 关闭弹窗
const closeDialog = (row?: object) => {
	proxy.mittBus.emit('onEditArticleModule', row);
	state.isShowDialog = false;
};
// 取消
const onCancel = () => {
	closeDialog();
	initForm();
};
/** 查询分类下拉树结构 */
const getTreeselect = async () => {
	listData('/cms/category', {}).then((response) => {
		state.categoryOptions = handleTree(response.data.rows, 'categoryId', 'parentId', 'children');
	});
};
/** 提交按钮 */
const onSubmit = () => {
	const formWrap = unref(ruleFormRef) as any;
	if (!formWrap) return;
	formWrap.validate((valid: boolean) => {
		if (valid) {
			state.ruleForm.postId = state.postIds[0];
			state.ruleForm.roleId = state.roleIds[0];
			state.ruleForm.postIds = state.postIds.join(',');
			state.ruleForm.roleIds = state.roleIds.join(',');
			state.loading = true;
			if (state.ruleForm.articleId != undefined) {
				updateData('/cms/article', state.ruleForm).then(() => {
					ElMessage.success('修改成功');
					state.loading = false;
					closeDialog(); // 关闭弹窗
				}).finally(()=>{
          state.loading = false;
        });
			} else {
				addData('/cms/article', state.ruleForm).then(() => {
					ElMessage.success('新增成功');
					state.loading = false;
					closeDialog(); // 关闭弹窗
				}).finally(()=>{
          state.loading = false;
        });
			}
		}
	});
	// console.log(state.ruleForm); // 数据，请注意需要转换的类型
	// closeDialog(); // 关闭弹窗
	// setBackEndControlRefreshRoutes() // 刷新菜单，未进行后端接口测试
};
// 表单初始化，方法：`resetFields()` 无法使用
const initForm = () => {
	Promise.all([listData('/sys/post', {}), listData('/sys/role', {})]).then((res) => {
		state.postOptions = res[0].data.rows;
		state.roleOptions = res[1].data.rows;
	});
	state.ruleForm.articleId = undefined; // 文章ID
	state.ruleForm.articlename = ''; // 标题
	state.ruleForm.nickname = ''; // 文章昵称
	state.ruleForm.categoryId = ''; // 分类ID
	state.ruleForm.phone = ''; // 手机号
	state.ruleForm.email = ''; // 邮箱
	state.ruleForm.status = ''; //文章状态
	state.ruleForm.password = ''; // 文章密码
	state.ruleForm.avatar = ''; // 文章头像
	state.ruleForm.sex = ''; // 性别
	state.ruleForm.remark = ''; // 备注
	state.ruleForm.postIds = '';
	state.ruleForm.roleIds = '';
};

defineExpose({
	openDialog,
});
</script>
<style scoped lang="scss">
.updateArticle {
	height: 100%;
	overflow: auto;
	padding-bottom: 53px;
	width: 600px;
}

.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 108px;
	height: 108px;
	margin: 8px;
	line-height: 108px;
	border-radius: 4px;
	text-align: center;
	background-color: #fafafa;
	border: 1px dashed #d9d9d9;
}

.avatar {
	width: 108px;
	height: 108px;
	margin: 8px;
	border-radius: 4px;
	display: block;
}
</style>
