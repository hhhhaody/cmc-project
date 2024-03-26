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
import { getMaterialAPI, addMaterialAPI, updateMaterialAPI, deleteMaterialAPI, getByIdAPI, addMaterialOperationAPI, getByBatchAPI } from "../apis/material";
import ExportButton from "@/components/ExportButton.vue";


// 从后端获取数据
const tableData = reactive([]);
const total = ref(0)
const getDataFromAPI = async () => {
  const res = await getMaterialAPI(currentPage.value, pageSize.value, name.value, spec.value);
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
const searchForm = reactive({
  name, spec
})
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
  if (title === "name") {
    name.value = keyword
    updateSearchSuggestion()

  }
  if (title === "spec") {
    spec.value = keyword
    updateSearchSuggestion()

  }


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

const disabledDate = (day) => {
  return day > new Date();
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

const checkNumber = (rule, value, callback) => {
  if (value > remainingStock.value) {
    callback(new Error('此批次余量不足'))
  }
  else {
    callback()
  }
}

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
  <dv-border-box1 ref="borderRef" class="subNavPage animate__animated animate__zoomIn"
    :color="['#4f698794', '#4f698794']" background-color="#3545659e">
    <!-- body -->
    <el-container class="subNavPage">
      <br />
      <h1>关于产线</h1>
      <!-- main -->
      <el-main style="overflow: hidden">
        <!-- search -->
        <!-- <br /> -->
        <!-- record -->
        <!-- <el-card> -->
        <p style="margin-bottom: 1vh;" class="overview">CMC智能制造生产线工作站是基于产品的工业化设计,以自动化、智能化的手段赋能模块化建筑的柔性化智能制造生产线.</p>

        <el-carousel :interval="1440000" style="height: 62vh; width: 100%">
          <el-carousel-item>
            <el-card style="border-radius: 1vh;height: 100%;">
              <div class="card">

                <div class="description">
                  <h2>
                    方通组焊工作站
                  </h2>
                  <i class="text">
                    该工作站通过自动变位机构、柔性自动化夹具、协同焊接机器人等硬件设备，运用全自动高精度非标柔性化加工等多项技术，实现方通高精度自动定位组装、非标自动化焊接、自动下料堆垛等功能。工作站所使用的焊接机器人具备先进的感应和控制系统，能够根据焊接任务的需求进行自动调整，确保焊缝的质量和稳定性。无论是大规模的生产还是复杂的焊接工艺，都能够高效高质地完成，本工作站的生产效率较人工生产效率提升80倍。
                  </i>
                </div>
                <video controls class="video" playsinline="" autoplay="" muted="" loop="">
                  <source class="scale" src="../assets/videos/fangtong_V2.mp4" type="video/mp4" />

                </video>

              </div>

            </el-card>
          </el-carousel-item>
          <el-carousel-item>
            <el-card style="border-radius: 1vh;height: 100%;">
              <div class="card">

                <div class="description">
                  <h2>
                    型钢切割工作站
                  </h2>
                  <i class="text">
                    该工作站以自动上料桁架机械手、自动下料堆垛料桁架机械手、主动跟随变位机构、柔性激光切割加工中心等硬件支撑，运用全自动高精度非标柔性化加工技术以及全自动高精度切割技术，实现高精度的切割和打孔加工，可兼容多种不同类型的型钢，能够迅速、精确的满足生产需求，同时利用机械手可实现型钢原材料的自动上料，成品自动下料堆垛，生产效率较人工生产效率提升4倍。
                  </i>
                </div>
                <video controls class="video" playsinline="" autoplay="" muted="" loop="">
                  <source class="scale" src="../assets/videos/xinggang_V2.mp4" type="video/mp4" />

                </video>

              </div>

            </el-card>
          </el-carousel-item>
          <el-carousel-item>
            <el-card style="border-radius: 1vh;height: 100%;">
              <div class="card">

                <div class="description">
                  <h2>
                    地面钢网工作站
                  </h2>
                  <i class="text">
                    该工作站通过采用自动上下料桁架机械手、钢网柔性全自动焊接中心等硬件设备，运用全自动高精度定位组装、全自动高精度柔性焊接等多项技术，实现型钢高精度自动定位组装，非标钢网结构柔性全自动焊接，钢网自动下料堆垛等功能。工作站所使用的自动上料桁架机械臂及焊接机器人均配备先进的感知设备和控制系统，能够准确识别各种材料的上料位置及焊缝位置，进行自适应的精准定位，高效完成生产任务。本工作站生产效率较人工生产效率提升4倍。
                  </i>
                </div>
                <video controls class="video" playsinline="" autoplay="" muted="" loop="">
                  <source class="scale" src="../assets/videos/dimian_V2.mp4" type="video/mp4" />

                </video>

              </div>

            </el-card>
          </el-carousel-item>
          <el-carousel-item>
            <el-card style="border-radius: 1vh;height: 100%;">
              <div class="card">

                <div class="description">
                  <h2>
                    总装工作站
                  </h2>
                  <i class="text">
                    该工作站通过自动焊接机械臂、移动组装模台、墙板拼装定位固定夹具等硬件，应用全自动高精度定位组装、全自动高精度柔性焊接、模块化自动总装等多项技术,实现模块各种规格尺寸波纹板墙体的拼装焊接及地面钢网的组装焊接等功能，本工作站可以适配不同尺寸模块的焊接工作，生产效率是人工生产效率的3倍。
                  </i>
                </div>
                <video controls class="video" playsinline="" autoplay="" muted="" loop="">
                  <source class="scale" src="../assets/videos/zongzhuang_V2.mp4" type="video/mp4" />

                </video>

              </div>

            </el-card>
          </el-carousel-item>

        </el-carousel>
        <!-- </el-card> -->
        <!-- table -->

      </el-main>
      <!-- pagination -->
      <el-footer style="display: flex; justify-content: center">
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

.overview {
  font-size: large;
  text-indent: 4vh;
  line-height: 2;
  text-shadow: rgb(128, 164, 196) 1px 1px 1px;
}

.video {
  flex-grow: 2;
  width: 50%;
  /* height: 56vh; */
  height: 72%;
  padding: 5vh;
  background-color: black;
  overflow: hidden;
  border-radius: 2vh;
  /* padding-bottom: 2vh; */
}

.scale {
  transform: scale(2);
}

:deep .el-carousel__container {
  height: 100%;
}

:deep .el-carousel__indicator--horizontal {
  /* display: none; */
  background: #e5eef7;
}

.card {
  padding: 1vh;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 80vh;
  margin-bottom: 1vh;
}


.description {
  padding: 5vh;
  display: flex;
  flex-direction: column;
  width: 100vh;
  align-items: center;
  /* justify-content: center; */
  height: 60vh;
  font-size: large;
  text-indent: 4vh;
  text-align: left;
  line-height: 2;
  text-shadow: darkgray 1px 1px 1px;
}

.text {
  white-space: pre-line;
  padding-top: 2vh;
  font-size: large;
}
</style>
