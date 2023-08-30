<script setup>
import { ref, onMounted, reactive } from "vue";
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import SearchComponent from "../components/SearchComponent.vue";
import DialogComponent from "../components/DialogComponent.vue";

const tableData = [
  {
    maintenanceName: "焊接机器人一级保养",
    spec: "M-000",
    station: "上料工位",
    section: "方通组焊工作站",
    maintainContent: "清洁焊接机器人表面",
    plannedMaintenance: "2023-04-13",
    actualMaintenance: "2023-04-13",
    maintenanceStaff: "方舟",
    maintenanceState: "完成",
    operation: "上报",
  },
  {
    maintenanceName: "切割机器人一级保养",
    spec: "M-000",
    station: "翻转机",
    section: "型钢切割工作站",
    maintainContent: "清洁切割机器人表面",
    plannedMaintenance: "2023-05-02",
    actualMaintenance: "2023-05-05",
    maintenanceStaff: "靳程锐",
    maintenanceState: "逾期",
    operation: "上报",
  },
  {
    maintenanceName: "切割机器人一级保养",
    spec: "M-000",
    station: "翻转机",
    section: "型钢切割工作站",
    maintainContent: "清洁切割机器人表面",
    plannedMaintenance: "2023-05-02",
    actualMaintenance: "2023-05-02",
    maintenanceStaff: "靳程锐",
    maintenanceState: "完成",
    operation: "上报",
  },
  {
    maintenanceName: "切割机器人一级保养",
    spec: "M-000",
    station: "翻转机",
    section: "型钢切割工作站",
    maintainContent: "清洁切割机器人表面",
    plannedMaintenance: "2023-05-02",
    actualMaintenance: "2023-05-02",
    maintenanceStaff: "靳程锐",
    maintenanceState: "完成",
    operation: "上报",
  },
  {
    maintenanceName: "切割机器人一级保养",
    spec: "M-000",
    station: "翻转机",
    section: "型钢切割工作站",
    maintainContent: "清洁切割机器人表面",
    plannedMaintenance: "2023-05-02",
    actualMaintenance: "2023-05-02",
    maintenanceStaff: "靳程锐",
    maintenanceState: "完成",
    operation: "上报",
  },
  {
    maintenanceName: "切割机器人一级保养",
    spec: "M-000",
    station: "翻转机",
    section: "型钢切割工作站",
    maintainContent: "清洁切割机器人表面",
    plannedMaintenance: "2023-05-02",
    actualMaintenance: "2023-05-02",
    maintenanceStaff: "靳程锐",
    maintenanceState: "完成",
    operation: "上报",
  },
  {
    maintenanceName: "切割机器人一级保养",
    spec: "M-000",
    station: "翻转机",
    section: "型钢切割工作站",
    maintainContent: "清洁切割机器人表面",
    plannedMaintenance: "2023-05-02",
    actualMaintenance: "2023-05-02",
    maintenanceStaff: "靳程锐",
    maintenanceState: "完成",
    operation: "上报",
  },
  {
    maintenanceName: "切割机器人一级保养",
    spec: "M-000",
    station: "翻转机",
    section: "型钢切割工作站",
    maintainContent: "清洁切割机器人表面",
    plannedMaintenance: "2023-05-02",
    actualMaintenance: "2023-05-02",
    maintenanceStaff: "靳程锐",
    maintenanceState: "完成",
    operation: "上报",
  },
  {
    maintenanceName: "切割机器人一级保养",
    spec: "M-000",
    station: "翻转机",
    section: "型钢切割工作站",
    maintainContent: "清洁切割机器人表面",
    plannedMaintenance: "2023-05-02",
    actualMaintenance: "2023-05-02",
    maintenanceStaff: "靳程锐",
    maintenanceState: "完成",
    operation: "上报",
  },
  {
    maintenanceName: "切割机器人一级保养",
    spec: "M-000",
    station: "翻转机",
    section: "型钢切割工作站",
    maintainContent: "清洁切割机器人表面",
    plannedMaintenance: "2023-05-02",
    actualMaintenance: "2023-05-02",
    maintenanceStaff: "靳程锐",
    maintenanceState: "完成",
    operation: "上报",
  },
  {
    maintenanceName: "切割机器人一级保养",
    spec: "M-000",
    station: "翻转机",
    section: "型钢切割工作站",
    maintainContent: "清洁切割机器人表面",
    plannedMaintenance: "2023-05-02",
    actualMaintenance: "2023-05-02",
    maintenanceStaff: "靳程锐",
    maintenanceState: "完成",
    operation: "上报",
  },
  {
    maintenanceName: "切割机器人一级保养",
    spec: "M-000",
    station: "翻转机",
    section: "型钢切割工作站",
    maintainContent: "清洁切割机器人表面",
    plannedMaintenance: "2023-05-02",
    actualMaintenance: "2023-05-02",
    maintenanceStaff: "靳程锐",
    maintenanceState: "完成",
    operation: "上报",
  },
  {
    maintenanceName: "切割机器人一级保养",
    spec: "M-000",
    station: "翻转机",
    section: "型钢切割工作站",
    maintainContent: "清洁切割机器人表面",
    plannedMaintenance: "2023-05-02",
    actualMaintenance: "2023-05-02",
    maintenanceStaff: "靳程锐",
    maintenanceState: "完成",
    operation: "上报",
  },
  {
    maintenanceName: "切割机器人一级保养",
    spec: "M-000",
    station: "翻转机",
    section: "型钢切割工作站",
    maintainContent: "清洁切割机器人表面",
    plannedMaintenance: "2023-05-02",
    actualMaintenance: "2023-05-02",
    maintenanceStaff: "靳程锐",
    maintenanceState: "完成",
    operation: "上报",
  },
  {
    maintenanceName: "切割机器人一级保养",
    spec: "M-000",
    station: "翻转机",
    section: "型钢切割工作站",
    maintainContent: "清洁切割机器人表面",
    plannedMaintenance: "2023-05-02",
    actualMaintenance: "2023-05-02",
    maintenanceStaff: "靳程锐",
    maintenanceState: "完成",
    operation: "上报",
  },
  {
    maintenanceName: "切割机器人一级保养",
    spec: "M-000",
    station: "翻转机",
    section: "型钢切割工作站",
    maintainContent: "清洁切割机器人表面",
    plannedMaintenance: "2023-05-02",
    actualMaintenance: "2023-05-02",
    maintenanceStaff: "靳程锐",
    maintenanceState: "完成",
    operation: "上报",
  },
  {
    maintenanceName: "切割机器人一级保养",
    spec: "M-000",
    station: "翻转机",
    section: "型钢切割工作站",
    maintainContent: "清洁切割机器人表面",
    plannedMaintenance: "2023-05-02",
    actualMaintenance: "2023-05-02",
    maintenanceStaff: "靳程锐",
    maintenanceState: "完成",
    operation: "上报",
  },
];

