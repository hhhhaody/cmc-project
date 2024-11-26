<script setup>
import { RouterLink, RouterView, useRouter } from "vue-router";
import { Decoration5 } from "@kjgl77/datav-vue3";;
// import * as jwtDecode from 'jwt-decode';
import { useUserStore } from './stores/store.js';


// 使用 Pinia store
const userStore = useUserStore();

// init Swiper:
// const swiper = new Swiper('.swiper', {
//   // Optional parameters
//   direction: 'horizontal',
//   autoplay: {
//     delay: 5000,
//   },

//   // If we need pagination
//   // pagination: {
//   //   el: '.swiper-pagination',
//   // },

//   // Navigation arrows
//   navigation: {
//     nextEl: '.swiper-button-next',
//     prevEl: '.swiper-button-prev',
//   },

//   // And if we need scrollbar
//   // scrollbar: {
//   //   el: '.swiper-scrollbar',
//   // },
// });

// 判断是pc还是移动端
const isPc = ref(true);

const handleResize = () => {
  isPc.value = !window.matchMedia('(max-width: 430px)').matches;
};


// test API function
// import { testAPI } from "./apis/home";
import { ref, onMounted } from "vue";

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
const cmc2 = ref(false);
// const nav = ref("block")
// animation.value = true;

const hide = () => {
  animation.value = "none";

};

const show = () => {
  animation.value = "block";
};



//退出功能
const router = useRouter(); // 获取 router 实例

const logout = () => {
  // 清除本地存储的用户信息
  localStorage.removeItem('jwt_token');
  sessionStorage.removeItem('mobile_data_token');

  localStorage.removeItem('adminType'); // 清除保存的用户类型
  // 重置 Pinia store 中的状态
  userStore.setAdminType('USER'); // 将用户类型重置为默认值

  // 重定向到登录页面
  router.push('/login');
};


handleResize(); // 初始化时执行一次
window.addEventListener('resize', handleResize);


function changeBackground(imageClass) {
  // hide()
  const videoContainer = document.querySelector('.videoContainer');
  // 移除所有背景相关的类
  videoContainer.classList.remove('bg1', 'bg2', 'bg3', 'bg4', 'bg5');
  // 添加所需的背景类
  videoContainer.classList.add(imageClass);

}


//墙板生产线动画切换
const wall = ref(false)
const handleCarouselChange = (index) => {
  if (index == 1) {
    console.log('墙板');
    wall.value = true
  }
  else {
    wall.value = false
  }
};

const backScreenVideo = (value) => {
  console.log(value);
  if (value) {
    show()
  }
  else {
    hide()
  }
}


</script>

<template>
  <main class="bg" v-if="isPc">
    <header class="animate__animated animate__fadeInDown" style="z-index: 1;">
      <h1>
        <!-- <img alt="Our logo" src="@/assets/logo.png" /> -->
        <RouterLink to="/about" @click="hide" style="color: white;">CMC产线智能化管理系统</RouterLink>
        <!-- <button @click="changeBackground('bg1')">1</button>
        <button @click="changeBackground('bg2')">2</button>
        <button @click="changeBackground('bg3')">3</button>
        <button @click="changeBackground('bg4')">4</button>
        <button @click="changeBackground('bg5')">5</button> -->
      </h1>

      <div class="user-avatar">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link">
            <img src="@/assets/images/user.png" alt="User Avatar" />
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-if="userStore.adminType === '管理员'">
                <RouterLink to="/UserManagement" @click="hide">用户管理</RouterLink>
              </el-dropdown-item>
              <el-dropdown-item>
                <RouterLink to="/PersonalCenter" @click="hide">个人中心</RouterLink>
              </el-dropdown-item>
              <el-dropdown-item @click="logout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

    </header>
    <div>
      <RouterView :wall="wall" @backScreenVideo="backScreenVideo" />
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


      <el-dropdown class="navItem nav5" placement="top">
        <span class="el-dropdown-link"> 问题追溯 </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <RouterLink to="/quality" @click="hide">质量管理</RouterLink>
            </el-dropdown-item>
            <el-dropdown-item>
              <RouterLink to="/materialQuality" @click="hide">来料检测</RouterLink>
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

            <el-dropdown-item>
              <RouterLink to="/lowCarbon" @click="hide">碳管理</RouterLink>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown class="navItem nav4">
        <span class="el-dropdown-link"> 安全管理 </span>
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


      <RouterLink v-if="cmc2 == false" class="link" to="/home" @click="show(); cmc2 = false"></RouterLink>

      <RouterLink v-if="cmc2 == false" class="link" to="/" @click="show(); cmc2 = false"></RouterLink>

      <RouterLink v-if="cmc2 == true" class="link" to="/v2home" @click="show()"></RouterLink>

      <RouterLink v-if="cmc2 == true" class="link" to="/v2home2" @click="show()"></RouterLink>

      <RouterLink v-if="cmc2 == false" class="switch" to="/v2home"
        @click="show(); changeBackground('bg2'); cmc2 = true">
        CMC2.0
      </RouterLink>

      <RouterLink v-if="cmc2 == true" class="switch" to="/" @click="show(); changeBackground('bg1'); cmc2 = false">
        CMC1.0
      </RouterLink>

    </nav>
    <!-- <header>
    <img
      alt=" Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

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


  <div class="videoContainer" v-if="isPc">
    <el-carousel v-if="cmc2 == false" style="z-index: 1;" class="fullscreen" :interval="1440000"
      :style="{ display: animation }">
      <el-carousel-item style="height: 225%;" class="video1">
        <video class="fullscreenVideo" id="bgVid" playsinline="" autoplay="" muted="" loop="">
          <source src="./assets/videos/fangtong_1107.mp4" type="video/mp4" />

        </video>
      </el-carousel-item>
      <el-carousel-item style="height: 225%;" class="video1">
        <video class="fullscreenVideo" id="bgVid" playsinline="" autoplay="" muted="" loop="">
          <source src="./assets/videos/zongzhuang_1107.mp4" type="video/mp4" />

        </video>
      </el-carousel-item>
      <el-carousel-item style="height: 225%;" class="video1">
        <video class="fullscreenVideo" id="bgVid" playsinline="" autoplay="" muted="" loop="">
          <source src="./assets/videos/xinggang_1107.mp4" type="video/mp4" />

        </video>
      </el-carousel-item>
      <el-carousel-item style="height: 225%;" class="video1">
        <video class="fullscreenVideo" id="bgVid" playsinline="" autoplay="" muted="" loop="">
          <source src="./assets/videos/dimian_1107.mp4" type="video/mp4" />

        </video>
      </el-carousel-item>


    </el-carousel>


    <el-carousel v-else style="z-index: 1;" class="fullscreen" :interval="1440000" :style="{ display: animation }"
      @change="handleCarouselChange">
      <el-carousel-item style="height: 225%;" class="video2">
        <video class="fullscreenVideo" id="bgVid" playsinline="" autoplay="" muted="" loop="">
          <source src="./assets/videos/zongzhuang2_1107.mp4" type="video/mp4" />

        </video>
      </el-carousel-item>
      <el-carousel-item style="height: 225%;" class="video2">
        <video class="fullscreenVideo" id="bgVid" playsinline="" autoplay="" muted="" loop="">
          <source src="./assets/videos/qiangban_1107.mp4" type="video/mp4" />

        </video>
      </el-carousel-item>
      <el-carousel-item style="height: 225%;" class="video2">
        <video class="fullscreenVideo" id="bgVid" playsinline="" autoplay="" muted="" loop="">
          <source src="./assets/videos/qieban2_1108.mp4" type="video/mp4" />

        </video>
      </el-carousel-item>
      <!-- <el-carousel-item style="height: 225%;">
        <video class="fullscreenVideo" id="bgVid" playsinline="" autoplay="" muted="" loop="">
          <source src="./assets/videos/dimian_V2.mp4" type="video/mp4" />

        </video>
      </el-carousel-item> -->


    </el-carousel>
  </div>

  <div v-else class="app">
    <RouterView />
    <!-- <el-dropdown class="navItem nav5">
      <span class="el-dropdown-link"> 问题追溯 </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>
            <RouterLink to="/quality" @click="hide">质量管理</RouterLink>
          </el-dropdown-item>
          <el-dropdown-item>
            <RouterLink to="/materialQuality" @click="hide">来料检测</RouterLink>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown> -->
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

