<template>
  <div class="carousel">
    <div v-for="(name, index) in Object.keys(indexCodeInfo)" :key="name" class="carousel-item"
      :class="{ active: currentName === name }">
      <video :id="`video-${index}`" class="video-js vjs-default-skin"></video>
    </div>
  </div>
</template>
  
<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from "vue";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { getVideoStreamAPI } from '../apis/video';

const indexCodeInfo = reactive({
  '监控点位1': '5363b5f5880b49c29dcbfa199ce3f11f',
  '监控点位2': '8f4800455a984875b4a2f8e670879f8b',
  '监控点位3': '7e37741ff6954cbebbbc60d6608d36e1',
  '监控点位4': '301790102285474c873196aa8a32bfa2',
  '监控点位5': 'c8c0ba638ecd446a9778f1b72d9e5770',
  '监控点位6': 'e897fed708ec4c66a7488ed605d82d68',
  '监控点位7': '01a78a827d564de89244eb9c080caffe',
  '监控点位8': 'b11f232628cc4838968af8ab3291ccaa',
});

// video.js 配置选项
const videoJsOptions = {
  controls: true, // 显示控制条
  autoplay: true, // 自动播放
  preload: 'auto', // 预加载
  muted: false, // 初始静音状态
  language: 'zh-CN', // 设置语言
  // fill: true, // 自动填充
  // 你可以根据需要添加更多选项
};

const currentName = ref(Object.keys(indexCodeInfo)[0]);
const videoPlayers = ref({});
let intervalId = null;

onMounted(async () => {
  await nextTick();

  Object.entries(indexCodeInfo).forEach(([name, indexCode], index) => {
    getVideoStreamAPI(indexCode).then(response => {
      const streamUrl = response.data.url; // 根据API返回的实际结构调整这里的路径
      const videoElementId = `video-${index}`;
      const videoElement = document.getElementById(videoElementId);

      // 确保这里不再创建新的video元素，而是直接应用video.js到现有的video标签
      const playerOptions = {
        ...videoJsOptions,
        sources: [{ src: streamUrl, type: 'application/x-mpegURL' }],
      };
      const player = videojs(videoElement, playerOptions);
      videoPlayers.value[name] = player;
    });
  });

  intervalId = setInterval(() => {
    const names = Object.keys(indexCodeInfo);
    const currentIndex = names.indexOf(currentName.value);
    const nextName = names[(currentIndex + 1) % names.length];

    // 暂停当前视频
    if (videoPlayers.value[currentName.value]) {
      videoPlayers.value[currentName.value].pause();
    }

    // 播放下一个视频
    currentName.value = nextName;
    if (videoPlayers.value[nextName]) {
      videoPlayers.value[nextName].play();
      // 确保用户活动状态，以便控件可见
      videoPlayers.value[nextName].userActive(true);
    }
  }, 15000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }

  // 销毁所有的播放器实例
  Object.values(videoPlayers.value).forEach(player => {
    if (player) {
      player.dispose();
    }
  });
});
</script>
  
<style scoped>
.carousel {
  width: 431px;
  height: 300px;
  margin-top: 13px;
  margin-left: 8px;
  position: relative;
  overflow: hidden;
  border-radius: 7px;
}

.carousel-item {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;  /* 非激活项不接受鼠标事件 */
}

.carousel-item.active {
  opacity: 1;
  pointer-events: auto;  /* 激活项可以接受鼠标事件 */
}

.video-js {
  width: 100%;
  height: 100%;
  border-radius: 7px;
}

.video-js video {
  object-fit: fill;
}
</style>
  