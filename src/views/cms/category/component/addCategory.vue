<template>
	<div class="admin-add-category-container">
		<el-dialog :title="category.id ? '修改分类' : '新增分类'" v-model="isShowDialog" width="800px">
			<el-form :model="category" ref="categoryForm" size="default" :rules="categoryRules" label-width="120px">
				<el-row :gutter="35">
					<el-col class="mb20" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item label="分类名称" prop="title">
							<el-input v-model="category.title" placeholder="请输入分类名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col class="mb20" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item label="上级分类">
							<el-cascader
								:options="categoryData"
								:props="{ checkStrictly: true, value: 'id', label: 'title' }"
								placeholder="请选择分类"
								clearable
								class="w100"
								v-model="category.ancestors"
							>
								<template #default="{ node, data }">
									<span>{{ data.title }}</span>
									<span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
								</template>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col class="mb20" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<diygw-image label="分类图片" propname="img" v-model="category.img" />
					</el-col>
					<el-col class="mb20" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item label="分类排序" prop="usertotal">
							<el-input-number v-model="category.orderNum"  placeholder="请输入分类排序" clearable></el-input-number>
							<el-tooltip hide-after="0" effect="dark" content="越小越靠前" placement="top">
								<SvgIcon name="ele-QuestionFilled" :size="20" />
							</el-tooltip>
						</el-form-item>
					</el-col>
					
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ category.id ? '修 改' : '新 增' }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent} from 'vue';
import {  postData } from '@/api/index';
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
	name: 'adminAddCategory',
	components: {
		DiygwImage,
	},
	props:{
		categoryData: {
			type: Array,
			default: () => [],
		},
	},
	setup(props, { emit }) {
		let categoryInit = {
			id: '',
			ancestors:[],
			orderNum: 0,
			title: '', // 分类名称
			img: '',
		};
		const state = reactive({
			// categoryData:[],
			categoryForm: null,
			isShowDialog: false,
			category: categoryInit,
			categoryRules: {
				title: { required: true, message: '分类名称不能为空', trigger: 'blur' },
			},
		});
		// 打开弹窗
		const openDialog = (category = null) => {
			
			if (category) {
				let configs = JSON.parse(category.inits);
				if (configs.pwd) {
					let bytes = CryptoTS.AES.decrypt(configs.pwd, 'diygwcom');
					if (bytes) {
						configs.pwd = bytes.toString(CryptoTS.enc.Utf8);
					} else {
						configs.pwd = '';
					}
				}
				configs.id = category.id;
				state.category = configs;
			} else {
				state.category = deepClone(categoryInit);
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
			state.categoryForm.validate((valid) => {
				if (valid) {
					let category = deepClone(state.category);
					if(category.ancestors.length>0){
						category.parentId = category.ancestors[category.ancestors.length-1]
						category.ancestors = "0,"+category.ancestors.join(",")
					}else{
						category.parentId = 0
						category.ancestors = "0"
					}
					
					
					postData(state.category.id ? '/admin/category/update' : '/admin/category/add', category).then((res) => {
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

		// onMounted(() => {
		// 	listAllData('/admin/category',{}).then(res=>{
		// 		state.categoryData =  handleTree(res.data,'id','parentId','children');
		// 	})
		// })

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
.admin-add-category-container {
	.menu-data-tree {
		border: var(--el-input-border, var(--el-border-base));
		border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
		padding: 5px;
	}
}
</style>
