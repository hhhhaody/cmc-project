import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import ElementPlus from 'element-plus'
import Vant from 'vant';
import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/store.js';
import 'vant/lib/index.css';

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(createPinia())
app.use(router)
app.use(ElementPlus, { locale: zhCn })
app.use(Vant);

// 初始化用户状态
const userStore = useUserStore();
userStore.initializeStore();

app.mount('#app')
