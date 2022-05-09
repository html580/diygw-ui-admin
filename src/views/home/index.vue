<template>
	<div class="home-container" >
		<el-row :gutter="15" class="home-card-one mb15">
			<el-col
				:xs="24"
				:sm="12"
				:md="12"
				:lg="6"
				:xl="6"
				v-for="(v, k) in homeOne"
				:key="k"
				:class="{ 'home-media home-media-lg': k > 1, 'home-media-sm': k === 1 }"
			>
				<div class="home-card-item flex">
					<div class="flex-margin flex w100" :class="` home-one-animation${k}`">
						<div class="flex-auto">
							<span class="font30" :id="`titleNum${k}`"></span>
							<div class="mt10" >{{ v.num3 }}</div>
						</div>
						<div class="home-card-item-icon flex" :style="{ background: `var(${v.color2})` }">
							<i class=" flex-margin font32" :class="v.num4" :style="{ color: `var(${v.color3})` }"></i>
						</div>
					</div>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="15" class="home-card-two mb15">
			<el-col :xs="24" :sm="14" :md="14" :lg="12" :xl="12">
				<div class="home-card-item">
					<div style="height: 100%" ref="homeLineRef"></div>
				</div>
			</el-col>
			<el-col :xs="24" :sm="10" :md="10" :lg="12" :xl="12" class="home-media">
				<div class="home-card-item">
					<div style="height: 100%" ref="homePieRef"></div>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, defineComponent, onMounted, ref, watch, nextTick, onActivated } from 'vue';
import * as echarts from 'echarts';
import { useStore } from '@/store/index';
import { CountUp } from 'countup.js';
import { getData } from '@/api';
let global: any = {
	homeChartOne: null,
	homeChartTwo: null,
	homeCharThree: null,
	dispose: [null, '', undefined],
};

export default defineComponent({
	name: 'home',
	setup() {
		const homeLineRef = ref();
		const homePieRef = ref();
		const homeBarRef = ref();
		const store = useStore();
		const state = reactive({
			isShow:false,
			homeOne: [
				{
					num1: 125,
					num3: '今日访问次数',
					num4: 'iconfont icon-putong',
					color1: '#FF6462',
					color2: '--next-color-primary-lighter',
					color3: '--el-color-primary',
				},
				{
					num1: 653,
					num3: '今日提交次数',
					num4: 'diygw-com diygw-lists',
					color1: '#6690F9',
					color2: '--el-color-success-lighter',
					color3: '--el-color-success',
				},
				{
					num1: 12565,
					num3: '今日收益',
					num4: 'diygw-com diygw-renminbi',
					color1: '#6690F9',
					color2: '--el-color-warning-lighter',
					color3: '--el-color-warning',
				},
				{
					num1: 52043,
					num2: '-10.01',
					num3: '累计收益',
					num4: 'diygw-com diygw-jinrongicon',
					color1: '#FF6462',
					color2: '--el-color-danger-lighter',
					color3: '--el-color-danger',
				},
			],
			myCharts: [],
			charts: {
				theme: '',
				bgColor: '',
				color: '#303133',
			},
		});
		// 折线图
		const initLineChart = (xAxisData,seriesData) => {
			if (!global.dispose.some((b: any) => b === global.homeChartOne)) global.homeChartOne.dispose();
			global.homeChartOne = <any>echarts.init(homeLineRef.value, state.charts.theme);
			const option = {
				backgroundColor: state.charts.bgColor,
				title: {
					text: '访问量',
					x: 'left',
					textStyle: { fontSize: '15', color: state.charts.color },
				},
				grid: { top: 70, right: 20, bottom: 30, left: 30 },
				tooltip: { trigger: 'axis' },
				legend: { data: ['最近七天访问量'], right: 0 },
				xAxis: {
					data: xAxisData,
				},
				yAxis: [
					{
						type: 'value',
						name: '次数',
						splitLine: { show: true, lineStyle: { type: 'dashed', color: '#f5f5f5' } },
					},
				],
				series: [
					{
						name: '最近七天访问量',
						type: 'line',
						symbolSize: 6,
						symbol: 'circle',
						smooth: true,
						data: seriesData,
						lineStyle: { color: '#fe9a8b' },
						itemStyle: { color: '#fe9a8b', borderColor: '#fe9a8b' },
						areaStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: '#fe9a8bb3' },
								{ offset: 1, color: '#fe9a8b03' },
							]),
						},
					}
				],
			};
			(<any>global.homeChartOne).setOption(option);
			(<any>state.myCharts).push(global.homeChartOne);
		};
		// 饼图
		const initPieChart = (getname,getvalue) => {
			if (!global.dispose.some((b: any) => b === global.homeChartTwo)) global.homeChartTwo.dispose();
			global.homeChartTwo = <any>echarts.init(homePieRef.value, state.charts.theme);
			const colorList = ['#51A3FC', '#36C78B', '#FEC279', '#968AF5', '#E790E8'];
			var data = [];
			for (var i = 0; i < getname.length; i++) {
				data.push({ itemStyle: {color:colorList[i]}, value: getvalue[i] });
			}
			const option = {
				backgroundColor: state.charts.bgColor,
				title: {
					text: '最近一个月热门应用',
					x: 'left',
					textStyle: { fontSize: '15', color: state.charts.color },
				},
				tooltip: { trigger: 'axis' },
				xAxis: {
					type: 'category',
					
					axisLabel:{
							interval : 0,
							formatter : function(params){
								let tip1 = "";
								let tip = "";
								let le = params.length  //图例文本的长度
								if(le > 4){   //几个字换行大于几就可以了
									let l = Math.ceil(le/6)  //有些不能整除，会有余数，向上取整
									for(let i = 1;i <= l;i++){ //循环
										if(i < l){ //最后一段字符不能有\n
											tip1 += params.slice(i*6-6,i*6)+'\n'; //字符串拼接
										}else if(i === l){  //最后一段字符不一定够9个
											tip = tip1 + params.slice((l-1)*6,le) //最后的拼接在最后
										}
									}
									return tip;
								}else{
									tip = params  //前面定义了tip为空，这里要重新赋值，不然会替换为空
									return tip;
								}
							},
					},
					nameTextStyle:{
						overflow:'truncate'
					},
					data: getname
				},
				yAxis: {
					type: 'value'
				},
				series: [
					{
						data: data,
						type: 'bar'
					}
				] 
			};
			(<any>global.homeChartTwo).setOption(option);
			(<any>state.myCharts).push(global.homeChartTwo);
		};
	
		// 批量设置 echarts resize
		const initEchartsResizeFun = () => {
			nextTick(() => {
				for (let i = 0; i < state.myCharts.length; i++) {
					setTimeout(() => {
						(<any>state.myCharts[i]).resize();
					}, i * 1000);
				}
			});
		};

		// 初始化数字滚动
		const initNumCountUp = () => {
			nextTick(() => {
				state.homeOne.forEach((item,index)=>{
						new CountUp('titleNum'+index, item.num1).start();
				})
			});
		};

		// 批量设置 echarts resize
		const initEchartsResize = () => {
			window.addEventListener('resize', initEchartsResizeFun);
		};
		// 页面加载时
		onMounted(() => {
			// getData('/admin/getIndexdata',{}).then(res=>{
			// 	initLineChart(res.data['times'],res.data['visits']);
			// 	state.homeOne[0].num1 = res.data['visitTotal']
			// 	state.homeOne[1].num1 = res.data['formTotal']
			// 	state.homeOne[2].num1 = res.data['orderTotal']
			// 	state.homeOne[3].num1 = res.data['orderTotals']
			// 	initEchartsResize();
			// 	initNumCountUp();
			// 	initPieChart(res.data['projects'],res.data['projectvisits']);
			// })
			
		});
		// 由于页面缓存原因，keep-alive
		onActivated(() => {
			initEchartsResizeFun();
		});
		// 监听 vuex 中的 tagsview 开启全屏变化，重新 resize 图表，防止不出现/大小不变等
		watch(
			() => store.state.tagsViewRoutes.isTagsViewCurrenFull,
			() => {
				initEchartsResizeFun();
			}
		);
		// // 监听 vuex 中是否开启深色主题
		// watch(
		// 	() => store.state.themeConfig.themeConfig.isIsDark,
		// 	(isIsDark) => {
		// 		nextTick(() => {
		// 			state.charts.theme = isIsDark ? 'dark' : '';
		// 			state.charts.bgColor = isIsDark ? 'transparent' : '';
		// 			state.charts.color = isIsDark ? '#dadada' : '#303133';
		// 			// setTimeout(() => {
		// 			// 	initLineChart();
		// 			// }, 500);
		// 			// setTimeout(() => {
		// 			// 	initPieChart();
		// 			// }, 700);
		// 			// setTimeout(() => {
		// 			// 	initBarChart();
		// 			// }, 1000);
		// 		});
		// 	},
		// 	{
		// 		deep: true,
		// 		immediate: true,
		// 	}
		// );
		return {
			homeLineRef,
			homePieRef,
			homeBarRef,
			...toRefs(state),
		};
	},
});
</script>

