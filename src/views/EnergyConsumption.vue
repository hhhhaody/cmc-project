<script setup>
import { ref, onMounted, reactive, watch, nextTick } from "vue";
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import SearchComponent from "../components/SearchComponent.vue";
// import DialogComponent from "../components/DialogComponent.vue";
import PaginationComponent from "../components/PaginationComponent.vue";
// import LineGraph from "../components/LineGraph.vue";
import { getEnergyConsumptionRecordsAPI, getFirstEnergyConsumptionRecordsAPI } from "../apis/energyConsumptionRecords";
import ExportButton from "@/components/ExportButton.vue";
import * as XLSX from 'xlsx';
import * as echarts from 'echarts';
import { useUserStore } from '../stores/store.js';
import { getEnergyAPI, getEnergyDatesAPI } from "../apis/data"

const userStore = useUserStore();

// 可响应的数据存储区域和初始状态
const sections = reactive([
  { name: "型钢切割工作站", tableData: [] },
  { name: "地面钢网工作站", tableData: [] },
  { name: "方通组焊工作站", tableData: [] },
  { name: "模块总装工作站", tableData: [] }
]);
const selectedSection = ref(sections[0]);
const total = ref(0);
const dateRange = ref([null, null]);
const showCustomDialog = ref(false);
const chartData = ref([]);

// 显示特定日期的详细能耗数据并初始化图表
// const showDetails = async (productionDate) => {
//   const params = {
//     page: 1,
//     pageSize: 10,
//     sectionName: selectedSection.value.name,
//     startDate: productionDate,
//     endDate: productionDate
//   };
//   const res = await getEnergyConsumptionRecordsAPI(params);
//   if (res.code === 1) {
//     chartData.value = res.data.data;
//     showCustomDialog.value = true; // 显示自定义弹窗
//     console.log(chartData.value); // 检查数据格式

//     await nextTick();
//     setTimeout(() => {
//       initCharts();
//     }, 500); // 增加延时时间
//   } else {
//     console.error('数据加载失败:', res.msg);
//   }
// };
const showDetails = async (date) => {
  const res = await getEnergyAPI(selectedSection.value.name, date);
  console.log(res.data);
  if (res.code === 1) {
    chartData.value = res.data;
    showCustomDialog.value = true; // 显示自定义弹窗
    console.log(chartData.value); // 检查数据格式

    await nextTick();
    setTimeout(() => {
      initCharts();
    }, 500); // 增加延时时间
  } else {
    console.error('数据加载失败:', res.msg);
  }

}

// 图表初始化函数，用于创建 echarts 图表
const energyChartRef = ref();
const powerChartRef = ref();
const style = {
  color: { 0: "#729fd0" },
  series: {

    itemStyle: {
      borderWidth: "2"
    },
    lineStyle: {
      width: "2",
      opacity: 0.6
    },
    symbolSize: "6",
    symbol: "none",
    smooth: true
  }
}
const initCharts = () => {
  if (energyChartRef.value && powerChartRef.value) {

    // const formattedTimes = chartData.value.map(item => formatTime(item.timestamp));
    // 初始化能耗图表
    const energyChart = echarts.init(energyChartRef.value);
    const energyOption = {
      title: {
        text: '能耗',
        left: 'center', // 将标题居中
      },
      tooltip: {
        trigger: 'axis', // 或 'item'，根据需求选择
        // 格式化 tooltip 文本
        formatter: (params) => {
          params = params[0];
          let date = new Date(params.value[0]);
          let hours = ("0" + date.getHours()).slice(-2); // 保证小时数为两位数
          let minutes = ("0" + date.getMinutes()).slice(-2); // 保证分钟数为两位数
          return (
            hours +
            ":" +
            minutes +
            " 能耗：" +
            params.value[1] +
            "kW·h"
          );
        }
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false,
        },
        formatter: '{HH}:{mm}'
      },
      yAxis: {
        type: 'value', boundaryGap: [0, "100%"],
        splitLine: {
          show: false,
        },
      },
      series: [{
        data: chartData.value.map((item, index) => {
          return [item.date + " " + item.time, item.avgConsumption];
        }),
        name: "功率",
        type: "line",
        // data: data.value,
      }]
    };
    energyChart.setOption(energyOption);
    energyChart.setOption(style);


    // 初始化功率图表
    const powerChart = echarts.init(powerChartRef.value);
    const powerOption = {
      title: {
        text: '功率',
        left: 'center' // 将标题居中
      },
      tooltip: {
        trigger: 'axis', // 或 'item'
        formatter: (params) => {
          params = params[0];
          let date = new Date(params.value[0]);
          let hours = ("0" + date.getHours()).slice(-2); // 保证小时数为两位数
          let minutes = ("0" + date.getMinutes()).slice(-2); // 保证分钟数为两位数
          return (
            hours +
            ":" +
            minutes +
            " 功率：" +
            params.value[1] +
            "W"
          );
        }
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false,
        },
        formatter: '{HH}:{mm}'
      },
      yAxis: {
        type: 'value', boundaryGap: [0, "100%"],
        splitLine: {
          show: false,
        },
      },
      series: [{
        data: chartData.value.map((item, index) => {
          return [item.date + " " + item.time, item.avgPower];
        }),
        type: 'line'
      }]
    };
    powerChart.setOption(powerOption);
    powerChart.setOption(style);
  }
};

