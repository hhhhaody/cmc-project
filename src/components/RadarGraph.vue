<template>
  <div>
    <div ref="RadarChartRef" class="echart"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, inject, watch, nextTick } from "vue";
const RadarChartRef = ref();

const props = defineProps({
  station: { type: String, default: "station1" },
});

const data = ref([]);

data.value = [
  {
    value: [4200, 3000, 20000, 35000, 50000, 18000],
    name: "Allocated Budget",
  },
  {
    value: [5000, 14000, 28000, 26000, 42000, 21000],
    name: "Actual Spending",
  },
];

// const echarts = inject("echarts");
// 基于准备好的dom，初始化echarts实例
let RadarChart;

onMounted(() => {
  // // 注入echarts实例
  const echarts = inject("echarts");
  // // 基于准备好的dom，初始化echarts实例
  // const RadarChart = echarts.init(RadarChartRef.value, "vintage");
  // 绘制图表

  RadarChart = echarts.init(RadarChartRef.value, "vintage");

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
        data: data.value,
        //   [
        //   {
        //     value: [4200, 3000, 20000, 35000, 50000, 18000],
        //     name: "Allocated Budget",
        //   },
        //   {
        //     value: [5000, 14000, 28000, 26000, 42000, 21000],
        //     name: "Actual Spending",
        //   },
        // ],
      },
    ],
  });
});

watch(
  () => props,
  (newVal) => {
    // console.log(props.station);

    if (props.station === "station1") {
      data.value = [
        {
          value: [4200, 3000, 20000, 35000, 50000, 18000],
          name: "Allocated Budget",
        },
        {
          value: [5000, 14000, 28000, 26000, 42000, 21000],
          name: "Actual Spending",
        },
      ];
    }
    if (props.station === "station2") {
      data.value = [
        {
          value: [4200, 2300, 20000, 32300, 43000, 12351],
          name: "Allocated Budget",
        },
        {
          value: [5000, 14000, 28000, 26000, 42000, 21000],
          name: "Actual Spending",
        },
      ];
    }
    if (props.station === "station3") {
      data.value = [
        {
          value: [46600, 22200, 20300, 30000, 2351, 1395],
          name: "Allocated Budget",
        },
        {
          value: [5000, 14000, 28000, 26000, 42000, 21000],
          name: "Actual Spending",
        },
      ];
    }
    if (props.station === "station4") {
      data.value = [
        {
          value: [4200, 2300, 20000, 3300, 43000, 12351],
          name: "Allocated Budget",
        },
        {
          value: [5000, 14000, 28000, 26000, 42000, 21000],
          name: "Actual Spending",
        },
      ];
    }

    RadarChart.setOption({
      series: [
        {
          data: data.value,
        },
      ],
    });
  },
  {
    deep: true,
  }
);
</script>
<style lang="scss" scoped>
.echart {
  width: 100%;
  height: 100%;
}
</style>