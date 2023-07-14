<script setup>
import "animate.css";
import LineGraph from "../components/LineGraph.vue";
import BarGraph from "../components/BarGraph.vue";
import RadarGraph from "../components/RadarGraph.vue";
import UsageRecord from "../components/UsageRecord.vue";
import { ref } from "vue";

const station = ref("");
const options = [
  {
    value: "station1",
    label: "station1",
  },
  {
    value: "station2",
    label: "station2",
  },
  {
    value: "station3",
    label: "station3",
  },
  {
    value: "station4",
    label: "station4",
  },
];

const select = (val) => {
  station.value = val;
};
</script>

<template>
  <main class="layout">
    <span class="g4 animate__animated animate__fadeInRight">
      <i>能耗统计</i>
      <LineGraph class="graph" />
    </span>
    <span class="g3 animate__animated animate__fadeInLeft">
      <i>产品生产情况</i>

      <BarGraph class="graph" />
    </span>

    <span class="g2 animate__animated animate__fadeInRight">
      <i
        >耗时统计
        <el-select
          v-model="station"
          class="m-2"
          placeholder="station1"
          @change="select"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          /> </el-select
      ></i>

      <RadarGraph class="graph" :station="station" />
    </span>
    <span class="g1 animate__animated animate__fadeInLeft">
      <i>原材料使用情况</i>

      <UsageRecord class="graph" />
    </span>
    <span class="g5"> </span>
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
  /* background-color: #1019281e; */
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
  border-bottom: solid 0.5vh #54a1e7;
  border-image: linear-gradient(
      to right,
      transparent 5%,
      #f3f7fcbb 10%,
      #54a1e7 20%,
      transparent 90%
    )
    2 10;

  /* border-bottom: solid 0.5vh #db6a82;
  border-image: linear-gradient(
      to right,
      transparent 5%,
      #f3f7fcbb 10%,
      #db6a82 20%,
      transparent 90%
    )
    2 10; */
}
</style>