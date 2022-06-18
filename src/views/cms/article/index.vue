<template>
	<div class="cms-article-container app-container">
		<el-card shadow="always">
			<el-row :gutter="20">
				<!--分类数据-->
				<el-col :span="4" :xs="24">
					<div class="head-container">
						<el-input v-model="state.categoryName" placeholder="请输入分类名称" clearable prefix-icon="el-icon-search" style="margin-bottom: 20px" />
					</div>
					<div class="head-container">
						<el-tree
							:data="state.categoryOptions"
							:props="state.defaultProps"
							node-key="categoryId"
							:expand-on-click-node="false"
							:filter-node-method="filterNode"
							ref="tree"
							default-expand-all
							@node-click="handleNodeClick"
						/>
					</div>
				</el-col>

				<el-col :span="20" :xs="24">
					<!-- 查询-->
					<el-form :model="state.queryParams" ref="queryForm" :inline="true" label-width="78px">
						<el-form-item label="标题" prop="articlename">
							<el-input placeholder="标题模糊查询" clearable @keyup.enter="handleQuery" style="width: 240px" v-model="state.queryParams.articlename" />
						</el-form-item>
						<el-form-item label="状态" prop="status">
							<el-select v-model="state.queryParams.status" placeholder="文章状态" clearable style="width: 240px">
								<el-option v-for="dict in state.statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="handleQuery">
								<SvgIcon name="ele-Search" />
								搜索</el-button
							>
							<el-button @click="resetQuery">
								<SvgIcon name="ele-Refresh" />
								重置
							</el-button>
						</el-form-item>
					</el-form>
					<!-- 操作按钮 -->
					<el-col :span="1.5">
						<el-button type="primary" plain @click="handleAdd"><SvgIcon name="ele-Plus" />新增</el-button>
					</el-col>
					<el-col :span="1.5">
						<el-button type="danger" plain :disabled="state.multiple" @click="handleDelete"><SvgIcon name="ele-Delete" />删除</el-button>
					</el-col>
					<el-col :span="1.5">
						<el-button type="warning" plain @click="handleExport"><SvgIcon name="ele-Download" />导出</el-button>
					</el-col>

					<el-table v-loading="state.loading" :data="state.tableData" stripe @selection-change="handleSelectionChange" style="width: 100%">
						<el-table-column type="selection" width="45" align="center" />
						<el-table-column label="文章编号" align="center" key="articleId" prop="articleId" />
						<el-table-column label="文章名" prop="articlename" show-overflow-tooltip></el-table-column>
						<el-table-column label="头像" show-overflow-tooltip>
							<template #default="scope">
								<el-image class="cms-article-photo" :src="scope.row.avatar ? scope.row.avatar : letterAvatar(scope.row.articlename)"></el-image>
							</template>
						</el-table-column>
						<el-table-column label="文章性别" align="center" prop="sex" :formatter="sexFormat" />
						<el-table-column prop="phone" label="手机" show-overflow-tooltip></el-table-column>
						<el-table-column prop="email" label="邮箱" show-overflow-tooltip></el-table-column>
						<el-table-column label="状态" align="center" key="status">
							<template #default="scope">
								<el-switch v-model="scope.row.status" active-value="0" inactive-value="1" @click="handleStatusChange(scope.row)"></el-switch>
							</template>
						</el-table-column>
						<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
						<el-table-column prop="path" label="操作" width="150">
							<template #default="scope">
								<el-button type="text" @click="handleUpdate(scope.row)"><SvgIcon name="ele-Edit" />修改</el-button>
								<el-button type="text" @click="handleDelete(scope.row)"><SvgIcon name="ele-Delete" />删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div v-show="state.total > 0">
						<el-divider></el-divider>
						<el-pagination
							background
							:total="state.total"
							:page-sizes="[10, 20, 30]"
							:current-page="state.queryParams.pageNum"
							:page-size="state.queryParams.pageSize"
							layout="total, sizes, prev, pager, next, jumper"
							@size-change="onHandleSizeChange"
							@current-change="onHandleCurrentChange"
						/>
					</div>
				</el-col>
			</el-row>
		</el-card>
		<!-- 添加或修改参数配置对话框 -->
		<EditModule ref="articleFormRef" :title="state.title" />
	</div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref, watch, getCurrentInstance, onUnmounted } from 'vue';


import { ElMessageBox, ElMessage } from 'element-plus';

import EditModule from './component/editModule.vue';
import { letterAvatar } from '@/utils/index';
import { listData, changeStatus, delData } from '@/api';
import { handleTree } from "@/utils";
const { proxy } = getCurrentInstance() as any;
const articleFormRef = ref();
const state: any = reactive({
	tableData: [],
	total: 0,
	loading: false,
	// 岗位选项
	postOptions: [],
	defaultProps: {
		children: 'children',
		label: 'categoryName',
	},
	// 性别状态字典
	sexOptions: [],
	// 角色选项
	roleOptions: [],
	// 状态数据字典
	statusOptions: [],
	// 分类名称
	categoryName: undefined,
	// 非单个禁用
	single: true,
	// 非多个禁用
	multiple: true,
	// 选中数组
	ids: [],
	// 弹出层标题
	title: '',
	// 分类树选项
	categoryOptions: undefined,
	// 查询参数
	queryParams: {
		pageNum: 1,
		pageSize: 10,
		articlename: undefined,
		phone: undefined,
		status: undefined,
		categoryId: undefined,
	},
});

