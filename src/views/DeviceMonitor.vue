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
import { getMaterialAPI, addMaterialAPI, updateMaterialAPI, deleteMaterialAPI, addMaterialOperationAPI, getByBatchAPI } from "../apis/material";
import ExportButton from "@/components/ExportButton.vue";
import { addFacilityAPI, getFacilityAPI, deleteFacilityAPI, getByIdAPI, updateFacilityAPI, updateFacilityStatusAPI } from "../apis/facility";

// const workstations = reactive([
//     {
//         name: "型钢切割工作站",
//         components: [
//             { name: "桁架机械手", status: "normal" },
//             { name: "翻转机", status: "normal" },
//             { name: "激光切割机", status: "normal" },
//             { name: "搬运机器人", status: "normal" },
//         ]
//     }, {
//         name: "地面钢网工作站",
//         components: [
//             { name: "桁架机械手", status: "normal" },
//             { name: "焊接机械臂桁架", status: "normal" },
//             { name: "焊接机器人", status: "normal" },
//             { name: "焊接夹具", status: "normal" },
//         ]
//     }, {
//         name: "方通组焊工作站",
//         components: [
//             { name: "搬运机器人", status: "normal" },
//             { name: "焊接机台1", status: "normal" },
//             { name: "焊接机台2", status: "normal" },
//             { name: "焊接机台3", status: "normal" },
//             { name: "焊接机台4", status: "normal" },
//             { name: "焊接机器人A", status: "normal" },
//             { name: "焊接机器人B", status: "normal" },
//             { name: "组焊机台", status: "normal" },
//             { name: "桁架机械手", status: "normal" },
//             { name: "入料台", status: "normal" },
//             { name: "出料台", status: "normal" },
//         ]
//     }, {
//         name: "模块总装工作站",
//         components: [
//             { name: "移动模台", status: "normal" },
//             { name: "墙面夹具A", status: "normal" },
//             { name: "墙面夹具B", status: "normal" },
//             { name: "机器人桁架", status: "normal" },
//             { name: "焊接机器人A", status: "normal" },
//             { name: "焊接机器人B", status: "normal" },
//         ]
//     },

// ]);


// 从后端获取数据
const tableData = reactive([]);
const total = ref(0)
const getDataFromAPI = async () => {
    const res = await getFacilityAPI(null, 99999, null, null, null, null, null);
    // console.log(res.data);
    const station1 = [];
    const station2 = [];
    const station3 = [];
    const station4 = [];
    const section1 = { name: '型钢切割工作站', components: [] };
    const section2 = { name: '地面钢网工作站', components: [] }
    const section3 = { name: '方通组焊工作站', components: [] }
    const section4 = { name: '模块总装工作站', components: [] }
    for (const i in res.data.data) {
        const item = res.data.data[i]

        if (item.section === '型钢切割工作站') {
            station1.push({ name: item.name, status: item.status === '检修维护' ? 'maintenance' : item.status === '正常使用' ? 'normal' : 'stopped' })
        }

        if (item.section === '地面钢网工作站') {
            station2.push({ name: item.name, status: item.status === '检修维护' ? 'maintenance' : item.status === '正常使用' ? 'normal' : 'stopped' })
        }
        if (item.section === '方通组焊工作站') {
            station3.push({ name: item.name, status: item.status === '检修维护' ? 'maintenance' : item.status === '正常使用' ? 'normal' : 'stopped' })
        }
        if (item.section === '模块总装工作站') {
            station4.push({ name: item.name, status: item.status === '检修维护' ? 'maintenance' : item.status === '正常使用' ? 'normal' : 'stopped' })
        }
    }
    section1.components = station1
    section2.components = station2
    section3.components = station3
    section4.components = station4
    // console.log(section1);
    tableData.value = [section1, section2, section3, section4]
    // console.log(tableData);
    // tableData.value = res.data.data;
    // total.value = res.data.total
    // updateSearchSuggestion()

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
    { key: 'threshold', title: '低库存阈值' },
]);
const filterExportData = (data) => {
    // 过滤或转换数据的逻辑
    return data; // 示例：返回原始数据，不做任何处理
};



//搜索组件相关
//#region
const search1 = ref();
const search2 = ref();
const name = ref("")
const spec = ref("")
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


