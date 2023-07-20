<template>
  <div>
    <div ref="LineChartRef" class="echart"></div>
  </div>
</template>
<script setup>
// import { fa } from "element-plus/es/locale";
import { ref, onMounted, inject, watch, defineProps, reactive } from "vue";
const LineChartRef = ref();

const props = defineProps({
  station: { type: String},
  stations: { type: Array},
});

const data = reactive([]);
// 模拟从数据源获取数据的方法

function getDataFromAPI(station) {
  // 这里使用假数据
  const fakeData = [];
  const now = Date.now();
  const oneDay = 24 * 3600 * 1000;
  let value = Math.random() * 1000;

  for (let i = 0; i < 1000; i++) {
    const time = new Date(now + i * oneDay);
    value += Math.random() * 21 - 10;
    fakeData.push({
      name: time.toString(),
      value: [
        [time.getFullYear(), time.getMonth() + 1, time.getDate()].join("/"),
        Math.round(value),
      ],
    });
  }
  return fakeData;
}

let LineChart;

function randomData() {
    // 这是一个示例的随机数据生成函数，根据实际需求进行修改
    const now = new Date();
    const value = Math.random() * 1000;
    return {
      name: now.toString(),
      value: [
        [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/"),
        Math.round(value),
      ],
    };
  }

  function start() {
    setInterval(function () {
      for (var i = 0; i < 5; i++) {
        data.shift();
        data.push(randomData());
      }
      LineChart.setOption({
        series: [
          {
            data: data,
          },
        ],
      });
    }, 1500);
  }

data.splice(0, data.length, ...getDataFromAPI(props.station === props.stations[0]));

onMounted(() => {
  // 注入echarts实例
  const echarts = inject("echarts");
  // 基于准备好的dom，初始化echarts实例
  LineChart = echarts.init(LineChartRef.value, "vintage");
  // 绘制图表
  LineChart.setOption({

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
        data: data, // 使用data.value来表示折线图的数据
      },
    ],
  });

  start();
});


watch(
  () => props,
  (newVal) => {
    // console.log(props.station);
    if (props.station === props.stations[0]) {
      data.splice(0, data.length, ...getDataFromAPI(newVal));
      // console.log(data);
    }
    if (props.station === props.stations[1]) {
      data.splice(0, data.length, ...getDataFromAPI(newVal));
      // console.log(data);
    }
    if (props.station === props.stations[2]) {
      data.splice(0, data.length, ...getDataFromAPI(newVal));
    }
    if (props.station === props.stations[3]) {
      data.splice(0, data.length, ...getDataFromAPI(newVal));
    }

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