<script setup>
import { ref, onMounted, reactive } from "vue";
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import SearchComponent from "../components/SearchComponent.vue";
import PaginationComponent from "../components/PaginationComponent.vue";

const search1 = ref();
const search2 = ref();

// 模拟初始数据
// TODO: 从后端获取数据
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

// 模拟物料名称搜索栏提供的联想数据
// TODO: 从后端获取数据
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

// 模拟规格型号搜索栏提供的联想数据
// TODO: 从后端获取数据
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


// 记录用于通过搜索组件输入的搜索种类及对应关键词
let query = new Map();
const search = (title, keyword) => {
  // console.log(title, keyword);
  query.set(title, keyword);
  // console.log(query.keys());
};

// 前端实现关键字搜索功能，后期只需传递关键词由后端实现相关功能
// FIXME:后端实现后可能不需要此function
const filter = () => {
  tableShown.value = tableData;
  query.forEach((val, key) => {
    // console.log(key, val);
    tableShown.value = tableShown.value.filter((e) => e[key] === val);
  });
  total.value = tableShown.value.length;
};

// 清空搜索组件的关键字搜索，并初始化表格展示数据
const reset = () => {
  tableShown.value = tableData;
  query.clear();
  total.value = tableData.length;
  search1.value.searchContent = "";
  search2.value.searchContent = "";
};


// 分页器组件传递给父组件的列表，用于分页展示
const table = (list) => {
  tableShown.value = list.value;
};

onMounted(() => {
  //初始化表格展示数据，数据需从后端获取
  tableShown.value = tableData
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
          @table="table"
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

