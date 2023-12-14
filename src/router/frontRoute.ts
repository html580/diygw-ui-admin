//默认静态页面路由，替换src/route/frontRoute.ts
import { RouteRecordRaw } from 'vue-router';

/**
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      isLink：        是否超链接菜单，开启外链条件，`1、isLink: 链接地址不为空`
 *      isHide：        是否隐藏此路由
 *      isKeepAlive：   是否缓存组件状态
 *      isAffix：       是否固定在 tagsView 栏上
 *      isIframe：      是否内嵌窗口，开启条件，`1、isIframe:true 2、isLink：链接地址不为空`
 *      roles：         当前路由权限标识，取角色管理。控制路由显示、隐藏。超级管理员：admin 普通角色：common
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */

/**
 * 定义动态路由
 * 前端添加路由，请在顶级节点的 `children 数组` 里添加
 * @description 未开启 isRequestRoutes 为 true 时使用（前端控制路由），开启时第一个顶级 children 的路由将被替换成接口请求回来的路由数据
 * @returns 返回路由菜单数据
 */
let routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: '/',
		component: () => import('@/layout/index.vue'),
		redirect: '/index',
		meta: {
			isKeepAlive: true
		},
		children: [
			{
				path: '/index',
				name: 'index',
				component: () => import('@/views/index.vue'),
				meta: {
					title: '班级管理',
					isLink: '',
					isHide: false,
					isKeepAlive: false,
					isAffix: false,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'diy-icon-home'
				}
			},
			{
				path: '/kemu',
				name: 'kemu',
				component: () => import('@/views/kemu.vue'),
				meta: {
					title: '科目管理',
					isLink: '',
					isHide: false,
					isKeepAlive: false,
					isAffix: false,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'diy-icon-home'
				}
			},
			{
				path: '/laoshi',
				name: 'laoshi',
				component: () => import('@/views/laoshi.vue'),
				meta: {
					title: '老师管理',
					isLink: '',
					isHide: false,
					isKeepAlive: false,
					isAffix: false,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'diy-icon-yuyin'
				}
			},
			{
				path: '/laoshi2',
				name: 'laoshi2',
				component: () => import('@/views/laoshi2.vue'),
				meta: {
					title: '老师管理',
					isLink: '',
					isHide: false,
					isKeepAlive: false,
					isAffix: false,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'diy-icon-mingci'
				}
			}
		]
	}
];

export const frontRoutes = {
	dynamicRoutes: routes
};
