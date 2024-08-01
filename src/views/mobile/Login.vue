<template>
    <app-page>
        <van-form @submit="onSubmit">
            <van-cell-group inset>
                <van-field v-model="user.username" name="用户名" label="用户名" placeholder="用户名"
                    :rules="[{ required: true, message: '请填写用户名' }]" />
                <van-field v-model="user.password" type="password" name="密码" label="密码" placeholder="密码"
                    :rules="[{ required: true, message: '请填写密码' }]" />
            </van-cell-group>
            <div style="margin: 16px;">
                <van-button round block type="primary" native-type="submit">
                    提交
                </van-button>
            </div>
        </van-form>

    </app-page>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getQueryVariable } from '@/router/index.js';
import { loginUser } from '@/apis/login';
import { useUserStore } from '@/stores/store.js';
import { jwtDecode } from 'jwt-decode';

const user = ref({
    username: '',
    password: ''
});

const loading = ref(false);
const autologin = ref(false);

const router = useRouter();
const userStore = useUserStore();

const doLogin = async () => {
    if (!user.value.username || !user.value.password) {
        ElMessage.error('请输入用户名和密码！');
        return;
    }

    loading.value = true;

    try {
        const response = await loginUser(user.value.username, user.value.password);
        if (response && response.code !== 1) {
            ElMessage.error(response.msg || '登录失败');
            loading.value = false;
            return;
        }

        localStorage.setItem('jwt_token', response.data.token); // 保存jwt令牌到localStorage
        localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo));
        const decodedToken = jwtDecode(response.data.token);
        localStorage.setItem('adminType', decodedToken.adminType); // 保存用户角色到 localStorage
        sessionStorage.setItem('mobile_data_token', response.data.token); // 保存jwt令牌到sessionStorage

        userStore.setAdminType(decodedToken.adminType); // 更新 Pinia store 中的用户角色状态
        userStore.setUserRole(decodedToken.adminType);
        localStorage.setItem('userRole', decodedToken.adminType);

        router.push({ name: 'mobile/home' });
    } catch (error) {
        ElMessage.error(error.response?.data?.msg || '登录异常，请稍后重试');
    } finally {
        loading.value = false;
    }
};

const onSubmit = (values) => {
    console.log('submit', values);
    doLogin()
};

onMounted(() => {
    const username = getQueryVariable('u');
    const password = getQueryVariable('p');
    if (username && password) {
        autologin.value = true;
        user.value.username = decodeURIComponent(username);
        user.value.password = decodeURIComponent(password);
        doLogin();
    }
});


</script>
<style></style>