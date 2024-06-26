<template>
	<div class="container">
		<el-card shadow="always">
			<!-- 查询 -->
			<el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
				<el-form-item label="字典名称" prop="dictName">
					<el-input placeholder="请输入字典名称模糊查询" clearable @keyup.enter="handleQuery" style="width: 240px" v-model="queryParams.dictName" />
				</el-form-item>
				<el-form-item label="字典类型" prop="dictType">
					<el-input v-model="queryParams.dictType" placeholder="请输入字典类型模糊查询" clearable style="width: 240px" @keyup.enter="handleQuery" />
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-select v-model="queryParams.status" placeholder="字典状态" clearable style="width: 240px">
						<el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleQuery"> <SvgIcon name="ele-Search" />搜索 </el-button>
					<el-button @click="resetQuery">
						<SvgIcon name="ele-Refresh" />
						重置
					</el-button>
				</el-form-item>
			</el-form>

			<!-- 操作按钮 -->
			<el-row :gutter="10" class="mb8">
				<el-col :span="1.5">
					<el-button type="primary" plain v-auth="'system:dictT:add'" @click="onOpenAddModule"> <SvgIcon name="ele-Plus" />新增 </el-button>
				</el-col>
				<el-col :span="1.5">
					<el-button type="danger" plain v-auth="'system:dictT:delete'" :disabled="multiple" @click="onTabelRowDel">
						<SvgIcon name="ele-Delete" />删除
					</el-button>
				</el-col>
				<el-col :span="1.5">
					<el-button type="warning" plain v-auth="'system:dictT:export'" @click="handleExport"> <SvgIcon name="ele-Download" />导出 </el-button>
				</el-col>
			</el-row>

			<!--数据表格-->
			<el-table v-loading="loading" border :data="tableData" @selection-change="handleSelectionChange">
				<el-table-column type="selection" align="center" />
				<el-table-column label="编号" align="center" prop="dictId" width="60" />
				<el-table-column label="字典名称" align="center" prop="dictName" :show-overflow-tooltip="true" />
				<el-table-column label="字典类型" align="center" :show-overflow-tooltip="true">
					<template #default="scope">
						<el-link @click="editDictItem(scope.row)" type="primary">
							<span>{{ scope.row.dictType }}</span>
						</el-link>
					</template>
				</el-table-column>
				<el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
				<el-table-column label="状态" align="center" prop="status">
					<template #default="scope">
						<el-tag :type="scope.row.status === '1' ? 'danger' : 'success'" disable-transitions>{{ statusFormat(scope.row) }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" fixed="right" width="280">
					<template #default="scope">
						<el-button type="text" icon="el-icon-s-tools" @click="editDictItem(scope.row)"> <SvgIcon name="ele-Tools" />字典配置 </el-button>
						<el-button type="text" v-auth="'system:dictT:edit'" @click="onOpenEditModule(scope.row)"> <SvgIcon name="ele-Edit" />修改 </el-button>
						<el-button v-if="scope.row.parentId != 0" type="text" v-auth="'system:dictT:delete'" @click="onTabelRowDel(scope.row)">
							<SvgIcon name="ele-Delete" />删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页设置-->
			<div v-show="total > 0">
				<el-divider></el-divider>
				<el-pagination
					background
					:total="total"
					:current-page="queryParams.pageNum"
					:page-size="queryParams.pageSize"
					layout="total, sizes, prev, pager, next, jumper"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
				/>
			</div>
		</el-card>
		<!-- 添加或修改字典对话框 -->
		<EditModule ref="editModuleRef" :title="title" />
		<!-- 字典列表对话框 -->
		<DictList ref="dictItemModuleRef" />
	</div>
</template>
<!--使用 setup 语法糖-->
<script setup lang="ts">
import { toRefs, ref, reactive, onMounted, getCurrentInstance, onUnmounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import EditModule from './component/editModule.vue';
import DictList from './component/dictList.vue';
import { delData, listData, exportData } from '@/api';
import { getDownCurrentDateTime } from '@/utils/formatTime';
const { proxy } = getCurrentInstance() as any;
const editModuleRef = ref();
const dictItemModuleRef = ref();
const state = reactive({
	// 遮罩层
	loading: true,
	// 选中数组
	ids: [],
	// 非单个禁用
	single: true,
	// 非多个禁用
	multiple: true,
	// 弹出层标题
	title: '',
	// 字典表格数据
	tableData: [],
	// 总条数
	total: 0,
	// 状态数据字典
	statusOptions: [
		{
			dictValue: '0',
			dictLabel: '正常',
		},
		{
			dictValue: '1',
			dictLabel: '禁用',
		},
	],
	// 查询参数
	queryParams: {
		// 页码
		pageNum: 1,
		// 每页大小
		pageSize: 10,
		dictName: undefined,
		dictType: undefined,
		status: undefined,
	},
	//字典数据表单参数
	dictItemForm: [],
});
const { loading, multiple, title, tableData, total, statusOptions, queryParams } = toRefs(state);
/** 查询字典列表 */
const handleQuery = () => {
	state.loading = true;
	listData('/sys/dict', state.queryParams).then((response) => {
		state.tableData = response.rows;
		state.total = response.total;
		state.loading = false;
	});
};
/** 重置按钮操作 */
const resetQuery = () => {
	state.queryParams.dictName = undefined;
	state.queryParams.dictType = undefined;
	state.queryParams.status = undefined;
	handleQuery();
};

const statusFormat = (row: any) => {
	return proxy.selectDictLabel(state.statusOptions, row.status);
};

// 打开新增字典弹窗
const onOpenAddModule = (row: object) => {
	row = [];
	state.title = '添加字典';
	editModuleRef.value.openDialog(row);
};
// 打开编辑字典弹窗
const onOpenEditModule = (row: object) => {
	state.title = '修改字典';
	editModuleRef.value.openDialog(row);
};
/** 删除按钮操作 */
const onTabelRowDel = (row: any) => {
	const dictIds = row.dictId || state.ids;
	ElMessageBox({
		message: '是否确认删除字典编号为"' + dictIds + '"的数据项?',
		title: '警告',
		showCancelButton: true,
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(function () {
		return delData('/sys/dict', dictIds).then(() => {
			handleQuery();
			ElMessage.success('删除成功');
		});
	});
};
// 多选框选中数据
const handleSelectionChange = (selection: any) => {
	state.ids = selection.map((item: any) => item.dictId);
	state.single = selection.length != 1;
	state.multiple = !selection.length;
};

//分页页面大小发生变化
const handleSizeChange = (val: any) => {
	state.queryParams.pageSize = val;
	handleQuery();
};
//当前页码发生变化
const handleCurrentChange = (val: any) => {
	state.queryParams.pageNum = val;
	handleQuery();
};
//编辑字典数据
const editDictItem = (record: any) => {
	dictItemModuleRef.value.openDrawer(record);
};

/** 导出按钮操作 */
const handleExport = () => {
	const queryParams = state.queryParams;
	ElMessageBox({
		message: '是否确认导出所有类型数据项?',
		title: '警告',
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(function () {
		let datetime = getDownCurrentDateTime();
		proxy.download('/sys/dict/export', queryParams, `字典_${datetime}.xlsx`);
	});
};
// 页面加载时
onMounted(() => {
	// 查询字典信息
	handleQuery();
	proxy.mittBus.on('onEditPostModule', () => {
		handleQuery();
	});
});
// 页面卸载时
onUnmounted(() => {
	proxy.mittBus.off('onEditPostModule');
});
</script>
