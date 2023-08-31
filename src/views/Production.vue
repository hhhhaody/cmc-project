<script setup>
import { ref, onMounted, reactive } from "vue";
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import SearchComponent from "../components/SearchComponent.vue";

const tableData = [
  {
    name: "C型钢",
    model: "30*40,L=12000",
    produceDate: "2023-08-22",
    produceNo: 60,
  },
  {
    name: "T型钢",
    model: "30*40,L=12000",
    produceDate: "2023-08-22",
    produceNo: 50,
  },
  {
    name: "L型钢",
    model: "30*30,L=12000",
    produceDate: "2023-08-22",
    produceNo: 50,
  },
  {
    name: "方通柱",
    model: "200*200*4,L=12000",
    produceDate: "2023-08-22",
    produceNo: 30,
  },
  {
    name: "方通柱",
    model: "200*200*10,L=12000",
    produceDate: "2023-08-22",
    produceNo: 30,
  },
  {
    name: "方通柱",
    model: "10*10*8,L=12000",
    produceDate: "2023-08-22",
    produceNo: 20,
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
  <dv-border-box1 ref="borderRef" class="subNavPage animate__animated animate__zoomIn" :color="['#4f698794', '#4f698794']"
    background-color="#3545659e">
    <!-- body -->
    <el-container class="subNavPage">
      <br />
      <h1>实际产量记录</h1>
      <!-- main -->
      <el-main style="overflow: hidden">
        <!-- search -->
        <div class="input-row">
          <SearchComponent search-title="产品名称" :load-all-data="loadAllProduct" />
          <SearchComponent search-title="规格型号" :load-all-data="loadAllModel" />

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
          </span>
        </div>

        <!-- table -->
        <div>
          <el-table :data="tableShown.value" show-overflow-tooltip
            style="width: 100%; border-radius: 1vh; margin-top: 1vh" table-layout="fixed" height="50vh">
            <el-table-column type="selection" align="center" />
            <el-table-column type="index" label="Index" align="center" min-width="60vh" />
            <el-table-column prop="name" label="产品名称" align="center" />
            <el-table-column prop="model" label="规格型号" align="center" />
            <el-table-column prop="produceDate" label="生产日期" align="center" />
            <el-table-column prop="produceNo" label="生产数量" align="center" />
          </el-table>
        </div>
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

.input-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  margin-left: 200px;
}

</style>