<style scoped lang="scss">
$homeNavLengh: 8;
.home-container {
	overflow: hidden;
	.home-card-one,
	.home-card-two,
	.home-card-three {
		.home-card-item {
			width: 100%;
			height: 130px;
			border-radius: 4px;
			transition: all ease 0.3s;
			padding: 20px;
			overflow: hidden;
			background: var(--el-color-white);
			color: var(--el-text-color-primary);
			border: 1px solid var(--next-border-color-light);
			&:hover {
				box-shadow: 0 2px 12px var(--next-color-dark-hover);
				transition: all ease 0.3s;
			}
			&-icon {
				width: 70px;
				height: 70px;
				border-radius: 100%;
				flex-shrink: 1;
				i {
					color: var(--el-text-color-placeholder);
				}
			}
			&-title {
				font-size: 15px;
				font-weight: bold;
				height: 30px;
			}
		}
	}
	.home-card-one {
		@for $i from 0 through 3 {
			.home-one-animation#{$i} {
				opacity: 0;
				animation-name: error-num;
				animation-duration: 0.5s;
				animation-fill-mode: forwards;
				animation-delay: calc($i/10) + s;
			}
		}
	}
	.home-card-two,
	.home-card-three {
		.home-card-item {
			height: 400px;
			width: 100%;
			overflow: hidden;
			.home-monitor {
				height: 100%;
				.flex-warp-item {
					width: 25%;
					height: 111px;
					display: flex;
					.flex-warp-item-box {
						margin: auto;
						text-align: center;
						color: var(--el-text-color-primary);
						display: flex;
						border-radius: 5px;
						background: var(--next-bg-color);
						cursor: pointer;
						transition: all 0.3s ease;
						&:hover {
							background: var(--el-color-primary-light-9);
							transition: all 0.3s ease;
						}
					}
					@for $i from 0 through $homeNavLengh {
						.home-animation#{$i} {
							opacity: 0;
							animation-name: error-num;
							animation-duration: 0.5s;
							animation-fill-mode: forwards;
							animation-delay: calc($i/10) + s;
						}
					}
				}
			}
		}
	}
}
</style>
