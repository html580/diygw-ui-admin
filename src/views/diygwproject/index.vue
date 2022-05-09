<template>
	<div class="admin-project-container">
		<el-card shadow="hover">
			<div class="admin-user-search mb15">
				<el-input size="default" placeholder="请输入应用名称" clearable  v-model="tableData.param.title" style="max-width: 180px"> </el-input>
				<el-button @click="initTableData" size="default" type="primary" class="ml10">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAddProject">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增应用
				</el-button>
				<el-button
					size="default"
					class="ml10"
					type="danger"
					:disabled="multiple"
					@click="onRowDel">
					<el-icon>
						<ele-Delete />
					</el-icon>
					删除
				</el-button>
			</div>
			<el-table :data="tableData.data" v-loading="tableData.loading" @selection-change="handleSelectionChange" style="width: 100%">
				<el-table-column type="selection" width="55" align="center" />
				<el-table-column prop="title" label="应用名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="200">
					<template #default="scope">
						<el-button  size="small" type="text" @click="onOpenEditProject(scope.row)">设计</el-button>
						<el-button  size="small" type="text" @click="onCopyProject(scope.row)">复制</el-button>
						<el-button  size="small" type="text" @click="onOpenEditProject(scope.row)">修改</el-button>
						<el-button  size="small" type="text" @click="onRowDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				@size-change="onHandleSizeChange"
				@current-change="onHandleCurrentChange"
				class="mt15"
				:pager-count="5"
				:page-sizes="[10, 20, 30]"
				v-model:current-page="tableData.param.pageNum"
				background
				v-model:page-size="tableData.param.pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="tableData.total"
			>
			</el-pagination>
		</el-card>
		<AddProject ref="addProjectRef" @refresh="initTableData"/>
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import AddProject from '@/views/diygwproject/component/addProject.vue';
import {listData,delData,copyData} from '@/api/index'
// 定义接口来定义对象的类型


export default defineComponent({
	name: 'diyproject',
	components: { AddProject},
	setup() {
		const addProjectRef = ref();
		const state = reactive({
			ids: [],
			// 非单个禁用
			single: true,
			// 非多个禁用
			multiple: true,
			tableData: {
				data: [],
				total: 0,
				loading: false,
				param: {
					title:'',
					pageNum: 1,
					pageSize: 10,
				},
			},
		});
		// 初始化表格数据
		const initTableData = () => {
			state.tableData.loading = true
			listData('/admin/project',state.tableData.param).then(res=>{
				state.tableData.data = res.rows;
				state.tableData.total = res.total;
				state.tableData.loading = false
			})
			
		};
		// 打开新增应用弹窗
		const onOpenAddProject = () => {
			addProjectRef.value.openDialog();
		};
		// 打开修改应用弹窗
		const onOpenEditProject = (row: Object) => {
			addProjectRef.value.openDialog(row);
		};

		const onCopyProject = (row: any) => {
			let id = row.id
			copyData('/admin/project',id).then(res=>{
				if(res.code==200){
					ElMessage.success('删除成功');
					initTableData();
				}else{
					ElMessage.error(res.msg);
				}
			})
		};
		// 删除应用
		const onRowDel = (row: any) => {
			ElMessageBox.confirm(`此操作将永久删除选择的应用，是否继续?`, '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				
				const id =  row.id || state.ids

				delData('/admin/project',id).then(res=>{
					if(res.code==200){
						ElMessage.success('复制成功');
						initTableData();
					}else{
						ElMessage.error(res.msg);
					}
				})
			})
			.catch(() => {});
		};
		// 分页改变
		const onHandleSizeChange = (val: number) => {
			state.tableData.param.pageSize = val;
			initTableData()
		};
		// 分页改变
		const onHandleCurrentChange = (val: number) => {
			state.tableData.param.pageNum = val;
			initTableData()
		};

		const handleSelectionChange = (selection) =>{
			state.ids = selection.map(item => item.id);
			state.single = selection.length !== 1;
			state.multiple = !selection.length;
		}

		// 页面加载时
		onMounted(() => {
			initTableData();
		});
		return {
			handleSelectionChange,
			initTableData,
			addProjectRef,
			onOpenAddProject,
			onOpenEditProject,
			onCopyProject,
			onRowDel,
			onHandleSizeChange,
			onHandleCurrentChange,
			...toRefs(state),
		};
	},
});
</script>
