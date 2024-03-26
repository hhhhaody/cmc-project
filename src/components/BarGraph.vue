<template>
  <div>
    <div ref="BarChartRef" class="echart"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, inject, watch } from "vue";
const BarChartRef = ref();

const props = defineProps({
  station: { type: String },
  stations: { type: Array },
});

const x = ref(["C型钢", "L型钢", "T型钢"])
const y = ref([]);

y.value = [50, 70, 40];

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
      x.value = ["C型钢", "L型钢", "T型钢", "C型钢A", "T型钢A", "L型钢A", "C型钢B", "T型钢B"]
      y.value = [50, 70, 40, 30, 55, 80, 50, 69]
      // [
      //   {
      //     value:,
      //     name: "产品生产情况",
      //   },
      // ];
    }
    if (props.station === props.stations[1]) {
      x.value = ["网片A", "网片B", "网片C", "网片D", "网片e", "网片f", "网片h", "网片g", "网片i"]
      y.value = [2, 7, 4, 2, 3, 2, 4, 5, 1]
      // [
      //   {
      //     value: ,
      //     name: "产品生产情况",
      //   },
      // ];
    }
    if (props.station === props.stations[2]) {
      x.value = ["方通柱"]
      y.value = [80]
      //   data.value[0].value = [46, 22, 20, 30, 23, 13]
      //   [
      //     {
      //       value: ,
      //       name: "产品生产情况",
      //     },
      //   ];
    }
    if (props.station === props.stations[3]) {
      x.value = ["模块A", "模块B"]
      y.value = [2, 1]
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