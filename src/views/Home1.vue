<script setup>
import "animate.css";
import LineGraph from "../components/LineGraph.vue";
import BarGraph from "../components/BarGraph.vue";
import RadarGraph from "../components/RadarGraph.vue";
import UsageRecord from "../components/UsageRecord.vue";
import Carbon from "../components/Carbon.vue";
// import GaugeGraph from "../components/GaugeGraph.vue";
import { ref } from "vue";
import { useRouter } from 'vue-router';

const stations = ref(["型钢切割工作站", "地面钢网工作站", "方通组焊工作站", "模块总装工作站"]);
const radar = ref(stations.value[0]); //耗时统计图形组件
const bar = ref(stations.value[0]); //产品生产情况图形组件
const usage = ref(stations.value[0]); //原材料使用情况图形组件
const line = ref(stations.value[0]);  //能耗统计图形组件
const router = useRouter();

const carbon = ref(false)
const quality = ref(false)
const showToggle = ref(false)
const showToggle2 = ref(false)
const showToggle3 = ref(true)

const navigate = (routeName) => {
  router.push({ name: routeName });
};

// console.log(stations.value[0]);
// radar.value = "station1";

const changeAllStation = (val) => {
  changeStation(1, val)
  changeStation(2, val)
  changeStation(3, val)
  changeStation(4, val)
}

const changeStation = (type, val) => {
  // type: 1 for radar
  // console.log(type);
  // console.log(val);

  switch (type) {
    case 1:
      // code block
      radar.value = val;
      // console.log(radar.value);
      break;
    case 2:
      // code block
      bar.value = val;
      // console.log(bar.value);
      break;
    case 3:
      //   // code block
      usage.value = val;
      break;
    case 4:
      // code block
      line.value = val;
      break;
    default:
    // code block
  }
};

</script>

<template>
  <main class="layout">
    <span v-if="carbon" class="g4 animate__animated animate__fadeInRight grey" @mouseover="showToggle = true"
      @mouseout="showToggle = false">
      <i>
        <span class="click" @click="navigate('lowCarbon')">碳排放总览</span>
        <!-- <div class="tab">
          <span>当月</span>
          <el-divider direction="vertical" />
          <span>前一天</span>
        </div> -->
      </i>
      <Carbon />
      <p v-show="showToggle" class="toggleButton" @click="carbon = false">能耗数据</p>
    </span>
    <span v-else class="g4 animate__animated animate__fadeInRight grey" @mouseover="showToggle = true"
      @mouseout="showToggle = false">
      <i>
        <span class="click" @click="navigate('energyConsumption')">能耗数据</span>
        <el-dropdown class="tab">
          <span class="el-dropdown-link" style="font-size: 15px; font-weight: 500;"> {{ line }} </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="changeStation(4, stations[0])">型钢切割工作站</el-dropdown-item>
              <el-dropdown-item @click="changeStation(4, stations[1])">地面钢网工作站</el-dropdown-item>
              <el-dropdown-item @click="changeStation(4, stations[2])">方通组焊工作站</el-dropdown-item>
              <el-dropdown-item @click="changeStation(4, stations[3])">模块总装工作站</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </i>
      <LineGraph class="graph" :station="line" :stations="stations" />
      <p v-show="showToggle" class="toggleButton" @click="carbon = true">碳排放</p>
    </span>



    <span v-if="quality" class="g3 animate__animated animate__fadeInLeft grey" @mouseover="showToggle2 = true"
      @mouseout="showToggle2 = false">
      <i>
        <span class="click" @click="navigate('quality')">质量检测情况</span>
        <el-dropdown class="tab">
          <span class="el-dropdown-link" style="font-size: 15px; font-weight: 500;"> {{ bar }} </span>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="changeStation(2, stations[0])">型钢切割工作站</el-dropdown-item>
              <el-dropdown-item @click="changeStation(2, stations[1])">地面钢网工作站</el-dropdown-item>
              <el-dropdown-item @click="changeStation(2, stations[2])">方通组焊工作站</el-dropdown-item>
              <el-dropdown-item @click="changeStation(2, stations[3])">模块总装工作站</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </i>

      <Quality />
      <p v-show="showToggle2" class="toggleButton2" @click="quality = false">产品生产情况</p>
    </span>
    <span v-else class="g3 animate__animated animate__fadeInLeft grey" @mouseover="showToggle2 = true"
      @mouseout="showToggle2 = false">
      <i>
        <span class="click" @click="navigate('product')">产品生产情况</span>
        <el-dropdown class="tab">
          <span class="el-dropdown-link" style="font-size: 15px; font-weight: 500;"> {{ bar }} </span>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="changeStation(2, stations[0])">型钢切割工作站</el-dropdown-item>
              <el-dropdown-item @click="changeStation(2, stations[1])">地面钢网工作站</el-dropdown-item>
              <el-dropdown-item @click="changeStation(2, stations[2])">方通组焊工作站</el-dropdown-item>
              <el-dropdown-item @click="changeStation(2, stations[3])">模块总装工作站</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </i>

      <BarGraph class="graph" :station="bar" :stations="stations" />
      <p v-show="showToggle2" class="toggleButton2" @click="quality = true">质量检测情况</p>
    </span>
    <span class="g2 animate__animated animate__fadeInRight grey">
      <p style="position: absolute;top: -65px;right:10vh">

        <el-dropdown>
          <span style="font-size: 15px; font-weight: 500;">
            <Switch style="width: 2vh; height: 2vh; color:white" />
          </span>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="changeAllStation(stations[0])">型钢切割工作站</el-dropdown-item>
              <el-dropdown-item @click="changeAllStation(stations[1])">地面钢网工作站</el-dropdown-item>
              <el-dropdown-item @click="changeAllStation(stations[2])">方通组焊工作站</el-dropdown-item>
              <el-dropdown-item @click="changeAllStation(stations[3])">模块总装工作站</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </p>

      <i>
        <span class="click" @click="navigate('timeConsumption')">耗时数据</span>
        <el-dropdown class="tab">
          <span class="el-dropdown-link" style="font-size: 15px; font-weight: 500;"> {{ radar }} </span>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="changeStation(1, stations[0])">型钢切割工作站</el-dropdown-item>
              <el-dropdown-item @click="changeStation(1, stations[1])">地面钢网工作站</el-dropdown-item>
              <el-dropdown-item @click="changeStation(1, stations[2])">方通组焊工作站</el-dropdown-item>
              <el-dropdown-item @click="changeStation(1, stations[3])">模块总装工作站</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </i>
      <!-- <BarGraph class="graph" :station="bar" :stations="stations" /> -->
      <!-- <LineGraph class="graph" :station="line" :stations="stations" /> -->

      <RadarGraph class="graph" :station="radar" :stations="stations" />
    </span>
    <span class="g1 animate__animated animate__fadeInLeft grey">
      <i>
        <span class="click" @click="navigate('inventory')">原材料使用情况</span>
        <el-dropdown class="tab">
          <span class="el-dropdown-link" style="font-size: 15px; font-weight: 500;"> {{ usage }} </span>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="changeStation(3, stations[0])">型钢切割工作站</el-dropdown-item>
              <el-dropdown-item @click="changeStation(3, stations[1])">地面钢网工作站</el-dropdown-item>
              <el-dropdown-item @click="changeStation(3, stations[2])">方通组焊工作站</el-dropdown-item>
              <el-dropdown-item @click="changeStation(3, stations[3])">模块总装工作站</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </i>

      <UsageRecord class="graph" :station="usage" :stations="stations" />
    </span>
    <span class="g5">
    </span>
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
  grid-template-rows: repeat(auto-fit, minmax(35vh, 1fr));
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

