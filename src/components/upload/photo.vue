<template>
	<div style="line-height: 0">
		<vue-draggable-next
			v-model="imageList"
			v-bind="{ scroll: true, animation: 400 }"
			class="el-upload-list el-upload-list--picture-card"
			tag="ul"
			:disabled="!isMove"
			@start="state.isdrag = true"
			@end="state.isdrag = false"
		>
			<li v-for="(item, index) in imageList" :key="index" class="el-upload-list__item" :style="`width:${width}px; height:${height}px;`">
				<el-image :style="`width:100%; height:100%`" :src="item" fit="contain" />

				<span v-show="!state.isdrag" :class="{ 'el-upload-list__item-actions': true, 'diy-cm': isMove }">
					<span class="el-upload-list__item-delete">
						<SvgIcon name="ele-Delete" @click="remove(index)" :size="20" />
					</span>
				</span>
			</li>
		</vue-draggable-next>

		<div
			v-if="limit == 0 || (imageList.length == 0 && limit == 1)"
			tabindex="0"
			style="margin-bottom: 8px"
			class="el-upload el-upload--picture-card"
			:style="`width:${width}px; height:${height}px;`"
			@click="handleStorage"
		>
			<SvgIcon name="ele-Plus" :size="20" />
		</div>
		<diy-storage ref="storage" :limit="limit" @confirm="getAttachmentFileList"></diy-storage>
	</div>
</template>

<script lang="ts" setup>
import { nextTick, ref, reactive} from 'vue';
import { useVModel } from '@vueuse/core';
import { VueDraggableNext } from 'vue-draggable-next';
import { ElMessageBox } from 'element-plus';
import DiyStorage from './storage.vue';

const props = defineProps({
	// 外部v-model值
	modelValue: {
		type: Array,
		default: () => [],
	},
	width: {
		default: 80,
	},
	height: {
		default: 80,
	},
	isMove: {
		default: true,
	},
	limit: {
		default: 0,
	},
	customer: {
		type: Object,
		required: false,
		default: () => {},
	},
	contractId: {
		required: false,
		default: '',
	},
	storageType: {
		type: String,
		required: false,
		default: '',
	},
});

const state = reactive({
	isdrag: false,
});
const storage = ref();

const emit = defineEmits(['update:modelValue']);

const imageList = useVModel(props, 'modelValue', emit);

const handleStorage = () => {
	nextTick(() => {
		storage.value.handleStorageDlg( '', '上传图片');
	});
};
// 获取商品相册资源
const getAttachmentFileList = (files = []) => {
	if (!files.length) {
		return;
	}
	files.forEach((item) => {
		imageList.value.push(item.url);
	});
};

const remove = (index = -1) => {
	ElMessageBox({
		message: '是否删除该文件?',
		title: '警告',
		showCancelButton: true,
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(function () {
		imageList.value.splice(index, 1);
	});
};
</script>

<style lang="scss" scoped>
.sortable-ghost {
	opacity: 0;
}
</style>