// 从后端获取数据
// const tableData = reactive([]);
const total = ref(0)
const getDataFromAPI = async () => {
  // const res = await getMaterialAPI(currentPage.value, pageSize.value, name.value, spec.value);
  // console.log(res.data);
  tableData.value = res.data.data;
  total.value = res.data.total
  updateSearchSuggestion()

};

const tableShown = reactive([]);
const sections = ref([]);
const models = ref([]);
const devices = ref([]);
const suppliers = ref([]);

//弹框相关
//新增
//#region
const dialog = ref(false)
const addDialog = ref()
const editDialog = ref()

const dialogClose = () => {
  dialog.value = false
}

//表单数据
const addform = reactive({
    maintenanceName: '', //维护名称
    spec: '', //规格型号
    station: '',  //工位名称
    section: '',  //工段名称
    maintainContent: '', //维护内容
    plannedMaintenance: '', //计划维护时间
    actualMaintenance: '', //实际维护时间
    maintenanceStaff: '', //维护人员
    maintenanceState: '', //维护状态
    operation: '', //操作
})

const loadAllSection = () => {
  return [
    { value: "section 1", link: "https://github.com/vuejs/vue" },
    { value: "section 2", link: "https://github.com/ElemeFE/element" },
    { value: "section 3", link: "https://github.com/ElemeFE/cooking" },
    { value: "section 4", link: "https://github.com/ElemeFE/mint-ui" },
    { value: "section 5", link: "https://github.com/vuejs/vuex" },
    { value: "section 6", link: "https://github.com/vuejs/vue-router" },
  ];
};
const loadAllDevice = () => {
  return [
    { value: "device 1", link: "https://github.com/vuejs/vue" },
    { value: "device 2", link: "https://github.com/ElemeFE/element" },
    { value: "device 3", link: "https://github.com/ElemeFE/cooking" },
    { value: "device 4", link: "https://github.com/ElemeFE/mint-ui" },
    { value: "device 5", link: "https://github.com/vuejs/vuex" },
    { value: "device 6", link: "https://github.com/vuejs/vue-router" },
  ];
};

