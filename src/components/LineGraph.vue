<template>
  <div>
    <div ref="LineChartRef" class="echart"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, watch, defineProps, reactive } from "vue";
import { getEnergyConsumptionRecordsAPI } from "../apis/energyConsumptionRecords";
import { getEnergyAPI } from "../apis/data"

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

  const res = await getEnergyAPI(props.station, new Date().toISOString().slice(0, 10));
  console.log(res.data);

  for (const i in res.data) {
    const item = res.data[i]
    // console.log(data);
    data.value.push({ name: "功率", value: [item.date + " " + item.time, item.avgPower] })

    console.log(data.value);

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
          params.value[1]
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
    data.value = []
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

</script>
<style lang="scss" scoped>
.echart {
  width: 100%;
  height: 100%;
}
</style>