// 记录用于通过搜索组件输入的搜索种类及对应关键词 searchComponent
const search = (title, keyword) => {
    // console.log(title, keyword);
    if (title === "name") name.value = keyword
    if (title === "spec") spec.value = keyword


    //弹框内使用
    if (title === "supplier") stockform.supplier = keyword
    if (title === "operator") stockform.operator = keyword
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
    spec.value = "";
    search1.value.searchContent = "";
    search2.value.searchContent = "";
    getDataFromAPI()
};

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

const dialogClose = () => {
    dialog.value = false
    remainingStock.value = null
}

const saveImage = () => {
    confirmImage.value = true
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
    threshold: ''
})
const updateform = reactive({
    id: '',
    name: '',
    spec: '',
    threshold: ''
})
const stockform
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
    stockform,
    (newVal, oldVal) => {
        // console.log('uidToFileNameMap changed:');
        // console.log('New uidToFileNameMap:', newMap);
        console.log(newVal);

        // You can perform actions here based on the changes in the uidToFileNameMap
        formattedTime.value = stockform.supplyTime.substring(0, 10)
    },
    { deep: true } // Enable deep monitoring
);

//编辑相关
//数据回显API

const getMaterialByID = async (id) => {
    const res = await getByIdAPI(id);
    if (res.code === 1) {
        updateform.name = res.data.name
        updateform.spec = res.data.spec
        updateform.threshold = res.data.threshold
    }
};

