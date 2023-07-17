<script setup>
import LineGraph from "../components/LineGraph.vue";
import UsageForm from "../components/UsageRecord.vue";
import GaugeGraph from "../components/GaugeGraph.vue";
import PieGraph from "../components/PieGraph.vue";
import DeviceStatus from "../components/DeviceStatus.vue";
import Notification from "../components/Notification.vue";
import MaintenanceTask from "../components/MaintenanceTask.vue";
</script>

<template>
  <main class="layout">
    <span class="g4 animate__animated animate__fadeInRight">
      <i>维保任务</i>

      <MaintenanceTask />
      <!-- <LineGraph /> -->
    </span>
    <span class="g3 animate__animated animate__fadeInLeft">
      <i>信息提醒中心 </i>

      <Notification />
    </span>
    <span class="g2 animate__animated animate__fadeInRight">
      <i>远程监控</i>
    </span>
    <span class="g1 animate__animated animate__fadeInLeft">
      <i>监测设备统计</i>
      <DeviceStatus />

      <!-- <PieGraph class="graph" :online="1000" :offline="130" /> -->
      <!-- <PieGraph class="graph" /> -->
    </span>

    <!-- <UsageForm class="graph g1" />
    <GaugeGraph class="graph g2" :value="50" />
    <LineGraph class="graph g3" />
    <LineGraph class="graph g4" /> -->
    <span class="g5"></span>
  </main>
</template>

<style scoped>
.layout {
  width: 100%;
  height: 100%;

  display: grid;
  /* position: relative; */
  /* padding: 0 2em; */

  grid-template-columns: repeat(auto-fit, minmax(20vh, 1fr));
  grid-template-rows: repeat(auto-fit, minmax(36vh, 1fr));
  grid-template-areas:
    "graph1 graph5 graph5 graph2"
    "graph3 graph5 graph5 graph4";
  /* flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  align-content: center; */
}

.graph {
  height: 36vh;
}
.g1 {
  grid-area: graph1;
}
.g2 {
  grid-area: graph2;
}
.g3 {
  grid-area: graph3;
}
.g4 {
  grid-area: graph4;
}
.g5 {
  grid-area: graph5;
  background-color: transparent;
  /* width: 80vh; */
}

span {
  /* height: 36vh; */
  /* height: 100%;
  width: 100%; */
  /* background-color: #1019285f; */
  /* background: linear-gradient(#1d1d1ded, transparent); */
  /* overflow: hidden; */
}

i {
  position: relative;
  display: block;
  font-size: medium;
  font-weight: bold;
  line-height: 100%;
  padding: 1vh 1vh;
  border-bottom: solid 0.5vh #5893c6;
  border-image: linear-gradient(
      to right,
      transparent 5%,
      #f3f7fcbb 10%,
      #6ea3d7 20%,
      transparent 90%
    )
    2 10;
}
</style>