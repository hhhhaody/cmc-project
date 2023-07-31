<script setup>
import { ref, onMounted, reactive } from "vue";
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import SearchComponent from "../components/SearchComponent.vue";

const tableData = [
  {
    name: "produc 1",
    model: "50*30*4500",
    produceDate: "2023-04-26",
    produceNo: 30,
  },
  {
    name: "produc 2",
    model: "50*30*4500",
    produceDate: "2023-02-21",
    produceNo: 100,
  },
  {
    name: "produc 3",
    model: "50*30*4500",
    produceDate: "2023-04-25",
    produceNo: 30,
  },
  {
    name: "produc 4",
    model: "50*30*4500",
    produceDate: "2023-05-13",
    produceNo: 210,
  },
  {
    name: "produc 5",
    model: "50*30*4500",
    produceDate: "2023-06-27",
    produceNo: 30,
  },
  {
    name: "produc 6",
    model: "50*30*4500",
    produceDate: "2023-04-18",
    produceNo: 210,
  },
  {
    name: "produc 7",
    model: "50*30*4500",
    produceDate: "2023-03-07",
    produceNo: 100,
  },
  {
    name: "produc 8",
    model: "50*30*4500",
    produceDate: "2023-04-26",
    produceNo: 200,
  },
  {
    name: "produc 9",
    model: "50*30*4500",
    produceDate: "2023-02-04",
    produceNo: 160,
  },
  {
    name: "produc 10",
    model: "50*30*4500",
    produceDate: "2023-05-26",
    produceNo: 90,
  },
  {
    name: "produc 11",
    model: "50*30*4500",
    produceDate: "2023-04-16",
    produceNo: 30,
  },
  {
    name: "produc 12",
    model: "50*30*4500",
    produceDate: "2023-04-26",
    produceNo: 30,
  },
  {
    name: "produc 13",
    model: "50*30*4500",
    produceDate: "2023-03-26",
    produceNo: 70,
  },
  {
    name: "produc 14",
    model: "50*30*4500",
    produceDate: "2023-02-12",
    produceNo: 60,
  },
];

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
  <dv-border-box1
    ref="borderRef"
    class="subNavPage animate__animated animate__zoomIn"
    :color="['#4f698794', '#4f698794']"
    background-color="#4f698794"
  >
    <!-- body -->
    <el-container class="subNavPage">
      <br />
      <h1>实际产量记录</h1>
      <!-- main -->
      <el-main style="overflow: hidden">
        <!-- search -->
        <div>
          <SearchComponent
            search-title="Product Name"
            :load-all-data="loadAllProduct"
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
              ><Download
                style="width: 1em; height: 1em; margin-right: 8px"
              />Download</el-button
            >
          </span>
        </div>

        <!-- table -->
        <div>
          <el-table
            :data="tableShown.value"
            show-overflow-tooltip
            style="width: 100%; border-radius: 1vh; margin-top: 1vh"
            table-layout="fixed"
            height="50vh"
          >
            <el-table-column type="selection" align="center" />
            <el-table-column
              type="index"
              label="Index"
              align="center"
              min-width="60vh"
            />
            <el-table-column prop="name" label="Name" align="center" />
            <el-table-column prop="model" label="Model" align="center" />
            <el-table-column
              prop="produceDate"
              label="Produce Date"
              align="center"
            />
            <el-table-column
              prop="produceNo"
              label="Produce No."
              align="center"
            />
          </el-table>
        </div>
      </el-main>
      <!-- pagination -->
      <el-footer style="display: flex; justify-content: center">
        <div class="demo-pagination-block">
          <el-pagination
            class="el_total-color"
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
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
  position: relative;
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

