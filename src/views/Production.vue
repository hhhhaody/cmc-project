<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import SearchComponent from "../components/SearchComponent.vue";
import PaginationComponent from "../components/PaginationComponent.vue";
import { getProductionRecordAPI } from "../apis/productionRecord";
import ExportButton from "@/components/ExportButton.vue";
import { useUserStore } from '../stores/store.js';
const userStore = useUserStore();

// 数据定义
const tableData = reactive({ value: [] });

// 搜索条件初始化
const name = ref('');
const spec = ref('');
const productionQuantity = ref(0);
const startDate = ref(null);
const datePickerKey = ref(0);

// 格式化日期
const formatDate = (date) => {
  if (date) {
    return new Date(date).toISOString().split('T')[0];
  }
  return null;
};

// 计算属性：格式化日期范围
const formattedStartDateRange = computed(() => {
  return {
    start: formatDate(startDateRange.value.start),
    end: formatDate(startDateRange.value.end)
  };
});

// 计算属性：开始和结束日期
const startDateRange = computed(() => {
  if (startDate.value && startDate.value.length === 2) {
    return {
      start: startDate.value[0],
      end: startDate.value[1]
    };
  }
  return { start: null, end: null };
});

// API调用：获取生产记录
const fetchProductionRecords = async (params) => {
  try {
    const res = await getProductionRecordAPI(params.page, params.size, params.name, params.spec, params.productionQuantity, params.start, params.end);
    return res.data;
  } catch (error) {
    return null;
  }
};

// 获取并处理API返回数据
const getDataFromAPI = async (page = currentPage.value, size = pageSize.value) => {
  const responseData = await fetchProductionRecords({
    page,
    size,
    name: name.value,
    spec: spec.value,
    productionQuantity: productionQuantity.value,
    start: formattedStartDateRange.value.start,
    end: formattedStartDateRange.value.end
  });

  if (responseData && responseData.data && Array.isArray(responseData.data)) {
    tableData.value = [...responseData.data];
    total.value = responseData.total;
  }
  else if (responseData && Array.isArray(responseData)) {
    tableData.value = [...responseData];
    total.value = responseData.length;
  }
  else {
    tableData.value = [];
    total.value = 0;
  }

  updateSearchSuggestion();
};

// 导出功能相关
const selectedRows = ref([]);
const handleSelectionChange = (selected) => {
  selectedRows.value = selected;
};
const headers = ref([
  { key: 'id', title: '序号' },
  { key: 'name', title: '产品名称' },
  { key: 'spec', title: '规格型号' },
  { key: 'productionDate', title: '生产日期' },
  { key: 'productionQuantity', title: '生产数量' },
]);
const filterExportData = (data) => {
  // 过滤或转换数据的逻辑
  return data; // 示例：返回原始数据，不做任何处理
};


// 搜索功能相关
const search1 = ref();
const search2 = ref();
const renderKey = ref(0)
const updateSearchSuggestion = () => {
  renderKey.value = renderKey.value + 1
}

// 控制数据刷新
const refresh = ref(true)
const edit = (val) => {
  if (val) {
    loadMore(false)
  }
  else {
    loadMore(true)
  }
};
const isLoading = ref(false);
const loadMore = (status) => {
  if (isLoading.value) {
    return;
  }
  isLoading.value = true;
  refresh.value = status;

  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
};

// 更新搜索条件
const search = (title, keyword) => {
  console.log(title, keyword);
  if (title === "name") name.value = keyword
  if (title === "spec") spec.value = keyword
};

// 重新加载数据
const update = () => {
  refresh.value = true;
  getDataFromAPI();
};

// 重置搜索条件并重新加载数据
const reset = () => {
  refresh.value = true;
  name.value = "";
  spec.value = "";
  startDate.value = null;
  search1.value.searchContent = "";
  search2.value.searchContent = "";
  getDataFromAPI();
};

//分页组件相关
//#region
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

//分页器回传的每页条数
const size = (val) => {
  pageSize.value = val;
  getDataFromAPI();
};

//分页器回传的当前页
const cur = (val) => {
  currentPage.value = val;
  getDataFromAPI();
};

// 组件挂载后的操作
onMounted(async () => {
  await getDataFromAPI();
});
</script>

<template>
  <!-- borderbox -->
  <dv-border-box1 ref="borderRef" class="subNavPage animate__animated animate__zoomIn"
    :color="['#4f698794', '#4f698794']" background-color="#3545659e">
    <!-- body -->
    <el-container class="subNavPage">
      <br />
      <h1>实际产量记录</h1>
      <!-- main -->
      <el-main style="overflow: hidden">
        <!-- search -->
        <div class="input-row">
          <SearchComponent :key="renderKey" search-title="产品名称" :searchContent=name ref="search1" field="name"
            @search="search" @edit="edit" database="productionRecord" />
          <SearchComponent :key="renderKey" search-title="规格型号" :searchContent=spec ref="search2" field="spec"
            @search="search" @edit="edit" database="productionRecord" />

          <div>生产时间：
            <el-date-picker :key="datePickerKey" v-model="startDate" type="daterange" start-placeholder="开始日期"
              end-placeholder="结束日期" title="日期范围" value-format="YYYY-MM-DDTHH:mm:ss" />
          </div>

          <el-button type="primary" style="margin-left: 10px; width: 7%" @click="update">
            <Search style="width: 1em; height: 1em; margin-right: 8px" />搜索
          </el-button>
          <el-button style="width: 7%" @click="reset">
            <DeleteFilled style="width: 1em; height: 1em; margin-right: 8px" />清空
          </el-button>
        </div>
        <br />
        <!-- operation -->
        <div style="display: flex; justify-content: space-between">
          <span>
            <ExportButton v-if="!userStore.isReadOnly" v-model="selectedRows" :headers="headers"
              :tableData="tableData.value" fileName="实际产量记录.xlsx" :filterFunction="filterExportData" buttonLabel="导出" />
          </span>
        </div>

        <!-- table -->
        <el-table :data="tableData.value" @selection-change="handleSelectionChange" show-overflow-tooltip
          style="width: 100%; margin-top: 1vh;border-radius: 1vh; margin-top: 1vh" table-layout="fixed" height="52vh">
          <el-table-column type="selection" align="center" />
          <el-table-column type="index" label="序号" align="center" min-width="60vh" />
          <el-table-column prop="name" label="产品名称" align="center" />
          <el-table-column prop="spec" label="规格型号" align="center" />
          <el-table-column prop="productionDate" label="生产日期" align="center" />
          <el-table-column prop="productionQuantity" label="生产数量" align="center" />
        </el-table>

      </el-main>
      <!-- pagination -->
      <el-footer style="display: flex; justify-content: center">
        <div class="demo-pagination-block">
          <!-- <el-pagination class="el_total-color" v-model:current-page="currentPage" v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]" :small="small" :disabled="disabled" :background="background"
            layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" /> -->
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

.input-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  align-items: center;
  margin-bottom: 12px;
  /* margin-left: 5%; */
  position: relative;
}
</style>
