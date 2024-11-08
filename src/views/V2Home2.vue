<script setup>
import "animate.css";
import LineGraph from "../components/LineGraph.vue";
import BarGraph from "../components/BarGraph2.vue";
import RadarGraph from "../components/RadarGraph.vue";
import UsageRecord from "../components/UsageRecord.vue";
import Carbon from "../components/Carbon.vue";
// import GaugeGraph from "../components/GaugeGraph.vue";
import { ref } from "vue";
import { useRouter } from 'vue-router';
import { defineProps, watch } from 'vue';

import station1 from "../assets/videos/station1.mp4"
import station2 from "../assets/videos/station2.mp4"
import station3 from "../assets/videos/station3.mp4"
import station4 from "../assets/videos/station4.mp4"
import station5 from "../assets/videos/station5.mp4"
import station6 from "../assets/videos/station6.mp4"
import station7 from "../assets/videos/station7.mp4"
import station8 from "../assets/videos/station8.mp4"
import station9 from "../assets/videos/station9.mp4"
import station10 from "../assets/videos/station10.mp4"
import station11 from "../assets/videos/station11.mp4"
import station12 from "../assets/videos/station12.mp4"


const stations = ref(["墙板生产线", "总装工作站"]);
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

const props = defineProps({
    wall: Boolean // 声明 wall 为一个布尔类型的 props
});


const emit = defineEmits(['backScreenVideo']);

const videoElement = ref(null);
const showImage = ref(true); // 控制图片和视频切换的状态
const showAllSpans = ref(true); // 控制 <span> 元素显示的变量
const isFadingOut = ref(false); // 控制淡出动画的变量
const isZoomed = ref(false); // 控制图片是否放大的标志
const transformOrigin = ref("center center");
const transformStyle = ref("scale(4) translate(0, 0)");
const currentVideoSrc = ref('');
// 当前被点击的按钮索引，初始值为 -1 表示没有按钮被点击
const activeButtonIndex = ref(-1);

const toggleMedia = (index, videoSrc) => {
    isFadingOut.value = true;
    if (videoElement.value) {
        videoElement.value.pause();
        // videoElement.value.currentTime = 0;
    }

    if (activeButtonIndex.value === index) {
        activeButtonIndex.value = -1; // 重置按钮索引

        setTimeout(() => {
            showImage.value = true; // 切换显示图片或视频
            isFadingOut.value = false;
        }, 500); // 动画时间
    }
    else {
        activeButtonIndex.value = index; // 更新当前被点击的按钮索引
        currentVideoSrc.value = videoSrc;
        console.log(`Switching to video: ${videoSrc}`);
        setTimeout(() => {
            showImage.value = false; // 切换显示图片或视频
            isFadingOut.value = false;

            // 确保新的视频播放
            if (videoElement.value) {
                videoElement.value.load(); // 重新加载视频源
                videoElement.value.play();
            }
        }, 500); // 动画时间
    }

};

// 视频播放结束时的回调函数
const handleVideoEnd = () => {
    isFadingOut.value = true;
    activeButtonIndex.value = -1; // 重置为未选择状态
    setTimeout(() => {
        showImage.value = true; // 切换显示图片或视频
        isFadingOut.value = false;
    }, 500); // 动画时间
};

const toggleSpans = () => {
    if (showAllSpans.value) {
        // 当前为显示状态，执行淡出动画后隐藏
        isFadingOut.value = true;
        setTimeout(() => {
            showAllSpans.value = false;
            isFadingOut.value = false;
        }, 500); // 设置超时时间为动画时长
    } else {
        // 当前为隐藏状态，恢复显示
        isFadingOut.value = true;

        setTimeout(() => {
            showAllSpans.value = true;
            isFadingOut.value = false;

        }, 500); // 设置超时时间为动画时长
    }
};

const toggleZoom = () => {
    if (!isZoomed.value) {
        // 获取点击位置
        const imgElement = event.target;
        const rect = imgElement.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        // 计算 transform-origin 的百分比位置
        const xPercent = (offsetX / rect.width) * 100;
        const yPercent = (offsetY / rect.height) * 100;

        // 设置 transform-origin 的百分比
        transformOrigin.value = `${xPercent}% ${yPercent}%`;

        // 计算偏移量，将点击位置移动到中心
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const translateX = (centerX - offsetX) / rect.width * 100;
        const translateY = (centerY - offsetY) / rect.height * 100;

        // 设置 transform 样式，包含放大和偏移
        transformStyle.value = `scale(2) translate(${translateX}%, ${translateY}%)`;
    } else {
        // 重置缩放和偏移
        transformOrigin.value = "center center";
        transformStyle.value = "scale(1) translate(0, 0)";
    }

    isZoomed.value = !isZoomed.value;
};

