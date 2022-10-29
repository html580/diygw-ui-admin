<template>
	<div class="flex">
		<el-image :style="style" :preview-teleported="true" :preview-src-list="srcs" v-for="item in srcs" :key="item" :src="item" :fit="fit"></el-image>
	</div>
</template>
<script lang="ts">
export default {
	name: 'DiyImg',
};
</script>
<script lang="ts" setup>
import { computed } from 'vue';
const props = defineProps({
	// 外部v-model值
	src: {
		type: String,
		default: '',
	},
	style: {
		type: String,
		default: '',
	},
	fit: {
		type: String,
		default: 'contain',
	},
});

const srcs = computed(() => {
	if (props.src) {
		if (Array.isArray(props.src)) {
			return props.src;
		}
		let src = props.src.trim();
		if (src.startsWith('[') && src.endsWith(']')) {
			return JSON.parse(src);
		} else {
			return [props.src];
		}
	}
	return [];
});
</script>

<style lang="scss" scoped>
.sortable-ghost {
	opacity: 0;
}
</style>
