<template>
	<el-config-provider :size="getGlobalComponentSize" :locale="i18nLocale">
		<router-view v-show="themeConfig.lockScreenTime > 1" />
		<LockScreen v-if="themeConfig.isLockScreen" />
		<Setings ref="setingsRef" v-show="themeConfig.lockScreenTime > 1" />
		<CloseFull v-if="!themeConfig.isLockScreen" />
	</el-config-provider>
</template>

<script lang="ts">
import { computed, ref, getCurrentInstance, onBeforeMount, onMounted, onUnmounted, nextTick, defineComponent, watch, reactive, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useTagsViewRoutes } from '@/stores/tagsViewRoutes';
import { useThemeConfig } from '@/stores/themeConfig';
import other from '@/utils/other';
import { Local, Session } from '@/utils/storage';
import setIntroduction from '@/utils/setIconfont';
import LockScreen from '@/layout/lockScreen/index.vue';
import Setings from '@/layout/navBars/breadcrumb/setings.vue';
import CloseFull from '@/layout/navBars/breadcrumb/closeFull.vue';
import { Boot, IButtonMenu } from '@wangeditor/editor';

export default defineComponent({
	name: 'app',
	components: { LockScreen, Setings, CloseFull },
	setup() {
		const { proxy } = <any>getCurrentInstance();
		const setingsRef = ref();
		const route = useRoute();
		const stores = useTagsViewRoutes();
		const storesThemeConfig = useThemeConfig();
		const { themeConfig } = storeToRefs(storesThemeConfig);
		const state = reactive({
			i18nLocale: null,
		});
		// 获取全局组件大小
		const getGlobalComponentSize = computed(() => {
			return other.globalComponentSize();
		});
		// 布局配置弹窗打开
		const openSetingsDrawer = () => {
			setingsRef.value.openDrawer();
		};
		// 设置初始化，防止刷新时恢复默认
		onBeforeMount(() => {
			// 设置批量第三方 icon 图标
			setIntroduction.cssCdn();
			// 设置批量第三方 js
			setIntroduction.jsCdn();
		});

		// 定义菜单 class
		class MyButtonMenu implements IButtonMenu {
			public title = '图片上传';
			public iconSvg =
				'<svg viewBox="0 0 1024 1024"><path d="M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z"></path></svg>';
			public tag = 'button';

			getValue() {
				return '';
			}
			isActive() {
				return false; // or false
			}
			isDisabled() {
				return false; // or true
			}
			exec() {
				proxy.mittBus.emit('onImageStoregeShow');
			}
		}

		// 定义菜单配置
		const menu1Conf = {
			key: 'diygwimage', // menu key ，唯一。注册之后，可配置到工具栏
			factory() {
				return new MyButtonMenu();
			},
		};

		// 页面加载时
		onMounted(() => {
			nextTick(() => {
				// 监听布局配置弹窗点击打开
				proxy.mittBus.on('openSetingsDrawer', () => {
					openSetingsDrawer();
				});
				// 设置 i18n，App.vue 中的 el-config-provider
				proxy.mittBus.on('getI18nConfig', (locale: string) => {
					(state.i18nLocale as string | null) = locale;
				});
				// 获取缓存中的布局配置
				if (Local.get('themeConfig')) {
					storesThemeConfig.setThemeConfig(Local.get('themeConfig'));
					document.documentElement.style.cssText = Local.get('themeConfigStyle');
				}
				// 获取缓存中的全屏配置
				if (Session.get('isTagsViewCurrenFull')) {
					stores.setCurrenFullscreen(Session.get('isTagsViewCurrenFull'));
				}
				// 注册到 wangEditor
				Boot.registerMenu(menu1Conf);
			});
		});
		// 页面销毁时，关闭监听布局配置/i18n监听
		onUnmounted(() => {
			proxy.mittBus.off('openSetingsDrawer', () => {});
			proxy.mittBus.off('getI18nConfig', () => {});
		});
		// 监听路由的变化，设置网站标题
		watch(
			() => route.path,
			() => {
				other.useTitle();
			},
			{
				deep: true,
			}
		);
		return {
			themeConfig,
			setingsRef,
			getGlobalComponentSize,
			...toRefs(state),
		};
	},
});
</script>
