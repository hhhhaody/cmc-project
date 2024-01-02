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
import { addFacilityAPI, getFacilityAPI, deleteFacilityAPI, getByIdAPI, updateFacilityAPI, updateFacilityStatusAPI } from "../apis/facility";
import ExportButton from "@/components/ExportButton.vue";
import { getAllFolderAPI, getAllFilesInFolderAPI } from "../apis/files";
import { getSearchSuggestionAPI, getDialogSearchSuggestionAPI } from "../apis/util";



// 从后端获取数据
const tableData = reactive([]);
const total = ref(0)
const getDataFromAPI = async () => {
  const res = await getFacilityAPI(currentPage.value, pageSize.value, name.value, spec.value, section.value, status.value, supplier.value);
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
  { key: 'purchaseTime', title: '购买日期' },
  { key: 'supplier', title: '供应商' },
  { key: 'status', title: '设备状态' },
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
const supplier = ref("")
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
  if (title === "supplier") supplier.value = keyword


  //弹框内使用
  if (title === "supplier") stockform.supplier = keyword
  if (title === "operator") stockform.operator = keyword
  if (title === "fileName") fileName.value = keyword
};

// 根据关键字搜索数据库
const update = () => {
  refresh.value = true
  getDataFromAPI()
};

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

// 判断购买日期是否应该被禁用
const disabledDate = (time) => {
  // 获取今天的日期，不包括时间
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 禁用所有在今天之后的日期
  return time.getTime() > today.getTime();
};

// 清空搜索组件的关键字搜索，并初始化表格展示数据
const reset = () => {
  refresh.value = true
  name.value = "";
  spec.value = "";
  section.value = "";
  status.value = "";
  supplier.value = "";
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
const fileName = ref()
const remainingStock = ref(null)
const addDialog = ref()
const linkDialog = ref(false)
const editDialog = ref()
const confirmImage = ref(false)
const folderList = ref([])
const fileList = ref([])
const checkList = ref([])

const linkClose = () => {
  fileName.value = ''
  checkList.value = []
  fileList.value = []
  updateSearchSuggestion()
  linkDialog.value = false
  getFolderList();
  // ElMessageBox.confirm('Are you sure to close this dialog?')
  //   .then(() => {
  //     done()
  //   })
  //   .catch(() => {
  //     // catch error
  //   })
}

const getFolderList = async (keyword = "") => {
  const response = await getAllFolderAPI(1, 99999, keyword);
  console.log("Folder API Response:", response);
  if (response.code === 1 && response.data) {
    folderList.value = response.data.data;
  }
};

const updateFileList = async (folderId) => {
  const response = await getAllFilesInFolderAPI(folderId);
  console.log("Files API Response:", response); // 打印API的响应
  if (response.code === 1) {
    fileList.value = response.data.data.map(file => file.fileName);
  }
};

const dialogClose = () => {
  dialog.value = false
  remainingStock.value = null
  addform.warrantyUnit = '月'
  addform.firstLevelMaintenanceUnit = '月'
  addform.secondLevelMaintenanceUnit = '月'
  addform.dailyMaintenance = false
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
  station: '',
  section: '',
  purchaseTime: '',
  supplier: '',
  contact: '',
  contactNo: '',
  warranty: '',
  warrantyNo: '',
  warrantyUnit: '月',
  dailyMaintenance: false,
  firstLevelMaintenance: '',
  firstLevelMaintenanceNo: '',
  firstLevelMaintenanceUnit: '月',
  secondLevelMaintenance: '',
  secondLevelMaintenanceNo: '',
  secondLevelMaintenanceUnit: '月',
  attachment: '',
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
    // console.log(newVal);

    // You can perform actions here based on the changes in the uidToFileNameMap
    formattedTime.value = stockform.supplyTime.substring(0, 10)
  },
  { deep: true } // Enable deep monitoring
);