const getMaterialOperationByBatch = async (batch) => {
    const res = await getByBatchAPI(batch);
    if (res.code === 1) {
        stockform.name = res.data.name
        stockform.spec = res.data.spec
        stockform.supplier = res.data.supplier
        stockform.supplyTime = res.data.supplyTime
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
    if (title === "batch") {
        stockform.batch = keyword
        getMaterialOperationByBatch(keyword)
    }
    updateSearchSuggestion()

}

// #endregion

//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------
//确认删除
//#region

import { ElMessage, ElMessageBox } from 'element-plus'

const del = async (id) => {
    const res = await deleteMaterialAPI(id);
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
            <h1>设备运行监测</h1>
            <!-- main -->
            <el-main style="overflow: hidden">
                <!-- search -->
                <!-- <div>
                    <SearchComponent :key="renderKey" search-title="物料名称" :searchContent=name ref="search1" field="name"
                        @search="search" @edit="edit" />
                    <SearchComponent :key="renderKey" search-title="规格型号" :searchContent=spec ref="search2" field="spec"
                        @search="search" @edit="edit" />
                    <el-button type="primary" style="margin-left: 10px; width: 7%" @click="update">
                        <Search style="width: 1em; height: 1em; margin-right: 8px" />搜索
                    </el-button>
                    <el-button style="width: 7%" @click="reset">
                        <DeleteFilled style="width: 1em; height: 1em; margin-right: 8px" />清空
                    </el-button>
                </div> -->
                <br />
                <!-- operation -->
                <!-- <div style="display: flex; justify-content: space-between">
                    <span>
                        <el-button type="primary" @click="addDialog.dialogVisible = true, dialog = true">
                            <Plus style="width: 1em; height: 1em; margin-right: 8px" />新增物料
                        </el-button>

                        <ExportButton v-model="selectedRows" :headers="headers" :tableData="tableData.value"
                            fileName="物料库存信息.xlsx" :filterFunction="filterExportData" buttonLabel="导出" />
                    </span>
                    <span>
                        <el-button
                            @click="stockInDialog.dialogVisible = true, stockform.operation = '入库', dialog = true, getDefaultDate()">入库</el-button>
                        <el-button
                            @click="stockOutDialog.dialogVisible = true, stockform.operation = '出库', dialog = true, getDefaultDate()">出库</el-button>
                        <el-button
                            @click="transferDialog.dialogVisible = true, stockform.operation = '转入不良物料库', dialog = true, getDefaultDate()">转入不良物料
                        </el-button>
                    </span>
                </div> -->
                <!-- record -->
                <!-- <div style="
            height: 4vh;
            line-height: 4vh;
            text-decoration: underline;
            color: #729fd0;
            position: relative;
            left: 95%;
            width: fit-content;
            cursor: pointer;
          ">
                    <RouterLink to="/inventory/operation">操作记录</RouterLink>
                </div> -->

                <!-- 弹框区 -->
                <!-- 新增弹框 -->
                <DialogComponent ref="addDialog" :form="addform" dialog-title="新增物料类型" :refreshFunc="getDataFromAPI"
                    :confirm-func="addMaterialAPI" @dialogClose="dialogClose">
                    <el-form-item label="物料名称" prop="name" :rules="[
                        { required: true, message: '请输入物料名称', trigger: 'blur' },
                        {
                            min: 1, max: 30,
                            message: '长度必须在1-30之间', trigger: 'blur'
                        }]">
                        <el-input v-model="addform.name" autocomplete="off" placeholder="请输入物料名称" />
                    </el-form-item>
                    <el-form-item label="规格型号" prop="spec" :rules="[
                        { required: true, message: '请输入规格型号', trigger: 'blur' },
                        {
                            min: 1, max: 30,
                            message: '长度必须在1-30之间', trigger: 'blur'
                        }]">
                        <el-input v-model="addform.spec" autocomplete="off" placeholder="请输入规格型号" />
                    </el-form-item>
                    <el-form-item label="低库存阈值" prop="threshold" :rules="[
                        { required: true, message: '请输入阈值', trigger: 'blur' },
                        { type: 'number', message: '阈值必须是数字', trigger: 'blur' }
                    ]">
                        <el-input v-model.number="addform.threshold" autocomplete="off" placeholder="请输入低库存阈值" />
                    </el-form-item>
                </DialogComponent>

                <!-- 编辑弹框 -->
                <DialogComponent ref="editDialog" :form="updateform" dialog-title="编辑物料类型" :refreshFunc="getDataFromAPI"
                    :confirm-func="updateMaterialAPI" @dialogClose="dialogClose">
                    <el-form-item label="物料名称" prop="name" :rules="[
                        { required: true, message: '请输入物料名称', trigger: 'blur' },
                        {
                            min: 1, max: 30,
                            message: '长度必须在1-30之间', trigger: 'blur'
                        }]">
                        <el-input v-model="updateform.name" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="规格型号" prop="spec" :rules="[
                        { required: true, message: '请输入规格型号', trigger: 'blur' },
                        {
                            min: 1, max: 30,
                            message: '长度必须在1-30之间', trigger: 'blur'
                        }]">
                        <el-input v-model="updateform.spec" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="低库存阈值" prop="threshold" :rules="[
                        { required: true, message: '请输入阈值', trigger: 'blur' },
                        { type: 'number', message: '阈值必须是数字', trigger: 'blur' }
                    ]">
                        <el-input v-model.number="updateform.threshold" autocomplete="off" />
                    </el-form-item>
                </DialogComponent>

                <!-- 入库弹框 -->
                <DialogComponent ref="stockInDialog" :form="stockform" dialog-title="物料入库" :refreshFunc="getDataFromAPI"
                    :confirm-func="addMaterialOperationAPI" @dialogClose="dialogClose" :image=true @saveImage=saveImage>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="物料名称" prop="name" :rules="[
                                { required: true, message: '请选择物料名称', trigger: 'blur' }]">
                                <DialogSearch :key="renderKey" :wNo="100" search-title="物料名称" :searchContent=stockform.name
                                    field="name" @search="dialogSearchSuggestion" :data="stockform" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="规格型号" prop="spec" :rules="[
                                { required: true, message: '请选择规格型号', trigger: 'blur' }]">
                                <DialogSearch :key="renderKey" :wNo="100" search-title="规格型号" :searchContent=stockform.spec
                                    field="spec" @search="dialogSearchSuggestion" :data="stockform" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="供料单位" prop="supplier" :rules="[
                        { required: true, message: '请输入供料单位', trigger: 'blur' },
                        {
                            min: 1, max: 30,
                            message: '长度必须在1-30之间', trigger: 'blur'
                        }]">
                        <SearchComponent :hide-title=true :wNo="100" :key="renderKey" search-title="供料单位"
                            :searchContent=stockform.supplier field="supplier" @search="search"
                            database="materials/operation" />
                    </el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="入库人员" prop="operator" :rules="[
                                { required: true, message: '请输入操作人员', trigger: 'blur' },
                                {
                                    min: 1, max: 30,
                                    message: '长度必须在1-30之间', trigger: 'blur'
                                }]">
                                <SearchComponent :hide-title=true :wNo="100" :key="renderKey" search-title="入库人员"
                                    :searchContent=stockform.operator field="operator" @search="search"
                                    database="materials/operation" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="入库数量" prop="amount" :rules="[
                                { required: true, message: '请输入数量', trigger: 'blur' },
                                { type: 'number', message: '必须是数字', trigger: 'blur' }
                            ]">
                                <el-input v-model.number="stockform.amount" autocomplete="off" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="入库日期" prop="operateTime" :rules="[
                                { required: true, message: '请输入供料日期', trigger: 'blur' }]">
                                <el-date-picker v-model="stockform.operateTime" type="datetime" placeholder="选择入库日期"
                                    value-format="YYYY-MM-DDTHH:mm:ss" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="供料日期" prop="supplyTime" :rules="[
                                { required: true, message: '请输入供料日期', trigger: 'blur' }]">
                                <el-date-picker v-model="stockform.supplyTime" type="datetime" placeholder="选择供料日期"
                                    value-format="YYYY-MM-DDTHH:mm:ss" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="签收凭证" prop="receipt" :rules="[
                        { required: true, message: '请上传签收凭证', trigger: 'blur' }]">
                        <UploadImage @uploadImage="uploadImage" :dialog=dialog :confirmImage=confirmImage />
                    </el-form-item>
                </DialogComponent>

                <!-- 出库弹框 -->
                <DialogComponent ref="stockOutDialog" :form="stockform" dialog-title="物料出库" :refreshFunc="getDataFromAPI"
                    :confirm-func="addMaterialOperationAPI" @dialogClose="dialogClose" :image=true @saveImage=saveImage>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="物料名称" prop="name">
                                <DialogSearch :key="renderKey" :wNo="100" search-title="物料名称" :searchContent=stockform.name
                                    field="name" @search="dialogSearchSuggestion" :data="stockform"
                                    database="materials/operation" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="规格型号" prop="spec">
                                <DialogSearch :key="renderKey" :wNo="100" search-title="规格型号" :searchContent=stockform.spec
                                    field="spec" @search="dialogSearchSuggestion" :data="stockform"
                                    database="materials/operation" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="物料批次" prop="batch" :rules="[
                        { required: true, message: '请选择物料批次', trigger: 'blur' }]">
                        <DialogSearch :key="renderKey" :wNo="100" search-title="物料批次" :searchContent=stockform.batch
                            field="batch" @search="dialogSearchSuggestion" :data="stockform"
                            database="materials/operation" />
                    </el-form-item>
                    <el-form-item label="供料单位" prop="supplier">
                        <el-input v-model="stockform.supplier" autocomplete="off" placeholder="请输入供料单位" />
                    </el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="出库人员" prop="operator" :rules="[
                                { required: true, message: '请输入操作人员', trigger: 'blur' },
                                {
                                    min: 1, max: 30,
                                    message: '长度必须在1-30之间', trigger: 'blur'
                                }]">
                                <SearchComponent :hide-title=true :wNo="100" :key="renderKey" search-title="出库人员"
                                    :searchContent=stockform.operator field="operator" @search="search"
                                    database="materials/operation" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="出库数量" prop="amount" :rules="[
                                { required: true, message: '请输入数量', trigger: 'blur' },
                                { type: 'number', message: '必须是数字', trigger: 'blur' }
                            ]">
                                <el-input v-model.number="stockform.amount" autocomplete="off" :placeholder="remains" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="出库日期" prop="operateTime" :rules="[
                                { required: true, message: '请输入供料日期', trigger: 'blur' }]">
                                <el-date-picker v-model="stockform.operateTime" type="datetime" placeholder="选择出库日期"
                                    value-format="YYYY-MM-DDTHH:mm:ss" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="供料日期" prop="supplyTime">
                                <el-input v-model="formattedTime" autocomplete="off" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="出库凭证" prop="receipt" :rules="[
                        { required: true, message: '请上传签收凭证', trigger: 'blur' }]">
                        <UploadImage @uploadImage="uploadImage" :dialog=dialog :confirmImage=confirmImage />
                    </el-form-item>
                </DialogComponent>

                <!-- 转库弹框 -->
                <DialogComponent ref="transferDialog" :form="stockform" dialog-title="转入不良物料" :refreshFunc="getDataFromAPI"
                    :confirm-func="addMaterialOperationAPI" @dialogClose="dialogClose" :image=true @saveImage=saveImage>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="物料名称" prop="name">
                                <DialogSearch :key="renderKey" :wNo="100" search-title="物料名称" :searchContent=stockform.name
                                    field="name" @search="dialogSearchSuggestion" :data="stockform"
                                    database="materials/operation" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="规格型号" prop="spec">
                                <DialogSearch :key="renderKey" :wNo="100" search-title="规格型号" :searchContent=stockform.spec
                                    field="spec" @search="dialogSearchSuggestion" :data="stockform"
                                    database="materials/operation" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="物料批次" prop="batch" :rules="[
                        { required: true, message: '请选择物料批次', trigger: 'blur' }]">
                        <DialogSearch :key="renderKey" :wNo="100" search-title="物料批次" :searchContent=stockform.batch
                            field="batch" @search="dialogSearchSuggestion" :data="stockform"
                            database="materials/operation" />
                    </el-form-item>
                    <el-form-item label="供料单位" prop="supplier">
                        <el-input v-model="stockform.supplier" autocomplete="off" placeholder="请输入供料单位" />
                    </el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="转库人员" prop="operator" :rules="[
                                { required: true, message: '请输入操作人员', trigger: 'blur' },
                                {
                                    min: 1, max: 30,
                                    message: '长度必须在1-30之间', trigger: 'blur'
                                }]">
                                <SearchComponent :hide-title=true :wNo="100" :key="renderKey" search-title="转库人员"
                                    :searchContent=stockform.operator field="operator" @search="search"
                                    database="materials/operation" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="转库数量" prop="amount" :rules="[
                                { required: true, message: '请输入数量', trigger: 'blur' },
                                { type: 'number', message: '必须是数字', trigger: 'blur' }
                            ]">
                                <el-input v-model.number="stockform.amount" autocomplete="off" :placeholder="remains" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="转库日期" prop="operateTime" :rules="[
                                { required: true, message: '请输入供料日期', trigger: 'blur' }]">
                                <el-date-picker v-model="stockform.operateTime" type="datetime" placeholder="选择转库日期"
                                    value-format="YYYY-MM-DDTHH:mm:ss" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="供料日期" prop="supplyTime">
                                <el-input v-model="formattedTime" autocomplete="off" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="转库凭证" prop="receipt" :rules="[
                        { required: true, message: '请上传签收凭证', trigger: 'blur' }]">
                        <UploadImage @uploadImage="uploadImage" :dialog=dialog :confirmImage=confirmImage />
                    </el-form-item>
                </DialogComponent>


                <!-- table -->
                <!-- <el-table :data="tableData.value" @selection-change="handleSelectionChange"
                    style="width: 100%; border-radius: 1vh" table-layout="fixed" height="48vh" show-overflow-tooltip>
                    <el-table-column type="selection" align="center" />
                    <el-table-column label="序号" type="index" align="center" min-width="70vh" />
                    <el-table-column prop="name" label="物料名称" align="center" />
                    <el-table-column prop="spec" label="规格型号" align="center" />
                    <el-table-column prop="amount" label="库存数量" align="center" />
                    <el-table-column prop="threshold" label="低库存阈值" align="center" />
                    <el-table-column prop="operation" label="操作" align="center">
                        <template #default="scope">
                            <el-button class="inline_button"
                                @click="getMaterialByID(scope.row.id), editDialog.dialogVisible = true, dialog = true, updateform.id = scope.row.id">
                                编辑
                            </el-button>
                            <el-button class="inline_button" @click="deleteConfirm(scope.row.id)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>

                </el-table> -->

                <!-- 描述每种颜色对应的设备状态的说明部分 -->
                <div class="status-description">
                    <span class="status-item1">
                        正常运行
                    </span>
                    <span class="status-item2">
                        检修维护
                    </span>
                    <span class="status-item3">
                        报警
                    </span>
                    <!-- <span class="status-item4">
                        停机
                    </span> -->
                </div>

                <!-- 用于显示所有工作站的容器 -->
                <div class="workstations">

                    <!-- 使用v-for指令来遍历工作站数组并为每个工作站创建一个工作站元素，元素的key是工作站的名字 -->
                    <div class="workstation" v-for="workstation in tableData.value" :key="workstation.name">

                        <!-- 显示工作站的名称 -->
                        <div class="workstation-header">{{ workstation.name }}</div>
                        <ul>
                            <!-- 再次使用v-for指令来遍历工作站的组件数组，为每个组件创建一个列表元素，元素的key是组件的名字，类名是组件的状态，
                         这可以用来通过CSS改变不同状态的组件的颜色 -->
                            <li v-for="component in workstation.components" :key="component.name" :class="component.status">
                                <!-- 显示组件的名称 -->
                                {{ component.name }}
                            </li>
                        </ul>
                    </div>
                </div>
            </el-main>
            <!-- pagination -->
            <el-footer style="display: flex; justify-content: center">
                <!-- <PaginationComponent :total="total" @size="size" @cur="cur" /> -->
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

