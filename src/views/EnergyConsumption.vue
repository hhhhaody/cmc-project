<script setup>
import { ref, onMounted, reactive, watch } from "vue";
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import SearchComponent from "../components/SearchComponent.vue";
import DialogComponent from "../components/DialogComponent.vue";
import PaginationComponent from "../components/PaginationComponent.vue";
import LineGraph from "../components/LineGraph.vue";
import PowerGraph from "../components/PowerGraph.vue";
import { getEnergyConsumptionRecordsAPI } from "../apis/energyConsumptionRecords";
import ExportButton from "@/components/ExportButton.vue";
import * as XLSX from 'xlsx';

const sections = reactive([
  { name: "型钢切割工作站", tableData: [] },
  { name: "地面钢网工作站", tableData: [] },
  { name: "方通组焊工作站", tableData: [] },
  { name: "模块总装工作站", tableData: [] }
]);

const selectedSection = ref(sections[0]);
const total = ref(0);
const startDate = ref(null);
const endDate = ref(null);
const showDialog = ref(false);
const dialogComponentRef = ref(null);
const refreshFunction = () => {
  // 你的刷新逻辑代码，如果不需要刷新，这里可以为空
};

const showDetails = (productionDate) => {
  const dataForSelectedDate = selectedSection.value.tableData.filter(row => row.productionDate === productionDate);
  dialogComponentRef.value.dataForDate = dataForSelectedDate;
  dialogComponentRef.value.dialogVisible = true;
};


const formatDate = (date) => date.toISOString().substr(0, 10); // 新增的日期格式化函数

const changeSection = (section) => {
  selectedSection.value = section;
  getDataFromAPI();
};

const getDataFromAPI = async () => {
  let params = {
    page: currentPage.value,
    pageSize: pageSize.value,
    sectionName: selectedSection.value.name
  };

  // 检查startDate和endDate是否存在并且是数组
  if (startDate.value && Array.isArray(startDate.value)) {
    params.startDate = formatDate(new Date(startDate.value[0])); // 使用新增的函数
    params.endDate = formatDate(new Date(startDate.value[1])); // 使用新增的函数
  }

  // 使用params发送API请求
  const res = await getEnergyConsumptionRecordsAPI(params);
  // console.log('API Response:', res.data);

  selectedSection.value.tableData = res.data.data;
  total.value = res.data.total;
};


const getCurrentTableData = () => {
  return selectedSection.value.tableData || [];
};


//分页组件相关
//#region
const currentPage = ref(1);
const pageSize = ref(10);

//分页器回传的每页条数
const size = (val) => {
  // console.log("Size function called with:", val);
  pageSize.value = val;
  getDataFromAPI();
};

//分页器回传的当前页
const cur = (val) => {
  // console.log("Cur function called with:", val);
  currentPage.value = val;
  getDataFromAPI();
};

const resetFilters = () => {
  startDate.value = null;
  endDate.value = null;
  getDataFromAPI();
};

//导出组件相关
const selectedRows = ref([]);
const handleSelectionChange = (selected) => {
  // console.log('Handling selection change:', selected);
  selectedRows.value = selected;
  // console.log('selectedRows after update:', selectedRows.value);
};
const headers = ref([
  { key: 'sectionName', title: '工作站名称' },
  { key: 'productionDate', title: '生产日期' },
  { key: 'timestamp', title: '时间戳' },
  { key: 'current', title: '电流' },
  { key: 'voltage', title: '电压' },
  { key: 'power', title: '功率' },
  { key: 'energyConsumed', title: '能耗' },
]);
const filterExportData = (data) => {
  return data.map(row => ({
    ...row,
    sectionName: selectedSection.value.name
  }));
};

const exportDailyData = (productionDate) => {
  const dailyData = selectedSection.value.tableData.filter(row => row.productionDate === productionDate);

  const formattedData = dailyData.map(row => ({
    sectionName: selectedSection.value.name,
    productionDate: row.productionDate,
    timestamp: row.timestamp,
    current: row.current,
    voltage: row.voltage,
    power: row.power,
    energyConsumed: row.energyConsumed
  }));

  // 定义导出的表头
  const exportHeaders = [
    { header: '工作站名称', key: 'sectionName' },
    { header: '生产日期', key: 'productionDate' },
    { header: '时间戳', key: 'timestamp' },
    { header: '电流', key: 'current' },
    { header: '电压', key: 'voltage' },
    { header: '功率', key: 'power' },
    { header: '能耗', key: 'energyConsumed' },
  ];

  // 使用 xlsx 工具创建工作簿和工作表
  const wb = XLSX.utils.book_new();

  // 将表头和数据结合在一起
  const allData = [exportHeaders.map(h => h.header)].concat(formattedData.map(row => exportHeaders.map(h => row[h.key])));

  const ws = XLSX.utils.aoa_to_sheet(allData);

  // 为工作表设置列的数据类型，确保数据格式正确
  ws['!cols'] = exportHeaders.map(header => ({ wch: header.key.length + 5 })); // 定义列宽度

  XLSX.utils.book_append_sheet(wb, ws, '能耗统计记录');
  XLSX.writeFile(wb, `能耗统计记录${productionDate}.xlsx`);
};

