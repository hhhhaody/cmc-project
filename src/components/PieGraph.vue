<template>
  <div>
    <div ref="PieChartRef" class="echart"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, inject, computed } from "vue";
const PieChartRef = ref();

const props = defineProps({
  pieName: { type: String, default: "总设备数" },
  online: { type: Number, default: 1250 },
  offline: { type: Number, default: 320 },
});

const online = ref(props.online);
const offline = ref(props.offline);
const pieName = ref(props.pieName);
const space = computed(() => (online.value + offline.value) / 50);

const data = ref([]);
data.value = [
  {
    value: space.value,
    name: "none",
  },
  { value: online.value, name: "在线" },
  {
    value: space.value,
    name: "none",
  },
  { value: offline.value, name: "离线" },
];
onMounted(() => {
  // 注入echarts实例
  const echarts = inject("echarts");
  // 基于准备好的dom，初始化echarts实例
  const PieChart = echarts.init(PieChartRef.value, "vintage");
  // 绘制图表
  PieChart.setOption({
    title: {
      text: pieName.value,
      x: "center",
      y: "85%",
      textStyle: {
        fontSize: "3vh",
      },
    },
    color: [
      "transparent",
      {
        type: "linear",
        x: 0,
        y: 0,
        x2: 1,
        y2: 0,
        colorStops: [
          {
            offset: 0,
            color: "#3ea4ff",
          },
          {
            offset: 1,
            color: "#6abadd",
          },
        ],
        global: false,
      },
      {
        type: "linear",
        x: 0,
        y: 0,
        x2: 1,
        y2: 0,
        colorStops: [
          {
            offset: 1,
            color: "#bf4252",
          },
          {
            offset: 0,
            color: "#cf6d78",
          },
        ],
        global: false,
      },
    ],
    width: "50%",
    legend: {
      icon: "circle",
      data: ["none", "在线", "离线"],
      orient: "vertical",
      //   padding: [0, 0, 0, 50],
      itemWidth: 5,
      itemHeight: 5,
      itemStyle: {
        shadowColor: "#ccc",
        shadowBlur: 15,
      },

      x: "40%",
      y: "center",
      textStyle: {
        color: "#fff",
        fontSize: "5vh",
        fontFamily: "serif",
        rich: {
          0: {
            fontWeight: "lighter",
          },
          1: {
            fontSize: "6vh",
          },
        },
      },

      formatter: function (name) {
        let index;
        // let datas = data;
        let totalNum = 0;
        data.value.forEach(function (v, i) {
          if (v.name !== "none") totalNum += v.value;
        });
        let legendData = ["none", "在线", "none", "离线"];
        legendData.forEach(function (v, i) {
          if (v == name) {
            index = i;
          }
        });
        // console.log(datas); //打印结果见下图
        if (name === "none") {
          return "{0|设备总数}   " + " {1|" + totalNum + "}";
        } else {
          return (
            "{0|" + name + "}  " + "{1|" + data.value[index].value + "}"
            // name + "   " + data.value[index].value
            // " " +
            // ((data.value[index].value / totalNum) * 100).toFixed(2) +
            // "%"
          );
        }
      },
    },
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        name: "Devices",
        type: "pie",
        radius: ["60%", "70%"],
        center: ["40%", "50%"],
        avoidLabelOverlap: true,
        label: {
          show: false,
        },
        startAngle: 275,
        emphasis: {
          label: {
            show: false,
          },
        },
        labelLine: {
          show: false,
        },
        data: data.value,

        itemStyle: { shadowColor: "#d9e6ec54", shadowBlur: 5 },
      },
    ],
  });
  window.onresize = function () {
    PieChart.resize();
  };
  function start() {
    setInterval(function () {
      online.value += 50;
      //   console.log(online.value);
      offline.value += 2;

      PieChart.setOption({
        series: [
          {
            data: [
              {
                value: space.value,
                name: "none",
              },

              { value: online.value, name: "在线" },
              {
                value: space.value,
                name: "none",
              },
              { value: offline.value, name: "离线" },
            ],
          },
        ],
      });
    }, 1000);
  }

  //   setTimeout(start, 2000);
});
</script>
<style lang="scss" scoped>
.echart {
  width: 100%;
  height: 100%;
  //   height: 18vh;
  //   width: 18vh;
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
}
</style>