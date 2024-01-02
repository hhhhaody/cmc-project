<script setup>
import { ref, onMounted, reactive, onUnmounted, watch } from "vue";
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import PaginationComponent from "../components/PaginationComponent.vue";
import DialogComponent from "../components/DialogComponent.vue";
import { getSectionsAPI, addSectionAPI, deleteSectionAPI, changeSectionNameAPI, getStationsAPI, updateStationsAPI } from "../apis/productionLine"

// 从后端获取数据
const tableData = reactive([]);
const total = ref(0)
const getDataFromAPI = async () => {
    const res = await getSectionsAPI(currentPage.value, pageSize.value);
    // console.log(res.data);
    tableData.value = res.data.data;
    total.value = res.data.total

};
//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------

//#region

//默认为可刷新状态，如搜索框处于编辑状态，停止实时刷新
const refresh = ref(true)



//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------
//分页组件相关
//#region

const currentPage = ref(1);
const pageSize = ref(10);

//分页器回传的每页条数
const size = (val) => {
    pageSize.value = val;
    getDataFromAPI()
};

//分页器回传的当前页
const cur = (val) => {
    currentPage.value = val;
    getDataFromAPI()

};
// #endregion

//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------
//弹框相关
//新增
//#region
const dialog = ref(false)
const remainingStock = ref(null);
const addDialog = ref()
const editDialog = ref()
const manageDialog = ref()


const dialogClose = () => {
    dialog.value = false
    addform.stations = ['']
    remainingStock.value = null
}


//表单数据
const addform = reactive({
    section: '',
    stations: ['']
})
const editform = reactive({
    newName: '',
    section: ''
})
const manageform = reactive({
    section: '',
    stations: []
})

const addFormItem = (form) => {
    // 在这里可以动态添加表单项配置
    form.stations.push('');
}

const deleteFormItem = (form, index) => {
    if (form.stations.length > 1) form.stations.splice(index, 1);
}



//编辑相关
//数据回显API

const getStationsBySection = async (section) => {
    const res = await getStationsAPI(section);
    console.log(res.data);
    const stations = [];

    for (const obj of res.data) {
        stations.push(obj.value);
    }

    console.log(stations);
    if (res.code === 1) {
        manageform.stations = stations
    }
};


// #endregion

//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------
//确认删除
//#region

import { ElMessage, ElMessageBox } from 'element-plus'

const del = async (section) => {
    const res = await deleteSectionAPI(section);
    if (res.code === 1) {
        getDataFromAPI();
        ElMessage({
            type: 'success',
            message: '删除成功',
        })
    }
    else {
        ElMessage({
            type: 'error',
            message: '删除失败',
        })
    }
};

const deleteConfirm = (section) => {
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
            del(section)
        })
        .catch(() => {
            refresh.value = true

            ElMessage({
                type: 'info',
                message: '删除取消',
            })
        })
}
// #endregion

//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------
//定时器 实时刷新数据相关
//#region

const timer = ref()

const startTimer = () => {
    //创建定时器来实时更新数据
    timer.value = setInterval(() => {
        console.log("实时刷新中");
        //FIXME: 调试时修改此处
        // getDataFromAPI()
    }, 5000)
}


//在页面销毁之前销毁定时器
onUnmounted(() => {
    clearInterval(timer.value)
    timer.value = ""
})

onMounted(() => {
    //初始化表格展示数据，数据需从后端获取
    getDataFromAPI()
    //开始实时更新
    if (timer.value) clearInterval(timer.value)
    startTimer()
});

// 有弹框时或用户编辑搜索条件时停止实时更新 
watch([dialog, refresh], (val1, val2) => {
    console.log(`dialog visible is ${val1[0]}, refresh is ${val1[1]}`)
    if (val1[0] | !val1[1]) clearInterval(timer.value)
    else startTimer()
})

// #endregion

</script>

