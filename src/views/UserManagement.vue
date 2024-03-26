<script setup>
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import PaginationComponent from "../components/PaginationComponent.vue";
import { getUserInfoAPI, addUserInfoAPI, getByIdAPI, updateUserAPI, updateUserStatusAPI, resetPasswordAPI, deleteUserAPI } from "../apis/login";
import { ref, reactive, onMounted } from "vue";
import DialogComponent from "../components/DialogComponent.vue";
import { ElMessage, ElMessageBox } from 'element-plus';


const page = ref(1);
const pageSize = ref(10);
const username = ref();
const status = ref();
const addDialog = ref()
const editDialog = ref()

// 从后端获取数据
const tableData = reactive([]);
const total = ref(0)
const getDataFromAPI = async () => {
  const res = await getUserInfoAPI(page.value, pageSize.value, name.value, username.value, phone.value, admin_type.value, status.value);
  // console.log(res.data);
  tableData.value = res.data.data.map(user => ({
    ...user,
  }));
  // console.log("Table data after fetch:", tableData);
  total.value = res.data.total
  updateSearchSuggestion()
};

const handleAddUser = async () => {
  try {
    const response = await addUserInfoAPI(addform);
    // 检查响应体中的code来确定操作是否成功
    if (response.code === 1) {
      // 操作成功
      ElMessage.success(response.data || '用户添加成功');
      // 清空表单，关闭对话框等后续操作...
    } else {
      // 操作失败，根据msg给出提示
      ElMessage.error(response.msg || '添加用户失败，请稍后再试');
    }
  } catch (error) {
    // 处理网络或其他未知错误
    ElMessage.error('网络错误或未知错误，请稍后再试');
  }
};

//分页器回传的每页条数
const size = (val) => {
  pageSize.value = val;
  getDataFromAPI()
};

//分页器回传的当前页
const cur = (val) => {
  page.value = val;
  getDataFromAPI()
};

//表单数据
const addform = reactive({
  name: '',
  username: '',
  password: '',
  phone: '',
  sex: '',
  adminType: ''
})

const updateform = reactive({
  id: '',
  name: '',
  username: '',
  phone: '',
  sex: '',
  adminType: '',
  status: ''
})


//手机号规范限制，采用正则表达式
const validatePhoneNumber = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('手机号码不能为空'));
  }
  if (!/^[0-9]{10,11}$/.test(value)) {
    callback(new Error('请输入有效的手机号码'));
  } else {
    callback();
  }
};

//中国身份证号码验证规则
function validateIDNumber(rule, value, callback) {
  const reg = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|[Xx])$/;
  if (reg.test(value)) {
    callback();
  } else {
    callback(new Error('请输入有效的身份证号码'));
  }
}

//编辑相关
//数据回显API

const getUserByID = async (id) => {
  console.log("Fetching user data for ID:", id);
  if (id) { // 确保id有效
    const res = await getByIdAPI(id);
    if (res.code === 1) { // 确保响应数据存在并且code为1
      updateform.name = res.data.name; // 更新表单数据，注意响应结构
      updateform.username = res.data.username;
      updateform.phone = res.data.phone;
      updateform.sex = res.data.sex;
      updateform.adminType = res.data.adminType;
      updateform.status = res.data.status;
    }
  } else {
    console.error("Invalid user ID: ", id);
  }
};

const handleStatusChange = async (user) => {
  try {
    const payload = {
      id: user.id,
      status: user.status
    };
    const response = await updateUserStatusAPI(payload);
    if (response.code === 1) {
      ElMessage.success('用户状态更新成功');
    } else {
      ElMessage.error('用户状态更新失败');
    }
  } catch (error) {
    console.error('更新用户状态时发生错误:', error);
    ElMessage.error('更新用户状态时发生错误');
    user.status = user.status === 1 ? 0 : 1;
  }
};

const resetPassword = async (userId) => {
  try {
    const res = await resetPasswordAPI(userId);
    if (res.code === 1) {
      ElMessage.success('重置成功');
    } else {
      ElMessage.error('重置失败: ' + res.msg);
    }
  } catch (error) {
    console.error('重置密码请求失败', error);
    ElMessage.error('重置密码请求失败');
  }
};

const deleteUser = async (id) => {
  const res = await deleteUserAPI(id);
  if (res.code === 1) {
    getDataFromAPI();
    ElMessage.success('删除成功');
  } else {
    ElMessage.error('删除失败');
  }
}

