<script setup>
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import MaintenanceForm from "../components/MaintenanceForm.vue";

const currentDate = ref(new Date());
const currentMonth = computed(() => currentDate.value.getMonth());
const selectedDate = ref(new Date());
const showContainer = ref(false);

function handleFormConfirm() {
  // 这里您可以添加当表单确定按钮点击时的处理逻辑
  showContainer.value = false;
}

// 根据用户的点击，更新月份
function addMonth(monthsToAdd) {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() + monthsToAdd);
  currentDate.value = newDate;
}

// 根据用户的点击，更新年份
function addYear(yearsToAdd) {
  const newDate = new Date(currentDate.value);
  newDate.setFullYear(newDate.getFullYear() + yearsToAdd);
  currentDate.value = newDate;
}

// 根据用户的点击，跳转当日
function goToToday() {
  currentDate.value = new Date();
}

import { ref, onMounted, reactive, onUnmounted, watch, computed } from "vue";
import { RouterLink } from "vue-router";
import { format } from "date-fns"
import SearchComponent from "../components/SearchComponent.vue";
import DialogSearch from "../components/DialogSearch.vue";
import PaginationComponent from "../components/PaginationComponent.vue";
import DialogComponent from "../components/DialogComponent.vue";
import UploadImage from "../components/UploadImage.vue";
import { getMaterialAPI, addMaterialAPI, updateMaterialAPI, deleteMaterialAPI, addMaterialOperationAPI, getByBatchAPI } from "../apis/material";
import { addFacilityAPI, getFacilityAPI, deleteFacilityAPI, updateFacilityAPI, updateFacilityStatusAPI, updateFacilityDailyStatusAPI } from "../apis/facility";
import ExportButton from "@/components/ExportButton.vue";
import { getMaintenancePlanAPI, addMaintenancePlanAPI, getByIdAPI, updateMaintenancePlanAPI, updateMaintenancePlanStatusAPI } from "../apis/maintenance"

//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------


// 从后端获取数据
const tableData = reactive([]);
const total = ref(0)
const getDataFromAPI = async () => {
  const res = await getMaintenancePlanAPI(currentPage.value, pageSize.value, name.value, spec.value, section.value, status.value, maintenanceman.value, null);
  console.log(res.data);
  tableData.value = res.data.data;
  console.log(tableData.value);

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
  })

const dailyList = ref([
])

const todayList = ref([])

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

const getTodayPlan = async (day) => {
  todayList.value = []
  const res = await getMaintenancePlanAPI(currentPage.value, 9999, '', '', '', '', '', new Date(day));
  console.log(res.data);
  for (const obj of res.data.data) {
    todayList.value.push(obj);
  }
};

getTodayPlan(Date.now())

