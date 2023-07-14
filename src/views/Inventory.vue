<script setup>
import { ref, onMounted, reactive } from "vue";
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import SearchComponent from "../components/SearchComponent.vue";

const tableData = [
  {
    name: "material 1",
    model: "20x20",
    stockQuantity: 220,
    threshold: 100,
  },
  {
    name: "material 2",
    model: "20x30",
    stockQuantity: 100,
    threshold: 100,
  },
  {
    name: "material 3",
    model: "30x30",
    stockQuantity: 150,
    threshold: 100,
  },
  {
    name: "material 4",
    model: "40x40",
    stockQuantity: 260,
    threshold: 100,
  },
  {
    name: "material 5",
    model: "40x20",
    stockQuantity: 190,
    threshold: 100,
  },
  {
    name: "material 6",
    model: "20x20",
    stockQuantity: 150,
    threshold: 100,
  },
  {
    name: "material 6",
    model: "20x20",
    stockQuantity: 150,
    threshold: 100,
  },
  {
    name: "material 6",
    model: "20x20",
    stockQuantity: 150,
    threshold: 100,
  },
  {
    name: "material 6",
    model: "20x20",
    stockQuantity: 150,
    threshold: 100,
  },
  {
    name: "material 6",
    model: "20x20",
    stockQuantity: 150,
    threshold: 100,
  },
  {
    name: "material 6",
    model: "20x20",
    stockQuantity: 150,
    threshold: 100,
  },
];

const tableShown = reactive([]);
const materials = ref([]);
const models = ref([]);
const material = ref("");
const model = ref("");
const loadAllMaterial = () => {
  return [
    { value: "material 1", link: "https://github.com/vuejs/vue" },
    { value: "material 2", link: "https://github.com/ElemeFE/element" },
    { value: "material 3", link: "https://github.com/ElemeFE/cooking" },
    { value: "material 4", link: "https://github.com/ElemeFE/mint-ui" },
    { value: "material 5", link: "https://github.com/vuejs/vuex" },
    { value: "material 6", link: "https://github.com/vuejs/vue-router" },
  ];
};

const loadAllModel = () => {
  return [
    { value: "20x20", link: "https://github.com/vuejs/vue" },
    { value: "20x30", link: "https://github.com/ElemeFE/element" },
    { value: "30x30", link: "https://github.com/ElemeFE/cooking" },
    { value: "40x40", link: "https://github.com/ElemeFE/mint-ui" },
    { value: "40x20", link: "https://github.com/vuejs/vuex" },
  ];
};

let timeout;
const querySearchAsyncMaterial = (queryString, cb) => {
  const results = queryString
    ? materials.value.filter(createFilter(queryString))
    : materials.value;

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

const currentPage1 = ref(1);
const currentPage2 = ref(5);
const currentPage3 = ref(5);
const currentPage4 = ref(4);
const pageSize2 = ref(20);
const pageSize3 = ref(20);
const pageSize4 = ref(40);
const small = ref(false);
const background = ref(true);
const disabled = ref(false);

const handleSizeChange = (val) => {
  // console.log(`${val} items per page`);
  pageSize2.value = val;
  tableShown.value = tableData.slice(
    (currentPage1.value - 1) * pageSize2.value,
    currentPage1.value * pageSize2.value
  );
};
const handleCurrentChange = (val) => {
  // console.log(`current page: ${val}`);
  currentPage1.value = val;
  tableShown.value = tableData.slice(
    (currentPage1.value - 1) * pageSize2.value,
    currentPage1.value * pageSize2.value
  );
};

// const selectable = () => {};

onMounted(() => {
  // materials.value = loadAllMaterial();
  // models.value = loadAllModel();
  tableShown.value = tableData.slice(
    (currentPage1.value - 1) * pageSize2.value,
    currentPage1.value * pageSize2.value
  );
});
</script>
<template>
  <!-- borderbox -->
  <dv-border-box1
    ref="borderRef"
    class="subNavPage animate__animated animate__zoomIn"
    :color="['#4f698794', '#4f698794']"
    background-color="#4f698794"
  >
    <!-- body -->
    <el-container class="subNavPage">
      <br />
      <h1>物料库存</h1>
      <!-- main -->
      <el-main style="overflow: hidden">
        <!-- search -->
        <div>
          <SearchComponent
            search-title="Material Name"
            :load-all-data="loadAllMaterial"
          />
          <SearchComponent
            search-title="Model type"
            :load-all-data="loadAllModel"
          />
          <el-button type="primary" style="margin-left: 10px; width: 7%"
            ><Search
              style="width: 1em; height: 1em; margin-right: 8px"
            />Search</el-button
          >
          <el-button style="width: 7%"
            ><DeleteFilled
              style="width: 1em; height: 1em; margin-right: 8px"
            />Reset</el-button
          >
        </div>
        <br />
        <!-- operation -->
        <div style="display: flex; justify-content: space-between">
          <span>
            <el-button type="primary"
              ><Plus style="width: 1em; height: 1em; margin-right: 8px" />Add
              new material</el-button
            >
            <el-button type="primary"
              ><Download
                style="width: 1em; height: 1em; margin-right: 8px"
              />Download</el-button
            >
          </span>
          <span>
            <el-button>Inbound</el-button>
            <el-button>Outbound</el-button>
            <el-button>Transfer </el-button>
          </span>
        </div>
        <!-- record -->
        <div
          style="
            height: 4vh;
            line-height: 4vh;
            text-decoration: underline;
            color: #729fd0;
            position: relative;
            left: 44%;
          "
        >
          Operation Record
        </div>
        <!-- table -->
        <el-table
          :data="tableShown.value"
          style="width: 100%; border-radius: 1vh"
          table-layout="fixed"
          height="48vh"
        >
          <el-table-column type="selection" align="center" />
          <el-table-column
            label="Index"
            type="index"
            align="center"
            min-width="70vh"
          />
          <el-table-column prop="name" label="Name" align="center" />
          <el-table-column prop="model" label="Model" align="center" />
          <el-table-column
            prop="stockQuantity"
            label="Stock Quantity"
            align="center"
          />
          <el-table-column prop="threshold" label="Threshold" align="center" />
          <el-table-column prop="operation" label="Operation" align="center">
            <el-button class="inline_button"> Edit </el-button>
            <el-button class="inline_button">
              Delete
            </el-button></el-table-column
          >
        </el-table>
      </el-main>
      <!-- pagination -->
      <el-footer style="display: flex; justify-content: center">
        <div class="demo-pagination-block">
          <el-pagination
            class="el_total-color"
            v-model:current-page="currentPage1"
            v-model:page-size="pageSize2"
            :page-sizes="[10, 20, 50, 100]"
            :small="small"
            :disabled="disabled"
            :background="background"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          /></div
      ></el-footer>
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

.demo-pagination-block + .demo-pagination-block {
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