<template>
    <!-- borderbox -->
    <dv-border-box1 ref="borderRef" class="subNavPage animate__animated animate__zoomIn" :color="['#4f698794', '#4f698794']"
        background-color="#3545659e">
        <!-- body -->
        <el-container class="subNavPage">
            <br />
            <h1>产线组成</h1>
            <!-- main -->
            <el-main style="overflow: hidden">
                <!-- search -->
                <div>

                </div>
                <br />
                <!-- operation -->
                <div style="display: flex; justify-content: space-between">
                    <span>
                        <el-button type="primary" @click="addDialog.dialogVisible = true, dialog = true" disabled>
                            <Plus style="width: 1em; height: 1em; margin-right: 8px" />新增
                        </el-button>


                    </span>
                    <span>

                    </span>
                </div>
                <!-- record -->
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
                <DialogComponent ref="addDialog" :form="addform" dialog-title="新增工段" :refreshFunc="getDataFromAPI"
                    :confirm-func="addSectionAPI" @dialogClose="dialogClose">
                    <el-form-item label="工段名称" prop="section" :rules="[
                        { required: true, message: '请输入工段名称', trigger: 'blur' },
                        {
                            min: 1, max: 30,
                            message: '长度必须在1-30之间', trigger: 'blur'
                        }]">
                        <el-input v-model="addform.section" autocomplete="off" placeholder="请输入工段名称" />
                    </el-form-item>
                    <el-form-item class="form-row" v-for="(item, index) in addform.stations" :key="index" label="工位名称"
                        :rules="[
                            { required: true, message: '请输入工位名称', trigger: 'blur' },
                            {
                                min: 1, max: 30,
                                message: '长度必须在1-30之间', trigger: 'blur'
                            }]">
                        <el-input v-model="addform.stations[index]" placeholder="请输入工位名称"></el-input>
                        <el-button @click="deleteFormItem(addform, index)">
                            <Minus style="width: 1em; height: 1em;" />
                        </el-button>
                    </el-form-item>
                    <el-button @click="addFormItem(addform)">
                        <Plus style="width: 1em; height: 1em;" />
                    </el-button>
                </DialogComponent>


                <!-- 编辑弹框 -->
                <DialogComponent ref="editDialog" :form="editform" dialog-title="编辑工段名称" :refreshFunc="getDataFromAPI"
                    :confirm-func="changeSectionNameAPI" @dialogClose="dialogClose">
                    <el-form-item label="工段名称" prop="section" :rules="[
                        { required: true, message: '请输入工段名称', trigger: 'blur' },
                        {
                            min: 1, max: 30,
                            message: '长度必须在1-30之间', trigger: 'blur'
                        }]">
                        <el-input v-model="editform.newName" autocomplete="off" placeholder="请输入工段名称" />
                    </el-form-item>
                </DialogComponent>

                <!-- 工位管理弹框 -->
                <DialogComponent ref="manageDialog" :form="manageform" dialog-title="工位管理" :refreshFunc="getDataFromAPI"
                    :confirm-func="updateStationsAPI" @dialogClose="dialogClose">
                    <el-form-item label="工段名称" prop="section" :rules="[
                        { required: true, message: '请输入工段名称', trigger: 'blur' },
                        {
                            min: 1, max: 30,
                            message: '长度必须在1-30之间', trigger: 'blur'
                        }]">
                        <el-input v-model="manageform.section" autocomplete="off" disabled placeholder="请输入工段名称" />
                    </el-form-item>
                    <el-form-item class="form-row" v-for="(item, index) in manageform.stations" :key="index" label="工位名称"
                        :rules="[
                            { required: true, message: '请输入工位名称', trigger: 'blur' },
                            {
                                min: 1, max: 30,
                                message: '长度必须在1-30之间', trigger: 'blur'
                            }]">
                        <el-input v-model="manageform.stations[index]" placeholder="请输入工位名称" disabled></el-input>
                        <el-button @click="deleteFormItem(manageform, index)" disabled>
                            <Minus style="width: 1em; height: 1em;" />
                        </el-button>
                    </el-form-item>
                    <el-button @click="addFormItem(manageform)" disabled>
                        <Plus style="width: 1em; height: 1em;" />
                    </el-button>
                </DialogComponent>

                <!-- table -->
                <el-table :data="tableData.value" style="width: 100%; border-radius: 1vh" table-layout="fixed" height="48vh"
                    show-overflow-tooltip>
                    <el-table-column type="selection" align="center" />
                    <el-table-column label="序号" type="index" align="center" min-width="70vh" />
                    <el-table-column prop="section" label="工段名称" align="center" />
                    <el-table-column prop="operation" label="操作" align="center">
                        <template #default="scope">
                            <el-button class="inline_button"
                                @click="getStationsBySection(scope.row.section), manageDialog.dialogVisible = true, dialog = true, manageform.section = scope.row.section">
                                工位管理
                            </el-button>
                            <el-button class="inline_button" disabled
                                @click="editDialog.dialogVisible = true, dialog = true, editform.section = scope.row.section, editform.newName = scope.row.section">
                                编辑
                            </el-button>
                            <el-button class="inline_button" @click="deleteConfirm(scope.row.section)" disabled>
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
.form-row {
    display: flex;
    /* 使用 Flex 布局 */
    align-items: center;
    /* 垂直居中对齐 */
    margin-bottom: 10px;
    /* 控制行之间的间距 */
}

.subNavPage {
    border-radius: 3%;
    color: #fff;
    height: 100%;
    width: 95%;
    margin: 0 auto;
    /* background-color: #3545659e; */
    /* 3f536cb0 */
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

:deep .el-form-item__content {
    flex-wrap: nowrap;
}

.inline_button {
    padding: 0 2px;
    margin: 0;
    text-decoration: underline;
    color: #729fd0;
    border: none;
    width: min-content;
}

:deep .el-dialog {
    --el-dialog-padding-primary: 3vh;
    --el-dialog-border-radius: 1vh
}

:deep .el-overlay {
    background-color: rgba(37, 54, 83, 0.498);
}
</style>

