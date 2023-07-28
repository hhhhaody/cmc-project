<template>
    <div class="carousel">
      <div v-for="(url, index) in urls" :key="index" class="carousel-item" :class="{ active: currentIndex === index }">
        <video ref="videos" autoplay loop muted></video>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, nextTick } from "vue";
  import Hls from "hls.js";
  
  const urls = [
    "http://113.106.166.37:7086/live/cameraid/1000014%240/substream/2.m3u8",
    "http://113.106.166.37:7086/live/cameraid/1000011%240/substream/2.m3u8",
    "http://113.106.166.37:7086/live/cameraid/1000018%240/substream/2.m3u8",
    "http://113.106.166.37:7086/live/cameraid/1000014%240/substream/2.m3u8",
  ];
  
  const videos = ref([]);
  const currentIndex = ref(0);
  let intervalId = null;
  
  onMounted(async () => {
    await nextTick();
    urls.forEach((url, index) => {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(videos.value[index]);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          videos.value[index].play();
        });
      } else if (videos.value[index].canPlayType("application/vnd.apple.mpegurl")) {
        videos.value[index].src = url;
        videos.value[index].addEventListener("loadedmetadata", function () {
          videos.value[index].play();
        });
      }
    });
  
    intervalId = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % urls.length;
    }, 5000); // 每5秒切换一次
  });
  
  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  });
  </script>
  
  <style scoped>
  .carousel {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center; 
    align-items: center;
    margin-top: -25px;
    margin-left: -13px;
  }
  
  .carousel-item {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.5s;
    display: flex;
    justify-content: center; 
    align-items: center;
  }
  
  .carousel-item.active {
    opacity: 1;
  }
  
  video {
    width: 90%;     /* 调整这个值来改变视频的宽度 */
    height: 80%;    /* 调整这个值来改变视频的高度 */
    object-fit: cover;
    border-radius: 10px;
  }
  </style>
  