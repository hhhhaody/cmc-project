<script setup>
import { ref, onMounted, reactive, onUnmounted, watch, computed } from "vue";
import { format } from "date-fns"
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import SearchComponent from "../components/SearchComponent.vue";
import DialogSearch from "../components/DialogSearch.vue";
import PaginationComponent from "../components/PaginationComponent.vue";
import DialogComponent from "../components/DialogComponent.vue";
import UploadImage from "../components/UploadImage.vue";
import { getDefectiveAPI, getByBatchAPI, addDefectiveOperationAPI, getDefectiveOperationListByBatchAPI } from "../apis/defective"
import ExportButton from "@/components/ExportButton.vue";

// 从后端获取数据
const tableData = reactive([]);
const total = ref(0)
const getDataFromAPI = async () => {
  const res = await getDefectiveAPI(currentPage.value, pageSize.value, name.value, spec.value, supplier.value);
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
  { key: 'id', title: '序号' },
  { key: 'batch', title: '物料批次' },
  { key: 'name', title: '物料名称' },
  { key: 'spec', title: '规格型号' },
  { key: 'defectiveAmount', title: '不良数量' },
  { key: 'returnedAmount', title: '返用数量' },
  { key: 'scrappedAmount', title: '报废数量' },
  { key: 'supplier', title: '供料单位' },
  // { key: 'createTime', title: '创建时间' },
]);
const filterExportData = (data) => {
  // 过滤或转换数据的逻辑
  return data; // 示例：返回原始数据，不做任何处理
};



//搜索组件相关
//#region
const search1 = ref();
const search2 = ref();
const search3 = ref()
const name = ref("")
const spec = ref("")
const supplier = ref("")
const searchForm = reactive({ name, spec, supplier })
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
  if (title === "name") name.value = keyword; updateSearchSuggestion()
  if (title === "spec") spec.value = keyword; updateSearchSuggestion()
  if (title === "supplier") supplier.value = keyword; updateSearchSuggestion()


  //弹框内使用
  if (title === "handler") operateform.handler = keyword
  if (title === "operator") operateform.operator = keyword
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
  supplier.value = "";
  search1.value.searchContent = "";
  search2.value.searchContent = "";
  search3.value.searchContent = "";
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
const recordDialogVisible = ref(false)
const operateDialog = ref()
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
  operateform.operateTime = format(currentDate, 'yyyy-MM-dd') + 'T' + format(currentDate, 'HH:mm:ss')
}

const remains = computed(() => {
  if (remainingStock.value == null) {
    return "请输入数量"
  }
  return `不良物料余量：${remainingStock.value}`;
});

//表单数据

const operateform
  = reactive({
    name: '',
    spec: '',
    operation: '',
    batch: '',
    amount: '',
    operateTime: '',
    operator: '',
    receipt: '',
    comment: '',
    handler: ''
  })

watch(
  operateform,
  (newVal, oldVal) => {
    // console.log('uidToFileNameMap changed:');
    // console.log('New uidToFileNameMap:', newMap);

    // You can perform actions here based on the changes in the uidToFileNameMap
    formattedTime.value = operateform.operateTime.substring(0, 10)
  },
  { deep: true } // Enable deep monitoring
);

//数据回显API

const getDefectivelOperationByBatch = async (batch) => {
  const res = await getByBatchAPI(batch);
  if (res.code === 1) {
    operateform.name = res.data.name
    operateform.spec = res.data.spec
    remainingStock.value = res.data.defectiveAmount
    updateSearchSuggestion()
  }
  console.log(res.data);
};

// 弹框内输入框搜索相关

//DialogSearch组件使用
const dialogSearchSuggestion = (title, keyword) => {
  if (title === "name") operateform.name = keyword
  if (title === "spec") operateform.spec = keyword
  if (title === "batch") {
    operateform.batch = keyword
    getDefectivelOperationByBatch(keyword)
  }
  updateSearchSuggestion()
}

//查看操作弹框

// 从后端获取数据
const defectiveOperationTable = reactive([]);

