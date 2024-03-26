<script setup>
import { ref, onMounted, reactive } from "vue";
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import SearchComponent from "../components/SearchComponent.vue";
import DialogComponent from "../components/DialogComponent.vue";
import PaginationComponent from "../components/PaginationComponent.vue";
import 'font-awesome/css/font-awesome.min.css';
import { useRouter } from 'vue-router';
import { createFolderAPI, renameItemAPI, deleteItemAPI, getAllFolderAPI } from "../apis/files";
import { ElMessage, ElMessageBox } from 'element-plus';
import { useUserStore } from '../stores/store.js';
const userStore = useUserStore();

// 初始化变量和响应式数据
const router = useRouter();
const searchKeyword = ref(""); // 搜索关键词
const tableData = ref([]); // 初始化为一个空数组
const folderTotal = ref(0); // 用于存储文件夹的总数

const addform = reactive({
  name: '', //文件夹名称
})

const renameform = reactive({
  newName: '', //新文件夹名称
  itemId: null //要重命名的文件夹的ID
})

const openRenameDialog = (itemId, currentName) => {
  renameform.itemId = itemId;
  renameform.newName = currentName; // 设置当前的文件夹名称
  editDialog.value.dialogVisible = true; // 打开对话框
}

// 获取文件夹数据的函数
const fetchData = async (currentPageVal = currentPage.value, currentSizeVal = pageSize.value, keyword = searchKeyword.value) => {
  // console.log("Fetching data with page:", currentPageVal, "and size:", currentSizeVal);
  const response = await getAllFolderAPI(currentPageVal, currentSizeVal, keyword);
  if (response.code === 1 && response.data) {
    // 过滤数据，只保留具有 folderId 属性的对象
    tableData.value = response.data.data;
    folderTotal.value = response.data.total;
  }
  updateSearchSuggestion();
};

// 创建新的文件夹
const createFolder = async () => {
  const response = await createFolderAPI(addform.name);
  if (response.code === 1) {
    ElMessage.success(response.data);  // 使用响应中的data作为成功消息
    shouldRefresh.value = true;
    await fetchData(currentPage.value, pageSize.value, searchKeyword.value);
    // return { code: 1, data: "null" };
  } else {
    ElMessage.error(response.msg);  // 使用响应中的msg作为错误消息
    return { code: 0, data: response.msg };
  }
};

// 重命名文件夹
const submitRename = async () => {
  if (renameform.itemId && renameform.newName) {
    const response = await renameItemAPI(renameform.itemId, renameform.newName, "FOLDER");
    if (response.code === 1) {
      ElMessage.success("已重命名为：" + response.data);
      fetchData(currentPage.value, pageSize.value, searchKeyword.value); // 刷新数据
    } else {
      ElMessage.error(response.msg);  // 使用响应中的msg作为错误消息
    }
    editDialog.value.dialogVisible = false; // 关闭对话框
  } else {
    ElMessage.warning("Please provide a new name.");
  }
}

// 删除文件夹
const deleteItem = async (itemId) => {
  ElMessageBox.confirm('确认删除吗？', '温馨提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const response = await deleteItemAPI(itemId, "FOLDER");
      if (response.code === 1) {
        ElMessage.success(response.data);
        fetchData(currentPage.value, pageSize.value, searchKeyword.value);
      } else {
        if (response.msg && response.msg.includes('contains files')) {
          ElMessageBox.alert('该文件夹内有文件，无法删除', '错误', {
            confirmButtonText: '确认',
            type: 'error'
          });
        } else if (response.msg) {
          ElMessage.error(response.msg);
        } else {
          ElMessage.error("Unknown error");
        }
      }
    } catch (error) {
      ElMessage.error("Error deleting item");
    }
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '删除取消',
    })
  });
};

// 跳转到文件夹详情页面
const goToFolderDetails = (folderId, folderName) => {
  // console.log("Passing folderName:", folderName);
  router.push({
    name: 'FolderDetails',
    params: { folderId: folderId, folderName: folderName }
  });
};



//弹框相关
//新增
//#region
const dialog = ref(false);
const addDialog = ref({ dialogVisible: false });
const editDialog = ref();
const shouldRefresh = ref(true);

const dialogClose = () => {
  dialog.value = false;
  if (shouldRefresh.value) {
    fetchData(currentPage.value, pageSize.value, searchKeyword.value);
  }
};

const handleAddButtonClick = () => {
  addDialog.value.dialogVisible = true;
  dialog.value = true;
  shouldRefresh.value = false;
};


//分页组件相关
//#region
const currentPage = ref(1);
const pageSize = ref(10);

//分页器回传的每页条数
const size = (val) => {
  // console.log("Size function called with:", val);
  pageSize.value = val;
  fetchData();
};

//分页器回传的当前页
const cur = (val) => {
  // console.log("Cur function called with:", val);
  currentPage.value = val;
  fetchData();
};

// 搜索功能相关
const folderName = ref('');
const search1 = ref();
const renderKey = ref(0)
const updateSearchSuggestion = () => {
  renderKey.value = renderKey.value + 1
}

// 控制数据刷新
const refresh = ref(true)
const edit = (val) => {
  if (val) {
    loadMore(false)
  }
  else {
    loadMore(true)
  }
};
const isLoading = ref(false);
const loadMore = (status) => {
  if (isLoading.value) {
    return;
  }
  isLoading.value = true;
  refresh.value = status;

  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
};