.workstation-header {
    color: #333;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    font-weight: bold;
    position: sticky;
    /*使元素有粘性，可以固定在一个位置*/
    top: 0;
    /*固定在顶部，即滚动到哪都会保持在顶部*/
    background: white;
    /*提供背景，以避免其他内容在其下方滚动时显示出来*/
    z-index: 1;
    /*提高堆叠顺序，以避免其他内容覆盖其上*/
    padding-top: 25px;
    margin-top: -25px;
}

.workstations {
    display: flex;
    justify-content: center;
    padding: 0 0%;
    margin-top: 25px;

}

.workstation {
    background-color: white;
    border-radius: 1vh;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 0 25px 25px;
    width: 20%;
    text-align: left;
    margin: 0 30px;
    height: calc(100vh - 450px);
    overflow-y: auto;

    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE 10+ */
}

.workstation::-webkit-scrollbar {
    display: none;
}

.workstation h2,
.workstation ul {
    /* margin-left: 5px; */
    /* 调整左边距实现左对齐 */
}

.workstation ul {
    padding-left: 0;
    /* 移除默认的左边距 */
    list-style-type: none;
    /* 移除默认的列表样式 */
    margin-top: 40px;
}

.workstation li {
    /* margin: 1vh 0; */
    /* 增加垂直边距 */
    padding: 5px;
    /* 增加内边距 */
    position: relative;
}

