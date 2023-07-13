<template>
  <div>
    <div ref="LineChartRef" class="echart"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, inject } from "vue";
function randomData() {
  now = new Date(+now + oneDay);
  value = value + Math.random() * 21 - 10;
  return {
    name: now.toString(),
    value: [
      [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/"),
      Math.round(value),
    ],
  };
}

let data = ref([]);
let now = Date.now();
let oneDay = 24 * 3600 * 1000;
let value = Math.random() * 1000;
for (var i = 0; i < 1000; i++) {
  data.value.push(randomData());
}
// console.log(data);

const LineChartRef = ref();
onMounted(() => {
  // 注入echarts实例
  const echarts = inject("echarts");
  // 基于准备好的dom，初始化echarts实例
  const LineChart = echarts.init(LineChartRef.value, "vintage");
  // 绘制图表
  LineChart.setOption({
    // title: {
    //   text: "Line Chart",
    // },
    // xAxis: {
    //   type: "category",
    //   data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    // },
    // yAxis: {
    //   type: "value",
    // },
    // series: [
    //   {
    //     data: [820, 932, 901, 934, 1290, 1330, 1320],
    //     type: "line",
    //     smooth: true,
    //   },
    //   {
    //     data: [801, 952, 919, 914, 1200, 930, 1620],
    //     type: "line",
    //     smooth: true,
    //   },
    // ],

    // title: {
    //   text: "Dynamic Data & Time Axis",
    // },

    // visualMap: [
    //   {
    //     show: false,
    //     type: "continuous",
    //     dimension: 0,
    //   },
    // ],
    // grid: {
    //   bottom: "15%",
    // },
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        params = params[0];
        let date = new Date(params.name);
        return (
          date.getMonth() +
          1 +
          "/" +
          date.getDate() +
          "/" +
          date.getFullYear() +
          " " +
          date.getHours() +
          ":" +
          date.getMinutes() +
          " : " +
          params.value[1]
        );
      },
      // axisPointer: {
      //   animation: true,
      //   lineStyle: {
      //     color: "#fff",
      //     width: 0.2,
      //     type: "solid",
      //   },
      // },
      // backgroundColor: "#1019285f",
      // textStyle: {
      //   color: "fff",
      //   textShadowColor: "#3d93c6",
      //   textShadowBlur: 5,
      // },
    },
    xAxis: {
      type: "time",
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: "value",
      boundaryGap: [0, "100%"],
      splitLine: {
        show: false,
      },
    },
    series: [
      {
        name: "Fake Data",
        type: "line",
        showSymbol: false,
        data: data.value,
      },
    ],
  });

  function start() {
    setInterval(function () {
      for (var i = 0; i < 5; i++) {
        data.value.shift();
        data.value.push(randomData());
      }
      LineChart.setOption({
        series: [
          {
            data: data.value,
          },
        ],
      });
    }, 1000);
  }

  // setTimeout(start, 2000);
});
</script>
<style lang="scss" scoped>
.echart {
  width: 100%;
  height: 100%;
}
</style>