onMounted(() => {
  getDataFromAPI();
});

watch([startDate, endDate], getDataFromAPI);
</script>
<template>
  <dv-border-box1 ref="borderRef" class="subNavPage animate__animated animate__zoomIn" :color="['#4f698794', '#4f698794']"
    background-color="#3545659e">
    <el-container class="subNavPage">
      <br />
      <h1>能耗统计记录</h1>
      <el-main style="overflow: hidden">
        <div class="input-row">
          <div>生产时间：
            <el-date-picker v-model="startDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
              title="日期范围" :default-time="defaultTime1" />
          </div>

          <el-button @click="getDataFromAPI" type="primary" style="margin-left: 10px; width: 7%">
            <Search style="width: 1em; height: 1em; margin-right: 8px" />搜索
          </el-button>
          <el-button @click="resetFilters" style="width: 7%">
            <DeleteFilled style="width: 1em; height: 1em; margin-right: 8px" />清空
          </el-button>
        </div>
        <br />
        <!-- operation -->
        <div style="display: flex; justify-content: space-between">
          <span>
            <el-button type="primary">
              <ExportButton v-model="selectedRows" :headers="headers" :tableData="getCurrentTableData()"
                fileName="能耗统计记录.xlsx" :filterFunction="filterExportData" buttonLabel="导出" />
            </el-button>


          </span>
          <el-button>
            <el-dropdown>
              <span class="el-dropdown-link"> {{ selectedSection.name }} </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="section in sections" :key="section.name" @click="changeSection(section)">{{
                    section.name
                  }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-button>
        </div>

        <DialogComponent ref="dialogComponentRef" :dataForDate="dataForSelectedDate" dialogTitle="能耗详情"
          :dialogVisible.sync="showDialog" :form="yourFormObject" :confirmFunc="yourConfirmFunction"
          :refreshFunc="refreshFunction" hideFooter="true" @close="showDialog = false">
          <div class="graphs-container">
            <div class="graph-block">
              <h3 class="graph-title">能耗</h3>
              <LineGraph :station="selectedSection.name" :stations="sections.map(s => s.name)" width="280px"
                height="280px" />
            </div>

            <div class="graph-block">
              <h3 class="graph-title">功率</h3>
              <PowerGraph :station="selectedSection.name" :stations="sections.map(s => s.name)" width="280px"
                height="280px" />
            </div>
          </div>
        </DialogComponent>

        <div>
          <el-table :data="getCurrentTableData()" show-overflow-tooltip @selection-change="handleSelectionChange"
            style="width: 100%; border-radius: 1vh; margin-top: 1vh" table-layout="fixed" height="50vh">
            <el-table-column type="selection" align="center" />
            <el-table-column type="index" label="序号" align="center" min-width="60vh" />
            <el-table-column prop="productionDate" label="生产日期" align="center" />
            <el-table-column prop="operation" label="能耗" align="center">
              <div class="flex justify-space-between flex-wrap gap-4">
                <el-button style="color:rgb(114, 159, 208)" link @click="showDetails">详情</el-button>
              </div>
            </el-table-column>
            <el-table-column prop="operation" label="数据" align="center">
              <template #default="scope">
                <div class="flex justify-space-between flex-wrap gap-4">
                  <el-button style="color:rgb(114, 159, 208)" link
                    @click="exportDailyData(scope.row.productionDate)">导出</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
      <!-- pagination -->
      <el-footer style="display: flex; justify-content: center">
        <div class="demo-pagination-block">
          <PaginationComponent :total="total" @size="size" @cur="cur" />
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
  position: relative;
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
  --el-dialog-border-radius: 1vh;
  background-color: #729fd0;
}

.graph-title {
  padding-left: 10px;
  align-items: center;
}

:deep .el-overlay {
  background-color: rgba(37, 54, 83, 0.498);
}

.input-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  align-items: center;
  margin-bottom: 12px;
  /* margin-left: 5%; */
  position: relative;
}

.graphs-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.graph-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  margin: 0 10px;
}

.graph-title {
  margin-bottom: 15px;
}

.tab {
  display: inline-block;
  /* width: 10vh; */
  right: 2vh;
  position: absolute;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  font-size: medium;
  color: #606266;
  border: 1px solid #fff;
  /* 添加白色边框 */
  padding: 5px 10px;
  border-radius: 4px;
  background-color: white;
}
</style>

