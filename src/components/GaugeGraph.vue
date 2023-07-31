<template>
  <div>
    <div ref="GaugeChartRef" class="echart"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, toRefs, watch } from "vue";

const { value } = toRefs(props);
const GaugeChartRef = ref();
const props = defineProps(["value"]);
const GaugeChart = ref(null);

onMounted(() => {
  // 注入echarts实例
  const echarts = inject("echarts");
  // 基于准备好的dom，初始化echarts实例
  GaugeChart.value = echarts.init(GaugeChartRef.value, "vintage");

  // 绘制初始图表
  drawGaugeChart(value.value);

  // 监听value prop的变化，并在变化时更新图表数据
  watch(value, (newValue) => {
    drawGaugeChart(newValue);
  });
});

function drawGaugeChart(val) {
  if (GaugeChart.value) {
    const option = generateChartOption(val);
    GaugeChart.value.setOption(option);
  }
}

function generateChartOption(val) {
  return {
    series: [
      {
        type: "gauge",
        radius: "95%",
        progress: {
          show: true,
        },
        data: [
          {
            value: val,
          },
        ],
      },
    ],
  };
}

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