// 搜索处理函数
const handleSearch = async () => {
  fetchData(currentPage.value, pageSize.value, searchKeyword.value);  // 根据新的关键字搜索数据
};

// 更新搜索条件
const search = (title, keyword) => {
  console.log(title, keyword);
  if (title === "folderName") {
    searchKeyword.value = keyword;  // 使用searchKeyword存储搜索关键字
  }
};

const resetSearch = () => {
  searchKeyword.value = "";  // 重置搜索关键字
  fetchData(currentPage.value, pageSize.value, "");  // 获取所有数据
};

onMounted(async () => {
  await fetchData(currentPage.value, pageSize.value, searchKeyword.value);
});
</script>

<template>
  <!-- borderbox -->
  <dv-border-box1 ref="borderRef" class="subNavPage animate__animated animate__zoomIn"
    :color="['#4f698794', '#4f698794']" background-color="#3545659e">
    <!-- body -->
    <el-container class="subNavPage">
      <br />
      <h1>设备文件管理</h1>
      <!-- main -->
      <el-main style="overflow: hidden">
        <!-- search -->
        <div>
          <SearchComponent :key="renderKey" search-title="文件夹" :searchContent=folderName ref="search1"
            field="folderName" @search="search" @edit="edit" database="deviceFiles" />
          <el-button type="primary" style="margin-left: 10px; width: 7%" @click="handleSearch">
            <Search style="width: 1em; height: 1em; margin-right: 8px" />搜索
          </el-button>
          <el-button style="width: 7%" @click="resetSearch">
            <DeleteFilled style="width: 1em; height: 1em; margin-right: 8px" />清空
          </el-button>
        </div>
        <br />
        <!-- operation -->
        <div style="display: flex; justify-content: space-between">
          <span>
            <el-button v-if="!userStore.isReadOnly" type="primary" @click="handleAddButtonClick">
              <Plus style="width: 1em; height: 1em; margin-right: 8px" />新建文件夹
            </el-button>

            <input type="file" ref="uploadInput" @change="uploadFile" style="display: none;">
          </span>
        </div>

        <!-- 新建文件夹的弹窗 -->
        <DialogComponent ref="addDialog" :form="addform" dialog-title="新建文件夹" :refreshFunc="() => { }"
          :confirm-func="createFolder" @dialogClose="dialogClose">
          <el-form-item label="文件夹:" prop="name" :rules="[
      { required: true, message: '请输入文件夹名称', trigger: 'blur' },
      {
        min: 1, max: 30,
        message: '长度必须在1-30之间', trigger: 'blur'
      }]">
            <el-input v-model="addform.name" autocomplete="off" style="width: 100%;" />
          </el-form-item>
        </DialogComponent>

        <DialogComponent ref="editDialog" :form="renameform" dialog-title="编辑文件夹" :refreshFunc="() => { }"
          :confirmFunc="submitRename" @dialogClose="dialogClose">
          <el-form-item label="文件夹名称:" prop="newName">
            <el-input v-model="renameform.newName" autocomplete="off" style="width: 100%;" />
          </el-form-item>
        </DialogComponent>

        <!-- table -->
        <div>
          <el-table :data="tableData" show-overflow-tooltip
            style="width: 100%;margin-top: 1vh; border-radius: 1vh; margin-top: 1vh" table-layout="fixed" height="56vh">
            <el-table-column type="selection" align="center" />
            <el-table-column type="index" label="序号" align="center" min-width="60vh" />

            <el-table-column label="文件夹名称">
              <template #default="scope">
                <a @click="goToFolderDetails(scope.row.folderId, scope.row.folderName)" style="cursor: pointer;">
                  <i class="fa fa-folder-o"></i> {{ scope.row.folderName }}
                </a>
              </template>
            </el-table-column>

            <el-table-column label="最后修改时间" align="center">

              <template #default="scope">
                <span v-if="scope.row.folderName">{{ scope.row.updatedAt }}</span>
                <span v-if="scope.row.fileName">{{ scope.row.uploadedAt }}</span>
              </template>
            </el-table-column>

            <el-table-column label="创建时间" align="center">

              <template #default="scope">
                <span v-if="scope.row.folderName">{{ scope.row.createdAt }}</span>
                <!-- 对于文件，如果你有创建时间，你可以在这里显示 -->
              </template>
            </el-table-column>

            <el-table-column v-if="!userStore.isReadOnly" label="操作" align="center">
              <template #default="scope">
                <el-button class="inline_button" @click="openRenameDialog(scope.row.folderId, scope.row.folderName)">
                  编辑
                </el-button>

                <el-button class="inline_button"
                  @click="deleteItem(scope.row.folderId || scope.row.fileId, scope.row.folderName ? 'folder' : 'file')">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </el-main>
      <!-- pagination -->
      <el-footer style="display: flex; justify-content: center">
        <div class="demo-pagination-block">
          <PaginationComponent :total="folderTotal" @size="size" @cur="cur" />
        </div>
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
  position: relative;
}

:deep .el_total-color {
  --el-text-color-regular: #729fd0;
}

.inline_button {
  padding: 0 2px;
  margin: 0;
  text-decoration: underline;
  color: #729fd0;
  border: none;
  width: min-content;
}

.demo-pagination-block+.demo-pagination-block {
  margin-top: 10px;
}

.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}

:deep .el-dialog {
  --el-dialog-padding-primary: 3vh;
  --el-dialog-border-radius: 1vh
}

:deep .el-overlay {
  background-color: rgba(37, 54, 83, 0.498);
}
</style>
