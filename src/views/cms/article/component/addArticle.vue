<template>
	<el-dialog top="5vh" :title="article.id ? '修改文章' : '新增文章'" v-model="isShowDialog" width="800px">
		<el-form :model="article" ref="articleForm" size="default" :rules="articleRules" label-width="120px">
			<el-row :gutter="35">
				<el-col class="mb20" :xs="24">
					<el-form-item label="文章名称" prop="title">
						<el-input v-model="article.title" placeholder="请输入文章名称" clearable></el-input>
					</el-form-item>
				</el-col>
				<el-col class="mb20" :xs="24">
					<el-form-item label="上级分类">
						<el-cascader
							:options="articleData"
							:props="{ multiple: true,checkStrictly: true, value: 'id', label: 'title' }"
							placeholder="请选择分类"
							clearable
							class="w100"
							v-model="article.ancestors"
						>
							<template #default="{ node, data }">
								<span>{{ data.title }}</span>
								<span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
							</template>
						</el-cascader>
					</el-form-item>
				</el-col>
				<el-col class="mb20" :xs="24">
					<el-form-item label="文章描述" prop="description">
						<el-input v-model="article.description" placeholder="请输入文章名称" clearable></el-input>
					</el-form-item>
				</el-col>
				<el-col class="mb20" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
					<diygw-image label="缩略图" propname="img" v-model="article.img" />
				</el-col>
				<el-col class="mb20" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
					<el-form-item label="文章排序" prop="orderNum">
						<el-input-number v-model="article.orderNum"  placeholder="请输入文章排序" clearable></el-input-number>
						<el-tooltip hide-after="0" effect="dark" content="越小越靠前" placement="top">
							<SvgIcon name="ele-QuestionFilled" :size="20" />
						</el-tooltip>
					</el-form-item>
				</el-col>
				<el-col class="mb20" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
					<el-form-item label="阅读量" prop="readNum">
						<el-input-number v-model="article.readNum"  placeholder="请输入阅读量" clearable></el-input-number>
					</el-form-item>
				</el-col>
				<el-col class="mb20" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
					<el-form-item label="点赞数" prop="zanNum">
						<el-input-number v-model="article.zanNum"  placeholder="请输入点赞数" clearable></el-input-number>
					</el-form-item>
				</el-col>
				<el-col :xs="24" >
					<diygw-editor v-model="article.content" :height="300"></diygw-editor>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="onCancel" size="default">取 消</el-button>
				<el-button type="primary" @click="onSubmit" size="default">{{ article.id ? '修 改' : '新 增' }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts">
import { reactive, toRefs,onMounted, defineComponent} from 'vue';
import { listAllData, postData } from '@/api/index';
import { ElMessage } from 'element-plus';
import DiygwImage from '@/components/image/index.vue';
import DiygwEditor from '@/components/editor/index.vue';
import { deepClone, handleTree } from '@/utils/other';

// 定义接口来定义对象的类型
interface MenuDataTree {
	id: number;
	label: string;
	children?: MenuDataTree[];
}

export default defineComponent({
	name: 'cmsAddArticle',
	components: {
		DiygwImage,
		DiygwEditor
	},
	props:{
		articleData: {
			type: Array,
			default: () => [],
		},
	},
	setup(props, { emit }) {
		let articleInit = {
			id: '',
			description:'',
			content:'',
			ancestors:[],
			orderNum: 0,
			readNum: 0,
			zanNum: 0,
			title: '', // 文章名称
			img: '',
		};
		const state = reactive({
			articleData:[],
			articleForm: null,
			isShowDialog: false,
			article: articleInit,
			articleRules: {
				title: { required: true, message: '文章名称不能为空', trigger: 'blur' },
				ancestors: { required: true, message: '上级分类不能为空', trigger: 'change' },
			},
		});
		// 打开弹窗
		const openDialog = (article = null) => {
			if (article) {
				if(article.ancestors){
					article.ancestors = JSON.parse(article.ancestors)
				}else{
					article.ancestors = []
				}
				state.article = article;
			} else {
				state.article = deepClone(articleInit);
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
			state.articleForm.validate((valid) => {
				if (valid) {
					let article = deepClone(state.article);
					if(article.ancestors.length>0){
						article.ancestors = JSON.stringify(state.article.ancestors)
					}else{
						article.ancestors = ''
					}
					postData(state.article.id ? '/admin/article/update' : '/admin/article/add', article).then((res) => {
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

		onMounted(() => {
			listAllData('/admin/category',{}).then(res=>{
				state.articleData =  handleTree(res.data,'id','parentId','children');
			})
		})
 
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
.admin-add-article-container {
	.menu-data-tree {
		border: var(--el-input-border, var(--el-border-base));
		border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
		padding: 5px;
	}
}
</style>