// 格式化日期和时间的辅助函数
// const formatDate = (date) => date.toISOString().substr(0, 10);
// function formatTime(timestamp) {
//   const timePart = timestamp.split('T')[1];
//   return timePart ? timePart.substr(0, 5) : ''; // 返回小时和分钟部分
// }

// 更改当前选中的工作站部分并获取其数据
const changeSection = (section) => {
  selectedSection.value = section;
  getDataFromAPI();
};

// 从 API 获取数据的主要函数,获取每个生产日期下的第一条数据
// const getDataFromAPI = async () => {
//   let params = {
//     page: currentPage.value,
//     pageSize: pageSize.value,
//     sectionName: selectedSection.value.name,
//     startDate: dateRange.value[0] ? formatDate(new Date(dateRange.value[0])) : null,
//     endDate: dateRange.value[1] ? formatDate(new Date(dateRange.value[1])) : null
//   };

//   console.log("Sending request with params:", params);

//   const res = await getFirstEnergyConsumptionRecordsAPI(params);
//   if (res.code === 1 && res.data && Array.isArray(res.data.data)) {
//     console.log("Received filtered data:", res.data.data); // 打印接收到的数据，检查是否已过滤
//     selectedSection.value.tableData = res.data;
//     total.value = res.data.total;
//   } else {
//     console.error('数据加载失败:', res.msg);
//     selectedSection.value.tableData = []; // 清空数据以反映没有结果
//   }
// };


const getDataFromAPI = async () => {
  const res = await getEnergyDatesAPI(currentPage.value, pageSize.value, selectedSection.value.name, dateRange.value[0], dateRange.value[1]);
  console.log(res.data);
  // tableData.value = res.data.data;
  selectedSection.value.tableData = res.data;

  total.value = res.data.total
  // updateSearchSuggestion()

};

// 获取当前选中部分的表格数据
const getCurrentTableData = () => {
  if (selectedSection.value.tableData && Array.isArray(selectedSection.value.tableData.data)) {
    // console.log("Table data:", selectedSection.value.tableData.data);
    return selectedSection.value.tableData.data;
  }
  return [];
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

// 清空筛选条件
const resetFilters = () => {
  dateRange.value = [null, null];
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
  { key: 'id', title: '序号' },
  { key: 'sectionName', title: '工作站名称' },
  { key: 'date', title: '生产日期' },
  { key: 'time', title: '时间' },
  { key: 'avgPower', title: '功率' },
  { key: 'avgConsumption', title: '能耗' },
]);

