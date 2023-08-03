<script setup>
import { ref, onMounted, reactive } from "vue";
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import SearchComponent from "../components/SearchComponent.vue";
import PaginationComponent from "../components/PaginationComponent.vue";

const search1 = ref();
const search2 = ref();


const currentPage = ref(1);
const pageSize = ref(10);
const name = ref("")
const spec = ref("")

// 从后端获取数据
import { getMaterialAPI  } from "../apis/material";

const tableData = reactive([]);
const total = ref(0)
const getDataFromAPI = async () => {
  const res = await getMaterialAPI(currentPage.value,pageSize.value,name.value,spec.value);
  // console.log(res.data);
  tableData.value = res.data.data;
  total.value = res.data.total
};

//分页器回传的每页条数
const size = (val) => {
  pageSize.value = val;
  getDataFromAPI()
};

//分页器回传的当前页
const cur = (val) => {
  currentPage.value = val;
  getDataFromAPI()

};

// 记录用于通过搜索组件输入的搜索种类及对应关键词
const search = (title, keyword) => {
  // console.log(title, keyword);
  if (title === "name") name.value = keyword
  if (title === "spec") spec.value = keyword
};

// 根据关键字搜索数据库
const update = () => {
  getDataFromAPI()
};

// 清空搜索组件的关键字搜索，并初始化表格展示数据
const reset = () => {
  name.value = "";
  spec.value = "";
  search1.value.searchContent = "";
  search2.value.searchContent = "";
  getDataFromAPI()
};


onMounted(() => {
  //初始化表格展示数据，数据需从后端获取
  getDataFromAPI()
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
            field="name"
            @search="search"
          />
          <SearchComponent
            search-title="规格型号"
            ref="search2"
            field="spec"
            @search="search"
          />
          <el-button
            type="primary"
            style="margin-left: 10px; width: 7%"
            @click="update"
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
              ><Plus style="width: 1em; height: 1em; margin-right: 8px" />新增物料</el-button
            >
            <el-button type="primary"
              ><Download
                style="width: 1em; height: 1em; margin-right: 8px"
              />导出</el-button
            >
          </span>
          <span>
            <el-button>入库</el-button>
            <el-button>出库</el-button>
            <el-button>转入不良物料 </el-button>
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
          操作记录
        </div>
        <!-- table -->
        <el-table
          :data="tableData.value"
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
          <el-table-column prop="name" label="物料名称" align="center" />
          <el-table-column prop="spec" label="规格型号" align="center" />
          <el-table-column
            prop="amount"
            label="库存数量"
            align="center"
          />
          <el-table-column prop="threshold" label="低库存阈值" align="center" />
          <el-table-column prop="operation" label="操作" align="center">
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
          :total= "total"
          @size = "size"
          @cur = "cur"
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