const loadAllModel = () => {
  return [
    { value: "50*30*4500", link: "https://github.com/vuejs/vue" },
    { value: "30*30*4500", link: "https://github.com/ElemeFE/element" },
    { value: "30*30*5000", link: "https://github.com/ElemeFE/cooking" },
  ];
};
const loadAllSupplier = () => {
  return [
    { value: "supplier 1", link: "https://github.com/vuejs/vue" },
    { value: "supplier 2", link: "https://github.com/ElemeFE/element" },
    { value: "supplier 3", link: "https://github.com/ElemeFE/cooking" },
  ];
};

const loadAllStates = () => {
  return [
    { value: "Normal" },
    { value: "Repair/Maintenance" },
    { value: "Suspended" },
  ];
};

let timeout;
const querySearchAsyncSection = (queryString, cb) => {
  const results = queryString
    ? sections.value.filter(createFilter(queryString))
    : sections.value;

  clearTimeout(timeout);
  timeout = setTimeout(() => {
    cb(results);
  }, 1000 * Math.random());
};
const querySearchAsyncDevice = (queryString, cb) => {
  const results = queryString
    ? devices.value.filter(createFilter(queryString))
    : devices.value;

  clearTimeout(timeout);
  timeout = setTimeout(() => {
    cb(results);
  }, 1000 * Math.random());
};
const querySearchAsyncModel = (queryString, cb) => {
  const results = queryString
    ? models.value.filter(createFilter(queryString))
    : models.value;

  clearTimeout(timeout);
  timeout = setTimeout(() => {
    cb(results);
  }, 1000 * Math.random());
};
const querySearchAsyncSupplier = (queryString, cb) => {
  const results = queryString
    ? suppliers.value.filter(createFilter(queryString))
    : suppliers.value;

  clearTimeout(timeout);
  timeout = setTimeout(() => {
    cb(results);
  }, 1000 * Math.random());
};

const createFilter = (queryString) => {
  return (tableData) => {
    return (
      tableData.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    );
  };
};

const handleSelect = (item) => {
  console.log(item);
};

