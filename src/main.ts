import {createApp} from 'vue';
import App from './App.vue';
import router from './router/index'; //引入vue-router
import vuex from "./store/index";
// import './index.css';
import 'element-plus/lib/theme-chalk/index.css'
import ElementPlus from 'element-plus'
import UILib from '@/components/ui-lib/index'

const app = createApp(App);
app.use(router).use(UILib).use(vuex).use(ElementPlus); // 挂载到app上
app.mount('#app');