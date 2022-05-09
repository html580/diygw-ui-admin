<template>
	<div class="admin-category-container">
		<el-card shadow="hover">
			<div class="admin-user-search mb15">
				<el-input size="default" placeholder="请输入分类名称" clearable  v-model="tableData.param.title" style="max-width: 180px"> </el-input>
				<el-button @click="initTableData" size="default" type="primary" class="ml10">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAddCategory">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增分类
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
			<el-table :data="tableData.data"  row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" v-loading="tableData.loading" @selection-change="handleSelectionChange" style="width: 100%">

				<el-table-column prop="title" label="分类名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="200">
					<template #default="scope">
						<el-button  size="small" type="text" @click="onOpenEditCategory(scope.row)">修改</el-button>
						<el-button  size="small" type="text" @click="onRowDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			
		</el-card>
		<AddCategory ref="addCategoryRef" :category-data="tableData.data" @refresh="initTableData"/>
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import AddCategory from '@/views/cms/category/component/addCategory.vue';
import {listAllData,delData,copyData} from '@/api/index'
import { handleTree } from '@/utils/other';
// 定义接口来定义对象的类型


export default defineComponent({
	name: 'cmscategory',
	components: { AddCategory},
	setup() {
		const addCategoryRef = ref();
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
			listAllData('/admin/category',state.tableData.param).then(res=>{
				state.tableData.data =  handleTree(res.data,'id','parentId','children');
				state.tableData.total = res.total;
				state.tableData.loading = false
			})
			
		};
		// 打开新增分类弹窗
		const onOpenAddCategory = () => {
			addCategoryRef.value.openDialog();
		};
		// 打开修改分类弹窗
		const onOpenEditCategory = (row: Object) => {
			addCategoryRef.value.openDialog(row);
		};

		const onCopyCategory = (row: any) => {
			let id = row.id
			copyData('/admin/category',id).then(res=>{
				if(res.code==200){
					ElMessage.success('删除成功');
					initTableData();
				}else{
					ElMessage.error(res.msg);
				}
			})
		};
		// 删除分类
		const onRowDel = (row: any) => {
			ElMessageBox.confirm(`此操作将永久删除选择的分类，是否继续?`, '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				
				const id =  row.id || state.ids

				delData('/admin/category',id).then(res=>{
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
			addCategoryRef,
			onOpenAddCategory,
			onOpenEditCategory,
			onCopyCategory,
			onRowDel,
			onHandleSizeChange,
			onHandleCurrentChange,
			...toRefs(state),
		};
	},
});
</script>