const getDefectiveOperationList = async (batch) => {
  const res = await getDefectiveOperationListByBatchAPI(batch);
  if (res.code === 1) {
    defectiveOperationTable.value = res.data
  }
};

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
  operateform.receipt = JSON.stringify(uidToFileNameMap);
  console.log(operateform);
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
</script>

<template>
  <!-- borderbox -->
  <dv-border-box1 ref="borderRef" class="subNavPage animate__animated animate__zoomIn" :color="['#4f698794', '#4f698794']"
    background-color="#3545659e">
    <!-- body -->
    <el-container class="subNavPage">
      <br />
      <h1>不良物料管理</h1>
      <!-- main -->
      <el-main style="overflow: hidden">
        <!-- search -->
        <div>
          <SearchComponent :key="renderKey" search-title="物料名称" :searchContent=name ref="search1" field="name"
            @search="search" @edit="edit" database="defectives" :data="searchForm" />
          <SearchComponent :key="renderKey" search-title="规格型号" :searchContent=spec ref="search2" field="spec"
            @search="search" @edit="edit" database="defectives" :data="searchForm" />
          <SearchComponent :key="renderKey" search-title="供料单位" :searchContent=supplier ref="search3" field="supplier"
            @search="search" @edit="edit" database="defectives" :data="searchForm" />
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
            <ExportButton v-model="selectedRows" :headers="headers" :tableData="tableData.value" fileName="不良物料库存信息.xlsx"
              :filterFunction="filterExportData" buttonLabel="导出" />
          </span>
          <span>
            <el-button type="primary"
              @click="operateDialog.dialogVisible = true, dialog = true, getDefaultDate()">处理</el-button>
          </span>
        </div>
        <!-- record -->
        <div style="
            height: 2vh;
            line-height: 2vh;
            text-decoration: underline;
            color: #729fd0;
            position: relative;
            left: 95%;
            width: fit-content;
            cursor: pointer;
          ">
        </div>

        <!-- 弹框区 -->

        <!-- 处理弹框 -->
        <DialogComponent ref="operateDialog" :form="operateform" dialog-title="处理不良物料" :refreshFunc="getDataFromAPI"
          :confirm-func="addDefectiveOperationAPI" @dialogClose="dialogClose" :image=true @saveImage=saveImage>
          <el-row>
            <el-col :span="12">
              <el-form-item label="物料名称" prop="name">
                <DialogSearch :key="renderKey" :wNo="100" search-title="物料名称" :searchContent=operateform.name field="name"
                  @search="dialogSearchSuggestion" :data="operateform" database="defectives" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="规格型号" prop="spec">
                <DialogSearch :key="renderKey" :wNo="100" search-title="规格型号" :searchContent=operateform.spec field="spec"
                  @search="dialogSearchSuggestion" :data="operateform" database="defectives" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="物料批次" prop="batch" :rules="[
            { required: true, message: '请选择物料批次', trigger: 'blur' }]">
            <DialogSearch :key="renderKey" :wNo="100" search-title="物料批次" :searchContent=operateform.batch field="batch"
              @search="dialogSearchSuggestion" :data="operateform" database="defectives" />
          </el-form-item>
          <el-form-item label="处理结果" prop="operation" :rules="[
            { required: true, message: '请选择处理结果', trigger: 'blur' }]">
            <el-radio-group v-model="operateform.operation">
              <el-radio-button label="返用" />
              <el-radio-button label="报废" />
            </el-radio-group>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="处理人员" prop="operator" :rules="[
                { required: true, message: '请输入操作人员', trigger: 'blur' },
                {
                  min: 1, max: 30,
                  message: '长度必须在1-30之间', trigger: 'blur'
                }]">
                <SearchComponent :hide-title=true :wNo="100" :key="renderKey" search-title="处理人员"
                  :searchContent=operateform.operator field="operator" @search="search" database="defectives/operation" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="处理数量" prop="amount" :rules="[
                { required: true, message: '请输入数量', trigger: 'blur' },
                { type: 'number', message: '必须是数字', trigger: 'blur' }
              ]">
                <el-input v-model.number="operateform.amount" autocomplete="off" :placeholder="remains" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="处理时间" prop="operateTime" :rules="[
                { required: true, message: '请输入供料日期', trigger: 'blur' }]">
                <el-date-picker v-model="operateform.operateTime" type="datetime" placeholder="选择处理日期"
                  value-format="YYYY-MM-DDTHH:mm:ss" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="维修人员" prop="handler" :rules="[
                { required: true, message: '请输入操作人员', trigger: 'blur' },
                {
                  min: 1, max: 30,
                  message: '长度必须在1-30之间', trigger: 'blur'
                }]">
                <SearchComponent :hide-title=true :wNo="100" :key="renderKey" search-title="维修人员"
                  :searchContent=operateform.handler field="handler" @search="search" database="defectives/operation" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="处理意见" prop="comment" :rules="[
            { required: true, message: '请上传签收凭证', trigger: 'blur' }]">
            <el-input v-model="operateform.comment" autocomplete="off" />
          </el-form-item>
          <el-form-item label="出库凭证" prop="receipt" :rules="[
            { required: true, message: '请上传签收凭证', trigger: 'blur' }]">
            <UploadImage @uploadImage="uploadImage" :dialog=dialog :confirmImage=confirmImage />
          </el-form-item>
        </DialogComponent>

        <!-- 查看弹框 -->
        <el-dialog v-model="recordDialogVisible" title="查看处理记录" width=70%>
          <el-table :data="defectiveOperationTable.value" table-layout="fixed" show-overflow-tooltip
            style="width: 100%; border-radius: 1vh">
            <el-table-column label="序号" type="index" align="center" min-width="35vh" />
            <el-table-column prop="operation" label="处理结果" align="center" />
            <el-table-column prop="amount" label="数量" align="center" />
            <el-table-column prop="operator" label="处理人员" align="center" />
            <el-table-column prop="operateTime" label="处理时间" align="center" min-width="110vh">
              <template #default="scope">
                {{ scope.row.operateTime.substring(0, 10) }} {{ scope.row.operateTime.substring(11,) }}
              </template>
            </el-table-column>
            <el-table-column prop="comment" label="处理意见" align="center" />
            <el-table-column prop="handler" label="维修人员" align="center" />
            <el-table-column prop="receipt" label="处理照片" align="center" min-width="60vh">
              <template #default="scope">
                <el-button class="inline_button" @click="detail(scope.row.receipt)">
                  详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>


        <!-- table -->
        <el-table :data="tableData.value" @selection-change="handleSelectionChange"
          style="width: 100%; border-radius: 1vh" table-layout="fixed" height="48vh" show-overflow-tooltip>
          <el-table-column type="selection" align="center" />
          <el-table-column label="序号" type="index" align="center" min-width="70vh" />
          <el-table-column prop="batch" label="物料批次" align="center" />
          <el-table-column prop="name" label="物料名称" align="center" />
          <el-table-column prop="spec" label="规格型号" align="center" />
          <el-table-column prop="defectiveAmount" label="不良数量" align="center" />
          <el-table-column prop="returnedAmount" label="返用数量" align="center" />
          <el-table-column prop="scrappedAmount" label="报废数量" align="center" />
          <el-table-column prop="supplier" label="供料单位" align="center" />
          <el-table-column prop="operation" label="处理记录" align="center">
            <template #default="scope">
              <el-button class="inline_button" @click="getDefectiveOperationList(scope.row.batch),
                recordDialogVisible = true,
                dialog = true">
                查看
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
  <el-dialog v-model="dialogVisible" style="width: fit-content; border-radius: 1vh;">
    <ArrowLeft @click="prevImage" v-if="currentIndex > 0" style="width: 5vh; height: 5vh" class="prev-button" />
    <img w-full :src="imageUrls[currentIndex]" alt="无图片" class="image" />
    <ArrowRight @click="nextImage" v-if="currentIndex < imageUrls.length - 1" style="width: 5vh; height: 5vh"
      class="next-button" />

  </el-dialog>
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

.image {
  max-width: 100%;
  max-height: 60vh;
}
</style>