.video1 {
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

.video2 {
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
    url("./assets/images/map-10.png") no-repeat center fixed;
  background-size: cover;
  height: 150%;
}

/* .bg1 {
  background: url("./assets/images/map-2.png") no-repeat center fixed;
  background-size: cover;
}

.bg2 {
  background: url("./assets/images/map-5.png") no-repeat center fixed;
  background-size: cover;
} */



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

  /* background: */
  /* radial-gradient(
      100vh 100vh at 41%,
      transparent 30%,
      #182330a5 60%
    ), */
  /* url("./assets/images/map-2.png") no-repeat center fixed; */
  /* background-size: cover; */
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

.videoContainer.bg1:before {
  background: url("./assets/images/map-2.png") no-repeat center fixed;
  background-size: cover;
}

.videoContainer.bg2:before {
  background: url("./assets/images/map-10.png") no-repeat center fixed;
  background-size: cover;
}

.videoContainer.bg3:before {
  background: url("./assets/images/map-8.png") no-repeat center fixed;
  background-size: cover;
}

.videoContainer.bg4:before {
  background: url("./assets/images/map-9.png") no-repeat center fixed;
  background-size: cover;
}

.videoContainer.bg5:before {
  background: url("./assets/images/map-6-1.png") no-repeat center fixed;
  background-size: cover;
}


.fullscreenVideo {
  position: relative;
  mix-blend-mode: screen;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  height: 120%;
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

.user-avatar {
  position: absolute;
  right: 0;
  /* 将头像靠右 */
  top: 50%;
  /* 垂直居中对齐 */
  transform: translateY(-60%);
  /* 确保头像在垂直方向上居中 */
  margin-right: 5vh;
}

.user-avatar img {
  width: 40px;
  /* 头像的宽度 */
  height: 40px;
  /* 头像的高度 */
  border-radius: 50%;
  /* 如果你想要圆形头像 */
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
  left: -5%;
}

nav .nav2 {
  left: -3%;
  top: -35%;
}

nav .nav3 {
  left: 3%;
  top: -35%;
}

nav .nav4 {
  left: 5%;
}

nav .nav5 {
  top: -50%
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

nav .switch {
  /* background-color: #1f528b; */
  /* background-image: radial-gradient(circle, transparent 5%, #5198db); */
  /* opacity: 0.8; */
  position: absolute;
  /* width: 150rem; */
  /* height: 150rem; */
  right: 1vh;
  bottom: 1vh;
  /* box-shadow: 0 0 1vh #fff, inset 0 0 4vh #fff; */

  /* height: 2vh;
  width: 2vh; */
  color: #fff;
  text-shadow: 1px -1px 5px #a3ccf9;
}

nav .link.router-link-exact-active {
  display: none;
}

nav .switch.router-link-exact-active {
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
  /* text-shadow: 1px 1px 1px #a3ccf9; */
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

.app {
  width: 100%;
  height: 100%;
}
</style>