.click {
  cursor: pointer;
}

.graph::after {
  /* content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  display: block;
  z-index: -1;
  top: 0;
  left: 0;
  background: #435e7c32; */
}

.g1 {

  z-index: 100;
  grid-area: graph1;

}

.g2 {
  grid-area: graph2;
  z-index: 100;
  position: relative;

}

.g3 {
  grid-area: graph3;
  z-index: 100;

}

.g4 {
  grid-area: graph4;
  z-index: 100;

}

.g5 {
  grid-area: graph5;
  background-color: transparent;
  /* width: 80vh; */
}

.grey {
  /* height: 36vh; */
  background-color: #ffffff0a;
  border-radius: 1vh;
  /* background: linear-gradient(#1d1d1ded, transparent); */
  /* overflow: hidden; */
  padding: 1vh;
  padding-bottom: 0;
  margin: 1vh;
}

i {
  position: relative;
  display: block;
  font-size: medium;
  font-weight: bold;
  line-height: 100%;
  padding: 1vh 1vh;
  border-bottom: solid 0.5vh #54a1e7;
  border-image: linear-gradient(to right,
      transparent 5%,
      #f3f7fcbb 10%,
      #6ea3d7 20%,
      transparent 90%) 2 10;

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

.tab {
  display: inline-block;
  /* width: 10vh; */
  right: 5vh;
  position: absolute;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  font-size: medium;
  color: #fff;
  /* text-shadow: 1px -1px 5px #a3ccf9; */
}


/* .el-dropdown-menu {
  color: #fff;
  background: #6281a473;
}
:deep .el-dropdown-menu__item {
  color: #fff;
}
:deep .el-popper__arrow {
  display: none;
} */

.toggleButton {
  color: #729fd0;
  position: fixed;
  top: 50%;
  right: 1vh;
  transform: translateY(-50%);
  z-index: 1000;
  writing-mode: vertical-rl !important;
  /* 从上到下的垂直书写方式 */
  text-orientation: mixed !important;
  /* 保持文字正常方向 */
  cursor: pointer;
  font-weight: normal;
  letter-spacing: 2px;
}

.toggleButton2 {
  color: #729fd0;
  position: fixed;
  top: 50%;
  left: 1vh;
  transform: translateY(-50%);
  z-index: 1000;
  writing-mode: vertical-rl !important;
  /* 从上到下的垂直书写方式 */
  text-orientation: mixed !important;
  /* 保持文字正常方向 */
  cursor: pointer;
  font-weight: normal;
  letter-spacing: 2px;
}
</style>