.normal {
    color: black;
}

.stopped {
    color: black;
}

.maintenance {
    color: black;
}

.alarm {
    color: black;
}

.normal::after {
    content: "";
    position: absolute;
    width: 15px;
    height: 15px;
    background-color: #339a528b;
    border-radius: 50%;
    right: 3vh;
    top: 50%;
    transform: translateY(-50%);
}

.stopped::after {
    content: "";
    position: absolute;
    width: 15px;
    height: 15px;
    background-color: grey;
    border-radius: 50%;
    right: 3vh;
    top: 50%;
    transform: translateY(-50%);
}

.maintenance::after {
    content: "";
    position: absolute;
    width: 15px;
    height: 15px;
    background-color: #ff9a02a0;
    border-radius: 50%;
    right: 3vh;
    top: 50%;
    transform: translateY(-50%);
}

.alarm::after {
    content: "";
    position: absolute;
    width: 15px;
    height: 15px;
    background-color: #e26237ab;
    border-radius: 50%;
    right: 3vh;
    top: 50%;
    transform: translateY(-50%);
}

.status-description {
    display: flex;
    width: 20%;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
}


.status-item1::before {
    display: inline-block;
    content: "";
    position: relative;
    width: 12px;
    height: 12px;
    background-color: #339a528b;
    border-radius: 50%;
    /* right: 3vh; */
    top: 50%;
    /* transform: translateY(-50%); */
}

.status-item2::before {
    display: inline-block;
    content: "";
    position: relative;
    width: 12px;
    height: 12px;
    background-color: #ff9a02a0;
    border-radius: 50%;
    /* right: 3vh; */
    top: 50%;
    /* transform: translateY(-50%); */
}

.status-item3::before {
    display: inline-block;
    content: "";
    position: relative;
    width: 12px;
    height: 12px;
    background-color: #e26237ab;
    border-radius: 50%;
    /* right: 3vh; */
    top: 50%;
    /* transform: translateY(-50%); */
}

.status-item4::before {
    display: inline-block;
    content: "";
    position: relative;
    width: 12px;
    height: 12px;
    background-color: grey;
    border-radius: 50%;
    /* right: 3vh; */
    top: 50%;
    /* transform: translateY(-50%); */
}
</style>

