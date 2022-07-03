import { createApp } from 'vue';
import pinia from '@/stores/index';
import App from './App.vue';
import router from './router';
import { directive } from '@/utils/directive';
import { i18n } from '@/i18n/index';
import other from '@/utils/other';
import http from '@/utils/http';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '@/theme/index.scss';
import mitt from 'mitt';
import VueGridLayout from 'vue-grid-layout';
import { getDicts } from './api';
import {selectDictLabel} from '@/utils/index'

const app = createApp(App);

directive(app);
other.elSvg(app);

app.use(pinia).use(router).use(ElementPlus, { i18n: i18n.global.t }).use(i18n).use(VueGridLayout).mount('#app');

app.config.globalProperties.mittBus = mitt();
app.config.globalProperties.getDicts = getDicts
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.$http = http
