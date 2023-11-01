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
import { getProductAPI, addProductAPI, getByIdAPI, deleteProductAPI, updateProductAPI, addProductOperationAPI, getByBatchAPI } from "../apis/product"


// 从后端获取数据
const tableData = reactive([]);
const total = ref(0)
const getDataFromAPI = async () => {
  const res = await getProductAPI(currentPage.value, pageSize.value, name.value, spec.value);
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
  { key: 'id', title: 'ID' },
  { key: 'name', title: '产品名称' },
  { key: 'spec', title: '规格型号' },
  { key: 'qualified', title: '合格品库存数量' },
  { key: 'discarded', title: '废品库存数量' },
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
  if (title === "section") addform.section = keyword


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
    quality: '',
    operation: '',
    batch: '',
    amount: '',
    produceTime: '',
    operateTime: '',
    operator: '',
    detail: '',
    receipt: '',
  })

watch(
  stockform,
  (newVal, oldVal) => {
    formattedTime.value = stockform.produceTime.substring(0, 10)
    // console.log(stockform)
  },
  { deep: true } // Enable deep monitoring
);


watch(() => addform.section, async (newval, oldval) => {
  // console.log("props uploaded changed");
  // console.log("new", newval);
  // console.log("old", oldval);
  console.log(newval);
  if (newval) {
    const res = await getStationsIdsAPI(newval);
    console.log(res.data);
    const ids = []

    for (const obj of res.data) {
      stations.value.push(obj.station)
      ids.push(obj.id);
    }

    console.log(stations);
    if (res.code === 1) {
      addform.stations = ids
    }

  }

  else {
    stations.value = []
  }


  // 其他操作...
}, { deep: true });



//编辑相关
//数据回显API

