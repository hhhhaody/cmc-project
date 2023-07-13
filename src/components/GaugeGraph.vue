<template>
  <div>
    <div ref="GaugeChartRef" class="echart"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, inject } from "vue";
const GaugeChartRef = ref();

const props = defineProps(["value"]);
const value = ref(props.value);
onMounted(() => {
  // 注入echarts实例
  const echarts = inject("echarts");
  // 基于准备好的dom，初始化echarts实例
  const GaugeChart = echarts.init(GaugeChartRef.value, "vintage");
  // 绘制图表
  GaugeChart.setOption({
    // title: {
    //   text: "Gauge Chart",
    // },
    // tooltip: {
    //   formatter: "{a} <br/>{b} : {c}%",
    // },
    // grid: {
    //   top: "15%",
    // },
    series: [
      {
        type: "gauge",
        radius: "95%",
        progress: {
          show: true,
        },
        data: [
          {
            value: value.value,
          },
        ],
        // axisLine: {
        //   show: false,
        // },
        // splitLine: {
        //   show: false,
        // },
        // axisTick: {
        //   show: false,
        // },
        // axisLabel: {
        //   show: false,
        // },
        // pointer: {
        //   show: true,
        //   icon: "triangle",
        //   offsetCenter: ["0%", "-80%"],
        //   length: "6%",
        //   width: 10,
        //   itemStyle: {
        //     color: "#fff",
        //     opacity: 0.8,
        //     shadowColor: "#2495fd",
        //     shadowBlur: 20,
        //   },
        // },
        // detail: {
        //   color: "#fff",
        //   fontSize: 40,
        //   textShadowColor: "#a3ccf9",
        //   textShadowBlur: 5,
        //   textShadowOffsetX: -1,
        //   textShadowOffsetY: 1,
        //   valueAnimation: true,
        //   offsetCenter: [0, "0%"],
        //   formatter: "{value}" + "%",
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
        //         color: "#1861a5", // 100% 处的颜色
        //       },
        //       {
        //         offset: 0.5,
        //         color: "#154676", // 50% 处的颜色
        //       },
        //       {
        //         offset: 0,
        //         color: "#68b7fe", // 0% 处的颜色
        //       },
        //     ],
        //     global: false, // 缺省为 false
        //   },
        //   opacity: 0.7,
        //   shadowColor: "#fff",
        //   shadowBlur: 10,
        //   borderWidth: "0",
        // },
        // silent: true,
      },
    ],
  });
});
</script>
<style lang="scss" scoped>
.echart {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>