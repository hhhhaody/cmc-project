<template>
  <div>
    <div ref="BarChartRef" class="echart"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, inject } from "vue";
const BarChartRef = ref();
onMounted(() => {
  // 注入echarts实例
  const echarts = inject("echarts");
  // 基于准备好的dom，初始化echarts实例
  const BarChart = echarts.init(BarChartRef.value, "vintage");
  // 绘制图表
  BarChart.setOption({
    // title: {
    //   text: "Bar Chart",
    // },
    tooltip: {},
    xAxis: {
      data: ["a", "b", "c", "d", "e", "f"],
    },
    yAxis: {},
    // grid: {
    //   bottom: "15%",
    // },
    series: [
      {
        name: "销量",
        type: "bar",
        data: [5, 20, 36, 10, 10, 20],
        // label: {
        //   show: true,
        //   position: "top",
        //   color: "#fff",
        //   fontSize: 15,
        //   textShadowColor: "#a3ccf9",
        //   textShadowBlur: 10,
        //   textShadowOffsetX: -1,
        //   textShadowOffsetY: 1,
        // },
        // itemStyle: {
        //   color: {
        //     type: "linear",
        //     x: 0,
        //     y: 0,
        //     x2: 0,
        //     y2: 1,
        //     colorStops: [
        //       {
        //         offset: 1,
        //         color: "#102032", // 100% 处的颜色
        //       },
        //       {
        //         offset: 0.5,
        //         color: "#1d73c4", // 50% 处的颜色
        //       },
        //       {
        //         offset: 0,
        //         color: "#aad7ff", // 0% 处的颜色
        //       },
        //     ],
        //     global: false, // 缺省为 false
        //   },
        //   opacity: 0.8,
        // },
        // emphasis: {
        //   disabled: true,
        // },
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