const getDailyPlan = async () => {
  const res = await getFacilityAPI(currentPage.value, 99999, '', '', '', '', '', true);
  // console.log(res.data);


  for (const obj of res.data.data) {
    const today = new Date();
    const prevDailyTime = new Date(obj.prevDailyTime);
    if (!obj.prevDailyTime || !isSameDay(today, prevDailyTime)) {
      dailyList.value.push(obj);
    }
  }
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

import { ElMessage, ElMessageBox } from 'element-plus'

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
//定时器 实时刷新数据相关
//#region

const timer = ref()

const startTimer = () => {
  //创建定时器来实时更新数据
  timer.value = setInterval(() => {
    console.log("实时刷新中");
    //FIXME: 调试时修改此处
    getDataFromAPI()
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

const dealMyDate = (v) => {

  for (const index in tableData.value) {
    const item = tableData.value[index];
    if (item.plannedTime.substring(0, 10) == v) {
      return item.name + "-" + item.type + "-" + item.status
    }
  }
}

</script>

<template>
  <dv-border-box1 ref="borderRef" class="subNavPage animate__animated animate__zoomIn" :color="['#4f698794', '#4f698794']"
    background-color="#3545659e">
    <br />
    <h1 style="font-size:21px">设备维护计划</h1>
    <div style="display: flex; justify-content: space-between;margin-left:5vh;width:90%;position:absolute;top:4vh">
      <span>
        <el-button type="primary" @click="addDialog.dialogVisible = true, dialog = true">
          <Plus style="width: 1em; height: 1em; margin-right: 8px" />新增
        </el-button>

      </span>
      <span>

        <el-button @click="dailyDialog = true, dialog = true, getDefaultDate(), getDailyPlan()">日常保养</el-button>

        <!-- <el-button
              @click="stockOutDialog.dialogVisible = true, stockform.operation = '出库', dialog = true, getDefaultDate()">出库</el-button>
            <el-button
              @click="transferDialog.dialogVisible = true, stockform.operation = '转入不良物料库', dialog = true, getDefaultDate()">转入不良物料
            </el-button> -->
      </span>
    </div>
    <div style="
            height: 1vh;
            line-height: 1vh;
            text-decoration: underline;
            color: #729fd0;
            position: relative;
            left: 95%;
            width: fit-content;
            cursor: pointer;
          ">
      <RouterLink to="/maintenancePlan/maintenanceList">列表</RouterLink>
      <!-- <RouterLink to="/maintenancePlan/maintenanceCalendar" style="color: white;">日历</RouterLink> -->
    </div>

    <div class="calendar-container">
      <el-calendar class="custom-calendar" v-model="currentDate">
        <template #header>
          <div class="custom-header">
            <span class="calendar-nav-btn" @click="addYear(-1)">&lt;&lt;</span>
            <span class="calendar-nav-btn" @click="addMonth(-1)">&lt;</span>
            <span class="calendar-nav-btn" @click="goToToday">{{ currentDate.getFullYear() }}年{{ currentDate.getMonth() +
              1 }}月</span>
            <span class="calendar-nav-btn" @click="addMonth(1)">&gt;</span>
            <span class="calendar-nav-btn" @click="addYear(1)">&gt;&gt;</span>
          </div>
        </template>

        <template #date-cell="{ data }">
          <div class="date-cell-wrapper" @click="selectedDate = new Date(data.day), getTodayPlan(data.day)">
            <p class="date-number" :class="[
              data.isSelected ? 'is-selected' : '',
              new Date(data.day).getMonth() === currentMonth ? 'current-month' : 'is-other-month'
            ]">
              {{ new Date(data.day).getDate() }}
              <!-- {{ data.isSelected ? '已选' : '' }} -->
            </p>
            <div>
              <i v-for="(item, index) in dealMyDate(data.day)" :key="index" style="color:black;width:100%">
                {{ item }}
              </i>
            </div>
          </div>
        </template>
      </el-calendar>

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
      <DialogComponent ref="editDialog" :form="stockform" dialog-title="记录故障维修记录" :refreshFunc="getDataFromAPI"
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
        <el-card v-for="(item, index) in    dailyList   ">
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
                  <el-date-picker v-model="item.prevDailyTime" type="datetime" value-format="YYYY-MM-DDTHH:mm:ss" disabled
                    style="margin-right:1vh" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="维护内容" prop="info">
              <el-input v-model="item.info" autocomplete="off" placeholder="请填写维护内容" style="margin-right:1vh" />
            </el-form-item>
          </el-form>
        </el-card>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dailyClose()">取消</el-button>
            <el-button type="primary" @click="dailyConfirm(), dailyClose()">
              确定
            </el-button>
          </span>
        </template>
      </el-dialog>
      <div class="maintenance-details">
        <div class="header-section">
          <h2>维保详情：<span class="maintenance-date">
              {{ selectedDate.getFullYear() }}-{{ (selectedDate.getMonth()
                +
                1).toString().padStart(2, '0') }}-{{
    selectedDate.getDate().toString().padStart(2, '0') }}</span></h2>
          <!-- <button class="add-button" @click="showContainer = true">新增</button> -->
        </div>

        <div class="separator"></div>

        <!-- <MaintenanceForm :isVisible.sync="showContainer" @confirm="handleFormConfirm" /> -->
        <el-card v-for="(item, index) in    todayList   ">
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
              <el-col :span=12> <el-form-item label="保养类型" prop="type">
                  <el-input v-model="item.type" autocomplete="off" placeholder="请输入维护人员" disabled
                    style="margin-right:1vh" />
                </el-form-item>

              </el-col>
              <el-col :span="12"><el-form-item label="计划日期" prop="plannedTime">
                  <el-date-picker v-model="item.plannedTime" type="datetime" value-format="YYYY-MM-DDTHH:mm:ss" disabled
                    style="margin-right:1vh" />
                </el-form-item>

              </el-col>
            </el-row>
            <el-row>
              <el-col :span=12>
                <el-form-item label="维护人员" prop="maintenanceman" v-show="item.maintenanceman">
                  <el-input v-model="item.maintenanceman" autocomplete="off" placeholder="请输入维护人员" disabled
                    style="margin-right:1vh" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实际日期" prop="completeTime" v-show="item.completeTime">
                  <el-date-picker v-model="item.completeTime" type="datetime" value-format="YYYY-MM-DDTHH:mm:ss" disabled
                    style="margin-right:1vh" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="维护内容" prop="info" v-show="item.info">
              <el-input v-model="item.info" autocomplete="off" placeholder="请填写维护内容" disabled style="margin-right:1vh" />
            </el-form-item>
          </el-form>
          <el-button v-if="!item.ongoing" class=" inline_button" style="color:#ff9a02a0"
            @click="updateMaintenancePlanStatusAPI(item.id), getDataFromAPI()">
            检修维护
          </el-button>
          <el-button v-else class="inline_button" :disabled="item.completeTime !== null"
            @click="getMaintenancePlanByID(item.id), editDialog.dialogVisible = true, dialog = true, stockform.id = item.id">
            记录
          </el-button>
        </el-card>
      </div>

    </div>
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

.custom-calendar {
  width: 62%;
  height: 86%;
  margin: 0 auto;
  margin-top: 20px;
  margin-left: 50px;
}

.calendar-container {
  width: 96%;
  height: 86%;
  margin-left: 37px;
  position: relative;
  background-color: white;
  border-radius: 1vh;
}

.maintenance-details {
  background-color: white;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
  width: calc(100% - 62% - 80px);
  height: calc(100% - 17px);
  position: absolute;
  right: 0;
  top: 5px;
  margin-right: 17px;
  overflow-y: auto;
  border-radius: 1vh;
  padding-left: 2vh;
  padding-right: 2vh
}

.maintenance-details h2 {
  margin: 0;
  padding: 10px;
  font-size: 16px;
  color: black;
  text-align: left;
  font-weight: 350;
  margin-left: 20px;
}

.separator {
  height: 1px;
  background-color: #EBEEF5;
  margin: -1px 30px;
}

::v-deep .el-calendar p.current-month {
  color: #000 !important;
  /* 黑色 */
}

.custom-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.custom-header span {
  margin: 0 12px;
  cursor: pointer;
  font-size: 16px
}

.calendar-nav-btn {
  color: #729fd0;
  cursor: pointer;
  font-size: 18px;
}

.date-number {
  text-align: left;
  padding-left: 5px;
}

.maintenance-date {
  color: #729fd0;
}

div.date-cell-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: left;

}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 1px;
  margin-top: -1px;
}

.add-button {
  padding: 6px 11px;
  background-color: #729fd0;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-right: 30px;
}

.add-button:hover {
  background-color: #729fd0;
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