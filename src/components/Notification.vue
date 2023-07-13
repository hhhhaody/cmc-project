<script setup>
import { ref } from "vue";
import NotificationRow from "./NotificationRow.vue";

const msg = ref([]);
msg.value.push("设备故障报警");
msg.value.push("原材料库存量低");
msg.value.push("成品库存已达上限，请及时处理！");
msg.value.push("线上产品堆料已达上限，请及时处理！");
msg.value.push("产线上原材料即将耗尽，请尽快上料！");
</script>

<template>
  <!-- <el-carousel height="15vh" direction="vertical" type="card" :autoplay="true">
    <el-carousel-item v-for="item in msg" :key="item">
      {{ item }}
    </el-carousel-item>
  </el-carousel> -->
  <ul>
    <li v-for="item in msg" :key="item">
      <NotificationRow>
        <template #msg>{{ item }}</template>
      </NotificationRow>
    </li>
  </ul>
</template>

<style scoped>
/* ul {
  margin: 2vh 1vh;
} */

/* ul > li {
  margin: 2vh 0;
} */

ul :nth-child(1) {
  animation: fadeInUpBig; /* referring directly to the animation's @keyframe declaration */
  animation-duration: 1s;
}
ul :nth-child(2) {
  animation: fadeInUpBig; /* referring directly to the animation's @keyframe declaration */
  animation-duration: 1.2s;
}
ul :nth-child(3) {
  animation: fadeInUpBig; /* referring directly to the animation's @keyframe declaration */
  animation-duration: 1.4s;
}
ul :nth-child(4) {
  animation: fadeInUpBig; /* referring directly to the animation's @keyframe declaration */
  animation-duration: 1.6s;
}
ul :nth-child(5) {
  animation: fadeInUpBig; /* referring directly to the animation's @keyframe declaration */
  animation-duration: 1.8s;
}
ul :nth-child(6) {
  animation: fadeInUpBig; /* referring directly to the animation's @keyframe declaration */
  animation-duration: 2s;
}
ul :nth-child(7) {
  animation: fadeInUpBig; /* referring directly to the animation's @keyframe declaration */
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
} */
</style>