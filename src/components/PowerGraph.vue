<template>
    <div>
        <div ref="PowerLineChartRef" class="echart" :style="{ width, height }"></div>
    </div>
</template>
  
<script setup>
import * as echarts from 'echarts';
import { ref, onMounted, inject, watch, defineProps, reactive, toRefs } from "vue";
import { getEnergyConsumptionRecordsAPI } from "../apis/energyConsumptionRecords";
const PowerLineChartRef = ref();

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

const powerData = reactive([]);

function getPowerDataFromAPI(station) {
    getEnergyConsumptionRecordsAPI({
        page: 1,
        pageSize: 1000,
        sectionName: station
    }).then((response) => {
        if (response && response.data && Array.isArray(response.data.data)) {
            const apiData = response.data.data;
            powerData.splice(
                0,
                powerData.length,
                ...apiData.map((record) => ({
                    name: record.productionDate,
                    value: [
                        record.productionDate,
                        record.power
                    ]
                }))
            );

            updateChartOptions();

            PowerLineChart.setOption({
                series: [{
                    data: powerData
                }]
            });
        }
    });
}

let PowerLineChart;

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
            name: "Power Data",
            type: "line",
            showSymbol: false,
            data: powerData,
        },
    ],

}

function updateChartOptions() {
    const chartOptions = {
        ...defaultOptions,
        ...props.customStyle,
        series: [{ ...defaultOptions.series[0], data: powerData }]
    };
    PowerLineChart.setOption(chartOptions);
}

onMounted(() => {
    const echarts = inject("echarts");
    PowerLineChart = echarts.init(PowerLineChartRef.value, "vintage");

    const chartOptions = {
        ...defaultOptions,
        ...props.customStyle  // 这里合并了默认配置和传递进来的配置
    };

    getPowerDataFromAPI(props.station);
});

watch(
    () => props.station,
    (newVal) => {
        getPowerDataFromAPI(newVal);
    }
);
</script>
  
<style lang="scss" scoped>
.echart {
    width: 100%;
    height: 100%;
}
</style>
  