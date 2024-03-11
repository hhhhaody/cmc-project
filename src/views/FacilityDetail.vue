<script setup>
import { ref, onMounted, reactive, onUnmounted, watch } from "vue";
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import { useRoute } from 'vue-router'
import SearchComponent from "../components/SearchComponent.vue";
import PaginationComponent from "../components/PaginationComponent.vue";
import DialogComponent from "../components/DialogComponent.vue";
import { getMaterialOperationAPI, getMaterialOperationByIdAPI, deleteMaterialOperationAPI, updateMaterialOperationAPI } from "../apis/material";
import ExportButton from "@/components/ExportButton.vue";
import { getByIdAPI, getFacilityStatusAPI } from "../apis/facility";



// 从后端获取数据
const tableData = reactive([]);
const total = ref(0)
const getDataFromAPI = async () => {
    const res = await getFacilityStatusAPI(currentPage.value, pageSize.value, '', '', '', time.value[0], time.value[1], addform.serialNo);
    // console.log(res.data);
    tableData.value = res.data.data;
    total.value = res.data.total
    updateSearchSuggestion()

};
//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------


//导出组件相关
const selectedRows = ref([]);
const handleSelectionChange = (selected) => {
    // console.log('Handling selection change:', selected);
    selectedRows.value = selected;
    // console.log('selectedRows after update:', selectedRows.value);
};
const headers = ref([
    { key: 'id', title: 'ID' },
    { key: 'name', title: '物料名称' },
    { key: 'spec', title: '规格型号' },
    { key: 'amount', title: '库存数量' },
    { key: 'supplyTime', title: '操作时间' },
]);
const filterExportData = (data) => {
    // 过滤或转换数据的逻辑
    return data; // 示例：返回原始数据，不做任何处理
};


//搜索组件相关
//#region
const search1 = ref();
const search2 = ref();
const search3 = ref();
// const search4 = ref();
const search5 = ref();
const search6 = ref();
const operation = ref("")
const name = ref("")
const spec = ref("")
const time = ref("")
const supplier = ref("")
const operator = ref("")
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
    if (title === "operation") operation.value = keyword
    if (title === "name") name.value = keyword
    if (title === "spec") spec.value = keyword
    if (title === "supplier") supplier.value = keyword
    if (title === "operator") operator.value = keyword
};

// 根据关键字搜索数据库
const update = () => {
    refresh.value = true
    getDataFromAPI()
};

// 清空搜索组件的关键字搜索，并初始化表格展示数据
const reset = () => {
    refresh.value = true
    // operation.value = "";
    // name.value = "";
    // spec.value = "";
    time.value = "";
    getDataFromAPI()

    // supplier.value = "";
    // operator.value = "";
    // search1.value.searchContent = "";
    // search2.value.searchContent = "";
    // search3.value.searchContent = "";

    // if (show.value) {
    //     time.value = "";

    //     search5.value.searchContent = "";
    //     search6.value.searchContent = "";
    // }

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
const uploaded = ref(null)
const editDialog = ref()

const dialogClose = () => {
    dialog.value = false
    uploaded.value = null
}

const addform = reactive({
    attachment: 'example.txt',
})

const downloadAttachment = () => {
    const downloadUrl = `https://cmc.eos-chengdu-1.cmecloud.cn/devicefile/${addform.attachment}`;
    window.open(downloadUrl, '_blank');
};

//表单数据
const updateform
    = reactive({
        name: '',
        spec: '',
        operation: '',
        batch: '',
        amount: '',
        supplier: '',
        supplyTime: '',
        operateTime: '',
        operator: '',
        receipt: '',
    })

watch(
    updateform,
    (newVal, oldVal) => {

        formattedTime.value = updateform.operateTime.substring(0, 10) + ' ' + updateform.operateTime.substring(11,)
        // uploaded.value = updateform.receipt
    },
    { deep: true } // Enable deep monitoring
);

//编辑相关
//数据回显API

const getFacilityByID = async (id) => {
    const res = await getByIdAPI(id);
    if (res.code === 1) {
        addform.id = res.data.id
        addform.name = res.data.name
        addform.spec = res.data.spec
        addform.status = res.data.status
        addform.serialNo = res.data.serialNo
        addform.section = res.data.section
        addform.station = res.data.station
        addform.supplier = res.data.supplier
        addform.purchaseTime = res.data.purchaseTime
        addform.contact = res.data.contact
        addform.contactNo = res.data.contactNo
        addform.attachment = res.data.attachment
        addform.warranty = res.data.warranty
        addform.dailyMaintenance = res.data.dailyMaintenance
        addform.firstLevelMaintenance = res.data.firstLevelMaintenance
        addform.secondLevelMaintenance = res.data.secondLevelMaintenance
        getDataFromAPI()
    }
};


// #endregion

//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------
//确认删除
//#region

import { ElMessage, ElMessageBox } from 'element-plus'

const del = async (id) => {
    const res = await deleteMaterialOperationAPI(id);
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
    // getDataFromAPI()

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
const confirmImage = ref(false)
const saveImage = () => {
    confirmImage.value = true
}
const uploadImage = (uidToFileNameMap) => {
    // console.log("picture uploaded");
    console.log(JSON.stringify(uidToFileNameMap));
    if (Object.keys(uidToFileNameMap).length === 0) {
        console.log("receipt is empty")
        updateform.receipt = ""
    }
    else updateform.receipt = JSON.stringify(uidToFileNameMap);
    console.log(updateform);
    confirmImage.value = false
}
//#endregion
//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------
//图片详情相关
//#region

const dialogVisible = ref(false);
const currentIndex = ref(0);
const imageUrls = ref([]);

const detail = (receipt) => {
    const receiptMap = JSON.parse(receipt);
    imageUrls.value = Object.values(receiptMap).map(url => ("https://cmc.eos-chengdu-1.cmecloud.cn/receipt/" + url));
    currentIndex.value = 0;
    dialogVisible.value = true;
}

const prevImage = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--;
    }
}