const deleteConfirm = (id) => {
  refresh.value = false
  ElMessageBox.confirm(
    '确认删除吗？',
    '温馨提示',
    {
      confirmButtonText: '确认',

      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      refresh.value = true
      // console.log(id);
      deleteUser(id)
    })
    .catch(() => {
      refresh.value = true

      ElMessage({
        type: 'info',
        message: '删除取消',
      })
    })
}

//搜索组件相关
//#region
const search1 = ref();
const search2 = ref();
const search3 = ref()
const name = ref("")
const phone = ref("")
const admin_type = ref("")
const searchForm = reactive({ name, phone, admin_type })
//用于重新加载搜索框和搜索建议
const renderKey = ref(0)
const updateSearchSuggestion = () => {
  renderKey.value = renderKey.value + 1
}

// 记录用于通过搜索组件输入的搜索种类及对应关键词 searchComponent
const search = (title, keyword) => {
  // console.log(title, keyword);
  if (title === "name") name.value = keyword; updateSearchSuggestion()
  if (title === "phone") phone.value = keyword; updateSearchSuggestion()
  if (title === "admin_type") admin_type.value = keyword; updateSearchSuggestion()
};

//默认为可刷新状态，如搜索框处于编辑状态，停止实时刷新
const refresh = ref(true)
const edit = (val) => {
  if (val) {
    // console.log("loadmore false");
    loadMore(false)
  }
  else {
    // console.log("loadmore true");
    loadMore(true)
  }
};

const isLoading = ref(false);
const loadMore = (status) => {
  if (isLoading.value) {
    return;
  }
  isLoading.value = true;
  // 执行加载更多逻辑
  // console.log("now setting refresh to be ", status);
  refresh.value = status;

  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
};

// 根据关键字搜索数据库
const update = () => {
  refresh.value = true
  getDataFromAPI()
};

// 清空搜索组件的关键字搜索，并初始化表格展示数据
const reset = () => {
  refresh.value = true
  name.value = "";
  phone.value = "";
  admin_type.value = "";
  search1.value.searchContent = "";
  search2.value.searchContent = "";
  search3.value.searchContent = "";
  getDataFromAPI()
};

onMounted(() => {
  getDataFromAPI()
});

</script>

