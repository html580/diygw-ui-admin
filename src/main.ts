import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { store, key } from './store';
import { directive } from '@/utils/directive';
import { i18n } from '@/i18n/index';
import other from '@/utils/other';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '@/theme/index.scss';
import mitt from 'mitt';
import { getDicts } from './api';

import {selectDictLabel} from '@/utils/index'
const app = createApp(App);

directive(app);
other.elSvg(app);

app.use(router).use(store, key).use(ElementPlus, { i18n: i18n.global.t }).use(i18n).mount('#app');

app.config.globalProperties.mittBus = mitt();
app.config.globalProperties.getDicts = getDicts
app.config.globalProperties.selectDictLabel = selectDictLabel