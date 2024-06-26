<template>
	<!-- 抽屉 -->
	<el-drawer title="字典列表" :direction="state.direction" :size="state.screenWidth" v-model="state.isShowDrawer">
		<!-- 抽屉内容的border -->
		<div :style="{
			padding: '10px',
			border: '1px solid #e9e9e9',
			background: '#fff',
		}">
			<el-form :model="state.queryParams" ref="queryForm" :inline="true">
				<el-row>
					<el-col span="8">
						<el-form-item label="标签" prop="dictName">
							<el-input placeholder="标签查询" clearable @keyup.enter="handleQuery" style="width: 140px"
								v-model="state.queryParams.dictLabel" />
						</el-form-item>
					</el-col>
					<el-col span="8">
						<el-form-item label="状态" prop="status">
							<el-select v-model="state.queryParams.status" placeholder="状态" clearable style="width: 100px">
								<el-option v-for="dict in state.statusOptions" :key="dict.dictValue" :label="dict.dictLabel"
									:value="dict.dictValue" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col span="8">
						<el-form-item>
							<el-button type="primary" @click="handleQuery">
								<SvgIcon name="ele-Search" />搜索
							</el-button>
							<el-button @click="resetQuery">
								<SvgIcon name="ele-Refresh" />重置
							</el-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :md="2" :sm="2" :xs="8">
						<el-button style="margin-bottom: 10px; margin-top: 10px" type="primary" v-auth="'system:dictD:add'"
							@click="onOpenAddModule">
							<SvgIcon name="ele-Plus" />新增
						</el-button>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div>
			<!--数据表格-->
			<el-table v-loading="state.loading" border :data="state.tableData">
				<el-table-column label="键值" align="center" prop="dictValue" :show-overflow-tooltip="true" />
				<el-table-column label="标签" align="center" prop="dictLabel" :show-overflow-tooltip="true" />
				<el-table-column label="类型" align="center" prop="dictType" :show-overflow-tooltip="true" />
				<el-table-column label="状态" align="center" prop="status">
					<template #default="scope">
						<el-tag :type="scope.row.status === '1' ? 'danger' : 'success'" disable-transitions>{{
							scope.row.status === '1' ? '停用' : '正常'
						}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="排序" align="center" width="50" prop="dictSort" />

				<el-table-column label="操作" align="center" width="150" class-name="medium-padding fixed-width">
					<template #default="scope">
						<el-button type="text" icon="el-icon-edit" v-auth="'system:dictD:edit'"
							@click="onOpenEditModule(scope.row)">
							<SvgIcon name="ele-Edit" />修改
						</el-button>
						<el-button type="text" v-auth="'system:dictD:delete'" @click="onTabelRowDel(scope.row)">
							<SvgIcon name="ele-Delete" />删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<!-- 添加或修改字典对话框 -->
		<editDictItem ref="dictItemModuleRef" :title="state.title" />
	</el-drawer>
</template>

<script setup lang="ts">
import { reactive, ref, getCurrentInstance, onUnmounted, onMounted } from 'vue';
import { delData, listData } from '@/api';
import { ElMessageBox, ElMessage } from 'element-plus';
import editDictItem from './editDictItem.vue';

const { proxy } = getCurrentInstance() as any;
const dictItemModuleRef = ref();
const state = reactive({
	// 遮罩层
	loading: true,
	// 弹出层标题
	title: '',
	// 字典表格数据
	tableData: [],
	// 是否显示抽屉
	isShowDrawer: false,
	direction: 'rtl',
	//   抽屉的宽度
	screenWidth: 800,
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
		dictType: undefined,
		dictLabel: undefined,
		status: undefined,
	},
});

// 页面加载时
const openDrawer = (row: any) => {
	resetScreenSize();
	state.queryParams.dictType = row.dictType;
	proxy.getDicts(row.dictType).then((response: any) => {
		state.tableData = response.rows;
		state.loading = false;
	});
	state.isShowDrawer = true;
};

/** 查询字典列表 */
const handleQuery = () => {
	state.loading = true;
	listData('/sys/dictData', state.queryParams).then((response) => {
		state.tableData = response.rows;
		state.loading = false;
	});
};
// 抽屉的宽度随着屏幕大小来改变
const resetScreenSize = () => {
	let screenWidth = document.body.clientWidth;
	if (screenWidth < 600) {
		state.screenWidth = screenWidth;
	}
};
/** 重置按钮操作 */
const resetQuery = () => {
	state.queryParams.dictLabel = undefined;
	state.queryParams.status = undefined;
	handleQuery();
};
// 打开新增字典数据弹窗
const onOpenAddModule = (row: any) => {
	row.dictType = state.queryParams.dictType;
	state.title = '添加字典数据';
	dictItemModuleRef.value.openDialog(row);
};
// 打开编辑字典数据弹窗
const onOpenEditModule = (row: object) => {
	state.title = '修改字典数据';
	dictItemModuleRef.value.openDialog(row);
};
/** 删除按钮操作 */
const onTabelRowDel = (row: any) => {
	const dictCode = row.dictCode;
	ElMessageBox({
		message: '是否确认删除字典编号为"' + dictCode + '"的数据项?',
		title: '警告',
		showCancelButton: true,
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(function () {
		return delData('/sys/dictData', dictCode).then(() => {
			handleQuery();
			ElMessage.success('删除成功');
		});
	});
};
// 页面加载时
onMounted(() => {
	proxy.mittBus.on('onEditDictItemModule', () => {
		handleQuery();
	});
});
// 页面卸载时
onUnmounted(() => {
	proxy.mittBus.off('onEditDictItemModule');
});

defineExpose({
	openDrawer,
});
</script>
