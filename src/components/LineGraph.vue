<template>
  <div>
    <div ref="LineChartRef" class="echart" :style="{ width, height }"></div>
  </div>
</template>
<script setup>
// import { fa } from "element-plus/es/locale";
import * as echarts from 'echarts';
import { ref, onMounted, inject, watch, defineProps, reactive, toRefs } from "vue";
import { getEnergyConsumptionRecordsAPI } from "../apis/energyConsumptionRecords";
const LineChartRef = ref();

const props = defineProps({
  station: { type: String },
  stations: { type: Array },
  width: { type: String, default: "100%" }, // 接收宽度的prop，默认为100%
  height: { type: String, default: "100%" }, // 接收高度的prop，默认为100%

  customStyle: {
    type: Object,
    default: () => ({})
  }
});

const { width, height } = toRefs(props);

const data = reactive([]);
// 模拟从数据源获取数据的方法

function getRealDataFromAPI(station) {
  getEnergyConsumptionRecordsAPI({
    page: 1,
    pageSize: 1000, // 我们希望获取尽可能多的数据
    sectionName: station
  }).then((response) => {
    if (response && response.data && Array.isArray(response.data.data)) {
      const apiData = response.data.data;
      data.splice(
        0,
        data.length,
        ...apiData.map((record) => ({
          name: record.productionDate,
          value: [
            record.productionDate,
            record.energyConsumed
          ]
        }))
      );

      updateChartOptions();

      // 移动此代码块到这里
      LineChart.setOption({
        series: [{
          data: data
        }]
      });
    }
  });
}

let LineChart;


const defaultOptions = {
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
      data: data
    }
  ]
};

function updateChartOptions() {
  const chartOptions = {
    ...defaultOptions,
    ...props.customStyle,
    series: [{ ...defaultOptions.series[0], data: data }]
  };
  LineChart.setOption(chartOptions);
}

onMounted(() => {
  // 注入echarts实例
  const echarts = inject("echarts");

  // 基于准备好的dom，初始化echarts实例
  LineChart = echarts.init(LineChartRef.value, "vintage");

  const chartOptions = {
    ...defaultOptions,
    ...props.customStyle  // 这里合并了默认配置和传递进来的配置
  };

  getRealDataFromAPI(props.station);
});

watch(
  () => props.station,
  (newVal) => {
    getRealDataFromAPI(newVal);
  }
);

</script>
<style lang="scss" scoped>
.echart {
  width: 100%;
  height: 100%;
}
</style>