const nextImage = () => {
    if (currentIndex.value < imageUrls.value.length - 1) {
        currentIndex.value++;
    }
}

//#endregion

const route = useRoute()
const id = route.query.id
getFacilityByID(id)

</script>

<template>
    <!-- borderbox -->
    <dv-border-box1 ref="borderRef" class="subNavPage animate__animated animate__zoomIn"
        :color="['#4f698794', '#4f698794']" background-color="#3545659e">
        <!-- body -->
        <el-container class="subNavPage">
            <br />
            <div style="display: flex;justify-content: center;">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/facility' }">
                        <h1>设备台账管理</h1>
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>
                        <h1>详情</h1>
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <!-- main -->
            <el-main style="overflow: hidden">

                <!-- search -->
                <div style="margin-top: 1vh">
                    <div style="display: inline-block; position: relative;top: 2px; padding-right: 2vh;">更新时间：
                        <el-date-picker v-model="time" type="datetimerange" start-placeholder="开始日期"
                            end-placeholder="结束日期" :default-time="defaultTime1" value-format="YYYY-MM-DDTHH:mm:ss" />
                    </div>

                    <el-button type="primary" style="margin-left: 12px; width: 7%" @click="update">
                        <Search style="width: 1em; height: 1em; margin-right: 8px" />搜索
                    </el-button>
                    <el-button style="width: 7%" @click="reset">
                        <DeleteFilled style="width: 1em; height: 1em; margin-right: 8px" />清空
                    </el-button>
                </div>

                <!-- 设备详情 -->
                <div style="display: flex; justify-content: space-between; width: 100%;margin-top: 1vh">
                    <el-card
                        style="display: flex;flex-direction: column;justify-content: space-evenly;align-items: center;">
                        <div style="height: 4vh;line-height: 4vh">
                            {{ addform.name }}</div>
                        <div style="height: 4vh;line-height: 4vh;">
                            {{ addform.spec }}</div>
                        <div
                            style="height: 4vh;line-height: 4vh;text-decoration: underline; color: #729fd0; width: fit-content;">
                            {{ addform.status }}</div>
                    </el-card>

                    <el-descriptions border :column="4">
                        <el-descriptions-item label="设备编号">{{ addform.serialNo }}</el-descriptions-item>
                        <el-descriptions-item label="工段名称">{{ addform.section }}</el-descriptions-item>
                        <el-descriptions-item label="工位名称">{{ addform.station }}</el-descriptions-item>
                        <el-descriptions-item label="日常保养">{{ addform.dailyMaintenance ? '是' : '否'
                            }}</el-descriptions-item>

                        <el-descriptions-item label="供应商">{{ addform.supplier }}</el-descriptions-item>

                        <el-descriptions-item label="购买日期">{{ addform.purchaseTime ? addform.purchaseTime.substring(0,
            10) : ''
                            }}</el-descriptions-item>
                        <el-descriptions-item label="质保期">{{ addform.warranty }}</el-descriptions-item>
                        <el-descriptions-item label="一级保养">{{ addform.firstLevelMaintenance }}</el-descriptions-item>

                        <el-descriptions-item label="联系人">{{ addform.contact }}</el-descriptions-item>
                        <el-descriptions-item label="联系方式">{{ addform.contactNo }}</el-descriptions-item>
                        <el-descriptions-item label="附件">
                            {{ addform.attachment }}
                            <el-button type="primary" @click="downloadAttachment"
                                style="margin-left: 10px;  align-items: center; justify-content: center;">下载</el-button>
                        </el-descriptions-item>

                        <el-descriptions-item label="二级保养">{{ addform.secondLevelMaintenance }}</el-descriptions-item>
                    </el-descriptions>


                </div>
                <!-- operation -->
                <div style="display: flex; justify-content: space-between; margin-top: 1vh;">
                    <!-- <span>
                        <ExportButton v-model="selectedRows" :headers="headers" :tableData="tableData.value"
                            fileName="物料操作信息.xlsx" :filterFunction="filterExportData" buttonLabel="导出" />
                    </span> -->
                </div>



                <!-- table -->
                <el-table :data="tableData.value" @selection-change="handleSelectionChange"
                    style="width: 100%;margin-top: 1vh; border-radius: 1vh;" table-layout="fixed" show-overflow-tooltip
                    height="42vh">
                    <!-- <el-table-column type="selection" align="center" min-width="20vh" /> -->
                    <el-table-column label="序号" type="index" align="center" min-width="40vh" />
                    <el-table-column prop="updateTime" label="更新时间" align="center" min-width="120vh">
                        <template #default="scope">
                            {{ scope.row.updateTime.substring(0, 10) }} {{ scope.row.updateTime.substring(11,) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="beforeStatus" label="更新前状态" align="center" />
                    <el-table-column prop="afterStatus" label="更新后状态" align="center" />
                    <!-- <el-table-column prop="amount" label="数量" align="center" min-width="50vh" />
                    <el-table-column prop="operation" label="操作" align="center" min-width="40vh" />
                    <el-table-column prop="operateTime" label="操作时间" align="center" min-width="120vh">
                        <template #default="scope">
                            {{ scope.row.operateTime.substring(0, 10) }} {{ scope.row.operateTime.substring(11,) }}
                        </template>
                    </el-table-column>

                    <el-table-column prop="operator" label="操作人员" align="center" />
                    <el-table-column prop="supplier" label="供料单位" align="center" />
                    <el-table-column prop="supplyTime" label="供料日期" align="center">
                        <template #default="scope">
                            {{ scope.row.supplyTime.substring(0, 10) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="receipt" label="凭证" align="center" min-width="40vh">
                        <template #default="scope">
                            <el-button class="inline_button" @click="detail(scope.row.receipt)">
                                详情
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="operation1" label="业务操作" align="center">
                        <template #default="scope">
                            <el-button class="inline_button"
                                @click="getMaterialOperationByID(scope.row.id), editDialog.dialogVisible = true, dialog = true, updateform.id = scope.row.id">
                                编辑
                            </el-button>
                            <el-button class="inline_button" @click="deleteConfirm(scope.row.id)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column> -->

                </el-table>
            </el-main>
            <!-- pagination -->
            <el-footer style="display: flex; justify-content: center">
                <PaginationComponent :total="total" @size="size" @cur="cur" />
            </el-footer>
        </el-container>
    </dv-border-box1>
    <!-- 图片详情弹框 -->
    <el-dialog v-model="dialogVisible" style="width: fit-content;border-radius: 1vh;">
        <ArrowLeft @click="prevImage" v-if="currentIndex > 0" style="width: 5vh; height: 5vh" class="prev-button" />
        <img w-full :src="imageUrls[currentIndex]" alt="无图片" class="image" />
        <ArrowRight @click="nextImage" v-if="currentIndex < imageUrls.length - 1" style="width: 5vh; height: 5vh"
            class="next-button" />

    </el-dialog>
</template>

<style scoped>
.image-dialog {
    display: flex;
    align-items: center;
    justify-content: center;
}

.prev-button {
    position: absolute;
    left: 20px;
    /* Adjust the left position as needed */
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    color: white
}

.next-button {
    position: absolute;
    right: 20px;
    /* Adjust the right position as needed */
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    color: white
}

.image {
    max-width: 100%;
    max-height: 60vh;
}

.subNavPage {
    border-radius: 3%;
    color: #fff;
    height: 100%;
    width: 95%;
    margin: 0 auto;
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

:deep .el-breadcrumb__inner {
    color: #fff !important;
}

:deep .el-breadcrumb__inner.is-link {
    color: #fff !important;
    text-shadow: 1px 1px 15px #a3ccf9;
}

:deep .el-date-editor {
    height: 33px !important;
}

:deep .el-descriptions__body {
    border-radius: 1vh !important;
    padding: 2vh
}

:deep .el-card.is-always-shadow {
    border-radius: 1vh !important;
    margin-right: 1vh;
}
</style>
