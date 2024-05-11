<template>
  <el-table :data="tableData" size="small" style="background-color: rgb(0, 0, 0, 0); padding-top: 5%"
    table-layout="fixed" height="35vh" show-overflow-tooltip :header-row-style="headerRowStyle"
    :header-cell-style="headerCellStyle" :row-style="rowStyle" :cell-style="cellStyle">
    <!-- <el-table-column type="index" :index="indexMethod" /> -->
    <el-table-column prop="name" label="原材料名称" min-width="80em" />
    <el-table-column prop="spec" label="规格" min-width="65em" />
    <el-table-column label="剩余量" min-width="70em">
      <template #default="scope">
        {{ scope.row.outbound - scope.row.usage }}
      </template>
    </el-table-column>
    <el-table-column :prop=station label="使用量" min-width="50em" />
    <el-table-column label="使用进度">
      <template #default="scope">
        <GaugeGraph class="graph"
          :value="(scope.row[station] / (scope.row[station] + scope.row.outbound - scope.row.usage) * 100).toFixed(0)">
        </GaugeGraph>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import GaugeGraph from "./GaugeGraph.vue";
import { getMaterialUsageAPI } from "../apis/data"

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
      // stationData: {
      //   "型钢切割工作站": [
      //     { name: "C型钢", size: "30*40,L=12000", remains: 23, used: 32, progress: 60 },
      //     { name: "C型钢", size: "30*62,L=12000", remains: 23, used: 32, progress: 60 },
      //     { name: "T型钢", size: "30*40,L=12000", remains: 55, used: 34, progress: 70 },
      //     { name: "L型钢", size: "30*30,L=12000", remains: 23, used: 32, progress: 60 },
      //     { name: "方通", size: "200*200*4,L=12000", remains: 55, used: 34, progress: 70 },
      //     { name: "方通", size: "200*200*10,L=12000", remains: 55, used: 34, progress: 70 },
      //     { name: "方通", size: "10*10*8,L=12000", remains: 55, used: 34, progress: 70 },
      //   ],
      //   "地面钢网工作站": [
      //     { name: "L型钢", size: "30*30,L=12000", remains: 23, used: 32, progress: 60 },
      //     { name: "方通", size: "200*200*4,L=12000", remains: 55, used: 34, progress: 70 },
      //     { name: "方通", size: "200*200*10,L=12000", remains: 55, used: 34, progress: 70 },
      //     { name: "方通", size: "10*10*8,L=12000", remains: 55, used: 34, progress: 70 },
      //     { name: "C型钢", size: "30*40,L=12000", remains: 23, used: 32, progress: 60 },
      //     { name: "C型钢", size: "30*62,L=12000", remains: 23, used: 32, progress: 60 },
      //     { name: "T型钢", size: "30*40,L=12000", remains: 55, used: 34, progress: 70 },
      //   ],
      //   "方通组焊工作站": [
      //     { name: "C型钢", size: "30*62,L=12000", remains: 23, used: 32, progress: 60 },
      //     { name: "T型钢", size: "30*40,L=12000", remains: 55, used: 34, progress: 70 },
      //     { name: "L型钢", size: "30*30,L=12000", remains: 23, used: 32, progress: 60 },
      //     { name: "方通", size: "200*200*4,L=12000", remains: 55, used: 34, progress: 70 },
      //     { name: "方通", size: "200*200*10,L=12000", remains: 55, used: 34, progress: 70 },
      //     { name: "方通", size: "10*10*8,L=12000", remains: 55, used: 34, progress: 70 },
      //   ],
      //   "模块总装工作站": [
      //     { name: "方通", size: "10*10*8,L=12000", remains: 55, used: 34, progress: 70 },
      //     { name: "C型钢", size: "30*40,L=12000", remains: 23, used: 32, progress: 60 },
      //     { name: "C型钢", size: "30*62,L=12000", remains: 23, used: 32, progress: 60 },
      //     { name: "T型钢", size: "30*40,L=12000", remains: 55, used: 34, progress: 70 },
      //   ],
      //   // 添加其他工作站的数据
      //   // ...
      // },
      stationData: [],
      tableData: []
    };
  },
  computed: {
    // tableData() {
    //   return this.stationData[this.station] || [];
    // },
  },
  mounted() {
    this.getData(this.station);
    // 每隔一段时间获取数据
    this.startTimer();
  },
  // 组件销毁时停止定时器
  beforeUnmount() {
    this.stopTimer();
  },
  watch: {
    station: {
      handler(newStation, oldStation) {
        if (newStation !== oldStation) {
          // console.log(this.station);
          this.getData(this.station);
        }
      },
      immediate: true, // 立即调用 handler 函数，而不必等到 station 改变
    },
  },
  methods: {
    async getData(station) {
      // console.log("get data");
      const res = await getMaterialUsageAPI(station);
      this.tableData = res.data;
      // console.log(res.data);
    },
    startTimer() {
      // 每隔一段时间调用 getData 方法
      this.timerId = setInterval(() => {
        console.log("获取原材料使用数据");
        this.getData(this.station);
      }, 10000); // 每隔 10 秒获取一次数据
    },
    stopTimer() {
      // 停止定时器
      clearInterval(this.timerId);
    },
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