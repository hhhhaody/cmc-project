<script setup>
import { ref, onMounted, reactive, onUnmounted, watch } from "vue";
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import SearchComponent from "../components/SearchComponent.vue";
import PaginationComponent from "../components/PaginationComponent.vue";
import DialogComponent from "../components/DialogComponent.vue";
import { getMaterialOperationAPI, getMaterialOperationByIdAPI, deleteMaterialOperationAPI } from "../apis/material";

const tableData = [
  {
    numbering: "HJ50-001",
    section: "型钢切割工作站",
    station: "桁架",
    name: "桁架设备",
    spec: "KJ264C-B0",
    faultContent: "冷水机滤芯更换",
    faultTime: "2023-08-20 15:45:2",
    finishTime: "2023-08-20",
    personnel: "靳程锐",
    repairContent: "更换配件",
  },
];

const tableShown = reactive([]);

// 从后端获取数据
// const tableData = reactive([]);
const total = ref(0)
const getDataFromAPI = async () => {
    // const res = await getMaterialOperationAPI(currentPage.value, pageSize.value, operation.value, name.value, spec.value, time.value[0], time.value[1], supplier.value, operator.value);
    // console.log(res.data);
    tableData.value = res.data.data;
    total.value = res.data.total
    updateSearchSuggestion()

};
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
    operation.value = "";
    name.value = "";
    spec.value = "";
    time.value = "";
    supplier.value = "";
    operator.value = "";
    search1.value.searchContent = "";
    search2.value.searchContent = "";
    search3.value.searchContent = "";

    if (show.value) {
        search5.value.searchContent = "";
        search6.value.searchContent = "";
    }

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
const addDialog = ref()
const editDialog = ref()

const dialogClose = () => {
    dialog.value = false
}

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
        // console.log('uidToFileNameMap changed:');
        // console.log('New uidToFileNameMap:', newMap);

        // You can perform actions here based on the changes in the uidToFileNameMap
        formattedTime.value = updateform.operateTime.substring(0, 10) + ' ' + updateform.operateTime.substring(11,)
    },
    { deep: true } // Enable deep monitoring
);

//编辑相关
//数据回显API

const getMaterialOperationByID = async (id) => {
    const res = await getMaterialOperationByIdAPI(id);
    console.log(res.data);
    if (res.code === 1) {
        updateform.name = res.data.name
        updateform.spec = res.data.spec
        updateform.operation = res.data.operation
        updateform.batch = res.data.batch
        updateform.amount = res.data.amount
        updateform.supplier = res.data.supplier
        updateform.supplyTime = res.data.supplyTime
        updateform.operateTime = res.data.operateTime
        updateform.operator = res.data.operator
        updateform.receipt = res.data.receipt
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
    if (res.code === 1) getDataFromAPI();
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
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
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


const small = ref(false);
const background = ref(true);
const disabled = ref(false);

const handleSizeChange = (val) => {
  // console.log(`${val} items per page`);
  pageSize.value = val;
  tableShown.value = tableData.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  );
};
const handleCurrentChange = (val) => {
  // console.log(`current page: ${val}`);
  currentPage.value = val;
  tableShown.value = tableData.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  );
};

// const selectable = () => {};

