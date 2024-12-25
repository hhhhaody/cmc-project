<template>
  <div class="carousel">
    <!-- 使用 ref 确保 videoPlayerRef 引用正确 -->
    <video ref="videoPlayerRef" class="video-js vjs-default-skin"></video>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const real1 = "/videos/xinggang_real.mp4";
const real2 = "/videos/fangtong_real.mp4";

const videos = [real1, real2];
const videoPlayerRef = ref(null); // 使用正确的 ref 名称
const currentVideoIndex = ref(0);
let player = null;
let intervalId = null;

onMounted(async () => {
  // 确保视频元素已渲染
  await nextTick();

  if (videoPlayerRef.value) {
    // 初始化 Video.js 播放器实例
    player = videojs(videoPlayerRef.value, {
      controls: false,
      autoplay: true,
      preload: 'auto',
      muted: false,
      loop: false, // 手动控制循环
      language: 'zh-CN'
    });

    // 设置初始视频源
    player.src([{ src: videos[currentVideoIndex.value], type: 'video/mp4' }]);

    // 视频播放完后自动切换
    player.on('ended', handleVideoEnd);

    // 设置定时器切换视频源
    intervalId = setInterval(() => {
      handleVideoSwitch();
    }, 15000);
  }
});

// 视频播放完后的切换逻辑
const handleVideoEnd = () => {
  handleVideoSwitch();
};

// 定义视频切换函数
const handleVideoSwitch = () => {
  currentVideoIndex.value = (currentVideoIndex.value + 1) % videos.length;
  player.src([{ src: videos[currentVideoIndex.value], type: 'video/mp4' }]);
  player.play();
};

// 清理资源，避免内存泄漏
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }

  if (player) {
    player.dispose();
  }
});
</script>

<style scoped>
.carousel {
  width: 98%;
  height: 85%;
  top: 1vh;
  left: 50%;
  transform: translateX(-50%);
  position: relative;
  overflow: hidden;
  border-radius: 1vh;
}

.carousel-item {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
  /* 非激活项不接受鼠标事件 */
}

.carousel-item.active {
  opacity: 1;
  pointer-events: auto;
  /* 激活项可以接受鼠标事件 */
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