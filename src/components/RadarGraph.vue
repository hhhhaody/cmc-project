<template>
  <div>
    <div ref="RadarChartRef" class="echart"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, inject, watch, nextTick } from "vue";
const RadarChartRef = ref();

const props = defineProps({
  station: { type: String },
  stations: { type: Array },
});

// console.log(props.station);
// console.log(props.stations[0]);

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
        { name: "上料设备" },
        { name: "成品转移" },
        { name: "桁架下料" },
        { name: "下料设备" },
        { name: "机械臂上料" },
        { name: "激光切割" },
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

    if (props.station === props.stations[0]) {
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
    if (props.station === props.stations[1]) {
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
    if (props.station === props.stations[2]) {
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
    if (props.station === props.stations[3]) {
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