watch(
	() => state.categoryName,
	(newValue) => {
		proxy.$refs.tree.filter(newValue);
	}
);
/** 查询文章列表 */
const getList = async () => {
	state.loading = true;
	listData('/cms/article',state.queryParams).then((response: any) => {
		if (response.code != 200) {
			state.loading = false;
		}
		state.tableData = response.data.rows;
		state.total = response.data.total;
		state.loading = false;
	});
};
// 多选框选中数据
const handleSelectionChange = (selection: any) => {
	state.ids = selection.map((item: any) => item.articleId);
	state.single = selection.length != 1;
	state.multiple = !selection.length;
};
/** 搜索按钮操作 */
const handleQuery = async () => {
	// console.log("查询文章列表", state.queryParams.articleName);
	state.queryParams.pageNum = 1;
	await getList();
};
/** 重置按钮操作 */
const resetQuery = async () => {
	// 表单初始化，方法：`resetFields()` 无法使用
	state.queryParams.pageNum = 1;
	state.queryParams.pageSize = 10;
	state.queryParams.articlename = '';
	state.queryParams.phone = '';
	state.queryParams.status = '';
	state.queryParams.categoryId = 0;
	handleQuery();
};
/** 新增按钮操作 */
const handleAdd = (row: any) => {
	state.title = '添加文章';
	articleFormRef.value.openDialog(null);
};
/** 修改按钮操作 */
const handleUpdate = (row: any) => {
	state.title = '修改文章';
	articleFormRef.value.openDialog(row);
};

/** 查询分类下拉树结构 */
const getTreeselect = async () => {
	listData('/cms/category',{}).then((response) => {
		state.categoryOptions = handleTree(response.data.rows,"categoryId","parentId","children");;
	});
};
// 文章状态修改
const handleStatusChange = (row: any) => {
	let text = row.status === '0' ? '启用' : '停用';
	ElMessageBox({
		title: '警告',
		message: '确认要"' + text + '""' + row.articlename + '"文章吗?',
		showCancelButton: true,
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		beforeClose: (action, instance, done) => {
			if (action === 'confirm') {
				return changeStatus('/cms/article',{articleId:row.articleId,status:row.status}).then(() => {
					ElMessage.success(text + '成功');
					done();
				});
			} else {
				done();
			}
		},
	}).catch(() => {
		row.status = row.status === '0' ? '1' : '0';
	});
};
/** 删除按钮操作 */
const handleDelete = (row: any) => {
	const articleId = row.articleId || state.ids;
	ElMessageBox({
		message: '是否确认删除文章编号为"' + articleId + '"的数据项?',
		title: '警告',
		showCancelButton: true,
		confirmButtonText: '确定',
		cancelButtonText: '取消',
	}).then(function () {
    return delData('/cms/article', articleId).then(() => {
			handleQuery();
			ElMessage.success('删除成功');
		});
	});
};

// 分页改变
const onHandleSizeChange = (val: number) => {
	state.queryParams.pageSize = val;
	handleQuery();
};
// 分页改变
const onHandleCurrentChange = (val: number) => {
	state.queryParams.pageNum = val;
	handleQuery();
};
// 筛选节点
const filterNode = (value: string, data: any) => {
	if (!value) return true;
	return data.label.indexOf(value) !== -1;
};
// 节点单击事件
const handleNodeClick = (data: any) => {
	state.queryParams.categoryId = data.categoryId;
	getList();
	state.queryParams.categoryId = 0;
};

/** 导出按钮操作 */
const handleExport = () => {
	const queryParams = state.queryParams;
	// ElMessageBox({
	// 	message: '是否确认导出所有文章数据项?',
	// 	title: '警告',
	// 	confirmButtonText: '确定',
	// 	cancelButtonText: '取消',
	// 	type: 'warning',
	// })
	// 	.then(function () {
	// 		return exportArticle(queryParams);
	// 	})
	// 	.then((response) => {
	// 		proxy.download(response.data);
	// 	});
};
// 字典状态字典翻译
const sexFormat = (row: any, column: any) => {
	return proxy.selectDictLabel(state.sexOptions, row.sex);
};
// 页面加载时
onMounted(() => {
	getList();
	getTreeselect();
	// 查询显示状态数据字典
	proxy.getDicts('sys_normal_disable').then((response: any) => {
		state.statusOptions = response.data.rows;
	});
	// 查询显示性別数据字典
	proxy.getDicts('sys_article_sex').then((response: any) => {
		state.sexOptions = response.data.rows;
	});

	proxy.mittBus.on('onEditArticleModule', (res: any) => {
		handleQuery();
	});
});

// 页面卸载时
onUnmounted(() => {
	proxy.mittBus.off('onEditArticleModule');
});
</script>

<style scoped lang="scss">
.cms-article-container {
	.cms-article-search {
		text-align: left;

		.cms-article-search-btn {
			text-align: center;
			margin-left: 70px;
		}
	}

	.cms-article-photo {
		width: 40px;
		height: 40px;
		border-radius: 100%;
	}
}
</style>