watch(showAllSpans, (newValue) => {
    emit('backScreenVideo', newValue);
});
</script>

<template>
    <main class="layout">
        <span v-if="carbon && showAllSpans" class="g4 animate__animated animate__fadeInRight grey"
            @mouseover="showToggle = true" @mouseout="showToggle = false"
            :class="['g4', 'grey', isFadingOut ? 'animate__fadeOutRight' : 'animate__fadeInRight']">
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
        <span v-if="!carbon && showAllSpans" class="g4 animate__animated animate__fadeInRight grey"
            @mouseover="showToggle = true" @mouseout="showToggle = false"
            :class="['g4', 'grey', isFadingOut ? 'animate__fadeOutRight' : 'animate__fadeInRight']">
            <i>
                <span class="click" @click="navigate('energyConsumption')">能耗数据</span>
                <el-dropdown class="tab">
                    <span class="el-dropdown-link" style="font-size: 15px; font-weight: 500;"> {{ line }} </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="changeStation(4, stations[0])">墙板生产线</el-dropdown-item>
                            <el-dropdown-item @click="changeStation(4, stations[1])">总装工作站</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </i>
            <LineGraph class="graph" :station="line" :stations="stations" />
            <p v-show="showToggle" class="toggleButton" @click="carbon = true">碳排放</p>
        </span>



        <span v-if="quality && showAllSpans" class="g3 animate__animated animate__fadeInLeft grey"
            @mouseover="showToggle2 = true" @mouseout="showToggle2 = false"
            :class="['g3', 'grey', isFadingOut ? 'animate__fadeOutLeft' : 'animate__fadeInLeft']">
            <i>
                <span class="click" @click="navigate('quality')">质量检测情况</span>
                <el-dropdown class="tab">
                    <span class="el-dropdown-link" style="font-size: 15px; font-weight: 500;"> {{ bar }} </span>

                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="changeStation(2, stations[0])">墙板生产线</el-dropdown-item>
                            <el-dropdown-item @click="changeStation(2, stations[1])">总装工作站</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </i>

            <Quality />
            <p v-show="showToggle2" class="toggleButton2" @click="quality = false">产品生产情况</p>
        </span>
        <span v-if="!quality && showAllSpans" class="g3 animate__animated animate__fadeInLeft grey"
            @mouseover="showToggle2 = true" @mouseout="showToggle2 = false"
            :class="['g3', 'grey', isFadingOut ? 'animate__fadeOutLeft' : 'animate__fadeInLeft']">
            <i>
                <span class="click" @click="navigate('product')">产品生产情况</span>
                <el-dropdown class="tab">
                    <span class="el-dropdown-link" style="font-size: 15px; font-weight: 500;"> {{ bar }} </span>

                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="changeStation(2, stations[0])">墙板生产线</el-dropdown-item>
                            <el-dropdown-item @click="changeStation(2, stations[1])">总装工作站</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </i>

            <BarGraph class="graph" :station="bar" :stations="stations" />
            <p v-show="showToggle2" class="toggleButton2" @click="quality = true">质量检测情况</p>
        </span>
        <span v-if="showAllSpans" class="g2 animate__animated animate__fadeInRight grey"
            :class="['g2', 'grey', isFadingOut ? 'animate__fadeOutRight' : 'animate__fadeInRight']">
            <p style="position: absolute;top: -65px;right:10vh">

                <el-dropdown>
                    <span style="font-size: 15px; font-weight: 500;">
                        <Switch style="width: 2vh; height: 2vh; color:white" />
                    </span>

                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="changeAllStation(stations[0])">墙板生产线</el-dropdown-item>
                            <el-dropdown-item @click="changeAllStation(stations[1])">总装工作站</el-dropdown-item>
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
                            <el-dropdown-item @click="changeStation(1, stations[0])">墙板生产线</el-dropdown-item>
                            <el-dropdown-item @click="changeStation(1, stations[1])">总装工作站</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </i>
            <!-- <BarGraph class="graph" :station="bar" :stations="stations" /> -->
            <!-- <LineGraph class="graph" :station="line" :stations="stations" /> -->

            <RadarGraph class="graph" :station="radar" :stations="stations" />
        </span>
        <span v-if="showAllSpans" class="g1 animate__animated animate__fadeInLeft grey"
            :class="['g1', 'grey', isFadingOut ? 'animate__fadeOutLeft' : 'animate__fadeInLeft']">
            <i>
                <span class="click" @click="navigate('inventory')">原材料使用情况</span>
                <el-dropdown class="tab">
                    <span class="el-dropdown-link" style="font-size: 15px; font-weight: 500;"> {{ usage }} </span>

                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="changeStation(3, stations[0])">墙板生产线</el-dropdown-item>
                            <el-dropdown-item @click="changeStation(3, stations[1])">总装工作站</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </i>

            <UsageRecord class="graph" :station="usage" :stations="stations" />
        </span>
        <span class="g5">
            <i v-if="wall"
                style="z-index: 1; cursor: pointer;text-align: center;border-image: linear-gradient(to right,transparent 10%,#6ea3d7 40%,#f3f7fcbb 50%,#6ea3d7 60%,transparent 90%) 2 10;top:1vh"
                class="animate__animated animate__fadeInUp" @click="toggleSpans">
                {{ showAllSpans ? '总览' : '返回首页' }} </i>

            <div v-if="!showAllSpans" class="video animate__animated animate__fadeIn" style="width: 100%; height: 100%;"
                :class="isFadingOut ? 'animate__fadeOut' : 'animate__fadeIn'">
                <div class="button">
                    <i class="b" style="flex: 1.2" :class="{ 'active': activeButtonIndex === 11 }"
                        @click="toggleMedia(11, station11)">墙板补钉及吊装下料</i>
                    <i class="b" style="flex: 1" :class="{ 'active': activeButtonIndex === 10 }"
                        @click="toggleMedia(10, station10)">自动尺寸检测</i>
                    <i class="b" style="flex: 1" :class="{ 'active': activeButtonIndex === 9 }"
                        @click="toggleMedia(9, station9)">水泥板打钉</i>
                    <i class="b" style="flex: 1" :class="{ 'active': activeButtonIndex === 8 }"
                        @click="toggleMedia(8, station8)">水泥板铺装</i>
                    <i class="b" style="flex: 1" :class="{ 'active': activeButtonIndex === 7 }"
                        @click="toggleMedia(7, station7)">墙板翻转机</i>
                    <i class="b" style="flex: 1" :class="{ 'active': activeButtonIndex === 6 }"
                        @click="toggleMedia(6, station6)">水泥板人工补钉</i>
                    <i class="b" style="flex: 1" :class="{ 'active': activeButtonIndex === 5 }"
                        @click="toggleMedia(5, station5)">水泥板打钉</i>
                    <i class="b" style="flex: 1" :class="{ 'active': activeButtonIndex === 4 }"
                        @click="toggleMedia(4, station4)">水泥板铺装</i>
                    <i class="b" style="flex: 1" :class="{ 'active': activeButtonIndex === 3 }"
                        @click="toggleMedia(3, station3)">钢结构反面焊接</i>
                    <i class="b" style="flex: 1" :class="{ 'active': activeButtonIndex === 2 }"
                        @click="toggleMedia(2, station2)">墙板翻转</i>
                    <i class="b" style="flex: 1" :class="{ 'active': activeButtonIndex === 1 }"
                        @click="toggleMedia(1, station1)">钢筋组装焊接</i>
                    <i class="b" style="flex: 4" :class="{ 'active': activeButtonIndex === 0 }"
                        @click="toggleMedia(0, station1)">钢结构组装焊接</i>

                </div>
                <div v-if="showImage" class="dot animate__animated animate__fadeIn">
                    <div class="d" style="left: 5%;" @click="toggleMedia(11, station12)">
                    </div>
                    <div class="d" style="left: 11%;" @click="toggleMedia(10, station11)">
                    </div>
                    <div class="d" style="left: 18%;" @click="toggleMedia(9, station10)">
                    </div>
                    <div class="d" style="left: 25%;" @click="toggleMedia(8, station9)">
                    </div>
                    <div class="d" style="left: 32%;" @click="toggleMedia(7, station8)">
                    </div>
                    <div class="d" style="left: 39%;" @click="toggleMedia(6, station7)">
                    </div>
                    <div class="d" style="left: 46%;" @click="toggleMedia(5, station6)">
                    </div>
                    <div class="d" style="right: 47%;" @click="toggleMedia(4, station5)">
                    </div>
                    <div class="d" style="right: 40%;" @click="toggleMedia(3, station4)">
                    </div>
                    <div class="d" style="right: 32%;" @click="toggleMedia(2, station3)">
                    </div>
                    <div class="d" style="right: 26%;" @click="toggleMedia(1, station2)">
                    </div>
                    <div class="d" style="right: 13%;" @click="toggleMedia(0, station1)">
                    </div>
                </div>
                <!-- <img v-if="showImage" src="../assets/images/全览1.png" style="width: 100%; height: 100%; " class="img"
                    :class="isZoomed ? 'zoomed' : isFadingOut ? 'animate__zoomOut' : 'animate__zoomIn'"
                    @click="toggleZoom($event)"
                    :style="{ transformOrigin: transformOrigin, transform: transformStyle }" />                 -->
                <img v-if="showImage" src="../assets/images/全览1.png" style="width: 100%; height: 100%; " class="img"
                    :class="isZoomed ? 'zoomed' : isFadingOut ? 'animate__fadeOut' : 'animate__fadeIn'" />
                <video v-else autoplay @ended="handleVideoEnd" ref="videoElement"
                    :class="isFadingOut ? 'animate__fadeOut' : 'animate__fadeIn'"
                    style="width: 100%; height: 100%; mix-blend-mode: screen;top: 2vh;position: relative; ">
                    <source :src="currentVideoSrc" type="video/mp4" />
                    您的浏览器不支持视频播放
                </video>

            </div>
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
    grid-template-rows: repeat(auto-fit, minmax(32vh, 1fr));
    grid-template-areas:
        "graph1 graph5 graph5 graph2"
        "graph3 graph5 graph5 graph4";
    /* flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  align-content: center; */
}

