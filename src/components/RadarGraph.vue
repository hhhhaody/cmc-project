<template>
  <div>
    <div ref="RadarChartRef" class="echart"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, inject } from "vue";
const RadarChartRef = ref();

onMounted(() => {
  // 注入echarts实例
  const echarts = inject("echarts");
  // 基于准备好的dom，初始化echarts实例
  const RadarChart = echarts.init(RadarChartRef.value, "vintage");
  // 绘制图表
  RadarChart.setOption({
    // title: {
    //   text: "Radar Chart",
    // },
    // legend: {
    //   data: ["Allocated Budget", "Actual Spending"],
    // },
    // grid: {
    //   bottom: "15%",
    // },
    radar: {
      //   shape: "circle",
      indicator: [
        { name: "Station 1" },
        { name: "Station 2" },
        { name: "Station 3" },
        { name: "Station 4" },
        { name: "Station 5" },
        { name: "Station 6" },
      ],
      center: ["50%", "50%"],
      radius: "60%",
    },
    series: [
      {
        // name: "Budget vs spending",
        type: "radar",
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: "Allocated Budget",
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: "Actual Spending",
          },
        ],
      },
    ],
  });
});
</script>
<style lang="scss" scoped>
.echart {
  width: 100%;
  height: 100%;
}
</style>