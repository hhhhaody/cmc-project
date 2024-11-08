<template>
  <div>
    <div ref="RadarChartRef" class="echart"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, inject, watch, nextTick, onUnmounted } from "vue";
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

  indicator.value = []
  indicators.value = []
  theoretical.value = []
  real.value = []





  //TODO: 2.0端口未联通 为了不提示连接失败，redirect到地面钢网
  let res
  //cmc2.0展示数据

  if (props.station === '总装工作站' || props.station === '墙板生产线') {
    res = await getTimesAPI('地面钢网工作站');
  }
  else {
    res = await getTimesAPI(props.station);
  }



  // console.log(res.data);

  //如无数据，则重置图表
  // 如果无数据，为了展示用途，使用已有数据

  if (!res.data[0] || !res.data[1]) {

    if (props.station === '总装工作站') {
      // console.log("zongzhuang");
      //理论用时
      res.data[1] = {
        stationInfo: '装夹工位:49,双边双出左工位:44,桁架焊接工位:22,双边双出右工位:44'
      }
      //实际用时
      res.data[0] = {
        stationInfo: '装夹工位:48,双边双出左工位:40,桁架焊接工位:20,双边双出右工位:0'
      }
    }
    else if (props.station === '墙板生产线') {
      // console.log("qiangban");
      res.data[1] = {
        stationInfo: '钢结构组拼焊接工位:12,钢筋组装焊接工位:12,墙板翻转工位1:8,钢结构反面焊接工位:10,' +
          '水泥板铺装工位1:10,水泥板打钉工位1:10,水泥板人工补钉工位:8,墙板翻转机工位2:8,水泥板铺装工位2: 10, ' +
          '水泥板打钉工位2:12,自动尺寸检测工位:8,墙板补钉及吊装下料工位:8,水泥板自动切割工位:12'
      }
      res.data[0] = {
        stationInfo: '钢结构组拼焊接工位:12,钢筋组装焊接工位:12,墙板翻转工位1:6,钢结构反面焊接工位:9,' +
          '水泥板铺装工位1:8,水泥板打钉工位1:10,水泥板人工补钉工位:7,墙板翻转机工位2:8,水泥板铺装工位2: 9, ' +
          '水泥板打钉工位2:12,自动尺寸检测工位:8,墙板补钉及吊装下料工位:6,水泥板自动切割工位:12'
      }
    }
    else if (props.station === '型钢切割工作站') {
      // console.log("qiangban");
      res.data[1] = {
        stationInfo: '桁架上下料工位:80,翻转工位:20,激光切割工位:60,机器人下料工位:20'
      }
      res.data[0] = {
        stationInfo: '桁架上下料工位:78,翻转工位:19,激光切割工位:60,机器人下料工位:1'
      }
    }
    else if (props.station === '地面钢网工作站') {
      // console.log("qiangban");
      res.data[1] = {
        stationInfo: '桁架上下料工位:12,机器人焊接工位:10'
      }
      res.data[0] = {
        stationInfo: '桁架上下料工位:10,机器人焊接工位:10'
      }
    }
    else if (props.station === '方通组焊工作站') {
      // console.log("qiangban");
      res.data[1] = {
        stationInfo: '桁架上下料工位:80,链轮车料架工位:20,柱头焊接工位:65,柱脚焊接工位:65,' +
          '总装工位:100,搬运机器人工位:30'
      }
      res.data[0] = {
        stationInfo: '桁架上下料工位:80,链轮车料架工位:19,柱头焊接工位:63,柱脚焊接工位:59,' +
          '总装工位:96,搬运机器人工位:28'
      }
    }
    else if (props.station === '模块总装工作站') {
      // console.log("qiangban");
      res.data[1] = {
        stationInfo: '移动模台工位:30,装夹工位:60,桁架焊接工位:80'
      }
      res.data[0] = {
        stationInfo: '移动模台工位:27,装夹工位:58,桁架焊接工位:69'
      }
    }
    else {
      //重置
      RadarChart.setOption({
        legend: {
          data: ["实际用时", "理论用时"],
          bottom: 10,
          textStyle: {
            color: '#ffffff',
            fontWeight: 'lighter',
          },
        },
        radar: {
          indicator: [], // 重置指标
          center: ["50%", "50%"],
          radius: "60%",
        },
        series: [
          {
            type: "radar",
            data: [], // 清空数据
          },
        ],
      });
      return
    }
  }


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
  // console.log(real)


  // console.log(indicator.value);
  // console.log(indicators.value);
  // console.log(real.value);
  // console.log(theoretical.value);



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

getDataFromAPI()

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
    getDataFromAPI()


  },
  {
    deep: true,
  }
);

//定时获取最新数据
let id

function start() {
  id = setInterval(function () {
    console.log("获取耗时数据");
    getDataFromAPI()
  }, 10000);
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