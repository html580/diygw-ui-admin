/* eslint-disable */
import * as axios from 'axios'

// 声明文件，*.vue 后缀的文件交给 vue 模块来处理
declare module '*.vue' {
	import type { DefineComponent } from 'vue';
	const component: DefineComponent<{}, {}, any>;
	export default component;
}


// 声明文件，定义全局变量。其它 app.config.globalProperties.xxx，使用 getCurrentInstance() 来获取
interface Window {
	nextLoading: boolean;
}


//声明API接口返回的数据可以为任意数据
declare module 'axios' {
	export interface AxiosResponse<T = any> extends Promise<T> {}
  
	interface AxiosInstance {
	  (config: AxiosRequestConfig): Promise<any>
	}
}

