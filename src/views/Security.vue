<script setup>
import { ref, onMounted, watchEffect, reactive, watch, toRefs, inject } from "vue";
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import Hls from "hls.js"; // 引入Hls.js库，用于播放m3u8格式的视频流
import MyCollapse from "@/components/MyCollapse.vue"; // 引入自定义组件MyCollapse

// m3u8视频流地址列表
const videoUrls = [
  'http://113.106.166.37:7086/live/cameraid/1000022%240/substream/2.m3u8',
  'http://113.106.166.37:7086/live/cameraid/1000018%240/substream/2.m3u8',
  'http://113.106.166.37:7086/live/cameraid/1000016%240/substream/2.m3u8',
  'http://113.106.166.37:7086/live/cameraid/1000015%240/substream/2.m3u8',
  'http://113.106.166.37:7086/live/cameraid/1000014%240/substream/2.m3u8',
  'http://113.106.166.37:7086/live/cameraid/1000008%240/substream/2.m3u8',
  'http://113.106.166.37:7086/live/cameraid/1000005%240/substream/2.m3u8',
  'http://113.106.166.37:7086/live/cameraid/1000004%240/substream/2.m3u8',
];

// 定义用于保存video元素引用的变量
const videoPlayer1 = ref(null);
const videoPlayer2 = ref(null);
const videoPlayer3 = ref(null);
const videoPlayer4 = ref(null);
const videoElements = [videoPlayer1, videoPlayer2, videoPlayer3, videoPlayer4];

// 声明响应式对象，用于保存当前的视频流列表
const state = reactive({
  currentStreams: []
});

// 定义处理默认视频流的函数
const handleDefaultStreams = (defaultStreams) => {
  state.currentStreams = defaultStreams;
};

// 将响应式对象转化为可引用的对象
const refs = toRefs(state);

// 定义处理视频流改变的函数
const handleStreamChanged = ({ stream, index }) => {
  let newStreams = [...refs.currentStreams.value];
  newStreams[index] = stream;
  refs.currentStreams.value = newStreams;
};

// 在组件挂载后执行的操作
onMounted(() => {
  // 对每个视频元素进行监听
  videoElements.forEach((elementRef, index) => {
    // 当对应的视频流发生变化时进行处理
    watch(() => refs.currentStreams.value[index], (newStream) => {
      if (elementRef.value) {
        // 如果浏览器支持Hls
        if (Hls.isSupported()) {
          // 如果视频元素已有hls对象，先销毁
          if (elementRef.value.hls) {
            elementRef.value.hls.destroy();
          }
          // 创建新的Hls对象，并绑定到视频元素上
          const hls = new Hls();
          elementRef.value.hls = hls;
          hls.attachMedia(elementRef.value);
          hls.loadSource(newStream);

          // 对Hls对象的事件进行监听，处理错误情况
          hls.on(Hls.Events.ERROR, function (event, data) {
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  console.log("fatal network error encountered, try to recover");
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  console.log("fatal media error encountered, try to recover");
                  hls.recoverMediaError();
                  break;
                default:
                  hls.destroy();
                  break;
              }
            }
          });
        } else if (elementRef.value.canPlayType("application/vnd.apple.mpegurl")) {
          // 如果浏览器不支持Hls但支持mpegURL格式，直接设置视频源
          elementRef.value.src = newStream;
        }

        // 自动播放视频
        elementRef.value.play();

      }
    });
  });

  // 如果初始的视频流列表非空，尝试播放所有视频
  if (refs.currentStreams.value.length > 0) {
    videoElements.forEach((elementRef, index) => {
      if (elementRef.value) {
        elementRef.value.play();
      }
    });
  }
});

</script>

<!-- 模板部分，这个页面用于展示一些视频流，大致可以分为左侧的一个大视频窗口，
右上侧的三个小视频窗口，以及右下侧的一个自定义折叠组件MyCollapse。 -->
<template>
  <dv-border-box1 ref="borderRef" class="subNavPage animate__animated animate__zoomIn" :color="['#4f698794', '#4f698794']"
    background-color="#3545659e">
    <br />
    <h1>远程视频监控</h1>
    <div class="video-grid">
      <div class="video-container video-large">
        <video ref="videoPlayer1" controls type="application/x-mpegURL"></video>
      </div>
      <div class="video-container video-small">
        <video ref="videoPlayer2" controls type="application/x-mpegURL"></video>
      </div>
      <div class="video-container video-small">
        <video ref="videoPlayer3" controls type="application/x-mpegURL"></video>
      </div>
      <div class="video-container video-small">
        <video ref="videoPlayer4" controls type="application/x-mpegURL"></video>
      </div>
      <div class="right-sidebar">
        <my-collapse @stream-changed="handleStreamChanged" @default-streams="handleDefaultStreams"></my-collapse>
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
  grid-template-columns: 50% 25% 20%;
  grid-gap: 5px;
  height: 600px;
}

.video-container {
  width: 90%;
  height: 100%;
  padding: 5px;
  box-sizing: border-box;
  overflow: hidden;
  /*防止视频元素溢出*/
  position: relative;
  /*为了让视频元素能够绝对定位*/
  top: 30px;
}

.video-large {
  grid-column: 1 / 2;
  /* 左侧大视频框占用第1列 */
  grid-row: 1 / 4;
  /* 左侧大视频框占用第1行到第3行 */
  margin-left: 8%;
  /* margin-top: 5%; */

}

.video-small {
  grid-column: 2 / 3;
  /* 右侧三个小视频框占用第2列 */
}

video {
  position: absolute;
  /* 为了让视频元素能够绝对定位 */
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: 3%;
  object-fit: cover;
}

.right-sidebar {
  grid-column: 3 / 4;
  /* 右侧边栏占用第4列 */
  grid-row: 1 / 4;
  /* 右侧边栏占用第1行到第3行 */
  overflow: auto;
  /* 为了让右侧边栏内容超出时能够滚动 */
  margin-top: 30px;
}
</style>