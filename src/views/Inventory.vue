<script setup>
import { ref, onMounted, reactive, watch } from "vue";
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import SearchComponent from "../components/SearchComponent.vue";
import PaginationComponent from "../components/PaginationComponent.vue";

const search1 = ref();
const search2 = ref();
const pagination = ref();
const tableData = [
  {
    物料名称: "material 1",
    规格型号: "20x20",
    stockQuantity: 220,
    threshold: 100,
  },
  {
    物料名称: "material 2",
    规格型号: "20x30",
    stockQuantity: 100,
    threshold: 100,
  },
  {
    物料名称: "material 3",
    规格型号: "30x30",
    stockQuantity: 150,
    threshold: 100,
  },
  {
    物料名称: "material 4",
    规格型号: "40x40",
    stockQuantity: 260,
    threshold: 100,
  },
  {
    物料名称: "material 5",
    规格型号: "40x20",
    stockQuantity: 190,
    threshold: 100,
  },
  {
    物料名称: "material 6",
    规格型号: "20x20",
    stockQuantity: 150,
    threshold: 100,
  },
  {
    物料名称: "material 6",
    规格型号: "20x20",
    stockQuantity: 150,
    threshold: 100,
  },
  {
    物料名称: "material 6",
    规格型号: "20x20",
    stockQuantity: 150,
    threshold: 100,
  },
  {
    物料名称: "material 6",
    规格型号: "20x20",
    stockQuantity: 150,
    threshold: 100,
  },
  {
    物料名称: "material 6",
    规格型号: "20x20",
    stockQuantity: 150,
    threshold: 100,
  },
  {
    物料名称: "material 6",
    规格型号: "20x20",
    stockQuantity: 150,
    threshold: 100,
  },
];

const tableShown = reactive([]);
// tableShown.value = pagination.value.tableShown.value;

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

const total = ref(tableData.length);

let query = new Map();
const search = (title, keyword) => {
  // console.log(title, keyword);
  query.set(title, keyword);
  // console.log(query.keys());
};

const filter = () => {
  tableShown.value = tableData;
  query.forEach((val, key) => {
    // console.log(key, val);
    tableShown.value = tableShown.value.filter((e) => e[key] === val);
  });
  total.value = tableShown.value.length;
};

const reset = () => {
  tableShown.value = tableData;
  query.clear();
  total.value = tableData.length;
  search1.value.searchContent = "";
  search2.value.searchContent = "";
};

const currentPage = ref(1);
const pageSize = ref(10);
// const small = ref(false);
// const background = ref(true);
// const disabled = ref(false);

// const handleSizeChange = (val) => {
//   // console.log(`${val} items per page`);
//   pageSize.value = val;
//   tableShown.value = tableData.slice(
//     (currentPage.value - 1) * pageSize.value,
//     currentPage.value * pageSize.value
//   );
// };
// const handleCurrentChange = (val) => {
//   // console.log(`current page: ${val}`);
//   currentPage.value = val;
//   tableShown.value = tableData.slice(
//     (currentPage.value - 1) * pageSize.value,
//     currentPage.value * pageSize.value
//   );
// };

// const selectable = () => {};

onMounted(() => {
  // materials.value = loadAllMaterial();
  // models.value = loadAllModel();
  // tableShown.value = tableData.slice(
  //   (currentPage.value - 1) * pageSize.value,
  //   currentPage.value * pageSize.value
  // );
  tableShown.value = pagination.value.tableShown.value;
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
            search-title="物料名称"
            ref="search1"
            :load-all-data="loadAllMaterial"
            @search="search"
          />
          <SearchComponent
            search-title="规格型号"
            ref="search2"
            :load-all-data="loadAllModel"
            @search="search"
          />
          <el-button
            type="primary"
            style="margin-left: 10px; width: 7%"
            @click="filter"
            ><Search
              style="width: 1em; height: 1em; margin-right: 8px"
            />搜索</el-button
          >
          <el-button style="width: 7%" @click="reset"
            ><DeleteFilled
              style="width: 1em; height: 1em; margin-right: 8px"
            />清空</el-button
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
          <el-table-column prop="物料名称" label="物料名称" align="center" />
          <el-table-column prop="规格型号" label="规格型号" align="center" />
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
        <!-- <div class="demo-pagination-block">
          <el-pagination
            class="el_total-color"
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :small="small"
            :disabled="disabled"
            :background="background"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          /></div
      > -->
        <PaginationComponent
          :table-data="tableData"
          :total="total"
          ref="pagination"
        />
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

