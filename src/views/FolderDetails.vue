<script setup>
import { ref, onMounted, reactive, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { renameItemAPI, deleteItemAPI, getAllFilesInFolderAPI } from "../apis/files";
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import SearchComponent from "../components/SearchComponent.vue";
import UploadFile from "../components/UploadFile.vue";
import DialogComponent from "../components/DialogComponent.vue";
import PaginationComponent from "../components/PaginationComponent.vue";
import { ElMessage, ElMessageBox } from 'element-plus';
import axios from 'axios';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { useUserStore } from '../stores/store.js';
const userStore = useUserStore();

// 初始化变量和响应式数据
const route = useRoute();
const router = useRouter();
const total = ref(0);
const fileName = ref('');
const uploadFileRef = ref(null);
const fileList = ref([]);
const folderName = ref(route.params.folderName);  // 从路由参数中获取文件夹名称
const searchKeyword = ref("");
const downloadLinkRef = ref(null);
const selectedRows = ref([]);

// 移除文件的扩展名
const removeFileExtension = (filename) => {
    return filename.replace(/\.[^/.]+$/, "");
}

// 检查文件是否有扩展名
const hasFileExtension = (filename) => {
    return /\.[^/.]+$/.test(filename);
}

// 下载文件
const downloadFile = (fileId) => {
    const file = fileList.value.find(file => file.fileId === fileId);
    const fileName = file ? file.fileName : null;
    if (fileName) {
        const downloadUrl = `https://cmc.eos-chengdu-1.cmecloud.cn/devicefile/${fileName}`;
        nextTick().then(() => {
            if (downloadLinkRef.value) {
                downloadLinkRef.value.href = downloadUrl;
                downloadLinkRef.value.download = fileName;
                downloadLinkRef.value.click();
            } else {
                console.error("downloadLinkRef is null");
            }
        });
    }
}

// 批量下载
const getFile = (url) => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url,
            responseType: 'arraybuffer'
        }).then(response => {
            resolve(response.data);
        }).catch(error => {
            reject(error.toString());
        });
    });
};

const handleBatchDownload = () => {
    if (selectedRows.value.length === 0) {
        ElMessage.warning("请选择要下载的文件");
        return;
    }

    const zip = new JSZip();
    const promises = [];

    selectedRows.value.forEach(file => {
        const downloadUrl = `https://cmc.eos-chengdu-1.cmecloud.cn/devicefile/${file.fileName}`;
        const promise = getFile(downloadUrl).then(data => {
            zip.file(file.fileName, data, { binary: true });
        });
        promises.push(promise);
    });

    Promise.all(promises).then(() => {
        zip.generateAsync({ type: "blob" }).then(content => {
            FileSaver.saveAs(content, "打包下载.zip");
        });
    });
};

// 当表格中的选择发生变化时
const handleSelectionChange = (selection) => {
    selectedRows.value = selection;
};


// 打开重命名对话框
const renameform = reactive({
    newName: '', //新文件夹名称
    itemId: null //要重命名的文件夹的ID
})

const openRenameDialog = (itemId, currentName) => {
    renameform.itemId = itemId;
    renameform.newName = removeFileExtension(currentName);
    editDialog.value.dialogVisible = true;
}

// 获取文件夹中的文件
const fetchFilesInFolder = async () => {
    try {
        const response = await getAllFilesInFolderAPI(route.params.folderId, currentPage.value, pageSize.value, searchKeyword.value);
        if (response.code === 1) {
            fileList.value = response.data.data;
            total.value = response.data.total;  // 更新总文件数
            // console.log("Updated fileList:", fileList.value);

        } else {
            console.error(response.data.message);
        }
        updateSearchSuggestion();
    } catch (error) {
        console.error("获取文件失败", error);
    }
}