const currentPage = ref(1);
const pageSize = ref(10);
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
    background-color="#4f698794">
    <!-- body -->
    <el-container class="subNavPage">
      <br />
      <h1>设备维护计划</h1>

      <div style="
            height: 0vh;
            line-height: 0vh;
            /* text-decoration: underline;  */
            color: #729fd0;
            position: relative;
            left: 90%;
            width: fit-content; 
            cursor: pointer;
            font-size: 20px;
          ">
          <RouterLink to="/MaintenancePlan" style="margin-right: 10px; color: white;">日历</RouterLink>
          <RouterLink to="/MaintenancePlan/MaintainList" style="color: white;">列表</RouterLink>
        </div>

      <!-- main -->
      <el-main style="overflow: hidden">
        <!-- search -->
        <div>
          <SearchComponent :wNo="8" search-title="工段名称" :load-all-data="loadAllSection" />
          <SearchComponent :wNo="8" search-title="设备名称" :load-all-data="loadAllDevice" />
          <SearchComponent :wNo="8" search-title="规格型号" :load-all-data="loadAllModel" />
          <SearchComponent :wNo="8" search-title="维护状态" :load-all-data="loadAllSupplier" />
          <SearchComponent :wNo="8" search-title="维护人员" :load-all-data="loadAllStates" />
          <el-button type="primary" style="margin-left: 10px; width: 7%">
            <Search style="width: 1em; height: 1em; margin-right: 8px" />搜索
          </el-button>
          <el-button style="width: 7%">
            <DeleteFilled style="width: 1em; height: 1em; margin-right: 8px" />重置
          </el-button>
        </div>
        <br />
        <!-- operation -->
        <div style="display: flex; justify-content: space-between">
          <span>
            <el-button type="primary" @click="addDialog.dialogVisible = true, dialog = true">
              <Plus style="width: 1em; height: 1em; margin-right: 8px" />新增维护计划
            </el-button>
            <el-button type="primary">
              <Download style="width: 1em; height: 1em; margin-right: 8px" />导出
            </el-button>
          </span>
          <!-- record -->
          <!-- <div style="
              height: 4vh;
              line-height: 4vh;
              text-decoration: underline;
              color: #729fd0;
              padding-top: 1vh;
            ">
            设备状态记录
          </div> -->
          
        </div>


        <!-- 弹框区 -->
        <!-- 新增弹框 -->
        <DialogComponent ref="addDialog" :form="addform" dialog-title="新增维护计划" :refreshFunc="getDataFromAPI"
          :confirm-func="addMaterialAPI" @dialogClose="dialogClose">
          <div class="input-row">
            <el-form-item label="工段名称:" prop="section" :rules="[
              { required: true, message: '请选择工段名称', trigger: 'blur' },
              {
                min: 1, max: 30,
                message: '长度必须在1-30之间', trigger: 'blur'
              }]">
              <el-input v-model="addform.section" autocomplete="off" style="width: 240px;" />
            </el-form-item>

            <el-form-item label="工位名称:" prop="station" style="margin-left: 90px;" :rules="[
              { required: true, message: '请输入工位名称', trigger: 'blur' },
              {
                min: 1, max: 30,
                message: '长度必须在1-30之间', trigger: 'blur'
              }]">
              <el-input v-model="addform.station" autocomplete="off" style="width: 240px;" />
            </el-form-item>
          </div>

          <div class="input-row">
            <el-form-item label="设备名称:" prop="name" :rules="[
              { required: true, message: '请输入设备名称', trigger: 'blur' },
              {
                min: 1, max: 30,
                message: '长度必须在1-30之间', trigger: 'blur'
              }]">
              <el-input v-model="addform.name" autocomplete="off" style="width: 240px;" />
            </el-form-item>
            <el-form-item label="规格型号:" prop="spec" style="margin-left: 90px;" :rules="[
              { required: true, message: '请输入规格型号', trigger: 'blur' },
              {
                min: 1, max: 30,
                message: '长度必须在1-30之间', trigger: 'blur'
              }]">
              <el-input v-model="addform.spec" autocomplete="off" style="width: 240px;" />
            </el-form-item>
          </div>

          <div class="input-row">
            <el-form-item label="购买日期:" prop="purchaseDate" :rules="[
              { required: true, message: '请选择购买日期', trigger: 'blur' },
              {
                min: 1, max: 30,
                message: '长度必须在1-30之间', trigger: 'blur'
              }]">
              <el-date-picker v-model="addform.purchaseDate" type="date" placeholder="选择日期" style="width: 240px;" />
            </el-form-item>
            <el-form-item label="供货单位:" prop="supplier" style="margin-left: 90px;" :rules="[
              { required: true, message: '请输入供应商', trigger: 'blur' },
              {
                min: 1, max: 30,
                message: '长度必须在1-30之间', trigger: 'blur'
              }]">
              <el-input v-model="addform.supplier" autocomplete="off" style="width: 240px;" />
            </el-form-item>
          </div>

          <div class="input-row">
            <el-form-item label="联系人员:" prop="contact" :rules="[
              { required: true, message: '请输入联系人', trigger: 'blur' },
              {
                min: 1, max: 30,
                message: '长度必须在1-30之间', trigger: 'blur'
              }]">
              <el-input v-model="addform.contact" autocomplete="off" style="width: 240px;" />
            </el-form-item>
            <el-form-item label="联系电话:" prop="contactPhone" style="margin-left: 90px;" :rules="[
              { required: true, message: '请输入联系电话', trigger: 'blur' },
              {
                min: 1, max: 30,
                message: '长度必须在1-30之间', trigger: 'blur'
              },
              {
                pattern: /^1[3456789]\d{9}$/,
                message: '手机号格式错误',
                trigger: 'blur'
              }]">
              <el-input v-model="addform.contactPhone" autocomplete="off" style="width: 240px;" />
            </el-form-item>
          </div>

          <el-form-item label="质保期:" prop="warranty" :rules="[
            { required: true, message: '请输入质保期', trigger: 'blur' },
            {
              min: 1, max: 30,
              message: '长度必须在1-30之间', trigger: 'blur'
            },
            {
              pattern: /^[0-9]*$/,
              message: '请输入数字',
              trigger: 'blur'
            }]">
            <el-input v-model="addform.warranty" autocomplete="off" style="width: 240px;" />

            <el-select v-model="addform.warrantyUnit" style="width: 80px; margin-left: 10px;">
              <el-option label="月" value="月"></el-option>
              <el-option label="年" value="年"></el-option>
            </el-select>

          </el-form-item>

          <el-form-item label="保养周期:" :rules="[{required: true}]">
            <el-checkbox v-model="addform.dailyMaintenance" 
            style="font-size: 10px; transform: scale(1.1); margin-left: 4px;">日常保养</el-checkbox>
          </el-form-item>



          <el-form-item label="一级保养" prop="level1Maintenance" 
          style="margin-left: 130px;" 
          :rules="[
            {message: '请输入保养周期', trigger: 'blur' },
            {
              min: 1, max: 100,
              message: '长度必须在1-100之间', trigger: 'blur'
            },
            {
              pattern: /^[0-9]*$/,
              message: '请输入数字',
              trigger: 'blur'
            }]">
            <el-input v-model="addform.level1Maintenance" autocomplete="off" 
            style="width: 50%;"
            />

            <el-select v-model="addform.warrantyUnit" style="width: 80px; margin-left: 10px;">
              <el-option label="月" value="月"></el-option>
              <el-option label="年" value="年"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="二级保养" prop="secondaryMaintenance" 
          style="margin-left: 130px;"
          :rules="[
            {message: '请输入保养周期', trigger: 'blur' },
            {
              min: 1, max: 100,
              message: '长度必须在1-100之间', trigger: 'blur'
            },
            {
              pattern: /^[0-9]*$/,
              message: '请输入数字',
              trigger: 'blur'
            }]">
            <el-input v-model="addform.secondaryMaintenance" autocomplete="off" 
            style="width: 50%;"
            />

            <el-select v-model="addform.warrantyUnit" style="width: 80px; margin-left: 10px;">
              <el-option label="月" value="月"></el-option>
              <el-option label="年" value="年"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="附件">
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList2">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip"></div>
            </el-upload>
          </el-form-item>


          <!-- </el-form-item> -->

        </DialogComponent>

        <!-- table -->

        <el-table :data="tableShown.value" show-overflow-tooltip style="width: 100%; border-radius: 1vh; margin-top: 1vh"
          table-layout="fixed" height="50vh">
          <el-table-column type="selection" align="center" min-width="20vh" />
          <el-table-column type="index" align="center" min-width="70vh" />
          <el-table-column prop="maintenanceName" label="维护名称" align="center" />
          <el-table-column prop="spec" label="规格型号" align="center" />
          <el-table-column prop="station" label="工位名称" align="center" />
          <el-table-column prop="section" label="工段名称" align="center" />
          <el-table-column prop="maintainContent" label="维护内容" align="center" />
          <el-table-column prop="plannedMaintenance" label="计划完成维护时间" align="center" />
          <el-table-column prop="actualMaintenance" label="实际完成维护时间" align="center" />
          <el-table-column prop="maintenanceStaff" label="维护人员" align="center" />
          <el-table-column prop="maintenanceState" label="维护状态" align="center" />
          <el-table-column prop="operation" label="操作" align="center" min-width="100vh">
            <el-button class="inline_button"> 上报 </el-button>
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

.input-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

</style>

