<template>
    <div class="login" clearfix>
        <h1>
            <span>
                中建科技CMC产线智能化管理系统
            </span>
        </h1>

        <div v-if="autologin">登录中...</div>
        <div v-if="!autologin" class="login-wrap">
            <el-row type="flex" justify="center">
                <el-form ref="loginForm" :model="user" status-icon label-width="80px">
                    <h3>登录</h3>
                    <hr>
                    <el-form-item prop="username" label="用户名">
                        <el-input v-model="user.username" placeholder="请输入用户名" prefix-icon
                            @keyup.enter.native="doLogin()"></el-input>
                    </el-form-item>
                    <el-form-item id="password" prop="password" label="密码">
                        <el-input v-model="user.password" show-password placeholder="请输入密码"
                            @keyup.enter.native="doLogin()"></el-input>
                    </el-form-item>
                    <el-form-item class="loginbtn">
                        <el-button type="primary" @click="doLogin()">登 录</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
        </div>
    </div>
</template>
 
<script>
import { getQueryVariable } from '../router/index.js';
import { loginUser } from "../apis/login";
import { ElMessage } from 'element-plus';
import { useUserStore } from '../stores/store.js';
import { jwtDecode } from 'jwt-decode';

//登录功能
export default {
    name: "login",
    data() {
        return {
            autologin: false,
            user: {
                username: "",
                password: ""
            },
            loading: false
        };
    },
    created() {
        if (getQueryVariable('u') && getQueryVariable('p')) {
            this.autologin = true;
            this.user.username = decodeURIComponent(getQueryVariable('u'));
            this.user.password = decodeURIComponent(getQueryVariable('p'));
            this.doLogin();
        }
    },
    methods: {
        async doLogin() {
            if (!this.user.username || !this.user.password) {
                ElMessage.error("请输入用户名和密码！");
                return;
            }

            this.loading = true;

            try {
                const response = await loginUser(this.user.username, this.user.password);
                if (response && response.code !== 1) {
                    ElMessage.error(response.msg || "登录失败");
                    this.loading = false;
                    return;
                }

                localStorage.setItem('jwt_token', response.data); // 保存jwt令牌到localStorage
                const decodedToken = jwtDecode(response.data);
                localStorage.setItem('adminType', decodedToken.adminType); // 保存用户角色到 localStorage
                sessionStorage.setItem("mobile_data_token", response.data); // 保存jwt令牌到sessionStorage

                const userStore = useUserStore();
                userStore.setAdminType(decodedToken.adminType); // 更新 Pinia store 中的用户角色状态

                userStore.setUserRole(decodedToken.adminType);
                localStorage.setItem('userRole',decodedToken.adminType);

                // 解码JWT令牌，获取账号角色，并更新全局状态
                // try {
                //     const decodedToken = jwtDecode(response.data);
                //     store.adminType = decodedToken.adminType || 'USER';
                // } catch (error) {
                //     console.error("JWT 解码错误:", error);
                // }
                this.$router.push({ name: 'home1' });
            } catch (error) {
                ElMessage.error(error.response?.data?.msg || "登录异常，请稍后重试");
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>
 
<style scoped>
.login {
    background-size: cover;
    background-image: url('/src/assets/images/map-2.png');
    background-position: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2000;
}

.login-wrap {
    background-color: rgba(255, 255, 255, 0.3);
    width: 400px;
    height: 300px;
    margin: 30vh auto;
    overflow: hidden;
    padding-top: 40px;
    line-height: 40px;
    border-radius: 2vh;
}

#password {
    margin-bottom: 5px;
}

h3 {
    color: #ffffff;
    font-size: 26px;
    /* line-height: 30px; */
    text-align: center;
}

hr {
    background-color: #444;
    margin: 20px auto;
}


.el-button {
    width: 80%;
    margin-left: -50px;
}

.loginbtn {
    margin-top: 30px;
    margin-left: 60px;
}

h1 {
    position: relative;
    text-align: center;
    color: #ffffff9c;
    font-size: 40px;
    top: 5vh;
}

:deep .el-form-item__label {
    color: #fff !important;
    text-shadow: 1px 1px 5px #b2c8e1;

}

:deep .el-button--primary {
    --el-button-bg-color: #33496169 !important;
    --el-button-border-color: #828d99 !important
}

.el-message {
    z-index: 10000;
    /* 或者更高，确保高于登录页面 */
}
</style>