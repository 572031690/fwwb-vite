import {createApp} from 'vue';
import App from './App.vue';
import router from './router/index'; //引入vue-router
import vuex from "./store/index";
// import './index.css';
import 'element-plus/lib/theme-chalk/index.css'
import ElementPlus from 'element-plus'


const app = createApp(App);
app.use(router).use(vuex).use(ElementPlus); // 挂载到app上
app.mount('#app');