onMounted(() => {
  //   sections.value = loadAllSection();
  //   models.value = loadAllModel();
  //   devices.value = loadAllDevice();
  //   suppliers.value = loadAllSupplier();
  tableShown.value = tableData.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  );
});
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
                    <SearchComponent :key="renderKey" search-title="工段名称" :searchContent=operation ref="search1"
                        field="operation" database="materials/operation" @search="search" @edit="edit" />
                    <SearchComponent :key="renderKey" search-title="设备名称" :searchContent=name ref="search2" field="name"
                        @search="search" database="materials/operation" @edit="edit" />
                    <SearchComponent :key="renderKey" search-title="规格型号" :searchContent=spec ref="search3" field="spec"
                        @search="search" database="materials/operation" @edit="edit" />
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
                <div style="margin-top: 1vh" v-if="show">
                    <div style="display: inline-block; position: relative;top: 2px; padding-right: 2vh;">完成维修日期：
                        <el-date-picker v-model="time" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"
                            :default-time="defaultTime1" value-format="YYYY-MM-DDTHH:mm:ss" />
                    </div>
                    <SearchComponent :key="renderKey" search-title="维修状态" :searchContent=supplier ref="search5"
                        field="supplier" database="materials/operation" @search="search" @edit="edit" />
                    <SearchComponent :key="renderKey" search-title="维修人员" :searchContent=operator ref="search6"
                        field="operator" database="materials/operation" @search="search" @edit="edit" />
                </div>
                <br />
                <!-- operation -->
                <div style="display: flex; justify-content: space-between">
                    <span>
                        <el-button type="primary" @click="addDialog.dialogVisible = true, dialog = true">
                            <Plus style="width: 1em; height: 1em; margin-right: 8px" />新增
                        </el-button>

                        <el-button type="primary">
                            <Download style="width: 1em; height: 1em; margin-right: 8px" />导出
                        </el-button>
                    </span>
                </div>
                <div style="
            height: 2vh;
            line-height: 2vh;
          ">
                </div>
                <!-- 弹框区 -->

                <!-- 编辑弹框 -->
                <DialogComponent ref="editDialog" :form="updateform" dialog-title="操作记录编辑" :refreshFunc="getDataFromAPI"
                    :confirm-func="addMaterialOperationAPI" @dialogClose="dialogClose" :image=true @saveImage=saveImage>
                    <el-form-item label="操作" prop="operation">
                        <el-input v-model="updateform.operation" autocomplete="off" disabled />
                    </el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="物料名称" prop="name">
                                <el-input v-model="updateform.name" autocomplete="off" disabled />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="规格型号" prop="spec">
                                <el-input v-model="updateform.spec" autocomplete="off" disabled />

                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="物料批次" prop="batch">
                        <el-input v-model="updateform.batch" autocomplete="off" disabled />
                    </el-form-item>
                    <el-form-item label="供料单位" prop="supplier" :rules="[
                        { required: true, message: '请输入供料单位', trigger: 'blur' },
                        {
                            min: 1, max: 30,
                            message: '长度必须在1-30之间', trigger: 'blur'
                        }]">
                        <el-input v-model="updateform.supplier" autocomplete="off" />
                    </el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="出库人员" prop="operator" :rules="[
                                { required: true, message: '请输入操作人员', trigger: 'blur' },
                                {
                                    min: 1, max: 30,
                                    message: '长度必须在1-30之间', trigger: 'blur'
                                }]">
                                <el-input v-model="updateform.operator" autocomplete="off" />

                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="出库数量" prop="amount" :rules="[
                                { required: true, message: '请输入数量', trigger: 'blur' },
                                { type: 'number', message: '必须是数字', trigger: 'blur' }
                            ]">
                                <el-input v-model.number="updateform.amount" autocomplete="off" :placeholder="remains" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="操作日期" prop="operateTime">
                                <el-input v-model="formattedTime" autocomplete="off" disabled />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="供料日期" prop="supplyTime" :rules="[
                                { required: true, message: '请输入供料日期', trigger: 'blur' }]">
                                <el-date-picker v-model="updateform.supplyTime" type="datetime" placeholder="选择供料日期"
                                    value-format="YYYY-MM-DDTHH:mm:ss" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="出库凭证" prop="receipt" :rules="[
                        { required: true, message: '请上传签收凭证', trigger: 'blur' }]">
                        <UploadImage @uploadImage="uploadImage" :dialog=dialog :confirmImage=confirmImage />
                    </el-form-item>
                </DialogComponent>



                <!-- table -->
                <el-table :data="tableShown.value" style="width: 100%; border-radius: 1vh" table-layout="fixed"
                    show-overflow-tooltip height="48vh">
                    <el-table-column type="selection" align="center" min-width="20vh" />
                    <el-table-column label="序号" type="index" align="center" min-width="40vh" />
                    <el-table-column prop="numbering" label="设备编号" align="center" />
                    <el-table-column prop="section" label="工段名称" align="center" />
                    <el-table-column prop="station" label="工位名称" align="center" />
                    <el-table-column prop="name" label="设备名称" align="center" />
                    <el-table-column prop="spec" label="规格型号" align="center" />
                    <el-table-column prop="faultContent" label="故障内容" align="center" />
                    <el-table-column prop="faultTime" label="故障时间" align="center">
                        <!-- <template #default="scope">
                            {{ scope.row.operateTime.substring(0, 10) }}
                        </template> -->
                    </el-table-column>
                    <el-table-column prop="finishTime" label="完成维修日期" align="center" />
                    <el-table-column prop="personnel" label="维修人员" align="center" />
                    <el-table-column prop="repairContent" label="维修内容" align="center" />
                    <el-table-column prop="operation1" label="操作" align="center">
                        <template #default="scope">
                            <el-button class="inline_button"
                                @click="getMaterialOperationByID(scope.row.id), editDialog.dialogVisible = true, dialog = true, updateform.id = scope.row.id">
                                上报
                            </el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </el-main>
            <!-- pagination -->
            <el-footer style="display: flex; justify-content: center">
              <div class="demo-pagination-block">
                <el-pagination class="el_total-color" v-model:current-page="currentPage" v-model:page-size="pageSize"
                  :page-sizes="[10, 20, 50, 100]" :small="small" :disabled="disabled" :background="background"
                  layout="total, sizes, prev, pager, next, jumper" :total="tableData.length" @size-change="handleSizeChange"
                  @current-change="handleCurrentChange" />
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

:deep .el-date-editor {
    height: 33px !important;
}
</style>

