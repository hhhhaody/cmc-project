<template>
  <div>
    <div ref="LineChartRef" class="echart"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, watch, defineProps, reactive } from "vue";
import { getEnergyConsumptionRecordsAPI } from "../apis/energyConsumptionRecords";

// 用于获取当前日期和第二天的日期，格式为 "YYYY-MM-DD"，用于 API 请求。
function getTodayDateRange() {
  let today = new Date();
  let tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  return {
    startDate: formatDate(today),
    endDate: formatDate(tomorrow),
  };
}

const LineChartRef = ref();

const props = defineProps({
  station: { type: String },
  stations: { type: Array },
});

const data = reactive([]);
// 模拟从数据源获取数据的方法

async function getDataFromAPI(station) {
  const dateRange = getTodayDateRange();
  try {
    const response = await getEnergyConsumptionRecordsAPI({
      page: 1,
      pageSize: 1000,
      sectionName: station,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });
    if (response.code === 1) {
      return response.data.data.map(record => ({
        name: record.timestamp,
        value: [record.productionDate, record.energyConsumed],
      }));
    } else {
      console.error('Failed to fetch data:', response.msg);
      return [];
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

let LineChart;

onMounted(() => {
  // 注入echarts实例
  const echarts = inject("echarts");
  // 基于准备好的dom，初始化echarts实例
  LineChart = echarts.init(LineChartRef.value, "vintage");

  // 使用立即执行的异步函数来获取初始数据
  (async () => {
    const initialData = await getDataFromAPI(props.station);
    data.splice(0, data.length, ...initialData);

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
  })();
});

watch(
  () => props.station,
  async (newVal) => {
    if (newVal) {
      const newData = await getDataFromAPI(newVal);
      data.splice(0, data.length, ...newData);
      LineChart.setOption({
        series: [{
          data: data
        }]
      });
    }
  },
  {
    immediate: true,
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