<script setup>
import { ref, onMounted, reactive } from "vue";
const props = defineProps(["tableData", "total"]);
const emit = defineEmits(["table"]);
const tableShown = reactive([]);
const tableData = props.tableData;
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
  // console.log(tableShown);
  emit("table", { value: tableShown.value, pageSize: pageSize.value });
};
const handleCurrentChange = (val) => {
  // console.log(`current page: ${val}`);
  currentPage.value = val;
  tableShown.value = tableData.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  );
  // console.log(tableShown);
  emit("table", { value: tableShown.value, pageSize: pageSize.value });
};

// 定义一个重置方法，用于重置当前页面和分页大小
const reset = () => {
  // 将当前页码设置为1
  currentPage.value = 1;
  // 重新设置每页显示的项目数量
  handleSizeChange(pageSize.value);
};
onMounted(() => {
  tableShown.value = tableData.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  );
  emit("table", { value: tableShown.value, pageSize: pageSize.value });
});

// defineExpose({ tableShown });
defineExpose({
  reset
});
</script>

<template>
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
      :total="props.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style scoped>
.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}
.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}

:deep .el_total-color {
  --el-text-color-regular: #729fd0;
}
</style>