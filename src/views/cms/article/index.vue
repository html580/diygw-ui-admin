<template>
	<div class="admin-article-container">
		<el-card shadow="hover">
			<div class="admin-user-search mb15">
				<el-input size="default" placeholder="请输入文章标题" clearable  v-model="tableData.param.title" style="max-width: 180px"> </el-input>
				<el-button @click="initTableData" size="default" type="primary" class="ml10">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAddArticle">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增文章
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
				<el-table-column prop="title" label="文章标题" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="200">
					<template #default="scope">
						<el-button  size="small" type="text" @click="onCopyArticle(scope.row)">复制</el-button>
						<el-button  size="small" type="text" @click="onOpenEditArticle(scope.row)">修改</el-button>
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
		<AddArticle ref="addArticleRef" @refresh="initTableData"/>
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import AddArticle from '@/views/cms/article/component/addArticle.vue';
import {listData,delData,copyData} from '@/api/index'
// 定义接口来定义对象的类型


export default defineComponent({
	name: 'diyarticle',
	components: { AddArticle},
	setup() {
		const addArticleRef = ref();
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
			listData('/admin/article',state.tableData.param).then(res=>{
				state.tableData.data = res.rows;
				state.tableData.total = res.total;
				state.tableData.loading = false
			})
			
		};
		// 打开新增文章弹窗
		const onOpenAddArticle = () => {
			addArticleRef.value.openDialog();
		};
		// 打开修改文章弹窗
		const onOpenEditArticle = (row: Object) => {
			addArticleRef.value.openDialog(row);
		};

		const onCopyArticle = (row: any) => {
			let id = row.id
			copyData('/admin/article',id).then(res=>{
				if(res.code==200){
					ElMessage.success('删除成功');
					initTableData();
				}else{
					ElMessage.error(res.msg);
				}
			})
		};
		// 删除文章
		const onRowDel = (row: any) => {
			ElMessageBox.confirm(`此操作将永久删除选择的文章，是否继续?`, '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				
				const id =  row.id || state.ids

				delData('/admin/article',id).then(res=>{
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
			addArticleRef,
			onOpenAddArticle,
			onOpenEditArticle,
			onCopyArticle,
			onRowDel,
			onHandleSizeChange,
			onHandleCurrentChange,
			...toRefs(state),
		};
	},
});
</script>
