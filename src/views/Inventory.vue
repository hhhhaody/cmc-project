<script setup>
import { ref, onMounted, reactive, onUnmounted, watch } from "vue";
import { RouterLink } from "vue-router";
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import SearchComponent from "../components/SearchComponent.vue";
import DialogSearch from "../components/DialogSearch.vue";
import PaginationComponent from "../components/PaginationComponent.vue";
import DialogComponent from "../components/DialogComponent.vue";
import { getMaterialAPI, addMaterialAPI, updateMaterialAPI, deleteMaterialAPI, getByIdAPI } from "../apis/material";


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


// 记录用于通过搜索组件输入的搜索种类及对应关键词
const search = (title, keyword) => {
  // console.log(title, keyword);
  if (title === "name") name.value = keyword
  if (title === "spec") spec.value = keyword


  if (title === "supplier") stockInform.supplier = keyword
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
const addDialog = ref()
const editDialog = ref()
const stockInDialog = ref()

const dialogClose = () => {
  dialog.value = false
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
const stockInform
  = reactive({
    name: '',
    spec: '',
    batch: '',
    amount: '',
    supplier: '',
    supplyTime: '',
    operateTime: '',
    operator: '',
    receipt: '',
  })


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

// 弹框内输入框搜索相关


const dialogSearchSuggestion = (title, keyword) => {
  if (title === "name") stockInform.name = keyword
  if (title === "spec") stockInform.spec = keyword
  updateSearchSuggestion()
  // console.log(stockInform);
}

// #endregion

//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------
//确认删除
//#region

import { ElMessage, ElMessageBox } from 'element-plus'

const del = async (id) => {
  const res = await deleteMaterialAPI(id);
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




</script>

<template>
  <!-- borderbox -->
  <dv-border-box1 ref="borderRef" class="subNavPage animate__animated animate__zoomIn" :color="['#4f698794', '#4f698794']"
    background-color="#4f698794">
    <!-- body -->
    <el-container class="subNavPage">
      <br />
      <h1>物料库存</h1>
      <!-- main -->
      <el-main style="overflow: hidden">
        <!-- search -->
        <div>
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
        </div>
        <br />
        <!-- operation -->
        <div style="display: flex; justify-content: space-between">
          <span>
            <el-button type="primary" @click="addDialog.dialogVisible = true, dialog = true">
              <Plus style="width: 1em; height: 1em; margin-right: 8px" />新增物料
            </el-button>

            <el-button type="primary">
              <Download style="width: 1em; height: 1em; margin-right: 8px" />导出
            </el-button>
          </span>
          <span>
            <el-button @click="stockInDialog.dialogVisible = true, dialog = true">入库</el-button>
            <el-button>出库</el-button>
            <el-button>转入不良物料 </el-button>
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
          <RouterLink to="/inventory/operation">操作记录</RouterLink>
        </div>

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
            <el-input v-model="addform.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="规格型号" prop="spec" :rules="[
            { required: true, message: '请输入规格型号', trigger: 'blur' },
            {
              min: 1, max: 30,
              message: '长度必须在1-30之间', trigger: 'blur'
            }]">
            <el-input v-model="addform.spec" autocomplete="off" />
          </el-form-item>
          <el-form-item label="低库存阈值" prop="threshold" :rules="[
            { required: true, message: '请输入阈值', trigger: 'blur' },
            { type: 'number', message: '阈值必须是数字', trigger: 'blur' }
          ]">
            <el-input v-model.number="addform.threshold" autocomplete="off" />
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
        <DialogComponent ref="stockInDialog" :form="stockInform" dialog-title="物料入库" :refreshFunc="getDataFromAPI"
          :confirm-func="addMaterialAPI" @dialogClose="dialogClose">
          <el-row>
            <el-col :span="12">
              <el-form-item label="物料名称" prop="name">
                <DialogSearch :key="renderKey" :wNo="100" search-title="物料名称" :searchContent=stockInform.name field="name"
                  @search="dialogSearchSuggestion" :data="stockInform" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="规格型号" prop="spec">
                <DialogSearch :key="renderKey" :wNo="100" search-title="规格型号" :searchContent=stockInform.spec field="spec"
                  @search="dialogSearchSuggestion" :data="stockInform" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="供料单位" prop="supplier">
            <!-- <DialogSearch :key="renderKey" search-title="供料单位" :searchContent=stockInform.supplier field="supplier"
              @search="dialogSearchSuggestion" :data="stockInform" database="materials/operation" /> -->
            <SearchComponent :key="renderKey" search-title="供料单位" :searchContent=stockInform.supplier field="supplier"
              @search="search" database="materials/operation" />

            <!-- <el-input v-model="stockInform.supplier" autocomplete="off" /> -->
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="入库人员" prop="operator">
                <el-input v-model="stockInform.operator" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="入库数量" prop="amount">
                <el-input v-model="stockInform.amount" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="入库日期" prop="operateTime">
                <el-input v-model="stockInform.operationTime" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供料日期" prop="supplierTime">
                <el-input v-model="stockInform.supplyTime" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="签收凭证" prop="receipt">
            <!-- <el-input v-model="stockInform.receipt" autocomplete="off" /> -->
            <el-upload v-model:file-list="fileList" class="upload-demo"
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" multiple :on-preview="handlePreview"
              :on-remove="handleRemove" :before-remove="beforeRemove" :limit="3" :on-exceed="handleExceed">
              <el-button type="primary">上传</el-button>
            </el-upload>
          </el-form-item>

        </DialogComponent>



        <!-- table -->
        <el-table :data="tableData.value" style="width: 100%; border-radius: 1vh" table-layout="fixed" height="48vh">
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

