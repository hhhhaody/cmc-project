<script setup>
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
import { Decoration5 } from "@kjgl77/datav-vue3";;
import Swiper from 'swiper/bundle';

// import styles bundle
import 'swiper/css/bundle';

// init Swiper:
const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'horizontal',
  autoplay: {
    delay: 5000,
  },

  // If we need pagination
  // pagination: {
  //   el: '.swiper-pagination',
  // },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // And if we need scrollbar
  // scrollbar: {
  //   el: '.swiper-scrollbar',
  // },
});

const videos = [
  { source: './assets/videos/总装工作站_V4_231221.mp4" type="video/mp4' },
  { source: './assets/videos/方通阻焊_V1_231222.mp4" type="video/mp4' },
  // Add more video sources as needed
];


// test API function
// import { testAPI } from "./apis/home";
import { ref } from "vue";

// const depts = ref([]);
// const test = async () => {
//   const res = await testAPI();
//   depts.value = res.data;
// };

// test();

import { provide } from "vue";
import { echarts } from "@/utils/echarts"; // 按需引入echarts

provide("echarts", echarts); // 提供全局使用

const animation = ref();
// const nav = ref("block")
// animation.value = true;

const hide = () => {
  animation.value = "none";
};

const show = () => {
  animation.value = "block";
};
</script>

<template>
  <main class="bg">
    <header class="animate__animated animate__fadeInDown" style="z-index: 1;">
      <h1>
        <span>
          <!-- <img alt="Our logo" src="@/assets/logo.png" /> -->
          CMC产线智能化管理系统
          <!-- <Decoration5 :dur="5" style="width:50%;height:40px;margin: auto;" :color="['#5d8cbd', 'white']" /> -->
        </span>
      </h1>
    </header>
    <div>
      <RouterView />
    </div>

    <nav class="animate__animated animate__fadeInUp" style="z-index: 1;">
      <el-dropdown class="navItem nav1">
        <span class="el-dropdown-link"> 库存管理 </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <RouterLink to="/inventory" @click="hide">物料库存</RouterLink>
            </el-dropdown-item>
            <el-dropdown-item>
              <RouterLink to="/defectiveMaterial" @click="hide">不良物料</RouterLink>
            </el-dropdown-item>
            <el-dropdown-item>
              <RouterLink to="/product" @click="hide">产品库存</RouterLink>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown class="navItem nav2">
        <span class="el-dropdown-link"> 产线管理 </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <RouterLink to="/facility" @click="hide">设备台账管理</RouterLink>
            </el-dropdown-item>
            <el-dropdown-item>
              <RouterLink to="/deviceMonitor" @click="hide">设备运行监测</RouterLink>
            </el-dropdown-item>
            <el-dropdown-item>
              <RouterLink to="/troubleshooting" @click="hide">故障维修记录</RouterLink>
            </el-dropdown-item>
            <el-dropdown-item>
              <RouterLink to="/maintenancePlan" @click="hide">设备维护计划</RouterLink>
            </el-dropdown-item>
            <el-dropdown-item>
              <RouterLink to="/deviceFiles" @click="hide">设备文件管理</RouterLink>
            </el-dropdown-item>
            <el-dropdown-item>
              <RouterLink to="/composition" @click="hide">产线组成</RouterLink>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown class="navItem nav3">
        <span class="el-dropdown-link"> 生产管理 </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <RouterLink to="/timeConsumption" @click="hide">生产耗时记录</RouterLink>
            </el-dropdown-item>

            <el-dropdown-item>
              <RouterLink to="/production" @click="hide">实际产量记录</RouterLink>
            </el-dropdown-item>

            <el-dropdown-item>
              <RouterLink to="/energyConsumption" @click="hide">能耗统计记录</RouterLink>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown class="navItem nav4">
        <span class="el-dropdown-link"> 安全监控 </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <RouterLink to="/security" @click="hide">远程视频监控</RouterLink>
            </el-dropdown-item>
            <el-dropdown-item>
              <RouterLink to="/capture" @click="hide">安全抓拍记录</RouterLink>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <RouterLink class="link" to="/home" @click="show"></RouterLink>

      <RouterLink class="link" to="/" @click="show"></RouterLink>
    </nav>
    <!-- <header>
    <img
      alt="Vue logo"
      class="logo"
      src="@/assets/logo.svg"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
      <el-button type="success">i am button</el-button>

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header> -->

    <!-- <RouterView /> -->






  </main>


  <div class="videoContainer">
    <el-carousel style="z-index: 1;" class="fullscreen" :interval="1440000" :style="{ display: animation }">
      <el-carousel-item style="height: 225%;">
        <video class="fullscreenVideo" id="bgVid" playsinline="" autoplay="" muted="" loop="">
          <source src="./assets/videos/方通阻焊_V2_231225.mp4" type="video/mp4" />

        </video>
      </el-carousel-item>
      <el-carousel-item style="height: 225%;">
        <video class="fullscreenVideo" id="bgVid" playsinline="" autoplay="" muted="" loop="">
          <source src="./assets/videos/V3_231221(1).mp4" type="video/mp4" />

        </video>
      </el-carousel-item>
      <el-carousel-item style="height: 225%;">gi
        <video class="fullscreenVideo" id="bgVid" playsinline="" autoplay="" muted="" loop="">
          <source src="./assets/videos/地面钢网_V2_231221.mp4" type="video/mp4" />

        </video>
      </el-carousel-item>
      <el-carousel-item style="height: 225%;">
        <video class="fullscreenVideo" id="bgVid" playsinline="" autoplay="" muted="" loop="">
          <source src="./assets/videos/总装工作站_V4_231221.mp4" type="video/mp4" />

        </video>
      </el-carousel-item>

    </el-carousel>
  </div>



  <!-- <div class="videoContainer">
    <video class="fullscreenVideo" id="bgVid" playsinline="" autoplay="" muted="" loop="" :style="{ display: animation }"> -->
  <!-- <source src="./assets/videos/深色3.mp4" type="video/mp4" /> -->
  <!-- <source src="./assets/videos/dmgw.mp4" type="video/mp4" /> -->
  <!-- <source src="./assets/videos/V3_231221(1).mp4" type="video/mp4" /> -->
  <!-- <source src="./assets/videos/地面钢网_V2_231221.mp4" type="video/mp4" /> -->
  <!-- <source src="./assets/videos/方通阻焊_V1_231222.mp4" type="video/mp4" /> -->
  <!-- <source src="./assets/videos/总装工作站_V4_231221.mp4" type="video/mp4" /> -->

  <!-- </video> -->
  <!-- </div> -->
