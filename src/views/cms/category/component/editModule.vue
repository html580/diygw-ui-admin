<template>
	<div class="system-menu-container">
		<el-dialog v-model="state.isShowDialog" width="769px" center>
			<template #title>
				<div style="font-size: large" v-drag="['.system-menu-container .el-dialog', '.system-menu-container .el-dialog__header']">{{ title }}</div>
			</template>
			<el-form :model="state.ruleForm" :rules="state.ruleRules" ref="ruleFormRef" label-width="80px">
				<el-row :gutter="30">
					<el-col :span="24">
						<el-form-item label="上级分类" prop="parentId">
							<el-cascader
								v-model="state.ruleForm.parentId"
								:options="state.categoryOptions"
								class="w100"
								:props="{
									value: 'categoryId',
									label: 'categoryName',
									checkStrictly: true,
									emitPath: false,
								}"
								clearable
								placeholder="选择上级分类"
								:show-all-levels="false"
							></el-cascader>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item label="分类名称" prop="categoryName">
							<el-input v-model="state.ruleForm.categoryName" placeholder="请输入分类名称" clearable></el-input>
						</el-form-item>
					</el-col>
					
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item label="分类状态" prop="status">
							<el-radio-group v-model="state.ruleForm.status">
								<el-radio v-for="dict in state.statusOptions" :key="dict.dictValue" :label="dict.dictValue">{{ dict.dictLabel }} </el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item label="分类排序" prop="sort">
							<el-input-number v-model="state.ruleForm.sort" placeholder="分类排序" clearable controls-position="right" :min="0"></el-input-number>
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
import { listData, addData, updateData } from '@/api';
import { ElMessage } from 'element-plus';
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
	// 分类对象
	ruleForm: {
		categoryId: 0, // 分类ID
		categoryName: '', // 分类名称
		parentId: 0, // 父分类ID
		sort: 0, // 分类排序
		status: '', //分类状态
	},
	// 分类状态数据字典
	statusOptions: <any>[],
	// 分类树选项
	categoryOptions: <any>[],
	// 表单校验
	ruleRules: {
		categoryName: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
		parentId: [{ required: true, message: '父分类不能为空', trigger: 'blur' }],
		status: [{ required: true, message: '分类状态不能为空', trigger: 'blur' }],
		sort: [{ required: true, message: '分类顺序不能为空', trigger: 'blur' }]
	},
});
// 打开弹窗
const openDialog = (row: any) => {
	if (row.categoryId && row.categoryId != undefined && row.categoryId != '') {
		state.ruleForm = row;
	} else {
		initForm();
		state.ruleForm.parentId = row.parentId;
	}

	state.isShowDialog = true;
	state.loading = false;
	// 查询分类状态数据字典
	proxy.getDicts('sys_normal_disable').then((response: any) => {
		state.statusOptions = response.data.rows;
	});

	// 查询分类下拉树结构
	listData('/cms/category', {}).then((response: any) => {
		response.data.rows.unshift({ categoryId: 0, categoryName: '顶级分类' });
		state.categoryOptions = handleTree(response.data.rows, 'categoryId', 'parentId', 'children');
		//state.categoryOptions = dataList;
	});
};

// 关闭弹窗
const closeDialog = (row?: object) => {
	proxy.mittBus.emit('onEditCategoryModule', row);
	state.isShowDialog = false;
};
// 取消
const onCancel = () => {
	closeDialog();
	initForm();
};

// 保存
const onSubmit = () => {
	const formWrap = unref(ruleFormRef) as any;
	if (!formWrap) return;
	formWrap.validate((valid: boolean) => {
		if (valid) {
			state.loading = true;
			if (state.ruleForm.categoryId != undefined && state.ruleForm.categoryId != 0) {
				updateData('/cms/category', state.ruleForm)
					.then((response) => {
						ElMessage.success('修改成功');
						state.loading = false;
						closeDialog(state.ruleForm); // 关闭弹窗
					})
					.finally(() => {
						state.loading = false;
					});
			} else {
				addData('/cms/category', state.ruleForm)
					.then((response) => {
						ElMessage.success('新增成功');
						state.loading = false;
						closeDialog(state.ruleForm); // 关闭弹窗
					})
					.finally(() => {
						state.loading = false;
					});
			}
		}
	});
};
// 表单初始化，方法：`resetFields()` 无法使用
const initForm = () => {
	state.ruleForm.categoryId = 0; // 分类ID
	state.ruleForm.categoryName = ''; // 分类名称
	state.ruleForm.parentId = 0; // 父分类ID
	state.ruleForm.sort = 0; // 分类排序
	state.ruleForm.status = state.ruleForm.status ? state.ruleForm.status : '0'; //分类状态
	state.ruleForm.leader = ''; // 分类负责人
	state.ruleForm.phone = ''; // 联系电话
	state.ruleForm.email = ''; // 邮箱
};

defineExpose({
	openDialog,
});
</script>
