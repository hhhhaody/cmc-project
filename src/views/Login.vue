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
import { getQueryVariable } from '../router/index.js'
import { loginUser } from "../apis/login";
export default {
    name: "login",
    data() {
        return {
            autologin: false,
            user: {
                username: "",
                password: ""
            }
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
                this.$message.error("请输入用户名和密码！");
                return;
            }

            try {
                const res = await loginUser(this.user.username, this.user.password);
                if (res != null) {
                    // 存储JWT令牌（如果有）
                    localStorage.setItem('jwt_token', res.token);
                    sessionStorage.setItem("mobile_data_token", res.token);
                    // 跳转到主页
                    this.$router.push({ name: 'home1' });  // 确保路由名称与您的路由配置一致
                } else {
                    this.$message.error("登录失败，用户名或密码不正确。");
                }
            }
            catch (error) {
                console.error("登录失败：", error);
                this.$message.error("登录失败，用户名或密码不正确。");
            }
        }
    }
};
</script>
 
<!-- Add "scoped" attribute to limit CSS to this component only -->
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
    z-index: 9999;
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
</style>