.graph {
    height: 32vh;
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
    z-index: 1;
    height: 80vh;
    padding-bottom: 4vh;
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

.video {
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
        url("../assets/images/map-10.png") no-repeat center fixed;
    background-size: cover;
    /* height: 150%; */
    overflow: hidden;
}



.img {
    background-color: transparent;
    position: relative;
    top: 8vh;
    /* mix-blend-mode: lighten; */
}

.zoomed {
    cursor: zoom-out;
    transition: transform 0.5s ease
}

.button {
    position: absolute;
    display: flex;
    padding: 0 1vh;
    width: 99%;
    overflow: hidden;
    z-index: 1;
    top: 15%;
}

.dot {
    position: absolute;
    display: flex;
    height: 2vh;
    padding: 0 1vh;
    width: 99%;
    z-index: 1;
    top: 56%;
}

.dot .d {
    /* position: absolute; */
    /* width: 1vh; */
    /* 光点大小 */
    /* height: 1vh; */
    /* background-color: rgba(216, 239, 239, 0.986); */
    /* 光点颜色 */
    /* border-radius: 50%; */
    /* 圆形 */
    /* box-shadow: 0 0 10px 5px rgba(250, 254, 255, 0.726); */
    /* 光点效果 */
    /* transform: translate(-50%, -50%); */
    /* 使光点居中 */
    cursor: pointer;
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: #c9dcef;
    /* 基础颜色 */
    border-radius: 50%;
    /* 圆形 */
    box-shadow: 0 0 15px 10px #6c9fd3, 0 0 30px 20px rgba(123, 202, 236, 0.025);
    animation: blink 2s infinite;
}


.dot .d::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(189, 224, 242, 0.751), transparent);
    transform: translate(-50%, -50%);
    animation: blink 4s infinite;
}

.button .b {
    cursor: pointer;
    font-weight: 400;
    font-size: 13px;
    text-align: center;
    margin-bottom: 1vh;
    border-image: linear-gradient(to right, transparent 10%, #6ea3d7 40%, #f3f7fcbb 50%, #6ea3d7 60%, transparent 90%) 2 10;
    top: 1vh;
}

.b.active {
    background-color: rgba(204, 223, 234, 0.178);
    border-radius: 2vh;
}

@keyframes blink {

    0%,
    100% {
        opacity: 1;
        /* 初始和结束时完全显示 */
    }

    50% {
        opacity: 0.5;
        /* 中间时刻半透明 */
    }
}
</style>