const getProductByID = async (id) => {
  const res = await getByIdAPI(id);
  if (res.code === 1) {
    console.log(res.data);
    addform.name = res.data.name
    addform.spec = res.data.spec
    addform.threshold = res.data.threshold
    addform.stackThreshold = res.data.stackThreshold
    addform.section = res.data.section
    addform.times = res.data.times
    updateSearchSuggestion()
    console.log(addform);
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
  if (title === "batch") {
    stockform.batch = keyword
    getProductOperationByBatch(keyword)
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
      <h1>产品库存</h1>
      <!-- main -->
      <el-main style="overflow: hidden">
        <!-- search -->
        <div>
          <SearchComponent :key="renderKey" search-title="产品名称" :searchContent=name ref="search1" field="name"
            @search="search" @edit="edit" database="products" />
          <SearchComponent :key="renderKey" search-title="规格型号" :searchContent=spec ref="search2" field="spec"
            @search="search" @edit="edit" database="products" />
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
              <Plus style="width: 1em; height: 1em; margin-right: 8px" />新增产品类型
            </el-button>

            <ExportButton v-model="selectedRows" :headers="headers" :tableData="tableData.value" fileName="产品库存信息.xlsx"
              :filterFunction="filterExportData" buttonLabel="导出" />
          </span>
          <span>
            <el-button
              @click="stockInDialog.dialogVisible = true, stockform.operation = '入库', dialog = true, getDefaultDate()">入库</el-button>
            <el-button
              @click="stockOutDialog.dialogVisible = true, stockform.operation = '出库', dialog = true, getDefaultDate()">出库</el-button>

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
          <RouterLink to="/product/operation">操作记录</RouterLink>
        </div>

        <!-- 弹框区 -->
        <!-- 新增弹框 -->
        <DialogComponent ref="addDialog" :form="addform" dialog-title="新增产品类型" :refreshFunc="getDataFromAPI"
          :confirm-func="addProductAPI" @dialogClose="dialogClose">
          <el-form-item label="产品名称" prop="name" :rules="[
            { required: true, message: '请输入产品名称', trigger: 'blur' },
            {
              min: 1, max: 30,
              message: '长度必须在1-30之间', trigger: 'blur'
            }]">
            <el-input v-model="addform.name" autocomplete="off" placeholder="请输入产品名称" />
          </el-form-item>
          <el-form-item label="规格型号" prop="spec" :rules="[
            { required: true, message: '请输入规格型号', trigger: 'blur' },
            {
              min: 1, max: 30,
              message: '长度必须在1-30之间', trigger: 'blur'
            }]">
            <el-input v-model="addform.spec" autocomplete="off" placeholder="请输入规格型号" />
          </el-form-item>
          <el-form-item label="库存阈值值" prop="threshold" :rules="[
            { required: true, message: '请输入阈值', trigger: 'blur' },
            { type: 'number', message: '阈值必须是数字', trigger: 'blur' }
          ]">
            <el-input v-model.number="addform.threshold" autocomplete="off" placeholder="请输入库存阈值值" />
          </el-form-item>
          <el-form-item label="堆料预警值" prop="stackThreshold" :rules="[
            { required: true, message: '请输入堆料预警值', trigger: 'blur' },
            { type: 'number', message: '预警值必须是数字', trigger: 'blur' }
          ]">
            <el-input v-model.number="addform.stackThreshold" autocomplete="off" placeholder="请输入堆料预警值" />
          </el-form-item>
          <el-form-item label="工段名称" prop="section" :rules="[
            { required: true, message: '请选择工段名称', trigger: 'blur' },
            {
              min: 1, max: 30,
              message: '长度必须在1-30之间', trigger: 'blur'
            }]">
            <SearchComponent :hide-title=true :wNo="100" :key="renderKey" search-title="工段名称"
              :searchContent=addform.section field="section" @search="search" database="productionLine" />
          </el-form-item>
          <el-form-item class="form-row" v-for="(item, index) in stations" :key="index" :label="item" :rules="[
            { required: true, message: '请输入理论耗时', trigger: 'blur' },
            { type: 'number', message: '理论耗时必须是数字', trigger: 'blur' }]">
            <el-input v-model.number="addform.times[index]" placeholder="请输入理论耗时(秒)"></el-input>
          </el-form-item>
        </DialogComponent>

        <!-- 编辑弹框 -->
        <DialogComponent ref="editDialog" :form="addform" dialog-title="编辑产品类型" :refreshFunc="getDataFromAPI"
          :confirm-func="updateProductAPI" @dialogClose="dialogClose">
          <el-form-item label="产品名称" prop="name" :rules="[
            { required: true, message: '请输入物料名称', trigger: 'blur' },
            {
              min: 1, max: 30,
              message: '长度必须在1-30之间', trigger: 'blur'
            }]">
            <el-input v-model="addform.name" autocomplete="off" placeholder="请输入产品名称" />
          </el-form-item>
          <el-form-item label="规格型号" prop="spec" :rules="[
            { required: true, message: '请输入规格型号', trigger: 'blur' },
            {
              min: 1, max: 30,
              message: '长度必须在1-30之间', trigger: 'blur'
            }]">
            <el-input v-model="addform.spec" autocomplete="off" placeholder="请输入规格型号" />
          </el-form-item>
          <el-form-item label="库存阈值值" prop="threshold" :rules="[
            { required: true, message: '请输入阈值', trigger: 'blur' },
            { type: 'number', message: '阈值必须是数字', trigger: 'blur' }
          ]">
            <el-input v-model.number="addform.threshold" autocomplete="off" placeholder="请输入库存阈值值" />
          </el-form-item>
          <el-form-item label="堆料预警值" prop="stackThreshold" :rules="[
            { required: true, message: '请输入堆料预警值', trigger: 'blur' },
            { type: 'number', message: '预警值必须是数字', trigger: 'blur' }
          ]">
            <el-input v-model.number="addform.stackThreshold" autocomplete="off" placeholder="请输入堆料预警值" />
          </el-form-item>
          <el-form-item label="工段名称" prop="section" :rules="[
            { required: true, message: '请选择工段名称', trigger: 'blur' },
            {
              min: 1, max: 30,
              message: '长度必须在1-30之间', trigger: 'blur'
            }]">
            <SearchComponent :hide-title=true :wNo="100" :key="renderKey" search-title="工段名称"
              :search-content=addform.section field="section" @search="search" database="productionLine" />
          </el-form-item>
          <el-form-item class="form-row" v-for="(item, index) in stations" :key="index" :label="item" :rules="[
            { required: true, message: '请输入理论耗时', trigger: 'blur' },
            { type: 'number', message: '理论耗时必须是数字', trigger: 'blur' }]">
            <el-input v-model.number="addform.times[index]" placeholder="请输入理论耗时(秒)"></el-input>
          </el-form-item>
        </DialogComponent>

        <!-- 入库弹框 -->
        <DialogComponent ref="stockInDialog" :form="stockform" dialog-title="产品入库" :refreshFunc="getDataFromAPI"
          :confirm-func="addProductOperationAPI" @dialogClose="dialogClose" :image=true @saveImage=saveImage>
          <el-row>
            <el-col :span="12">
              <el-form-item label="产品名称" prop="name" :rules="[
                { required: true, message: '请选择产品名称', trigger: 'blur' }]">
                <DialogSearch :key="renderKey" :wNo="100" search-title="产品名称" :searchContent=stockform.name field="name"
                  @search="dialogSearchSuggestion" :data="stockform" database="products" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="规格型号" prop="spec" :rules="[
                { required: true, message: '请选择规格型号', trigger: 'blur' }]">
                <DialogSearch :key="renderKey" :wNo="100" search-title="规格型号" :searchContent=stockform.spec field="spec"
                  @search="dialogSearchSuggestion" :data="stockform" database="products" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="处理结果" prop="quality" :rules="[
            { required: true, message: '请选择质量情况', trigger: 'blur' }]">
            <el-radio-group v-model="stockform.quality">
              <el-radio-button label="合格品" />
              <el-radio-button label="返修件" />
              <el-radio-button label="废品" />
            </el-radio-group>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="入库人员" prop="operator" :rules="[
                { required: true, message: '请输入入库人员', trigger: 'blur' },
                {
                  min: 1, max: 30,
                  message: '长度必须在1-30之间', trigger: 'blur'
                }]">
                <SearchComponent :hide-title=true :wNo="100" :key="renderKey" search-title="入库人员"
                  :searchContent=stockform.operator field="operator" @search="search" database="products/operation" />
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
                { required: true, message: '请输入入库日期', trigger: 'blur' }]">
                <el-date-picker v-model="stockform.operateTime" type="datetime" placeholder="选择入库日期"
                  value-format="YYYY-MM-DDTHH:mm:ss" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生产日期" prop="produceTime" :rules="[
                { required: true, message: '请输入选择生产日期', trigger: 'blur' }]">
                <el-date-picker v-model="stockform.produceTime" type="datetime" placeholder="选择生产日期"
                  value-format="YYYY-MM-DDTHH:mm:ss" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="情况说明" prop="detail" :rules="[
            { required: true, message: '请填写情况说明', trigger: 'blur' }]">
            <el-input v-model="stockform.detail" autocomplete="off" placeholder="请填写情况说明" />
          </el-form-item>
          <el-form-item label="入库凭证" prop="receipt" :rules="[
            { required: true, message: '请签收凭证', trigger: 'blur' }]">
            <UploadImage @uploadImage="uploadImage" :dialog=dialog :confirmImage=confirmImage />
          </el-form-item>
        </DialogComponent>

        <!-- 出库弹框 -->
        <DialogComponent ref="stockOutDialog" :form="stockform" dialog-title="物料出库" :refreshFunc="getDataFromAPI"
          :confirm-func="addProductOperationAPI" @dialogClose="dialogClose" :image=true @saveImage=saveImage>
          <el-row>
            <el-col :span="12">
              <el-form-item label="物料名称" prop="name">
                <DialogSearch :key="renderKey" :wNo="100" search-title="物料名称" :searchContent=stockform.name field="name"
                  @search="dialogSearchSuggestion" :data="stockform" database="products/operation" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="规格型号" prop="spec">
                <DialogSearch :key="renderKey" :wNo="100" search-title="规格型号" :searchContent=stockform.spec field="spec"
                  @search="dialogSearchSuggestion" :data="stockform" database="products/operation" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="物料批次" prop="batch" :rules="[
            { required: true, message: '请选择物料批次', trigger: 'blur' }]">
            <DialogSearch :key="renderKey" :wNo="100" search-title="物料批次" :searchContent=stockform.batch field="batch"
              @search="dialogSearchSuggestion" :data="stockform" database="products/operation" />
          </el-form-item>
          <el-form-item label="质量情况" prop="quality">
            <el-input v-model="stockform.quality" autocomplete="off" />
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="出库人员" prop="operator" :rules="[
                { required: true, message: '请输入出库人员', trigger: 'blur' },
                {
                  min: 1, max: 30,
                  message: '长度必须在1-30之间', trigger: 'blur'
                }]">
                <SearchComponent :hide-title=true :wNo="100" :key="renderKey" search-title="出库人员"
                  :searchContent=stockform.operator field="operator" @search="search" database="products/operation" />
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
                { required: true, message: '请输入出库日期', trigger: 'blur' }]">
                <el-date-picker v-model="stockform.operateTime" type="datetime" placeholder="选择出库日期"
                  value-format="YYYY-MM-DDTHH:mm:ss" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生产日期" prop="produceTime">
                <el-input v-model="formattedTime" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="情况说明" prop="detail" :rules="[
            { required: true, message: '请填写情况说明', trigger: 'blur' }]">
            <el-input v-model="stockform.detail" autocomplete="off" placeholder="请填写情况说明" />
          </el-form-item>
          <el-form-item label="出库凭证" prop="receipt" :rules="[
            { required: true, message: '请上传签收凭证', trigger: 'blur' }]">
            <UploadImage @uploadImage="uploadImage" :dialog=dialog :confirmImage=confirmImage />
          </el-form-item>
        </DialogComponent>



        <!-- table -->
        <el-table :data="tableData.value" @selection-change="handleSelectionChange"
          style="width: 100%; border-radius: 1vh" table-layout="fixed" height="48vh" show-overflow-tooltip>
          <el-table-column type="selection" align="center" />
          <el-table-column label="序号" type="index" align="center" min-width="70vh" />
          <el-table-column prop="name" label="产品名称" align="center" />
          <el-table-column prop="spec" label="规格型号" align="center" />
          <el-table-column prop="qualified" label="合格品库存数量" align="center" />
          <el-table-column prop="discarded" label="废品库存数量" align="center" />
          <el-table-column prop="operation" label="操作" align="center">
            <template #default="scope">
              <el-button class="inline_button"
                @click="getProductByID(scope.row.id), editDialog.dialogVisible = true, dialog = true, addform.id = scope.row.id">
                编辑
              </el-button>
              <el-button class="inline_button" @click="deleteConfirm(scope.row.id)">
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