watch(
  fileName,
  async (newVal, oldVal) => {
    // console.log('uidToFileNameMap changed:');
    // console.log('New uidToFileNameMap:', newMap);
    // console.log(newVal);
    if (newVal) {
      console.log(newVal);
      // const res = await getSearchSuggestionAPI('deviceFiles', 'fileName')
      const res = await getDialogSearchSuggestionAPI('deviceFiles', 'file_name', { fileId: null, folderId: null, fileName: newVal, fileSize: null, uploadedAt: null, updatedAt: null })
      console.log(res.data);
      fileList.value = res.data.map(file => file.value)
    }

    // You can perform actions here based on the changes in the uidToFileNameMap
    // formattedTime.value = stockform.supplyTime.substring(0, 10)
  },
  { deep: true } // Enable deep monitoring
);

watch(
  addform,
  (newVal, oldVal) => {
    // console.log('uidToFileNameMap changed:');
    // console.log('New uidToFileNameMap:', newMap);
    console.log(newVal);
    addform.warranty = addform.warrantyNo + addform.warrantyUnit
    addform.firstLevelMaintenance = addform.firstLevelMaintenanceNo + addform.firstLevelMaintenanceUnit
    addform.secondLevelMaintenance = addform.secondLevelMaintenanceNo + addform.secondLevelMaintenanceUnit
  },
  { deep: true } // Enable deep monitoring
);

watch([() => addform.warrantyNo, () => addform.firstLevelMaintenanceNo, () => addform.secondLevelMaintenanceNo], ([warrantyNo, firstNo, secondNo], [oldwarrantyNo, oldfirstNo, oldsecondNo]) => {
  // addform.warranty = addform.warrantyNo + addform.warrantyUnit
  // addform.firstLevelMaintenance = addform.firstLevelMaintenanceNo + addform.firstLevelMaintenanceUnit
  // addform.secondLevelMaintenance = addform.secondLevelMaintenanceNo + addform.secondLevelMaintenanceUnit
});

//编辑相关
//数据回显API