const filterExportData = async (data) => {
  console.log(data);
  const selectedDates = data.map(row => row.date);
  console.log(selectedDates);
  const formattedData = [];

  for (const date of selectedDates) {
    try {
      const res = await getEnergyAPI(selectedSection.value.name, date);
      if (res.code === 1 && Array.isArray(res.data)) {
        const dailyData = res.data;
        formattedData.push(...dailyData);
      } else {
        console.error('数据加载失败:', res.msg);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  // console.log(formattedData);
  return formattedData;
};

const exportDailyData = async (date) => {
  let dailyData = chartData.value.filter(row => row.date === date);

  // 如果没有找到数据，从后端加载
  if (dailyData.length === 0) {
    const response = await getEnergyAPI(selectedSection.value.name, date);

    if (response.code === 1) {
      dailyData = response.data;
    } else {
      console.error('数据加载失败:', response.msg);
      return; // 在这里结束函数，因为没有数据可导出
    }
  }

  const formattedData = dailyData.map(row => ({
    sectionName: selectedSection.value.name,
    date: row.date,
    time: row.time,
    power: row.avgPower,
    energyConsumed: row.avgConsumption
  }));

  // 定义导出的表头
  const exportHeaders = [
    { header: '工作站名称', key: 'sectionName' },
    { header: '生产日期', key: 'date' },
    { header: '时间', key: 'time' },
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
  XLSX.writeFile(wb, `能耗统计记录${date}.xlsx`);
};

// 页面加载时自动执行的函数，用于获取初始数据
onMounted(() => {
  getDataFromAPI();
});

// 根据日期筛选更改重新获取数据
// watch(
//   [dateRange],
//   ([newDateRange, oldDateRange]) => {
//     getDataFromAPI();
//   }
// );


</script>

<template>
  <dv-border-box1 ref="borderRef" class="subNavPage animate__animated animate__zoomIn"
    :color="['#4f698794', '#4f698794']" background-color="#3545659e">
    <el-container class="subNavPage">
      <br />
      <h1>能耗统计记录</h1>
      <el-main style="overflow: hidden">
        <div class="input-row">
          <div>生产时间：
            <el-date-picker v-model="dateRange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
              title="日期范围" />
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
            <el-button v-if="!userStore.isReadOnly" type="primary">
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

        <!-- 自定义弹窗 -->
        <div v-if="showCustomDialog" class="custom-dialog">
          <div class="custom-dialog-content">
            <h2 class="dialog-title">能耗详情</h2>
            <div class="graphs-container">
              <div class="graph-block">
                <div id="energy-chart" ref="energyChartRef" style="width: 100%; height: 390px;"></div>
              </div>
              <div class="graph-block">
                <div id="power-chart" ref="powerChartRef" style="width: 100%; height: 390px;"></div>
              </div>
            </div>
            <el-button type="primary" @click="showCustomDialog = false">关闭</el-button>
          </div>
        </div>

        <div>
          <el-table :data="getCurrentTableData()" show-overflow-tooltip @selection-change="handleSelectionChange"
            style="width: 100%;margin-top: 1vh; border-radius: 1vh; margin-top: 1vh" table-layout="fixed" height="52vh">
            <el-table-column type="selection" align="center" />
            <el-table-column type="index" label="序号" align="center" min-width="60vh" />
            <el-table-column prop="date" label="生产日期" align="center" />
            <el-table-column prop="operation" label="能耗" align="center">
              <template #default="scope">
                <div class="flex justify-space-between flex-wrap gap-4">
                  <el-button style="color:rgb(114, 159, 208)" link @click="showDetails(scope.row.date)">详情</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column v-if="!userStore.isReadOnly" prop="operation" label="数据" align="center">
              <template #default="scope">
                <div class="flex justify-space-between flex-wrap gap-4">
                  <el-button style="color:rgb(114, 159, 208)" link
                    @click="exportDailyData(scope.row.date)">导出</el-button>
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
  position: relative;
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
  padding: 5px 10px;
  border-radius: 4px;
  background-color: white;
}

.custom-dialog {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  border-radius: 6px;
}

.custom-dialog-content {
  width: 800px;
  height: 470px;
}

.dialog-title {
  color: #303133;
  font-size: 20px;
  margin-top: 2px;
}

.graphs-container {
  display: flex;
  justify-content: space-between;
}

.graph-block {
  flex: 1;
  margin-right: 10px;
}

.graph-block:last-child {
  margin-right: 0;
}
</style>