<template>
  <!-- borderbox -->
  <dv-border-box1 ref="borderRef" class="subNavPage animate__animated animate__zoomIn"
    :color="['#4f698794', '#4f698794']" background-color="#3545659e">
    <el-container class="subNavPage">
      <br />
      <h1>用户管理</h1>
      <!-- main -->
      <el-main style="overflow: hidden">
        <div>
          <SearchComponent :key="renderKey" search-title="姓名" :searchContent=name ref="search1" field="name"
            @search="search" @edit="edit" database="users" :data="searchForm" />
          <SearchComponent :key="renderKey" search-title="手机号" :searchContent=phone ref="search2" field="phone"
            @search="search" @edit="edit" database="users" :data="searchForm" />
          <SearchComponent :key="renderKey" search-title="角色" :searchContent=admin_type ref="search3" field="admin_type"
            @search="search" @edit="edit" database="users" :data="searchForm" />
          <el-button type="primary" style="margin-left: 10px; width: 7%" @click="update">
            <Search style="width: 1em; height: 1em; margin-right: 8px" />搜索
          </el-button>
          <el-button style="width: 7%" @click="reset">
            <DeleteFilled style="width: 1em; height: 1em; margin-right: 8px" />清空
          </el-button>
        </div>

        <div style="display: flex; justify-content: space-between">
          <span>
            <el-button type="primary" @click="addDialog.dialogVisible = true, dialog = true">
              <Plus style="width: 1em; height: 1em; margin-right: 8px" />新增
            </el-button>
          </span>
        </div>
        <div style="
            height: 4vh;
            line-height: 4vh;
            text-decoration: underline;
            color: #729fd0;
            position: relative;
            left: 95%;
            width: fit-content;
            cursor: pointer;
          ">
        </div>

        <!-- 弹框区 -->
        <!-- 新增弹框 -->
        <DialogComponent ref="addDialog" :form="addform" dialog-title="新增用户" :refreshFunc="getDataFromAPI"
          :confirm-func="handleAddUser" @dialogClose="false">
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名" prop="name" :rules="[
      { required: true, message: '请输入姓名', trigger: 'blur' },
      {
        min: 1, max: 30,
        message: '长度必须在1-30之间', trigger: 'blur'
      }]">
                <el-input v-model="addform.name" autocomplete="off" placeholder="请输入姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户名" prop="username" :rules="[
      { required: true, message: '请输入用户名', trigger: 'blur' },
      {
        min: 1, max: 30,
        message: '长度必须在1-30之间', trigger: 'blur'
      }]">
                <el-input v-model="addform.username" autocomplete="off" placeholder="请输入用户名" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="密码" prop="password" :rules="[
      { required: true, message: '请输入密码', trigger: 'blur' },
      {
        min: 8,
        message: '密码长度必须为8位以上', trigger: 'blur'
      }]">
                <el-input type="password" v-model="addform.password" autocomplete="off" placeholder="请输入密码" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号" prop="phone" :rules="[
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { validator: validatePhoneNumber, trigger: 'blur' }
    ]">
                <el-input v-model.number="addform.phone" autocomplete="off" placeholder="请输入手机号" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="性别" prop="sex" :rules="[{ required: true, message: '请选择性别', trigger: 'change' }]">
                <el-select v-model="addform.sex" placeholder="请选择性别">
                  <el-option label="男" value="男"></el-option>
                  <el-option label="女" value="女"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色" prop="adminType"
                :rules="[{ required: true, message: '请选择角色', trigger: 'change' }]">
                <el-select v-model="addform.adminType" placeholder="请选择角色">
                  <el-option label="管理员" value="管理员"></el-option>
                  <el-option label="设备管理员" value="设备管理员"></el-option>
                  <el-option label="普通用户" value="普通用户"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </DialogComponent>

        <!-- 编辑弹框 -->
        <DialogComponent ref="editDialog" :form="updateform" dialog-title="编辑用户" :refreshFunc="getDataFromAPI"
          :confirm-func="updateUserAPI" @dialogClose="false">
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名" prop="name" :rules="[
      { required: true, message: '请输入姓名', trigger: 'blur' },
      {
        min: 1, max: 30,
        message: '长度必须在1-30之间', trigger: 'blur'
      }]">
                <el-input v-model="updateform.name" autocomplete="off" placeholder="请输入姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号" prop="phone" :rules="[
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { validator: validatePhoneNumber, trigger: 'blur' }
    ]">
                <el-input v-model.number="updateform.phone" autocomplete="off" placeholder="请输入手机号" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="角色" prop="adminType"
                :rules="[{ required: true, message: '请选择角色', trigger: 'change' }]">
                <el-select v-model="updateform.adminType" placeholder="请选择角色">
                  <el-option label="管理员" value="管理员"></el-option>
                  <el-option label="设备管理员" value="设备管理员"></el-option>
                  <el-option label="普通用户" value="普通用户"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别" prop="sex" :rules="[{ required: true, message: '请选择性别', trigger: 'change' }]">
                <el-select v-model="updateform.sex" placeholder="请选择性别">
                  <el-option label="男" value="男"></el-option>
                  <el-option label="女" value="女"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-switch v-model="updateform.status" :active-value="1" :inactive-value="0" inline-prompt
                  active-text="启用" inactive-text="禁用">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
        </DialogComponent>

        <el-table :data="tableData.value" style="width: 100%; border-radius: 1vh" table-layout="fixed" height="54vh"
          show-overflow-tooltip>
          <el-table-column type="selection" align="center" />
          <el-table-column type="index" label="序号" align="center" min-width="60vh" />
          <el-table-column prop="name" label="姓名" align="center" />
          <el-table-column prop="username" label="用户名" align="center" />
          <el-table-column prop="phone" label="手机号" align="center" />
          <el-table-column prop="adminType" label="角色" align="center" />
          <el-table-column label="用户状态" align="center">
            <template #default="scope">
              <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" inline-prompt active-text="启用"
                inactive-text="禁用" @change="handleStatusChange(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="operation" label="操作" align="center">
            <template #default="scope">
              <el-button class="inline_button"
                @click="getUserByID(scope.row.id), editDialog.dialogVisible = true, dialog = true, updateform.id = scope.row.id">
                编辑
              </el-button>
              <el-button class="inline_button" @click="resetPassword(scope.row.id)">
                重置密码
              </el-button>
              <el-button class="inline_button" @click="deleteConfirm(scope.row.id)">
                删除
              </el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-main>
      <!-- pagination -->
      <el-footer style="display: flex; justify-content: center">
        <PaginationComponent :total="total" @size="size" @cur="cur" />
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

.inline_button {
  padding: 0 2px;
  margin: 0;
  text-decoration: underline;
  color: #729fd0;
  border: none;
  width: min-content;
}
</style>
