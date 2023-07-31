<template>
  <div>
    <div ref="BarChartRef" class="echart"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, inject, watch } from "vue";
const BarChartRef = ref();

const props = defineProps({
  station: { type: String},
  stations: { type: Array},
});

const x = ref(["方通柱", "地面钢网","方通柱", "地面钢网","方通柱"])
const y = ref([]);

y.value = [5, 20, 36, 10, 10];

//   // console.log(props.station),
//   {
//     value:,
//     name: "销量",
//   },
//   {
//     value:[50, 25, 40, 15, 18, 28],
//     name: "销量",
//   },
// ];

// console.log(data.value[1]);

let BarChart;

onMounted(() => {
  // 注入echarts实例
  const echarts = inject("echarts");
  // 基于准备好的dom，初始化echarts实例
  BarChart = echarts.init(BarChartRef.value, "vintage");
  // 绘制图表
  BarChart.setOption({
    // title: {
    //   text: "Bar Chart",
    // },
    tooltip: {},
    xAxis: {
      indicator: [
        { name: "Station 1" },
        { name: "Station 2" },
        { name: "Station 3" },
        { name: "Station 4" },
        { name: "Station 5" },
        { name: "Station 6" },
      ],
      data: x.value,
    },
    yAxis: {},
    // grid: {
    //   bottom: "15%",
    // },
    series: [
      {
        type: "bar",
        data: y.value,
        // name: "销量",
        // data: [5, 20, 80, 10, 10, 20],
        // data2: [5, 20, 20, 10, 80, 20],
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
// console.log(props.station);
watch(
  () => props,
  (newVal) => {
    // console.log(props.station);
    if (props.station === props.stations[0]) {
      x.value = ["方通柱A", "地面钢网A","方通柱B", "地面钢网B","方通柱C"]
      y.value = [5, 20, 36, 10, 10]
      // [
      //   {
      //     value:,
      //     name: "产品生产情况",
      //   },
      // ];
    }
    if (props.station === props.stations[1]) {
      x.value = ["方通柱A", "地面钢网B"]
      y.value = [42, 23]
      // [
      //   {
      //     value: ,
      //     name: "产品生产情况",
      //   },
      // ];
    }
    if (props.station === props.stations[2]) {
      x.value = ["方通柱A", "地面钢网A","方通柱B"]
      y.value = [46, 22, 20]
    //   data.value[0].value = [46, 22, 20, 30, 23, 13]
    //   [
    //     {
    //       value: ,
    //       name: "产品生产情况",
    //     },
    //   ];
    }
    if (props.station === props.stations[3]) {
      x.value = ["方通柱A", "地面钢网A","方通柱B", "地面钢网B"]
      y.value = [50, 14, 28, 26]
    //   data.value[0].value = [
    //     {
    //       value: [50, 14, 28, 26, 42, 21],
    //       name: "产品生产情况",
    //     },
    //   ];
    }

    BarChart.setOption({
      xAxis: {
        data: x.value,
      },
      series: [
        {
          data: y.value,
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