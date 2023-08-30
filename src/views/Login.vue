<template>
    <div class="login" clearfix>
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
import axios from "axios";
import { getQueryVariable } from '../router/index.js'
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
        doLogin() {
            if (!this.user.username) {
                this.$message.error("请输入用户名！");
                return;
            } else if (!this.user.password) {
                this.$message.error("请输入密码！");
                return;
            } else {
                //校验用户名和密码是否正确;
                axios
                    .post("/api/home/login", {
                        username: this.user.username,
                        passwd: this.user.password
                    })
                    .then(res => {
                        if (res.data.code === 200 && res.data.data) {
                            const token = res.data.data
                            sessionStorage.setItem("mobile_data_token", token);
                            if (getQueryVariable('cb')) {
                                location.href = decodeURIComponent(getQueryVariable('cb'))
                            } else if (getQueryVariable('pid')) {
                                if (getQueryVariable('type') == 3) {
                                    location.href = '/project';
                                } else if (getQueryVariable('type') == 2) {
                                    location.href = '/control?pid=' + getQueryVariable('pid') + location.hash
                                } else {
                                    location.href = '/?pid=' + getQueryVariable('pid') + location.hash
                                }
                            } else {
                                location.href = '/index'
                            }

                        } else {
                            this.autologin = false;
                            alert("您输入的用户名或密码错误！");
                        }
                    });
            }
        }
    }
};
</script>
 
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login {
    width: 100%;
    height: 740px;
    background-size: cover;
    overflow: hidden;
}

.login-wrap {
    background-color: rgba(255, 255, 255, 0.6);
    width: 400px;
    height: 300px;
    margin: 215px auto;
    overflow: hidden;
    padding-top: 10px;
    line-height: 40px;
    border-radius: 2vh;
}

#password {
    margin-bottom: 5px;
}

h3 {
    color: #729fd0;
    font-size: 24px;
    text-align: center;
}

hr {
    background-color: #444;
    margin: 20px auto;
}

a {
    text-decoration: none;
    color: #aaa;
    font-size: 15px;
}

a:hover {
    color: coral;
}

.el-button {
    width: 80%;
    margin-left: -50px;
}

.loginbtn {
    margin-top: 30px;
    margin-left: 60px;
}
</style>