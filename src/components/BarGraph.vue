<template>
  <div>
    <div ref="BarChartRef" class="echart" :key="renderKey"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, inject, watch, reactive } from "vue";
import { getProductAmountAPI } from "../apis/data"


const BarChartRef = ref();
//刷新组件数据
const renderKey = ref(0)
const updateGraph = () => {
  renderKey.value = renderKey.value + 1
}

const props = defineProps({
  station: { type: String },
  stations: { type: Array },
});

const x = ref([])
const y = ref([]);

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

const getDataFromAPI = async () => {
  const res = await getProductAmountAPI(props.station);
  console.log(res.data);

  for (const i in res.data) {
    const item = res.data[i]
    x.value.push(item.name)
    y.value.push({ value: item[props.station], spec: item.spec })
    console.log(x.value);
    console.log(y.value)

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

  }

};

getDataFromAPI(props.station)

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
    tooltip: {
      // trigger: "item",
      // axisPointer: {
      //   type: "shadow", // 鼠标悬浮时显示阴影效果
      // },
      formatter(params) { // 自定义提示信息的内容
        // var station = params[0].name; // 获取柱状图对应的站点名称
        // var value = params[0].value; // 获取柱状图的值
        return `规格型号：${params.data.spec} </br> 产量：${params.data.value}`; // 返回自定义的提示信息
        console.log(params);
      },
    },
    xAxis: {
      // indicator: [
      //   { name: "Station 1" },
      //   { name: "Station 2" },
      //   { name: "Station 3" },
      //   { name: "Station 4" },
      //   { name: "Station 5" },
      //   { name: "Station 6" },
      // ],
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
    x.value = []
    y.value = []
    getDataFromAPI(props.station)

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