<script setup>
import { ref, watch, nextTick } from "vue";
import NotificationRow from "./NotificationRow.vue";

const msg = ref([]);
msg.value.push("设备故障报警");
msg.value.push("原材料库存量低");
msg.value.push("成品库存已达上限，请及时处理！");
msg.value.push("线上产品堆料已达上限，请及时处理！");
msg.value.push("产线上原材料即将耗尽，请尽快上料！");

// const load = () => {
//   msg.value.push("产线上原材料即将耗尽，请尽快上料！");
// };

const re = /警/;
const list = ref();
watch(
  () => msg,
  (newVal) => {
    nextTick(() => {
      if (newVal.value.length > 7)
        list.value.lastElementChild.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
    });
  },
  {
    deep: true,
  }
);

function start() {
  setInterval(function () {
    if (Math.random() > 0.5)
      //降低推送频率
      msg.value.push(msg.value[Math.floor(Math.random() * 5)]);
    // console.log(msg.value[Math.floor(Math.random() * 5)]);
    // console.log(msg);
  }, 10000);
}

setTimeout(start, 1000);
</script>

<template>
  <ul class="list" ref="list">
    <li v-for="item in msg" :key="item">
      <NotificationRow v-if="item.search(re) > 0" :red="true">
        <template #msg>{{ item }}</template>
      </NotificationRow>
      <NotificationRow v-else :red="false">
        <template #msg>{{ item }}</template>
      </NotificationRow>
    </li>
  </ul>
</template>

<style scoped>
.list {
  height: 35vh;
  margin-top: 1vh;
  overflow: auto;
}

::-webkit-scrollbar {
  display: none;
}

ul :nth-child(1) {
  animation: fadeInUpBig;
  animation-duration: 1s;
}

ul :nth-child(2) {
  /* animation: fadeInUpBig;
  animation-duration: 1.2s; */
}

ul :nth-child(3) {
  animation: fadeInUpBig;
  /* referring directly to the animation's @keyframe declaration */
  animation-duration: 1.4s;
}

ul :nth-child(4) {
  animation: fadeInUpBig;
  animation-duration: 1.6s;
}

ul :nth-child(5) {
  animation: fadeInUpBig;
  /* referring directly to the animation's @keyframe declaration */
  animation-duration: 1.8s;
}

ul :nth-child(6) {
  animation: fadeInUpBig;
  /* referring directly to the animation's @keyframe declaration */
  animation-duration: 2s;
}

ul :nth-child(7) {
  animation: fadeInUpBig;
  /* referring directly to the animation's @keyframe declaration */
  animation-duration: 2.2s;
}

/* .el-carousel__item {
  background-color: #40679a71;
  color: #ccc;
  opacity: 1;
  line-height: 5vh;
  margin: 0;
  text-align: center;
  height: 5vh;
} */

/* .el-carousel__item:nth-child(2n) {
  background-color: #99a9bf4a;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6c5;
} */</style>