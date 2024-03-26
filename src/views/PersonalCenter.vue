<script setup>
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import { jwtDecode } from 'jwt-decode';
import { ref, onMounted, computed, reactive } from 'vue';
import DialogComponent from "../components/DialogComponent.vue";
import { updatePasswordAPI } from "../apis/login";
import { ElMessage, ElMessageBox } from 'element-plus';

const addDialog = ref()

//表单数据
const addform = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})

const userInfo = ref({
    name: '',
    sex: '',
    adminType: '',
    username: '',
    phone: '',
});

const decodeToken = () => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        const decoded = jwtDecode(token);
        // 更新 userInfo
        userInfo.value = {
            name: decoded.name,
            sex: decoded.sex,
            adminType: decoded.adminType,
            username: decoded.username,
            phone: decoded.phone,
        };
    }
};

onMounted(() => {
    decodeToken();
});

const handleUpdatePassword = async () => {
    try {
        const { oldPassword, newPassword } = {
            oldPassword: addform.oldPassword,
            newPassword: addform.newPassword
        };
        const response = await updatePasswordAPI(oldPassword, newPassword); // 确保这里正确地传递了参数
        if (response.code === 1) {
            // 密码更新成功
            ElMessage({
                message: '密码更新成功',
                type: 'success',
            });
            addDialog.value.dialogVisible = false;
            Object.assign(addform, {
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } else {
            // 后端返回了错误消息
            ElMessage({
                message: response.msg || '更新密码失败', // 假设响应中的错误消息在message字段中
                type: 'error',
            });
        }
    } catch (error) {
        // 处理请求发送过程中的异常
        console.error('An error occurred while updating the password', error);
        ElMessage({
            message: error.response?.data?.message || '更新密码过程中发生错误', // 根据实际的响应结构可能需要调整
            type: 'error',
        });
    }
};

</script>

<template>
    <!-- borderbox -->
    <dv-border-box1 ref="borderRef" class="subNavPage animate__animated animate__zoomIn" :color="['#4f698794', '#4f698794']"
        background-color="#3545659e">
        <el-container class="subNavPage">
            <br />
            <h1>个人中心</h1>
            <!-- main -->
            <el-main style="overflow: hidden">
                <div class="calendar-container">

                    <el-descriptions title="用户信息" :column="1">
                        <el-descriptions-item label="姓名:">{{ userInfo.name }}</el-descriptions-item>
                        <el-descriptions-item label="性别:">{{ userInfo.sex }}</el-descriptions-item>
                        <el-descriptions-item label="角色:">{{ userInfo.adminType }}</el-descriptions-item>
                        <el-descriptions-item label="用户名:">{{ userInfo.username }}</el-descriptions-item>
                        <el-descriptions-item label="手机号:">{{ userInfo.phone }}</el-descriptions-item>

                        <el-descriptions-item label="密码:">****** <el-icon>
                                <Edit color="blue" @click="addDialog.dialogVisible = true, dialog = true" />
                            </el-icon></el-descriptions-item>
                    </el-descriptions>
                </div>

                <!-- 弹框区 -->
                <!-- 新增弹框 -->
                <DialogComponent ref="addDialog" :form="addform" dialog-title="修改密码" :confirm-func="handleUpdatePassword">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="旧密码" prop="oldPassword" :rules="[
                                { required: true, message: '请输入旧密码', trigger: 'blur' }
                            ]">
                                <el-input v-model="addform.oldPassword" show-password autocomplete="off"
                                    placeholder="请输入旧密码" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="新密码" prop="newPassword" :rules="[
                                { required: true, message: '请输入新密码', trigger: 'blur' },
                                { min: 6, message: '新密码长度不能少于6位', trigger: 'blur' }
                            ]">
                                <el-input v-model="addform.newPassword" show-password autocomplete="off"
                                    placeholder="请输入新密码" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="确认新密码" prop="confirmPassword" :rules="[
                                { required: true, message: '请确认新密码', trigger: 'blur' },
                                { validator: checkConfirmPassword, trigger: 'blur' }
                            ]">
                                <el-input v-model="addform.confirmPassword" show-password autocomplete="off"
                                    placeholder="请确认新密码" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </DialogComponent>
            </el-main>

            <el-footer style="display: flex; justify-content: center">

            </el-footer>
        </el-container>
    </dv-border-box1>
</template>

<style scoped>
.subNavPage {
    border-radius: 3%;
    color: #fff;
    height: 100%;
    width: 95%;
    margin: 0 auto;
    /* background-color: #3545659e; */
    /* 3f536cb0 */
}

.calendar-container {
    width: 96%;
    height: 87%;
    margin-left: 30px;
    position: relative;
    background-color: white;
    border-radius: 1vh;
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>