</template>

<style scoped>
.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item {
  /* color: #475669;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center; */
  /* background-color: black !important; */


  background:
    /* radial-gradient(
      100vh 100vh at 41%,
      transparent 30%,
      #182330a5 60%
    ), */
    url("./assets/images/map-2.png") no-repeat center fixed;
  background-size: cover;
  height: 150%;
}

:deep.el-carousel__item:nth-child(2n) {
  background-color: transparent !important;
  ;
}

:deep.el-carousel__item:nth-child(2n + 1) {
  background-color: transparent !important;
}


.videoContainer {
  position: relative;
  top: -100%;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.el-carousel-item:before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  display: block;
  z-index: -1;
  top: 0;
  left: 0;
  /* background: #435e7cc4; */
  /* background: #435e7c; */

  background:
    /* radial-gradient(
      100vh 100vh at 41%,
      transparent 30%,
      #182330a5 60%
    ), */
    url("./assets/images/map-2.png") no-repeat center fixed;
  background-size: cover;
}

.videoContainer:before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  display: block;
  z-index: -1;
  top: 0;
  left: 0;
  /* background: #435e7cc4; */
  /* background: #435e7c; */

  background:
    /* radial-gradient(
      100vh 100vh at 41%,
      transparent 30%,
      #182330a5 60%
    ), */
    url("./assets/images/map-2.png") no-repeat center fixed;
  background-size: cover;
}


.fullscreenVideo {
  position: relative;
  mix-blend-mode: screen;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
}

.fullscreen {
  position: relative;
  /* mix-blend-mode: screen; */
  top: 15vh;
  /* left: 50%;
  transform: translate(-50%, -50%); */
  /* width: 100%; */
  height: 75vh;
}