// 提交重命名
const submitRename = async () => {
    if (renameform.itemId && renameform.newName) {
        // 获取旧文件名
        const fileToRename = fileList.value.find(file => file.fileId === renameform.itemId);
        const oldFileName = fileToRename ? fileToRename.fileName : null;
        let newFileName = renameform.newName;
        if (hasFileExtension(oldFileName) && !hasFileExtension(newFileName)) {
            const oldFileExtension = oldFileName.split('.').pop();
            newFileName += '.' + oldFileExtension;
        }

        // 检查新旧文件名是否相同
        if (oldFileName === newFileName) {
            ElMessage.warning("新旧文件名相同，请输入一个新的文件名。");
            return;
        }

        // 检查新文件名是否已存在于文件列表中
        const existingFile = fileList.value.find(file => file.fileName === newFileName);
        if (existingFile) {
            ElMessage.warning("该文件名已存在，请选择一个不同的文件名。");
            return;
        }

        const response = await renameItemAPI(renameform.itemId, newFileName, "FILE");
        if (response.code === 1) {
            ElMessage.success(response.data);
            if (uploadFileRef.value && uploadFileRef.value.requestRenameInS3) {
                uploadFileRef.value.requestRenameInS3(oldFileName, newFileName);
            } else {
                console.error('Unable to call requestRenameInS3. Method not found or component not referenced.');
            }
            fetchFilesInFolder(currentPage.value, pageSize.value, searchKeyword.value); // 刷新数据
        } else {
            ElMessage.error(response.msg);  // 使用响应中的msg作为错误消息
        }
        editDialog.value.dialogVisible = false; // 关闭对话框
    } else {
        ElMessage.warning("Please provide a new name.");
    }
}

// 删除文件
const deleteFile = async (itemId) => {
    ElMessageBox.confirm('确认删除吗？', '温馨提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        try {
            const response = await deleteItemAPI(itemId, "FILE");
            if (response.code === 1) {
                ElMessage.success(response.data);

                // 获取要删除的文件名
                const fileToDelete = fileList.value.find(file => file.fileId === itemId);
                const fileNameToDelete = fileToDelete ? fileToDelete.fileName : null;

                if (fileNameToDelete) {
                    // 调用 UploadFile 组件的 requestDeleteFromS3 方法
                    uploadFileRef.value.requestDeleteFromS3(fileNameToDelete);
                }

                fetchFilesInFolder(currentPage.value, pageSize.value, searchKeyword.value);
            }
        } catch (error) {
            console.error('Error in deleteFile:', error.message);
            ElMessage.error("Error deleting item");
        }
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '删除取消',
        })
    });
};

// 文件上传后的处理函数
const onFileUploaded = async (uploadedFile) => {
    fetchFilesInFolder(); // 刷新文件列表
    console.log("文件上传并保存成功！");
}

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
        fetchFilesInFolder();
    }
};

//分页组件相关
//#region

const currentPage = ref(1);
const pageSize = ref(10);

//分页器回传的每页条数
const size = (val) => {
    pageSize.value = val;
    fetchFilesInFolder();
};

//分页器回传的当前页
const cur = (val) => {
    currentPage.value = val;
    fetchFilesInFolder();
};


// 搜索功能相关
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
    fetchFilesInFolder(currentPage.value, pageSize.value, searchKeyword.value);  // 根据新的关键字搜索数据
};

// 更新搜索条件
const search = (title, keyword) => {
    console.log(title, keyword);
    if (title === "fileName") {
        searchKeyword.value = keyword;  // 使用searchKeyword存储搜索关键字
    }
};

const resetSearch = () => {
    searchKeyword.value = "";  // 重置搜索关键字
    fetchFilesInFolder(currentPage.value, pageSize.value, "");  // 获取所有数据
};

// 生命周期钩子函数
onMounted(() => {
    fetchFilesInFolder(); // 页面加载时获取文件夹中的文件
});

</script>

