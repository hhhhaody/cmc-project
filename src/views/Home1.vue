<script setup>
import "animate.css";
import LineGraph from "../components/LineGraph.vue";
import BarGraph from "../components/BarGraph.vue";
import RadarGraph from "../components/RadarGraph.vue";
import UsageRecord from "../components/UsageRecord.vue";
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
      <i>耗时统计</i>

      <RadarGraph class="graph" />
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
  height: 35vh;
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