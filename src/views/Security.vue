<script setup>
const tableData = [
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
];

import { ref } from "vue";
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import Search from "../components/SearchComponent.vue";

const currentPage1 = ref(5);
const currentPage2 = ref(5);
const currentPage3 = ref(5);
const currentPage4 = ref(4);
const pageSize2 = ref(10);
const pageSize3 = ref(20);
const pageSize4 = ref(40);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);

const handleSizeChange = (val) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`);
};
</script>
<template>
  <dv-border-box1
    ref="borderRef"
    class="subNavPage animate__animated animate__zoomIn"
    :color="['#4f698794', '#4f698794']"
    background-color="#4f698794"
  >
    <el-container class="subNavPage">
      <br />
      <h1 style="text-align: center; width: 100%; margin-top: 1vh">
        远程视频监控
      </h1>
      <!--<el-main style="overflow: hidden">
        <div>
          Material Name:
          <el-autocomplete
            v-model="state"
            :fetch-suggestions="querySearchAsync"
            placeholder="Please input material name"
            @select="handleSelect"
          />
          Model type:
          <el-autocomplete
            v-model="state"
            :fetch-suggestions="querySearchAsync"
            placeholder="Please input model type"
            @select="handleSelect"
          />
          <el-button type="primary"
            ><Search
              style="width: 1em; height: 1em; margin-right: 8px"
            />Search</el-button
          >
          <el-button
            ><DeleteFilled
              style="width: 1em; height: 1em; margin-right: 8px"
            />Reset</el-button
          >
        </div>
        <br />
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
        <div
          style="
            text-decoration: underline;
            color: rgba(0, 191, 255, 0.726);
            position: relative;
            left: 91%;
          "
        >
          Operation Record
        </div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="Date" width="180" />
          <el-table-column prop="name" label="Name" width="180" />
          <el-table-column prop="address" label="Address" />
        </el-table>
      </el-main>
      <el-footer style="display: flex; justify-content: center">
        <div class="demo-pagination-block">
          <el-pagination
            v-model:current-page="currentPage4"
            v-model:page-size="pageSize4"
            :page-sizes="[10, 20, 30, 40]"
            :small="small"
            :disabled="disabled"
            :background="background"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          /></div
      ></el-footer> -->
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
</style>