<template>
  <div>
    <div ref="RadarChartRef" class="echart"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, inject, watch, nextTick } from "vue";
import { getTimesAPI } from "../apis/data"

const RadarChartRef = ref();

const props = defineProps({
  station: { type: String },
  stations: { type: Array },
});


const data = ref([]);
const indicator = ref([])
const indicators = ref([])
const theoretical = ref([])
const real = ref([])


const getDataFromAPI = async () => {
  const res = await getTimesAPI(props.station);
  // console.log(res.data);
  const theo = res.data[1].stationInfo.split(',')
  const actual = res.data[0].stationInfo.split(',')

  if (props.station === '地面钢网工作站') {
    indicator.value.push({ name: '待定工位' })
    indicators.value.push('待定工位')
    theoretical.value.push(1)
  }
  for (const i in theo) {
    // console.log(theo[i]);
    indicator.value.push({ name: theo[i].split(':')[0] })
    indicators.value.push(theo[i].split(':')[0])
    theoretical.value.push(theo[i].split(':')[1])
  }
  // console.log(indicator.value);
  real.value = Array(indicators.value.length)
  if (props.station === '地面钢网工作站') {
    real.value[0] = 1

  }
  for (const i in actual) {
    const index = indicators.value.indexOf(actual[i].split(':')[0])
    real.value[index] = actual[i].split(':')[1]
  }
  // console.log(real);




  data.value = [
    {
      value: real.value,
      name: "实际用时",
      areaStyle: {
        color: {
          type: 'radial',
          x: 0.5,
          y: 0.5,
          r: 0.7,
          colorStops: [
            { offset: 0, color: '#00000000' },  // 0% 处的颜色
            { offset: 1, color: '#3ea4ff' }   // 100% 处的颜色
          ],
          global: false // 缺省为 false
        },
        opacity: 0.8
      }
    },
    {
      value: theoretical.value,
      name: "理论用时",
      areaStyle: {
        color: {
          type: 'radial',
          x: 0.5,
          y: 0.5,
          r: 0.7,
          colorStops: [
            { offset: 0, color: '#00000000' },  // 0% 处的颜色
            { offset: 1, color: '#80abd5' }   // 100% 处的颜色
          ],
          global: false // 缺省为 false
        },
        opacity: 0.8
      }
    },
  ];

  // console.log(data.value);


  RadarChart.setOption({
    legend: {
      data: ["实际用时", "理论用时"],
      bottom: 10,
      textStyle: {
        color: '#ffffff',
        fontWeight: 'lighter'
      }
    },
    radar: {

      indicator: indicator.value,
    },
    series: [
      {
        data: data.value,
      },
    ],
  });

};

getDataFromAPI(props.station)

// console.log(indicator.value);

// const echarts = inject("echarts");
// 基于准备好的dom，初始化echarts实例
let RadarChart;
const showToolTip = ref(false)
const index = ref()

onMounted(() => {
  // // 注入echarts实例
  const echarts = inject("echarts");
  // // 基于准备好的dom，初始化echarts实例
  // const RadarChart = echarts.init(RadarChartRef.value, "vintage");
  // 绘制图表

  RadarChart = echarts.init(RadarChartRef.value, "vintage");
  RadarChart.on('mouseover', (params) => {
    if (params.event.target.shape.symbolType == 'circle') {
      if (params.data.value[0] === 1 && params.event.topTarget.__dimIdx === 0) {
        // console.log(params);
        showToolTip.value = false
      }
      else {
        showToolTip.value = true
        index.value = params.event.topTarget.__dimIdx
      }
    }
    else {
      showToolTip.value = false
    }
    // console.log(showToolTip.value)
  })


  RadarChart.setOption({
    // title: {
    //   text: "Radar Chart",
    // },

    tooltip: {
      // trigger: "item",
      show: false,
      // axisPointer: {
      //   type: "shadow", // 鼠标悬浮时显示阴影效果
      // },
      formatter(params) { // 自定义提示信息的内容
        // var station = params[0].name; // 获取柱状图对应的站点名称
        // var value = params[0].value; // 获取柱状图的值
        // return `规格型号：${params.data.name} </br> 产量：${params.data.value}`; // 返回自定义的提示信息

        // console.log(index.value);
      },
    },
    // grid: {
    //   bottom: "15%",
    // },
    radar: {
      // shape: "circle",
      // indicator: indicator.value,
      center: ["50%", "50%"],
      radius: "60%",
      // triggerEvent: true,
    },
    series: [
      {
        // name: "Budget vs spending",
        type: "radar",
        data: data.value,
      },
    ],
  });
});
watch(showToolTip, (newValue) => {
  RadarChart.setOption({
    tooltip: {
      show: newValue,
    }
  });
});
watch(index, (newValue) => {
  RadarChart.setOption({
    tooltip: {
      show: true,
      formatter(params) {
        if (real.value.at(newValue)) {
          return `实际用时：${real.value.at(newValue)} </br> 理论用时：${theoretical.value.at(newValue)}`
        } else {
          return `理论用时：${theoretical.value.at(newValue)}`
        }
      }
    }
  });
});

watch(
  () => props,
  (newVal) => {
    // console.log(props.station);
    indicator.value = []
    indicators.value = []
    theoretical.value = []
    real.value = []
    getDataFromAPI(props.station)


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