/* .fullscreenVideo {
  border-radius: 60vh; 
  position: relative;
  mix-blend-mode: screen;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); 
  width: 100%;
  height: 100%;
} */

.bg {
  display: grid;
  grid-template-rows: 1fr 8fr 1fr;
  padding: 0 0.5vh;
  width: 100%;
  height: 100%;
  overflow: hidden;
  color: white;
  /* background: radial-gradient(
      100vh 100vh at 41%,
      transparent 30%,
      #182330a5 60%
    ),
    url("./assets/images/bg.png") no-repeat center fixed;
  background-size: cover; */

  /* background: radial-gradient(
    100vh 100vh at 41%,
    transparent 30%,
    #182330a5 60%
  ); */

  /* background-color: rgb(17, 30, 52); */
  /* background-color: #22232573; */
  /* 
  animation-name: bgzoom;
  animation-duration: 4s;
  animation-fill-mode: forwards; */
}

/* #182330a2 */
/* 动画代码 */
@keyframes bgzoom {
  from {
    background-size: 100%;
  }

  to {
    background-size: 120%;
  }
}

header {
  display: flex;
  place-items: center;
  /* height: 40%; */
  /* padding-right: calc(var(--section-gap) / 2); */
  text-align: center;

  /* animation-name: moveDown;
  animation-duration: 4s;
  animation-fill-mode: forwards; */
  /* line-height: 1.5;
  max-height: 100vh;
 */
}

h1 {
  width: 100%;
}

h1 span {
  display: block;
  height: 2em;
}

h1 img {
  height: 100%;
  margin: 0 1rem;
  border-radius: 50%;
  vertical-align: middle;
}

nav {
  display: flex;
  font-size: 1rem;

  /* padding: 1rem 0;
  margin-bottom: 1rem; */
  width: 100%;
  /* font-size: 12px; */
  text-align: center;
  /* margin-top: 5rem; */
  justify-content: center;
  align-items: end;
  overflow: hidden;

  /* animation-name: moveUp;
  animation-duration: 4s;
  animation-fill-mode: forwards; */
}

nav .navItem {
  display: inline-block;
  height: 4vh;
  width: 10vh;
  position: relative;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  font-size: medium;

  color: #fff;
  text-shadow: 1px -1px 5px #a3ccf9;
}

nav .nav1 {
  left: -10%;
}

nav .nav2 {
  left: -5%;
  top: -35%;
}

nav .nav3 {
  left: 5%;
  top: -35%;
}

nav .nav4 {
  left: 10%;
}

nav .link {
  /* background-color: #1f528b; */
  background-image: radial-gradient(circle, transparent 5%, #5198db);
  /* opacity: 0.8; */
  position: absolute;
  width: 150rem;
  height: 150rem;
  border-radius: 50%;
  transform: translateY(98%);

  box-shadow: 0 0 1vh #fff, inset 0 0 4vh #fff;
}

nav .link.router-link-exact-active {
  display: none;
}

/* nav .switch {
  color: #fff;
  height: 4rem;
  opacity: 0.8;
  text-shadow: 0 0 2rem #120808;
} */

/* @keyframes moveDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }

  to {
    transform: translateY(0%);
    opacity: 1;
  }
}

@keyframes moveUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }

  to {
    transform: translateY(0%);
    opacity: 1;
  }
} */
a.router-link-exact-active {
  /* color: #fff;
  text-shadow: 1px -1px 5px #a3ccf9; */

  /* color: #a3ccf9;
  text-shadow: 1px 1px 1px #455260; */
  color: #455260;
  text-shadow: 1px 1px 1px #a3ccf9;
}

nav a:hover {
  background-color: transparent;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
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
/*
nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
} */

/*
@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    height: 40%;
    padding-right: calc(var(--section-gap) / 2);
    text-align: center;

    animation-name: show;
    animation-duration: 5s;
    animation-fill-mode: forwards;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem; 
    font-size: 1rem;

    padding: 1rem 0;
    margin-bottom: 1rem;

    animation-name: show;
    animation-duration: 5s;
    animation-fill-mode: forwards;
  } 
}*/

.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
