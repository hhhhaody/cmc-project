<script setup>
import { ref, onMounted, reactive } from "vue";
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import SearchComponent from "../components/SearchComponent.vue";
import DialogComponent from "../components/DialogComponent.vue";

const tableData = [
  {
    deviceCode: "HJ50-001",
    section: "型钢切割工作站",
    station: "桁架",
    name: "桁架设备",
    model: "KJ264C-B0",
    purchaseDate: "2023-08-20",
    supplier: "*",
    deviceState: "正常使用",
  },
  {
    deviceCode: "HJ50-002",
    section: "型钢切割工作站",
    station: "型材翻转",
    name: "型材翻转设备",
    model: "KJ264C-B1",
    purchaseDate: "2023-08-10",
    supplier: "*",
    deviceState: "正常使用",
  },
  {
    deviceCode: "HJ50-003",
    section: "型钢切割工作站",
    station: "激光切割",
    name: "激光切割设备",
    model: "KJ264C-D0",
    purchaseDate: "2023-08-10",
    supplier: "*",
    deviceState: "正常使用",
  },
  {
    deviceCode: "HJ50-004",
    section: "型钢切割工作站",
    station: "机械臂下料",
    name: "机械臂下料设备",
    model: "KJ264C-D1",
    purchaseDate: "2023-08-10",
    supplier: "*",
    deviceState: "正常使用",
  },
  {
    deviceCode: "HJ50-005",
    section: "方通组焊工作站",
    station: "焊接机台1",
    name: "焊接机台设备",
    model: "KJ264C-F0",
    purchaseDate: "2023-08-10",
    supplier: "*",
    deviceState: "正常使用",
  },
  {
    deviceCode: "HJ50-006",
    section: "方通组焊工作站",
    station: "焊接机台2",
    name: "焊接机台设备",
    model: "KJ264C-F0",
    purchaseDate: "2023-08-10",
    supplier: "*",
    deviceState: "正常使用",
  },
  {
    deviceCode: "HJ50-007",
    section: "方通组焊工作站",
    station: "焊接机台3",
    name: "焊接机台设备",
    model: "KJ264C-F0",
    purchaseDate: "2023-08-10",
    supplier: "*",
    deviceState: "正常使用",
  },
  {
    deviceCode: "HJ50-008",
    section: "方通组焊工作站",
    station: "焊接机台4",
    name: "焊接机台设备",
    model: "KJ264C-F0",
    purchaseDate: "2023-08-10",
    supplier: "*",
    deviceState: "正常使用",
  },
  {
    deviceCode: "HJ50-009",
    section: "方通组焊工作站",
    station: "组合焊接",
    name: "焊接机台设备",
    model: "KJ264C-F0",
    purchaseDate: "2023-08-10",
    supplier: "*",
    deviceState: "正常使用",
  },
  {
    deviceCode: "HJ50-010",
    section: "方通组焊工作站",
    station: "桁架下料",
    name: "桁架设备",
    model: "KJ264C-F0",
    purchaseDate: "2023-08-10",
    supplier: "*",
    deviceState: "正常使用",
  },
  {
    deviceCode: "HJ50-011",
    section: "地面钢网工作站",
    station: "桁架上料",
    name: "桁架设备",
    model: "KJ264C-H1",
    purchaseDate: "2023-08-10",
    supplier: "*",
    deviceState: "正常使用",
  },
  {
    deviceCode: "HJ50-012",
    section: "地面钢网工作站",
    station: "焊接机器人",
    name: "焊接机器人",
    model: "KJ264C-H1",
    purchaseDate: "2023-08-10",
    supplier: "*",
    deviceState: "正常使用",
  },
  {
    deviceCode: "HJ50-013",
    section: "地面钢网工作站",
    station: "桁架下料",
    name: "桁架设备",
    model: "KJ264C-H1",
    purchaseDate: "2023-08-10",
    supplier: "*",
    deviceState: "正常使用",
  },
  {
    deviceCode: "HJ50-014",
    section: "模块总装工作站",
    station: "总装模台",
    name: "总装模台设备",
    model: "KJ264C-H0",
    purchaseDate: "2023-08-10",
    supplier: "*",
    deviceState: "正常使用",
  },
  {
    deviceCode: "HJ50-015",
    section: "模块总装工作站",
    station: "墙面夹具A",
    name: "墙面夹具设备",
    model: "KJ264C-H0",
    purchaseDate: "2023-08-10",
    supplier: "中科先进",
    deviceState: "正常使用",
  },
  {
    deviceCode: "HJ50-016",
    section: "模块总装工作站",
    station: "墙面夹具B",
    name: "墙面夹具设备",
    model: "KJ264C-H0",
    purchaseDate: "2023-08-10",
    supplier: "中科先进",
    deviceState: "正常使用",
  },
  {
    deviceCode: "HJ50-017",
    section: "模块总装工作站",
    station: "机器人焊接",
    name: "焊接机器人",
    model: "KJ264C-H0",
    purchaseDate: "2023-08-10",
    supplier: "中科先进",
    deviceState: "正常使用",
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
  section: '',  //工段名称
  station: '',  //工位名称
  name: '', //设备名称
  spec: '', //规格型号
  purchaseDate: '', //购买日期
  supplier: '', //供应商
  contact: '', //联系人
  contactPhone: '', //联系电话
  warranty: '', //保修期
  dailyMaintenance: '', //日常保养
  level1Maintenance: '', //一级维护
  secondaryMaintenance: '', //二级维护
  warrantyUnit: '月', //保修期单位
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
    background-color="#3545659e">
    <!-- body -->
    <el-container class="subNavPage">
      <br />
      <h1>设备台账管理</h1>
      <!-- main -->
      <el-main style="overflow: hidden">
        <!-- search -->
        <div>
          <SearchComponent :wNo="8" search-title="工段名称" :load-all-data="loadAllSection" />
          <SearchComponent :wNo="8" search-title="设备名称" :load-all-data="loadAllDevice" />
          <SearchComponent :wNo="8" search-title="规格型号" :load-all-data="loadAllModel" />
          <SearchComponent :wNo="8" search-title="供应商" :load-all-data="loadAllSupplier" />
          <SearchComponent :wNo="8" search-title="设备状态" :load-all-data="loadAllStates" />
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
              <Plus style="width: 1em; height: 1em; margin-right: 8px" />新增设备
            </el-button>
            <el-button type="primary">
              <Download style="width: 1em; height: 1em; margin-right: 8px" />导出
            </el-button>
          </span>
          <!-- record -->
          <div style="
              height: 4vh;
              line-height: 4vh;
              text-decoration: underline;
              color: #729fd0;
              padding-top: 1vh;
            ">
            设备状态记录
          </div>
        </div>


        <!-- 弹框区 -->
        <!-- 新增弹框 -->
        <DialogComponent ref="addDialog" :form="addform" dialog-title="新增设备" :refreshFunc="getDataFromAPI"
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
          <el-table-column type="index" align="center" min-width="15vh" />
          <el-table-column prop="deviceCode" label="设备编号" align="center" />
          <el-table-column prop="section" label="工段名称" align="center" />
          <el-table-column prop="station" label="工位名称" align="center" />
          <el-table-column prop="name" label="设备名称" align="center" />
          <el-table-column prop="model" label="规格型号" align="center" />
          <el-table-column prop="purchaseDate" label="购买日期" align="center" min-width="100vh" />
          <el-table-column prop="supplier" label="供应商" align="center" />
          <el-table-column prop="deviceState" label="设备状态" align="center" />
          <el-table-column prop="operation" label="操作" align="center" min-width="160vh">
            <el-button class="inline_button"> 编辑 </el-button>
            <el-button class="inline_button"> 删除 </el-button>
            <el-button class="inline_button"> 详情 </el-button>
            <el-button class="inline_button">
              状态
            </el-button></el-table-column>
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

