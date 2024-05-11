<template>
  <div>
    <div ref="LineChartRef" class="echart"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, watch, defineProps, reactive, onUnmounted } from "vue";
import { getEnergyConsumptionRecordsAPI } from "../apis/energyConsumptionRecords";
import { getEnergyAPI } from "../apis/data"
import 'echarts/lib/component/dataZoom';


// 用于获取当前日期和第二天的日期，格式为 "YYYY-MM-DD"，用于 API 请求。
// function getTodayDateRange() {
//   let today = new Date();
//   let tomorrow = new Date(today);
//   tomorrow.setDate(tomorrow.getDate() + 1);

//   const formatDate = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

//   return {
//     startDate: formatDate(today),
//     endDate: formatDate(tomorrow),
//   };
// }

const LineChartRef = ref();

const props = defineProps({
  station: { type: String },
  stations: { type: Array },
});

const data = ref([]);
// 模拟从数据源获取数据的方法

// async function getDataFromAPI(station) {
//   const dateRange = getTodayDateRange();
//   try {
//     const response = await getEnergyConsumptionRecordsAPI({
//       page: 1,
//       pageSize: 1000,
//       sectionName: station,
//       startDate: dateRange.startDate,
//       endDate: dateRange.endDate,
//     });
//     if (response.code === 1) {
//       return response.data.data.map(record => ({
//         name: record.timestamp,
//         value: [record.productionDate, record.energyConsumed],
//       }));
//     } else {
//       console.error('Failed to fetch data:', response.msg);
//       return [];
//     }
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     return [];
//   }
// }

const getDataFromAPI = async () => {
  data.value = []


  const res = await getEnergyAPI(props.station, new Date().toISOString().slice(0, 10));
  // console.log(res.data);

  for (const i in res.data) {
    const item = res.data[i]
    // console.log(data);
    data.value.push({ name: "功率", value: [item.date + " " + item.time, item.avgPower] })

    // console.log(data.value);

  }
  LineChart.setOption({
    series: [
      {
        data: data.value,
      },
    ],
  });

};

getDataFromAPI(props.station)


let LineChart;

onMounted(() => {
  // 注入echarts实例
  const echarts = inject("echarts");
  // 基于准备好的dom，初始化echarts实例
  LineChart = echarts.init(LineChartRef.value, "vintage");

  LineChart.setOption({
    dataZoom: [
      {
        type: 'inside', // 内置型 dataZoom 组件，支持缩放和拖拽
        start: 0, // 默认起始位置为 0%
        end: 100, // 默认结束位置为 100%
      }
    ],
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        params = params[0];
        let date = new Date(params.value[0]);
        let hours = ("0" + date.getHours()).slice(-2); // 保证小时数为两位数
        let minutes = ("0" + date.getMinutes()).slice(-2); // 保证分钟数为两位数
        return (
          hours +
          ":" +
          minutes +
          " 功率: " +
          params.value[1] +
          "W"
        );
      },
    },
    xAxis: {
      type: "time",
      splitLine: {
        show: false,
      },
      formatter: '{HH}:{mm}'
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
        name: "功率",
        type: "line",
        showSymbol: true,
        data: data.value,
      },
    ],
  });

});

watch(
  () => props,
  (newVal) => {
    // console.log(props.station);
    getDataFromAPI(props.station)

    LineChart.setOption({
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

//定时获取最新数据
let id

function start() {
  id = setInterval(function () {
    console.log("获取能耗数据");
    getDataFromAPI()
  }, 60000);
}
setTimeout(start, 1000);

onUnmounted(() => {
  clearInterval(id);
});

</script>
<style lang="scss" scoped>
.echart {
  width: 100%;
  height: 100%;
}
</style>