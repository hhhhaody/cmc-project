<script setup>
import { ref, onMounted, reactive, onUnmounted, watch, computed } from "vue";
import { RouterLink } from "vue-router";
import { format } from "date-fns"
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import SearchComponent from "../components/SearchComponent.vue";
import DialogSearch from "../components/DialogSearch.vue";
import PaginationComponent from "../components/PaginationComponent.vue";
import DialogComponent from "../components/DialogComponent.vue";
import UploadImage from "../components/UploadImage.vue";
import ExportButton from "@/components/ExportButton.vue";
import { getStationsIdsAPI } from "../apis/productionLine"
import { getProductAPI, addProductAPI, deleteProductAPI, updateProductAPI, addProductOperationAPI, getByBatchAPI } from "../apis/product"
import { getTroubleshootingRecordAPI, addTroubleshootingRecordAPI, getByIdAPI, updateTroubleshootingRecordAPI } from "../apis/troubleshooting"
import { useUserStore } from '../stores/store.js';
const userStore = useUserStore();

// 从后端获取数据
const tableData = reactive([]);
const total = ref(0)
const getDataFromAPI = async () => {
    const res = await getTroubleshootingRecordAPI(currentPage.value, pageSize.value, section.value, name.value, spec.value, time.value[0], time.value[1], status.value, repairman.value);
    // console.log(res.data);
    tableData.value = res.data.data;
    total.value = res.data.total
    updateSearchSuggestion()

};
//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------
//导出组件相关
//#region
const selectedRows = ref([]);
const handleSelectionChange = (selected) => {
    // console.log('Handling selection change:', selected);
    selectedRows.value = selected;
    // console.log('selectedRows after update:', selectedRows.value);
};
const headers = ref([
    { key: 'id', title: '序号' },
    { key: 'serialNo', title: '设备编号' },
    { key: 'name', title: '设备名称' },
    { key: 'spec', title: '规格型号' },
    { key: 'station', title: '工位名称' },
    { key: 'section', title: '工段名称' },
    { key: 'error', title: '故障内容' },
    { key: 'errorTime', title: '故障时间' },
    { key: 'completeTime', title: '完成维修日期' },
    { key: 'repairman', title: '维修人员' },
    { key: 'info', title: '维修内容' },
]);
const filterExportData = (data) => {
    // 过滤或转换数据的逻辑
    return data; // 示例：返回原始数据，不做任何处理
};
//#endregion
//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------

//搜索组件相关
//#region
const search1 = ref();
const search2 = ref();
const search3 = ref();
// const search4 = ref();
const search5 = ref();
const search6 = ref();
const section = ref("")
const name = ref("")
const spec = ref("")
const time = ref("")
const status = ref("")
const repairman = ref("")
const defaultTime1 = new Date(2000, 1, 1, 12, 0, 0)
const show = ref(false)


//用于重新加载搜索框和搜索建议
const renderKey = ref(0)
const updateSearchSuggestion = () => {
    renderKey.value = renderKey.value + 1
}

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


// 记录用于通过搜索组件输入的搜索种类及对应关键词
const search = (title, keyword) => {
    console.log(title, keyword);
    if (title === "section") section.value = keyword
    if (title === "name") name.value = keyword
    if (title === "spec") spec.value = keyword
    if (title === "status") status.value = keyword
    if (title === "repairman") repairman.value = keyword
};

// 根据关键字搜索数据库
const update = () => {
    refresh.value = true
    getDataFromAPI()
};

// 清空搜索组件的关键字搜索，并初始化表格展示数据
const reset = () => {
    refresh.value = true
    section.value = "";
    name.value = "";
    spec.value = "";
    time.value = "";
    status.value = "";
    repairman.value = "";
    search1.value.searchContent = "";
    search2.value.searchContent = "";
    search3.value.searchContent = "";

    if (show.value) {
        time.value = "";

        search5.value.searchContent = "";
        search6.value.searchContent = "";
    }

    getDataFromAPI()
};

//日期组件清空时默认为null，改为空字符串
watch(
    time,
    (newVal, oldVal) => {
        if (newVal == null) {
            time.value = ""
        }
    }
);
// #endregion

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
const formattedTime = ref()
const remainingStock = ref(null);
const addDialog = ref()
const editDialog = ref()
const stockInDialog = ref()
const stockOutDialog = ref()
const transferDialog = ref()
const confirmImage = ref(false)
const stations = ref([])

const dialogClose = () => {
    dialog.value = false
    remainingStock.value = null
}

const saveImage = () => {
    confirmImage.value = true
}


const disabledDate = (day) => {
    return day > new Date();
}

