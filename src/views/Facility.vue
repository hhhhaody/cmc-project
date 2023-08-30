<script setup>
import { ref, onMounted, reactive } from "vue";
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import SearchComponent from "../components/SearchComponent.vue";

const tableData = [
  {
    deviceCode: "HJ50-001",
    section: "section 1",
    station: "station 2",
    name: "device 1",
    model: "50*30*4500",
    purchaseDate: "2023-04-26",
    supplier: "company 1",
    deviceState: "Normal",
  },
  {
    deviceCode: "HJ50-002",
    section: "section 2",
    station: "station 4",
    name: "device 2",
    model: "30*30*4500",
    purchaseDate: "2023-05-02",
    supplier: "company 1",
    deviceState: "Normal",
  },
  {
    deviceCode: "HJ50-003",
    section: "section 3",
    station: "station 2",
    name: "device 3",
    model: "50*30*4500",
    purchaseDate: "2023-05-06",
    supplier: "company 1",
    deviceState: "Repair/Maintenance",
  },
  {
    deviceCode: "HJ50-004",
    section: "section 1",
    station: "station 3",
    name: "device 4",
    model: "50*30*4500",
    purchaseDate: "2023-03-24",
    supplier: "company 1",
    deviceState: "Repair/Maintenance",
  },
  {
    deviceCode: "HJ50-005",
    section: "section 1",
    station: "station 2",
    name: "device 5",
    model: "50*30*4500",
    purchaseDate: "2023-05-02",
    supplier: "company 1",
    deviceState: "Normal",
  },
  {
    deviceCode: "HJ50-006",
    section: "section 3",
    station: "station 3",
    name: "device 6",
    model: "50*30*4500",
    purchaseDate: "2023-04-05",
    supplier: "company 3",
    deviceState: "Normal",
  },
  {
    deviceCode: "HJ50-001",
    section: "section 2",
    station: "station 3",
    name: "device 7",
    model: "50*30*4500",
    purchaseDate: "2023-05-21",
    supplier: "company 1",
    deviceState: "Repair/Maintenance",
  },
  {
    deviceCode: "HJ50-001",
    section: "section 1",
    station: "station 4",
    name: "device 8",
    model: "50*30*4500",
    purchaseDate: "2023-03-10",
    supplier: "company 2",
    deviceState: "Suspended",
  },
  {
    deviceCode: "HJ50-001",
    section: "section 1",
    station: "station 3",
    name: "device 1",
    model: "50*30*4500",
    purchaseDate: "2023-05-02",
    supplier: "company 2",
    deviceState: "Repair/Maintenance",
  },
  {
    deviceCode: "HJ50-001",
    section: "section 1",
    station: "station 4",
    name: "device 1",
    model: "50*30*4500",
    purchaseDate: "2023-05-02",
    supplier: "company 2",
    deviceState: "Suspended",
  },
  {
    deviceCode: "HJ50-001",
    section: "section 4",
    station: "station 4",
    name: "device 1",
    model: "30*30*5000",
    purchaseDate: "2023-05-02",
    supplier: "company 2",
    deviceState: "Normal",
  },
  {
    deviceCode: "HJ50-001",
    section: "section 4",
    station: "station 1",
    name: "device 1",
    model: "50*30*4500",
    purchaseDate: "2023-05-02",
    supplier: "company 1",
    deviceState: "Normal",
  },
  {
    deviceCode: "HJ50-001",
    section: "section 4",
    station: "station 5",
    name: "device 1",
    model: "50*30*4500",
    purchaseDate: "2023-05-02",
    supplier: "company 1",
    deviceState: "Normal",
  },
  {
    deviceCode: "HJ50-001",
    section: "section 3",
    station: "station 5",
    name: "device 1",
    model: "50*30*4500",
    purchaseDate: "2023-05-02",
    supplier: "company 1",
    deviceState: "Normal",
  },
  {
    deviceCode: "HJ50-001",
    section: "section 2",
    station: "station 5",
    name: "device 1",
    model: "30*30*5000",
    purchaseDate: "2023-05-02",
    supplier: "company 1",
    deviceState: "Suspended",
  },
  {
    deviceCode: "HJ50-001",
    section: "section 1",
    station: "station 3",
    name: "device 1",
    model: "50*30*4500",
    purchaseDate: "2023-05-02",
    supplier: "company 1",
    deviceState: "Suspended",
  },
  {
    deviceCode: "HJ50-001",
    section: "section 2",
    station: "station 2",
    name: "device 1",
    model: "50*30*4500",
    purchaseDate: "2023-05-02",
    supplier: "company 1",
    deviceState: "Normal",
  },
];

const tableShown = reactive([]);
const sections = ref([]);
const models = ref([]);
const devices = ref([]);
const suppliers = ref([]);

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
          <SearchComponent :wNo="8" search-title="Section Name" :load-all-data="loadAllSection" />
          <SearchComponent :wNo="8" search-title="Device Name" :load-all-data="loadAllDevice" />
          <SearchComponent :wNo="8" search-title="Model type" :load-all-data="loadAllModel" />
          <SearchComponent :wNo="8" search-title="Supplier" :load-all-data="loadAllSupplier" />
          <SearchComponent :wNo="8" search-title="Device State" :load-all-data="loadAllStates" />
          <el-button type="primary" style="margin-left: 10px; width: 7%">
            <Search style="width: 1em; height: 1em; margin-right: 8px" />Search
          </el-button>
          <el-button style="width: 7%">
            <DeleteFilled style="width: 1em; height: 1em; margin-right: 8px" />Reset
          </el-button>
        </div>
        <br />
        <!-- operation -->
        <div style="display: flex; justify-content: space-between">
          <span>
            <el-button type="primary">
              <Plus style="width: 1em; height: 1em; margin-right: 8px" />Add
              new material
            </el-button>
            <el-button type="primary">
              <Download style="width: 1em; height: 1em; margin-right: 8px" />Download
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
            Device Status Record
          </div>
        </div>

        <!-- table -->

        <el-table :data="tableShown.value" show-overflow-tooltip style="width: 100%; border-radius: 1vh; margin-top: 1vh"
          table-layout="fixed" height="50vh">
          <el-table-column type="selection" align="center" min-width="15vh" />
          <el-table-column type="index" align="center" min-width="15vh" />
          <el-table-column prop="deviceCode" label="Device No." align="center" />
          <el-table-column prop="section" label="Section" align="center" />
          <el-table-column prop="station" label="Station" align="center" />
          <el-table-column prop="name" label="Name" align="center" />
          <el-table-column prop="model" label="Model" align="center" />
          <el-table-column prop="purchaseDate" label="Purchase Date" align="center" min-width="100vh" />
          <el-table-column prop="supplier" label="Supplier" align="center" />
          <el-table-column prop="deviceState" label="State" align="center" />
          <el-table-column prop="operation" label="Operation" align="center" min-width="160vh">
            <el-button class="inline_button"> Edit </el-button>
            <el-button class="inline_button"> Delete </el-button>
            <el-button class="inline_button"> Details </el-button>
            <el-button class="inline_button">
              Suspend
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
</style>

