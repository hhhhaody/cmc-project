<template>
  <el-table
    :data="tableData"
    size="small"
    style="background-color: rgb(0, 0, 0, 0); padding-top: 5%"
    table-layout="fixed"
    height="35vh"
    show-overflow-tooltip
    :header-row-style="headerRowStyle"
    :header-cell-style="headerCellStyle"
    :row-style="rowStyle"
    :cell-style="cellStyle"
  >
    <!-- <el-table-column type="index" :index="indexMethod" /> -->
    <el-table-column prop="name" label="原材料名称" min-width="80em" />
    <el-table-column prop="size" label="规格" min-width="65em" />
    <el-table-column prop="remains" label="剩余量" min-width="70em" />
    <el-table-column prop="used" label="使用量" min-width="50em" />
    <el-table-column prop="progress" label="使用进度">
      <template #default="scope"
        ><GaugeGraph class="graph" :value="scope.row.progress"></GaugeGraph
      ></template>
    </el-table-column>
  </el-table>
</template>

<script>
import GaugeGraph from "./GaugeGraph.vue";

export default {
  props: {
    station: String,
    stations: Array,
  },
  components: {
    GaugeGraph,
  },
  data() {
    return {
      stationData: {
        "型钢切割工作站": [
          { name: "C型钢", size: "200x300", remains: 23, used: 32, progress: 60 },
          { name: "T型钢", size: "300x200", remains: 55, used: 34, progress: 70 },
          { name: "L型钢", size: "400x400", remains: 23, used: 32, progress: 60 },
          { name: "大方通", size: "500x400", remains: 55, used: 34, progress: 70 },
          { name: "小方通", size: "600x600", remains: 23, used: 32, progress: 60 },
          { name: "X型钢", size: "400x100", remains: 55, used: 34, progress: 70 },
          { name: "Y型钢", size: "300x600", remains: 23, used: 32, progress: 60 },
          { name: "Z型钢", size: "200x700", remains: 55, used: 34, progress: 70 },
        ],
        "地面钢网工作站": [
          { name: "小方通", size: "200x700", remains: 33, used: 3, progress: 65 },
          { name: "X型钢", size: "400x600", remains: 55, used: 3, progress: 77 },
          { name: "小方通", size: "300x100", remains: 22, used: 21, progress: 68 },
          { name: "X型钢", size: "500x200", remains: 70, used: 35, progress: 7 },
          { name: "Z型钢", size: "600x300", remains: 2, used: 1, progress: 69 },
          { name: "大方通", size: "200x400", remains: 25, used: 22, progress: 88 },
        ],
        "方通组焊工作站": [
          { name: "X型钢", size: "700x400", remains: 33, used: 20, progress: 10 },
          { name: "T型钢", size: "600x200", remains: 44, used: 32, progress: 20 },
          { name: "C型钢", size: "300x100", remains: 55, used: 39, progress: 30 },
          { name: "Z型钢", size: "500x400", remains: 66, used: 40, progress: 40 },
          { name: "C型钢", size: "100x500", remains: 77, used: 59, progress: 50 },
          { name: "T型钢", size: "400x600", remains: 88, used: 72, progress: 60 },
          { name: "C型钢", size: "200x700", remains: 89, used: 38, progress: 70 },
          { name: "T型钢", size: "300x800", remains: 58, used: 25, progress: 80 },
        ],
        "模块总装工作站": [
          { name: "C型钢", size: "300x400", remains: 20, used: 2, progress: 60 },
          { name: "T型钢", size: "200x200", remains: 50, used: 4, progress: 50 },
          { name: "大方通", size: "400x400", remains: 20, used: 2, progress: 40 },
          { name: "小方通", size: "300x200", remains: 50, used: 4, progress: 30 },
          { name: "C型钢", size: "200x400", remains: 20, used: 2, progress: 20 },
          { name: "T型钢", size: "500x200", remains: 50, used: 4, progress: 10 },
        ],
        // 添加其他工作站的数据
        // ...
      },
    };
  },
  computed: {
    tableData() {
      return this.stationData[this.station] || [];
    },
  },
  methods: {
    headerRowStyle({ row, rowIndex }) {
      return {
        backgroundColor: "rgba(0, 0, 0, 0)",
        color: "white",
        textAlign: "center",
        height: "4vh",
      };
    },
    headerCellStyle({ row, column, rowIndex, columnIndex }) {
      return {
        backgroundColor: "rgba(0, 0, 0, 0)",
        padding: "0px",
        borderBottom: "0px",
        textAlign: "center",
      };
    },
    rowStyle({ row, rowIndex }) {
      return {
        backgroundColor: "rgba(0, 0, 0, 0)",
        color: "white",
        textAlign: "center",
      };
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return {
        backgroundColor: "rgba(0, 0, 0, 0)",
        border: "none",
        textAlign: "center",
      };
    },
  },
};
</script>

<style scoped>
:deep .el-table__inner-wrapper::before {
  height: 0px;
}
.graph {
  width: 100%;
  height: 6vh;
}
</style>