const getFacilityByID = async (id) => {
  const res = await getByIdAPI(id);
  if (res.code === 1) {
    addform.id = res.data.id
    addform.name = res.data.name
    addform.spec = res.data.spec
    addform.section = res.data.section
    addform.station = res.data.station
    addform.supplier = res.data.supplier
    addform.purchaseTime = res.data.purchaseTime
    addform.contact = res.data.contact
    addform.contactNo = res.data.contactNo
    addform.attachment = res.data.attachment
    addform.warrantyNo = parseInt(res.data.warranty.match(/\d+/g))
    addform.warrantyUnit = res.data.warranty[res.data.warranty.length - 1]
    addform.firstLevelMaintenanceNo = parseInt(res.data.firstLevelMaintenance.match(/\d+/g))
    addform.firstLevelMaintenanceUnit = res.data.firstLevelMaintenance[res.data.firstLevelMaintenance.length - 1]
    addform.secondLevelMaintenanceNo = parseInt(res.data.secondLevelMaintenance.match(/\d+/g))
    addform.secondLevelMaintenanceUnit = res.data.secondLevelMaintenance[res.data.secondLevelMaintenance.length - 1]
    updateSearchSuggestion()
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
  if (title === "station") addform.station = keyword
  if (title === "section") addform.section = keyword
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
      <h1>设备台账管理</h1>
      <!-- main -->
      <el-main style="overflow: hidden">
        <!-- search -->
        <div>
          <SearchComponent :key="renderKey" search-title="工段名称" :searchContent=section ref="search3" field="section"
            @search="search" @edit="edit" database="facilities" :wNo=10 />
          <SearchComponent :key="renderKey" search-title="设备名称" :searchContent=name ref="search1" field="name"
            @search="search" @edit="edit" database="facilities" :wNo=10 />
          <SearchComponent :key="renderKey" search-title="规格型号" :searchContent=spec ref="search2" field="spec"
            @search="search" @edit="edit" database="facilities" :wNo=10 />
          <SearchComponent :key="renderKey" search-title="设备状态" :searchContent=status ref="search4" field="status"
            @search="search" @edit="edit" database="facilities" :wNo=10 />
          <SearchComponent :key="renderKey" search-title="供应商" :searchContent=supplier ref="search5" field="supplier"
            @search="search" @edit="edit" database="facilities" :wNo=10 />
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
            <el-button type="primary" @click="addDialog.dialogVisible = true, dialog = true">
              <Plus style="width: 1em; height: 1em; margin-right: 8px" />新增
            </el-button>

            <ExportButton v-model="selectedRows" :headers="headers" :tableData="tableData.value" fileName="设备台账信息.xlsx"
              :filterFunction="filterExportData" buttonLabel="导出" />
          </span>
          <span>
            <!-- <el-button
              @click="stockInDialog.dialogVisible = true, stockform.operation = '入库', dialog = true, getDefaultDate()">入库</el-button>
            <el-button
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
            left: 93%;
            width: fit-content;
            cursor: pointer;
          ">
          <RouterLink to="/facility/status">设备状态记录</RouterLink>
        </div>

        <!-- 弹框区 -->
        <!-- 新增弹框 -->
        <DialogComponent ref="addDialog" :form="addform" dialog-title="新增设备" :refreshFunc="getDataFromAPI"
          :confirm-func="addFacilityAPI" @dialogClose="dialogClose">
          <el-row>
            <el-col :span="12">
              <el-form-item label="设备名称" prop="name" :rules="[
                { required: true, message: '请输入设备名称', trigger: 'blur' },
                {
                  min: 1, max: 30,
                  message: '长度必须在1-30之间', trigger: 'blur'
                }]">
                <el-input v-model="addform.name" autocomplete="off" placeholder="请输入设备名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="规格型号" prop="spec" :rules="[
                { required: true, message: '请输入规格型号', trigger: 'blur' },
                {
                  min: 1, max: 30,
                  message: '长度必须在1-30之间', trigger: 'blur'
                }]">
                <el-input v-model="addform.spec" autocomplete="off" placeholder="请输入规格型号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="工段名称" prop="section" :rules="[
                { required: true, message: '请输入工段名称', trigger: 'blur' },
                {
                  min: 1, max: 30,
                  message: '长度必须在1-30之间', trigger: 'blur'
                }]">
                <DialogSearch :key="renderKey" :wNo="100" search-title="工段名称" :searchContent=addform.section
                  field="section" @search="dialogSearchSuggestion" :data="addform" database="productionLine" />
              </el-form-item>

            </el-col>
            <el-col :span="12">
              <el-form-item label="工位名称" prop="station" :rules="[
                { required: true, message: '请输入工位名称', trigger: 'blur' },
                {
                  min: 1, max: 30,
                  message: '长度必须在1-30之间', trigger: 'blur'
                }]">
                <DialogSearch :key="renderKey" :wNo="100" search-title="工位名称" :searchContent=addform.station
                  field="station" @search="dialogSearchSuggestion" :data="addform" database="productionLine" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="供应商" prop="supplier" :rules="[
                { required: true, message: '请输入供应商', trigger: 'blur' },
                {
                  min: 1, max: 30,
                  message: '长度必须在1-30之间', trigger: 'blur'
                }]">
                <el-input v-model="addform.supplier" autocomplete="off" placeholder="请输入供应商" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="购买日期" prop="purchaseTime" :rules="[
                { required: true, message: '请输入购买日期', trigger: 'blur' },
                {
                  min: 1, max: 30,
                  message: '长度必须在1-30之间', trigger: 'blur'
                }]">
                <el-date-picker v-model="addform.purchaseTime" type="datetime" placeholder="选择购买日期"
                  value-format="YYYY-MM-DDTHH:mm:ss" :disabled-date="disabledDate"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系人" prop="contact" :rules="[
                { required: true, message: '请输入联系人姓名', trigger: 'blur' },
                {
                  min: 1, max: 30,
                  message: '长度必须在1-30之间', trigger: 'blur'
                }]">
                <el-input v-model="addform.contact" autocomplete="off" placeholder="请输入联系人" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系方式" prop="contactNo" :rules="[
                { required: true, message: '请输入联系方式', trigger: 'blur' },
                { validator: validatePhoneNumber, trigger: 'blur' }
              ]">
                <el-input v-model.number="addform.contactNo" autocomplete="off" placeholder="请输入联系方式" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>

            <el-col :span="12">
              <el-form-item label="质保期" prop="warrantyNo" :rules="[
                { required: true, message: '请输入质保期', trigger: 'blur' },
                { type: 'number', message: '必须是数字', trigger: 'blur' }
              ]">
                <el-input v-model.number="addform.warrantyNo" autocomplete="off" placeholder="请输入质保期" />
              </el-form-item>

            </el-col>
            <el-col :span="3">
              <el-select v-model="addform.warrantyUnit" placeholder="月">
                <el-option label="月" value="月"></el-option>
                <el-option label="年" value="年"></el-option>
              </el-select>
            </el-col>
          </el-row>

          <el-form-item label="保养周期" prop="dailyMaintenance" :rules="[
            { required: true, message: '请输入保养周期', trigger: 'blur' },
            { type: 'boolean' }]">
            日常保养
            <el-switch v-model="addform.dailyMaintenance" />
          </el-form-item>

          <el-row>
            <el-col :span="12">
              <el-form-item prop="firstLevelMaintenanceNo" :rules="[
                { required: true, message: '请输入保养周期', trigger: 'blur' },
                { type: 'number', message: '必须是数字', trigger: 'blur' }
              ]">
                <span style="display:flex; line-height:100%;height:100%">
                  <i style="line-height:100%;min-width:fit-content;display:flex;align-items:center">一级保养</i>
                  <el-input v-model.number="addform.firstLevelMaintenanceNo" autocomplete="off" placeholder="请输入保养周期"
                    style="margin-left:2vh" />
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-select v-model="addform.firstLevelMaintenanceUnit" placeholder="月">
                <el-option label="周" value="周"></el-option>
                <el-option label="月" value="月"></el-option>
                <el-option label="年" value="年"></el-option>
              </el-select>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item prop="secondLevelMaintenanceNo" :rules="[
                { required: true, message: '请输入保养周期', trigger: 'blur' },
                { type: 'number', message: '必须是数字', trigger: 'blur' }
              ]">
                <span style="display:flex; line-height:100%;height:100%">
                  <i style="line-height:100%;min-width:fit-content;display:flex;align-items:center">二级保养</i>
                  <el-input v-model.number="addform.secondLevelMaintenanceNo" autocomplete="off" placeholder="请输入保养周期"
                    style="margin-left:2vh" />
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-select v-model="addform.secondLevelMaintenanceUnit" placeholder="月">
                <el-option label="周" value="周"></el-option>
                <el-option label="月" value="月"></el-option>
                <el-option label="年" value="年"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-form-item prop="attachment" label="附件" :rules="[
            { required: true, message: '请关联附件', trigger: 'blur' },
            {
              min: 1, max: 999,
              message: '长度必须在1-999之间', trigger: 'blur'
            }]">
            <div style="
            text-decoration: underline;
            color: #729fd0;
            width: fit-content;
            cursor: pointer" @click="linkDialog = true, getFolderList()">关联文件</div>
            <div style="margin-left: 20px;">{{ addform.attachment }}</div>
          </el-form-item>
        </DialogComponent>

        <!-- 关联弹窗 -->
        <el-dialog v-model="linkDialog" title="关联文件" width="40%" :before-close="linkClose">

          <SearchComponent :wNo="75" :key="renderKey" search-title="文件名称" :searchContent=fileName field="fileName"
            @search="search" database="deviceFiles" />
          <div style="margin:2vh;display:flex;flex-wrap:wrap;justify-content:space-evenly">
            <div v-for="(item, index) in folderList" style="text-decoration: underline;
            color: #729fd0;
            width: 30vh;
            cursor: pointer" @click="updateFileList(item.folderId)">{{ item.folderName }}</div>


          </div>
          <div style="margin:2vh">
            <el-checkbox-group v-model="checkList" style="display:flex;flex-wrap:wrap">
              <el-checkbox v-for="(item, index) in fileList" :key="index" :label="item" />
            </el-checkbox-group>
          </div>

          <template #footer>
            <span>
              <el-button @click="linkClose">取消</el-button>
              <el-button type="primary" @click="addform.attachment = checkList.join(',  '), linkClose()">
                确定
              </el-button>
            </span>
          </template>
        </el-dialog>

        <!-- 编辑弹框 -->
        <DialogComponent ref="editDialog" :form="addform" dialog-title="编辑设备" :refreshFunc="getDataFromAPI"
          :confirm-func="updateFacilityAPI" @dialogClose="dialogClose">
          <el-row>
            <el-col :span="12">
              <el-form-item label="设备名称" prop="name" :rules="[
                { required: true, message: '请输入设备名称', trigger: 'blur' },
                {
                  min: 1, max: 30,
                  message: '长度必须在1-30之间', trigger: 'blur'
                }]">
                <el-input v-model="addform.name" autocomplete="off" placeholder="请输入设备名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="规格型号" prop="spec" :rules="[
                { required: true, message: '请输入规格型号', trigger: 'blur' },
                {
                  min: 1, max: 30,
                  message: '长度必须在1-30之间', trigger: 'blur'
                }]">
                <el-input v-model="addform.spec" autocomplete="off" placeholder="请输入规格型号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="工段名称" prop="section" :rules="[
                { required: true, message: '请输入工段名称', trigger: 'blur' },
                {
                  min: 1, max: 30,
                  message: '长度必须在1-30之间', trigger: 'blur'
                }]">
                <DialogSearch :key="renderKey" :wNo="100" search-title="工段名称" :searchContent=addform.section
                  field="section" @search="dialogSearchSuggestion" :data="addform" database="productionLine" />
              </el-form-item>

            </el-col>
            <el-col :span="12">
              <el-form-item label="工位名称" prop="station" :rules="[
                { required: true, message: '请输入工位名称', trigger: 'blur' },
                {
                  min: 1, max: 30,
                  message: '长度必须在1-30之间', trigger: 'blur'
                }]">
                <DialogSearch :key="renderKey" :wNo="100" search-title="工位名称" :searchContent=addform.station
                  field="station" @search="dialogSearchSuggestion" :data="addform" database="productionLine" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="供应商" prop="supplier" :rules="[
                { required: true, message: '请输入供应商', trigger: 'blur' },
                {
                  min: 1, max: 30,
                  message: '长度必须在1-30之间', trigger: 'blur'
                }]">
                <el-input v-model="addform.supplier" autocomplete="off" placeholder="请输入供应商" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="购买日期" prop="purchaseTime" :rules="[
                { required: true, message: '请输入购买日期', trigger: 'blur' },
                {
                  min: 1, max: 30,
                  message: '长度必须在1-30之间', trigger: 'blur'
                }]">
                <el-date-picker v-model="addform.purchaseTime" type="datetime" placeholder="选择购买日期"
                  value-format="YYYY-MM-DDTHH:mm:ss" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系人" prop="contact" :rules="[
                { required: true, message: '请输入联系人姓名', trigger: 'blur' },
                {
                  min: 1, max: 30,
                  message: '长度必须在1-30之间', trigger: 'blur'
                }]">
                <el-input v-model="addform.contact" autocomplete="off" placeholder="请输入联系人" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系方式" prop="contactNo" :rules="[
                { required: true, message: '请输入联系方式', trigger: 'blur' },
                { type: 'number', message: '必须是数字', trigger: 'blur' }
              ]">
                <el-input v-model.number="addform.contactNo" autocomplete="off" placeholder="请输入联系方式" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>

            <el-col :span="12">
              <el-form-item label="质保期" prop="warrantyNo" :rules="[
                { required: true, message: '请输入质保期', trigger: 'blur' },
                { type: 'number', message: '必须是数字', trigger: 'blur' }
              ]">
                <el-input v-model.number="addform.warrantyNo" autocomplete="off" placeholder="请输入质保期" />
              </el-form-item>

            </el-col>
            <el-col :span="3">
              <el-select v-model="addform.warrantyUnit" placeholder="月">
                <el-option label="月" value="月"></el-option>
                <el-option label="年" value="年"></el-option>
              </el-select>
            </el-col>
          </el-row>

          <el-form-item label="保养周期" prop="dailyMaintenance" :rules="[
            { required: true, message: '请输入保养周期', trigger: 'blur' }]">
            日常保养
            <el-switch v-model="addform.dailyMaintenance" />
          </el-form-item>

          <el-row>
            <el-col :span="12">
              <el-form-item prop="firstLevelMaintenanceNo" :rules="[
                { required: true, message: '请输入保养周期', trigger: 'blur' },
                { type: 'number', message: '必须是数字', trigger: 'blur' }
              ]">
                <span style="display:flex; line-height:100%;height:100%">
                  <i style="line-height:100%;min-width:fit-content;display:flex;align-items:center">一级保养</i>
                  <el-input v-model.number="addform.firstLevelMaintenanceNo" autocomplete="off" placeholder="请输入保养周期"
                    style="margin-left:2vh" />
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-select v-model="addform.firstLevelMaintenanceUnit" placeholder="月">
                <el-option label="周" value="周"></el-option>
                <el-option label="月" value="月"></el-option>
                <el-option label="年" value="年"></el-option>
              </el-select>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item prop="secondLevelMaintenanceNo" :rules="[
                { required: true, message: '请输入保养周期', trigger: 'blur' },
                { type: 'number', message: '必须是数字', trigger: 'blur' }
              ]">
                <span style="display:flex; line-height:100%;height:100%">
                  <i style="line-height:100%;min-width:fit-content;display:flex;align-items:center">二级保养</i>
                  <el-input v-model.number="addform.secondLevelMaintenanceNo" autocomplete="off" placeholder="请输入保养周期"
                    style="margin-left:2vh" />
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-select v-model="addform.secondLevelMaintenanceUnit" placeholder="月">
                <el-option label="周" value="周"></el-option>
                <el-option label="月" value="月"></el-option>
                <el-option label="年" value="年"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-form-item prop="attachment" label="附件" :rules="[
            { required: true, message: '请关联附件', trigger: 'blur' },
            {
              min: 1, max: 999,
              message: '长度必须在1-999之间', trigger: 'blur'
            }]">
            <div style="
            text-decoration: underline;
            color: #729fd0;
            width: fit-content;
            cursor: pointer" @click="linkDialog = true, getFolderList()">关联文件</div>
            <div style="margin-left: 20px;">{{ addform.attachment }}</div>
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
          <el-table-column prop="purchaseTime" label="购买日期" align="center">
            <template #default="scope">
              {{ scope.row.purchaseTime.substring(0, 10) }}
            </template>
          </el-table-column>
          <el-table-column prop="supplier" label="供应商" align="center" />
          <el-table-column prop="status" label="设备状态" align="center" />
          <el-table-column prop="operation" label="操作" align="center" min-width="100vh">
            <template #default="scope">
              <el-button class="inline_button"
                @click="getFacilityByID(scope.row.id), editDialog.dialogVisible = true, dialog = true, addform.id = scope.row.id">
                编辑
              </el-button>
              <el-button class="inline_button" @click="deleteConfirm(scope.row.id)">
                删除
              </el-button>
              <el-button class="inline_button">
                <RouterLink :to="{ name: 'facilityDetail', query: { id: scope.row.id } }">详情
                </RouterLink>
              </el-button>
              <el-button v-if="scope.row.status === '正常使用'" class=" inline_button" style="color:#ff9a02a0"
                @click="updateFacilityStatusAPI(scope.row.id), getDataFromAPI()">
                停用
              </el-button>
              <el-button v-if="scope.row.status === '停用'" class="inline_button" style="color:#339a528b"
                @click="updateFacilityStatusAPI(scope.row.id), getDataFromAPI()">
                启用
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
</style>

