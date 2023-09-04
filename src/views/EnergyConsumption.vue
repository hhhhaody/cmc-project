<script setup>
import { ref, onMounted, reactive } from "vue";
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import SearchComponent from "../components/SearchComponent.vue";
import DialogComponent from "../components/DialogComponent.vue";

const stations = ref([
  {
    name: "型钢切割工作站",
    tableData: [
      {
        productionTime: "2023-08-22",
      },
      {
        productionTime: "2023-08-22",
      },
      {
        productionTime: "2023-08-22",
      },
    ]
  },
  {
    name: "地面钢网工作站",
    tableData: [
    {
        productionTime: "2021-04-25",
      },
      {
        productionTime: "2021-04-25",
      },
      {
        productionTime: "2021-04-25",
      },
    ]
  },
  {
    name: "方通组焊工作站",
    tableData: [
      {
        productionTime: "2021-04-25",
      },
      {
        productionTime: "2021-04-25",
      },
      {
        productionTime: "2021-04-25",
      },
    ]
  },
  {
    name: "模块总装工作站",
    tableData: [
      {
        productionTime: "2021-04-25",
      },
      {
        productionTime: "2021-04-25",
      },
      {
        productionTime: "2021-04-25",
      },
    ]
  }
]);

const selectedStation = ref(stations.value[0]);

const changeStation = (station) => {
  selectedStation.value = station;
};

const getCurrentTableData = () => {
  return selectedStation.value.tableData;
};

const getCurrentTableDataLength = () => {
  return getCurrentTableData().length;
};

const addform = reactive({
  folder: '', //文件夹名称
})

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


//弹框相关
//新增
//#region
const dialog = ref(false)
const addDialog = ref()
const editDialog = ref()

const dialogClose = () => {
  dialog.value = false
}

const tableShown = reactive([]);

const loadAllProduct = () => {
  return [
    { value: "product 1", link: "https://github.com/vuejs/vue" },
    { value: "product 2", link: "https://github.com/ElemeFE/element" },
    { value: "product 3", link: "https://github.com/ElemeFE/cooking" },
    { value: "product 4", link: "https://github.com/ElemeFE/mint-ui" },
    { value: "product 5", link: "https://github.com/vuejs/vuex" },
    { value: "product 6", link: "https://github.com/vuejs/vue-router" },
  ];
};

const loadAllModel = () => {
  return [
    { value: "50*30*4500", link: "https://github.com/vuejs/vue" },
    { value: "30*30*4500", link: "https://github.com/ElemeFE/element" },
    { value: "30*30*5000", link: "https://github.com/ElemeFE/cooking" },
  ];
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
  pageSize.value = val;
  tableShown.value = getCurrentTableData().slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  );
};
const handleCurrentChange = (val) => {
  // console.log(`current page: ${val}`);
  currentPage.value = val;
  tableShown.value = getCurrentTableData().slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  );
};


onMounted(() => {
  tableShown.value = getCurrentTableData().slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  );
});

const startDate = ref(null); // 起始日期
const endDate = ref(null);   // 结束日期

</script>
<template>
  <!-- borderbox -->
  <dv-border-box1 ref="borderRef" class="subNavPage animate__animated animate__zoomIn" :color="['#4f698794', '#4f698794']"
    background-color="#4f698794">
    <!-- body -->
    <el-container class="subNavPage">
      <br />
      <h1>能耗统计记录</h1>
      <!-- main -->
      <el-main style="overflow: hidden">
        <!-- search -->
        <div class="input-row">
          <!-- <SearchComponent search-title="产品名称" :load-all-data="loadAllProduct" />
          <SearchComponent search-title="规格型号" :load-all-data="loadAllProduct" /> -->

          <div>生产时间：
            <el-date-picker v-model="startDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
              title="日期范围" :default-time="defaultTime1" />
          </div>

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
            <el-button type="primary">
              <Download style="width: 1em; height: 1em; margin-right: 8px" />导出
            </el-button>

            <el-dropdown class="tab">
              <span class="el-dropdown-link"> {{ selectedStation.name }} </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="station in stations" :key="station.name" @click="changeStation(station)">{{
                    station.name
                  }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </span>
        </div>

        <div>
          <el-table :data="getCurrentTableData()" show-overflow-tooltip
            style="width: 100%; border-radius: 1vh; margin-top: 1vh" table-layout="fixed" height="50vh">
            <el-table-column type="selection" align="center" />
            <el-table-column type="index" label="序号" align="center" min-width="60vh" />
            <el-table-column prop="productionTime" label="生产日期" align="center" />
            <el-table-column prop="operation" label="能耗" align="center">
              <div class="flex justify-space-between flex-wrap gap-4">
                <el-button style="color:rgb(114, 159, 208)" link>详情</el-button>
              </div>
            </el-table-column>
            <el-table-column prop="operation" label="数据" align="center">
              <div class="flex justify-space-between flex-wrap gap-4">
                <el-button style="color:rgb(114, 159, 208)" link>导出</el-button>
              </div>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
      <!-- pagination -->
      <el-footer style="display: flex; justify-content: center">
        <div class="demo-pagination-block">
          <el-pagination class="el_total-color" v-model:current-page="currentPage" v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]" :small="small" :disabled="disabled" :background="background"
            layout="total, sizes, prev, pager, next, jumper" :total="getCurrentTableData().length"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
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
  --el-dialog-border-radius: 1vh
}

:deep .el-overlay {
  background-color: rgba(37, 54, 83, 0.498);
}

.input-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  margin-left: 33%;
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