<template>
    <!-- borderbox -->
    <dv-border-box1 ref="borderRef" class="subNavPage animate__animated animate__zoomIn"
        :color="['#4f698794', '#4f698794']" background-color="#3545659e">
        <a ref="downloadLinkRef" style="display: none;"></a>

        <!-- body -->
        <el-container class="subNavPage">
            <br />
            <div style="display: flex;justify-content: center;">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/deviceFiles' }">
                        <h1>设备文件管理</h1>
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>
                        <h1>{{ folderName }}</h1>
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <!-- main -->
            <el-main style="overflow: hidden">
                <!-- search -->
                <div>
                    <SearchComponent :key="renderKey" search-title="文件名称" :searchContent=fileName ref="search1"
                        field="fileName" @search="search" @edit="edit" database="deviceFiles" />
                    <el-button type="primary" style="margin-left: 10px; width: 7%" @click="handleSearch">
                        <Search style="width: 1em; height: 1em; margin-right: 8px" />搜索
                    </el-button>
                    <el-button style="width: 7%" @click="resetSearch">
                        <DeleteFilled style="width: 1em; height: 1em; margin-right: 8px" />重置
                    </el-button>
                </div>
                <br />
                <!-- operation -->
                <div v-if="!userStore.isReadOnly" style="display: flex">
                    <UploadFile ref="uploadFileRef" :folder-id="route.params.folderId"
                        @file-uploaded="onFileUploaded" />

                    <div style="margin-left: 1vh;">
                        <el-button type="primary" @click="handleBatchDownload">
                            <download style="width: 1em; height: 1em; margin-right: 8px" />批量下载
                        </el-button>
                    </div>
                </div>

                <DialogComponent ref="editDialog" :form="renameform" dialog-title="编辑文件" :refreshFunc="() => { }"
                    :confirmFunc="submitRename" @dialogClose="dialogClose">
                    <el-form-item label="文件名称:" prop="newName">
                        <el-input v-model="renameform.newName" :placeholder="currentName" autocomplete="off"
                            style="width: 100%;" />
                    </el-form-item>
                </DialogComponent>

                <!-- table -->
                <div>
                    <el-table :data="fileList" @selection-change="handleSelectionChange" show-overflow-tooltip
                        style="width: 100%;margin-top: 1vh; border-radius: 1vh; margin-top: 1vh" table-layout="fixed"
                        height="56vh">
                        <el-table-column type="selection" align="center" />
                        <el-table-column type="index" label="序号" align="center" min-width="60vh" />

                        <el-table-column prop="fileName" label="文件名称" align="center">
                            <template #default="scope">
                                <a @click="openFile(scope.row.fileId)">{{ removeFileExtension(scope.row.fileName) }}</a>
                            </template>
                        </el-table-column>

                        <el-table-column label="最后修改时间" align="center">

                            <template #default="scope">
                                <span v-if="scope.row.fileName">{{ scope.row.updatedAt }}</span>
                                <span v-else>{{ scope.row.updatedAt }}</span>
                            </template>
                        </el-table-column>

                        <el-table-column label="创建时间" align="center">

                            <template #default="scope">
                                <span v-if="scope.row.folderName">{{ scope.row.uploadedAt }}</span>
                                <span v-else>{{ scope.row.uploadedAt }}</span>
                            </template>
                        </el-table-column>

                        <el-table-column v-if="!userStore.isReadOnly" label="操作" align="center">
                            <template #default="scope">
                                <el-button class="inline_button" v-if="scope.row.fileName"
                                    @click.prevent="downloadFile(scope.row.fileId)">下载</el-button>
                                <!-- <el-button class="inline_button"
                                    @click="openRenameDialog(scope.row.fileId, scope.row.fileName, 'file')">编辑</el-button> -->
                                <el-button class="inline_button"
                                    @click="deleteFile(scope.row.fileId || scope.row.fileId, scope.row.fileName ? 'file' : 'file')">删除</el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                </div>

            </el-main>
            <!-- pagination -->
            <el-footer style="display: flex; justify-content: center">
                <div class="demo-pagination-block">
                    <PaginationComponent :total="total" @size="size" @cur="cur" />
                </div>
            </el-footer>
        </el-container>
    </dv-border-box1>
</template>

<style scoped>
.folder-details-container {
    padding: 20px;
}

.subNavPage {
    border-radius: 3%;
    color: #fff;
    height: 100%;
    width: 95%;
    margin: 0 auto;
    position: relative;
}

.demo-pagination-block+.demo-pagination-block {
    margin-top: 10px;
}

.demo-pagination-block .demonstration {
    margin-bottom: 16px;
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

:deep .el-breadcrumb__inner.is-link {
    color: #fff !important;
    text-shadow: 1px 1px 15px #a3ccf9;
}

:deep .el-breadcrumb__inner {
    color: #fff !important;
}

:deep .el-dialog {
    --el-dialog-padding-primary: 3vh;
    --el-dialog-border-radius: 1vh
}
</style>