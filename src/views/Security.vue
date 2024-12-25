<script setup>
import { ref, onMounted, reactive, watch, onBeforeUnmount, nextTick } from "vue";
import { ElMessage } from 'element-plus';
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import MyCollapse from "@/components/MyCollapse.vue"; // 引入自定义组件MyCollapse
import { updateVideoInfoAPI, getVideoStreamAPI } from "../apis/video";

import real1 from "../assets/videos/xinggang_real.mp4"
import real2 from "../assets/videos/fangtong_real2.mp4"

const players = [];

onMounted(async () => {
  // 新增：等待默认的视频流被加载
  const waitForDefaultStreams = new Promise((resolve) => {
    const unwatch = watch(
      () => state.isDefaultStreamsLoaded,
      (newValue) => {
        if (newValue) {
          unwatch();  // 停止观察
          resolve();
        }
      }
    );
  });
  await waitForDefaultStreams;  // 等待

  // 在组件挂载后初始化 video.js
  await nextTick();  // 确保所有的 DOM 更新已完成
  videoRefs.value.forEach((videoEl, index) => {
    if (videoEl) {
      setupVideoJs(videoEl, index);
    }
  });
})

// 定义一个函数，该函数在按钮被点击时调用
const handleButtonClick = async () => {
  const response = await updateVideoInfoAPI({});
  if (response) {  // 假设你的 API 返回一个判定成功的响应对象
    ElMessage({
      message: '更新成功',
      type: 'success'
    });
  } else {
    ElMessage({
      message: '更新失败',
      type: 'error'
    });
  }
};

const videoRefs = ref(Array(4).fill(null));


const setupVideoJs = (videoEl, index) => {
  if (!videoEl) {
    console.error('Video element not found.');
    return;
  }

  // video.js 配置选项
  const videoJsOptions = {
    controls: false, // 显示控制条
    autoplay: true, // 自动播放
    preload: 'auto', // 预加载
    muted: false, // 初始静音状态
    language: 'zh-CN', // 设置语言
    // fill: true, // 自动填充
    loop: true,
    // 你可以根据需要添加更多选项
  };

  // 初始化 video.js
  const player = videojs(videoEl, videoJsOptions);
  players.push(player);

  // 设置视频源
  if (state.currentStreams[index]) {
    // player.src({
    //   type: 'application/x-mpegURL',
    //   src: state.currentStreams[index]
    // });
    player.src({
      type: 'video/mp4',
      src: state.currentStreams[index]
    });
  }

  // 添加错误处理
  player.on('error', function () {
    console.error('播放错误:', this.error());
  });

  // 其他事件监听，例如：
  player.on('play', function () {
    console.log('播放开始');
  });

  player.on('ended', function () {
    console.log('播放结束');
  });

  // 将 player 对象存储在 video 元素中，以便以后引用
  videoEl.player = player;
};

onBeforeUnmount(() => {
  players.forEach(player => {
    if (player) {
      player.dispose();
    }
  });
});

async function handlePointSelected({ indexCode, index }) {
  try {
    const response = await getVideoStreamAPI(indexCode);
    if (response.code === "0") {
      const url = response.data.url;
      ElMessage({
        message: '视频加载中',
        type: 'success'
      });

      // 更新对应index的视频流
      let newStreams = [...state.currentStreams];
      newStreams[index] = url;
      state.currentStreams = newStreams;

      // 等待下一个Vue的DOM更新周期
      await nextTick();

      // 确保 video 元素存在
      const videoEl = videoRefs.value[index];
      if (videoEl) {
        setupVideoJs(videoEl, index);
      } else {
        console.error('Video element not found.');
      }

    } else {
      // ElMessage({
      //   message: '获取视频流失败',
      //   type: 'error'
      // });
    }
  } catch (error) {
    // ElMessage({
    //   message: '获取视频流失败',
    //   type: 'error'
    // });
  }
}

const defaultStreams = ref([]);

// 定义处理默认视频流的函数
const handleDefaultStreams = async (defaultIndexCodes) => {
  for (let index = 0; index < defaultIndexCodes.length; index++) {
    await handlePointSelected({
      indexCode: defaultIndexCodes[index],
      index: index,
    });
  }
  state.isDefaultStreamsLoaded = true;
};

// 在 state 对象中加入一个标识符
const state = reactive({
  // currentStreams: Array(4).fill(''),
  currentStreams: [real1, real2],
  isDefaultStreamsLoaded: false,  // 添加这个标识符
});

</script>

<template>
  <dv-border-box1 ref="borderRef" class="subNavPage animate__animated animate__zoomIn"
    :color="['#4f698794', '#4f698794']" background-color="#3545659e">
    <br />
    <h1 style="font-size:21px">远程视频监控</h1>
    <div class="calendar-container">
      <div class="video-grid">
        <div v-for="(stream, index) in state.currentStreams" :key="index" class="video-box">
          <div class="video-placeholder" v-if="!stream">
            <img src="/src/assets/images/noPlay.png" alt="Camera" />
            <p>暂无数据</p>
          </div>
          <video :ref="el => { videoRefs[index] = el }" class="video-js vjs-default-skin"></video>

        </div>
        <div class="right-sidebar">
          <el-button @click="handleButtonClick" type="primary"
            style="margin-right: 70%; margin-bottom: 10px">监控状态更新</el-button>
          <my-collapse @point-selected="handlePointSelected" @default-streams="handleDefaultStreams"></my-collapse>
        </div>
      </div>
    </div>
  </dv-border-box1>
</template>

<style scoped>
.subNavPage {
  border-radius: 3%;
  color: #fff;
  height: 100%;
  width: 95%;
  margin: 0 auto;
  position: relative;
}

.video-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 16px;
  width: 70%;
  margin-right: 25%;
}

.video-box {
  top: 5vh;
  background-color: rgb(242, 242, 242);
  border: 2px solid rgb(242, 242, 242);
  border-radius: 1vh;
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
  /* padding-bottom: 30%; */
  padding-bottom: 56.25%;
}

.video-js {
  position: absolute;
  /* top: -75px;
  left: -1px;
  z-index: 10;
  width: 100%;
  height: 270%;
  border-radius: 1vh;  */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 1vh;
}

.video-js video {
  /* object-fit: fill; */
  object-fit: contain;
  width: 100%;
  height: 100%;
}


.calendar-container {
  width: 96%;
  height: 87%;
  margin-left: 37px;
  position: relative;
  background-color: white;
  border-radius: 1vh;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.right-sidebar {
  position: absolute;
  right: 70px;
  top: 20px;
  width: 20%;
}

.video-placeholder {
  position: relative;
  top: 120%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.video-placeholder img {
  max-width: 75px;
  max-height: 75px;
  background-color: rgb(242, 242, 242);
  z-index: 1;
}

.video-placeholder p {
  margin-top: 10px;
  font-size: 16px;
  color: rgb(81, 90, 110);
  z-index: 1;
}

.selected {
  border: 2px solid rgb(102, 102, 102);
}
</style>