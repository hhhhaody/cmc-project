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
import { addFacilityAPI, getFacilityAPI, deleteFacilityAPI, updateFacilityAPI, updateFacilityStatusAPI, updateFacilityDailyStatusAPI } from "../apis/facility";
import ExportButton from "@/components/ExportButton.vue";
import { getMaintenancePlanAPI, addMaintenancePlanAPI, getByIdAPI, updateMaintenancePlanAPI, updateMaintenancePlanStatusAPI } from "../apis/maintenance"
import { useUserStore } from '../stores/store.js';
const userStore = useUserStore();


// 从后端获取数据
const tableData = reactive([]);
const total = ref(0)
const getDataFromAPI = async () => {
  const res = await getMaintenancePlanAPI(currentPage.value, pageSize.value, name.value, spec.value, section.value, status.value, maintenanceman.value, null);
  console.log(res.data);
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
  { key: 'id', title: '序号' },
  { key: 'serialNo', title: '设备编号' },
  { key: 'name', title: '设备名称' },
  { key: 'spec', title: '规格型号' },
  { key: 'station', title: '工位名称' },
  { key: 'section', title: '工段名称' },
  { key: 'type', title: '维护类型' },
  { key: 'plannedTime', title: '计划完成维护日期' },
  { key: 'completeTime', title: '实际完成维护日期' },
  { key: 'maintenanceman', title: '维护人员' },
  { key: 'info', title: '维护内容' },
  { key: 'status', title: '维护状态' },
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
const search4 = ref();
const search5 = ref();
const name = ref("")
const spec = ref("")
const section = ref("")
const status = ref("")
const maintenanceman = ref("")
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
  if (title === "section") section.value = keyword
  if (title === "status") status.value = keyword
  if (title === "maintenanceman") maintenanceman.value = keyword


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
  section.value = "";
  status.value = "";
  maintenanceman.value = "";
  search1.value.searchContent = "";
  search2.value.searchContent = "";
  search3.value.searchContent = "";
  search4.value.searchContent = "";
  search5.value.searchContent = "";
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
const dailyDialog = ref(false)
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
    status: '',
    serialNo: '',
    type: '',
    plannedTime: '',
    completeTime: '',
    maintenanceman: '',
    info: '',
    updateTime: ''
  })

const dailyList = ref([
])

const dailyClose = () => {
  dailyList.value = []
  dailyDialog.value = false
}

const dailyConfirm = async () => {
  for (const obj of dailyList.value) {
    if (obj.maintenanceman && obj.info) {
      const res = await updateFacilityDailyStatusAPI(obj.serialNo)
    }
  }
}

const getDailyPlan = async () => {
  const res = await getFacilityAPI(currentPage.value, 99999, '', '', '', '', '', true);
  console.log(res.data);


  for (const obj of res.data.data) {
    const today = new Date();
    const prevDailyTime = new Date(obj.prevDailyTime);
    if (!obj.prevDailyTime || !isSameDay(today, prevDailyTime)) {
      dailyList.value.push(obj);
    }
  }

  // console.log(dailyList);
}

function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

watch(
  stockform,
  (newVal, oldVal) => {
    formattedTime.value = stockform.plannedTime.substring(0, 10)
    // console.log(stockform)
  },
  { deep: true } // Enable deep monitoring
);


//编辑相关
//数据回显API

