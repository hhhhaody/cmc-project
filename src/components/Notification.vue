<script setup>
import { ref, watch, nextTick, onUnmounted } from "vue";
import NotificationRow from "./NotificationRow.vue";
import { getMsgAPI } from "../apis/data"
import { useRouter } from 'vue-router';




const msg = ref([]);
const received = ref([])

const getDataFromAPI = async () => {

  const res = await getMsgAPI(new Date().toISOString().slice(0, 10));
  // console.log(res.data);
  if (msg.value.length != res.data.length) {
    msg.value = res.data

  }

};


const router = useRouter();
const navigate = (routeName) => {
  router.push({ name: routeName });
};

getDataFromAPI()

// msg.value.push("设备故障报警");
// msg.value.push("原材料库存量低");
// msg.value.push("成品库存已达上限，请及时处理！");
// msg.value.push("线上产品堆料已达上限，请及时处理！");
// msg.value.push("产线上原材料即将耗尽，请尽快上料！");

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

//定时获取最新数据
let id

function start() {
  id = setInterval(function () {
    console.log("获取信息数据");
    getDataFromAPI()
  }, 10000);
}
setTimeout(start, 1000);

onUnmounted(() => {
  clearInterval(id);
});
</script>

<template>
  <ul class="list" ref="list">
    <li v-for="item in msg" :key="item">
      <NotificationRow v-if="item.msg.search(re) > 0" :red="true" style="cursor:pointer"
        @click="navigate('deviceMonitor')">
        <template #msg>{{ item.msg }}</template>
      </NotificationRow>
      <NotificationRow v-else :red="false">
        <template #msg>{{ item.msg }}</template>
      </NotificationRow>
    </li>
  </ul>
</template>

<style scoped>
.list {
  height: 28vh;
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
} */
</style>