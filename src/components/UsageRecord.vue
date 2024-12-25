<template>
  <el-table :data="tableData" size="small"
    style="background-color: rgb(0, 0, 0, 0); padding-top: 5%;margin-bottom: 2vh;" table-layout="fixed" height="33vh"
    show-overflow-tooltip :header-row-style="headerRowStyle" :header-cell-style="headerCellStyle" :row-style="rowStyle"
    :cell-style="cellStyle" tooltip-effect="light">
    <!-- <el-table-column type=" index" :index="indexMethod" /> -->
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
    // this.startTimer();
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
      this.tableData = []
      //展示数据
      if (station === '总装工作站') {
        const res = await getMaterialUsageAPI('型钢切割工作站');
        res.data = [
          { name: ' E#模块箱1号墙板', spec: 'CMC:03:E#:01:QB01:041（102600）+040（F1.1#.8F）', outbound: 20, usage: 11, 总装工作站: 11 },
          { name: ' E#模块箱2号墙板', spec: 'CMC:03:E#:01:QB02:041（102600）+040（F1.1#.8F）', outbound: 31, usage: 14, 总装工作站: 14 },
          { name: ' E#模块箱3号墙板', spec: 'CMC:03:E#:01:QB03:041（102600）+040（F1.1#.8F）', outbound: 54, usage: 28, 总装工作站: 28 },
          { name: ' E#模块箱4号墙板', spec: 'CMC:03:E#:01:QB04:041（102600）+040（F1.1#.8F）', outbound: 32, usage: 12, 总装工作站: 12 },
          { name: ' E#模块箱5号墙板', spec: 'CMC:03:E#:01:QB05:041（102600）+040（F1.1#.8F）', outbound: 21, usage: 14, 总装工作站: 14 },
          { name: ' E#模块箱楼承板', spec: 'CMC:03:E#:01:LB::041（102600）+040（F1.1#.8F）', outbound: 18, usage: 17, 总装工作站: 17 },
          { name: ' E#模块箱底板', spec: 'CMC:03:E#:01:DB::041（102600）+040（F1.1#.8F））', outbound: 22, usage: 15, 总装工作站: 15 },
        ]
        this.tableData = res.data;

        return
      }
      else if (station === '墙板生产线') {
        const res = await getMaterialUsageAPI('型钢切割工作站');
        res.data = [
          { name: ' E#模块结构系统1号墙板柱体', spec: 'CMC:04:E#:01:QB01:GZ01:041（102600）+040（F1.1#.8F）', outbound: 22, usage: 12, 墙板生产线: 12 },
          { name: ' E#模块结构系统1号墙板加筋桁架01', spec: 'CMC:04:E#:01:QB01:HJ01::096（180*70*4）+097（2440）:1:30-03.30.20.10:041（102600）+040（F1.1#.8F）', outbound: 34, usage: 25, 墙板生产线: 25 },
          { name: ' E#模块结构系统1号墙板加筋桁架02', spec: 'CMC:04:E#:01:QB01:HJ01::096（180*70*3）+097（366）:1:30-03.30.20.10:041（102600）+040（F1.1#.8F））', outbound: 17, usage: 14, 墙板生产线: 14 },
          { name: ' E#模块结构系统1号墙板加筋桁架03', spec: 'CMC:04:E#:01:QB01:HJ01::096（180*70*？）+097（626）:1:30-03.30.20.10:041（102600）+040（F1.1#.8F）', outbound: 25, usage: 18, 墙板生产线: 18 },
          { name: ' E#模块结构系统1号墙板加筋桁架04', spec: 'CMC:04:E#:01:QB01:HJ01::096（180*30*10*2）+097（2440）:1:30-03.30.20.10:041（102600）+040（F1.1#.8F）', outbound: 41, usage: 37, 墙板生产线: 37 },
          { name: ' E#模块结构系统1号墙板加筋桁架05', spec: 'CMC:04:E#:01:QB01:HJ01::096（180*70*4）+097（2440）:1:30-03.30.20.10:041（102600）+040（F1.1#.8F）', outbound: 38, usage: 22, 墙板生产线: 22 },
        ]
        this.tableData = res.data;
        return
      }

      //真实数据
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