const getMaintenancePlanByID = async (id) => {
  const res = await getByIdAPI(id);
  if (res.code === 1) {
    console.log(res.data);
    stockform.name = res.data.name
    stockform.spec = res.data.spec
    stockform.type = res.data.type
    stockform.station = res.data.station
    stockform.section = res.data.section
    stockform.plannedTime = res.data.plannedTime
    stockform.serialNo = res.data.serialNo
    stockform.status = res.data.status
    stockform.info = res.data.info
    stockform.completeTime = res.data.completeTime
    stockform.maintenanceman = res.data.maintenanceman
    stockform.updateTime = res.data.updateTime
    updateSearchSuggestion()
    console.log(stockform);
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

import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

const del = async (id) => {
  const res = await deleteFacilityAPI(id);
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

// 检修维护系统提示

const maintenance = async (id) => {
  const res = await updateMaintenancePlanStatusAPI(id);
  if (res.code === 1) {
    console.log(res);
    if (res.data != '更新成功') {
      ElNotification({
        title: '失败',
        message: res.data,
        duration: 3000,
        type: "error"
      })
    }

    dialogVisible.value = false
    props.refreshFunc()
  }
  // console.log(res);
};



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
      <h1>设备维护信息</h1>
      <!-- main -->
      <el-main style="overflow: hidden">
        <!-- search -->
        <div>
          <SearchComponent :key="renderKey" search-title="工段名称" :searchContent=section ref="search3" field="section"
            @search="search" @edit="edit" database="maintenance" :wNo=10 />
          <SearchComponent :key="renderKey" search-title="设备名称" :searchContent=name ref="search1" field="name"
            @search="search" @edit="edit" database="maintenance" :wNo=10 />
          <SearchComponent :key="renderKey" search-title="规格型号" :searchContent=spec ref="search2" field="spec"
            @search="search" @edit="edit" database="maintenance" :wNo=10 />
          <SearchComponent :key="renderKey" search-title="维护状态" :searchContent=status ref="search4" field="status"
            @search="search" @edit="edit" database="maintenance" :wNo=10 />
          <SearchComponent :key="renderKey" search-title="维护人员" :searchContent=maintenanceman ref="search5"
            field="maintenanceman" @search="search" @edit="edit" database="maintenance" :wNo=10 />
          <el-button type="primary" style="margin-left: 10px; width: 7%" @click="update">
            <Search style="width: 1em; height: 1em; margin-right: 8px" />搜索
          </el-button>
          <el-button style="width: 7%" @click="reset">
            <DeleteFilled style="width: 1em; height: 1em; margin-right: 8px" />清空
          </el-button>
        </div>
        <br />
        <!-- operation -->
        <div style="display: flex; justify-content: space-between">
          <span>
            <el-button v-if="!userStore.isReadOnly" type="primary" @click="addDialog.dialogVisible = true, dialog = true">
              <Plus style="width: 1em; height: 1em; margin-right: 8px" />新增
            </el-button>

            <ExportButton v-if="!userStore.isReadOnly" v-model="selectedRows" :headers="headers"
              :tableData="tableData.value" fileName="设备维护信息.xlsx" :filterFunction="filterExportData" buttonLabel="导出" />
          </span>
          <span>

            <!-- <el-button @click="dailyDialog = true, dialog = true, getDefaultDate(), getDailyPlan()">日常保养</el-button> -->
            <el-button>
              <RouterLink to="/maintenancePlan/daily">日常保养</RouterLink>
            </el-button>
            <!-- <el-button
              @click="stockOutDialog.dialogVisible = true, stockform.operation = '出库', dialog = true, getDefaultDate()">出库</el-button>
            <el-button
              @click="transferDialog.dialogVisible = true, stockform.operation = '转入不良物料库', dialog = true, getDefaultDate()">转入不良物料
            </el-button> -->
          </span>
        </div>
        <!-- record -->
        <div style="
            height: 4vh;
            line-height: 4vh;
            text-decoration: underline;
            color: #729fd0;
            position: relative;
            left: 97%;
            width: fit-content;
            cursor: pointer;
          ">
          <RouterLink to="/maintenancePlan">日历</RouterLink>
        </div>

        <!-- 弹框区 -->
        <!-- 新增弹框 -->
        <DialogComponent ref="addDialog" :form="stockform" dialog-title="新增设备维护计划" :refreshFunc="getDataFromAPI"
          :confirm-func="addMaintenancePlanAPI" @dialogClose="dialogClose" :image=true @saveImage=saveImage>
          <el-row>
            <el-col :span="12">
              <el-form-item label="设备名称" prop="name" :rules="[
                { required: true, message: '请选择设备名称', trigger: 'blur' }]">
                <DialogSearch :key="renderKey" :wNo="100" search-title="设备名称" :searchContent=stockform.name field="name"
                  @search="dialogSearchSuggestion" :data="stockform" database="facilities" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="规格型号" prop="spec" :rules="[
                { required: true, message: '请选择规格型号', trigger: 'blur' }]">
                <DialogSearch :key="renderKey" :wNo="100" search-title="规格型号" :searchContent=stockform.spec field="spec"
                  @search="dialogSearchSuggestion" :data="stockform" database="facilities" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="工段名称" prop="section" :rules="[
                { required: true, message: '请选择工段名称', trigger: 'blur' }]">
                <DialogSearch :key="renderKey" :wNo="100" search-title="工段名称" :searchContent=stockform.section
                  field="section" @search="dialogSearchSuggestion" :data="stockform" database="facilities" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备编号" prop="serialNo" :rules="[
                { required: true, message: '请选择设备编号', trigger: 'blur' }]">
                <DialogSearch :key="renderKey" :wNo="100" search-title="设备编号" :searchContent=stockform.serialNo
                  field="serialNo" @search="dialogSearchSuggestion" :data="stockform" database="facilities" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span=12>
              <el-form-item label="维护类型" prop="type" :rules="[
                { required: true, message: '请选择维修类型', trigger: 'blur' }]">
                <el-radio-group v-model="stockform.type">
                  <el-radio-button label="临时保养" />
                  <el-radio-button label="一级保养" />
                  <el-radio-button label="二级保养" />
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划完成时间" prop="plannedTime" :rules="[
                { required: true, message: '请输入计划完成维护时间', trigger: 'blur' }]">
                <el-date-picker v-model="stockform.plannedTime" type="datetime" placeholder="选择计划完成维护时间"
                  value-format="YYYY-MM-DDTHH:mm:ss" />
              </el-form-item>
            </el-col>
          </el-row>
        </DialogComponent>


        <!-- 编辑弹框 -->
        <DialogComponent ref="editDialog" :form="stockform" dialog-title="编辑维护计划记录" :refreshFunc="getDataFromAPI"
          :confirm-func="updateMaintenancePlanAPI" @dialogClose="dialogClose" :image=true @saveImage=saveImage>
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
            <el-col :span=12>
              <el-form-item label="维护类型" prop="type">
                <el-input v-model="stockform.type" autocomplete="off" placeholder="请填写维护类型" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划完成日期" prop="plannedTime">
                <el-date-picker v-model="stockform.plannedTime" type="datetime" placeholder="选择计划完成维护日期"
                  value-format="YYYY-MM-DDTHH:mm:ss" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="维护人员" prop="maintenanceman" :rules="[
                { required: true, message: '请输入维护人员', trigger: 'blur' },
                {
                  min: 1, max: 30,
                  message: '长度必须在1-30之间', trigger: 'blur'
                }]">
                <el-input v-model="stockform.maintenanceman" autocomplete="off" placeholder="请输入维护人员" />

              </el-form-item>
            </el-col>
            <el-col :span=12>
              <el-form-item label="完成维护时间" prop="completeTime" :rules="[
                { required: true, message: '请输入完成维护时间', trigger: 'blur' }]">
                <el-date-picker v-model="stockform.completeTime" type="datetime" placeholder="选择完成维护时间"
                  value-format="YYYY-MM-DDTHH:mm:ss" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="维护内容" prop="info" :rules="[
            { required: true, message: '请填写维护内容', trigger: 'blur' }]">
            <el-input v-model="stockform.info" autocomplete="off" placeholder="请填写维护内容" />
          </el-form-item>
        </DialogComponent>

        <!-- 日常弹框 -->
        <el-dialog v-model="dailyDialog" title="日常保养" align-center destroy-on-close :before-close="dailyClose">
          <!-- <el-card v-for="(item, index) in    dailyList   ">
            <el-form :model="item" @submit.prevent label-position=right>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="设备名称" prop="name">
                    <el-input v-model="item.name" autocomplete="off" disabled style="margin-right:1vh" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="规格型号" prop="spec">
                    <el-input v-model="item.spec" autocomplete="off" disabled style="margin-right:1vh" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="工段名称" prop="section">
                    <el-input v-model="item.section" autocomplete="off" disabled style="margin-right:1vh" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备编号" prop="serialNo">
                    <el-input v-model="item.serialNo" autocomplete="off" disabled style="margin-right:1vh" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span=12>
                  <el-form-item label="维护人员" prop="maintenanceman">
                    <el-input v-model="item.maintenanceman" autocomplete="off" placeholder="请输入维护人员"
                      style="margin-right:1vh" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="上次维护日期" prop="prevDailyTime">
                    <el-date-picker v-model="item.prevDailyTime" type="datetime" value-format="YYYY-MM-DDTHH:mm:ss"
                      disabled style="margin-right:1vh" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="维护内容" prop="info">
                <el-input v-model="item.info" autocomplete="off" placeholder="请填写维护内容" style="margin-right:1vh" />
              </el-form-item>
            </el-form>
          </el-card> -->

          <el-table :data="dailyList.value" style="width: 100%; border-radius: 1vh" table-layout="fixed" height="48vh"
            show-overflow-tooltip>
            <el-table-column type="selection" align="center" min-width="20vh" />
            <el-table-column label="序号" type="index" align="center" min-width="50vh" />
            <el-table-column prop="serialNo" label="设备编号" align="center" />
            <el-table-column prop="name" label="设备名称" align="center" />
            <el-table-column prop="spec" label="规格型号" align="center" />
            <el-table-column prop="station" label="工位名称" align="center" />
            <el-table-column prop="section" label="工段名称" align="center" />
            <el-table-column prop="type" label="维护类型" align="center" />
            <el-table-column prop="plannedTime" label="计划完成日期" align="center" min-width="100vh">
              <template #default="scope">
                {{ scope.row.plannedTime.substring(0, 10) }}
              </template>
            </el-table-column>
            <!-- <el-table-column prop="completeTime" label="实际完成日期" align="center" min-width="100vh">
            <template #default="scope">
              {{ scope.row.completeTime ? scope.row.completeTime.substring(0, 10) : '' }}
            </template>
          </el-table-column>
          <el-table-column prop="maintenanceman" label="维护人员" align="center" />
          <el-table-column prop="info" label="维护内容" align="center" /> -->
            <el-table-column prop="status" label="维护状态" align="center" />
            <el-table-column prop="operation" label="操作" align="center" min-width="110vh">
              <template #default="scope">
                <el-button v-if="!scope.row.ongoing" class=" inline_button" style="color:#ff9a02a0"
                  @click="maintenance(scope.row.id), getDataFromAPI()">
                  检修维护
                </el-button>
                <el-button v-else class="inline_button"
                  @click="getMaintenancePlanByID(scope.row.id), editDialog.dialogVisible = true, dialog = true, stockform.id = scope.row.id">
                  编辑
                </el-button>
                <el-button class="inline_button">
                  <RouterLink :to="{ name: 'maintenancePlanDetail', query: { id: scope.row.id } }">详情
                  </RouterLink>
                </el-button>
              </template>
            </el-table-column>

          </el-table>

          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dailyClose()">取消</el-button>
              <el-button type="primary" @click="dailyConfirm(), dailyClose()">
                确定
              </el-button>
            </span>
          </template>
        </el-dialog>



        <!-- table -->
        <el-table :data="tableData.value" @selection-change="handleSelectionChange"
          style="width: 100%; border-radius: 1vh" table-layout="fixed" height="48vh" show-overflow-tooltip>
          <el-table-column type="selection" align="center" min-width="20vh" />
          <el-table-column label="序号" type="index" align="center" min-width="50vh" />
          <el-table-column prop="serialNo" label="设备编号" align="center" />
          <el-table-column prop="name" label="设备名称" align="center" />
          <el-table-column prop="spec" label="规格型号" align="center" />
          <el-table-column prop="station" label="工位名称" align="center" />
          <el-table-column prop="section" label="工段名称" align="center" />
          <el-table-column prop="type" label="维护类型" align="center" />
          <el-table-column prop="plannedTime" label="计划完成日期" align="center" min-width="100vh">
            <template #default="scope">
              {{ scope.row.plannedTime.substring(0, 10) }}
            </template>
          </el-table-column>
          <!-- <el-table-column prop="completeTime" label="实际完成日期" align="center" min-width="100vh">
            <template #default="scope">
              {{ scope.row.completeTime ? scope.row.completeTime.substring(0, 10) : '' }}
            </template>
          </el-table-column>
          <el-table-column prop="maintenanceman" label="维护人员" align="center" />
          <el-table-column prop="info" label="维护内容" align="center" /> -->
          <el-table-column prop="status" label="维护状态" align="center" />
          <el-table-column prop="operation" label="操作" align="center" min-width="110vh">
            <template #default="scope">
              <!--修改代码-->
              <!-- 检修维护按钮，仅在 !scope.row.ongoing 且用户不是只读角色时显示 -->
              <el-button v-if="!scope.row.ongoing && !userStore.isReadOnly" class="inline_button" style="color:#ff9a02a0"
                @click="maintenance(scope.row.id), getDataFromAPI()">
                检修维护
              </el-button>
              <!-- 编辑按钮，仅在 scope.row.ongoing 且用户不是只读角色时显示 -->
              <el-button v-if="scope.row.ongoing && !userStore.isReadOnly" class="inline_button"
                @click="getMaintenancePlanByID(scope.row.id), editDialog.dialogVisible = true, dialog = true, stockform.id = scope.row.id">
                编辑
              </el-button>

              <!--原始代码-->
              <!-- <el-button v-if="!scope.row.ongoing" class=" inline_button" style="color:#ff9a02a0"
                @click="maintenance(scope.row.id), getDataFromAPI()">
                检修维护
              </el-button>
              <el-button v-else class="inline_button"
                @click="getMaintenancePlanByID(scope.row.id), editDialog.dialogVisible = true, dialog = true, stockform.id = scope.row.id">
                编辑
              </el-button> -->
              <el-button class="inline_button">
                <RouterLink :to="{ name: 'maintenancePlanDetail', query: { id: scope.row.id } }">详情
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

:deep .el-select {
  padding-left: 2vh !important
}

:deep .el-switch {
  padding-left: 2vh !important
}

.el-card {
  margin-bottom: 2vh;
  border-radius: 1vh;
  padding: 1vh
}

:deep ::-webkit-scrollbar {
  display: none !important;
}
</style>