//完成维修时间不早于故障时间
const disabledDate1 = (day) => {
    return day < new Date(stockform.errorTime);
}

const getDefaultDate = () => {
    const currentDate = new Date()
    stockform.operateTime = format(currentDate, 'yyyy-MM-dd') + 'T' + format(currentDate, 'HH:mm:ss')
}

const remains = computed(() => {
    if (remainingStock.value == null) {
        return "请输入数量"
    }
    return `本批次余量：${remainingStock.value}`;
});

//表单数据
const addform = reactive({
    name: '',
    spec: '',
    threshold: '',
    stackThreshold: '',
    section: '',
    stations: [],
    times: []
})

const stockform
    = reactive({
        name: '',
        spec: '',
        section: '',
        station: '',
        status: '正常使用',
        serialNo: '',
        error: '',
        errorTime: '',
        completeTime: '',
        repairman: '',
        info: '',
        updateTime: ''
    })

watch(
    stockform,
    (newVal, oldVal) => {
        formattedTime.value = stockform.errorTime.substring(0, 10)
        // console.log(stockform)
    },
    { deep: true } // Enable deep monitoring
);



//编辑相关
//数据回显API

const getTroubleshootingRecordByID = async (id) => {
    const res = await getByIdAPI(id);
    if (res.code === 1) {
        console.log(res.data);
        stockform.name = res.data.name
        stockform.spec = res.data.spec
        stockform.error = res.data.error
        stockform.station = res.data.station
        stockform.section = res.data.section
        stockform.errorTime = res.data.errorTime
        stockform.serialNo = res.data.serialNo
        stockform.updateTime = res.data.updateTime
        updateSearchSuggestion()
        console.log(stockform);
    }
};

const getProductOperationByBatch = async (batch) => {
    const res = await getByBatchAPI(batch);
    if (res.code === 1) {
        stockform.name = res.data.name
        stockform.spec = res.data.spec
        stockform.quality = res.data.quality
        stockform.produceTime = res.data.produceTime
        remainingStock.value = res.data.amount
        updateSearchSuggestion()
    }
    console.log(res.data);
};

// 弹框内输入框搜索相关

//DialogSearch组件使用
const dialogSearchSuggestion = (title, keyword) => {

    if (title === "name") stockform.name = keyword
    if (title === "spec") stockform.spec = keyword
    if (title === "section") stockform.section = keyword
    if (title === "serialNo") stockform.serialNo = keyword
    // if (title === "batch") {
    //     stockform.batch = keyword
    //     getProductOperationByBatch(keyword)
    // }
    updateSearchSuggestion()

}

// #endregion

//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------
//确认删除
//#region

import { ElMessage, ElMessageBox } from 'element-plus'

