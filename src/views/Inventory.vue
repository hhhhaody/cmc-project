<script setup>
import { ref, onMounted, reactive, onUnmounted, watch } from "vue";
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import SearchComponent from "../components/SearchComponent.vue";
import PaginationComponent from "../components/PaginationComponent.vue";
import { getMaterialAPI, addMaterialAPI, deleteMaterialAPI } from "../apis/material";

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
const search1 = ref();
const search2 = ref();
//用于重新加载搜索框和搜索建议
const renderKey = ref(0)
const updateSearchSuggestion = () => {
  renderKey.value = renderKey.value + 1
}

//默认为可刷新状态，如搜索框处于编辑状态，则变为false
const refresh = ref(true)
const edit = (val) => {
  if (val) refresh.value = false
  else refresh.value = true
};

// 记录用于通过搜索组件输入的搜索种类及对应关键词
const search = (title, keyword) => {
  // console.log(title, keyword);
  if (title === "name") name.value = keyword
  if (title === "spec") spec.value = keyword
};

// 根据关键字搜索数据库
const update = () => {
  getDataFromAPI()
};

// 清空搜索组件的关键字搜索，并初始化表格展示数据
const reset = () => {
  name.value = "";
  spec.value = "";
  search1.value.searchContent = "";
  search2.value.searchContent = "";
  getDataFromAPI()
};
//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------
//分页组件相关
const currentPage = ref(1);
const pageSize = ref(10);
const name = ref("")
const spec = ref("")

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

//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------
//弹框相关
const addFormVisible = ref(false)
const formLabelWidth = '10vh'

//表单数据
const form = reactive({
  name: '',
  spec: '',
  threshold: ''
})

const addform = ref()

//清空表单并关闭弹框
const clear = () => {
  // console.log(form);
  form.name = '',
    form.spec = '',
    form.threshold = ''
  addFormVisible.value = false
  getDataFromAPI()

}

//表单验证
const submitForm = async (form) => {
  if (!form) return
  await form.validate((valid, fields) => {
    if (valid) {
      //向数据库发送增加请求并更新列表

      // console.log('submit!')
      add()
      clear()
    } else {
      console.log('error submit!', fields)
    }
  })

}

//发送表单中的数据给数据库, 成功后关闭弹框
const add = async () => {
  const res = await addMaterialAPI(form);
  if (res.code === 1) {
    addFormVisible.value = false
    getDataFromAPI()
  }
  // console.log(res);
};



//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------
//确认删除

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
      console.log(id);
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

//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------
//定时器 实时刷新数据相关
const timer = ref()

const startTimer = () => {
  //创建定时器来实时更新数据
  timer.value = setInterval(() => {
    console.log("实时刷新中");
    getDataFromAPI()
  }, 2000)
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
watch([addFormVisible, refresh], (val1, val2) => {
  // console.log(`dialog visible is ${val1[0]}, refresh is ${val1[1]}`)
  if (val1[0] | !val1[1]) clearInterval(timer.value)
  else startTimer()
})
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
          <SearchComponent :key="renderKey" search-title="物料名称" ref="search1" field="name" @search="search"
            @edit="edit" />
          <SearchComponent :key="renderKey" search-title="规格型号" ref="search2" field="spec" @search="search"
            @edit="edit" />
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
            <el-button type="primary" @click="addFormVisible = true">
              <Plus style="width: 1em; height: 1em; margin-right: 8px" />新增物料
            </el-button>

            <el-button type="primary">
              <Download style="width: 1em; height: 1em; margin-right: 8px" />导出
            </el-button>
          </span>
          <span>
            <el-button>入库</el-button>
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
            left: 44%;
          ">
          操作记录
        </div>

        <!-- 弹框区 -->
        <el-dialog v-model="addFormVisible" title="新增物料类型" align-center destroy-on-close>
          <el-form ref="addform" :model="form" label-position=left :label-width="formLabelWidth" @submit.prevent>
            <el-form-item label="物料名称" prop="name" :rules="[
              { required: true, message: '请输入物料名称', trigger: 'blur' },
              {
                min: 1, max: 30,
                message: '长度必须在1-30之间', trigger: 'blur'
              }]">
              <el-input v-model="form.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="规格型号" prop="spec" :rules="[
              { required: true, message: '请输入规格型号', trigger: 'blur' },
              {
                min: 1, max: 30,
                message: '长度必须在1-30之间', trigger: 'blur'
              }]">
              <el-input v-model="form.spec" autocomplete="off" />
            </el-form-item>
            <el-form-item label="低库存阈值" prop="threshold" :rules="[
              { required: true, message: '请输入阈值', trigger: 'blur' },
              { type: 'number', message: '阈值必须是数字', trigger: 'blur' }
            ]">
              <el-input v-model.number="form.threshold" autocomplete="off" />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="clear">取消</el-button>
              <el-button type="primary" @click="submitForm(addform)">
                确定
              </el-button>
            </span>
          </template>
        </el-dialog>


        <!-- table -->
        <el-table :data="tableData.value" style="width: 100%; border-radius: 1vh" table-layout="fixed" height="48vh">
          <el-table-column type="selection" align="center" />
          <el-table-column label="Index" type="index" align="center" min-width="70vh" />
          <el-table-column prop="name" label="物料名称" align="center" />
          <el-table-column prop="spec" label="规格型号" align="center" />
          <el-table-column prop="amount" label="库存数量" align="center" />
          <el-table-column prop="threshold" label="低库存阈值" align="center" />
          <el-table-column prop="operation" label="操作" align="center">
            <template #default="scope">
              <el-button class="inline_button"> 编辑 </el-button>
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