const del = async (id) => {
    const res = await deleteProductAPI(id);
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
            del(id)
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

//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------
//图片上传相关
//#region 

const uploadImage = (uidToFileNameMap) => {
    // console.log("picture uploaded");
    // const allFileNames = computed(() => Object.values(uidToFileNameMap).join('-'));
    console.log(JSON.stringify(uidToFileNameMap));
    // console.log(allFileNames.value);
    // stockform.receipt = allFileNames.value
    stockform.receipt = JSON.stringify(uidToFileNameMap);
    console.log(stockform);
    confirmImage.value = false
}
//#endregion
</script>

<template>
    <!-- borderbox -->
    <dv-border-box1 ref="borderRef" class="subNavPage animate__animated animate__zoomIn" :color="['#4f698794', '#4f698794']"
        background-color="#3545659e">
        <!-- body -->
        <el-container class="subNavPage">
            <br />
            <h1>故障维修记录</h1>
            <!-- main -->
            <el-main style="overflow: hidden">
                <!-- search -->
                <div>
                    <SearchComponent :key="renderKey" search-title="工段名称" :searchContent=section ref="search1"
                        field="section" database="troubleshooting" @search="search" @edit="edit" :wNo="10" />
                    <SearchComponent :key="renderKey" search-title="设备名称" :searchContent=name ref="search2" field="name"
                        @search="search" database="troubleshooting" @edit="edit" :wNo="10" />
                    <SearchComponent :key="renderKey" search-title="规格型号" :searchContent=spec ref="search3" field="spec"
                        @search="search" database="troubleshooting" @edit="edit" :wNo="10" />
                    <SearchComponent :key="renderKey" search-title="维修状态" :searchContent=status ref="search5" field="status"
                        database="troubleshooting" @search="search" @edit="edit" :wNo="10" />
                    <el-button style="margin-left: 10px; width: 7%" @click="show = !show">
                        <ArrowDown style="width: 1em; height: 1em; margin-right: 8px" />更多
                    </el-button>
                    <el-button type="primary" style="margin-left: 12px; width: 7%" @click="update">
                        <Search style="width: 1em; height: 1em; margin-right: 8px" />搜索
                    </el-button>
                    <el-button style="width: 7%" @click="reset">
                        <DeleteFilled style="width: 1em; height: 1em; margin-right: 8px" />清空
                    </el-button>
                </div>
                <div style="margin-top: 1vh;position:absolute;left:17%" v-if="show">
                    <div style="display: inline-block; position: relative;top: 2px; padding-right: 1vh;">完成维修日期：
                        <el-date-picker v-model="time" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"
                            :default-time="defaultTime1" value-format="YYYY-MM-DDTHH:mm:ss" />
                    </div>

                    <SearchComponent :key="renderKey" search-title="维修人员" :searchContent=repairman ref="search6"
                        field="repairman" database="troubleshooting" @search="search" @edit="edit" :wNo="17" />
                </div>
                <br />
                <!-- operation -->
                <div v-if="!userStore.isReadOnly" style="display: flex; justify-content: space-between">
                    <span>
                        <el-button type="primary" @click="addDialog.dialogVisible = true, dialog = true">
                            <Plus style="width: 1em; height: 1em; margin-right: 8px" />新增
                        </el-button>

                        <ExportButton v-model="selectedRows" :headers="headers" :tableData="tableData.value"
                            fileName="故障维修记录.xlsx" :filterFunction="filterExportData" buttonLabel="导出" />
                    </span>
                    <!-- <span>
                        <el-button
                            @click="stockInDialog.dialogVisible = true, stockform.operation = '入库', dialog = true, getDefaultDate()">入库</el-button>
                        <el-button
                            @click="stockOutDialog.dialogVisible = true, stockform.operation = '出库', dialog = true, getDefaultDate()">出库</el-button>

                    </span> -->
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
                    <!-- <RouterLink to="/product/operation">操作记录</RouterLink> -->
                </div>

                <!-- 弹框区 -->
                <!-- 新增弹框 -->
                <DialogComponent ref="addDialog" :form="stockform" dialog-title="新增故障维修记录" :refreshFunc="getDataFromAPI"
                    :confirm-func="addTroubleshootingRecordAPI" @dialogClose="dialogClose" :image=true @saveImage=saveImage>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="设备名称" prop="name" :rules="[
                                { required: true, message: '请选择设备名称', trigger: 'blur' }]">
                                <DialogSearch :key="renderKey" :wNo="100" search-title="设备名称" :searchContent=stockform.name
                                    field="name" @search="dialogSearchSuggestion" :data="stockform" database="facilities" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="规格型号" prop="spec" :rules="[
                                { required: true, message: '请选择规格型号', trigger: 'blur' }]">
                                <DialogSearch :key="renderKey" :wNo="100" search-title="规格型号" :searchContent=stockform.spec
                                    field="spec" @search="dialogSearchSuggestion" :data="stockform" database="facilities" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="工段名称" prop="section" :rules="[
                                { required: true, message: '请选择工段名称', trigger: 'blur' }]">
                                <DialogSearch :key="renderKey" :wNo="100" search-title="工段名称"
                                    :searchContent=stockform.section field="section" @search="dialogSearchSuggestion"
                                    :data="stockform" database="facilities" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="设备编号" prop="serialNo" :rules="[
                                { required: true, message: '请选择设备编号', trigger: 'blur' }]">
                                <DialogSearch :key="renderKey" :wNo="100" search-title="设备编号"
                                    :searchContent=stockform.serialNo field="serialNo" @search="dialogSearchSuggestion"
                                    :data="stockform" database="facilities" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="故障时间" prop="errorTime" :rules="[
                                { required: true, message: '请输入故障时间', trigger: 'blur' }]">
                                <el-date-picker v-model="stockform.errorTime" type="datetime" placeholder="选择故障时间"
                                    value-format="YYYY-MM-DDTHH:mm:ss" :disabled-date="disabledDate" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="故障内容" prop="error" :rules="[
                        { required: true, message: '请填写故障内容', trigger: 'blur' }]">
                        <el-input v-model="stockform.error" autocomplete="off" placeholder="请填写故障内容" />
                    </el-form-item>
                </DialogComponent>

                <!-- 编辑弹框 -->
                <DialogComponent ref="editDialog" :form="stockform" dialog-title="编辑故障维修记录" :refreshFunc="getDataFromAPI"
                    :confirm-func="updateTroubleshootingRecordAPI" @dialogClose="dialogClose" :image=true
                    @saveImage=saveImage>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="设备名称" prop="name">
                                <el-input v-model="stockform.name" autocomplete="off" disabled />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="规格型号" prop="spec">
                                <el-input v-model="stockform.spec" autocomplete="off" disabled />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="工段名称" prop="section">
                                <el-input v-model="stockform.section" autocomplete="off" disabled />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="设备编号" prop="serialNo">
                                <el-input v-model="stockform.serialNo" autocomplete="off" disabled />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="故障时间" prop="errorTime" :rules="[
                                { required: true, message: '请输入故障时间', trigger: 'blur' }]">
                                <el-date-picker v-model="stockform.errorTime" type="datetime" placeholder="选择故障时间"
                                    value-format="YYYY-MM-DDTHH:mm:ss" disabled />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="故障内容" prop="error">
                        <el-input v-model="stockform.error" autocomplete="off" placeholder="请填写故障内容" disabled />
                    </el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="完成维修时间" prop="completeTime" :rules="[
                                { required: true, message: '请输入完成维修时间', trigger: 'blur' }]">
                                <el-date-picker v-model="stockform.completeTime" type="datetime" placeholder="选择完成维修时间"
                                    value-format="YYYY-MM-DDTHH:mm:ss" :disabled-date="disabledDate1" />
                            </el-form-item>
                        </el-col>
                        <el-col :span=12>
                            <el-form-item label="维修人员" prop="repairman" :rules="[
                                { required: true, message: '请输入维修人员', trigger: 'blur' },
                                {
                                    min: 1, max: 30,
                                    message: '长度必须在1-30之间', trigger: 'blur'
                                }]">
                                <el-input v-model="stockform.repairman" autocomplete="off" placeholder="请输入维修人员" />

                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="维修结果" prop="status" :rules="[
                        { required: true, message: '请选择维修结果', trigger: 'blur' }]">
                        <el-radio-group v-model="stockform.status">
                            <el-radio-button label="完成维修" />
                            <el-radio-button label="维修失败" />
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="维修内容" prop="info" :rules="[
                        { required: true, message: '请填写维修内容', trigger: 'blur' }]">
                        <el-input v-model="stockform.info" autocomplete="off" placeholder="请填写维修内容" />
                    </el-form-item>
                </DialogComponent>



                <!-- table -->
                <el-table :data="tableData.value" @selection-change="handleSelectionChange"
                    style="width: 100%; border-radius: 1vh" table-layout="fixed" height="48vh" show-overflow-tooltip>
                    <el-table-column type="selection" align="center" min-width="20vh" />
                    <el-table-column label="序号" type="index" align="center" min-width="40vh" />
                    <el-table-column prop="serialNo" label="设备编号" align="center" />
                    <el-table-column prop="name" label="设备名称" align="center" />
                    <el-table-column prop="spec" label="规格型号" align="center" />
                    <el-table-column prop="station" label="工位名称" align="center" />
                    <el-table-column prop="section" label="工段名称" align="center" />
                    <el-table-column prop="error" label="故障内容" align="center" />
                    <el-table-column prop="errorTime" label="故障时间" align="center" min-width="120vh">
                        <template #default="scope">
                            {{ scope.row.errorTime.substring(0, 10) }} {{ scope.row.errorTime.substring(11,) }}
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="completeTime" label="完成维修日期" align="center" min-width="100vh">
                        <template #default="scope">
                            {{ scope.row.completeTime ? scope.row.completeTime.substring(0, 10) : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="repairman" label="维修人员" align="center" />
                    <el-table-column prop="info" label="维修内容" align="center" /> -->
                    <el-table-column prop="status" label="维修状态" align="center" />

                    <el-table-column prop="operation" label="操作" align="center">
                        <template #default="scope">
                            <el-button v-if="!userStore.isReadOnly" class="inline_button"
                                @click="getTroubleshootingRecordByID(scope.row.id), editDialog.dialogVisible = true, dialog = true, stockform.id = scope.row.id">
                                编辑
                            </el-button>
                            <!-- <el-button class="inline_button" @click="deleteConfirm(scope.row.id)">
                                删除
                            </el-button> -->

                            <el-button class="inline_button">
                                <RouterLink :to="{ name: 'troubleshootingDetail', query: { id: scope.row.id } }">详情
                                </RouterLink>
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

:deep .el-dialog {
    --el-dialog-padding-primary: 3vh;
    --el-dialog-border-radius: 1vh
}

:deep .el-overlay {
    background-color: rgba(37, 54, 83, 0.498);
}
</style>

